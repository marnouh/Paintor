export interface LearningPathStep {
  stepNumber: number;
  year: number;
  artist: string;
  artworkTitle: string;
  summary: string;
  status: 'completed' | 'in_progress' | 'locked';
  artworkId?: string;
  thumbnailUrl: string;
  estimatedMinutes?: number;
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Incontournable';
  estimatedDuration: string;
  artworkCount: number;
  summary: string;
  curatorQuote?: string;
  curatorName?: string;
  coverImage: string;
  progressPercent: number;
  currentStep: number;
  totalSteps: number;
  steps?: LearningPathStep[];
  notions?: {
    category: string;
    title: string;
    description: string;
  }[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'maitres-couleur',
    title: 'Les Maîtres de la Couleur',
    subtitle: 'De Van Gogh à Henri Matisse',
    category: "HISTOIRE DE L'ART",
    level: 'Intermédiaire',
    estimatedDuration: '45 min',
    artworkCount: 8,
    progressPercent: 50,
    currentStep: 4,
    totalSteps: 8,
    summary: "De la libération de la touche impressionniste aux harmonies pures de Matisse : comment la couleur a cessé d'imiter la nature pour devenir le sujet souverain du tableau.",
    curatorQuote: "« De la libération de la touche impressionniste aux harmonies pures de Matisse : comment la couleur a cessé d'imiter la nature pour devenir le sujet souverain du tableau. »",
    curatorName: 'Dr. Hélène de Saint-Germain, conservatrice honoraire des musées nationaux',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNu8ab4xzC-deMjUEkUcVqgp1MKdNZTiFDhMyIA_lJ06RVoKRFsV_mbJYKg2HB08D-kAKT695WGuLy2CmK-Or1zEbY4cHUxiVHARnnx762gYtcW-bayHQsJ7KBP7-NS_K8xJ6FQosW1bJ2wCCp5yojhvvrkPRJLVScnIzTeLjOwH4fdMEfYbzCzB6Lh6BrLU4oQirdi70uSzyTCppbapcZSpZBIMTxdtW24bgMvsuybBkJr1Idsw',
    steps: [
      {
        stepNumber: 1,
        year: 1872,
        artist: 'Claude Monet',
        artworkTitle: 'Impression, soleil levant',
        summary: "La vibration rétinienne, la touche non mélangée et la captation de l'air en plein air.",
        status: 'completed',
        artworkId: 'impression-sunrise',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoNZAjrlchweiCJmdJVlom8Ot-A5uyWPz_M-BfFrVP6c-ynQN5gWnl3dWESF4U_jmKEJ3a7PnLap2-YDfsn99QASCuL8hj5Ah_207CHxeAemm8lHK-4PbSsqRzd9B5VpumEuzpIX638SlwUauSBr476YXmN8xIVJlAgZb7z2AIlmrat8r5Pp5Wd-M_pU79GHon3hb47wH7d8ivxJEcs1FszYaEfJEO3H8VK9znkGQQi7tpL3fklw',
      },
      {
        stepNumber: 2,
        year: 1889,
        artist: 'Vincent van Gogh',
        artworkTitle: 'La Nuit étoilée',
        summary: 'La couleur expressive et psychologique, transcendant la simple observation mimétique.',
        status: 'completed',
        artworkId: 'starry-night',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUVg4LgGrUWDD3QOha7nBBoc6FVbY_HmFp7RgAc4kMcmaR6EFNzErfmx82oZHQ46AGIagxqHar67e8S24p0f47BDaE_3FbgjcSpRRJrqBwnKsX3Q_Kc020T58S1X3bLtX1MvQFdFLDmKleZ-vdJk8yPqgMmZh5M7TaNnEhiGZD8vKiV6LCi37E2Wc-IpAImDitEIKQNZEq2jUO96_YA2sE-SU7bWloylzme5LCK8VdzgtK_Op-FQ',
      },
      {
        stepNumber: 3,
        year: 1886,
        artist: 'Georges Seurat',
        artworkTitle: 'Un dimanche à la Grande Jatte',
        summary: "Le divisionnisme scientifique et le mélange optique des pigments purs dans l'œil du spectateur.",
        status: 'completed',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlyHtl2Mp0mA47GApP4Rp0GDHRikTbqUfMGRcfxX1AoMduUMB8l0EmC0qFJqIXzIPBsc-FxZ8T_gJS0B_KFPs04SOOdZwdVBjz0QvQiCvgz2-5oHJ1zWirQbnVXh630A_9tHh1Jj4EhJqNP54jpsluCjgXCPM0DyrSB-fABeMNeryfjWitBR_H5iHSPqV9C9a9UcFPnbqfLohX_EdY2rBUTjZzj2W81dD1P57CYyKMBq4p8iH1Xg',
      },
      {
        stepNumber: 4,
        year: 1904,
        artist: 'Paul Cézanne',
        artworkTitle: 'La Montagne Sainte-Victoire',
        summary: 'Focus sur la modulation par facettes chromatiques : comment le peintre substitue le modelé de la lumière par des touches modulées.',
        status: 'in_progress',
        artworkId: 'cezanne-sainte-victoire',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQdL48gnDfZeKXScaSYgIuj9qLIMx116iu_AUu8Q9qMnQZw9T4Bj036hNHrUNORvw9ZAYUti-e8Y_q_MS2_hn9nqNdmPAtZziyEbtsS26hACzXBU3xrVPSr9Lb_K8csGFBuhRUT8seBjIYjtfIgd1-WJf-zTN2kIxA4sDJwwvhfNoLWqnNEEd7WcRYUsdbNtVGxBAs29eQhDdKz3AfgXIQ_Wcrq2gqexxnei8sdmKwLF_5aDqliQ',
        estimatedMinutes: 8,
      },
      {
        stepNumber: 5,
        year: 1910,
        artist: 'Henri Matisse',
        artworkTitle: 'La Danse',
        summary: "L'aplat pur, l'intensité sauvage du fauvisme et l'autonomie rythmique de l'accord tricolore.",
        status: 'locked',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVrkZcVDN86mKmyBrDAgc4hz9gxf8N_3Or2zmJnJ20QxTzrZR801OpYHgdPanA2IAkyWu1Kc5b0QoXtCl5W2RGOvbzU-qPDg2_UCRRYOh846SSZbbQ2xzfg10QYdYeuZUG-ZWKJzgFiUOEYhc9lEFPYCXOJweGeZxoWW85u_Su3ZQTekGPJ2_oW1f-IagBpYkBYrZrinr_4Ca3a6V4Stjdd59SYR1VwlUmTOfN3qf7PVf7JBOfdQ',
      },
      {
        stepNumber: 6,
        year: 1913,
        artist: 'Vassily Kandinsky',
        artworkTitle: 'Composition VII',
        summary: 'La synesthésie, la résonance intérieure et la spiritualité de la vibration chromatique pure.',
        status: 'locked',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi_WTv8AhUVjhdi4GbZWSnULtrA4hqTtL_o4K5vvA0S-_KYrOx8O7FvVJyDh6voZxJG7ULhzemkf8FOq4LV11KFYbcE7Rd0bB3kYh_lNQv1CwfW1e1cjR0O50emLKS1tHEDwgf7XLVUpA4PANDSyYhGu-qtMaFaH-DGDtHFmld9CHQXV29CHJ7s5f8bByXR8LWtQ2aHcm5KgwEjcJK8httBpMXZF3Co2Pf630eA8JNT5gvvFtEYg',
      },
      {
        stepNumber: 7,
        year: 1953,
        artist: 'Mark Rothko',
        artworkTitle: 'No. 61 (Rust and Blue)',
        summary: "Le champ chromatique méditatif (Color Field) et la dissolution du sujet dans l'émotion lumineuse.",
        status: 'locked',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0fcU8l2uu-fH6RHH9V8GP4wMgjph8Wr7A4r1SzluUTXUOBFNxnC2Uu11l38ZV8opngiJ78FmObLNxeqrIFy4qYb4Xv3JJVHNnNUzHgH9Xd7FvQCiVq_fPihMHZIwH96dIN9Mav8pwcoCy3y2VfK39iuX2PUPXxLO1KWJ8yCEcW8Mz8V_0vZFNSeG-sOJq9TqmKbre5-PIri_VZYIO1JLE9yXhLCf-aJCgkA-szyZBpB-aA-azog',
      },
      {
        stepNumber: 8,
        year: 1960,
        artist: 'Synthèse du Cycle',
        artworkTitle: 'Le Regard du Coloriste (Quiz final)',
        summary: "Tableau comparatif interactif et 5 questions d'observation fine pour débloquer le badge muséal.",
        status: 'locked',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmt9qjnLK8K5uaYRTQ5yYdbvImd4hiqnVZqNFH6nxlHkCtdMqIojIWf4BptIqDBEajHCNHDmncPcw-WSXRfNQ1gw2vwrryKV1n-EqgEzh9J5Ipl3A9gBHuL3XJQE7hH7bWVaw4ans8jBSYh7miligMQA_z9AjdPZG9OIbhprxlG9539vSHeqdtl3tNKzGhoSr-dJm7xpOweX3SoTkAt-UHjfEiPzj7qQCn4CkRg1nWjbHsEoSU5w',
      },
    ],
    notions: [
      {
        category: 'THÉORIE OPTIQUE',
        title: 'Contraste Simultané',
        description: 'Formulée par Chevreul en 1839 : deux couleurs adjacentes se modifient mutuellement dans l’œil, chacune projetant sa complémentaire sur l’autre.',
      },
      {
        category: 'FACTURE & MATIÈRE',
        title: 'Touche Divisée vs Aplats',
        description: 'La fragmentation pointilliste juxtapose les pigments bruts ; l’aplat fauve les étale de manière uniforme pour exalter la sonorité décorative.',
      },
      {
        category: 'ESPACE PICTURAL',
        title: 'Température Chromatique',
        description: 'Les longueurs d’onde chaudes (ocres, rouges) semblent s’avancer vers l’observateur, tandis que les froides (bleus, turquoises) s’éloignent dans le fond.',
      },
    ],
  },
  {
    id: 'clair-obscur',
    title: 'Le Clair-obscur et la Nuit',
    subtitle: 'Caravage, Rembrandt, Georges de La Tour',
    category: 'BAROQUE & TÉNÈBRES',
    level: 'Intermédiaire',
    estimatedDuration: '20 min',
    artworkCount: 5,
    progressPercent: 0,
    currentStep: 1,
    totalSteps: 5,
    summary: "De Caravage à Georges de La Tour. La maîtrise dramatique de l'ombre vive et du faisceau de chandelle.",
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3oX-6JRpIC5-l9VVazuuxsTkSnoBY4Wv7ZrzQZ9cBfFFNQXZHIQD0OA2dEvnwA9olJj3_usha7S5Uf1VzOyfSk94gkpKaJM2EnXAASKNxc4X1nq6wqIau3Oe9hDND1tNdrHy4YR1IJja4yvTxCE3JW6t0sVvdeCGY3ioz8p2QMYuXVyaICH2C2TAoGkabXme5mvC1a9mjhGaGrjJUftKvi_BeK53kXVcOgsuSALgSgEtavMu7vw',
  },
  {
    id: 'revolution-impressionniste',
    title: 'Révolution Impressionniste',
    subtitle: 'Monet, Edgar Degas, Berthe Morisot',
    category: 'XIXE SIÈCLE',
    level: 'Débutant',
    estimatedDuration: '25 min',
    artworkCount: 6,
    progressPercent: 0,
    currentStep: 1,
    totalSteps: 6,
    summary: 'La lumière en plein air (Monet, Renoir, Morisot). Briser les codes du Salon académique parisien.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUNdZtV1Ka8D57_ekkQVt9bjENNo4FL2KFDdL8lnlEecGCRNZ0B_6r4FlnvVASKo4n3RvyRLLQa-n2oTBk_IggLUepA9LMq8miioBEVZZzN5HyfIqwzCyWoem87gZEFmj9iV90Gnqa-igJDev2Hwuwv5gJCXIi71wCZMPKgkJcqeqneGZbY-PtOxHrr9RdAT_97pLJnGbUuaFz0eAPX6WVQpDCuOK1SizcoLkW-sQZ4DwU8uYa7w',
  },
  {
    id: 'femmes-peintres',
    title: 'Femmes Peintres de Légende',
    subtitle: 'Artemisia Gentileschi, Vigée Le Brun, Morisot, Kahlo',
    category: 'PIONNIÈRES',
    level: 'Incontournable',
    estimatedDuration: '40 min',
    artworkCount: 8,
    progressPercent: 25,
    currentStep: 2,
    totalSteps: 8,
    summary: 'De la Renaissance au Modernisme : Artemisia Gentileschi, Vigée Le Brun, Mary Cassatt, Frida Kahlo.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe2LyrbwWJB7ai0orKSmvAlBxsSVYHNNQZ0NFtbGNJ_HGYXVlpP2krJP_Bk7pgtel6-EvigWUEmbl6En0b7b1RT1OKSmIhP7ypoKnOzft-8113XNj0VJ4SbNXrnl6MKcjapLm-UCGH9F-Wzif-5GvQDKEQaJkxQGoZUtxklCwAnlNLYn_UXSHfBnZlxV7igemoygQGHUNeZ8hpGJA-9ee16JX6fxSTCq2GLSi4h9OSrglTTp8VBA',
  },
  {
    id: 'portrait-flamand',
    title: "L'Énigme du Regard : Le Portrait Flamand",
    subtitle: 'Vermeer, Van Eyck, Rembrandt',
    category: 'ÂGE D’OR',
    level: 'Débutant',
    estimatedDuration: '20 min',
    artworkCount: 4,
    progressPercent: 0,
    currentStep: 1,
    totalSteps: 4,
    summary: "Vermeer, Van Eyck, Rembrandt. La psychologie discrète de l'intériorité et du reflet d'émail.",
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ybFyygs7W4iE0tbCXPZoyEpertNWMJVVkw1_A1PLBj_NZKlX6-zlIBq10FzqvtA7uBSaYn7tm5_b9hAu6C5lqTSxbvwTPx524hHLxs7hxZlZyzEN7s0c-nPjzkMtqJofUolqLeFZRp_-EVgwx4kaKoGIGnlsAvnemOMe4Tdyvp9iNPkNj2p98TaZ6w3x5l7x-YsRrrnYJvAS23ljP1a_mANvDsbhD3hE6rEb7r392Ba8kRQ5Og',
  },
];
