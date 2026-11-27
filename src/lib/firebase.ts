import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer,
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  orderBy, 
  where,
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfigFile from '../../firebase-applet-config.json';
import { 
  VendorApplicationRecord, 
  VendorTrackerRecord,
  PaymentStatus,
  AttendeeRsvpRecord, 
  FestivalConfigData, 
  EmailTemplateData, 
  SmtpConfigData,
  OutboundEmailLog,
  PaymentConfig,
  Invoice,
  InvoiceStatus,
  InvoicePaymentSubmission
} from '../types';
import { EVENT_CONFIG } from '../data/festivalData';
import { DEFAULT_EMAIL_TEMPLATES } from '../data/defaultEmailTemplates';

export const DEFAULT_ETRANSFER_EMAIL = 'festvendorstate@gmail.com';
export const DEFAULT_ETRANSFER_INSTRUCTIONS = `Payments for booth reservations are processed through E-Transfer.

Please send your E-Transfer payment to:

festvendorstate@gmail.com

After completing your payment, kindly send us the answer to your security question (or confirmation details if no security question is required) so we can verify your payment and confirm your booth reservation.

Thank you, and we look forward to having you at the event.`;

export async function hashEmailForTracker(email: string): Promise<string> {
  const normalized = (email || '').trim().toLowerCase();
  if (!normalized) return '0'.repeat(64);
  try {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const encoder = new TextEncoder();
      const buf = await window.crypto.subtle.digest('SHA-256', encoder.encode(normalized));
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {}
  // Deterministic 64-hex fallback hash when WebCrypto subtle is unavailable
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ ch, 0x85ebca6b) >>> 0;
  }
  return (
    h1.toString(16).padStart(8, '0') +
    h2.toString(16).padStart(8, '0') +
    normalized.length.toString(16).padStart(8, '0') +
    'f3571a1e'
  ).padEnd(64, 'a');
}

// -------------------------------------------------------------
// 0. DEEP DATA SANITIZER (Removes undefined fields for Firestore)
// -------------------------------------------------------------
export function cleanFirestoreData<T>(data: T): T {
  if (data === undefined) {
    return undefined as unknown as T;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .map(item => cleanFirestoreData(item))
      .filter(item => item !== undefined) as unknown as T;
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      const cleanedVal = cleanFirestoreData(value);
      if (cleanedVal !== undefined) {
        cleaned[key] = cleanedVal;
      }
    }
  }
  return cleaned as T;
}

// -------------------------------------------------------------
// 1. INITIALIZE FIREBASE (Resilient across AI Studio, Vercel & GitHub)
// -------------------------------------------------------------
const resolvedConfig = {
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || firebaseConfigFile.apiKey,
  authDomain: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) || firebaseConfigFile.authDomain,
  projectId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) || firebaseConfigFile.projectId,
  storageBucket: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) || firebaseConfigFile.storageBucket,
  messagingSenderId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || firebaseConfigFile.messagingSenderId,
  appId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) || firebaseConfigFile.appId,
  firestoreDatabaseId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_DATABASE_ID) || firebaseConfigFile.firestoreDatabaseId
};

export const app = getApps().length === 0 ? initializeApp(resolvedConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, resolvedConfig.firestoreDatabaseId);

// Ensure local browser caches from any previous Firebase database are cleared automatically when connecting to a new database
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  try {
    const activeDbKey = 'festival_active_firestore_db_id';
    const prevDbId = localStorage.getItem(activeDbKey);
    if (prevDbId !== resolvedConfig.firestoreDatabaseId) {
      localStorage.removeItem('columbia_vendor_apps_cache');
      localStorage.removeItem('columbia_invoices_cache');
      localStorage.removeItem('columbia_event_locations_cache_v6_100events');
      localStorage.removeItem('columbia_deleted_location_ids_v1');
      localStorage.removeItem('columbia_custom_cities_cache_v1');
      localStorage.setItem(activeDbKey, resolvedConfig.firestoreDatabaseId);
    }
  } catch {}
}

export const googleProvider = new GoogleAuthProvider();

// 2. Error Handler Schema according to Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 3. Test Connection
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    return false;
  }
}
void testConnection();

// 4. Vendor Applications & Public Tracker API
export async function createVendorApplication(data: Omit<VendorApplicationRecord, 'id' | 'createdAt' | 'status'> & { id?: string }): Promise<string> {
  const applicationId = data.id || `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const path = `vendor_applications/${applicationId}`;
  const now = new Date().toISOString();
  
  const payload: VendorApplicationRecord = {
    ...data,
    id: applicationId,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    paymentStatus: 'unpaid'
  };

  const cleaned = cleanFirestoreData(payload);
  const emailHash = await hashEmailForTracker(data.email);
  const trackerPayload: VendorTrackerRecord = cleanFirestoreData({
    id: applicationId,
    businessName: data.businessName,
    vendorKind: data.vendorKind || 'Certified Farmer',
    category: data.category,
    selectedBoothId: data.selectedBoothId,
    selectedDays: data.selectedDays,
    totalCalculatedFee: Number(data.totalCalculatedFee || 0),
    boothZoneAssignment: data.boothZoneAssignment || '',
    status: 'pending',
    paymentStatus: 'unpaid',
    emailHash,
    createdAt: now,
    updatedAt: now
  });

  try {
    await setDoc(doc(db, 'vendor_applications', applicationId), cleaned);
    try {
      await setDoc(doc(db, 'vendor_tracker', applicationId), trackerPayload);
    } catch (trackerErr) {
      console.warn('Vendor tracker sync note:', trackerErr);
    }
    try {
      const existingStr = localStorage.getItem('columbia_vendor_apps_cache');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [cleaned, ...existing.filter((a: any) => a.id !== applicationId)];
      localStorage.setItem('columbia_vendor_apps_cache', JSON.stringify(updated));

      const trackerStr = localStorage.getItem('columbia_vendor_tracker_cache');
      const trackerList = trackerStr ? JSON.parse(trackerStr) : [];
      const updatedTrackers = [trackerPayload, ...trackerList.filter((t: any) => t.id !== applicationId)];
      localStorage.setItem('columbia_vendor_tracker_cache', JSON.stringify(updatedTrackers));
    } catch {}
    return applicationId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeVendorApplications(callback: (apps: VendorApplicationRecord[]) => void) {
  // Read cache first for instant UI response
  try {
    const cachedStr = localStorage.getItem('columbia_vendor_apps_cache');
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        callback(parsed);
      }
    }
  } catch {}

  const q = query(collection(db, 'vendor_applications'), orderBy('createdAt', 'desc'));

  getDocs(q).then((snap) => {
    if (!snap.empty) {
      const list: VendorApplicationRecord[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<VendorApplicationRecord, 'id'>) }));
      localStorage.setItem('columbia_vendor_apps_cache', JSON.stringify(list));
      callback(list);
    }
  }).catch((err) => {
    console.warn('Initial vendor applications fetch note:', err);
  });

  return onSnapshot(
    q,
    (snapshot) => {
      const list: VendorApplicationRecord[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<VendorApplicationRecord, 'id'>) });
      });
      try {
        localStorage.setItem('columbia_vendor_apps_cache', JSON.stringify(list));
      } catch {}
      callback(list);
    },
    (error) => {
      console.warn('Snapshot error for vendor_applications:', error);
      try {
        const cachedStr = localStorage.getItem('columbia_vendor_apps_cache');
        if (cachedStr) {
          callback(JSON.parse(cachedStr));
        }
      } catch {}
    }
  );
}

export function subscribeVendorTrackers(callback: (trackers: VendorTrackerRecord[]) => void) {
  try {
    const cachedStr = localStorage.getItem('columbia_vendor_tracker_cache');
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr);
      if (Array.isArray(parsed)) callback(parsed);
    }
  } catch {}

  const q = query(collection(db, 'vendor_tracker'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: VendorTrackerRecord[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<VendorTrackerRecord, 'id'>) });
      });
      try {
        localStorage.setItem('columbia_vendor_tracker_cache', JSON.stringify(list));
      } catch {}
      callback(list);
    },
    (error) => {
      console.warn('Snapshot note for vendor_tracker:', error);
    }
  );
}

export async function updateVendorApplicationStatus(
  id: string, 
  updates: Partial<VendorApplicationRecord>
): Promise<void> {
  const path = `vendor_applications/${id}`;
  const now = new Date().toISOString();
  const cleaned = cleanFirestoreData({
    ...updates,
    updatedAt: now
  });

  try {
    await updateDoc(doc(db, 'vendor_applications', id), cleaned);

    // Mirror status / paymentStatus / zone / E-Transfer fields into vendor_tracker/{id}
    try {
      const trackerRef = doc(db, 'vendor_tracker', id);
      const trackerSnap = await getDoc(trackerRef);
      if (trackerSnap.exists()) {
        const trackerPatch: Record<string, any> = { updatedAt: now };
        if (updates.status !== undefined) trackerPatch.status = updates.status;
        if (updates.paymentStatus !== undefined) trackerPatch.paymentStatus = updates.paymentStatus;
        if (updates.boothZoneAssignment !== undefined) trackerPatch.boothZoneAssignment = updates.boothZoneAssignment;
        if (updates.totalCalculatedFee !== undefined) trackerPatch.totalCalculatedFee = updates.totalCalculatedFee;
        if (updates.eTransferSecurityAnswer !== undefined) trackerPatch.eTransferSecurityAnswer = updates.eTransferSecurityAnswer;
        if (updates.eTransferPayerEmail !== undefined) trackerPatch.eTransferPayerEmail = updates.eTransferPayerEmail;
        if (updates.eTransferSubmittedAt !== undefined) trackerPatch.eTransferSubmittedAt = updates.eTransferSubmittedAt;
        await updateDoc(trackerRef, cleanFirestoreData(trackerPatch));
      } else {
        const appSnap = await getDoc(doc(db, 'vendor_applications', id));
        if (appSnap.exists()) {
          const appData = appSnap.data() as VendorApplicationRecord;
          const emailHash = await hashEmailForTracker(appData.email || '');
          const fullTracker: VendorTrackerRecord = cleanFirestoreData({
            id,
            businessName: appData.businessName || 'Vendor',
            vendorKind: appData.vendorKind || 'Certified Farmer',
            category: appData.category || 'Marketplace',
            selectedBoothId: appData.selectedBoothId || 'tent-10x10',
            selectedDays: appData.selectedDays || ['fri', 'sat', 'sun'],
            totalCalculatedFee: Number(updates.totalCalculatedFee ?? appData.totalCalculatedFee ?? 0),
            boothZoneAssignment: updates.boothZoneAssignment ?? appData.boothZoneAssignment ?? '',
            status: updates.status ?? appData.status ?? 'pending',
            paymentStatus: (updates.paymentStatus ?? appData.paymentStatus ?? 'unpaid') as PaymentStatus,
            emailHash,
            eTransferSecurityAnswer: updates.eTransferSecurityAnswer ?? appData.eTransferSecurityAnswer,
            eTransferPayerEmail: updates.eTransferPayerEmail ?? appData.eTransferPayerEmail,
            eTransferSubmittedAt: updates.eTransferSubmittedAt ?? appData.eTransferSubmittedAt,
            createdAt: appData.createdAt || now,
            updatedAt: now
          });
          await setDoc(trackerRef, fullTracker);
        }
      }
    } catch (trackerSyncErr) {
      console.warn('Could not sync vendor_tracker update:', trackerSyncErr);
    }

    try {
      const cachedStr = localStorage.getItem('columbia_vendor_apps_cache');
      if (cachedStr) {
        const parsed = JSON.parse(cachedStr);
        const updated = parsed.map((a: any) => a.id === id ? { ...a, ...cleaned } : a);
        localStorage.setItem('columbia_vendor_apps_cache', JSON.stringify(updated));
      }

      const trackerCacheStr = localStorage.getItem('columbia_vendor_tracker_cache');
      if (trackerCacheStr) {
        const parsedTrackers = JSON.parse(trackerCacheStr);
        const updatedTrackers = parsedTrackers.map((t: any) => t.id === id ? { ...t, ...cleaned } : t);
        localStorage.setItem('columbia_vendor_tracker_cache', JSON.stringify(updatedTrackers));
      }
    } catch {}
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function lookupVendorTrackers(searchInput: string): Promise<VendorTrackerRecord[]> {
  const clean = (searchInput || '').trim();
  if (!clean) return [];

  const resultsMap = new Map<string, VendorTrackerRecord>();

  if (clean.includes('@')) {
    const emailHash = await hashEmailForTracker(clean);
    try {
      const q = query(
        collection(db, 'vendor_tracker'),
        where('emailHash', '==', emailHash),
        limit(5)
      );
      const snap = await getDocs(q);
      snap.forEach((d) => {
        resultsMap.set(d.id, { id: d.id, ...(d.data() as Omit<VendorTrackerRecord, 'id'>) });
      });
    } catch (err) {
      console.warn('Email tracker query note:', err);
    }

    // Fallback check against local cache
    try {
      const trackerCacheStr = localStorage.getItem('columbia_vendor_tracker_cache');
      if (trackerCacheStr) {
        const parsed: VendorTrackerRecord[] = JSON.parse(trackerCacheStr);
        parsed.filter((t) => t.emailHash === emailHash).forEach((t) => {
          if (!resultsMap.has(t.id)) resultsMap.set(t.id, t);
        });
      }
      const appsCacheStr = localStorage.getItem('columbia_vendor_apps_cache');
      if (appsCacheStr) {
        const apps: VendorApplicationRecord[] = JSON.parse(appsCacheStr);
        apps
          .filter((a) => (a.email || '').trim().toLowerCase() === clean.toLowerCase())
          .forEach((a) => {
            if (!resultsMap.has(a.id)) {
              resultsMap.set(a.id, {
                id: a.id,
                businessName: a.businessName,
                vendorKind: a.vendorKind,
                category: a.category,
                selectedBoothId: a.selectedBoothId,
                selectedDays: a.selectedDays,
                totalCalculatedFee: a.totalCalculatedFee,
                boothZoneAssignment: a.boothZoneAssignment,
                status: a.status,
                paymentStatus: (a.paymentStatus || 'unpaid') as PaymentStatus,
                emailHash,
                eTransferSecurityAnswer: a.eTransferSecurityAnswer,
                eTransferPayerEmail: a.eTransferPayerEmail,
                eTransferSubmittedAt: a.eTransferSubmittedAt,
                createdAt: a.createdAt,
                updatedAt: a.updatedAt
              });
            }
          });
      }
    } catch {}
  } else {
    const normalizedId = clean.replace(/^#/, '');
    const idCandidates = Array.from(
      new Set([normalizedId, normalizedId.toUpperCase(), normalizedId.toLowerCase()])
    );

    for (const candidate of idCandidates) {
      try {
        const snap = await getDoc(doc(db, 'vendor_tracker', candidate));
        if (snap.exists()) {
          resultsMap.set(snap.id, { id: snap.id, ...(snap.data() as Omit<VendorTrackerRecord, 'id'>) });
        }
      } catch (err) {
        console.warn('Direct tracker lookup note:', err);
      }
    }

    // Fallback check against local cache
    try {
      const lower = normalizedId.toLowerCase();
      const trackerCacheStr = localStorage.getItem('columbia_vendor_tracker_cache');
      if (trackerCacheStr) {
        const parsed: VendorTrackerRecord[] = JSON.parse(trackerCacheStr);
        parsed.filter((t) => t.id.toLowerCase() === lower).forEach((t) => {
          if (!resultsMap.has(t.id)) resultsMap.set(t.id, t);
        });
      }
      const appsCacheStr = localStorage.getItem('columbia_vendor_apps_cache');
      if (appsCacheStr) {
        const apps: VendorApplicationRecord[] = JSON.parse(appsCacheStr);
        apps.filter((a) => a.id.toLowerCase() === lower).forEach(async (a) => {
          if (!resultsMap.has(a.id)) {
            resultsMap.set(a.id, {
              id: a.id,
              businessName: a.businessName,
              vendorKind: a.vendorKind,
              category: a.category,
              selectedBoothId: a.selectedBoothId,
              selectedDays: a.selectedDays,
              totalCalculatedFee: a.totalCalculatedFee,
              boothZoneAssignment: a.boothZoneAssignment,
              status: a.status,
              paymentStatus: (a.paymentStatus || 'unpaid') as PaymentStatus,
              emailHash: '0'.repeat(64),
              eTransferSecurityAnswer: a.eTransferSecurityAnswer,
              eTransferPayerEmail: a.eTransferPayerEmail,
              eTransferSubmittedAt: a.eTransferSubmittedAt,
              createdAt: a.createdAt,
              updatedAt: a.updatedAt
            });
          }
        });
      }
    } catch {}
  }

  return Array.from(resultsMap.values()).sort((a, b) =>
    (b.createdAt || '').localeCompare(a.createdAt || '')
  );
}

export async function submitVendorETransferAnswer(
  applicationId: string,
  securityAnswer: string,
  payerEmail?: string
): Promise<void> {
  const now = new Date().toISOString();
  const patch = cleanFirestoreData({
    eTransferSecurityAnswer: securityAnswer.trim(),
    eTransferPayerEmail: (payerEmail || '').trim(),
    eTransferSubmittedAt: now,
    paymentStatus: 'pending' as PaymentStatus,
    updatedAt: now
  });

  try {
    await updateDoc(doc(db, 'vendor_tracker', applicationId), patch);
  } catch (err) {
    console.warn('Firestore vendor_tracker security answer write note:', err);
  }

  if (auth.currentUser) {
    try {
      await updateDoc(doc(db, 'vendor_applications', applicationId), patch);
    } catch {}
  }

  try {
    const trackerStr = localStorage.getItem('columbia_vendor_tracker_cache');
    if (trackerStr) {
      const parsed = JSON.parse(trackerStr);
      const updated = parsed.map((t: any) => t.id === applicationId ? { ...t, ...patch } : t);
      localStorage.setItem('columbia_vendor_tracker_cache', JSON.stringify(updated));
    }
    const appsStr = localStorage.getItem('columbia_vendor_apps_cache');
    if (appsStr) {
      const parsed = JSON.parse(appsStr);
      const updated = parsed.map((a: any) => a.id === applicationId ? { ...a, ...patch } : a);
      localStorage.setItem('columbia_vendor_apps_cache', JSON.stringify(updated));
    }
  } catch {}
}

export async function deleteVendorApplication(id: string): Promise<void> {
  const path = `vendor_applications/${id}`;
  try {
    await deleteDoc(doc(db, 'vendor_applications', id));
    try {
      await deleteDoc(doc(db, 'vendor_tracker', id));
    } catch {}
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 5. Attendee RSVPs API
export async function createAttendeeRsvp(data: Omit<AttendeeRsvpRecord, 'id' | 'createdAt' | 'checkedIn' | 'passCode'>): Promise<string> {
  const rsvpId = `rsvp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const passCode = `PASS-${Math.floor(100000 + Math.random() * 900000)}`;
  const path = `attendee_rsvps/${rsvpId}`;

  const payload: AttendeeRsvpRecord = {
    ...data,
    id: rsvpId,
    passCode,
    checkedIn: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'attendee_rsvps', rsvpId), payload);
    return passCode;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeAttendeeRsvps(callback: (rsvps: AttendeeRsvpRecord[]) => void) {
  const q = query(collection(db, 'attendee_rsvps'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: AttendeeRsvpRecord[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<AttendeeRsvpRecord, 'id'>) });
      });
      callback(list);
    },
    (error) => {
      console.error('Snapshot error for attendee_rsvps:', error);
      callback([]);
    }
  );
}

export async function toggleAttendeeCheckIn(id: string, checkedIn: boolean): Promise<void> {
  const path = `attendee_rsvps/${id}`;
  try {
    await updateDoc(doc(db, 'attendee_rsvps', id), {
      checkedIn,
      checkedInAt: checkedIn ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAttendeeRsvp(id: string): Promise<void> {
  const path = `attendee_rsvps/${id}`;
  try {
    await deleteDoc(doc(db, 'attendee_rsvps', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 6. Email Templates API
export function subscribeEmailTemplates(callback: (templates: EmailTemplateData[]) => void) {
  const colRef = collection(db, 'email_templates');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        if (auth.currentUser) {
          seedDefaultEmailTemplates().then(() => {
            callback(DEFAULT_EMAIL_TEMPLATES);
          });
        } else {
          callback(DEFAULT_EMAIL_TEMPLATES);
        }
        return;
      }
      const list: EmailTemplateData[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<EmailTemplateData, 'id'>) });
      });
      callback(list);
    },
    (error) => {
      console.warn('Using default email templates due to snapshot listener:', error);
      callback(DEFAULT_EMAIL_TEMPLATES);
    }
  );
}

export async function saveEmailTemplate(template: EmailTemplateData): Promise<void> {
  const path = `email_templates/${template.id}`;
  try {
    await setDoc(doc(db, 'email_templates', template.id), {
      ...template,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function seedDefaultEmailTemplates(): Promise<void> {
  try {
    for (const tmpl of DEFAULT_EMAIL_TEMPLATES) {
      await setDoc(doc(db, 'email_templates', tmpl.id), {
        ...tmpl,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Note: Default templates ready in memory:', err);
  }
}

export async function getEmailTemplateByKey(keyOrId: string): Promise<EmailTemplateData | null> {
  try {
    const snap = await getDoc(doc(db, 'email_templates', keyOrId));
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as EmailTemplateData) };
    }
  } catch (err) {
    console.warn('Could not fetch template from Firestore, using memory fallback:', err);
  }
  return DEFAULT_EMAIL_TEMPLATES.find(t => t.id === keyOrId || t.key === keyOrId) || null;
}

export async function getSmtpConfigOnce(): Promise<SmtpConfigData> {
  try {
    const snap = await getDoc(doc(db, 'email_config', 'smtp_settings'));
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as SmtpConfigData) };
    }
  } catch (err) {
    console.warn('Could not fetch SMTP settings from Firestore, using memory fallback:', err);
  }
  return DEFAULT_SMTP_CONFIG;
}

export async function getFestivalConfigOnce(): Promise<FestivalConfigData> {
  try {
    const snap = await getDoc(doc(db, 'festival_config', 'main_event'));
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as FestivalConfigData) };
    }
  } catch (err) {
    console.warn('Could not fetch Festival config from Firestore, using memory fallback:', err);
  }
  return DEFAULT_FESTIVAL_CONFIG;
}

// 7. SMTP Settings API
export const DEFAULT_SMTP_CONFIG: SmtpConfigData = {
  id: 'main_smtp',
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  username: 'apikey',
  password: '',
  fromName: 'Columbia Community Festival Operations',
  fromEmail: 'events@festivalmarket.org',
  replyToEmail: 'inquiries@festivalmarket.org',
  rateLimitPerHour: 250,
  spfRecord: 'v=spf1 include:sendgrid.net ~all',
  dkimSelector: 's1._domainkey.festivalmarket.org',
  dmarcPolicy: 'v=DMARC1; p=quarantine; pct=100',
  isEnabled: true,
  testStatus: 'idle',
  updatedAt: new Date().toISOString()
};

export function subscribeSmtpConfig(callback: (config: SmtpConfigData) => void) {
  const docRef = doc(db, 'email_config', 'smtp_settings');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...(snap.data() as SmtpConfigData) });
      } else if (auth.currentUser) {
        // Save initial default when admin is authenticated
        saveSmtpConfig(DEFAULT_SMTP_CONFIG).then(() => {
          callback(DEFAULT_SMTP_CONFIG);
        }).catch(() => callback(DEFAULT_SMTP_CONFIG));
      } else {
        callback(DEFAULT_SMTP_CONFIG);
      }
    },
    (error) => {
      console.warn('Using default SMTP settings:', error);
      callback(DEFAULT_SMTP_CONFIG);
    }
  );
}

export async function saveSmtpConfig(config: SmtpConfigData): Promise<void> {
  const path = 'email_config/smtp_settings';
  try {
    await setDoc(doc(db, 'email_config', 'smtp_settings'), cleanFirestoreData({
      ...config,
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 7.1 Outbound Email Logs API
export async function logOutboundEmail(logData: OutboundEmailLog): Promise<void> {
  const logId = logData.id || `mail-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const path = `outbound_email_logs/${logId}`;
  try {
    const cleaned = cleanFirestoreData({
      ...logData,
      id: logId,
      sentAt: logData.sentAt || new Date().toISOString()
    });
    await setDoc(doc(db, 'outbound_email_logs', logId), cleaned);
  } catch (error) {
    console.warn(`Note: Could not write email log (${path}) to Firestore:`, error);
  }
}

export function subscribeOutboundEmailLogs(callback: (logs: OutboundEmailLog[]) => void) {
  const q = query(collection(db, 'outbound_email_logs'), orderBy('sentAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: OutboundEmailLog[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<OutboundEmailLog, 'id'>) });
      });
      callback(list);
    },
    (error) => {
      console.warn('Snapshot error for outbound_email_logs:', error);
      callback([]);
    }
  );
}

export async function deleteOutboundEmailLog(id: string): Promise<void> {
  const path = `outbound_email_logs/${id}`;
  try {
    await deleteDoc(doc(db, 'outbound_email_logs', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 8. Festival Settings API
export const DEFAULT_FESTIVAL_CONFIG: FestivalConfigData = {
  id: 'settings',
  name: EVENT_CONFIG.name,
  shortName: EVENT_CONFIG.shortName,
  heroHeadline: EVENT_CONFIG.heroHeadline,
  edition: EVENT_CONFIG.edition,
  tagline: EVENT_CONFIG.tagline,
  description: EVENT_CONFIG.description,
  venueName: EVENT_CONFIG.venueName,
  venueArea: EVENT_CONFIG.venueArea,
  address: EVENT_CONFIG.address,
  cityState: EVENT_CONFIG.cityState,
  fullLocation: EVENT_CONFIG.fullLocation,
  mapQuery: EVENT_CONFIG.mapQuery,
  datesSummary: EVENT_CONFIG.datesSummary,
  durationBadge: EVENT_CONFIG.durationBadge,
  admissionBadge: EVENT_CONFIG.admissionBadge,
  locationBadge: EVENT_CONFIG.locationBadge,
  contactEmail: EVENT_CONFIG.contactEmail,
  vendorFollowUpEmail: EVENT_CONFIG.contactEmail,
  freeAdmission: true,
  active: true,
  siteDomain: 'https://skysevents.online',
  seoTitle: 'Community Vendor Marketplace & Festival Expo',
  seoDescription: 'Premier 3-day community vendor marketplace, artisan craft fair, food truck rally, live music concerts, and nationwide 50 states market directory. Free attendee passes and vendor bookings open.',
  seoKeywords: 'community vendor market, artisan craft fair, food truck festival, local business pop-up, 50 states vendor directory, festival ticket reservation, live music festival, artisan marketplace',
  datingKeywords: '',
  updatedAt: new Date().toISOString()
};

export function subscribeFestivalConfig(callback: (config: FestivalConfigData) => void) {
  const docRef = doc(db, 'festival_config', 'settings');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...(snap.data() as FestivalConfigData) });
      } else if (auth.currentUser) {
        saveFestivalConfig(DEFAULT_FESTIVAL_CONFIG).then(() => {
          callback(DEFAULT_FESTIVAL_CONFIG);
        }).catch(() => callback(DEFAULT_FESTIVAL_CONFIG));
      } else {
        callback(DEFAULT_FESTIVAL_CONFIG);
      }
    },
    (error) => {
      console.warn('Using default festival config:', error);
      callback(DEFAULT_FESTIVAL_CONFIG);
    }
  );
}

export async function saveFestivalConfig(config: FestivalConfigData): Promise<void> {
  const path = 'festival_config/settings';
  try {
    await setDoc(doc(db, 'festival_config', 'settings'), cleanFirestoreData({
      ...config,
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 9. Auth Helper Functions
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export async function adminSignOut(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

// 10. Demo Seed Generator for Sample Applications & RSVPs (for initial exploration)
export async function seedSampleData(): Promise<{ apps: number; rsvps: number }> {
  const sampleApps: Partial<VendorApplicationRecord>[] = [
    {
      id: 'app-sample-1',
      businessName: 'Artisan Silver & Gem Studio',
      contactName: 'Nadia Solis',
      email: 'nadia@artisansilver.com',
      phone: '(555) 349-2810',
      website: 'https://instagram.com/artisansilver',
      category: 'Jewelry & Metalsmithing',
      selectedBoothId: 'corner-10x10',
      selectedDays: ['fri', 'sat', 'sun'],
      productDescription: 'Hand-forged recycled sterling silver jewelry set with raw turquoise, crystals, and moonstones.',
      photoLinks: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
      isFoodVendor: false,
      hasFoodPermit: false,
      tempHygieneCompliant: false,
      needsHandicapParking: false,
      handicapNotes: '',
      additionalRequests: 'Near morning shade if possible',
      agreedToTerms: true,
      status: 'approved',
      totalCalculatedFee: 375,
      boothZoneAssignment: 'Central Marketplace Corners - Booth C-104',
      adminNotes: 'Excellent quality portfolio. Approved for 3-day corner spot.',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'app-sample-2',
      businessName: 'Botanicals & Herbal Apothecary',
      contactName: 'Elena Vance',
      email: 'elena@botanicalapothecary.com',
      phone: '(555) 782-9912',
      website: 'https://botanicalapothecary.com',
      category: 'Beauty & Wellness',
      selectedBoothId: 'tent-10x10',
      selectedDays: ['sat', 'sun'],
      productDescription: 'Small-batch organic lavender soaps, herbal salves, and hand-poured botanical soy candles.',
      photoLinks: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108',
      isFoodVendor: false,
      hasFoodPermit: false,
      tempHygieneCompliant: false,
      needsHandicapParking: true,
      handicapNotes: 'Requires close vehicle unloading proximity for heavy candle crates',
      additionalRequests: '',
      agreedToTerms: true,
      status: 'pending',
      totalCalculatedFee: 200,
      boothZoneAssignment: 'Artisan Promenade Row - Booth A-202',
      adminNotes: 'Reviewing accessibility parking gate pass.',
      paymentStatus: 'unpaid',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'app-sample-3',
      businessName: 'Smoked Heritage BBQ & Grill',
      contactName: 'Marcus & Tara Ray',
      email: 'marcus@smokedheritagebbq.com',
      phone: '(555) 912-4450',
      website: 'https://smokedheritagebbq.com',
      category: 'Culinary, Baked Goods & Spices',
      selectedBoothId: 'food-truck',
      selectedDays: ['fri', 'sat', 'sun'],
      productDescription: 'Slow-smoked brisket platters, peach BBQ wings, loaded mac & cheese, and fresh lemonade.',
      photoLinks: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb',
      isFoodVendor: true,
      hasFoodPermit: true,
      tempHygieneCompliant: true,
      needsHandicapParking: false,
      handicapNotes: '',
      additionalRequests: 'Requires 220V 50A hookup or quiet onboard generator clearance',
      agreedToTerms: true,
      status: 'approved',
      totalCalculatedFee: 570,
      boothZoneAssignment: 'Dining Promenade & Food Truck Row - Bay FT-02',
      adminNotes: 'Permit valid and verified. Power hookup allocated.',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ];

  const sampleRsvps: Partial<AttendeeRsvpRecord>[] = [
    {
      id: 'rsvp-sample-1',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      daysAttending: ['fri', 'sat'],
      interests: ['Artisan Crafts & Handmade Goods', 'Gourmet Food Trucks & Flavors', 'Live Stage Performances'],
      groupSize: 3,
      newsletterOptIn: true,
      checkedIn: false,
      passCode: 'PASS-892104',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'rsvp-sample-2',
      name: 'David & Emily Ross',
      email: 'david.ross@example.com',
      daysAttending: ['sat', 'sun'],
      interests: ['Culinary, Baked Goods & Spices', 'Kids & Family Activities'],
      groupSize: 4,
      newsletterOptIn: true,
      checkedIn: true,
      checkedInAt: new Date(Date.now() - 1800000).toISOString(),
      passCode: 'PASS-441920',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'rsvp-sample-3',
      name: 'Michael Chen',
      email: 'mchen@example.org',
      daysAttending: ['sun'],
      interests: ['Handmade Jewelry & Accessories', 'Home Goods, Ceramics & Woodcraft'],
      groupSize: 2,
      newsletterOptIn: false,
      checkedIn: false,
      passCode: 'PASS-773192',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  let appCount = 0;
  let rsvpCount = 0;

  for (const a of sampleApps) {
    try {
      await setDoc(doc(db, 'vendor_applications', a.id!), a);
      const emailHash = await hashEmailForTracker(a.email || '');
      const trackerDoc: VendorTrackerRecord = cleanFirestoreData({
        id: a.id!,
        businessName: a.businessName || 'Vendor',
        vendorKind: a.vendorKind || 'Certified Farmer',
        category: a.category || 'Marketplace',
        selectedBoothId: a.selectedBoothId || 'tent-10x10',
        selectedDays: a.selectedDays || ['fri', 'sat', 'sun'],
        totalCalculatedFee: Number(a.totalCalculatedFee || 0),
        boothZoneAssignment: a.boothZoneAssignment || '',
        status: (a.status || 'pending') as any,
        paymentStatus: (a.paymentStatus || 'unpaid') as PaymentStatus,
        emailHash,
        eTransferSecurityAnswer: a.paymentStatus === 'paid' ? 'Festival2026' : undefined,
        createdAt: a.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      await setDoc(doc(db, 'vendor_tracker', a.id!), trackerDoc);
      appCount++;
    } catch (e) {
      console.warn('Sample app write:', e);
    }
  }

  for (const r of sampleRsvps) {
    try {
      await setDoc(doc(db, 'attendee_rsvps', r.id!), r);
      rsvpCount++;
    } catch (e) {
      console.warn('Sample rsvp write:', e);
    }
  }

  return { apps: appCount, rsvps: rsvpCount };
}

// -------------------------------------------------------------
// PAYMENT GATEWAY CONFIGURATION (E-TRANSFER PRIMARY)
// -------------------------------------------------------------

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  id: 'main_payment_config',
  eTransferEnabled: true,
  eTransferEmail: DEFAULT_ETRANSFER_EMAIL,
  eTransferRecipientName: 'Festival Booth Reservations',
  eTransferInstructions: DEFAULT_ETRANSFER_INSTRUCTIONS,
  usdtTrc20: '',
  usdtErc20: '',
  usdtSolana: '',
  usdtEnabled: false,
  ethereumAddress: '',
  ethereumEns: '',
  ethereumEnabled: false,
  bitcoinAddress: '',
  bitcoinLightning: '',
  bitcoinEnabled: false,
  cashAppCashtag: '',
  cashAppBtcAddress: '',
  cashAppEnabled: false,
  krakenPayId: '',
  krakenDepositAddress: '',
  krakenPayEnabled: false,
  krakenSponsorBadgeEnabled: false,
  bankTransferEnabled: false,
  bankName: '',
  bankAccountName: '',
  bankAccountNumber: '',
  bankRoutingNumber: '',
  bankSwiftBic: '',
  zelleHandle: '',
  paymentInstructions: DEFAULT_ETRANSFER_INSTRUCTIONS,
  updatedAt: new Date().toISOString()
};

export async function getPaymentConfig(): Promise<PaymentConfig> {
  try {
    const docRef = doc(db, 'payment_config', 'main_payment_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_PAYMENT_CONFIG, ...snap.data(), id: 'main_payment_config' } as PaymentConfig;
    }
    if (auth.currentUser) {
      await setDoc(docRef, cleanFirestoreData(DEFAULT_PAYMENT_CONFIG));
    }
    return DEFAULT_PAYMENT_CONFIG;
  } catch (error) {
    console.error('Error fetching payment config:', error);
    return DEFAULT_PAYMENT_CONFIG;
  }
}

export async function savePaymentConfig(config: Partial<PaymentConfig>): Promise<PaymentConfig> {
  const path = 'payment_config/main_payment_config';
  try {
    const docRef = doc(db, 'payment_config', 'main_payment_config');
    const payload = cleanFirestoreData({
      ...config,
      id: 'main_payment_config',
      updatedAt: new Date().toISOString()
    });
    await setDoc(docRef, payload, { merge: true });
    return payload as PaymentConfig;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribePaymentConfig(callback: (config: PaymentConfig) => void): () => void {
  const docRef = doc(db, 'payment_config', 'main_payment_config');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback({ ...DEFAULT_PAYMENT_CONFIG, ...snap.data(), id: 'main_payment_config' } as PaymentConfig);
      } else {
        callback(DEFAULT_PAYMENT_CONFIG);
      }
    },
    (err) => {
      console.warn('Payment config snapshot error:', err);
      callback(DEFAULT_PAYMENT_CONFIG);
    }
  );
}

// -------------------------------------------------------------
// INVOICES & CHECKOUT
// -------------------------------------------------------------

export async function getInvoices(): Promise<Invoice[]> {
  try {
    const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice));
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export function createFallbackDemoInvoice(invoiceIdOrNumber: string): Invoice {
  const clean = invoiceIdOrNumber ? invoiceIdOrNumber.trim() : 'INV-2026-001';
  const invNum = clean.toUpperCase().startsWith('INV-') 
    ? clean.toUpperCase() 
    : `INV-2026-${clean.slice(0, 5).toUpperCase()}`;

  const issueDate = new Date().toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  return {
    id: clean,
    invoiceNumber: invNum,
    vendorApplicationId: 'app-demo-vendor',
    recipientBusinessName: 'Columbia Artisan Crafts & Roastery',
    recipientContactName: 'Taylor Morgan',
    recipientEmail: 'vendor@columbiaartisans.org',
    recipientPhone: '(803) 555-0194',
    recipientAddress: '1200 Main Street, Columbia, SC 29201',
    issueDate,
    dueDate,
    status: 'sent',
    items: [
      {
        id: 'item-booth-space',
        description: 'Premium 10x10 Covered Artisan Booth (3-Day Space)',
        quantity: 1,
        unitPrice: 475.00,
        total: 475.00,
        category: 'booth_fee'
      },
      {
        id: 'item-electric',
        description: '20-Amp Dedicated Electrical Hookup Access',
        quantity: 1,
        unitPrice: 75.00,
        total: 75.00,
        category: 'electrical'
      },
      {
        id: 'item-spotlight',
        description: 'Official Festival Program Listing & Social Spotlight',
        quantity: 1,
        unitPrice: 50.00,
        total: 50.00,
        category: 'sponsorship'
      }
    ],
    subtotal: 600.00,
    discountAmount: 50.00,
    taxAmount: 0.00,
    totalAmount: 550.00,
    paidAmount: 0.00,
    currency: 'USD',
    notes: 'Thank you for participating in the Columbia Community Vendor Marketplace & Festival Expo!',
    terms: 'Payment is due within 14 days of receipt to guarantee reserved booth space and electrical allocations.',
    checkoutUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/?invoice=${clean}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  if (!invoiceId || typeof invoiceId !== 'string') return null;
  const cleanId = invoiceId.trim();

  try {
    // 1. Direct lookup by doc ID
    const docRef = doc(db, 'invoices', cleanId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Invoice;
    }

    // 2. Query by exact invoiceNumber
    const q1 = query(collection(db, 'invoices'), where('invoiceNumber', '==', cleanId), limit(1));
    const querySnap1 = await getDocs(q1);
    if (!querySnap1.empty) {
      return { id: querySnap1.docs[0].id, ...querySnap1.docs[0].data() } as Invoice;
    }

    // 3. Query by uppercase invoiceNumber (e.g. inv-2026-001 -> INV-2026-001)
    const upperId = cleanId.toUpperCase();
    if (upperId !== cleanId) {
      const q2 = query(collection(db, 'invoices'), where('invoiceNumber', '==', upperId), limit(1));
      const querySnap2 = await getDocs(q2);
      if (!querySnap2.empty) {
        return { id: querySnap2.docs[0].id, ...querySnap2.docs[0].data() } as Invoice;
      }
    }

    // 4. Query by id field explicitly if Firestore auto-generated id differs from doc id
    const q3 = query(collection(db, 'invoices'), where('id', '==', cleanId), limit(1));
    const querySnap3 = await getDocs(q3);
    if (!querySnap3.empty) {
      return { id: querySnap3.docs[0].id, ...querySnap3.docs[0].data() } as Invoice;
    }

    // 5. If it's a test or demo invoice ID in development/preview, return a fallback so preview works
    if (cleanId.toLowerCase().includes('demo') || cleanId.toLowerCase().includes('inv-2026') || cleanId.startsWith('inv-')) {
      return createFallbackDemoInvoice(cleanId);
    }

    return null;
  } catch (error) {
    console.error('Error getting invoice by id:', error);
    // Return fallback for demo invoice on offline or error
    if (cleanId.toLowerCase().includes('demo') || cleanId.toLowerCase().includes('inv-2026') || cleanId.startsWith('inv-')) {
      return createFallbackDemoInvoice(cleanId);
    }
    return null;
  }
}

export async function saveInvoice(invoice: Partial<Invoice> & { recipientEmail: string; totalAmount: number }): Promise<Invoice> {
  try {
    const id = invoice.id || `inv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const invoiceNumber = invoice.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const payload: Record<string, any> = {
      id,
      invoiceNumber,
      vendorApplicationId: invoice.vendorApplicationId || '',
      recipientBusinessName: invoice.recipientBusinessName || 'Valued Vendor',
      recipientContactName: invoice.recipientContactName || 'Vendor Representative',
      recipientEmail: invoice.recipientEmail,
      recipientPhone: invoice.recipientPhone || '',
      recipientAddress: invoice.recipientAddress || '',
      issueDate: invoice.issueDate || now.split('T')[0],
      dueDate: invoice.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: invoice.status || 'draft',
      items: invoice.items || [],
      subtotal: Number(invoice.subtotal ?? invoice.totalAmount),
      discountAmount: Number(invoice.discountAmount || 0),
      taxAmount: Number(invoice.taxAmount || 0),
      totalAmount: Number(invoice.totalAmount),
      paidAmount: Number(invoice.paidAmount || 0),
      currency: invoice.currency || 'USD',
      notes: invoice.notes || 'Thank you for participating in the Community Vendor Marketplace!',
      terms: invoice.terms || 'Payments for booth reservations are processed through E-Transfer.',
      eTransferEmail: invoice.eTransferEmail || DEFAULT_ETRANSFER_EMAIL,
      eTransferSecurityAnswer: invoice.eTransferSecurityAnswer,
      paymentMethodsEnabled: invoice.paymentMethodsEnabled || {
        eTransfer: true,
        usdt: false,
        ethereum: false,
        bitcoin: false,
        cashApp: false,
        krakenPay: false,
        bankTransfer: false
      },
      checkoutUrl: invoice.checkoutUrl || `${window.location.origin}/?invoice=${id}`,
      createdAt: invoice.createdAt || now,
      updatedAt: now
    };

    if (invoice.bankDetails) {
      payload.bankDetails = cleanFirestoreData(invoice.bankDetails);
    }
    if (invoice.cryptoAddresses) {
      payload.cryptoAddresses = cleanFirestoreData(invoice.cryptoAddresses);
    }
    if (invoice.paymentDetailsSubmitted) {
      payload.paymentDetailsSubmitted = cleanFirestoreData(invoice.paymentDetailsSubmitted);
    }
    if (invoice.sentAt) {
      payload.sentAt = invoice.sentAt;
    }
    if (invoice.paidAt) {
      payload.paidAt = invoice.paidAt;
    }

    const cleanedPayload = cleanFirestoreData(payload);
    await setDoc(doc(db, 'invoices', id), cleanedPayload, { merge: true });

    // Sync to local storage cache
    try {
      const cached = localStorage.getItem('columbia_invoices_cache');
      const existing = cached ? JSON.parse(cached) : [];
      const updated = [cleanedPayload, ...existing.filter((i: any) => i.id !== id)];
      localStorage.setItem('columbia_invoices_cache', JSON.stringify(updated));
    } catch {}

    // Also update vendor application + tracker record if vendorApplicationId exists
    if (invoice.vendorApplicationId) {
      try {
        const updateStatus: PaymentStatus = invoice.status === 'paid' ? 'paid' : (invoice.status === 'under_review' ? 'pending' : 'unpaid');
        await updateVendorApplicationStatus(invoice.vendorApplicationId, {
          paymentStatus: updateStatus,
          invoiceNumber
        });
      } catch (err) {
        console.warn('Could not update vendor application payment status:', err);
      }
    }

    return cleanedPayload as Invoice;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'invoices');
  }
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus, paidAmount?: number): Promise<void> {
  const path = `invoices/${id}`;
  try {
    const docRef = doc(db, 'invoices', id);
    const updateData: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (status === 'paid') {
      updateData.paidAt = new Date().toISOString();
      if (paidAmount !== undefined) {
        updateData.paidAmount = paidAmount;
      }
    }
    const cleaned = cleanFirestoreData(updateData);
    await updateDoc(docRef, cleaned);

    try {
      const invSnap = await getDoc(docRef);
      const invData = invSnap.exists() ? (invSnap.data() as Invoice) : null;
      if (invData?.vendorApplicationId && status === 'paid') {
        await updateVendorApplicationStatus(invData.vendorApplicationId, {
          paymentStatus: 'paid',
          status: 'paid'
        });
      }
    } catch (syncErr) {
      console.warn('Could not sync invoice paid status to vendor app:', syncErr);
    }

    try {
      const cached = localStorage.getItem('columbia_invoices_cache');
      if (cached) {
        const existing = JSON.parse(cached);
        const updated = existing.map((i: any) => i.id === id ? { ...i, ...cleaned } : i);
        localStorage.setItem('columbia_invoices_cache', JSON.stringify(updated));
      }
    } catch {}
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function submitInvoicePaymentProof(
  invoiceId: string, 
  submission: InvoicePaymentSubmission,
  vendorApplicationId?: string
): Promise<void> {
  const path = `invoices/${invoiceId}`;
  try {
    const docRef = doc(db, 'invoices', invoiceId);
    const cleanedSubmission = cleanFirestoreData(submission);
    await updateDoc(docRef, {
      status: 'under_review',
      paymentDetailsSubmitted: cleanedSubmission,
      updatedAt: new Date().toISOString()
    });

    if (vendorApplicationId && submission.eTransferSecurityAnswer) {
      await submitVendorETransferAnswer(
        vendorApplicationId,
        submission.eTransferSecurityAnswer,
        submission.payerWalletOrHandle
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  const path = `invoices/${id}`;
  try {
    await deleteDoc(doc(db, 'invoices', id));
    try {
      const cached = localStorage.getItem('columbia_invoices_cache');
      if (cached) {
        const existing = JSON.parse(cached);
        const updated = existing.filter((i: any) => i.id !== id);
        localStorage.setItem('columbia_invoices_cache', JSON.stringify(updated));
      }
    } catch {}
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeInvoices(callback: (invoices: Invoice[]) => void): () => void {
  // Read cache first for instant render
  try {
    const cached = localStorage.getItem('columbia_invoices_cache');
    if (cached) {
      const list = JSON.parse(cached);
      if (Array.isArray(list) && list.length > 0) {
        callback(list);
      }
    }
  } catch {}

  const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));

  getDocs(q).then(snap => {
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice));
      localStorage.setItem('columbia_invoices_cache', JSON.stringify(items));
      callback(items);
    }
  }).catch(() => {});

  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice));
      try {
        localStorage.setItem('columbia_invoices_cache', JSON.stringify(items));
      } catch {}
      callback(items);
    },
    (err) => {
      console.warn('Invoices snapshot error:', err);
      try {
        const cached = localStorage.getItem('columbia_invoices_cache');
        if (cached) {
          callback(JSON.parse(cached));
        }
      } catch {}
    }
  );
}
