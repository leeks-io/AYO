import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { INTRO_DIALOGUE, DIVINATION_THEMES } from "../data/lore";
import { IMAGES } from "../assets/images";
import { DivinationTheme } from "../types";
import { Sparkles, ArrowRight, Play, Check } from "lucide-react";
import { sound } from "../utils/audio";

interface IntroDialogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTheme: DivinationTheme;
  onSelectTheme: (theme: DivinationTheme) => void;
}

export const IntroDialogueModal: React.FC<IntroDialogueModalProps> = ({
  isOpen,
  onClose,
  selectedTheme,
  onSelectTheme
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  if (!isOpen) return null;

  const currentLine = INTRO_DIALOGUE[currentLineIndex];
  const isLastLine = currentLineIndex === INTRO_DIALOGUE.length - 1;

  const handleNext = () => {
    sound.playSeedDrop(1.2);
    if (isLastLine) {
      sound.playDivinationChime();
      onClose();
    } else {
      setCurrentLineIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    sound.playDivinationChime();
    onClose();
  };

  const speakerImage =
    currentLine.speaker === "diviner" ? IMAGES.ifaDiviner : IMAGES.tricksterSpirit;
  const speakerName =
    currentLine.speaker === "diviner" ? "Baba Ifá (The Elder Diviner)" : "Èṣù-Lọ́lá (The Trickster)";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0f1424] shadow-2xl shadow-black/80 text-white"
      >
        {/* Adire Pattern Header Bar */}
        <div className="relative h-2 w-full bg-gradient-to-r from-amber-600 via-indigo-600 to-amber-600" />

        <div className="p-6 md:p-8">
          {/* Header Title & Theme badge */}
          <div className="flex items-center justify-between border-b border-amber-900/30 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-['Cinzel'] text-xl font-bold tracking-wider text-amber-200">
                  The Crossroads Gathering
                </h3>
                <p className="text-xs text-stone-400">Before the first cowrie shell is sown</p>
              </div>
            </div>

            <button
              onClick={handleSkip}
              className="text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-amber-300 transition-colors px-3 py-1.5 rounded-lg border border-stone-700/60 hover:border-amber-500/50"
            >
              Skip Intro
            </button>
          </div>

          {/* Dialogue Speaker and Portrait Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Portrait */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative w-36 h-48 rounded-xl overflow-hidden border-2 border-amber-500/50 shadow-lg shadow-black/60 bg-stone-900">
                <img
                  src={speakerImage}
                  alt={speakerName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 inset-x-0 text-center">
                  <span
                    className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      currentLine.speaker === "diviner"
                        ? "bg-indigo-900/90 text-indigo-200 border border-indigo-500/40"
                        : "bg-red-900/90 text-red-200 border border-red-500/40"
                    }`}
                  >
                    {currentLine.speaker === "diviner" ? "Ifá Diviner" : "Trickster Spirit"}
                  </span>
                </div>
              </div>
            </div>

            {/* Speech Bubble */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <div className="relative p-5 rounded-2xl bg-stone-900/90 border border-amber-500/20 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-['Cinzel'] text-sm font-semibold text-amber-300">
                    {speakerName}
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentLineIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="text-base md:text-lg text-stone-100 font-serif leading-relaxed italic"
                  >
                    "{currentLine.text}"
                  </motion.p>
                </AnimatePresence>

                {/* Speech arrow */}
                <div className="hidden md:block absolute -left-2 top-8 w-4 h-4 bg-stone-900 border-l border-b border-amber-500/20 transform rotate-45" />
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-1.5">
                  {INTRO_DIALOGUE.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentLineIndex
                          ? "w-6 bg-amber-400"
                          : idx < currentLineIndex
                          ? "w-2 bg-amber-600/60"
                          : "w-2 bg-stone-700"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold shadow-lg shadow-amber-900/30 hover:shadow-amber-500/20 transition-all text-sm"
                >
                  {isLastLine ? (
                    <>
                      <span>Begin Match</span>
                      <Play className="w-4 h-4 fill-current" />
                    </>
                  ) : (
                    <>
                      <span>Listen On</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Divination Question / Theme Setting */}
          <div className="mt-8 pt-6 border-t border-stone-800/80">
            <label className="block text-xs uppercase tracking-widest font-semibold text-amber-400/90 mb-3">
              Choose your divination theme for this match:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(DIVINATION_THEMES) as DivinationTheme[]).map((themeKey) => {
                const theme = DIVINATION_THEMES[themeKey];
                const isSelected = selectedTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => {
                      sound.playSeedDrop(1.0);
                      onSelectTheme(themeKey);
                    }}
                    className={`relative p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? "border-amber-400 bg-amber-500/15 text-amber-100 shadow-md shadow-amber-950/50"
                        : "border-stone-800 bg-stone-900/60 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{theme.symbol}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-xs font-bold leading-tight truncate text-stone-200">
                      {theme.name.split(" & ")[0]}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">{theme.yorubaName}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
