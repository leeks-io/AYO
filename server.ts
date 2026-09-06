import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// Fallback divination reading generator if API key is not set or network fails
function generateFallbackReading(data: {
  winner: string;
  player1Seeds: number;
  player2Seeds: number;
  player1Captures: number;
  player2Captures: number;
  biggestCapture: number;
  theme: string;
  reader: "trickster" | "diviner";
}): { reading: string; advice: string } {
  const { winner, player1Seeds, player2Seeds, biggestCapture, theme, reader } = data;
  const isClose = Math.abs(player1Seeds - player2Seeds) <= 4;

  if (reader === "diviner") {
    const readings: Record<string, string> = {
      love: `The cowries settle where the heart dared to wander. You gathered ${player1Seeds} seeds against ${player2Seeds}; in matters of affection, ${isClose ? "a balance so close proves that two rivers meet without drowning one another" : biggestCapture >= 4 ? "a sudden sweeping passion claimed the courtyard, yet what was seized must now be tendered" : "each grain given quietly yields greater shelter than a boastful harvest"}. The board remembers that no hand leaves the soil untouched.`,
      harvest: `The earth does not count the grains scattered, only the sheaves returned to the barn. With ${player1Seeds} seeds in the basket and a stroke of ${biggestCapture} gathered in a single breath, your season reflects ${winner === "Player 1" ? "patient labor rewarded before the rains ceased" : "a field that yielded wisdom where grain was sparse"}. ${isClose ? "The scales of the granary rest even; thrift and bounty walk as twins." : "The fuller sack bends the back, but emptier barns keep the legs swift."}`,
      journey: `The dust of the road settles in twelve hollows. You navigated through crosswinds to bring ${player1Seeds} seeds across the threshold. ${biggestCapture >= 4 ? `That sudden leap of ${biggestCapture} seeds marked the crossroads where the river bent unexpectedly.` : "Step by step, the traveler outwalked the gallop of the impatient."} The divination marks your destination not by the distance covered, but by the burdens gladly shed along the path.`,
      conflict: `Iron strikes the anvil twelve times before the spearhead takes form. In this contest of ${player1Seeds} against ${player2Seeds}, ${isClose ? "neither shield nor blade prevailed entirely; equilibrium remains the sternest judge." : winner === "Player 1" ? "the decisive strike scattered the opponent's formation like dry pods before the wind." : "the perimeter was yielded, yet the core citadel held its secret dignity."} What was lost on the board has hardened the bone beneath.`
    };

    const advices: Record<string, string> = {
      love: "Feed the stranger at your gate before asking their clan, and love will guard your doorway.",
      harvest: "Count your gourds by moonlight, but sow only when the morning dew has kissed the soil.",
      journey: "Look not only where your foot falls, but where the shadow of the tall palm beckons.",
      conflict: "He who knows when to fold his robe avoids the brambles that tear the warrior's cloak."
    };

    return {
      reading: readings[theme] || readings.harvest,
      advice: advices[theme] || advices.harvest
    };
  }

  // Trickster voice
  const tricksterReadings: Record<string, string> = {
    love: `Aha! Did you think the seeds cared whose fingers stroked them first? You claimed ${player1Seeds} and left ${player2Seeds} behind, like a lover who takes all the yams and leaves only the peelings! That sudden swoop of ${biggestCapture} seeds—oh, how grand you felt, yet the heart is a pit with no bottom! ${isClose ? "You two danced on the razor's edge of a coin; one sneeze and the whole courtship topples." : "One of you feasts while the other searches the hearth for cinders!"}`,
    harvest: `Look at this heap! ${player1Seeds} versus ${player2Seeds}—the barn roof is leaking, yet someone is dancing in the rain! When you snatched ${biggestCapture} seeds in that greedy scoop, I saw the bush rat smiling in the rafters. ${isClose ? "Neither granary is full, neither belly is empty; you both walk away eyeing the same roasted corn." : "A fat harvest makes for loud snoring, but tomorrow the hungry crows hold council!"}`,
    journey: `The road looked straight until my bird staff tipped your cart! You carried ${player1Seeds} pebbles past my laughing eyes while ${player2Seeds} were left rolling in the ditch. ${biggestCapture >= 4 ? `A turn of ${biggestCapture} seeds in one grab? Even the chameleon doesn't change colors that fast without stubbing a toe!` : "Slow crawling like a tortoise with a heavy shell, but at least the hyena missed your scent."} You arrived, yes, but your sandals have holes!`,
    conflict: `Oho, what sweet clatter on the wood! Twelve hollows and every one of them tasted blood and sweat! You wrestled ${player1Seeds} into your pocket, but do not pretend your knees did not tremble when ${biggestCapture} seeds vanished in that whirlwind strike! ${isClose ? "A tie so snug you could fit it through a needle's eye—nobody died, so everybody is displeased!" : "You struck hard, but remember: the victor's rooster still crows at the trickster's dawn."}`
  };

  const tricksterAdvices: Record<string, string> = {
    love: "Never whisper your sweetest secret to anyone whose pockets are full of dried beans.",
    harvest: "Check the bottom of your sack before you boast to the marketplace, my clever friend!",
    journey: "When you reach the three-way crossroads, take the path where the monkey threw the mango.",
    conflict: "Sleep with one eye painted white and the other on the latch, for morning loves a surprise."
  };

  return {
    reading: tricksterReadings[theme] || tricksterReadings.journey,
    advice: tricksterAdvices[theme] || tricksterAdvices.journey
  };
}

// API: Divination Reading
app.post("/api/reading", async (req, res) => {
  try {
    const {
      winner,
      player1Seeds,
      player2Seeds,
      player1Captures,
      player2Captures,
      biggestCapture,
      theme,
      reader = "trickster"
    } = req.body;

    const genAI = getGenAI();

    if (!genAI) {
      // Return crafted fallback reading
      const fallback = generateFallbackReading({
        winner: winner || "Player 1",
        player1Seeds: Number(player1Seeds) || 24,
        player2Seeds: Number(player2Seeds) || 24,
        player1Captures: Number(player1Captures) || 0,
        player2Captures: Number(player2Captures) || 0,
        biggestCapture: Number(biggestCapture) || 4,
        theme: theme || "journey",
        reader: reader === "diviner" ? "diviner" : "trickster"
      });
      return res.json({
        success: true,
        source: "oracle-offline",
        reading: fallback.reading,
        advice: fallback.advice
      });
    }

    const personaInstructions =
      reader === "diviner"
        ? `You are an elder Yoruba Ifá diviner (Babalawo/Iyanifa), dignified, calm, and deeply perceptive. You speak in measured, evocative, original proverb-style metaphors rooted in West African oral tradition. You interpret the player's Ayò match statistics as sacred omens. Do NOT use real existing proverbs verbatim; craft original proverb-style lines.`
        : `You are the trickster spirit character (Èṣù-inspired archetype: sly, witty, playful, paradoxical, with an asymmetric grin). You narrate the end of this divination-themed Ayò match. You speak in a riddling, teasing voice, laughing at human vanity while revealing piercing truths. Do NOT use real existing proverbs verbatim; craft original phrasing.`;

    const prompt = `Match Statistics:
- Winner: ${winner}
- Final seed count: Player 1 (${player1Seeds}) vs Opponent (${player2Seeds})
- Captures made: Player 1 (${player1Captures} captures) vs Opponent (${player2Captures} captures)
- Biggest single capture in the match: ${biggestCapture} seeds
- Chosen theme for this reading: ${theme} (options: love / harvest / journey / conflict)

Instructions:
1. Write a 4-6 sentence "divination reading" that reinterprets these SPECIFIC match statistics as a metaphorical fortune about the chosen theme "${theme}".
2. Explicitly weave in the numbers and events (e.g. the ${biggestCapture} seed capture, the ${player1Seeds} vs ${player2Seeds} tally, the number of strikes) using metaphorical language.
3. At the very end, provide ONE concise piece of playful advice for the player (under 20 words).

Format your output as JSON with exactly two fields:
{
  "reading": "4-6 sentence metaphorical divination fortune...",
  "advice": "Single short piece of advice..."
}`;

    let text: string | undefined;
    let modelUsed = "gemini-3.8-flash";

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: personaInstructions,
          responseMimeType: "application/json",
          temperature: 0.85
        }
      });
      text = response.text;
    } catch (primaryErr: any) {
      console.warn("Primary model error, attempting gemini-3.1-flash-lite:", primaryErr?.message || primaryErr);
      modelUsed = "gemini-3.1-flash-lite";
      const backupResponse = await genAI.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          systemInstruction: personaInstructions,
          responseMimeType: "application/json",
          temperature: 0.85
        }
      });
      text = backupResponse.text;
    }

    if (!text) {
      throw new Error("Empty response from AI");
    }

    let cleanText = text.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    }
    const parsed = JSON.parse(cleanText);

    return res.json({
      success: true,
      source: modelUsed,
      reading: parsed.reading,
      advice: parsed.advice
    });
  } catch (error: any) {
    console.warn("AI generation fallback triggered:", error?.message || error);
    const fallback = generateFallbackReading({
      winner: req.body.winner || "Player 1",
      player1Seeds: Number(req.body.player1Seeds) || 24,
      player2Seeds: Number(req.body.player2Seeds) || 24,
      player1Captures: Number(req.body.player1Captures) || 0,
      player2Captures: Number(req.body.player2Captures) || 0,
      biggestCapture: Number(req.body.biggestCapture) || 4,
      theme: req.body.theme || "journey",
      reader: req.body.reader === "diviner" ? "diviner" : "trickster"
    });
    return res.json({
      success: true,
      source: "oracle-fallback",
      reading: fallback.reading,
      advice: fallback.advice
    });
  }
});

// API: In-game Live Commentary / Proverb Generator
app.post("/api/commentary", async (req, res) => {
  try {
    const { moveType, seedsCaptured, speaker = "trickster" } = req.body;
    const genAI = getGenAI();

    if (!genAI) {
      return res.json({ success: false, message: "AI client not active" });
    }

    const prompt = `Write ONE single original proverb-style line (under 14 words) in the voice of a ${
      speaker === "diviner" ? "wise West African elder diviner" : "mischievous trickster spirit"
    } reacting to a move in an Ayò board game where ${seedsCaptured} seeds were captured (${moveType}). No quotation marks, original wording only.`;

    const response = await genAI.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        temperature: 0.9,
        maxOutputTokens: 60
      }
    });

    return res.json({
      success: true,
      comment: response.text?.trim().replace(/^"|"$/g, "")
    });
  } catch (e: any) {
    return res.json({ success: false, error: e.message });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ayò Àṣẹ Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
