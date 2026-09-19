import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './components/common/LanguageContext';
import { Header } from './components/common/Header';
import { ArtisanDashboard } from './components/artisan/ArtisanDashboard';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LandingPage } from './components/landing/LandingPage';
import { JudgeDemoGuide } from './components/demo/JudgeDemoGuide';
import { AskKarigarChat } from './components/artisan/AskKarigarChat';
import { UserRole } from './types';
import { Sparkles, Heart, Smartphone, Download, Check } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('artisan');
  const [showDemoTour, setShowDemoTour] = useState<boolean>(false);
  const [showAskKarigarModal, setShowAskKarigarModal] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install on Android:\n1. Tap the 3 dots (⋮) in Chrome\n2. Tap "Install app" or "Add to Home screen"');
    }
  };

  const handleJumpToStep = (stepKey: string) => {
    if (stepKey === 'add_product' || stepKey === 'craft_fingerprint' || stepKey === 'pricing' || stepKey === 'supply_cluster' || stepKey === 'craft_passport') {
      setCurrentRole('artisan');
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
        {/* Mobile Install Top Banner */}
        {!isInstalled && (
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 px-3 py-2 text-xs font-semibold flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 shrink-0 text-stone-950" />
              <span>Install KARIGAR OS App directly on your Android phone</span>
            </div>
            <button
              onClick={handleInstallClick}
              className="px-3 py-1 bg-stone-950 hover:bg-stone-900 text-amber-300 font-bold rounded-lg text-[11px] flex items-center gap-1.5 shadow transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          </div>
        )}

        {/* Global Navigation Header */}
        <Header
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          onOpenDemoTour={() => setShowDemoTour(true)}
          onOpenAddProduct={() => {
            setCurrentRole('artisan');
          }}
          onOpenAskKarigar={() => setShowAskKarigarModal(true)}
        />

        {/* Main Application View based on selected role */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentRole === 'artisan' && (
            <ArtisanDashboard onOpenJudgeDemo={() => setShowDemoTour(true)} />
          )}

          {currentRole === 'buyer' && <BuyerDashboard />}

          {currentRole === 'admin' && <AdminDashboard />}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-stone-800/80 bg-stone-950 px-4 py-6 text-center text-xs text-stone-400 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-serif font-bold text-stone-200">KARIGAR OS</span>
            <span>•</span>
            <span className="text-amber-400">Smart India Hackathon SIH26090</span>
            <span>•</span>
            <span>AI Business Manager for Marginalized Artisans</span>
          </div>
          <p className="text-[11px] text-stone-400">
            Powered by Gemini Multimodal Vision & Audio • Made with fair wage benchmarks for Indian master weavers.
          </p>
        </footer>

        {/* 3-Minute Judge Evaluation Demo Walkthrough Modal */}
        <JudgeDemoGuide
          isOpen={showDemoTour}
          onClose={() => setShowDemoTour(false)}
          onJumpToStep={handleJumpToStep}
        />

        {/* Ask KARIGAR AI Popup Modal */}
        {showAskKarigarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
            <div className="bg-stone-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowAskKarigarModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
              >
                ✕
              </button>
              <AskKarigarChat />
            </div>
          </div>
        )}
      </div>
    </LanguageProvider>
  );
}
