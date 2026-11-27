import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Send,
  Mail,
  Store,
  ShieldCheck,
  AlertCircle,
  Lock
} from 'lucide-react';
import {
  FestivalConfigData,
  PaymentConfig,
  VendorTrackerRecord
} from '../types';
import { BOOTH_TIERS } from '../data/festivalData';
import {
  DEFAULT_ETRANSFER_EMAIL,
  lookupVendorTrackers,
  submitVendorETransferAnswer
} from '../lib/firebase';

interface VendorTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  paymentConfig?: PaymentConfig;
  festivalConfig?: FestivalConfigData;
}

export const VendorTrackerModal: React.FC<VendorTrackerModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  paymentConfig,
  festivalConfig
}) => {
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [results, setResults] = useState<VendorTrackerRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Per-application E-Transfer security answer inputs
  const [answersByAppId, setAnswersByAppId] = useState<Record<string, string>>({});
  const [payerEmailByAppId, setPayerEmailByAppId] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submittedSuccessId, setSubmittedSuccessId] = useState<string | null>(null);
  const [submitErrorById, setSubmitErrorById] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const eTransferEmail = (
    paymentConfig?.eTransferEmail?.trim() ||
    DEFAULT_ETRANSFER_EMAIL
  );

  const runSearch = async (queryText: string) => {
    const clean = queryText.trim();
    if (!clean) {
      setSearchError('Enter your Application Reference ID (e.g. APP-2026-1234) or registered email address.');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSubmittedSuccessId(null);

    try {
      const found = await lookupVendorTrackers(clean);
      setResults(found);
      setHasSearched(true);

      const initialAnswers: Record<string, string> = {};
      const initialEmails: Record<string, string> = {};
      found.forEach((rec) => {
        if (rec.eTransferSecurityAnswer) initialAnswers[rec.id] = rec.eTransferSecurityAnswer;
        if (rec.eTransferPayerEmail) initialEmails[rec.id] = rec.eTransferPayerEmail;
      });
      setAnswersByAppId((prev) => ({ ...initialAnswers, ...prev }));
      setPayerEmailByAppId((prev) => ({ ...initialEmails, ...prev }));
    } catch (err) {
      console.error('Vendor tracker lookup error:', err);
      setSearchError('Unable to check application status right now. Please try again in a moment.');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSearchError(null);
      if (initialQuery && initialQuery.trim()) {
        setSearchInput(initialQuery.trim());
        void runSearch(initialQuery.trim());
      }
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const handleCopyEmail = (key: string) => {
    navigator.clipboard.writeText(eTransferEmail);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSubmitSecurityAnswer = async (rec: VendorTrackerRecord, e: React.FormEvent) => {
    e.preventDefault();
    const answer = (answersByAppId[rec.id] || '').trim();
    const payerEmail = (payerEmailByAppId[rec.id] || '').trim();

    if (!answer) {
      setSubmitErrorById((prev) => ({
        ...prev,
        [rec.id]: 'Please enter your E-Transfer security question answer or confirmation details.'
      }));
      return;
    }

    setSubmittingId(rec.id);
    setSubmitErrorById((prev) => ({ ...prev, [rec.id]: '' }));

    try {
      await submitVendorETransferAnswer(rec.id, answer, payerEmail);
      const now = new Date().toISOString();
      setResults((prev) =>
        prev.map((item) =>
          item.id === rec.id
            ? {
                ...item,
                eTransferSecurityAnswer: answer,
                eTransferPayerEmail: payerEmail || item.eTransferPayerEmail,
                eTransferSubmittedAt: now,
                paymentStatus: 'pending',
                updatedAt: now
              }
            : item
        )
      );
      setSubmittedSuccessId(rec.id);
    } catch (err) {
      console.error('Error submitting E-Transfer answer:', err);
      setSubmitErrorById((prev) => ({
        ...prev,
        [rec.id]: 'Could not submit your security answer. Please verify your connection and retry.'
      }));
    } finally {
      setSubmittingId(null);
    }
  };

  const formatApprovalLabel = (status: VendorTrackerRecord['status']) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return { text: 'Approved', tone: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
      case 'waitlist':
        return { text: 'Waitlisted', tone: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'rejected':
        return { text: 'Declined', tone: 'text-rose-800 bg-rose-50 border-rose-200' };
      default:
        return { text: 'Pending Review', tone: 'text-[#5A5A40] bg-[#F0EBE0] border-[#D6CFBE]' };
    }
  };

  const formatPaymentLabel = (rec: VendorTrackerRecord) => {
    if (rec.paymentStatus === 'paid') {
      return { text: 'Paid & Confirmed', tone: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
    }
    if (rec.paymentStatus === 'waived') {
      return { text: 'Fee Waived', tone: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
    }
    if (rec.paymentStatus === 'pending' || rec.eTransferSecurityAnswer) {
      return { text: 'Security Answer Submitted', tone: 'text-amber-900 bg-amber-50 border-amber-200' };
    }
    return { text: 'Unpaid', tone: 'text-rose-800 bg-rose-50 border-rose-200' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        id="vendor-tracker-dialog"
        className="bg-[#FDFBF7] rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8E2D6] max-h-[92vh] overflow-y-auto relative my-auto text-[#3D3A30]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#7A7566] hover:text-[#3D3A30] hover:bg-[#F0EBE0] transition-colors cursor-pointer"
          aria-label="Close Vendor Tracker"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dialog Header */}
        <div className="pr-10 space-y-1.5 mb-6">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40]">
            Vendor Application &amp; E-Transfer Tracker
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30] leading-tight">
            Check Your Booth Reservation
          </h3>
          <p className="text-xs sm:text-sm text-[#6B6658] leading-relaxed">
            Look up your applied booth tier, fee, approval status, and E-Transfer settlement for{' '}
            {festivalConfig?.shortName || 'the festival'}.
          </p>
        </div>

        {/* Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void runSearch(searchInput);
          }}
          className="flex flex-col sm:flex-row gap-2.5 mb-6"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7A7566] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="vendor-tracker-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setSearchError(null);
              }}
              placeholder="Enter Reference ID (e.g. APP-2026-1234) or Email"
              className="w-full pl-11 pr-4 py-3 rounded-full border border-[#E8E2D6] bg-white text-xs sm:text-sm text-[#3D3A30] placeholder-[#8A8576] focus:border-[#5A5A40] outline-none"
            />
          </div>
          <button
            id="vendor-tracker-search-btn"
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 rounded-full bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isSearching ? 'Searching...' : 'Find Application'}</span>
          </button>
        </form>

        {searchError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Initial Guidance Before Lookup */}
        {!hasSearched && (
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E2D6] space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#3D3A30]">
                  Already applied for a vendor booth?
                </h4>
                <p className="text-xs text-[#6B6658] leading-relaxed">
                  Enter your application reference ID or email above to view what space and days you applied for, check your fee total, copy the official E-Transfer email, and submit your E-Transfer security question answer.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6] space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A5A40]">
                Official E-Transfer Address
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border border-[#E8E2D6] rounded-xl p-3">
                <span className="font-mono text-xs sm:text-sm font-bold text-[#3D3A30] select-all break-all">
                  {eTransferEmail}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyEmail('intro-copy')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedId === 'intro-copy' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'intro-copy' ? 'Copied!' : 'Copy Email'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty Results */}
        {hasSearched && results.length === 0 && (
          <div className="p-8 rounded-2xl bg-white border border-dashed border-[#D6CFBE] text-center space-y-2">
            <Store className="w-8 h-8 text-[#8A8576] mx-auto" />
            <h4 className="text-sm font-bold text-[#3D3A30]">No Matching Application Found</h4>
            <p className="text-xs text-[#6B6658] max-w-md mx-auto leading-relaxed">
              Double-check your Reference ID (including <span className="font-mono">APP-...</span>) or the exact email address entered on your vendor registration form.
            </p>
          </div>
        )}

        {/* Tracker Results */}
        <div className="space-y-5">
          {results.map((rec) => {
            const booth = BOOTH_TIERS.find((b) => b.id === rec.selectedBoothId);
            const approvalBadge = formatApprovalLabel(rec.status);
            const paymentBadge = formatPaymentLabel(rec);
            const isPaidOrWaived = rec.paymentStatus === 'paid' || rec.paymentStatus === 'waived';
            const isApproved = rec.status === 'approved' || rec.status === 'paid';
            const currentAnswer = answersByAppId[rec.id] ?? rec.eTransferSecurityAnswer ?? '';
            const currentPayerEmail = payerEmailByAppId[rec.id] ?? rec.eTransferPayerEmail ?? '';
            const rowSubmitErr = submitErrorById[rec.id];

            return (
              <div
                key={rec.id}
                className="bg-white rounded-[24px] border border-[#E8E2D6] shadow-xs overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-5 sm:p-6 border-b border-[#E8E2D6] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-[11px] font-bold text-[#5A5A40]">
                      Ref #{rec.id}
                    </div>
                    <h4 className="text-lg sm:text-xl font-serif italic font-bold text-[#3D3A30]">
                      {rec.businessName}
                    </h4>
                    <div className="text-xs text-[#6B6658] mt-0.5">
                      {rec.vendorKind ? `${rec.vendorKind} · ` : ''}{rec.category}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg border text-[11px] font-bold ${approvalBadge.tone}`}>
                      Approval: {approvalBadge.text}
                    </span>
                    <span className={`px-3 py-1 rounded-lg border text-[11px] font-bold ${paymentBadge.tone}`}>
                      Payment: {paymentBadge.text}
                    </span>
                  </div>
                </div>

                {/* What They Applied For + Price */}
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6] sm:col-span-2 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7566] block">
                        Applied Booth Space &amp; Days
                      </span>
                      <div className="text-sm font-bold text-[#3D3A30]">
                        {booth ? `${booth.name} (${booth.dimensions})` : rec.selectedBoothId}
                      </div>
                      <div className="text-xs text-[#5A5A40] font-semibold">
                        Sessions: {rec.selectedDays.map((d) => d.toUpperCase()).join(', ')} ({rec.selectedDays.length} day{rec.selectedDays.length > 1 ? 's' : ''})
                      </div>
                      {rec.boothZoneAssignment && (
                        <div className="text-[11px] text-[#6B6658]">
                          Zone: {rec.boothZoneAssignment}
                        </div>
                      )}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#5A5A40] text-white flex flex-col justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8E2D6]">
                        Total Booth Price
                      </span>
                      <div className="text-2xl sm:text-3xl font-serif italic font-bold tabular-nums mt-1">
                        ${Number(rec.totalCalculatedFee || 0).toLocaleString('en-US')}
                      </div>
                      <span className="text-[11px] text-[#F0EBE0] mt-1">
                        {isPaidOrWaived ? 'Settled in full' : 'Due via E-Transfer'}
                      </span>
                    </div>
                  </div>

                  {/* Conditional E-Transfer Section when NOT Paid vs Paid Confirmation */}
                  {!isPaidOrWaived ? (
                    <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#5A5A40]/30 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            <span>E-Transfer Booth Payment</span>
                          </span>
                          {!isApproved && (
                            <span className="text-[11px] font-semibold text-[#6B6658]">
                              Reservation review in progress — E-Transfer instructions ready below
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#4F4A3E] leading-relaxed pt-1 whitespace-pre-line">
                          Payments for booth reservations are processed through E-Transfer.
                          {'\n\n'}
                          Please send your E-Transfer payment to:
                        </p>
                      </div>

                      {/* Copyable E-Transfer Email Strip */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white border border-[#E8E2D6] rounded-xl p-3">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7566] block">
                            Send E-Transfer Payment To
                          </span>
                          <span className="font-mono text-sm font-bold text-[#3D3A30] select-all break-all">
                            {eTransferEmail}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(rec.id)}
                            className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {copiedId === rec.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedId === rec.id ? 'Copied Email!' : 'Copy Email'}</span>
                          </button>

                          <a
                            href={`mailto:${encodeURIComponent(eTransferEmail)}?subject=${encodeURIComponent(`E-Transfer Security Answer - Ref ${rec.id} (${rec.businessName})`)}`}
                            className="px-3.5 py-2 rounded-xl bg-[#F0EBE0] hover:bg-[#E8E2D6] text-[#3D3A30] text-xs font-bold transition-colors"
                          >
                            Email
                          </a>
                        </div>
                      </div>

                      <p className="text-xs text-[#4F4A3E] leading-relaxed">
                        After completing your payment, kindly send us the answer to your security question (or confirmation details if no security question is required) so we can verify your payment and confirm your booth reservation. Thank you, and we look forward to having you at the event.
                      </p>

                      {/* Security Question Answer Submission Form */}
                      <form onSubmit={(e) => handleSubmitSecurityAnswer(rec, e)} className="pt-3 border-t border-[#E8E2D6] space-y-3">
                        {(rec.eTransferSecurityAnswer || submittedSuccessId === rec.id) && (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                            <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block">
                                Security answer / confirmation logged for admin verification
                              </span>
                              <span className="text-[11px] text-emerald-800">
                                Submitted answer: <strong className="font-mono">{rec.eTransferSecurityAnswer}</strong>
                                {rec.eTransferSubmittedAt ? ` · Updated ${new Date(rec.eTransferSubmittedAt).toLocaleString()}` : ''}
                              </span>
                            </div>
                          </div>
                        )}

                        {rowSubmitErr && (
                          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{rowSubmitErr}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-[#3D3A30] mb-1">
                              Security Question Answer / Confirmation Details *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Enter answer or Autodeposit ref #"
                              value={currentAnswer}
                              onChange={(e) =>
                                setAnswersByAppId((prev) => ({ ...prev, [rec.id]: e.target.value }))
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#3D3A30] mb-1">
                              Sender Email on E-Transfer (Optional)
                            </label>
                            <input
                              type="email"
                              placeholder="Email used to send transfer"
                              value={currentPayerEmail}
                              onChange={(e) =>
                                setPayerEmailByAppId((prev) => ({ ...prev, [rec.id]: e.target.value }))
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={submittingId === rec.id}
                            className="px-5 py-2.5 rounded-full bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>
                              {submittingId === rec.id
                                ? 'Submitting...'
                                : rec.eTransferSecurityAnswer
                                ? 'Update Security Answer'
                                : 'Submit E-Transfer Security Answer'}
                            </span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Paid / Confirmed Booth State */
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                        <span>Payment Verified — Your Booth Reservation Is Confirmed</span>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        We have verified your E-Transfer settlement of{' '}
                        <strong className="tabular-nums">${Number(rec.totalCalculatedFee || 0).toLocaleString('en-US')}</strong>{' '}
                        for <strong>{rec.businessName}</strong>. Present Reference{' '}
                        <strong className="font-mono">#{rec.id}</strong> at Vendor Gate Check-In on event morning.
                      </p>
                      {rec.eTransferSecurityAnswer && (
                        <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-900 font-mono">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>Verified Ref / Answer: {rec.eTransferSecurityAnswer}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#E8E2D6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#7A7566]">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Only booth tier, price, and reservation status are displayed here for privacy.</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="self-end sm:self-auto px-4 py-1.5 rounded-full bg-[#F0EBE0] hover:bg-[#E8E2D6] text-[#3D3A30] font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
