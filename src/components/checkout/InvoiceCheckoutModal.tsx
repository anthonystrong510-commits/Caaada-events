import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Printer,
  X,
  Send,
  Mail,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { Invoice, PaymentConfig, InvoicePaymentSubmission } from '../../types';
import {
  submitInvoicePaymentProof,
  getPaymentConfig,
  DEFAULT_PAYMENT_CONFIG,
  DEFAULT_ETRANSFER_EMAIL
} from '../../lib/firebase';

interface InvoiceCheckoutModalProps {
  invoice: Invoice;
  onClose: () => void;
  onPaymentSubmitted?: () => void;
}

export function InvoiceCheckoutModal({ invoice, onClose, onPaymentSubmitted }: InvoiceCheckoutModalProps) {
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(DEFAULT_PAYMENT_CONFIG);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // E-Transfer security answer form
  const [securityAnswer, setSecurityAnswer] = useState(
    invoice.paymentDetailsSubmitted?.eTransferSecurityAnswer ||
    invoice.eTransferSecurityAnswer ||
    ''
  );
  const [senderEmail, setSenderEmail] = useState(
    invoice.paymentDetailsSubmitted?.payerWalletOrHandle || ''
  );
  const [proofNote, setProofNote] = useState(
    invoice.paymentDetailsSubmitted?.proofNote || ''
  );
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [proofSuccess, setProofSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPaymentConfig()
      .then((cfg) => {
        if (isMounted && cfg) {
          setPaymentConfig(cfg);
        }
      })
      .catch((err) => console.warn('Could not fetch latest payment config:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  const eTransferEmail =
    invoice.eTransferEmail?.trim() ||
    invoice.bankDetails?.eTransferEmail?.trim() ||
    paymentConfig.eTransferEmail?.trim() ||
    DEFAULT_ETRANSFER_EMAIL;

  const recipientName =
    invoice.bankDetails?.eTransferRecipientName?.trim() ||
    paymentConfig.eTransferRecipientName?.trim() ||
    'Festival Vendor Treasury';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAnswer = securityAnswer.trim();
    if (!cleanAnswer) {
      setSubmitError('Please enter the answer to your E-Transfer security question or confirmation details.');
      return;
    }

    setIsSubmittingProof(true);
    setSubmitError(null);
    try {
      const submission: InvoicePaymentSubmission = {
        method: 'etransfer',
        eTransferSecurityAnswer: cleanAnswer,
        txHash: cleanAnswer,
        payerWalletOrHandle: senderEmail.trim() || invoice.recipientEmail,
        network: 'E-TRANSFER',
        paidAmount: invoice.totalAmount,
        paidCurrency: 'USD',
        submittedAt: new Date().toISOString(),
        proofNote: proofNote.trim()
      };

      await submitInvoicePaymentProof(invoice.id, submission, invoice.vendorApplicationId);
      setProofSuccess(true);
      if (onPaymentSubmitted) {
        onPaymentSubmitted();
      }
    } catch (err) {
      console.error('Error submitting E-Transfer details:', err);
      setSubmitError('Could not save your confirmation details. Please try again.');
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const isPaid = invoice.status === 'paid';
  const isUnderReview = invoice.status === 'under_review' || proofSuccess;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-[#E8E2D6] animate-in fade-in zoom-in-95 my-auto overflow-hidden">
        {/* Checkout Header */}
        <div className="bg-[#5A5A40] text-white p-5 sm:p-7 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-white/15 text-white">
                E-Transfer Booth Checkout
              </span>
              {isPaid ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-400 text-emerald-950 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PAID &amp; CONFIRMED
                </span>
              ) : isUnderReview ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-300 text-amber-950 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> VERIFICATION PENDING
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white/15 text-white/90">
                  DUE UPON RECEIPT
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-serif italic font-bold tracking-tight">
              Invoice {invoice.invoiceNumber}
            </h1>
            <p className="text-xs text-white/80">
              {invoice.recipientBusinessName} • Community Vendor Marketplace
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Checkout Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
          {isPaid && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-sm">E-Transfer Payment Verified &amp; Confirmed</div>
                <p>
                  Your booth reservation is fully paid (${Number(invoice.totalAmount).toFixed(2)} USD). Load-in instructions and exhibitor credentials have been unlocked.
                </p>
              </div>
            </div>
          )}

          {isUnderReview && !isPaid && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-sm">Security Question Answer Submitted!</div>
                <p>
                  Thank you! Your E-Transfer confirmation details have been logged for admin review. You can update the details below if needed while verification is pending.
                </p>
              </div>
            </div>
          )}

          {/* Top Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E8E2D6] md:col-span-2 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-[#7A7566] uppercase tracking-wider">Billed To</span>
              <div className="font-bold text-base text-[#3D3A30]">{invoice.recipientBusinessName}</div>
              <div className="text-[#5A5A40] font-medium">
                Attn: {invoice.recipientContactName} ({invoice.recipientEmail})
              </div>
              <div className="text-[#7A7566] pt-1">
                Due Date: <span className="font-bold text-[#3D3A30]">{invoice.dueDate}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#3D3A30] text-white flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/75">Total Amount Due</span>
                <div className="text-2xl sm:text-3xl font-extrabold mt-0.5 tabular-nums">
                  ${Number(invoice.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-[11px] text-[#E8E2D6] font-medium mt-2">
                Paid via E-Transfer
              </span>
            </div>
          </div>

          {/* Line Items Summary */}
          <div className="bg-white rounded-2xl border border-[#E8E2D6] p-4 sm:p-5">
            <h3 className="font-bold text-xs text-[#3D3A30] uppercase tracking-wider mb-3">Itemized Booth Charges</h3>
            <div className="divide-y divide-[#F0EBE0] text-xs">
              {invoice.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-[#3D3A30]">{item.description}</span>
                    <span className="text-[#7A7566] ml-2 font-mono">x{item.quantity}</span>
                  </div>
                  <div className="font-bold text-[#3D3A30] tabular-nums shrink-0">
                    ${Number(item.total).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="pt-3 flex items-center justify-between font-bold text-sm text-[#3D3A30]">
                <span>Total Balance:</span>
                <span className="text-emerald-800 text-base tabular-nums">
                  ${Number(invoice.totalAmount).toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* E-Transfer Payment Instructions & Security Answer Submission */}
          {!isPaid && (
            <div className="bg-white rounded-2xl border border-[#E8E2D6] p-4 sm:p-6 space-y-5 shadow-xs">
              <div className="flex items-start gap-3 pb-4 border-b border-[#E8E2D6]">
                <div className="w-10 h-10 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 text-xs text-[#3D3A30] leading-relaxed">
                  <h3 className="font-bold text-sm text-[#3D3A30]">E-Transfer Payment Instructions</h3>
                  <p className="text-[#6B6658]">
                    Payments for booth reservations are processed through E-Transfer. Please send your E-Transfer payment to:
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7566] block">
                    Send E-Transfer Payment To ({recipientName})
                  </span>
                  <div className="font-mono text-sm sm:text-base font-extrabold text-[#3D3A30] break-all select-all mt-0.5">
                    {eTransferEmail}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(eTransferEmail, 'etransfer')}
                    className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'etransfer' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'etransfer' ? 'Copied Email!' : 'Copy Email'}</span>
                  </button>
                  <a
                    href={`mailto:${encodeURIComponent(eTransferEmail)}?subject=${encodeURIComponent(`E-Transfer Confirmation: ${invoice.invoiceNumber} - ${invoice.recipientBusinessName}`)}`}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F0EBE0] border border-[#E8E2D6] text-[#5A5A40] text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              <p className="text-xs text-[#6B6658] leading-relaxed">
                After completing your payment, kindly send us the answer to your security question (or confirmation details if no security question is required) so we can verify your payment and confirm your booth reservation. Thank you, and we look forward to having you at the event.
              </p>

              {/* Submit E-Transfer Security Question Answer Form */}
              <form onSubmit={handleSubmitProof} className="p-4 sm:p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6] space-y-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#5A5A40]" />
                  <h4 className="font-bold text-xs text-[#3D3A30] uppercase tracking-wider">
                    Submit Security Question Answer / Confirmation Details
                  </h4>
                </div>

                {submitError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#3D3A30] mb-1">
                      Security Question Answer / Confirmation Details *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Festival2026 or Autodeposit ref"
                      value={securityAnswer}
                      onChange={(e) => {
                        setSecurityAnswer(e.target.value);
                        setSubmitError(null);
                      }}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#3D3A30] mb-1">
                      E-Transfer Sender Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder={invoice.recipientEmail || 'your@email.com'}
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#7A7566] mb-1 text-xs">
                    Additional Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Optional security question prompt or bank confirmation note..."
                    value={proofNote}
                    onChange={(e) => setProofNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingProof || !securityAnswer.trim()}
                    className="px-6 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingProof ? 'Submitting...' : 'Submit Security Answer'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8E2D6] flex items-center justify-between text-xs text-[#7A7566]">
          <span>
            E-Transfer Desk: <strong className="text-[#3D3A30]">{eTransferEmail}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#3D3A30] font-bold transition-colors cursor-pointer"
          >
            Close Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
