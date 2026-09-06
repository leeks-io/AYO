import { DialogueLine, GriotProverb, DivinationTheme } from "../types";

/**
 * Pre-game intro exchange between Elder Ifá Priest and the Trickster Spirit.
 * Adheres strictly to the user's prompt:
 * "short 6-8 line dialogue exchange... elder Ifá diviner who speaks in calm,
 * measured proverbs, and a mischievous trickster spirit who teases and speaks in riddles...
 * hints that the outcome will reveal something true about the player. Tone: warm, playful,
 * West African oral storytelling cadence. Under 20 words per line."
 */
export const INTRO_DIALOGUE: DialogueLine[] = [
  {
    speaker: "trickster",
    text: "Sit, old father! The twelve carved hollows yawn, waiting for our hands to dance.",
    expression: "sly"
  },
  {
    speaker: "diviner",
    text: "The carved board is not a toy, clever boy; it is a mirror held up to destiny.",
    expression: "calm"
  },
  {
    speaker: "trickster",
    text: "Then let the mortal roll their seeds! Let us see if their heart is tortoise or hare!",
    expression: "laughing"
  },
  {
    speaker: "diviner",
    text: "Patience weaves the cloth, Èṣù. The one who scatters with arrogance reaps only broken husks.",
    expression: "calm"
  },
  {
    speaker: "trickster",
    text: "Aha, but a bold thief laughs loudest when the granary door swings wide in the wind!",
    expression: "sly"
  },
  {
    speaker: "diviner",
    text: "Play then. Every shell that falls will write your true name in the dust.",
    expression: "calm"
  },
  {
    speaker: "trickster",
    text: "Win or lose, traveler, by sundown the board will tell all your secrets to the night!",
    expression: "laughing"
  }
];

/**
 * Capture-triggered proverb pool (~20 lines).
 * Tagged by move type:
 * - small_capture (2 seeds)
 * - big_capture (4+ seeds or multi-pit cascades)
 * - risky_move (empty pit exposure or risky advance)
 * - defensive_move (shielding or starvation avoidance)
 */
export const GRIOT_PROVERBS: GriotProverb[] = [
  // Small Captures (2-3 seeds)
  {
    id: "sc-1",
    type: "small_capture",
    text: "Two grains in the pocket make a sweeter soup than twenty promised in the bush.",
    speaker: "griot"
  },
  {
    id: "sc-2",
    type: "small_capture",
    text: "The ant carries one seed at noon, yet feasts all night through the harmattan.",
    speaker: "diviner"
  },
  {
    id: "sc-3",
    type: "small_capture",
    text: "A modest harvest, yet the pot begins to bubble with flavor.",
    speaker: "griot"
  },
  {
    id: "sc-4",
    type: "small_capture",
    text: "A nibble here, a peck there—even the sparrow can strip the farmer's plot.",
    speaker: "trickster"
  },
  {
    id: "sc-5",
    type: "small_capture",
    text: "Do not spit on small shells; rivers are born from raindrops falling on stone.",
    speaker: "diviner"
  },

  // Big Captures (4+ seeds / Grand Slam)
  {
    id: "bc-1",
    type: "big_capture",
    text: "The hawk stoops once from the cloud, and the whole courtyard goes silent!",
    speaker: "griot"
  },
  {
    id: "bc-2",
    type: "big_capture",
    text: "The river broke the dam, and now the fish land straight into the basket!",
    speaker: "trickster"
  },
  {
    id: "bc-3",
    type: "big_capture",
    text: "A sudden windfall bends the cedar; carry this harvest with both hands.",
    speaker: "diviner"
  },
  {
    id: "bc-4",
    type: "big_capture",
    text: "Four hollows swept clean! The baboon cried out when his roasted yams vanished!",
    speaker: "trickster"
  },
  {
    id: "bc-5",
    type: "big_capture",
    text: "Grand harvest! When the thunderstorm passes, only the deep roots remain standing.",
    speaker: "griot"
  },

  // Risky Moves
  {
    id: "rk-1",
    type: "risky_move",
    text: "He who sticks his hand into the termite hill must not fear the pinch.",
    speaker: "trickster"
  },
  {
    id: "rk-2",
    type: "risky_move",
    text: "Dancing upon the drumhead makes great music, until the antelope skin tears.",
    speaker: "griot"
  },
  {
    id: "rk-3",
    type: "risky_move",
    text: "You exposed your courtyard to the road; let us see if kindness passes by.",
    speaker: "diviner"
  },
  {
    id: "rk-4",
    type: "risky_move",
    text: "The hyena smiles when the gate is left unlatched for the night.",
    speaker: "trickster"
  },
  {
    id: "rk-5",
    type: "risky_move",
    text: "A daring cast! Either a feast of palm wine awaits, or a long hungry walk.",
    speaker: "griot"
  },

  // Defensive Moves
  {
    id: "df-1",
    type: "defensive_move",
    text: "The tortoise pulls in his head; let the leopard wear out his claws on stone.",
    speaker: "diviner"
  },
  {
    id: "df-2",
    type: "defensive_move",
    text: "A quiet fence built today keeps tomorrow's wild boar outside the melon patch.",
    speaker: "griot"
  },
  {
    id: "df-3",
    type: "defensive_move",
    text: "Boring! Where is the fire? You hide your shells like an old miser's beads!",
    speaker: "trickster"
  },
  {
    id: "df-4",
    type: "defensive_move",
    text: "He who steps backward from the ledge does not lose his courage, only his fall.",
    speaker: "diviner"
  },
  {
    id: "df-5",
    type: "defensive_move",
    text: "Starving the opponent's greed with wisdom is the ancient way of the elders.",
    speaker: "griot"
  }
];

export interface ThemeMeta {
  id: DivinationTheme;
  name: string;
  yorubaName: string;
  symbol: string;
  tagline: string;
  color: string;
  description: string;
}

export const DIVINATION_THEMES: Record<DivinationTheme, ThemeMeta> = {
  harvest: {
    id: "harvest",
    name: "Harvest & Abundance",
    yorubaName: "Ìkórè àti Ọ̀pọ̀lọpọ̀",
    symbol: "🌾",
    tagline: "Fruit of labor, endurance, and material fortune",
    color: "from-amber-600 to-yellow-500",
    description: "Inquires into your wealth, work, patient investments, and what your hands will hold in the season ahead."
  },
  love: {
    id: "love",
    name: "Love & Kinship",
    yorubaName: "Ìfẹ́ àti Ìbáṣepọ̀",
    symbol: "❤️",
    tagline: "Heart ties, reciprocal balance, and community trust",
    color: "from-rose-600 to-amber-500",
    description: "Inquires into romantic devotion, family bonds, unspoken balances of give and take, and kindred loyalty."
  },
  journey: {
    id: "journey",
    name: "Journey & Crossroads",
    yorubaName: "Ìrìn-Àjò àti Ìkoríta",
    symbol: "🧭",
    tagline: "Life direction, unforeseen choices, and sacred crossroads",
    color: "from-indigo-600 to-cyan-500",
    description: "Inquires into sudden life transitions, upcoming travels, changes of station, and tests at the three-way road."
  },
  conflict: {
    id: "conflict",
    name: "Conflict & Triumph",
    yorubaName: "Ìjà àti Ìṣẹ́gun",
    symbol: "⚔️",
    tagline: "Trials, competition, inner grit, and resolving strife",
    color: "from-red-600 to-orange-500",
    description: "Inquires into rivalries, spiritual protection, navigating hostility, and finding peace through decisive action."
  }
};

export const CHARACTER_INFO = {
  diviner: {
    name: "Baba Ifá",
    title: "Elder Ifá Priest & Diviner",
    archetype: "The Reader & Preserver of Order",
    style: "Deep-set observant eyes, Indigo Adire cloth robes, carved Opon Ifá staff",
    motto: "What is sown with truth outlives the player and the board."
  },
  trickster: {
    name: "Èṣù-Lọ́lá",
    title: "The Spirit of the Crossroads",
    archetype: "The Trickster & Catalyst",
    style: "Patchwork red & black robe, mirrors, cowries, bird staff, asymmetric grin",
    motto: "A straight path teaches nothing. A stumble makes the dancer famous!"
  }
};
