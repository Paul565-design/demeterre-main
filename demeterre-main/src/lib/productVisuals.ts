function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const VISUAL_RULES = [
  { match: ["pomme de terre", "patate"], emoji: "🥔" },
  { match: ["pomme"], emoji: "🍎" },
  { match: ["banane"], emoji: "🍌" },
  { match: ["tomate"], emoji: "🍅" },
  { match: ["carotte"], emoji: "🥕" },
  { match: ["fraise"], emoji: "🍓" },
  { match: ["orange"], emoji: "🍊" },
  { match: ["courgette"], emoji: "🥒" },
  { match: ["raisin"], emoji: "🍇" },
  { match: ["brocoli", "broccoli"], emoji: "🥦" },
  { match: ["poulet", "dinde", "volaille"], emoji: "🍗" },
  { match: ["steak", "boeuf", "hach"], emoji: "🥩" },
  { match: ["lait"], emoji: "🥛" },
  { match: ["avoine"], emoji: "🌾" },
  { match: ["nutella", "tartiner", "nocciolata"], emoji: "🌰" },
  { match: ["coca", "cola", "soda"], emoji: "🥤" },
  { match: ["eau"], emoji: "💧" },
  { match: ["yaourt", "danone"], emoji: "🥣" },
  { match: ["fromage", "parmesan"], emoji: "🧀" },
];

export function getProductEmoji(name: string, category?: string) {
  const haystack = `${normalize(name)} ${normalize(category || "")}`;

  for (const rule of VISUAL_RULES) {
    if (rule.match.some((keyword) => haystack.includes(keyword))) {
      return rule.emoji;
    }
  }

  return "📦";
}
