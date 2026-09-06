import React from "react";
import { motion } from "motion/react";
import { BookOpen, X, Sparkles, Award, Shield, Compass } from "lucide-react";
import { sound } from "../utils/audio";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl my-8 overflow-hidden rounded-3xl border border-amber-600/40 bg-[#0d1220] shadow-2xl shadow-black text-white"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-stone-800 bg-[#12192c]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-['Cinzel'] text-xl font-bold text-amber-100">
                Rules & Lore of Ayò Olópon
              </h3>
              <p className="text-xs text-stone-400">
                The Royal Mancala of the Yoruba Kingdom & Ifá Divination
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playSeedDrop(0.9);
              onClose();
            }}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-stone-300 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Origins */}
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            <h4 className="font-['Cinzel'] font-bold text-amber-300 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Sacred Heritage & The Divination Mirror
            </h4>
            <p className="leading-relaxed text-xs text-stone-300">
              Ayò Olópon ("Game of the Carved Board") has been played across Yorubaland for centuries.
              Kings (Ọba) and Babalawos (diviners) studied the game not merely as leisure, but as an
              intellectual duel that mirrors fate, generosity, discipline, and the cosmic balance of
              Àṣẹ (life force).
            </p>
          </div>

          {/* Section 2: Board & Sowing */}
          <div>
            <h4 className="font-['Cinzel'] font-bold text-amber-200 mb-2">
              1. The Board & Sowing (Gbígbé)
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-400">
              <li>
                <strong className="text-stone-200">12 Pits, 48 Cowrie Seeds:</strong> 6 pits belong to
                South (Player 1), 6 pits to North (Player 2).
              </li>
              <li>
                <strong className="text-stone-200">Counter-Clockwise Flow:</strong> On your turn, scoop
                all seeds from any of your non-empty pits and drop them one-by-one into subsequent pits.
              </li>
              <li>
                <strong className="text-stone-200">The Lap Rule (12+ Seeds):</strong> If you sow 12 or
                more seeds, your starting pit is skipped during the circular distribution.
              </li>
            </ul>
          </div>

          {/* Section 3: Capturing */}
          <div>
            <h4 className="font-['Cinzel'] font-bold text-amber-200 mb-2">
              2. Captures (Jíjẹ) & Cascades
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-400">
              <li>
                <strong className="text-stone-200">The 2 or 3 Rule:</strong> If your last sown seed lands in
                an opponent's pit and brings that pit's total count to exactly <strong>2</strong> or <strong>3</strong> seeds,
                you capture all those seeds!
              </li>
              <li>
                <strong className="text-stone-200">Grand Slam Cascades (Backward Chain):</strong> If the
                pit immediately preceding the capture (moving backward) also lies in opponent territory
                and also holds 2 or 3 seeds, you capture those as well, continuing backward until the
                chain breaks!
              </li>
            </ul>
          </div>

          {/* Section 4: Starvation Protection */}
          <div>
            <h4 className="font-['Cinzel'] font-bold text-amber-200 mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              3. The Law of Compassion (Starvation Rule)
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              In traditional Ayò, you must never intentionally starve your opponent to death. If the
              opponent has no seeds on their side, you <strong className="text-stone-200">must make a move that feeds seeds</strong> to
              their territory if possible. Furthermore, a capture that would strip the opponent of all
              remaining seeds on the entire board is voided.
            </p>
          </div>

          {/* Section 5: Victory */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40">
            <h4 className="font-['Cinzel'] font-bold text-amber-300 flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              Winning Condition & Divination Reading
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              The first player to capture <strong>25 or more seeds</strong> wins immediately. If the game
              reaches 24-24, it is celebrated as divine harmony (Equilibrium). At the end of every match,
              the Trickster Spirit or Ifá Priest consults the exact count of captures and scooping turns
              to deliver your personalized divination reading!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-[#0f1424] text-right">
          <button
            onClick={() => {
              sound.playSeedDrop(1.0);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            I Understand the Rules
          </button>
        </div>
      </motion.div>
    </div>
  );
};
