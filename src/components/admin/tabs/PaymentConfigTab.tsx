import React, { useState, useEffect } from 'react';
import {
  Save,
  Check,
  Mail,
  RotateCcw,
  Copy,
  Eye,
  EyeOff,
  ShieldCheck,
  Send
} from 'lucide-react';
import { PaymentConfig } from '../../../types';
import { DEFAULT_ETRANSFER_EMAIL, DEFAULT_ETRANSFER_INSTRUCTIONS } from '../../../lib/firebase';

interface PaymentConfigTabProps {
  config: PaymentConfig;
  onSaveConfig: (config: PaymentConfig) => void;
}

export function PaymentConfigTab({ config, onSaveConfig }: PaymentConfigTabProps) {
  const [form, setForm] = useState<PaymentConfig>({
    ...config,
    eTransferEnabled: config.eTransferEnabled !== false,
    eTransferEmail: config.eTransferEmail || DEFAULT_ETRANSFER_EMAIL,
    eTransferRecipientName: config.eTransferRecipientName || 'Festival Vendor Treasury',
    eTransferInstructions: config.eTransferInstructions || DEFAULT_ETRANSFER_INSTRUCTIONS
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedPreviewEmail, setCopiedPreviewEmail] = useState(false);

  useEffect(() => {
    if (config) {
      setForm({
        ...config,
        eTransferEnabled: config.eTransferEnabled !== false,
        eTransferEmail: config.eTransferEmail || DEFAULT_ETRANSFER_EMAIL,
        eTransferRecipientName: config.eTransferRecipientName || 'Festival Vendor Treasury',
        eTransferInstructions: config.eTransferInstructions || DEFAULT_ETRANSFER_INSTRUCTIONS
      });
    }
  }, [config]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanedEmail = (form.eTransferEmail || '').trim() || DEFAULT_ETRANSFER_EMAIL;
    onSaveConfig({
      ...form,
      eTransferEnabled: form.eTransferEnabled !== false,
      eTransferEmail: cleanedEmail,
      eTransferRecipientName: (form.eTransferRecipientName || '').trim() || 'Festival Vendor Treasury',
      eTransferInstructions: (form.eTransferInstructions || '').trim() || DEFAULT_ETRANSFER_INSTRUCTIONS,
      updatedAt: new Date().toISOString()
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetMessage = () => {
    const email = (form.eTransferEmail || '').trim() || DEFAULT_ETRANSFER_EMAIL;
    setForm({
      ...form,
      eTransferInstructions: `Payments for booth reservations are processed through E-Transfer.

Please send your E-Transfer payment to:

${email}

After completing your payment, kindly send us the answer to your security question (or confirmation details if no security question is required) so we can verify your payment and confirm your booth reservation.

Thank you, and we look forward to having you at the event.`
    });
  };

  const activeEmail = (form.eTransferEmail || '').trim() || DEFAULT_ETRANSFER_EMAIL;

  const handleCopyPreviewEmail = () => {
    navigator.clipboard.writeText(activeEmail);
    setCopiedPreviewEmail(true);
    setTimeout(() => setCopiedPreviewEmail(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#5A5A40] text-white">
              <Mail className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-lg text-[#3D3A30]">E-Transfer Payment Configuration</h2>
          </div>
          <p className="text-xs text-[#7A7566]">
            Set the official E-Transfer email and booth payment instructions displayed to vendors after submitting an application and inside the Vendor Tracker dialog.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'Saved to Firestore!' : 'Save E-Transfer Config'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Configuration Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
            <div>
              <h3 className="font-bold text-sm text-[#3D3A30]">E-Transfer Recipient &amp; Instructions</h3>
              <p className="text-[11px] text-[#7A7566]">
                Changes sync immediately to Vendor Application confirmations, Invoices, and Vendor Tracker.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, eTransferEnabled: !(form.eTransferEnabled !== false) })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                form.eTransferEnabled !== false
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              {form.eTransferEnabled !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{form.eTransferEnabled !== false ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#3D3A30] mb-1">
                E-Transfer Payment Email *
              </label>
              <input
                type="email"
                required
                placeholder="festvendorstate@gmail.com"
                value={form.eTransferEmail || ''}
                onChange={(e) => setForm({ ...form, eTransferEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FAF8F5] font-mono text-xs text-[#3D3A30] font-bold focus:border-[#5A5A40] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3D3A30] mb-1">
                Recipient Display Name
              </label>
              <input
                type="text"
                placeholder="Festival Vendor Treasury"
                value={form.eTransferRecipientName || ''}
                onChange={(e) => setForm({ ...form, eTransferRecipientName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FAF8F5] text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#3D3A30]">
                E-Transfer Payment Instructions (Shown to Vendors)
              </label>
              <button
                type="button"
                onClick={handleResetMessage}
                className="px-2.5 py-1 rounded-lg bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Default Message</span>
              </button>
            </div>
            <textarea
              rows={9}
              value={form.eTransferInstructions || ''}
              onChange={(e) => setForm({ ...form, eTransferInstructions: e.target.value })}
              className="w-full p-3.5 rounded-xl border border-[#E8E2D6] bg-[#FAF8F5] text-xs text-[#3D3A30] leading-relaxed focus:border-[#5A5A40] outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#E8E2D6]">
            <span className="text-[11px] text-[#7A7566] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>All booth invoices &amp; tracker prompts route through this E-Transfer email.</span>
            </span>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Right: Live Vendor View Preview */}
        <div className="lg:col-span-5 bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white border border-[#E8E2D6] text-[#5A5A40]">
              Live Vendor View Preview
            </span>
            <span className="text-[11px] text-[#7A7566]">As shown in Vendor Tracker &amp; Confirmation</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E2D6] p-4 sm:p-5 space-y-4 text-xs shadow-xs">
            <p className="text-[#3D3A30] leading-relaxed">
              Payments for booth reservations are processed through E-Transfer. Please send your E-Transfer payment to:
            </p>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D6] flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7566] block">
                  {form.eTransferRecipientName || 'Festival Vendor Treasury'}
                </span>
                <span className="font-mono font-bold text-sm text-[#3D3A30] break-all">
                  {activeEmail}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyPreviewEmail}
                className="px-3 py-1.5 rounded-lg bg-[#5A5A40] text-white text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copiedPreviewEmail ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPreviewEmail ? 'Copied!' : 'Copy Email'}</span>
              </button>
            </div>

            <p className="text-[#6B6658] leading-relaxed">
              After completing your payment, kindly send us the answer to your security question (or confirmation details if no security question is required) so we can verify your payment and confirm your booth reservation. Thank you, and we look forward to having you at the event.
            </p>

            <div className="pt-3 border-t border-[#E8E2D6] space-y-2 opacity-85">
              <label className="block text-[11px] font-bold text-[#3D3A30]">
                Security Question Answer / Confirmation Details *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="Festival2026"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FAF8F5] text-xs text-[#7A7566]"
                />
                <span className="px-3 py-2 rounded-xl bg-[#5A5A40] text-white text-[11px] font-bold flex items-center gap-1">
                  <Send className="w-3 h-3" /> Submit
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
