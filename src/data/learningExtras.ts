export interface TimelineMovement {
  id: string;
  periodYears: string;
  geographicCenter: string;
  title: string;
  description: string;
  artists: string;
  artworkSampleCount: number;
}

export const TIMELINE_MOVEMENTS: TimelineMovement[] = [
  {
    id: 'renaissance',
    periodYears: '1400 – 1600',
    geographicCenter: 'Florence & Venise',
    title: 'Renaissance & Maniérisme',
    description: "Naissance de la perspective géométrique, redécouverte de l'anatomie classique et humanisme savant.",
    artists: 'Léonard de Vinci, Botticelli, Raphaël',
    artworkSampleCount: 42,
  },
  {
    id: 'baroque',
    periodYears: '1600 – 1700',
    geographicCenter: 'Rome, Madrid, Amsterdam',
    title: "Âge d'or hollandais & Baroque",
    description: 'Ténébrisme théâtral, ferveur religieuse contreréformiste et sublime intimité des scènes bourgeoises.',
    artists: 'Rembrandt, Vermeer, Caravage',
    artworkSampleCount: 36,
  },
  {
    id: 'romantisme',
    periodYears: '1800 – 1870',
    geographicCenter: 'Europe révolutionnaire',
    title: 'Romantisme & Réalisme',
    description: 'Tempête des passions, vertige sublime de la nature et confrontation crue avec le prolétariat et la réalité sociale.',
    artists: 'Goya, Delacroix, Courbet',
    artworkSampleCount: 24,
  },
  {
    id: 'impressionnisme',
    periodYears: '1870 – 1905',
    geographicCenter: 'Paris & Provence',
    title: 'Impressionnisme & Postimpressionnisme',
    description: 'Éclatement de la touche, étude des spectres lumineux solaires et déconstruction géométrique des volumes.',
    artists: 'Monet, Van Gogh, Cézanne',
    artworkSampleCount: 88,
  },
  {
    id: 'avant-gardes',
    periodYears: '1905 – 1945',
    geographicCenter: 'Mondial & Moderne',
    title: 'Avant-gardes du XXe siècle',
    description: 'Cubisme analytique, subconscient surréaliste, abstraction pure et révolte expressionniste des formes.',
    artists: 'Picasso, Kahlo, Kandinsky',
    artworkSampleCount: 52,
  },
];

export interface GlossaryTerm {
  id: string;
  term: string;
  category: string;
  icon: string;
  definition: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'sfumato',
    term: 'Le Sfumato',
    category: 'Technique de transition',
    icon: 'brush',
    definition: "Manière de peindre vaporeuse où les contours se fondent imperceptiblement dans l'atmosphère, popularisée par Léonard de Vinci grâce à de multiples couches translucides de glacis d'huile très fine.",
  },
  {
    id: 'chiaroscuro',
    term: 'Le Chiaroscuro',
    category: 'Distribution des ombres',
    icon: 'wb_twilight',
    definition: "Contraste vigoureux entre zones de lumière vive et zones d'ombre profonde pour façonner le relief tridimensionnel et intensifier la tension théâtrale d'une scène dramatique.",
  },
  {
    id: 'impasto',
    term: "L'Impasto (Empâtement)",
    category: 'Matière & Épaisseur',
    icon: 'layers',
    definition: "Application généreuse et dense de pâte picturale non diluée à la brosse ou au couteau, laissant visibles les sillons physiques du geste pour capturer la lumière rasante (typique de Rembrandt ou Van Gogh).",
  },
  {
    id: 'perspective-atmospherique',
    term: 'Perspective Atmosphérique',
    category: 'Illusion de profondeur',
    icon: 'landscape',
    definition: "Rendu de l'éloignement d'un paysage par l'atténuation progressive des contrastes et le virage chromatique vers des teintes bleuâtres et grisées sous l'effet de la masse d'air interposée.",
  },
];

export interface QuizQuestion {
  id: number;
  corpus: string;
  period: string;
  artworkTitle: string;
  artworkImage: string;
  question: string;
  options: {
    id: string;
    text: string;
    tag: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  curatorClue: string;
}

export const COLORIST_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    corpus: 'POSTIMPRESSIONNISME • GÉOMÉTRIE',
    period: '1904',
    artworkTitle: 'Paul Cézanne — La Montagne Sainte-Victoire',
    artworkImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5sVyCiOLtsTfmHIlDhz71lLeghoZGYZyNHjf8PeBemh4dO29NRsSnH8o4LapXTozzsqr5vU-zNw6zpS66zKCJjl3lAjre-gTCPQoQ-pCwHQgeeoWY0yrF7iQ5beMdiVOi8QKzdeBuZzlBz5HWo-TOPK1N1P3rHT1eVHVLv6i4dkZ2RaCoqLjLbSIAcWW-W91BC5-0jSzdPj2EPuQ0sSYJsbfKlBu-rYsvVkTJN5Ngo7edfs2C6g',
    question: "Comment Cézanne construit-il la profondeur de la montagne sans recourir au tracé de perspective axiale ?",
    options: [
      {
        id: 'A',
        text: 'Par des ombres portées noires très marquées sur les flancs de la vallée.',
        tag: 'TECHNIQUE ACADÉMIQUE',
        isCorrect: false,
      },
      {
        id: 'B',
        text: 'Par la modulation de facettes chromatiques où les ocres chauds avancent et les bleus froids reculent.',
        tag: 'MODULATION CÉZANNIENNE',
        isCorrect: true,
        explanation: 'La modulation chromatique remplace le modelé classique par le contraste de température.',
      },
      {
        id: 'C',
        text: 'En peignant la montagne dans un brouillard uniforme sans aucun contraste.',
        tag: 'SFUMATO TRADITIONNEL',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'En appliquant une grille de perspective mathématique au cordeau.',
        tag: 'PERSPECTIVE ALBERTIENNE',
        isCorrect: false,
      },
    ],
    curatorClue: "Observez le jeu entre les toits ocres de la plaine et les facettes d'outremer qui montent vers la crête.",
  },
  {
    id: 2,
    corpus: 'NÉO-IMPRESSIONNISME • POINTILLISME',
    period: '1886',
    artworkTitle: 'Georges Seurat — Un dimanche à la Grande Jatte',
    artworkImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlyHtl2Mp0mA47GApP4Rp0GDHRikTbqUfMGRcfxX1AoMduUMB8l0EmC0qFJqIXzIPBsc-FxZ8T_gJS0B_KFPs04SOOdZwdVBjz0QvQiCvgz2-5oHJ1zWirQbnVXh630A_9tHh1Jj4EhJqNP54jpsluCjgXCPM0DyrSB-fABeMNeryfjWitBR_H5iHSPqV9C9a9UcFPnbqfLohX_EdY2rBUTjZzj2W81dD1P57CYyKMBq4p8iH1Xg',
    question: "Sur quelle loi scientifique de la vision repose la technique divisionniste de Seurat ?",
    options: [
      {
        id: 'A',
        text: "Le mélange optique sur la rétine des touches de couleurs pures juxtaposées selon Chevreul.",
        tag: 'MÉLANGE OPTIQUE RÉTINIEN',
        isCorrect: true,
        explanation: "Seurat ne mélange pas les pâtes sur la palette : c'est l'œil du spectateur qui fusionne les vibrations.",
      },
      {
        id: 'B',
        text: 'La dilution à l’essence de térébenthine pour estomper les grains.',
        tag: 'LAVIS',
        isCorrect: false,
      },
      {
        id: 'C',
        text: 'L’emploi exclusif de pigments fluorescents synthétiques.',
        tag: 'CHIMIE CONTEMPORAINE',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'L’utilisation d’un miroir noir (miroir de Claude) pour éteindre la lumière.',
        tag: 'OPTIQUE PAYSAGÈRE',
        isCorrect: false,
      },
    ],
    curatorClue: "Pensez au traité de Michel-Eugène Chevreul sur le contraste simultané des couleurs.",
  },
  {
    id: 3,
    corpus: 'CORPUS : FAUVISME & HARMONIES PURES',
    period: '1909–1910',
    artworkTitle: 'Henri Matisse — La Danse',
    artworkImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmt9qjnLK8K5uaYRTQ5yYdbvImd4hiqnVZqNFH6nxlHkCtdMqIojIWf4BptIqDBEajHCNHDmncPcw-WSXRfNQ1gw2vwrryKV1n-EqgEzh9J5Ipl3A9gBHuL3XJQE7hH7bWVaw4ans8jBSYh7miligMQA_z9AjdPZG9OIbhprxlG9539vSHeqdtl3tNKzGhoSr-dJm7xpOweX3SoTkAt-UHjfEiPzj7qQCn4CkRg1nWjbHsEoSU5w',
    question: "Dans cette composition, par quel procédé optique Matisse parvient-il à saturer l'espace sans recourir au modelé par l'ombre ?",
    options: [
      {
        id: 'A',
        text: 'Par la modulation géométrique des facettes en dégradé de gris.',
        tag: 'INFLUENCE CÉZANNIENNE / CUBISME',
        isCorrect: false,
      },
      {
        id: 'B',
        text: "Par la juxtaposition d'aplats purs de couleurs complémentaires (bleu outremer et rouge vermillon) créant une tension vibratoire au contour.",
        tag: 'PRINCIPE FAUVISTE DES CONTRASTES SIMULTANÉS',
        isCorrect: true,
        explanation: 'Nul trait noir de cerne ne sépare les formes : la résonance optique naît directement du choc des valeurs pures sans transition tonale.',
      },
      {
        id: 'C',
        text: "Par l'application systématique d'un vernis assombrissant les arrière-plans.",
        tag: 'TECHNIQUE DU CLAIR-OBSCUR TRADITIONNEL',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'Par la décomposition pointilliste des pigments selon le cercle chromatique de Chevreul.',
        tag: 'MÉTHODE NÉO-IMPRESSIONNISTE (SEURAT)',
        isCorrect: false,
      },
    ],
    curatorClue: "Indice scientifique : Observez la lisière où se rencontrent le sol végétal vert-émeraude et la silhouette carminée. Nul trait noir de cerne ne sépare les formes : la résonance optique naît directement du choc des valeurs pures sans transition tonale.",
  },
  {
    id: 4,
    corpus: 'POSTIMPRESSIONNISME • EXPRESSIONNISME',
    period: '1889',
    artworkTitle: 'Vincent van Gogh — La Nuit étoilée',
    artworkImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW2pvIgCOy4aVJxRtZh87rbSPhZCQ1sNgZ9V8jFG1uBl5Edc9gF0I_rjjVzAQERSv-TOF2Wnjlm4qXyuyqn3deWujlUp1L-BNo4Eom8uVU0dyZJLMdQ-10aEvGsTvUAvdRL30KRGHgolTBjn2FmpWMf1xzn5uZ_vGyFxOzXr2p0to8T1N4tPAL9n8TEOISVv7oIGu_9yVxplX4CWpe0lwA0MdooofWKaB3Laj9hZHViWY0aPgC1g',
    question: "Quel rôle le cyprès sombre joue-t-il dans l'équilibre chromatique et symbolique de La Nuit étoilée ?",
    options: [
      {
        id: 'A',
        text: "Il agit comme une colonne vertébrale sombre reliant la terre aux spirales lumineuses du ciel tout en ancrant l'œil.",
        tag: 'ANCRE COMPOSITIVE & SYMBOLIQUE',
        isCorrect: true,
        explanation: "Le cyprès funéraire contrebalance la formidable énergie centrifuge des nébuleuses célestes.",
      },
      {
        id: 'B',
        text: 'Il sert uniquement à masquer un défaut de tissage de la toile.',
        tag: 'ANECDOTE APOCRYPHE',
        isCorrect: false,
      },
      {
        id: 'C',
        text: 'Il est peint en aplat blanc pour refléter la lune.',
        tag: 'CONTRESENS CHROMATIQUE',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'Il est l’exacte reproduction photographique de l’arbre devant l’hôpital.',
        tag: 'RÉALISME MIMÉTIQUE',
        isCorrect: false,
      },
    ],
    curatorClue: "Remarquez comme sa forme flammée s'étire vers le zénith, opposant son obscurité aux tourbillons dorés.",
  },
  {
    id: 5,
    corpus: 'COLOR FIELD • ABSTRACTION AMÉRICAINE',
    period: '1953',
    artworkTitle: 'Mark Rothko — No. 61 (Rust and Blue)',
    artworkImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0fcU8l2uu-fH6RHH9V8GP4wMgjph8Wr7A4r1SzluUTXUOBFNxnC2Uu11l38ZV8opngiJ78FmObLNxeqrIFy4qYb4Xv3JJVHNnNUzHgH9Xd7FvQCiVq_fPihMHZIwH96dIN9Mav8pwcoCy3y2VfK39iuX2PUPXxLO1KWJ8yCEcW8Mz8V_0vZFNSeG-sOJq9TqmKbre5-PIri_VZYIO1JLE9yXhLCf-aJCgkA-szyZBpB-aA-azog',
    question: "Dans le Color Field Painting de Rothko, que signifie l'absence de cadre délimité et les bords effilochés des rectangles de couleur ?",
    options: [
      {
        id: 'A',
        text: "Permettre aux couleurs de flotter en suspension et d'envelopper émotionnellement le regardeur sans barrière.",
        tag: 'EXPÉRIENCE CONTEMPLATIVE PURE',
        isCorrect: true,
        explanation: "Rothko voulait que le spectateur soit 'dans' la peinture, submergé par la vibration pure de l'espace coloré.",
      },
      {
        id: 'B',
        text: 'Une simple économie de ruban de masquage adhésif.',
        tag: 'RAISON MATÉRIELLE',
        isCorrect: false,
      },
      {
        id: 'C',
        text: 'Une technique réservée à l’aquarelle sur papier de riz.',
        tag: 'TECHNIQUE ASIATIQUE',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'Un rejet de toute spiritualité dans l’art moderne.',
        tag: 'CONTRESENS PHILOSOPHIQUE',
        isCorrect: false,
      },
    ],
    curatorClue: "Considérez les couches diaphanes frottées et superposées qui laissent respirer la sous-couche.",
  },
];
