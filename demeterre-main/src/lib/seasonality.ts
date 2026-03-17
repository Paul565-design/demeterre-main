type SeasonEntry = {
  label: string;
  aliases: string[];
  months: number[];
  emoji: string;
  note: string;
};

const SEASON_DATABASE: SeasonEntry[] = [
  { label: "Abricot", aliases: ["abricot", "abricots"], months: [6, 7, 8], emoji: "🍑", note: "L'abricot est surtout de saison en ete." },
  { label: "Ail", aliases: ["ail"], months: [6, 7, 8, 9, 10, 11], emoji: "🧄", note: "L'ail frais est meilleur de l'ete a l'automne." },
  { label: "Ananas", aliases: ["ananas"], months: [1, 2, 3, 4, 11, 12], emoji: "🍍", note: "L'ananas est surtout present via importation, avec une bonne disponibilite en hiver." },
  { label: "Artichaut", aliases: ["artichaut", "artichauts"], months: [5, 6, 7, 8], emoji: "🥬", note: "L'artichaut se consomme surtout entre la fin du printemps et l'ete." },
  { label: "Asperge", aliases: ["asperge", "asperges"], months: [4, 5, 6], emoji: "🥬", note: "L'asperge est un legume de printemps." },
  { label: "Aubergine", aliases: ["aubergine", "aubergines"], months: [6, 7, 8, 9], emoji: "🍆", note: "L'aubergine est typiquement un legume d'ete." },
  { label: "Avocat", aliases: ["avocat", "avocats"], months: [11, 12, 1, 2, 3, 4], emoji: "🥑", note: "L'avocat est surtout consomme en saison d'automne-hiver." },
  { label: "Banane", aliases: ["banane", "bananes"], months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], emoji: "🍌", note: "Disponible toute l'annee, souvent via importation." },
  { label: "Betterave", aliases: ["betterave", "betteraves"], months: [7, 8, 9, 10, 11, 12, 1, 2], emoji: "🥕", note: "La betterave est favorable de l'ete a l'hiver." },
  { label: "Brocoli", aliases: ["brocoli", "brocolis", "broccoli"], months: [9, 10, 11, 12, 1, 2, 3], emoji: "🥦", note: "Le brocoli se consomme surtout de l'automne au debut du printemps." },
  { label: "Carotte", aliases: ["carotte", "carottes"], months: [7, 8, 9, 10, 11, 12], emoji: "🥕", note: "Production locale tres favorable de l'ete a l'hiver." },
  { label: "Cassis", aliases: ["cassis"], months: [7, 8], emoji: "🫐", note: "Le cassis est surtout de saison en ete." },
  { label: "Celeri", aliases: ["celeri", "celeri rave", "celeri branche"], months: [9, 10, 11, 12, 1, 2, 3], emoji: "🥬", note: "Le celeri est surtout favorable en automne et hiver." },
  { label: "Cerise", aliases: ["cerise", "cerises"], months: [5, 6, 7], emoji: "🍒", note: "La cerise a une saison plutot courte de fin de printemps." },
  { label: "Champignon", aliases: ["champignon", "champignons"], months: [1, 2, 3, 4, 5, 9, 10, 11, 12], emoji: "🍄", note: "Les champignons sont surtout favorables en automne, avec certaines productions plus longues." },
  { label: "Chataigne", aliases: ["chataigne", "chataignes", "marron", "marrons"], months: [10, 11, 12], emoji: "🌰", note: "La chataigne est un produit d'automne." },
  { label: "Chou", aliases: ["chou", "choux", "chou vert", "chou rouge", "chou blanc"], months: [9, 10, 11, 12, 1, 2, 3], emoji: "🥬", note: "Les choux sont surtout de saison en automne et en hiver." },
  { label: "Chou-fleur", aliases: ["chou-fleur", "chou fleur"], months: [9, 10, 11, 12, 1, 2, 3, 4], emoji: "🥦", note: "Le chou-fleur se consomme surtout du debut d'automne au printemps." },
  { label: "Citron", aliases: ["citron", "citrons"], months: [11, 12, 1, 2, 3, 4], emoji: "🍋", note: "Le citron est surtout de saison en hiver et au debut du printemps." },
  { label: "Clémentine", aliases: ["clementine", "clementines", "mandarine", "mandarines"], months: [11, 12, 1, 2], emoji: "🍊", note: "Les clementines et mandarines sont surtout de saison en hiver." },
  { label: "Concombre", aliases: ["concombre", "concombres"], months: [5, 6, 7, 8, 9], emoji: "🥒", note: "Le concombre est surtout de saison pendant les mois chauds." },
  { label: "Courge", aliases: ["courge", "courges", "potimarron", "butternut", "citrouille", "potiron"], months: [9, 10, 11, 12, 1, 2], emoji: "🎃", note: "Les courges sont typiquement des produits d'automne et d'hiver." },
  { label: "Courgette", aliases: ["courgette", "courgettes"], months: [6, 7, 8, 9], emoji: "🥒", note: "La courgette est surtout de saison en ete." },
  { label: "Cranberry", aliases: ["cranberry", "canneberge"], months: [9, 10, 11], emoji: "🫐", note: "La canneberge est surtout de saison en automne." },
  { label: "Endive", aliases: ["endive", "endives", "chicon"], months: [10, 11, 12, 1, 2, 3], emoji: "🥬", note: "L'endive est surtout de saison en automne et hiver." },
  { label: "Epinard", aliases: ["epinard", "epinards"], months: [3, 4, 5, 9, 10, 11], emoji: "🥬", note: "Les epinards sont surtout favorables au printemps et en automne." },
  { label: "Fenouil", aliases: ["fenouil"], months: [5, 6, 7, 8, 9, 10], emoji: "🥬", note: "Le fenouil se consomme surtout de la fin du printemps a l'automne." },
  { label: "Figue", aliases: ["figue", "figues"], months: [8, 9], emoji: "� fig", note: "La figue est surtout de saison en fin d'ete." },
  { label: "Fraise", aliases: ["fraise", "fraises"], months: [5, 6, 7], emoji: "🍓", note: "La pleine saison commence a la fin du printemps." },
  { label: "Framboise", aliases: ["framboise", "framboises"], months: [6, 7, 8, 9], emoji: "🍓", note: "La framboise est surtout de saison en ete." },
  { label: "Haricot vert", aliases: ["haricot vert", "haricots verts"], months: [6, 7, 8, 9], emoji: "🫛", note: "Les haricots verts sont surtout de saison en ete." },
  { label: "Kiwi", aliases: ["kiwi", "kiwis"], months: [11, 12, 1, 2, 3, 4], emoji: "🥝", note: "Le kiwi est surtout de saison pendant l'automne et l'hiver." },
  { label: "Mangue", aliases: ["mangue", "mangues"], months: [5, 6, 7, 8, 9], emoji: "🥭", note: "La mangue est surtout de saison du printemps a la fin de l'ete, souvent via importation." },
  { label: "Melon", aliases: ["melon", "melons"], months: [6, 7, 8, 9], emoji: "🍈", note: "Le melon est surtout de saison en ete." },
  { label: "Mure", aliases: ["mure", "mures"], months: [7, 8, 9], emoji: "🫐", note: "La mure est surtout de saison en ete et debut d'automne." },
  { label: "Navet", aliases: ["navet", "navets"], months: [5, 6, 7, 9, 10, 11], emoji: "🥕", note: "Le navet est surtout favorable au printemps et en automne." },
  { label: "Nectarine", aliases: ["nectarine", "nectarines", "brugnon", "brugnons"], months: [6, 7, 8, 9], emoji: "🍑", note: "Les nectarines sont surtout de saison en ete." },
  { label: "Oignon", aliases: ["oignon", "oignons"], months: [6, 7, 8, 9, 10, 11, 12], emoji: "🧅", note: "L'oignon se conserve bien et est favorable sur une longue periode." },
  { label: "Orange", aliases: ["orange", "oranges"], months: [11, 12, 1, 2, 3], emoji: "🍊", note: "Les agrumes sont surtout de saison en hiver." },
  { label: "Panais", aliases: ["panais"], months: [10, 11, 12, 1, 2, 3], emoji: "🥕", note: "Le panais est surtout un legume d'automne-hiver." },
  { label: "Pasteque", aliases: ["pasteque", "pasteques"], months: [6, 7, 8], emoji: "🍉", note: "La pasteque est surtout de saison en plein ete." },
  { label: "Patate douce", aliases: ["patate douce", "patates douces"], months: [9, 10, 11, 12, 1, 2], emoji: "🍠", note: "La patate douce est surtout favorable en automne et hiver." },
  { label: "Peche", aliases: ["peche", "peches"], months: [6, 7, 8, 9], emoji: "🍑", note: "La peche est surtout de saison en ete." },
  { label: "Petit pois", aliases: ["petit pois", "petits pois"], months: [5, 6, 7], emoji: "🫛", note: "Les petits pois frais sont surtout de saison en fin de printemps." },
  { label: "Poire", aliases: ["poire", "poires"], months: [8, 9, 10, 11, 12, 1], emoji: "🍐", note: "La poire est surtout de saison entre la fin d'ete et l'hiver." },
  { label: "Poireau", aliases: ["poireau", "poireaux"], months: [9, 10, 11, 12, 1, 2, 3, 4], emoji: "🥬", note: "Le poireau est surtout de saison de l'automne au printemps." },
  { label: "Poivron", aliases: ["poivron", "poivrons"], months: [6, 7, 8, 9, 10], emoji: "🫑", note: "Le poivron est surtout de saison entre l'ete et le debut de l'automne." },
  { label: "Pomme de terre", aliases: ["pommes de terre", "pomme de terre"], months: [1, 2, 3, 4, 9, 10, 11, 12], emoji: "🥔", note: "Meilleure periode de conservation et de production locale." },
  { label: "Pomme", aliases: ["pomme", "pommes"], months: [8, 9, 10, 11, 12, 1, 2, 3, 4], emoji: "🍎", note: "La pomme se consomme tres bien en automne et en hiver." },
  { label: "Potiron", aliases: ["potiron", "potirons"], months: [9, 10, 11, 12, 1], emoji: "🎃", note: "Le potiron est surtout un produit d'automne." },
  { label: "Prune", aliases: ["prune", "prunes", "quetsche", "mirabelle"], months: [7, 8, 9], emoji: "🟣", note: "Les prunes sont surtout de saison en fin d'ete." },
  { label: "Radis", aliases: ["radis"], months: [4, 5, 6, 7, 8, 9], emoji: "🥕", note: "Le radis est surtout favorable du printemps a la fin de l'ete." },
  { label: "Raisin", aliases: ["raisin", "raisins"], months: [8, 9, 10], emoji: "🍇", note: "La meilleure periode se situe a la fin de l'ete et en debut d'automne." },
  { label: "Salade", aliases: ["salade", "laitue", "batavia", "romaine"], months: [4, 5, 6, 7, 8, 9], emoji: "🥬", note: "La salade est plus favorable du printemps a l'ete." },
  { label: "Tomate", aliases: ["tomate", "tomates"], months: [6, 7, 8, 9], emoji: "🍅", note: "La tomate est ideale en ete, en pleine saison." },
];

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aou", "Sep", "Oct", "Nov", "Dec"];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findSeasonEntry(name: string, category?: string) {
  const haystack = `${normalize(name)} ${normalize(category || "")}`;
  const expanded = SEASON_DATABASE.flatMap((entry) =>
    entry.aliases.map((alias) => ({
      entry,
      alias,
    }))
  ).sort((a, b) => b.alias.length - a.alias.length);

  for (const item of expanded) {
    const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegex(item.alias)}([^a-z0-9]|$)`, "i");
    if (pattern.test(haystack)) {
      return item.entry;
    }
  }

  return null;
}

export function getSeasonalityInfo(name: string, category?: string) {
  const match = findSeasonEntry(name, category);

  if (!match) {
    return null;
  }

  const currentMonth = new Date().getMonth() + 1;
  const inSeason = match.months.includes(currentMonth);

  return {
    ...match,
    inSeason,
    currentMonth,
    monthLabels: match.months.map((month) => MONTH_LABELS[month - 1]),
    statusLabel: inSeason ? "Oui, c'est la bonne saison" : "Hors saison",
    statusDescription: inSeason
      ? "Ce produit est actuellement dans sa periode la plus favorable."
      : "Ce produit n'est pas dans sa meilleure periode de saison en ce moment.",
  };
}
