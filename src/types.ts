export type Player = "player1" | "player2";

export type GameMode = "vs_trickster" | "vs_diviner" | "vs_apprentice" | "pass_and_play";

export type DivinationTheme = "harvest" | "love" | "journey" | "conflict";

export interface PitState {
  index: number; // 0-11
  owner: Player;
  seeds: number;
  isHovered?: boolean;
  isValid?: boolean;
}

export type MoveType = "small_capture" | "big_capture" | "risky_move" | "defensive_move" | "normal_sow";

export interface CaptureEvent {
  player: Player;
  pitsCaptured: number[];
  seedsCount: number;
  moveType: MoveType;
  turnNumber: number;
  proverb: string;
}

export interface MatchStats {
  winner: Player | "draw";
  player1Seeds: number;
  player2Seeds: number;
  player1Captures: number;
  player2Captures: number;
  biggestCapture: number;
  totalTurns: number;
  theme: DivinationTheme;
  reader: "trickster" | "diviner";
}

export interface DivinationReading {
  reading: string;
  advice: string;
  theme: DivinationTheme;
  reader: "trickster" | "diviner";
  source: string;
}

export interface DialogueLine {
  speaker: "diviner" | "trickster";
  text: string;
  expression?: "calm" | "stern" | "laughing" | "sly" | "surprised";
}

export interface GriotProverb {
  id: string;
  text: string;
  type: MoveType;
  speaker: "diviner" | "trickster" | "griot";
}
