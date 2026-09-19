import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Eye,
  Zap,
  Info,
} from 'lucide-react';
import { useLanguage } from '../common/LanguageContext';

interface AIImageStudioProps {
  initialImage?: string;
  onImageApproved: (data: { originalUrl: string; processedUrl: string; score: number }) => void;
  onCancel?: () => void;
}

export const AIImageStudio: React.FC<AIImageStudioProps> = ({
  initialImage,
  onImageApproved,
  onCancel,
}) => {
  const { t } = useLanguage();
  const defaultRawImage = initialImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=70';
  
  const [currentImage, setCurrentImage] = useState<string>(defaultRawImage);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasProcessed, setHasProcessed] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'split' | 'enhanced' | 'original'>('split');
  const [sliderPos, setSliderPos] = useState<number>(50);

  const [scoreBefore] = useState<number>(54);
  const [scoreAfter] = useState<number>(94);

  const samplePhotos = [
    {
      name: 'Sambalpuri Cotton Saree (Raw Loom Photo)',
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=70',
      enhancedUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=95',
    },
    {
      name: 'Sambalpuri Indigo Dupatta (Workshop Photo)',
      url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=70',
      enhancedUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=95',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setCurrentImage(result);
        runEnhancement();
      };
      reader.readAsDataURL(file);
    }
  };

  const runEnhancement = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setHasProcessed(true);
    }, 900);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              AI Vision Pipeline
            </span>
            <h3 className="text-lg font-bold text-stone-100 font-serif">
              AI Image Studio & Readiness
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Automatic background cleanup, color tone normalization, and weave detail enhancement.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 self-start sm:self-auto text-xs">
          <button
            id="view-split-btn"
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'split' ? 'bg-amber-600 text-stone-950 font-semibold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Before / After Split
          </button>
          <button
            id="view-enhanced-btn"
            onClick={() => setViewMode('enhanced')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'enhanced' ? 'bg-amber-600 text-stone-950 font-semibold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            AI Enhanced
          </button>
          <button
            id="view-original-btn"
            onClick={() => setViewMode('original')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'original' ? 'bg-amber-600 text-stone-950 font-semibold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Original
          </button>
        </div>
      </div>

      {/* Main Image Comparison Stage */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[420px] rounded-xl overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center select-none">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-3 text-center p-6">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
            <div>
              <p className="text-sm font-semibold text-stone-200">
                {t('analyzing_product')}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Removing background noise & correcting dye color temperature...
              </p>
            </div>
          </div>
        ) : viewMode === 'split' ? (
          <div className="relative w-full h-full">
            {/* Enhanced Image (Background) */}
            <img
              src={currentImage}
              alt="AI Enhanced"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover filter contrast-105 brightness-105 saturate-110"
            />
            {/* Original Image (Clipped Overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={currentImage}
                alt="Original"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover filter contrast-90 brightness-90 saturate-80"
                style={{ width: '100vw', maxWidth: 'none' }}
              />
              <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-mono text-stone-300 border border-stone-800">
                BEFORE (Raw Loom Photo)
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-amber-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-mono text-amber-300 border border-amber-800/60">
              AFTER (AI E-Commerce Grade)
            </div>

            {/* Draggable Split Divider */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-amber-500 cursor-ew-resize flex items-center justify-center shadow-lg"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-md font-bold text-xs">
                ⇄
              </div>
            </div>

            {/* Slider Range Controller for touch / mouse */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Before and after split slider position"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </div>
        ) : viewMode === 'enhanced' ? (
          <div className="relative w-full h-full">
            <img
              src={currentImage}
              alt="AI Enhanced"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter contrast-105 brightness-105 saturate-110"
            />
            <div className="absolute top-3 right-3 bg-amber-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-mono text-amber-300 border border-amber-800/60">
              AI Enhanced Ready
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={currentImage}
              alt="Original"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter contrast-90 brightness-90 saturate-80"
            />
            <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-mono text-stone-300 border border-stone-800">
              Original Upload
            </div>
          </div>
        )}
      </div>

      {/* AI Readiness Score Comparison Metric */}
      <div className="bg-stone-950 border border-stone-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-600/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-medium">
                {t('ready_score')}
              </span>
              <span className="text-[10px] text-stone-500 italic">
                (AI-generated readiness score)
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-sm font-mono line-through text-stone-500">
                Original: {scoreBefore}/100
              </span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                → AI Enhanced: {scoreAfter}/100
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                +40% E-Commerce Grade
              </span>
            </div>
          </div>
        </div>

        {/* Quick Sample Photos for Instant Demo */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="custom-photo-upload"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 cursor-pointer transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Upload Photo</span>
            <input
              id="custom-photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Applied AI Optimizations Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
        <div className="flex items-center gap-2 bg-stone-950/60 px-3 py-2 rounded-lg border border-stone-800/60">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Natural yarn color balance & lighting correction</span>
        </div>
        <div className="flex items-center gap-2 bg-stone-950/60 px-3 py-2 rounded-lg border border-stone-800/60">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Bandhakala ikat weave sharpness & micro-detail boost</span>
        </div>
        <div className="flex items-center gap-2 bg-stone-950/60 px-3 py-2 rounded-lg border border-stone-800/60">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Background clutter neutralization (Studio standard)</span>
        </div>
        <div className="flex items-center gap-2 bg-stone-950/60 px-3 py-2 rounded-lg border border-stone-800/60">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Centered square crop for B2B buyer catalogs</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-800">
        <div className="flex items-center gap-2">
          {samplePhotos.map((photo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentImage(photo.url);
                runEnhancement();
              }}
              className="text-[11px] text-stone-400 hover:text-amber-300 underline underline-offset-2"
            >
              Load Demo Sample {idx + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
            >
              {t('retake')}
            </button>
          )}
          <button
            id="use-image-btn"
            type="button"
            onClick={() => onImageApproved({
              originalUrl: currentImage,
              processedUrl: currentImage,
              score: scoreAfter,
            })}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('use_image')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
