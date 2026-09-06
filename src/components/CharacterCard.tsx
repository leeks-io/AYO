import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { IMAGES } from "../assets/images";
import { GameMode, Player, GriotProverb } from "../types";
import { Sparkles, MessageCircle } from "lucide-react";

interface CharacterCardProps {
  mode: GameMode;
  isOpponentTurn: boolean;
  score: number;
  capturesCount: number;
  activeProverb: GriotProverb | null;
  opponentType: "trickster" | "diviner" | "apprentice" | "human";
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  mode,
  isOpponentTurn,
  score,
  capturesCount,
  activeProverb,
  opponentType
}) => {
  const isDiviner = opponentType === "diviner";
  const isHuman = mode === "pass_and_play";

  const portrait = isDiviner ? IMAGES.ifaDiviner : IMAGES.tricksterSpirit;
  const name = isHuman
    ? "Player 2 (North)"
    : isDiviner
    ? "Baba Ifá"
    : opponentType === "apprentice"
    ? "Akẹ́kọ̀ọ́ (Apprentice)"
    : "Èṣù-Lọ́lá (Trickster)";

  const title = isHuman
    ? "Challenger at the Board"
    : isDiviner
    ? "Elder Ifá Diviner"
    : opponentType === "apprentice"
    ? "Student of the Seeds"
    : "Spirit of the Crossroads";

  const tagColor = isDiviner
    ? "border-indigo-400/40 bg-indigo-950/60 text-indigo-300"
    : "border-red-500/40 bg-red-950/60 text-red-300";

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4 bg-[#111728]/90 border border-stone-800 rounded-2xl p-4 shadow-xl shadow-black/50">
      {/* Portrait & Status */}
      <div className="relative flex-shrink-0 flex items-center gap-3">
        <div
          className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
            isOpponentTurn
              ? "border-amber-400 ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/20 scale-105"
              : "border-stone-700 opacity-90"
          }`}
        >
          <img
            src={portrait}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
          />
          {isOpponentTurn && (
            <div className="absolute top-1.5 right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-['Cinzel'] text-lg font-bold text-amber-100 tracking-wide">
              {name}
            </h3>
            {isOpponentTurn && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Thinking...
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 font-medium">{title}</p>

          <div className="flex items-center gap-3 mt-2">
            <div className="text-xs text-stone-300">
              <span className="text-stone-500 uppercase text-[10px] font-bold block">Score</span>
              <span className="font-['Cinzel'] text-base font-bold text-amber-300">{score}</span>
              <span className="text-[10px] text-stone-500"> / 25 to win</span>
            </div>
            <div className="h-6 w-px bg-stone-700/60" />
            <div className="text-xs text-stone-300">
              <span className="text-stone-500 uppercase text-[10px] font-bold block">Captures</span>
              <span className="font-semibold text-stone-200">{capturesCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Proverb Speech Bubble */}
      <div className="flex-1 w-full">
        <div className="relative p-3.5 rounded-xl bg-black/40 border border-stone-800 min-h-[64px] flex items-center">
          <AnimatePresence mode="wait">
            {activeProverb ? (
              <motion.div
                key={activeProverb.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-2.5 text-xs md:text-sm text-amber-200/90 font-serif italic"
              >
                <MessageCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span>"{activeProverb.text}"</span>
                  <span className="block not-italic text-[10px] text-stone-400 mt-1 uppercase tracking-wider font-sans">
                    — {activeProverb.speaker === "diviner" ? "Ifá Wisdom" : activeProverb.speaker === "trickster" ? "Èṣù's Riddle" : "Griot Commentary"}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-stone-400 italic">
                <Sparkles className="w-3.5 h-3.5 text-stone-600" />
                <span>
                  {isOpponentTurn
                    ? "The stones clatter in contemplation..."
                    : "Sow your seeds with intention. The ancestors are watching."}
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
