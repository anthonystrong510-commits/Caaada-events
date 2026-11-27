# Firestore Security Specification & Red-Team Verification

## 1. Data Invariants
1. **Master Safety Net**: All unmatched document paths default-deny read and write access (`allow read, write: if false`).
2. **Verified Admin Identity**: Admin privileges are granted ONLY when `request.auth != null` AND either `(request.auth.token.email == 'muokltd@gmail.com' && request.auth.token.email_verified == true)` or `exists(/databases/$(database)/documents/admins/$(request.auth.uid))`. Unverified emails (`email_verified == false`) are strictly rejected.
3. **Path Variable Hardening**: Every single-document `get`, `create`, `update`, and `delete` enforces `isValidId(docId)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars).
4. **PII & Secret Isolation**:
   - `email_config` (SMTP usernames/passwords), `outbound_email_logs`, `vendor_applications`, `attendee_rsvps`, `event_locations`, `custom_cities` allow reads/lists ONLY to verified admins.
   - `festival_config`, `payment_config`, `email_templates` permit single-document `get` (for homepage display and public invoice checkout rendering) without opening blanket collection `list` queries to unauthenticated callers.
   - `vendor_tracker` stores strictly non-PII booking metadata (`id`, `businessName`, `selectedBoothId`, `selectedDays`, `totalCalculatedFee`, `status`, `paymentStatus`, `emailHash`, `eTransferSecurityAnswer`) allowing single-doc lookup or bounded email-hash lookup (`limit <= 5`) without exposing raw email/phone PII.
5. **Public Submission Integrity (Least-Privilege `create` & Bounded E-Transfer Proof)**:
   - Unauthenticated visitors creating `vendor_applications` or `vendor_tracker` MUST have `status == 'pending'`, `paymentStatus in ['unpaid', 'pending']`, empty `adminNotes`, and strict field allowlisting (`hasAll` + `hasOnly`).
   - Unauthenticated vendors updating `vendor_tracker` to submit an E-Transfer security question answer MUST only mutate `['eTransferSecurityAnswer', 'eTransferPayerEmail', 'eTransferSubmittedAt', 'paymentStatus', 'updatedAt']`, cannot mutate `paid`/`waived` records, and cannot alter `status` or `totalCalculatedFee`.
   - Unauthenticated visitors creating `attendee_rsvps` MUST have `checkedIn == false` and bounded arrays/groupSize.
6. **Invoice Payment Proof Action & Terminal State Locking**:
   - Public checkout payment proof submission on `invoices/{invoiceId}` is restricted to an explicit action that checks `existing().status in ['sent', 'overdue', 'draft']`, `incoming().diff(existing()).affectedKeys().hasOnly(['status', 'paymentDetailsSubmitted', 'updatedAt'])`, `incoming().status == 'under_review'`, and preserves `createdAt`, `totalAmount`, and `invoiceNumber`.
   - Terminal states (`paid`, `cancelled`) cannot be modified by non-admins.
7. **Immortal Fields & Volumetric Bounds**:
   - All string fields enforce `.size() <= MAX` limits; all array fields enforce `.size() <= MAX` limits; `createdAt` is immutable on update.

## 2. The "Dirty Dozen" Red-Team Payloads
1. **Unverified Admin Email Spoof**: `{ auth: { token: { email: 'muokltd@gmail.com', email_verified: false } } }` reading `email_config/smtp_settings` -> **PERMISSION_DENIED**.
2. **Self-Approved Vendor Application**: Unauthenticated `create` on `vendor_applications/app-evil` with `{ status: 'approved', paymentStatus: 'paid', ... }` -> **PERMISSION_DENIED**.
3. **Shadow / Ghost Field Injection**: Public `create` on `vendor_applications/app-shadow` including `{ isAdminOverride: true, ... }` -> **PERMISSION_DENIED**.
4. **1MB Resource Poisoning String**: Public `create` on `attendee_rsvps/rsvp-giant` with `name` > 100 chars -> **PERMISSION_DENIED**.
5. **Poisoned Document ID**: `create` on `vendor_applications/../../admins/hacker` -> **PERMISSION_DENIED** (`isValidId` fails).
6. **Public PII Scrape (`vendor_applications` list)**: Unauthenticated `list` or `get` on `vendor_applications` -> **PERMISSION_DENIED**.
7. **SMTP Credential Leak**: Unauthenticated `get` or `list` on `email_config` -> **PERMISSION_DENIED**.
8. **Pre-Checked-In Gate Pass Spoof**: Public `create` on `attendee_rsvps/rsvp-1` with `checkedIn: true` -> **PERMISSION_DENIED**.
9. **Invoice Amount Tampering on Checkout Proof**: Non-admin `update` on `invoices/inv-1` changing `['status', 'paymentDetailsSubmitted', 'updatedAt', 'totalAmount']` -> **PERMISSION_DENIED**.
10. **Terminal Invoice Re-opening**: Non-admin `update` on `invoices/inv-paid` where existing `status == 'paid'` -> **PERMISSION_DENIED**.
11. **Fake `paid` Status Injection via Proof**: Non-admin `update` on `invoices/inv-1` setting `status: 'paid'` -> **PERMISSION_DENIED**.
12. **Self-Promotion to `admins` Collection**: Authenticated non-superadmin user writing `/admins/{uid}` -> **PERMISSION_DENIED**.
