import { Player, MoveType } from "../types";

export interface AyoState {
  board: number[]; // 12 pits, 0-5 = Player 1 (South), 6-11 = Player 2 (North)
  scores: {
    player1: number;
    player2: number;
  };
  currentPlayer: Player;
  isGameOver: boolean;
  winner: Player | "draw" | null;
  turnNumber: number;
  lastMove: {
    player: Player;
    fromPit: number;
    capturedCount: number;
    capturedPits: number[];
    moveType: MoveType;
  } | null;
  history: {
    player: Player;
    fromPit: number;
    captured: number;
  }[];
  biggestCapture: number;
  player1CapturesCount: number;
  player2CapturesCount: number;
}

export const INITIAL_BOARD = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];

export function createInitialState(): AyoState {
  return {
    board: [...INITIAL_BOARD],
    scores: {
      player1: 0,
      player2: 0
    },
    currentPlayer: "player1",
    isGameOver: false,
    winner: null,
    turnNumber: 1,
    lastMove: null,
    history: [],
    biggestCapture: 0,
    player1CapturesCount: 0,
    player2CapturesCount: 0
  };
}

export function isPlayerPit(player: Player, pitIndex: number): boolean {
  if (player === "player1") {
    return pitIndex >= 0 && pitIndex <= 5;
  }
  return pitIndex >= 6 && pitIndex <= 11;
}

export function getOpponent(player: Player): Player {
  return player === "player1" ? "player2" : "player1";
}

// Does a player have any seeds on their side?
export function hasSeeds(board: number[], player: Player): boolean {
  const start = player === "player1" ? 0 : 6;
  const end = player === "player1" ? 5 : 11;
  for (let i = start; i <= end; i++) {
    if (board[i] > 0) return true;
  }
  return false;
}

// Can a move feed the opponent if the opponent currently has no seeds?
export function moveFeedsOpponent(board: number[], pitIndex: number): boolean {
  const seeds = board[pitIndex];
  if (seeds === 0) return false;
  const player: Player = pitIndex <= 5 ? "player1" : "player2";
  const oppStart = player === "player1" ? 6 : 0;
  const oppEnd = player === "player1" ? 11 : 5;

  let curr = pitIndex;
  let remaining = seeds;
  while (remaining > 0) {
    curr = (curr + 1) % 12;
    if (curr === pitIndex) continue; // 12+ seeds skip origin pit
    if (curr >= oppStart && curr <= oppEnd) {
      return true;
    }
    remaining--;
  }
  return false;
}

// Get all legal pits that the current player can sow from
export function getLegalMoves(state: AyoState): number[] {
  if (state.isGameOver) return [];
  const player = state.currentPlayer;
  const opp = getOpponent(player);
  const oppHasSeeds = hasSeeds(state.board, opp);

  const moves: number[] = [];
  const start = player === "player1" ? 0 : 6;
  const end = player === "player1" ? 5 : 11;

  for (let i = start; i <= end; i++) {
    if (state.board[i] > 0) {
      // If opponent has no seeds, player must feed if possible
      if (!oppHasSeeds) {
        if (moveFeedsOpponent(state.board, i)) {
          moves.push(i);
        }
      } else {
        moves.push(i);
      }
    }
  }

  // If no move can feed opponent, then any non-empty pit is allowed (will end game)
  if (moves.length === 0 && !oppHasSeeds) {
    for (let i = start; i <= end; i++) {
      if (state.board[i] > 0) moves.push(i);
    }
  }

  return moves;
}

export interface SimulationResult {
  newBoard: number[];
  capturedSeeds: number;
  capturedPits: number[];
  lastPit: number;
  sowSequence: { pit: number; seedsRemainingInHand: number }[];
}

// Simulate sowing step-by-step
export function simulateMove(board: number[], pitIndex: number, player: Player): SimulationResult {
  const newBoard = [...board];
  let seedsInHand = newBoard[pitIndex];
  newBoard[pitIndex] = 0;

  let curr = pitIndex;
  const originPit = pitIndex;
  const sowSequence: { pit: number; seedsRemainingInHand: number }[] = [];

  while (seedsInHand > 0) {
    curr = (curr + 1) % 12;
    if (curr === originPit) {
      // Authentic 12+ seeds skip origin pit rule
      continue;
    }
    newBoard[curr]++;
    seedsInHand--;
    sowSequence.push({
      pit: curr,
      seedsRemainingInHand: seedsInHand
    });
  }

  const lastPit = curr;
  let capturedSeeds = 0;
  const capturedPits: number[] = [];

  // Opponent territory boundaries
  const oppStart = player === "player1" ? 6 : 0;
  const oppEnd = player === "player1" ? 11 : 5;

  // Capture check: must land in opponent's territory and result in 2 or 3 seeds
  if (lastPit >= oppStart && lastPit <= oppEnd && (newBoard[lastPit] === 2 || newBoard[lastPit] === 3)) {
    // Backward cascading capture
    let testPit = lastPit;
    const prospectivePits: number[] = [];
    let prospectiveSeeds = 0;

    while (testPit >= oppStart && testPit <= oppEnd && (newBoard[testPit] === 2 || newBoard[testPit] === 3)) {
      prospectivePits.push(testPit);
      prospectiveSeeds += newBoard[testPit];
      testPit = (testPit - 1 + 12) % 12;
    }

    // Grand slam / Starvation check:
    // If this capture would take ALL of the opponent's remaining seeds, the capture is voided
    // in traditional Ayò (or allowed only if the opponent had other seeds).
    let remainingOppSeeds = 0;
    for (let i = oppStart; i <= oppEnd; i++) {
      if (!prospectivePits.includes(i)) {
        remainingOppSeeds += newBoard[i];
      }
    }

    if (remainingOppSeeds > 0) {
      // Valid capture!
      for (const p of prospectivePits) {
        capturedSeeds += newBoard[p];
        newBoard[p] = 0;
        capturedPits.push(p);
      }
    }
  }

  return {
    newBoard,
    capturedSeeds,
    capturedPits,
    lastPit,
    sowSequence
  };
}

// Classify move for narrative / commentary
export function classifyMove(
  boardBefore: number[],
  capturedSeeds: number,
  pitIndex: number,
  player: Player
): MoveType {
  if (capturedSeeds >= 4) return "big_capture";
  if (capturedSeeds > 0) return "small_capture";

  // Check if player left a pit with 1 or 2 seeds vulnerable to opponent
  const oppStart = player === "player1" ? 6 : 0;
  const oppEnd = player === "player1" ? 11 : 5;
  let hasVuln = false;
  for (let i = oppStart; i <= oppEnd; i++) {
    if (boardBefore[i] >= 1 && boardBefore[i] <= 2) {
      hasVuln = true;
      break;
    }
  }

  const initialSeeds = boardBefore[pitIndex];
  if (initialSeeds >= 7) return "risky_move";
  if (initialSeeds <= 2 && hasVuln) return "defensive_move";
  return "normal_sow";
}

// Execute move and produce next state
export function executeMove(state: AyoState, pitIndex: number): AyoState {
  if (state.isGameOver) return state;

  const player = state.currentPlayer;
  const opp = getOpponent(player);

  const { newBoard, capturedSeeds, capturedPits } = simulateMove(state.board, pitIndex, player);

  const newScores = { ...state.scores };
  if (player === "player1") {
    newScores.player1 += capturedSeeds;
  } else {
    newScores.player2 += capturedSeeds;
  }

  const moveType = classifyMove(state.board, capturedSeeds, pitIndex, player);

  let isGameOver = false;
  let winner = state.winner;

  // Instant victory check: 25+ seeds captured
  if (newScores.player1 >= 25) {
    isGameOver = true;
    winner = "player1";
  } else if (newScores.player2 >= 25) {
    isGameOver = true;
    winner = "player2";
  } else if (newScores.player1 === 24 && newScores.player2 === 24) {
    isGameOver = true;
    winner = "draw";
  } else {
    // Check if next player has moves or if total seeds on board is too low to ever capture
    const nextPlayerHasSeeds = hasSeeds(newBoard, opp);
    if (!nextPlayerHasSeeds) {
      // Opponent is starved; remaining seeds go to the player who still has them
      let remainingPlayerSeeds = 0;
      const pStart = player === "player1" ? 0 : 6;
      const pEnd = player === "player1" ? 5 : 11;
      for (let i = pStart; i <= pEnd; i++) {
        remainingPlayerSeeds += newBoard[i];
        newBoard[i] = 0;
      }
      if (player === "player1") {
        newScores.player1 += remainingPlayerSeeds;
      } else {
        newScores.player2 += remainingPlayerSeeds;
      }
      isGameOver = true;
      if (newScores.player1 > newScores.player2) winner = "player1";
      else if (newScores.player2 > newScores.player1) winner = "player2";
      else winner = "draw";
    }
  }

  const biggestCap = Math.max(state.biggestCapture, capturedSeeds);

  return {
    board: newBoard,
    scores: newScores,
    currentPlayer: isGameOver ? state.currentPlayer : opp,
    isGameOver,
    winner,
    turnNumber: state.turnNumber + 1,
    lastMove: {
      player,
      fromPit: pitIndex,
      capturedCount: capturedSeeds,
      capturedPits,
      moveType
    },
    history: [
      ...state.history,
      {
        player,
        fromPit: pitIndex,
        captured: capturedSeeds
      }
    ],
    biggestCapture: biggestCap,
    player1CapturesCount: state.player1CapturesCount + (player === "player1" && capturedSeeds > 0 ? 1 : 0),
    player2CapturesCount: state.player2CapturesCount + (player === "player2" && capturedSeeds > 0 ? 1 : 0)
  };
}

/**
 * AI Opponent decision maker
 * Personality styles:
 * - "trickster" (Èṣù): opportunistic, baits traps, seeks sudden big captures or chaotic board states
 * - "diviner" (Baba Ifá): deep lookahead, patient defense, guards vulnerable 1-2 seed pits, starves opponent
 * - "apprentice": simple heuristic with occasional whimsical choice
 */
export function getAIMove(
  state: AyoState,
  personality: "trickster" | "diviner" | "apprentice" = "trickster"
): number {
  const legalMoves = getLegalMoves(state);
  if (legalMoves.length === 0) return -1;
  if (legalMoves.length === 1) return legalMoves[0];

  const scoredMoves: { pit: number; score: number }[] = [];

  for (const pit of legalMoves) {
    const sim = simulateMove(state.board, pit, "player2");
    let score = 0;

    // 1. Direct captures are highly valued
    score += sim.capturedSeeds * 20;

    // 2. Avoid leaving pits with 1 or 2 seeds on your own side (pits 6-11)
    let ownVulnerableCount = 0;
    for (let i = 6; i <= 11; i++) {
      if (sim.newBoard[i] === 1 || sim.newBoard[i] === 2) {
        ownVulnerableCount++;
      }
    }

    // 3. Look at player 1's counter-attacks
    let maxOppCounterCapture = 0;
    for (let p1Move = 0; p1Move <= 5; p1Move++) {
      if (sim.newBoard[p1Move] > 0) {
        const p1Sim = simulateMove(sim.newBoard, p1Move, "player1");
        if (p1Sim.capturedSeeds > maxOppCounterCapture) {
          maxOppCounterCapture = p1Sim.capturedSeeds;
        }
      }
    }

    if (personality === "diviner") {
      // Baba Ifá: highly defensive, calculates opponent threats and seed control
      score -= ownVulnerableCount * 8;
      score -= maxOppCounterCapture * 22;

      // Prefers keeping balanced seeds across pits
      const totalOwnSeeds = sim.newBoard.slice(6, 12).reduce((a, b) => a + b, 0);
      score += totalOwnSeeds * 2;
    } else if (personality === "trickster") {
      // Èṣù: loves wild swings, high single-turn strikes, bold advances
      score += sim.capturedSeeds * 28;
      score -= maxOppCounterCapture * 14;
      // Adds a dash of unpredictable genius
      score += (Math.random() - 0.5) * 6;
      if (sim.capturedSeeds >= 4) score += 30; // Loves grand slam captures
    } else {
      // Apprentice: basic captures + slight random noise
      score += sim.capturedSeeds * 15;
      score -= maxOppCounterCapture * 8;
      score += (Math.random() - 0.5) * 12;
    }

    scoredMoves.push({ pit, score });
  }

  // Sort descending by score
  scoredMoves.sort((a, b) => b.score - a.score);
  return scoredMoves[0].pit;
}
