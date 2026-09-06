import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MatchStats, DivinationTheme } from "../types";
import { DIVINATION_THEMES } from "../data/lore";
import { IMAGES } from "../assets/images";
import { sound } from "../utils/audio";
import {
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Trophy,
  Scale,
  Compass,
  Heart,
  Wheat,
  Swords,
  Scroll,
  Feather
} from "lucide-react";

interface DivinationModalProps {
  isOpen: boolean;
  matchStats: MatchStats;
  onPlayAgain: () => void;
  onThemeChange: (theme: DivinationTheme) => void;
}

export const DivinationModal: React.FC<DivinationModalProps> = ({
  isOpen,
  matchStats,
  onPlayAgain,
  onThemeChange
}) => {
  const [selectedTheme, setSelectedTheme] = useState<DivinationTheme>(matchStats.theme);
  const [selectedReader, setSelectedReader] = useState<"trickster" | "diviner">(matchStats.reader);
  const [readingText, setReadingText] = useState<string>("");
  const [adviceText, setAdviceText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [sourceTag, setSourceTag] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchReading(selectedTheme, selectedReader);
      sound.playDivinationChime();
    }
  }, [isOpen, selectedTheme, selectedReader]);

  const fetchReading = async (theme: DivinationTheme, reader: "trickster" | "diviner") => {
    setIsLoading(true);
    try {
      const winnerName =
        matchStats.winner === "player1"
          ? "Player 1"
          : matchStats.winner === "player2"
          ? "Opponent / Spirit"
          : "Draw (Perfect Balance)";

      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winner: winnerName,
          player1Seeds: matchStats.player1Seeds,
          player2Seeds: matchStats.player2Seeds,
          player1Captures: matchStats.player1Captures,
          player2Captures: matchStats.player2Captures,
          biggestCapture: matchStats.biggestCapture,
          theme,
          reader
        })
      });

      const data = await res.json();
      if (data.success) {
        setReadingText(data.reading);
        setAdviceText(data.advice);
        setSourceTag(data.source || "oracle");
      }
    } catch (err) {
      console.error("Failed to fetch reading:", err);
      setReadingText(
        "The cowries rest upon the board; what was sown in twelve pits now reveals the weight of your choices across the season."
      );
      setAdviceText("Walk gently upon the earth, for the seeds you drop today will sprout tomorrow.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `[Ayò Àṣẹ Divination Reading — Theme: ${selectedTheme.toUpperCase()}]\n\n"${readingText}"\n\nAdvice: "${adviceText}"\n\n— Read by ${
      selectedReader === "trickster" ? "Èṣù The Trickster" : "Baba Ifá Diviner"
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    sound.playSeedDrop(1.2);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  const currentThemeMeta = DIVINATION_THEMES[selectedTheme];
  const readerImage = selectedReader === "diviner" ? IMAGES.ifaDiviner : IMAGES.tricksterSpirit;
  const isPlayer1Winner = matchStats.winner === "player1";
  const isDraw = matchStats.winner === "draw";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="relative w-full max-w-3xl my-8 overflow-hidden rounded-3xl border-2 border-amber-600/50 bg-[#0d1220] shadow-2xl shadow-black text-white"
      >
        {/* Top Decorative Border */}
        <div className="h-3 w-full bg-gradient-to-r from-amber-700 via-yellow-500 to-indigo-700" />

        <div className="p-6 md:p-8">
          {/* Header & Result Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Scroll className="w-5 h-5 text-amber-400" />
                <span className="text-xs uppercase tracking-widest font-semibold text-amber-400">
                  Sacred Divination Reading
                </span>
                {sourceTag && (
                  <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300/80 border border-amber-500/20">
                    {sourceTag === "gemini-3.8-flash" ? "Gemini AI Live" : "Ancient Oral Lore"}
                  </span>
                )}
              </div>
              <h2 className="font-['Cinzel'] text-2xl md:text-3xl font-black text-amber-100">
                {isDraw ? "Equilibrium at the Crossroads" : isPlayer1Winner ? "The Victor's Harvest" : "The Lesson of the Seeds"}
              </h2>
            </div>

            {/* Match Outcome Pill */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-['Cinzel'] font-bold text-sm border shadow-md ${
                isDraw
                  ? "bg-amber-950/60 text-amber-300 border-amber-700/50"
                  : isPlayer1Winner
                  ? "bg-emerald-950/70 text-emerald-300 border-emerald-700/50"
                  : "bg-red-950/70 text-red-300 border-red-700/50"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>
                {isDraw ? "Draw: 24 - 24" : isPlayer1Winner ? "Victory: You Triumphed" : "Spirit Claimed Board"}
              </span>
            </div>
          </div>

          {/* Match Statistics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Final Score</span>
              <span className="font-['Cinzel'] text-lg font-bold text-amber-300">
                {matchStats.player1Seeds} vs {matchStats.player2Seeds}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Captures</span>
              <span className="font-['Cinzel'] text-lg font-bold text-stone-200">
                {matchStats.player1Captures} made
              </span>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Biggest Scoop</span>
              <span className="font-['Cinzel'] text-lg font-bold text-amber-400">
                {matchStats.biggestCapture} seeds
              </span>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Turns Sown</span>
              <span className="font-['Cinzel'] text-lg font-bold text-stone-300">
                {matchStats.totalTurns} turns
              </span>
            </div>
          </div>

          {/* Reader & Theme Selection Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-stone-950/60 p-2 rounded-2xl border border-stone-800">
            {/* Reader Toggle */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  sound.playSeedDrop(1.0);
                  setSelectedReader("trickster");
                }}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  selectedReader === "trickster"
                    ? "bg-red-950/90 text-red-200 border border-red-500/50 shadow-md"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <span>Èṣù (The Trickster)</span>
              </button>
              <button
                onClick={() => {
                  sound.playSeedDrop(1.0);
                  setSelectedReader("diviner");
                }}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  selectedReader === "diviner"
                    ? "bg-indigo-950/90 text-indigo-200 border border-indigo-500/50 shadow-md"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <span>Baba Ifá (The Elder)</span>
              </button>
            </div>

            {/* Theme Selector */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto justify-center">
              {(Object.keys(DIVINATION_THEMES) as DivinationTheme[]).map((tKey) => {
                const isCur = selectedTheme === tKey;
                return (
                  <button
                    key={tKey}
                    onClick={() => {
                      sound.playSeedDrop(1.1);
                      setSelectedTheme(tKey);
                      onThemeChange(tKey);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize flex items-center gap-1 transition-all ${
                      isCur
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <span>{DIVINATION_THEMES[tKey].symbol}</span>
                    <span>{tKey}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* The Divination Scroll */}
          <div className="relative rounded-2xl border-2 border-amber-600/40 bg-[#16120e] p-6 md:p-8 shadow-inner overflow-hidden">
            {/* Parchment & Adire texture effect */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#c98a2c_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
              {/* Reader Portrait */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-24 h-32 md:w-28 md:h-36 rounded-xl overflow-hidden border-2 border-amber-500/60 shadow-lg shadow-black/80 bg-stone-900">
                  <img
                    src={readerImage}
                    alt={selectedReader}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="text-[11px] font-bold text-amber-300 font-['Cinzel'] mt-2 text-center">
                  {selectedReader === "trickster" ? "Èṣù The Trickster" : "Baba Ifá Diviner"}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-stone-400">
                  Theme: {selectedTheme}
                </span>
              </div>

              {/* Reading Content */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Sparkles className="w-8 h-8 text-amber-400 animate-spin mb-3" />
                    <p className="font-serif text-stone-300 italic text-base">
                      Consulting the sacred shells and weaving your match fortune...
                    </p>
                    <span className="text-xs text-stone-500 mt-1">
                      Translating {matchStats.player1Seeds} seeds into destiny
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Feather className="w-4 h-4 text-amber-400" />
                      <span className="font-['Cinzel'] text-xs font-bold tracking-wider text-amber-300 uppercase">
                        The Oracle Speaks
                      </span>
                    </div>

                    <p className="text-base md:text-lg text-amber-100 font-serif leading-relaxed italic mb-4">
                      "{readingText}"
                    </p>

                    {/* Advice Box */}
                    {adviceText && (
                      <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/30">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                          Counsel of the Crossroads
                        </span>
                        <p className="text-xs md:text-sm font-medium text-stone-200">
                          {adviceText}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-6 border-t border-stone-800">
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Fortune Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-400" />
                  <span>Copy Divination Reading</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                sound.playSeedDrop(1.2);
                onPlayAgain();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Sow Again (Rematch)</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
