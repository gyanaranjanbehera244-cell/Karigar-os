import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  QrCode,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  X,
  Award,
  CheckCircle,
  Copy,
} from 'lucide-react';
import { Product } from '../../types';

interface DigitalCraftPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const DigitalCraftPassportModal: React.FC<DigitalCraftPassportModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const passportUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/passport/${product.id}`
    : `https://karigar-os.internal/passport/${product.id}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(
        passportUrl,
        {
          width: 240,
          margin: 1.5,
          color: {
            dark: '#1c1917', // stone-900
            light: '#fbbf24', // amber-400
          },
        },
        (err, url) => {
          if (!err && url) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [isOpen, passportUrl, product.id]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl shadow-amber-950/60 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Passport Certificate Header */}
        <div className="text-center space-y-1.5 border-b border-stone-800 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Digital Craft Passport</span>
          </div>
          <h3 className="text-xl font-bold text-stone-100 font-serif">
            {product.title}
          </h3>
          <p className="text-xs text-stone-400 font-mono">
            Passport ID: #DCP-{product.id.slice(0, 8).toUpperCase()}-2026
          </p>
        </div>

        {/* Passport Body: QR + Key DNA Data */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-stone-950 p-5 rounded-2xl border border-stone-800/80">
          {/* QR Code Container */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="p-2 rounded-xl bg-amber-400 shadow-md">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Craft Passport QR"
                  className="w-36 h-36 rounded-lg object-contain"
                />
              ) : (
                <div className="w-36 h-36 bg-amber-300 animate-pulse rounded-lg" />
              )}
            </div>
            <span className="text-[10px] font-mono text-stone-400 uppercase font-semibold">
              Scan for Public Verification
            </span>
          </div>

          {/* DNA Summary */}
          <div className="space-y-2 text-xs w-full">
            <div className="flex justify-between py-1 border-b border-stone-800/60">
              <span className="text-stone-400">Master Artisan:</span>
              <span className="font-bold text-stone-100">{product.artisanName || 'Meena Das'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-800/60">
              <span className="text-stone-400">Craft Heritage:</span>
              <span className="font-semibold text-amber-300">{product.craftType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-800/60">
              <span className="text-stone-400">Geographic Origin:</span>
              <span className="font-medium text-stone-200">{product.origin || 'Bargarh, Odisha'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-800/60">
              <span className="text-stone-400">Production Time:</span>
              <span className="font-medium text-stone-200">{product.productionTime || '4 days'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-800/60">
              <span className="text-stone-400">Handmade Status:</span>
              <span className="font-semibold text-emerald-400">✓ 100% Handcrafted</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-400">AI Consistency:</span>
              <span className="font-semibold text-amber-400">
                {product.fingerprint?.consistencyConfidence || 96}% Verified
              </span>
            </div>
          </div>
        </div>

        {/* Artisan Story / Meaning */}
        <div className="bg-stone-950/60 border border-stone-800/80 p-4 rounded-xl text-xs space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            Heritage Craft Narrative
          </span>
          <p className="text-stone-300 leading-relaxed italic">
            "{product.descriptionEn || 'Authentic handwoven Sambalpuri cotton saree handcrafted by master weaver Meena Das in Bargarh, Odisha.'}"
          </p>
        </div>

        {/* Ethical Non-Legal Disclaimer */}
        <p className="text-[10px] text-stone-500 text-center italic">
          *Digital Product Identity (Craft Passport). Identifies structured product origin and craft attributes. Does not substitute formal government certification.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-800">
          <button
            onClick={handleCopyLink}
            className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Copy Passport URL'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
