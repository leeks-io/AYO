import React, { useState, useEffect, useRef } from "react";
import {
  AyoState,
  createInitialState,
  getLegalMoves,
  simulateMove,
  executeMove,
  getAIMove,
  classifyMove
} from "./utils/ayoEngine";
import {
  GameMode,
  DivinationTheme,
  GriotProverb,
  MatchStats,
  Player
} from "./types";
import { GRIOT_PROVERBS, DIVINATION_THEMES } from "./data/lore";
import { sound } from "./utils/audio";
import { GameBoard } from "./components/GameBoard";
import { CharacterCard } from "./components/CharacterCard";
import { IntroDialogueModal } from "./components/IntroDialogueModal";
import { DivinationModal } from "./components/DivinationModal";
import { RulesModal } from "./components/RulesModal";
import { MoveHistory } from "./components/MoveHistory";
import {
  Volume2,
  VolumeX,
  BookOpen,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Users,
  Compass,
  Award
} from "lucide-react";

export default function App() {
  const [gameState, setGameState] = useState<AyoState>(() => createInitialState());
  const [gameMode, setGameMode] = useState<GameMode>("vs_trickster");
  const [theme, setTheme] = useState<DivinationTheme>("harvest");
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted);

  // Modals
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showDivination, setShowDivination] = useState<boolean>(false);

  // Live in-game commentary & animation
  const [activeProverb, setActiveProverb] = useState<GriotProverb | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [activeSowingPit, setActiveSowingPit] = useState<number | null>(null);

  // Match statistics for divination reading
  const [matchStats, setMatchStats] = useState<MatchStats | null>(null);

  const opponentType =
    gameMode === "vs_diviner"
      ? "diviner"
      : gameMode === "vs_apprentice"
      ? "apprentice"
      : gameMode === "pass_and_play"
      ? "human"
      : "trickster";

  const legalMoves = getLegalMoves(gameState);

  // Handle player pit click
  const handlePitClick = (pitIndex: number) => {
    if (gameState.isGameOver || isAiThinking) return;

    // Check if it's player's turn
    if (gameMode !== "pass_and_play" && gameState.currentPlayer !== "player1") return;

    processMove(pitIndex);
  };

  // Execute a move with smooth visual feedback and sound
  const processMove = (pitIndex: number) => {
    const player = gameState.currentPlayer;
    const sim = simulateMove(gameState.board, pitIndex, player);
    const moveType = classifyMove(gameState.board, sim.capturedSeeds, pitIndex, player);

    // Visual pulse on chosen pit
    setActiveSowingPit(pitIndex);
    setTimeout(() => setActiveSowingPit(null), 350);

    // Execute state update
    const nextState = executeMove(gameState, pitIndex);
    setGameState(nextState);

    // Audio & Proverb triggering
    if (sim.capturedSeeds > 0) {
      if (sim.capturedSeeds >= 4) {
        sound.playGrandCapture();
      } else {
        sound.playCapture(sim.capturedSeeds);
      }

      // Pick an appropriate proverb from the pool
      const matchingProverbs = GRIOT_PROVERBS.filter((p) => p.type === moveType);
      if (matchingProverbs.length > 0) {
        const picked = matchingProverbs[Math.floor(Math.random() * matchingProverbs.length)];
        setActiveProverb(picked);
      }
    } else {
      sound.playSeedDrop(1.0);
    }

    // Check Game Over
    if (nextState.isGameOver) {
      handleGameOver(nextState);
    }
  };

  // AI Turn handler
  useEffect(() => {
    if (
      !gameState.isGameOver &&
      gameMode !== "pass_and_play" &&
      gameState.currentPlayer === "player2"
    ) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const aiPersonality =
          gameMode === "vs_diviner"
            ? "diviner"
            : gameMode === "vs_apprentice"
            ? "apprentice"
            : "trickster";

        const chosenPit = getAIMove(gameState, aiPersonality);
        if (chosenPit !== -1) {
          processMove(chosenPit);
        }
        setIsAiThinking(false);
      }, 850);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.isGameOver, gameMode]);

  // Handle Game Over
  const handleGameOver = (finalState: AyoState) => {
    const stats: MatchStats = {
      winner: finalState.winner || "draw",
      player1Seeds: finalState.scores.player1,
      player2Seeds: finalState.scores.player2,
      player1Captures: finalState.player1CapturesCount,
      player2Captures: finalState.player2CapturesCount,
      biggestCapture: finalState.biggestCapture,
      totalTurns: finalState.turnNumber,
      theme,
      reader: opponentType === "diviner" ? "diviner" : "trickster"
    };

    setMatchStats(stats);
    sound.playDivinationChime();
    setTimeout(() => {
      setShowDivination(true);
    }, 1000);
  };

  const handleResetGame = () => {
    sound.playSeedDrop(1.2);
    setGameState(createInitialState());
    setActiveProverb(null);
    setShowDivination(false);
    setIsAiThinking(false);
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-[#0c101c]/90 backdrop-blur-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-['Cinzel'] font-black text-stone-950 text-xl shadow-md shadow-amber-900/40">
              À
            </div>
            <div>
              <h1 className="font-['Cinzel'] text-xl font-bold tracking-wider text-amber-100 flex items-center gap-2">
                Ayò Àṣẹ
                <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-amber-400/90 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                  Divination Mancala
                </span>
              </h1>
              <p className="text-[11px] text-stone-400">
                Traditional Yoruba strategy of sowing, capturing & fate
              </p>
            </div>
          </div>

          {/* Controls & Mode Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Select */}
            <div className="flex items-center rounded-xl bg-stone-900/90 border border-stone-800 p-1 text-xs">
              <button
                onClick={() => {
                  sound.playSeedDrop(1.0);
                  setGameMode("vs_trickster");
                  handleResetGame();
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  gameMode === "vs_trickster"
                    ? "bg-red-950 text-red-200 border border-red-600/50 shadow"
                    : "text-stone-400 hover:text-stone-200"
                }`}
                title="Play against Èṣù the Trickster (Opportunistic & witty)"
              >
                vs Trickster
              </button>

              <button
                onClick={() => {
                  sound.playSeedDrop(1.0);
                  setGameMode("vs_diviner");
                  handleResetGame();
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  gameMode === "vs_diviner"
                    ? "bg-indigo-950 text-indigo-200 border border-indigo-600/50 shadow"
                    : "text-stone-400 hover:text-stone-200"
                }`}
                title="Play against Baba Ifá (Wise, deep defense)"
              >
                vs Diviner
              </button>

              <button
                onClick={() => {
                  sound.playSeedDrop(1.0);
                  setGameMode("pass_and_play");
                  handleResetGame();
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  gameMode === "pass_and_play"
                    ? "bg-amber-950 text-amber-200 border border-amber-600/50 shadow"
                    : "text-stone-400 hover:text-stone-200"
                }`}
                title="Pass & Play with a friend on the same device"
              >
                <Users className="w-3 h-3" />
                <span>2-Player</span>
              </button>
            </div>

            {/* Theme Badge / Selector */}
            <button
              onClick={() => setShowIntro(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-xs text-amber-300 font-medium transition-all"
              title="Change Divination Theme & View Intro"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Theme: {DIVINATION_THEMES[theme].name.split(" & ")[0]}</span>
            </button>

            {/* Rules Button */}
            <button
              onClick={() => {
                sound.playSeedDrop(1.0);
                setShowRules(true);
              }}
              className="p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-all cursor-pointer"
              title="Rules of Ayò"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-all cursor-pointer"
              title={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-semibold text-stone-300 hover:text-white transition-all cursor-pointer"
              title="Reset Board"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="max-w-6xl w-full mx-auto px-4 py-4 flex-1 flex flex-col justify-center">
        {/* Opponent Card (North) */}
        <CharacterCard
          mode={gameMode}
          isOpponentTurn={gameState.currentPlayer === "player2"}
          score={gameState.scores.player2}
          capturesCount={gameState.player2CapturesCount}
          activeProverb={activeProverb}
          opponentType={opponentType}
        />

        {/* Traditional Ayò Board */}
        <GameBoard
          board={gameState.board}
          currentPlayer={gameState.currentPlayer}
          isAiThinking={isAiThinking}
          scores={gameState.scores}
          legalMoves={legalMoves}
          onPitClick={handlePitClick}
          lastMove={gameState.lastMove}
          activeSowingPit={activeSowingPit}
        />

        {/* Player 1 Status Card (South) */}
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between bg-[#111728]/80 border border-stone-800 rounded-2xl px-5 py-3 shadow-lg shadow-black/40">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-['Cinzel'] font-bold text-lg ${
                gameState.currentPlayer === "player1"
                  ? "bg-amber-500 text-stone-950 ring-2 ring-amber-400"
                  : "bg-stone-800 text-stone-400"
              }`}
            >
              P1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Cinzel'] font-bold text-stone-100 text-sm">
                  {gameMode === "pass_and_play" ? "Player 1 (South)" : "You (The Traveler)"}
                </span>
                {gameState.currentPlayer === "player1" && !gameState.isGameOver && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Your Turn
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                Click any glowing pit on your side (South #1-6) to sow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Captured</span>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="font-['Cinzel'] text-xl font-black text-amber-300">
                  {gameState.scores.player1}
                </span>
                <span className="text-xs text-stone-500">/ 25</span>
              </div>
            </div>

            {/* Quick Divination Peek if game finished */}
            {gameState.isGameOver && matchStats && (
              <button
                onClick={() => setShowDivination(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>View Divination</span>
              </button>
            )}
          </div>
        </div>

        {/* Move History Strip */}
        <MoveHistory history={gameState.history} />
      </main>

      {/* Footer / Cultural Credit */}
      <footer className="border-t border-stone-800/80 bg-[#090d16] px-4 py-3 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-serif">
            Ayò Olópon is a classical Yoruba divination and strategy game honoring oral traditions and Ifá wisdom.
          </p>
          <div className="flex items-center gap-3 text-stone-400">
            <span>Yoruba Heritage</span>
            <span>•</span>
            <span>Gemini AI Divination Reading</span>
            <span>•</span>
            <span>48 Sacred Cowries</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <IntroDialogueModal
        isOpen={showIntro}
        onClose={() => setShowIntro(false)}
        selectedTheme={theme}
        onSelectTheme={(newTheme) => setTheme(newTheme)}
      />

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />

      {matchStats && (
        <DivinationModal
          isOpen={showDivination}
          matchStats={matchStats}
          onPlayAgain={handleResetGame}
          onThemeChange={(newTheme) => {
            setTheme(newTheme);
            setMatchStats((prev) => (prev ? { ...prev, theme: newTheme } : null));
          }}
        />
      )}
    </div>
  );
}
