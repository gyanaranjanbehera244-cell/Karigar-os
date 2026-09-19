import React, { createContext, useContext, useState } from 'react';
import { LanguageCode } from '../../types';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    tagline: 'Speak. Snap. Sell.',
    artisan_dashboard: 'Artisan Business OS',
    add_product: 'Add Product',
    take_photo: 'Take Product Photo',
    describe_product: 'Describe Product',
    my_products: 'My Products',
    buyer_interests: 'Buyer Opportunities',
    demand_radar: 'Demand Radar',
    price_intelligence: 'Price Intelligence',
    craft_profile: 'Artisan Digital Twin',
    craft_passport: 'Digital Craft Passport',
    ask_karigar: 'Ask KARIGAR AI',
    speak_naturally: 'Speak naturally. You do not need to fill a form.',
    analyzing_product: 'Analyzing your craft product with AI...',
    ready_score: 'AI Product Readiness Score',
    use_image: 'Use AI Enhanced Image',
    retake: 'Retake Photo',
    your_words: 'Your Voice Words',
    ai_understood: 'AI Structured Attributes',
    craft_fingerprint: 'Craft Fingerprint',
    sustainable_floor: 'Artisan Floor Price',
    recommended_price: 'Recommended Retail',
    wholesale_price: 'Wholesale B2B Tier',
    why_this_price: 'Why This Price?',
    find_buyers: 'Find Buyers',
    match_score: 'Match Score',
    publish_product: 'Publish to Market',
    supply_cluster: 'AI Supply Cluster',
    what_to_make: 'What should I make next?',
    demo_mode: 'SIH Demo Mode Active',
  },
  hi: {
    tagline: 'बोलें। फोटो लें। बेचें।',
    artisan_dashboard: 'कारीगर बिजनेस डैशबोर्ड',
    add_product: 'नया उत्पाद जोड़ें',
    take_photo: 'उत्पाद की फोटो लें',
    describe_product: 'उत्पाद के बारे में बोलें',
    my_products: 'मेरे उत्पाद',
    buyer_interests: 'खरीदार अवसर',
    demand_radar: 'मांग रडार (डिमांड)',
    price_intelligence: 'सटीक मूल्य अनुमान',
    craft_profile: 'कारीगर डिजिटल ट्विन',
    craft_passport: 'डिजिटल क्राफ्ट पासपोर्ट',
    ask_karigar: 'कारीगर AI से पूछें',
    speak_naturally: 'स्वाभाविक रूप से बोलें। कोई फॉर्म भरने की आवश्यकता नहीं है।',
    analyzing_product: 'AI द्वारा उत्पाद का विश्लेषण हो रहा है...',
    ready_score: 'AI उत्पाद तत्परता स्कोर',
    use_image: 'AI संवर्धित फोटो चुनें',
    retake: 'दोबारा फोटो लें',
    your_words: 'आपकी आवाज के शब्द',
    ai_understood: 'AI द्वारा निकाली गई जानकारी',
    craft_fingerprint: 'क्राफ्ट फिंगरप्रिंट',
    sustainable_floor: 'न्यूनतम टिकाऊ कारीगर मूल्य',
    recommended_price: 'अनुशंसित खुदरा मूल्य',
    wholesale_price: 'थोक B2B मूल्य',
    why_this_price: 'यह मूल्य क्यों?',
    find_buyers: 'खरीदार खोजें',
    match_score: 'मैच स्कोर',
    publish_product: 'मार्केट में प्रकाशित करें',
    supply_cluster: 'AI आपूर्ति क्लस्टर',
    what_to_make: 'मुझे आगे क्या बनाना चाहिए?',
    demo_mode: 'SIH डेमो मोड सक्रिय',
  },
  or: {
    tagline: 'କୁହନ୍ତୁ। ଫଟୋ ଉଠାନ୍ତୁ। ବିକ୍ରି କରନ୍ତୁ।',
    artisan_dashboard: 'କାରିଗର ବିଜନେସ ଡ୍ୟାସବୋର୍ଡ',
    add_product: 'ଉତ୍ପାଦ ଯୋଡ଼ନ୍ତୁ',
    take_photo: 'ଉତ୍ପାଦ ଫଟୋ ଉଠାନ୍ତୁ',
    describe_product: 'ଉତ୍ପାଦ ବିଷୟରେ କୁହନ୍ତୁ',
    my_products: 'ମୋର ଉତ୍ପାଦ ସମୂହ',
    buyer_interests: 'କ୍ରେତା ସୁଯୋଗ',
    demand_radar: 'ଚାହିଦା ରାଡାର୍ (ଡିମାଣ୍ଡ)',
    price_intelligence: 'ଉପଯୁକ୍ତ ମୂଲ୍ୟ ପରାମର୍ଶ',
    craft_profile: 'କାରିଗର ଡିଜିଟାଲ ଟ୍ୱିନ୍',
    craft_passport: 'ଡିଜିଟାଲ କ୍ରାଫ୍ଟ ପାସପୋର୍ଟ',
    ask_karigar: 'କାରିଗର AI କୁ ପଚାରନ୍ତୁ',
    speak_naturally: 'ଆପଣଙ୍କ ଭାଷାରେ ସହଜରେ କୁହନ୍ତୁ। କୌଣସି ଫର୍ମ ଭରିବା ଆବଶ୍ୟକ ନାହିଁ।',
    analyzing_product: 'AI ଦ୍ୱାରା ଉତ୍ପାଦ ବିଶ୍ଳେଷଣ ଚାଲିଛି...',
    ready_score: 'AI ଉତ୍ପାଦ ପ୍ରସ୍ତୁତି ସ୍କୋର',
    use_image: 'AI ଉନ୍ନତ ଫଟୋ ବ୍ୟବହାର କରନ୍ତୁ',
    retake: 'ପୁଣି ଫଟୋ ନିଅନ୍ତୁ',
    your_words: 'ଆପଣଙ୍କ କଥା',
    ai_understood: 'AI ବୁଝିଥିବା ତଥ୍ୟ',
    craft_fingerprint: 'କ୍ରାଫ୍ଟ ଫିଙ୍ଗରପ୍ରିଣ୍ଟ',
    sustainable_floor: 'କାରିଗରଙ୍କ ସର୍ବନିମ୍ନ ମୂଲ୍ୟ',
    recommended_price: 'ପ୍ରସ୍ତାବିତ ଖୁଚୁରା ମୂଲ୍ୟ',
    wholesale_price: 'ହୋଲସେଲ ମୂଲ୍ୟ',
    why_this_price: 'ଏହି ମୂଲ୍ୟ କାହିଁକି?',
    find_buyers: 'କ୍ରେତା ଖୋଜନ୍ତୁ',
    match_score: 'ମ୍ୟାଚ୍ ସ୍କୋର',
    publish_product: 'ବଜାରରେ ପ୍ରକାଶ କରନ୍ତୁ',
    supply_cluster: 'AI ସପ୍ଲାଇ କ୍ଲଷ୍ଟର',
    what_to_make: 'ମୁଁ ଆଗକୁ କଣ ତିଆରି କରିବି?',
    demo_mode: 'SIH ଡେମୋ ମୋଡ୍ ସକ୍ରିୟ',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
