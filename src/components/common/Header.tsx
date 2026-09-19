import React from 'react';
import {
  Sparkles,
  Mic,
  Camera,
  Layers,
  ShoppingBag,
  ShieldCheck,
  Globe2,
  PlayCircle,
  HelpCircle,
  Download,
} from 'lucide-react';
import { UserRole, LanguageCode } from '../../types';
import { useLanguage } from './LanguageContext';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenDemoTour: () => void;
  onOpenAddProduct: () => void;
  onOpenAskKarigar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  onOpenDemoTour,
  onOpenAddProduct,
  onOpenAskKarigar,
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 p-0.5 shadow-md shadow-amber-900/30 flex items-center justify-center">
              <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-bold text-amber-400 text-xl tracking-tight">K</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-stone-100 font-serif">
                  KARIGAR <span className="text-amber-500 font-sans text-sm uppercase px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">OS</span>
                </h1>
                <span className="hidden sm:inline-flex text-[11px] font-mono text-stone-400 bg-stone-800/80 px-2 py-0.5 rounded-full border border-stone-700/50">
                  SIH26090
                </span>
              </div>
              <p className="text-xs text-amber-200/70 font-medium">
                "{t('tagline')}"
              </p>
            </div>
          </div>

          {/* Mobile Fast Action Buttons */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              id="mobile-add-product-btn"
              onClick={onOpenAddProduct}
              className="p-2 rounded-lg bg-amber-600 text-stone-950 font-semibold text-xs flex items-center gap-1"
            >
              <Camera className="w-4 h-4" />
              <span>+</span>
            </button>
          </div>
        </div>

        {/* Global Controls: Role Switcher + Language Selector + Demo Trigger */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick 3-Min SIH Judge Guide Button */}
          <button
            id="judge-demo-trigger-btn"
            onClick={onOpenDemoTour}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all shadow-sm group"
          >
            <PlayCircle className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>3-Min Judge Demo</span>
          </button>

          {/* Direct Download ZIP Button */}
          <a
            id="nav-download-app-btn"
            href="/api/download-source"
            download="karigar-os-full-project.zip"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all shadow-sm"
            title="Download full application source code ZIP"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download ZIP</span>
          </a>

          {/* Ask Karigar AI Quick Button */}
          <button
            id="nav-ask-karigar-btn"
            onClick={onOpenAskKarigar}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask AI</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center p-1 bg-stone-950/80 rounded-xl border border-stone-800 text-xs">
            <button
              id="role-artisan-btn"
              onClick={() => setCurrentRole('artisan')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                currentRole === 'artisan'
                  ? 'bg-amber-600 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Artisan</span>
            </button>
            <button
              id="role-buyer-btn"
              onClick={() => setCurrentRole('buyer')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                currentRole === 'buyer'
                  ? 'bg-amber-600 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buyer</span>
            </button>
            <button
              id="role-admin-btn"
              onClick={() => setCurrentRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                currentRole === 'admin'
                  ? 'bg-amber-600 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-stone-950/80 p-1 rounded-xl border border-stone-800 text-xs">
            <Globe2 className="w-3.5 h-3.5 text-stone-400 ml-1.5 hidden sm:block" />
            <button
              id="lang-en-btn"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                language === 'en'
                  ? 'bg-stone-700 text-stone-100'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              EN
            </button>
            <button
              id="lang-hi-btn"
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                language === 'hi'
                  ? 'bg-stone-700 text-stone-100'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              हिन्दी
            </button>
            <button
              id="lang-or-btn"
              onClick={() => setLanguage('or')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                language === 'or'
                  ? 'bg-stone-700 text-stone-100'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ଓଡ଼ିଆ
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
