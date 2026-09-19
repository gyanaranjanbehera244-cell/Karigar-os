import React, { useState } from 'react';
import {
  Mic,
  Sparkles,
  BookOpen,
  Globe2,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../common/LanguageContext';
import { ArtisanProfile } from '../../types';

export const CraftStoryView: React.FC<{ profile: ArtisanProfile }> = ({ profile }) => {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [storyEn, setStoryEn] = useState<string>(
    profile.craftStoryEn ||
      'I have been weaving Sambalpuri Ikat (Bandhakala) on pit looms in Bargarh for over 18 years. Each saree reflects traditional warp-weft tie-dye geometric patterns and takes 4 to 6 days of meticulous handloom craftsmanship.'
  );
  const [storyHi, setStoryHi] = useState<string>(
    profile.craftStoryHi ||
      'मैं पिछले 18 वर्षों से बारगढ़ में संबलपुरी इकत (बांधकला) हथकरघा पर साड़ियां बुन रही हूं। प्रत्येक साड़ी में पारंपरिक ज्यामितीय पैटर्न होते हैं और इसे बनाने में 4 से 6 दिन का समय लगता है।'
  );
  const [originalVoiceText, setOriginalVoiceText] = useState<string>(
    profile.craftStory ||
      'ମୁଁ ୧୮ ବର୍ଷ ଧରି ସମ୍ବଲପୁରୀ ବାନ୍ଧକଳା ବୁଣି ଆସୁଛି। ଆମ ବଂଶାନୁକ୍ରମିକ କଳାକୁ ଜୀବନ୍ତ ରଖିବା ମୋର ସ୍ୱପ୍ନ।'
  );

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-600/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-100 font-serif">
              My Craft Story — Voice to Heritage Narrative
            </h3>
            <p className="text-xs text-stone-400">
              Speak about your heritage and ancestral techniques. AI crafts dignified English and Hindi narratives.
            </p>
          </div>
        </div>
      </div>

      {/* Voice Prompt Box */}
      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsRecording(!isRecording)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <div>
            <p className="text-xs font-bold text-stone-200">
              {isRecording ? 'Listening in Odia / Hindi...' : 'Speak your artisan journey'}
            </p>
            <p className="text-[11px] text-stone-400">
              "I learned Bandhakala from my mother on a wooden pit loom in Bargarh..."
            </p>
          </div>
        </div>
      </div>

      {/* Original Voice Audio Transcript */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase text-stone-400 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Original Spoken Voice Words (ଓଡ଼ିଆ / Hindi)</span>
        </label>
        <div className="bg-stone-950 border border-stone-800 p-3.5 rounded-xl text-xs text-stone-200 italic font-serif leading-relaxed">
          "{originalVoiceText}"
        </div>
      </div>

      {/* Generated Bilingual Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>English Craft Narrative</span>
            <span className="text-[10px] text-stone-400">For Boutique Buyers</span>
          </div>
          <textarea
            rows={5}
            value={storyEn}
            onChange={(e) => setStoryEn(e.target.value)}
            className="w-full bg-transparent text-xs text-stone-200 leading-relaxed border-none focus:outline-none resize-none"
          />
        </div>

        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>हिन्दी शिल्प कथा (Hindi Narrative)</span>
            <span className="text-[10px] text-stone-400">घरेलू मंच हेतु</span>
          </div>
          <textarea
            rows={5}
            value={storyHi}
            onChange={(e) => setStoryHi(e.target.value)}
            className="w-full bg-transparent text-xs text-stone-200 leading-relaxed border-none focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
};
