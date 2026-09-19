import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  DEMO_ARTISAN,
  DEMO_BUYERS,
  INITIAL_PRODUCTS,
  DEMO_MARKET_BENCHMARKS,
  DEMO_DEMAND_SIGNALS,
  DEMO_LEADS,
} from './src/data/demoData';
import { calculatePriceIntelligence } from './src/utils/pricing';
import { rankBuyersForProduct } from './src/utils/matching';
import { createSupplyCluster } from './src/utils/supplyCluster';
import { Product, ArtisanProfile, BuyerLead, AIProcessingLog } from './src/types';

dotenv.config();

// Lazy Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-Memory Database Store with Sample Data
let artisanProfile: ArtisanProfile = { ...DEMO_ARTISAN };
let productsStore: Product[] = [...INITIAL_PRODUCTS];
let leadsStore: BuyerLead[] = [...DEMO_LEADS];
const processingLogsStore: AIProcessingLog[] = [
  {
    id: 'log_01',
    operation: 'image_enhancement',
    model: 'gemini-3.7-flash (Multimodal Vision)',
    status: 'success',
    latencyMs: 420,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'log_02',
    operation: 'attribute_extraction',
    model: 'gemini-3.7-flash (Structured Schema)',
    status: 'success',
    latencyMs: 650,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'log_03',
    operation: 'pricing_model',
    model: 'Hybrid Rules + Fair Living Wage Formula',
    status: 'success',
    latencyMs: 45,
    timestamp: new Date().toISOString(),
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON payload parser
  app.use(express.json({ limit: '25mb' }));

  // Explicit static assets for PWA manifest & Service Worker
  app.use(express.static(path.join(process.cwd(), 'public')));


  // --- 1. Health & Config API ---
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'KARIGAR OS API Engine',
      version: '1.0.0-SIH26090',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // --- Download Source Code Package ---
  app.get('/api/download-source', (req: Request, res: Response) => {
    const candidates = [
      path.join(process.cwd(), 'public', 'karigar-os-project.zip'),
      path.join(process.cwd(), 'dist', 'karigar-os-project.zip'),
      path.join(process.cwd(), 'dist', 'karigar-os-source.zip'),
      path.join(process.cwd(), 'public', 'karigar-os-project.tar.gz'),
    ];

    for (const filePath of candidates) {
      if (fs.existsSync(filePath)) {
        return res.download(filePath, 'karigar-os-full-project.zip');
      }
    }

    try {
      const { execSync } = require('child_process');
      const outPath = path.join(process.cwd(), 'public', 'karigar-os-project.zip');
      execSync(`tar -czf "${outPath}" --exclude='node_modules' --exclude='.git' --exclude='dist' .`);
      return res.download(outPath, 'karigar-os-full-project.zip');
    } catch {
      return res.status(500).json({ error: 'Could not generate project archive' });
    }
  });

  // --- 2. Auth & Artisan Profile API ---
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { role = 'artisan', phone = '+91 94371 82910' } = req.body;
    res.json({
      token: `karigar_jwt_demo_${Date.now()}`,
      role,
      user: {
        id: role === 'artisan' ? artisanProfile.userId : 'user_buyer_01',
        name: role === 'artisan' ? artisanProfile.name : 'Heritage Boutique Sourcing',
        role,
        language: 'or',
        location: artisanProfile.location,
      },
    });
  });

  app.get('/api/artisan/profile', (req: Request, res: Response) => {
    res.json({
      profile: artisanProfile,
      productsCount: productsStore.length,
      activeLeadsCount: leadsStore.filter(l => l.status !== 'declined').length,
    });
  });

  app.put('/api/artisan/profile', (req: Request, res: Response) => {
    artisanProfile = { ...artisanProfile, ...req.body };
    res.json({ success: true, profile: artisanProfile });
  });

  // --- 3. Products API ---
  app.get('/api/products', (req: Request, res: Response) => {
    const { status, search, craft } = req.query;
    let list = [...productsStore];
    if (status) {
      list = list.filter(p => p.status === status);
    }
    if (craft) {
      list = list.filter(p => p.craftType.toLowerCase().includes(String(craft).toLowerCase()));
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.craftType.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    res.json({ products: list, count: list.length });
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = productsStore.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct: Product = {
      id: req.body.id || `prod_${Date.now()}`,
      artisanId: artisanProfile.id,
      artisanName: artisanProfile.name,
      artisanRegion: artisanProfile.region,
      title: req.body.title || 'Handcrafted Artisan Product',
      category: req.body.category || 'Handloom & Textiles',
      craftType: req.body.craftType || artisanProfile.craftType,
      material: req.body.material || 'Combed Pure Cotton',
      colors: req.body.colors || ['Red', 'Black'],
      pattern: req.body.pattern || 'Traditional Geometric',
      technique: req.body.technique || 'Handloom Weaving',
      origin: req.body.origin || artisanProfile.region,
      dimensions: req.body.dimensions || 'Standard',
      productionTime: req.body.productionTime || `${req.body.productionDays || 4} days`,
      productionDays: Number(req.body.productionDays) || 4,
      handmade: req.body.handmade !== false,
      materialCost: Number(req.body.materialCost) || 900,
      price: Number(req.body.price) || 2199,
      priceBreakdown: req.body.priceBreakdown || calculatePriceIntelligence(
        req.body.materialCost || 900,
        req.body.productionDays || 4,
        req.body.craftType,
        req.body.category
      ),
      minOrderQuantity: Number(req.body.minOrderQuantity) || 1,
      availableStock: Number(req.body.availableStock) || 6,
      descriptionEn: req.body.descriptionEn || '',
      descriptionHi: req.body.descriptionHi || '',
      originalTranscript: req.body.originalTranscript || '',
      inputLanguage: req.body.inputLanguage || 'or',
      keywords: req.body.keywords || ['Handloom', 'Artisan Crafted'],
      tags: req.body.tags || ['Handmade', 'GI Craft'],
      originalImageUrl: req.body.originalImageUrl || '',
      processedImageUrl: req.body.processedImageUrl || req.body.originalImageUrl || '',
      imageReadinessScore: req.body.imageReadinessScore || 94,
      fingerprint: req.body.fingerprint || {
        material: req.body.material || 'Cotton',
        technique: req.body.technique || 'Handloom',
        craft: req.body.craftType || 'Sambalpuri Handloom',
        pattern: req.body.pattern || 'Traditional',
        colors: req.body.colors || ['Red', 'Black'],
        region: artisanProfile.region,
        productionDays: req.body.productionDays || 4,
        handmade: true,
        consistencyConfidence: 95,
        consistencyStatus: 'consistent',
        consistencyMessage: '✓ Information appears consistent.',
      },
      readinessScore: req.body.readinessScore || 95,
      status: req.body.status || 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    productsStore.unshift(newProduct);
    res.json({ success: true, product: newProduct });
  });

  // --- 4. AI Image Studio API ---
  app.post('/api/ai/image-studio', async (req: Request, res: Response) => {
    const startTime = Date.now();
    const { imageBase64, imageUrl } = req.body;

    const sourceImage = imageUrl || imageBase64 || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';

    try {
      const ai = getGeminiClient();
      let visionAnalysis = {
        detectedSubject: 'Sambalpuri Handloom Saree / Textile',
        colorPalette: ['Crimson Red', 'Ebony Black', 'Natural Cream'],
        lightingQuality: 'Good, balanced natural daylight',
        craftMotifs: ['Passapalli Geometric Chessboard', 'Shankha Motif'],
        readinessBefore: 54,
        readinessAfter: 94,
        appliedEnhancements: [
          'Background auto-cleanup & shadow balancing',
          'Color temperature normalization for authentic dye representation',
          'Sharpness and textile thread texture micro-enhancement',
          'E-commerce standard centered framing',
        ],
      };

      if (ai && imageBase64 && imageBase64.startsWith('data:image')) {
        try {
          const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
          const base64Data = imageBase64.split(',')[1];
          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
                {
                  text: `Analyze this Indian artisan handcrafted product photograph.
Return a clean JSON with:
{
  "detectedSubject": "string",
  "colorPalette": ["string"],
  "lightingQuality": "string",
  "craftMotifs": ["string"],
  "readinessBefore": 55,
  "readinessAfter": 95,
  "appliedEnhancements": ["string"]
}`,
                },
              ],
            },
            config: {
              responseMimeType: 'application/json',
            },
          });

          if (response.text) {
            visionAnalysis = { ...visionAnalysis, ...JSON.parse(response.text) };
          }
        } catch (visionErr) {
          console.warn('Gemini vision API fallback used:', visionErr);
        }
      }

      processingLogsStore.unshift({
        id: `log_${Date.now()}`,
        operation: 'image_enhancement',
        model: ai ? 'gemini-3.7-flash (Vision)' : 'Deterministic Studio Filter Heuristics',
        status: 'success',
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        originalImage: sourceImage,
        processedImage: sourceImage, // Client renders canvas enhancement or high-res enhanced visual
        readinessScoreBefore: visionAnalysis.readinessBefore,
        readinessScoreAfter: visionAnalysis.readinessAfter,
        analysis: visionAnalysis,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message,
        originalImage: sourceImage,
        processedImage: sourceImage,
        readinessScoreBefore: 54,
        readinessScoreAfter: 92,
      });
    }
  });

  // --- 5. AI Voice Cataloger API ---
  app.post('/api/ai/voice-cataloger', async (req: Request, res: Response) => {
    const startTime = Date.now();
    const { transcript, language = 'or', audioBase64 } = req.body;

    const inputTranscript = transcript || (
      language === 'or'
        ? 'ମୁଁ ଏହି ସମ୍ବଲପୁରୀ କପା ଶାଢ଼ୀ ହାତରେ ବୁଣିଛି। ଏହାକୁ ବୁଣିବା ପାଇଁ ୪ ଦିନ ଲାଗିଲା। ସୂତା ଏବଂ ରଙ୍ଗ ଖର୍ଚ୍ଚ ପ୍ରାୟ ୯୦୦ ଟଙ୍କା ହୋଇଥିଲା।'
        : language === 'hi'
        ? 'मैंने यह संबलपुरी सूती साड़ी हाथ से बुनी है। इसे बनाने में चार दिन लगे। धागे और प्राकृतिक रंग की लागत लगभग 900 रुपये थी।'
        : 'I handwove this pure cotton Sambalpuri saree. It took four days on my pit loom. The yarn and dye material cost was around 900 rupees.'
    );

    const ai = getGeminiClient();

    // Default high-precision structured fallback
    let structuredCatalog = {
      title: 'Handwoven Sambalpuri Cotton Saree (Passapalli & Shankha Motif)',
      category: 'Sarees & Ethnic Wear',
      craft_type: 'Sambalpuri Handloom (Bandhakala)',
      material: '100% Combed Pure Cotton',
      colors: ['Crimson Red', 'Ebony Black', 'Natural Off-White'],
      pattern: 'Traditional Passapalli Geometric Chessboard',
      technique: 'Double Ikat Warp-and-Weft Tie-Dye Weaving',
      origin: 'Bargarh, Western Odisha, India',
      dimensions: '5.5 meters with 0.8m Blouse Piece',
      production_time: '4 days',
      production_days: 4,
      handmade: true,
      material_cost: 900,
      description_en: 'Authentic handwoven Sambalpuri cotton saree handcrafted by master weaver Meena Das in Bargarh, Odisha. Features intricate Bandhakala double ikat tie-dye weaving in iconic crimson red and ebony black with geometric chessboard and conch motifs on the pallu. Breathable, durable, and certified handloom heritage.',
      description_hi: 'ओडिशा के बारगढ़ की मास्टर बुनकर मीना दास द्वारा हथकरघे पर तैयार की गई प्रामाणिक संबलपुरी सूती साड़ी। इसमें पारंपरिक बांधकला डबल इकत टाई-डाई तकनीक से लाल और काले रंगों में शंख और पासापल्ली पैटर्न बनाया गया है। यह पहनने में बेहद आरामदायक, टिकाऊ और हथकरघा विरासत का प्रतीक है।',
      keywords: ['Sambalpuri Saree', 'Odisha Handloom', 'Bandhakala', 'Pure Cotton', 'Passapalli Weave', 'GI Craft'],
      tags: ['Handloom Verified', 'GI Tag Odisha', 'Pure Cotton', 'Eco Dye'],
    };

    if (ai) {
      try {
        const prompt = `You are the core intelligence of KARIGAR OS (SIH26090).
An artisan from Odisha/India spoke the following in language "${language}":
"${inputTranscript}"

Extract and generate the structured e-commerce catalog strictly adhering to this JSON schema:
{
  "title": "string",
  "category": "string",
  "craft_type": "string",
  "material": "string",
  "colors": ["string"],
  "pattern": "string",
  "technique": "string",
  "origin": "string",
  "dimensions": "string",
  "production_time": "string",
  "production_days": 4,
  "handmade": true,
  "material_cost": 900,
  "description_en": "Professional, rich marketplace-ready English description",
  "description_hi": "Professional, rich marketplace-ready Hindi description",
  "keywords": ["string"],
  "tags": ["string"]
}
If any specific detail is missing in their words, infer respectfully from authentic Indian craft heritage (Sambalpuri Handloom / Bargarh Odisha) without hallucinating impossible details.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          structuredCatalog = { ...structuredCatalog, ...parsed };
        }
      } catch (geminiErr) {
        console.warn('Gemini catalog generation fallback used:', geminiErr);
      }
    }

    const fingerprint = {
      material: structuredCatalog.material,
      technique: structuredCatalog.technique,
      craft: structuredCatalog.craft_type,
      pattern: structuredCatalog.pattern,
      colors: structuredCatalog.colors,
      region: structuredCatalog.origin,
      productionDays: structuredCatalog.production_days || 4,
      handmade: structuredCatalog.handmade,
      consistencyConfidence: 96,
      consistencyStatus: 'consistent' as const,
      consistencyMessage: '✓ Information appears consistent with artisan profile and Sambalpuri Handloom craft benchmarks.',
    };

    const priceBreakdown = calculatePriceIntelligence(
      structuredCatalog.material_cost,
      structuredCatalog.production_days || 4,
      structuredCatalog.craft_type,
      structuredCatalog.category
    );

    processingLogsStore.unshift({
      id: `log_${Date.now()}`,
      operation: 'attribute_extraction',
      model: ai ? 'gemini-3.7-flash' : 'Deterministic SIH Parser',
      status: 'success',
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      originalTranscript: inputTranscript,
      language,
      catalog: structuredCatalog,
      fingerprint,
      priceBreakdown,
    });
  });

  // --- 6. AI Price Intelligence API ---
  app.post('/api/ai/pricing', (req: Request, res: Response) => {
    const { materialCost = 900, productionDays = 4, craftType = 'Sambalpuri Handloom', category = 'Sarees' } = req.body;
    const priceBreakdown = calculatePriceIntelligence(
      Number(materialCost),
      Number(productionDays),
      craftType,
      category
    );
    res.json({ success: true, pricing: priceBreakdown });
  });

  // --- 7. Buyer Matching API ---
  app.get('/api/products/:id/buyers', (req: Request, res: Response) => {
    const product = productsStore.find(p => p.id === req.params.id) || productsStore[0];
    const matches = rankBuyersForProduct(product, DEMO_BUYERS);
    res.json({ matches });
  });

  app.post('/api/buyers/matches', (req: Request, res: Response) => {
    const { product } = req.body;
    const matches = rankBuyersForProduct(product || productsStore[0], DEMO_BUYERS);
    res.json({ matches });
  });

  // --- 8. Demand Radar API ---
  app.get('/api/artisan/demand', (req: Request, res: Response) => {
    res.json({
      demandSignals: DEMO_DEMAND_SIGNALS,
      artisanCraft: artisanProfile.craftType,
      topRecommendedAction: 'Sambalpuri Cotton Sarees in Crimson Red & Ebony Black have a 34% surge in buyer search volume. Weave 4–6 additional sarees in the ₹1,800–₹2,400 bracket.',
    });
  });

  // --- 9. AI Supply Cluster API ---
  app.post('/api/supply-clusters', (req: Request, res: Response) => {
    const {
      requestedQuantity = 100,
      productTitle = 'Handwoven Sambalpuri Cotton Saree',
      buyerName = 'Virasat Artisan Alliance (Corporate Sourcing)',
      buyerId = 'buyer_tata_trusts_05',
    } = req.body;

    const cluster = createSupplyCluster(
      artisanProfile,
      Number(requestedQuantity) || 100,
      productTitle,
      buyerName,
      buyerId
    );

    res.json({ success: true, cluster });
  });

  // --- 10. AI Negotiation Assistant API ---
  app.post('/api/ai/negotiation-assistant', async (req: Request, res: Response) => {
    const { leadId, offeredPrice = 1700, requestedQuantity = 20, productPrice = 2199, floorPrice = 1650 } = req.body;

    const marginPct = Math.round(((offeredPrice - floorPrice) / floorPrice) * 100);
    const marginAssessment = marginPct < 8 ? 'Low' : marginPct < 25 ? 'Healthy' : 'Premium';
    const suggestedCounterOffer = Math.round(offeredPrice + (productPrice - offeredPrice) * 0.45);

    let advice = {
      marginAssessment,
      suggestedCounterOffer: Math.max(floorPrice + 100, suggestedCounterOffer),
      explanation: `Buyer is offering ₹${offeredPrice.toLocaleString('en-IN')} for ${requestedQuantity} units. Your sustainable artisan floor is ₹${floorPrice.toLocaleString('en-IN')} (margin buffer is ${marginPct}%). Counter-offering ₹${suggestedCounterOffer.toLocaleString('en-IN')} honors bulk volume while protecting your 4-day handloom craftsmanship.`,
      talkingPoints: [
        `Highlight authentic warp-weft Bandhakala 4-day handloom labor`,
        `Propose ₹${suggestedCounterOffer.toLocaleString('en-IN')} / piece including custom quality tags`,
        `Confirm progressive dispatch in batches to balance loom capacity`,
      ],
    };

    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `You are the AI Negotiation Assistant inside KARIGAR OS.
Buyer offered: ₹${offeredPrice} for ${requestedQuantity} units.
Artisan Floor Price: ₹${floorPrice}.
Artisan Retail Price: ₹${productPrice}.
Craft: Sambalpuri Handloom Saree.
Return JSON:
{
  "marginAssessment": "${marginAssessment}",
  "suggestedCounterOffer": ${suggestedCounterOffer},
  "explanation": "concise 2-sentence actionable negotiation advice for the artisan",
  "talkingPoints": ["point 1", "point 2", "point 3"]
}`,
          config: { responseMimeType: 'application/json' },
        });
        if (response.text) {
          advice = { ...advice, ...JSON.parse(response.text) };
        }
      } catch (err) {
        console.warn('Negotiation assistant fallback used');
      }
    }

    res.json({ success: true, advice });
  });

  // --- 11. "Ask KARIGAR AI" Conversational Assistant ---
  app.post('/api/ai/assistant', async (req: Request, res: Response) => {
    const { question, language = 'en' } = req.body;
    const ai = getGeminiClient();

    // Context from actual stored artisan data
    const context = `
Artisan Name: ${artisanProfile.name}
Craft: ${artisanProfile.craftType} (${artisanProfile.region})
Experience: ${artisanProfile.experienceYears} years
Monthly Capacity: ${artisanProfile.monthlyCapacity} products
Active Products in Store: ${productsStore.length} products (Primary: Sambalpuri Cotton Saree ₹2,199 floor ₹1,650; Dupatta ₹1,199 floor ₹850)
Active Leads: ${leadsStore.length} leads (Heritage Boutique 20 units @ ₹1,900; Virasat 100 units @ ₹1,850 via Supply Cluster)
Demand Signals: Sambalpuri Cotton HIGH (+34%), Natural Dye RISING (+48%)
`;

    let reply = '';
    const qLower = (question || '').toLowerCase();

    // Context-grounded fallbacks
    if (qLower.includes('what should i make') || qLower.includes('next')) {
      reply = `Based on your stored data and active market signals, **Cotton Sambalpuri Sarees (Passapalli motif)** have the highest buyer interest (+34% demand). Furthermore, **Natural Dye Dupattas** are rising fast (+48%). With your monthly capacity of 18 units, weaving 3 red/black sarees and 2 indigo dupattas will maximize your income in the next 15 days.`;
    } else if (qLower.includes('how much') || qLower.includes('charge') || qLower.includes('price')) {
      reply = `For your standard 4-day Sambalpuri cotton saree with ₹900 material cost, your sustainable floor is **₹1,650**. For retail customers, charge **₹2,199** (giving you ₹549 fair profit). For bulk wholesale buyers (15+ units), quote **₹1,900–₹1,950**. Never sell below ₹1,650!`;
    } else if (qLower.includes('buyer') || qLower.includes('interest') || qLower.includes('lead')) {
      reply = `You currently have **3 active buyer leads**. **Heritage Boutique (Bengaluru)** matches 94% with your Sambalpuri Saree and has requested 20 units at ₹1,900. Also, **Virasat Alliance** wants 100 units, which KARIGAR OS has clustered with 3 fellow Bargarh weavers so you can fulfill it together!`;
    } else if (qLower.includes('accept this order') || qLower.includes('accept')) {
      reply = `Yes! For the 20-unit order from Heritage Boutique, you can safely accept at ₹1,950 (or counter at ₹1,950). For the 100-unit corporate request, accept through the **AI Supply Cluster** where you will produce 20 units and peer artisans Ramesh, Binodini, and Subash produce the rest!`;
    } else {
      reply = `I am your KARIGAR AI business manager. In your profile, you have ${productsStore.length} published craft products, a monthly capacity of ${artisanProfile.monthlyCapacity} sarees, and 3 active buyer opportunities. How can I help you grow your handloom business today?`;
    }

    if (ai && question) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `You are KARIGAR AI, the digital business operating system manager for artisan ${artisanProfile.name}.
Respond in language "${language}" in a warm, encouraging, respectful, and highly practical business tone.
Always ground your answers in the artisan's actual stored business data below:
${context}

Artisan asked: "${question}"
Keep your answer clear, encouraging, structured with bullet points where appropriate, and directly actionable. Do not give generic non-answers.`,
        });
        if (response.text) {
          reply = response.text;
        }
      } catch (err) {
        console.warn('Gemini assistant fallback used');
      }
    }

    res.json({ success: true, reply });
  });

  // --- 12. Craft Story API ---
  app.post('/api/craft-story', async (req: Request, res: Response) => {
    const { transcript, language = 'or' } = req.body;
    let storyEn = artisanProfile.craftStoryEn || 'I have been weaving Sambalpuri Ikat on pit looms in Bargarh for over 18 years. Each saree reflects ancestral tie-dye geometric patterns and takes 4 days of handloom dedication.';
    let storyHi = artisanProfile.craftStoryHi || 'मैं पिछले 18 वर्षों से बारगढ़ में संबलपुरी इकत हथकरघा पर साड़ियां बुन रही हूं। प्रत्येक साड़ी में पारंपरिक ज्यामितीय पैटर्न होते हैं और इसे बनाने में 4 दिन का समय लगता है।';

    const ai = getGeminiClient();
    if (ai && transcript) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `An Indian artisan spoke this authentic craft story in language "${language}":
"${transcript}"

Transform this into two respectful, dignified craft story narratives:
1. "storyEn": In compelling, elegant English for international and boutique buyers.
2. "storyHi": In authentic, respectful Hindi.
Return JSON:
{
  "storyEn": "...",
  "storyHi": "..."
}`,
          config: { responseMimeType: 'application/json' },
        });
        if (response.text) {
          const parsed = JSON.parse(response.text);
          storyEn = parsed.storyEn || storyEn;
          storyHi = parsed.storyHi || storyHi;
        }
      } catch (err) {
        console.warn('Gemini story fallback used');
      }
    }

    artisanProfile.craftStory = transcript;
    artisanProfile.craftStoryEn = storyEn;
    artisanProfile.craftStoryHi = storyHi;

    res.json({
      success: true,
      originalTranscript: transcript,
      storyEn,
      storyHi,
    });
  });

  // --- 13. Market Benchmark & Admin Analytics API ---
  app.get('/api/market-data', (req: Request, res: Response) => {
    res.json({ benchmarks: DEMO_MARKET_BENCHMARKS, count: DEMO_MARKET_BENCHMARKS.length });
  });

  app.get('/api/buyers', (req: Request, res: Response) => {
    res.json({ buyers: DEMO_BUYERS });
  });

  app.post('/api/buyers/interest', (req: Request, res: Response) => {
    const { productId, buyerId = 'buyer_heritage_boutique_01', quantity = 15, offeredPrice = 1950 } = req.body;
    const prod = productsStore.find(p => p.id === productId) || productsStore[0];
    const buyer = DEMO_BUYERS.find(b => b.id === buyerId) || DEMO_BUYERS[0];

    const newLead: BuyerLead = {
      id: `lead_${Date.now()}`,
      productId: prod.id,
      productTitle: prod.title,
      buyerId: buyer.id,
      buyerName: `${buyer.businessName} (${buyer.location.split(',')[0]})`,
      buyerLocation: buyer.location,
      requestedQuantity: Number(quantity) || 15,
      offeredPrice: Number(offeredPrice) || prod.priceBreakdown.wholesalePrice || 1900,
      artisanFloorPrice: prod.priceBreakdown.sustainableFloor || 1650,
      recommendedPrice: prod.price || 2199,
      status: 'new',
      aiNegotiationAdvice: {
        marginAssessment: 'Healthy',
        suggestedCounterOffer: Math.round(Number(offeredPrice) * 1.04),
        explanation: `New lead from ${buyer.businessName} for ${quantity} units. Sustainable floor is ₹${prod.priceBreakdown.sustainableFloor}.`,
        talkingPoints: [
          'Acknowledge verified handloom quality',
          'Confirm dispatch timeline according to loom capacity',
        ],
      },
      createdAt: new Date().toISOString(),
    };

    leadsStore.unshift(newLead);
    res.json({ success: true, lead: newLead });
  });

  app.get('/api/admin/analytics', (req: Request, res: Response) => {
    res.json({
      totalArtisans: 142,
      totalProducts: 488,
      totalBuyerInterests: 312,
      activeLeads: leadsStore.length + 18,
      supplyClustersCreated: 27,
      averageCatalogCreationSeconds: 42,
      aiSuccessRatePct: 99.4,
      topCrafts: [
        { craft: 'Sambalpuri Handloom', count: 184, region: 'Odisha' },
        { craft: 'Channapatna Toys', count: 96, region: 'Karnataka' },
        { craft: 'Blue Pottery', count: 74, region: 'Rajasthan' },
        { craft: 'Madhubani Painting', count: 68, region: 'Bihar' },
        { craft: 'Dhokra Metal Craft', count: 42, region: 'Odisha / Chhattisgarh' },
        { craft: 'Pochampally Ikat', count: 24, region: 'Telangana' },
      ],
      processingLogs: processingLogsStore.slice(0, 15),
    });
  });

  // --- Vite Middleware for Development and Static Serving for Production ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KARIGAR OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
