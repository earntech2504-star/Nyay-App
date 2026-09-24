import { Router, type IRouter, type Request } from "express";
import OpenAI from "openai";
import {
  CreateLegalRequestBody,
  CreateLegalRequestResponse,
  GetLegalGuidanceBody,
  GetLegalGuidanceResponse,
  GetLegalOverviewResponse,
  ListCaseModelsResponse,
  ListNewsFeedsResponse,
} from "@workspace/api-zod";
import { supabaseProxy } from "../lib/supabase";

const router: IRouter = Router();

const caseModels = [
  {
    id: "cheque-bounce",
    title: "चेक बाउंस",
    subtitle: "धारा 138 NI Act",
    category: "वित्तीय विवाद",
    startingFee: "₹2,999 से",
    turnaround: "24 घंटे में समीक्षा",
    description: "कानूनी नोटिस, जवाब और शिकायत की रणनीति के लिए विशेषज्ञ सहायता।",
  },
  {
    id: "mv-act",
    title: "MV Act",
    subtitle: "ट्रैफिक व मोटर वाहन मामले",
    category: "आपराधिक / ट्रैफिक",
    startingFee: "₹1,499 से",
    turnaround: "उसी दिन मार्गदर्शन",
    description: "चालान, लाइसेंस, दुर्घटना और मुआवज़ा मामलों में स्पष्ट अगला कदम।",
  },
  {
    id: "bail",
    title: "बेल",
    subtitle: "जमानत आवेदन व पैरवी",
    category: "आपराधिक कानून",
    startingFee: "₹4,999 से",
    turnaround: "तत्काल परामर्श",
    description: "जमानत विकल्प, दस्तावेज़ और कोर्ट-रेडी तैयारी में साथ।",
  },
  {
    id: "civil-recovery",
    title: "सिविल रिकवरी",
    subtitle: "बकाया राशि की वसूली",
    category: "सिविल विवाद",
    startingFee: "₹3,999 से",
    turnaround: "48 घंटे में योजना",
    description: "डिमांड नोटिस से सिविल कार्रवाई तक व्यावहारिक रिकवरी प्लान।",
  },
  {
    id: "cyber-fraud",
    title: "साइबर फ्रॉड",
    subtitle: "डिजिटल धोखाधड़ी सहायता",
    category: "साइबर अपराध",
    startingFee: "₹2,499 से",
    turnaround: "तुरंत रिस्पॉन्स",
    description: "1930 रिपोर्टिंग, बैंक समन्वय और शिकायत दस्तावेज़ीकरण में मदद।",
  },
  {
    id: "family-court",
    title: "फैमिली कोर्ट",
    subtitle: "परिवार व वैवाहिक विवाद",
    category: "पारिवारिक कानून",
    startingFee: "₹3,499 से",
    turnaround: "24 घंटे में बातचीत",
    description: "भरण-पोषण, कस्टडी और वैवाहिक विवादों में संवेदनशील सहायता।",
  },
  {
    id: "pension-scheme",
    title: "पेंशन स्कीम",
    subtitle: "पेंशन व सरकारी लाभ",
    category: "सेवा व प्रशासनिक",
    startingFee: "₹1,999 से",
    turnaround: "72 घंटे में जांच",
    description: "पेंशन रोक, पात्रता और विभागीय अपील के लिए दस्तावेज़ समीक्षा।",
  },
];

const fallbackNews = [
  {
    id: "dj-lucknow",
    source: "दैनिक जागरण",
    title: "लखनऊ में नागरिक सेवाओं और यातायात व्यवस्था से जुड़े नए अपडेट",
    timestamp: "आज",
    href: "https://www.jagran.com/uttar-pradesh/lucknow-news-hindi.html",
    accent: "#E6A84B",
  },
  {
    id: "au-lucknow",
    source: "अमर उजाला",
    title: "उत्तर प्रदेश में प्रशासनिक फैसलों और स्थानीय मामलों की ताज़ा खबरें",
    timestamp: "आज",
    href: "https://www.amarujala.com/uttar-pradesh/lucknow",
    accent: "#7C6AE6",
  },
  {
    id: "toi-lucknow",
    source: "Times of India",
    title: "Lucknow city desk: civic, court and public-interest updates",
    timestamp: "आज",
    href: "https://timesofindia.indiatimes.com/city/lucknow",
    accent: "#2F74B5",
  },
];

const rssSources = [
  {
    source: "दैनिक जागरण",
    url: "https://www.jagran.com/rss/uttar-pradesh/lucknow-news.xml",
    accent: "#E6A84B",
    href: "https://www.jagran.com/uttar-pradesh/lucknow-news-hindi.html",
  },
  {
    source: "अमर उजाला",
    url: "https://www.amarujala.com/rss/uttar-pradesh/lucknow.xml",
    accent: "#7C6AE6",
    href: "https://www.amarujala.com/uttar-pradesh/lucknow",
  },
  {
    source: "Times of India",
    url: "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",
    accent: "#2F74B5",
    href: "https://timesofindia.indiatimes.com/city/lucknow",
  },
];

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function parseRss(source: (typeof rssSources)[number], xml: string) {
  const items = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)];
  return items.slice(0, 8).map((match, index) => {
    const block = match[1];
    const read = (tag: string) =>
      decodeXml(block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] ?? "");
    const title = read("title") || "लखनऊ से नई खबर";
    const href = read("link") || source.href;
    const locationText = `${title} ${href}`.toLowerCase();
    if (
      source.source === "Times of India" &&
      !locationText.includes("lucknow") &&
      !locationText.includes("uttar-pradesh")
    ) {
      return null;
    }
    return {
      id: `${source.source}-${index}-${read("guid") || read("link")}`,
      source: source.source,
      title,
      timestamp: read("pubDate") || "अभी",
      href,
      accent: source.accent,
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null).slice(0, 4);
}

async function getLiveNews(req: Request) {
  const results = await Promise.all(
    rssSources.map(async (source) => {
      try {
        const response = await fetch(source.url, {
          headers: { "user-agent": "NyayaSathi/1.0 RSS reader" },
          signal: AbortSignal.timeout(4500),
        });
        if (!response.ok) return [];
        return parseRss(source, await response.text());
      } catch (error) {
        req.log.warn({ error, source: source.source }, "RSS source unavailable");
        return [];
      }
    }),
  );
  const liveItems = results.flat();
  const sourcesWithNews = new Set(liveItems.map((item) => item.source));
  const sourceFallbacks = fallbackNews.filter((item) => !sourcesWithNews.has(item.source));
  return [...liveItems, ...sourceFallbacks];
}

router.get("/legal/overview", (_req, res) => {
  const data = GetLegalOverviewResponse.parse({
    activeCases: 1284,
    responseTime: "18 मिनट",
    supportedDistricts: 14,
    nextHearing: null,
  });
  res.json(data);
});

router.get("/legal/case-models", (_req, res) => {
  res.json(ListCaseModelsResponse.parse(caseModels));
});

router.get("/legal/news", async (req, res) => {
  const news = await getLiveNews(req);
  res.json(ListNewsFeedsResponse.parse(news));
});

router.post("/legal/requests", async (req, res) => {
  const parsed = CreateLegalRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "कृपया सभी जानकारी सही तरह भरें।" });
    return;
  }

  const request = {
    ...parsed.data,
    status: "received",
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await supabaseProxy("/rest/v1/legal_requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: parsed.data.name,
        phone: parsed.data.phone,
        case_model: parsed.data.caseModel,
        message: parsed.data.message,
        status: request.status,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      req.log.error({ status: response.status, details }, "Supabase request insert failed");
      res.status(502).json({
        error: "रिक्वेस्ट सेव नहीं हो सकी। कृपया WhatsApp या कॉल से संपर्क करें।",
      });
      return;
    }

    const rows = (await response.json()) as Array<{ id?: string; created_at?: string }>;
    const data = CreateLegalRequestResponse.parse({
      ...parsed.data,
      id: rows[0]?.id ?? crypto.randomUUID(),
      status: request.status,
      createdAt: rows[0]?.created_at ?? request.createdAt,
    });
    res.status(201).json(data);
  } catch (error) {
    req.log.error({ error }, "Supabase request insert threw");
    res.status(502).json({
      error: "रिक्वेस्ट सेव नहीं हो सकी। कृपया WhatsApp या कॉल से संपर्क करें।",
    });
  }
});

router.post("/legal/ai/guidance", async (req, res) => {
  const parsed = GetLegalGuidanceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "कृपया अपनी स्थिति के बारे में थोड़ा और लिखें।" });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(503).json({ error: "AI गाइडेंस अभी उपलब्ध नहीं है।" });
    return;
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content:
            "आप Nyaya Sathi के हिंदी लीगल-इन्फॉर्मेशन सहायक हैं। वकील होने का दावा न करें। उपयोगकर्ता को सामान्य जानकारी दें, तत्काल खतरे/समय-सीमा में स्थानीय अधिवक्ता से बात करने को कहें। जवाब में एक छोटा title, summary, 3 से 5 numbered steps और disclaimer दें। JSON में लौटाएं: {title, summary, steps, disclaimer}. केवल वैध JSON लौटाएं।",
        },
        {
          role: "user",
          content: `उद्देश्य: ${parsed.data.intent}\nस्थिति: ${parsed.data.context}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      res.status(502).json({ error: "AI से उत्तर नहीं मिला।" });
      return;
    }

    res.json(GetLegalGuidanceResponse.parse(JSON.parse(content)));
  } catch (error) {
    req.log.error({ error }, "AI legal guidance failed");
    res.status(502).json({ error: "AI गाइडेंस इस समय उपलब्ध नहीं है।" });
  }
});

export default router;