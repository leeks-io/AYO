import React from "react";
import { motion } from "motion/react";
import { Player } from "../types";
import { sound } from "../utils/audio";
import { IMAGES } from "../assets/images";
import { ArrowLeft, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";

interface GameBoardProps {
  board: number[];
  currentPlayer: Player;
  isAiThinking: boolean;
  scores: { player1: number; player2: number };
  legalMoves: number[];
  onPitClick: (pitIndex: number) => void;
  lastMove: {
    player: Player;
    fromPit: number;
    capturedCount: number;
    capturedPits: number[];
  } | null;
  activeSowingPit: number | null;
}

// Organic cowrie shell cluster generator
const renderCowrieCluster = (count: number) => {
  if (count === 0) return null;

  // Maximum visual shells rendered to prevent visual clutter, count badge gives exact number
  const visualCount = Math.min(count, 12);
  const angles = [0, 60, 120, 180, 240, 300, 30, 90, 150, 210, 270, 330];

  return (
    <div className="relative w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14 flex items-center justify-center pointer-events-none">
      {Array.from({ length: visualCount }).map((_, idx) => {
        const angle = angles[idx % angles.length];
        const radius = idx === 0 ? 0 : idx <= 6 ? 7 : 13;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        const rotation = (idx * 53) % 360;

        return (
          <motion.div
            key={idx}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, delay: idx * 0.015 }}
            style={{
              transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`
            }}
            className="absolute w-2.5 h-4 sm:w-3.5 sm:h-5 md:w-4 md:h-6 rounded-[45%] bg-gradient-to-b from-[#fbf4dd] via-[#ecd5a5] to-[#c69a5c] border border-amber-950/70 shadow-sm shadow-black/90 flex items-center justify-center overflow-hidden"
          >
            {/* Characteristic cowrie slit */}
            <div className="w-[1.5px] sm:w-[2px] h-2.5 sm:h-3.5 md:h-4 bg-[#4a2e12] rounded-full flex flex-col justify-around py-0.5">
              <span className="w-1 h-[1px] bg-[#ecd5a5] -ml-[1px]" />
              <span className="w-1 h-[1px] bg-[#ecd5a5] -ml-[1px]" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPlayer,
  isAiThinking,
  scores,
  legalMoves,
  onPitClick,
  lastMove,
  activeSowingPit
}) => {
  // Top row: Player 2 (North) -> 11, 10, 9, 8, 7, 6
  // Bottom row: Player 1 (South) -> 0, 1, 2, 3, 4, 5
  const northPits = [11, 10, 9, 8, 7, 6];
  const southPits = [0, 1, 2, 3, 4, 5];

  const handlePitClick = (pitIndex: number) => {
    if (isAiThinking) return;
    if (!legalMoves.includes(pitIndex)) {
      sound.playSeedDrop(0.7);
      return;
    }
    sound.playSeedDrop(1.1);
    onPitClick(pitIndex);
  };

  const renderPit = (pitIndex: number, isPlayer1Side: boolean) => {
    const seedCount = board[pitIndex];
    const isLegal = legalMoves.includes(pitIndex);
    const isCurrentPlayerTurn =
      (isPlayer1Side && currentPlayer === "player1") ||
      (!isPlayer1Side && currentPlayer === "player2");
    const isSelectable = isLegal && !isAiThinking && isCurrentPlayerTurn;

    const wasJustCaptured = lastMove?.capturedPits?.includes(pitIndex);
    const wasSownOrigin = lastMove?.fromPit === pitIndex;
    const isCurrentlySowing = activeSowingPit === pitIndex;

    return (
      <div key={pitIndex} className="relative flex flex-col items-center">
        {/* Direction label for North pits */}
        {!isPlayer1Side && (
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-stone-300 mb-1">
            #{pitIndex + 1}
          </span>
        )}

        {/* The Carved Round Pit Hollow (Authentic Circular Ayò Cup) */}
        <button
          onClick={() => handlePitClick(pitIndex)}
          disabled={!isSelectable}
          title={`Pit ${pitIndex + 1}: ${seedCount} seeds`}
          className={`group relative w-12 h-12 xs:w-14 xs:h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full aspect-square flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden ${
            isSelectable
              ? "ring-2 sm:ring-4 ring-amber-400/90 hover:ring-amber-300 hover:scale-105 shadow-[0_0_18px_rgba(251,191,36,0.4)] cursor-pointer"
              : "opacity-95 cursor-default"
          } ${
            isCurrentlySowing
              ? "ring-4 ring-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.7)] scale-110"
              : wasJustCaptured
              ? "ring-4 ring-red-500 shadow-[0_0_18px_rgba(239,68,68,0.6)]"
              : wasSownOrigin
              ? "ring-2 ring-amber-600/70"
              : "border-2 sm:border-3 border-[#533215] shadow-[0_3px_8px_rgba(0,0,0,0.7)]"
          }`}
        >
          {/* Deep Carved Wooden Bowl Concentric Concave Gradient */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_35%,#2c1a0e_0%,#180e08_45%,#0b0604_80%,#000000_100%)] shadow-[inset_0_4px_10px_rgba(0,0,0,0.95),inset_0_-2px_5px_rgba(190,130,60,0.2)] pointer-events-none" />

          {/* Concentric carved wooden lip ring */}
          <div className="absolute inset-1 sm:inset-1.5 rounded-full border border-amber-900/30 pointer-events-none" />

          {/* Adire Indigo Textile Texture overlay */}
          <div className="absolute inset-0 rounded-full opacity-10 bg-[radial-gradient(#c98a2c_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />

          {/* Seeds Visual representation in center of circular bowl */}
          <div className="relative z-10 flex items-center justify-center">
            {renderCowrieCluster(seedCount)}
          </div>

          {/* Seed Count Badge (Floating pill at bottom of the circular hole) */}
          <div
            className={`absolute bottom-1 sm:bottom-1.5 z-20 flex items-center justify-center min-w-[20px] sm:min-w-[24px] h-4.5 sm:h-5.5 px-1 sm:px-1.5 rounded-full text-[10px] sm:text-xs font-bold font-mono transition-transform shadow-md ${
              seedCount === 0
                ? "bg-stone-900/80 text-stone-500 border border-stone-800"
                : isSelectable
                ? "bg-amber-400 text-stone-950 font-black shadow-[0_2px_6px_rgba(0,0,0,0.8)] scale-105"
                : "bg-amber-950/90 text-amber-200 border border-amber-700/60"
            }`}
          >
            {seedCount}
          </div>

          {/* Sowing highlight indicator */}
          {isCurrentlySowing && (
            <div className="absolute inset-0 bg-cyan-400/25 animate-pulse pointer-events-none rounded-full" />
          )}
        </button>

        {/* Direction label for South pits */}
        {isPlayer1Side && (
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-stone-300 mt-1">
            #{pitIndex + 1}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-4">
      {/* Turn & Direction Bar */}
      <div className="flex items-center justify-between px-4 py-2 mb-2 bg-[#12192c]/80 rounded-xl border border-stone-800 text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-semibold font-['Cinzel']">
            Current Sower:
          </span>
          <span
            className={`font-bold px-2 py-0.5 rounded-md ${
              currentPlayer === "player1"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
            }`}
          >
            {currentPlayer === "player1" ? "Player 1 (South)" : "Player 2 / AI (North)"}
          </span>
        </div>

        {/* Counter-Clockwise Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-stone-400">
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>Sowing Flow: Counter-Clockwise</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
        </div>
      </div>

      {/* The Master Ayo Board */}
      <div className="relative overflow-hidden rounded-3xl border-4 border-[#885514] bg-[#1a130e] p-4 md:p-6 shadow-2xl shadow-black">
        {/* Carved Wood grain & Adire Textile Motif background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#c98a2c_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/40 via-stone-900/50 to-amber-950/40 pointer-events-none" />

        {/* Carved Border Inlay */}
        <div className="relative rounded-2xl border-2 border-amber-700/50 bg-[#0d1220]/90 p-4 md:p-6">
          <div className="grid grid-cols-12 gap-3 md:gap-6 items-center">
            {/* North Player Store (Left End) */}
            <div className="col-span-12 sm:col-span-2 flex flex-col items-center justify-center p-3 rounded-3xl sm:rounded-full bg-[radial-gradient(ellipse_at_center,_#1e1428_0%,_#0f0a17_50%,_#050308_100%)] border-2 border-indigo-900/60 shadow-[inset_0_4px_14px_rgba(0,0,0,0.95)] h-28 sm:h-64">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1 text-center font-['Cinzel']">
                North Store
              </span>
              <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center my-1">
                {renderCowrieCluster(scores.player2)}
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-['Cinzel'] text-2xl font-black text-indigo-200">
                  {scores.player2}
                </span>
                <span className="text-[10px] text-stone-500">/25</span>
              </div>
              <span className="text-[10px] text-stone-400 mt-0.5">Captured</span>
            </div>

            {/* The 12 Main Playing Pits (Center 8 columns) */}
            <div className="col-span-12 sm:col-span-8 flex flex-col gap-4 md:gap-6">
              {/* North Row (Pits 11 -> 6) */}
              <div className="flex items-center justify-between gap-1 sm:gap-2">
                {northPits.map((pitIdx) => renderPit(pitIdx, false))}
              </div>

              {/* Center Board Divider / Adire Motif Strip */}
              <div className="relative flex items-center justify-center py-1">
                <div className="h-0.5 w-full bg-gradient-to-r from-amber-800/20 via-amber-600/40 to-amber-800/20" />
                <div className="absolute px-3 py-0.5 rounded-full bg-[#12192c] border border-amber-600/40 text-[10px] uppercase font-bold tracking-widest text-amber-300/80">
                  Ayò Olópon
                </div>
              </div>

              {/* South Row (Pits 0 -> 5) */}
              <div className="flex items-center justify-between gap-1 sm:gap-2">
                {southPits.map((pitIdx) => renderPit(pitIdx, true))}
              </div>
            </div>

            {/* South Player Store (Right End) */}
            <div className="col-span-12 sm:col-span-2 flex flex-col items-center justify-center p-3 rounded-3xl sm:rounded-full bg-[radial-gradient(ellipse_at_center,_#2a180b_0%,_#150c05_50%,_#060301_100%)] border-2 border-amber-900/60 shadow-[inset_0_4px_14px_rgba(0,0,0,0.95)] h-28 sm:h-64">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-amber-300 mb-1 text-center font-['Cinzel']">
                South Store
              </span>
              <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center my-1">
                {renderCowrieCluster(scores.player1)}
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-['Cinzel'] text-2xl font-black text-amber-300">
                  {scores.player1}
                </span>
                <span className="text-[10px] text-stone-500">/25</span>
              </div>
              <span className="text-[10px] text-stone-400 mt-0.5">Captured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
