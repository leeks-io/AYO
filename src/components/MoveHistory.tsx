import React from "react";
import { Player } from "../types";
import { History, Sparkles, ChevronRight } from "lucide-react";

interface MoveHistoryProps {
  history: {
    player: Player;
    fromPit: number;
    captured: number;
  }[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  if (history.length === 0) return null;

  const reversed = [...history].reverse().slice(0, 6);

  return (
    <div className="w-full max-w-4xl mx-auto mt-3 bg-[#111728]/70 border border-stone-800 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2 text-xs text-stone-400 font-semibold uppercase tracking-wider">
        <History className="w-3.5 h-3.5 text-amber-400" />
        <span>Recent Board Actions</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {reversed.map((move, idx) => {
          const isP1 = move.player === "player1";
          return (
            <div
              key={idx}
              className={`p-2 rounded-lg border text-xs flex flex-col justify-between ${
                move.captured > 0
                  ? isP1
                    ? "bg-amber-950/40 border-amber-600/50 text-amber-200"
                    : "bg-indigo-950/40 border-indigo-600/50 text-indigo-200"
                  : "bg-stone-900/60 border-stone-800 text-stone-400"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span>{isP1 ? "Player 1" : "Opponent"}</span>
                <span>Pit #{move.fromPit + 1}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[11px]">
                  {move.captured > 0 ? `Captured +${move.captured}` : "Sown clean"}
                </span>
                {move.captured >= 4 && <Sparkles className="w-3 h-3 text-amber-400" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
