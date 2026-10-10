export interface Movement {
  id: string;
  name: string;
  periodYears: string;
  geographicCenter: string;
  definition: string;
  characteristics: string[];
  keyArtists: string[];
  historicalMilestones: string;
  associatedArtworkIds: string[];
}

export const MOVEMENTS: Movement[] = [
  {
    id: 'postimpressionnisme',
    name: 'Postimpressionnisme',
    periodYears: '1886 – 1905',
    geographicCenter: 'France (Paris, Provence, Pont-Aven)',
    definition: "Mouvement charnière succédant à l'impressionnisme, où les artistes dépassent la simple notation de la lumière éphémère pour rechercher une structure formelle rigoureuse (Cézanne, Seurat) ou une vérité émotionnelle et symbolique brute (Van Gogh, Gauguin).",
    characteristics: [
      "Autonomie de la couleur par rapport à l'imitation naturelle",
      "Épaisseur de matière (impasto) et touche construite ou divisionniste",
      "Synthétisme des formes et simplification des contours",
      "Primauté de l'expression intérieure sur le réalisme visuel",
    ],
    keyArtists: ['Vincent van Gogh', 'Paul Cézanne', 'Georges Seurat', 'Paul Gauguin'],
    historicalMilestones: "Dernière exposition impressionniste de 1886, Salon des Indépendants, diffusion des théories optiques de Chevreul.",
    associatedArtworkIds: ['starry-night', 'cezanne-sainte-victoire'],
  },
  {
    id: 'age-or-hollandais',
    name: "Âge d'or hollandais",
    periodYears: '1588 – 1672',
    geographicCenter: 'Provinces-Unies (Delft, Amsterdam, Haarlem)',
    definition: "Période d'extraordinaire épanouissement culturel et pictural dans les Pays-Bas libérés de la tutelle espagnole. Dans un contexte calviniste sans mécénat papal, les peintres inventent un art bourgeois axé sur les scènes de genre, les natures mortes, les paysages et les portraits intimes.",
    characteristics: [
      "Lumière douce et diffuse filtrant souvent par une baie vitrée",
      "Précision du rendu des matières (faïence, étain, tissus, perles)",
      "Signification morale et méditative discrète (vanités, scènes domestiques)",
      "Maîtrise virtuose du glacis et des pigments précieux (lapis-lazuli)",
    ],
    keyArtists: ['Johannes Vermeer', 'Rembrandt van Rijn', 'Frans Hals', 'Jan Steen'],
    historicalMilestones: "Traité de Westphalie (1648), prospérité de la Compagnie néerlandaise des Indes orientales, révolution scientifique et optique.",
    associatedArtworkIds: ['girl-pearl-earring', 'milkmaid'],
  },
  {
    id: 'baroque-italien',
    name: 'Baroque italien & Ténébrisme',
    periodYears: '1600 – 1700',
    geographicCenter: 'Rome, Naples, Florence',
    definition: "Art de l'émotion dramatique, du mouvement impétueux et des contrastes violents de lumière et d'ombre. Impulsé par la Contre-Réforme et révolutionné par le réalisme sans fard du Caravage, le baroque rejette l'idéalisme serein de la Renaissance.",
    characteristics: [
      "Chiaroscuro foudroyant et fonds nocturnes abyssaux (ténébrisme)",
      "Cadrages serrés créant une immersion physique immédiate pour le fidèle",
      "Expressivité véhémente des corps et tension des muscles en action",
      "Réalisme cru des visages, mains calleuses et pieds souillés",
    ],
    keyArtists: ['Caravage (Caravaggio)', 'Artemisia Gentileschi', 'Le Bernin', 'Annibale Carracci'],
    historicalMilestones: "Concile de Trente (1545-1563) encourageant un art persuasif et pathétique pour reconquérir les âmes face au protestantisme.",
    associatedArtworkIds: ['judith-holofernes'],
  },
  {
    id: 'impressionnisme',
    name: 'Impressionnisme',
    periodYears: '1874 – 1886',
    geographicCenter: 'Paris, Normandie, bords de Seine',
    definition: "Rupture fondatrice de la modernité : peindre sur le motif la sensation visuelle immédiate, l'air en mouvement et les reflets chatoyants de l'eau, grâce à une touche fragmentée et l'abolition des noirs et contours dessinés au trait.",
    characteristics: [
      "Pratique du plein air permise par l'invention des tubes de peinture",
      "Touche rapide en virgules et juxtaposition de tons clairs",
      "Ombres colorées (bleues ou violettes) remplaçant le noir",
      "Thèmes de la vie moderne : boulevards, régates, loisirs, chemins de fer",
    ],
    keyArtists: ['Claude Monet', 'Edgar Degas', 'Berthe Morisot', 'Camille Pissarro', 'Pierre-Auguste Renoir'],
    historicalMilestones: "Première exposition impressionniste de 1874 dans l'atelier du photographe Nadar à Paris.",
    associatedArtworkIds: ['impression-sunrise'],
  },
  {
    id: 'romantisme',
    name: 'Romantisme',
    periodYears: '1800 – 1850',
    geographicCenter: 'Espagne, France, Allemagne, Angleterre',
    definition: "Soulèvement contre le rationalisme froid des Lumières et le néoclassicisme académique. Le romantisme exalte la passion individuelle, le vertige de la nature sauvage, la mélancolie et la tragédie de l'histoire contemporaine.",
    characteristics: [
      "Dynamique tourmentée des diagonales et composition instable",
      "Prédilection pour la nuit, la tempête, le sublime et l'effroi",
      "Palette chaude et empâtements fougueux",
      "Engagement politique en faveur de la liberté des peuples",
    ],
    keyArtists: ['Francisco de Goya', 'Eugène Delacroix', 'Caspar David Friedrich', 'J.M.W. Turner'],
    historicalMilestones: "Révolution française, guerres d'indépendance européennes, révolutions de 1830 et 1848.",
    associatedArtworkIds: ['third-of-may'],
  },
  {
    id: 'symbolisme-moderne',
    name: 'Symbolisme & Art Moderne',
    periodYears: '1900 – 1950',
    geographicCenter: 'Mexique, Europe, États-Unis',
    definition: "Exploration des mondes intérieurs, du subconscient, des mythes ancestraux et des blessures existentielles à travers une réinvention totale du langage formel.",
    characteristics: [
      "Allégories intimes et métaphores corporelles",
      "Mélange de motifs populaires indigènes et de techniques modernes",
      "Rejet du réalisme photographique au profit de la vérité psychologique",
    ],
    keyArtists: ['Frida Kahlo', 'Odilon Redon', 'Gustav Klimt', 'Edvard Munch'],
    historicalMilestones: "Psychanalyse freudienne, guerres mondiales, avant-gardes surréalistes et renouveau des identités nationales.",
    associatedArtworkIds: ['thorn-necklace'],
  },
];
