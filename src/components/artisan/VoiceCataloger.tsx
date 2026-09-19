import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  Edit3,
  RotateCcw,
  Globe2,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../common/LanguageContext';
import { LanguageCode } from '../../types';

interface VoiceCatalogerProps {
  onCatalogExtracted: (result: {
    transcript: string;
    language: LanguageCode;
    catalog: any;
    fingerprint: any;
    priceBreakdown: any;
  }) => void;
  isProcessing?: boolean;
}

export const VoiceCataloger: React.FC<VoiceCatalogerProps> = ({
  onCatalogExtracted,
  isProcessing = false,
}) => {
  const { language: currentLang, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('or');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>(
    'ମୁଁ ଏହି ସମ୍ବଲପୁରୀ କପା ଶାଢ଼ୀ ହାତରେ ବୁଣିଛି। ଏହାକୁ ବୁଣିବା ପାଇଁ ୪ ଦିନ ଲାଗିଲା। ସୂତା ଏବଂ ରଙ୍ଗ ଖର୍ଚ୍ଚ ପ୍ରାୟ ୯୦୦ ଟଙ୍କା ହୋଇଥିଲା।'
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Authentic demo voice samples in 3 languages
  const sampleVoicePhrases: Record<LanguageCode, { text: string; label: string; translationNote: string }> = {
    or: {
      text: 'ମୁଁ ଏହି ସମ୍ବଲପୁରୀ କପା ଶାଢ଼ୀ ହାତରେ ବୁଣିଛି। ଏହାକୁ ବୁଣିବା ପାଇଁ ୪ ଦିନ ଲାଗିଲା। ସୂତା ଏବଂ ରଙ୍ଗ ଖର୍ଚ୍ଚ ପ୍ରାୟ ୯୦୦ ଟଙ୍କା ହୋଇଥିଲା।',
      label: 'ଓଡ଼ିଆ (Odia Sample — Sambalpuri Saree)',
      translationNote: 'Transcribed from Odia: "I handwove this Sambalpuri cotton saree. It took 4 days. Yarn & dye cost was ~₹900."',
    },
    hi: {
      text: 'मैंने यह संबलपुरी सूती साड़ी हथकरघे पर बनाई है। इसमें लाल और काले रंग का पासापल्ली पैटर्न है। इसे बनाने में 4 दिन लगे और सामग्री की लागत 900 रुपये थी।',
      label: 'हिन्दी (Hindi Sample — Sambalpuri Weave)',
      translationNote: 'Transcribed from Hindi: "I handwove this Sambalpuri cotton saree with red & black Passapalli pattern. Took 4 days, material cost ₹900."',
    },
    en: {
      text: 'I handwove this pure combed cotton Sambalpuri saree with traditional Passapalli tie-dye pattern in Bargarh. It took four days of pit loom work. My raw material cost was 900 rupees.',
      label: 'English (English Spoken Sample)',
      translationNote: 'Spoken in English directly.',
    },
  };

  useEffect(() => {
    setTranscript(sampleVoicePhrases[selectedLanguage].text);
  }, [selectedLanguage]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate real speech-to-text completion
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
      }, 4000);
    }
  };

  const handleExtractCatalog = async () => {
    const structuredCatalog = {
      title: 'Handwoven Sambalpuri Cotton Saree (Passapalli & Shankha Motif)',
      category: 'Sarees & Ethnic Wear',
      craft_type: 'Sambalpuri Handloom (Bandhakala)',
      material: '100% Combed Pure Cotton',
      colors: ['Crimson Red', 'Ebony Black', 'Natural Off-White'],
      pattern: 'Traditional Passapalli Geometric Chessboard',
      technique: 'Double Ikat Warp-and-Weft Tie-Dye Weaving',
      origin: 'Bargarh, Western Odisha, India',
      dimensions: '5.5 meters length x 1.18m width (with 0.8m Blouse Piece)',
      production_time: '4 days',
      production_days: 4,
      handmade: true,
      material_cost: 900,
      description_en: 'Authentic handwoven Sambalpuri cotton saree handcrafted by master weaver Meena Das in Bargarh, Odisha. Features intricate Bandhakala double ikat tie-dye weaving in iconic crimson red and ebony black with geometric chessboard and conch motifs on the pallu. Breathable, durable, and certified handloom heritage.',
      description_hi: 'ओडिशा के बारगढ़ की मास्टर बुनकर मीना दास द्वारा हथकरघे पर तैयार की गई प्रामाणिक संबलपुरी सूती साड़ी। इसमें पारंपरिक बांधकला डबल इकत टाई-डाई तकनीक से लाल और काले रंगों में शंख और पासापल्ली पैटर्न बनाया गया है। यह पहनने में बेहद आरामदायक, टिकाऊ और हथकरघा विरासत का प्रतीक है।',
      keywords: ['Sambalpuri Saree', 'Odisha Handloom', 'Bandhakala', 'Pure Cotton', 'Passapalli Weave', 'GI Craft'],
      tags: ['Handloom Verified', 'GI Tag Odisha', 'Pure Cotton', 'Eco Dye'],
    };

    const fingerprint = {
      material: '100% Combed Pure Cotton',
      technique: 'Double Ikat Warp-and-Weft Tie-Dye Weaving',
      craft: 'Sambalpuri Handloom (Bandhakala)',
      pattern: 'Traditional Passapalli Geometric Chessboard',
      colors: ['Crimson Red', 'Ebony Black', 'Natural Off-White'],
      region: 'Bargarh, Western Odisha, India',
      productionDays: 4,
      handmade: true,
      consistencyConfidence: 96,
      consistencyStatus: 'consistent' as const,
      consistencyMessage: '✓ Information appears consistent with artisan profile and Sambalpuri Handloom craft benchmarks.',
    };

    onCatalogExtracted({
      transcript,
      language: selectedLanguage,
      catalog: structuredCatalog,
      fingerprint,
      priceBreakdown: null, // Will be computed in wizard
    });
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Voice-First Cataloger
            </span>
            <h3 className="text-lg font-bold text-stone-100 font-serif">
              Tell us about your product
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            "{t('speak_naturally')}"
          </p>
        </div>

        {/* Spoken Language Selector */}
        <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
          <Globe2 className="w-3.5 h-3.5 text-stone-400 ml-1.5" />
          <button
            id="voice-lang-or"
            type="button"
            onClick={() => setSelectedLanguage('or')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedLanguage === 'or' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            ଓଡ଼ିଆ
          </button>
          <button
            id="voice-lang-hi"
            type="button"
            onClick={() => setSelectedLanguage('hi')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedLanguage === 'hi' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            हिन्दी
          </button>
          <button
            id="voice-lang-en"
            type="button"
            onClick={() => setSelectedLanguage('en')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedLanguage === 'en' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Big Tactile Microphone Area */}
      <div className="flex flex-col items-center justify-center p-6 bg-stone-950 rounded-2xl border border-stone-800/80 text-center space-y-4">
        {/* Animated Waveform / Mic Pulse */}
        <div className="relative flex items-center justify-center">
          {isRecording && (
            <div className="absolute w-28 h-28 rounded-full bg-red-500/20 animate-ping" />
          )}
          <button
            id="record-audio-btn"
            type="button"
            onClick={handleToggleRecord}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isRecording
                ? 'bg-red-600 text-white shadow-red-900/50 scale-105'
                : 'bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-900/40 hover:scale-105'
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        {/* Status / Waveform Animation */}
        <div>
          {isRecording ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1">
                <span className="w-1.5 h-6 bg-red-500 animate-pulse rounded-full" />
                <span className="w-1.5 h-10 bg-red-400 animate-pulse rounded-full delay-75" />
                <span className="w-1.5 h-8 bg-red-500 animate-pulse rounded-full delay-150" />
                <span className="w-1.5 h-12 bg-amber-400 animate-pulse rounded-full delay-100" />
                <span className="w-1.5 h-7 bg-red-500 animate-pulse rounded-full delay-200" />
                <span className="w-1.5 h-4 bg-red-400 animate-pulse rounded-full" />
              </div>
              <p className="text-xs font-mono text-red-400 font-semibold">
                ● Recording ({recordingSeconds}s)... Speak naturally
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-stone-200">
                Tap the microphone to speak
              </p>
              <p className="text-xs text-stone-400 max-w-sm">
                Example: "I made this Sambalpuri cotton saree by hand. It took four days. The material cost was around 900 rupees."
              </p>
            </div>
          )}
        </div>

        {/* Quick Language Sample Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {(['or', 'hi', 'en'] as LanguageCode[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setSelectedLanguage(lang)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                selectedLanguage === lang
                  ? 'bg-stone-800 text-amber-300 border-amber-500/50'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-300'
              }`}
            >
              <Volume2 className="w-3 h-3 inline mr-1 text-amber-400" />
              <span>{sampleVoicePhrases[lang].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transcription Display: "YOUR WORDS" */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            <span>YOUR WORDS (Speech Transcription)</span>
          </label>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
          </button>
        </div>

        {isEditing ? (
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={3}
            className="w-full bg-stone-950 border border-amber-600/50 rounded-xl p-3 text-sm text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        ) : (
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 text-sm text-stone-200 font-medium leading-relaxed">
            "{transcript}"
            <div className="mt-2 pt-2 border-t border-stone-800/80 text-xs text-stone-400 italic">
              {sampleVoicePhrases[selectedLanguage].translationNote}
            </div>
          </div>
        )}
      </div>

      {/* Action Button: AI Attribute Extraction */}
      <div className="flex items-center justify-end pt-2 border-t border-stone-800">
        <button
          id="extract-attributes-btn"
          type="button"
          disabled={isProcessing}
          onClick={handleExtractCatalog}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-900/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isProcessing ? 'Extracting Attributes...' : 'Extract AI Attributes & Fingerprint →'}</span>
        </button>
      </div>
    </div>
  );
};
