export interface Hotspot {
  id: number;
  x: number; // percentage
  y: number; // percentage
  badge: string;
  title: string;
  description: string;
  image: string;
}

export interface AudioGuideData {
  title: string;
  duration: string;
  durationSeconds: number;
  speaker: string;
  audioSrc: string;
  transcript: string;
}

export interface Artwork {
  id: string;
  title: string;
  subtitle?: string;
  artist: string;
  artistDates: string;
  artistOrigin?: string;
  year: number;
  dateDisplay: string;
  movement: string;
  period: string;
  technique: string;
  dimensions: string;
  museum: string;
  museumFull: string;
  inventoryNumber: string;
  legalStatus: string;
  rightsSource?: string;
  photographicLicense?: string;
  historicalSources?: string[];
  imageUrl: string;
  quote?: string;
  openingText?: string;
  firstObservation?: string;
  audioGuide?: AudioGuideData;
  hotspots?: Hotspot[];
  deepDive?: {
    composition: string[];
    technique: {
      text: string;
      pigments: string[];
    };
    context: {
      text: string;
      quote?: string;
    };
    posterity: string;
  };
  tags: string[];
  associatedPath?: {
    id: string;
    title: string;
    step: string;
    duration: string;
  };
  isHighlight?: boolean;
  isFemaleArtist?: boolean;
  isIncontournable?: boolean;
  isRareMasterpiece?: boolean;
  isGrandFormat?: boolean;
  formatCategory?: 'col-span-2' | 'col-span-1';
}

import { MASTERPIECES_200 } from './masterpieces200.ts';

const BASE_DETAILED_ARTWORKS: Artwork[] = [
  {
    id: 'starry-night',
    title: 'La Nuit étoilée',
    artist: 'Vincent van Gogh',
    artistDates: '1853–1890',
    artistOrigin: 'Pays-Bas / France',
    year: 1889,
    dateDisplay: 'Saint-Rémy • Juin 1889',
    movement: 'Postimpressionnisme',
    period: 'XIXe siècle & Ruptures',
    technique: 'Huile sur toile',
    dimensions: '73,7 × 92,1 cm',
    museum: 'MoMA, New York',
    museumFull: 'The Museum of Modern Art, New York',
    inventoryNumber: '472.1941 (Acquis via le Lillie P. Bliss Bequest)',
    legalStatus: 'Domaine public mondial (Auteur décédé depuis plus de 70 ans).',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv7ZhPWRViATk3AYdvKqyP6sGGSP2VFYEPE4nsUP4o26SmdLy880P5Whcli2sEp4n_j9UtidvYClgfEYN7OsFuiJLUoi7OvMvQbMLGtIHH2FNj4AQlcQxkyAmTXykkD22HzC_to35or61-exDPXl0XGQNLyZM9m3gDtIyIw8h4HzB4hmToTPLb9RIgmqh6jFhwO_b4bSzyo98B1NvRfGqZXtUL8EouxCY1IxvAt-uwnvy01p0V1g',
    quote: "« Le tourbillon céleste d'une âme recluse face à l'infini nocturne. »",
    openingText: "Peinte depuis la chambre grillagée de l’asile Saint-Paul-de-Mausole, Van Gogh ne recopie pas la nuit : il la transfigure. Entre angoisse existentielle et communion extatique, la matière s’anime d’une force quasi cosmique.",
    firstObservation: "L'immense cyprès noir dressé au premier plan fait office de flèche funéraire reliant la terre humaine aux onze étoiles incandescentes.",
    audioGuide: {
      title: 'Regard de conservateur',
      duration: '2 min 14 s',
      durationSeconds: 134,
      speaker: 'Claire D., Conservatrice',
      audioSrc: '/audio/starry-night.wav',
      transcript: "Bienvenue devant La Nuit étoilée de Vincent van Gogh. Peinte en juin 1889 depuis l'asile Saint-Paul-de-Mausole à Saint-Rémy-de-Provence, cette toile ne cherche pas à reproduire fidèlement le ciel nocturne, mais à en exprimer la pulsation cosmique. Observez l'immense cyprès sombre au premier plan : il s'élance comme une flamme funéraire reliant la terre des hommes aux tourbillons incandescents de la voûte céleste. Van Gogh applique la matière par touches sculpturales et épaisses, conférant au ciel une énergie cinétique hypnotique.",
    },
    hotspots: [
      {
        id: 1,
        x: 18,
        y: 52,
        badge: 'Premier Plan',
        title: 'Le cyprès flamme',
        description: 'Arbre de deuil et d’éternité, il s’élève comme un flambeau sombre ancré dans le sol et tendu vers la transcendance.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFkW79x4tNgls-bTbkLzHLo2BWr2NkN9roOV0ZVLckmhwfLrAP3mExFXRKr3H9CEdkqajtQDvXm7ANrDWfYTHqZlj5Fjmn8opTN4oV4X4QLNVO4dW4IOXWA8iSXnYDC0-G7fdeIOcfd5ETnGLlxbJjoQktLtOlnrKniuDRgEwXGos6S-DwS4b6Jg9UcodcFfOd2hHIqeB7K2G2BQofQfxqU_NTg9dy8tdl0RcL8EruTx9yZIFa0w',
      },
      {
        id: 2,
        x: 54,
        y: 32,
        badge: 'Cœur du Ciel',
        title: 'Le vortex cinétique',
        description: "Un fleuve d'ondes d'huile pure tourbillonnant à la manière des turbulences fluides astrophysiques récemment théorisées.",
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW2pvIgCOy4aVJxRtZh87rbSPhZCQ1sNgZ9V8jFG1uBl5Edc9gF0I_rjjVzAQERSv-TOF2Wnjlm4qXyuyqn3deWujlUp1L-BNo4Eom8uVU0dyZJLMdQ-10aEvGsTvUAvdRL30KRGHgolTBjn2FmpWMf1xzn5uZ_vGyFxOzXr2p0to8T1N4tPAL9n8TEOISVv7oIGu_9yVxplX4CWpe0lwA0MdooofWKaB3Laj9hZHViWY0aPgC1g',
      },
      {
        id: 3,
        x: 64,
        y: 68,
        badge: 'Topographie Idéalisée',
        title: 'Le village imaginaire',
        description: 'Inexistant à Saint-Rémy, ce clocher pointu évoque les paysages natals des Pays-Bas réassemblés de mémoire.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWcLri1E82vJvJkU8EOCnfkkfR9ySq5oOiKP8HmfRJCewTTbNdNNG7nHLCyJ2EOuPW6IUqyppfHiyN1sNxJoWPhQSZ7bdXO-tb9wkBtMqbTzG3_qq8Q_wXdiIl8yUIuvs7ybnwmdjACwCqD2ZeZ49RwPlb5nss3UpaWccN0mgta1TQpjoGS9QOdrpj0O2ym42PNN1zfDHCm6QssH_9dYpJqowaott50ofGtkyrcE2cP8QSXIOiKw',
      },
    ],
    deepDive: {
      composition: [
        "L'œuvre est bâtie sur une puissante tension d'équilibres : la verticalité foudroyante du cyprès gauche coupe brutalement les grandes ondulations horizontales du ciel et de la chaîne des Alpilles.",
        "Van Gogh utilise la règle du nombre d'or inversé pour polariser l'œil vers la spirale centrale, déplaçant le centre géométrique vers une vertigineuse dynamique giratoire.",
      ],
      technique: {
        text: "L'empâtement (impasto) est ici souverain. Van Gogh presse directement certains tubes sur la toile ou sculpte la matière au couteau en sillons cadencés.",
        pigments: ['Bleu de Prusse', 'Jaune de chrome', 'Blanc de zinc', 'Outremer'],
      },
      context: {
        text: "Dans la lettre 777 adressée à son frère Théo vers le 2 juin 1889, Vincent confie :",
        quote: "« Ce matin j'ai vu la campagne de ma fenêtre un long temps avant le lever du soleil avec rien que l'étoile du matin, laquelle paraissait très grande. »",
      },
      posterity: "Acquise par The Museum of Modern Art en 1941 via le legs Lillie P. Bliss, la toile est devenue la première œuvre de Van Gogh à entrer dans les collections des musées new-yorkais.",
    },
    tags: ['Postimpressionnisme', 'Peinture au couteau', 'Paysages nocturnes', 'Provence 1889', 'Pays-Bas / France'],
    associatedPath: {
      id: 'maitres-couleur',
      title: 'Les Maîtres de la Couleur',
      step: 'Étape 2 sur 8',
      duration: '45 min',
    },
    isHighlight: true,
    isIncontournable: true,
    isGrandFormat: true,
    formatCategory: 'col-span-2',
  },
  {
    id: 'girl-pearl-earring',
    title: 'La Jeune Fille à la perle',
    artist: 'Johannes Vermeer',
    artistDates: '1632–1675',
    artistOrigin: 'Delft, Provinces-Unies',
    year: 1665,
    dateDisplay: '1665 • Mauritshuis, La Haye',
    movement: "Âge d'or hollandais",
    period: "XVIIe siècle & Âge d'or",
    technique: 'Huile sur toile',
    dimensions: '44,5 × 39 cm',
    museum: 'Mauritshuis',
    museumFull: 'Mauritshuis, La Haye, Pays-Bas',
    inventoryNumber: '670 (Legs Des Tombe 1903)',
    legalStatus: 'Domaine public mondial',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfUFs2zk7zUeQDIEQffqpLA9dUx_tWV1SBEYNqMgK_dG9m5j8Ii4NLhotd0o4PVbkAvPaRiSWfl4113sOrA34gbA9EEGqucatxBZVaYYCXqPzIBFRs9sEaK5BpFRh0oZL4EHUOg4jklfYEqy9px957jN_dm3kGz82CnxcqFkOwRzu2Qe-AxwcDmvHDVZJ0HCZaaEH0OY9exiBd25dk3CeRg4c5hkGZEh8OmBl90ZUZt84fU6H7IA',
    quote: "« L'énigmatique regard par-dessus l'épaule et l'éclat pur de la lumière de Delft, suspendus dans un silence d'ambre. »",
    openingText: "Ce n'est pas un portrait de commande mais une 'tronie' : une étude expressive d'un personnage anonyme vêtu à l'orientale. Le regard interrogateur captive par sa fraîcheur intacte.",
    firstObservation: "L'éclat unique de blanc de plomb sur la perle en goutte d'eau attire instantanément le regard au confluent de l'ombre de la mâchoire et du col de batiste.",
    audioGuide: {
      title: 'La lumière de Delft',
      duration: '3 min 10 s',
      durationSeconds: 190,
      speaker: 'Claire D., Conservatrice',
      audioSrc: '/audio/girl-pearl-earring.wav',
      transcript: "Vous contemplez La Jeune Fille à la perle de Johannes Vermeer, réalisée vers 1665. Cette œuvre n'est pas un portrait de commande conventionnel, mais une 'tronie' : une étude de caractère et d'expression d'un personnage anonyme vêtu à l'orientale. Vermeer utilise le lapis-lazuli d'outremer pour draper le turban. Mais c'est la perle qui concentre tout le magnétisme du tableau : deux simples touches de blanc pur suffisent à créer l'illusion d'une sphère nacrée captant la clarté de l'atelier.",
    },
    hotspots: [
      {
        id: 1,
        x: 56,
        y: 44,
        badge: 'Éclat Focal',
        title: 'La perle en suspension',
        description: 'Composée de deux simples touches de blanc pur : un reflet vif supérieur et une douce réflexion lumineuse renvoyée par le col blanc.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB53wPQYQrtGhoXOANz2_GsKbihqGG5n3T0969yByGaNSa5frA3mObVUtpsOj1-jq56DkkCjQN3jJZ2d_oWuKAuCg8Vxv-Iv3tVctyN-egzgH_kG-ZDziy9HppVg71Jab7KKFfuLe1kPnfVG9P7kVAOfdZgBjlBq0nuCqBEXvMwgqPkoBlw01aZ3Ghx6u8BHQyAAo-fcjdzQqf9yPa6ZSW0NS0-NJqhGwJJtkOV3b2TpJ0MWHXMag',
      },
    ],
    deepDive: {
      composition: [
        'Vermeer place le visage sur un fond noir profond autrefois vert sombre glacé à la gaude, créant une isolation théâtrale totale.',
      ],
      technique: {
        text: "Utilisation virtuose du lapis-lazuli d'outremer naturel ultra-coûteux pour le turban bleu, mélangé avec du blanc de plomb et de l'ocre jaune pour le pan retombant.",
        pigments: ['Outremer naturel de lapis-lazuli', 'Blanc de plomb', 'Ocre jaune', 'Noir d’os'],
      },
      context: {
        text: 'Peinte au sommet de la prospérité des Provinces-Unies, l’œuvre reflète l’intérêt hollandais pour les étoffes exotiques et les récits maritimes avec l’Asie.',
      },
      posterity: 'Surnommée "la Joconde du Nord", elle est devenue l’une des toiles les plus reconnues de l’histoire de l’humanité.',
    },
    tags: ["Âge d'or hollandais", 'Portraits intimes', 'Tronie', 'Clair-obscur'],
    associatedPath: {
      id: 'portrait-flamand',
      title: "L'Énigme du Regard : Le Portrait Flamand",
      step: 'Étape 1 sur 4',
      duration: '20 min',
    },
    isHighlight: true,
    isIncontournable: true,
    formatCategory: 'col-span-1',
  },
  {
    id: 'thorn-necklace',
    title: "Collier d'épines",
    subtitle: 'Autoportrait au collier d’épines et au colibri',
    artist: 'Frida Kahlo',
    artistDates: '1907–1954',
    artistOrigin: 'Coyoacán, Mexique',
    year: 1940,
    dateDisplay: '1940 • Harry Ransom Center, Austin',
    movement: 'Symbolisme & Art Moderne',
    period: 'Art moderne (1900–1945)',
    technique: 'Huile sur toile',
    dimensions: '61,2 × 47 cm',
    museum: 'Univ. of Texas',
    museumFull: 'Harry Ransom Center, University of Texas, Austin',
    inventoryNumber: 'HRC.1966.3',
    legalStatus: 'Droits protégés Banco de México Diego Rivera Frida Kahlo Museums Trust',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuphojArcB__bs9aOvccquX9ZXAOn58zHykfXLMvsT8gpiPFpie64Sw7SESk1hoSgcUSPszFSVhLiWVaGWdamE20DX2ZaAvVoUYgugz2kJp_8Nnall2xZUB9qm292tNv5xWZ8Z27jA7yDdBzCtw0FUFYHXCfSDDWzmcbkUCWjzT0g70cIB4tHUImmeA-NT-ieJyyfMfzdbrta4fIPrK9C8JW5n3i7xtKiY13UmOMdF4o_93FAiDg',
    quote: "« Je peins des autoportraits parce que je suis si souvent seule, et parce que je suis la personne que je connais le mieux. »",
    openingText: "Peint suite à son douloureux divorce d'avec Diego Rivera, cet autoportrait frontal confronte la douleur physique et intime avec une sérénité hiératique presque sacrée.",
    firstObservation: "Le colibri mort suspendu au collier d'épines ensanglanté symbolise à la fois la chance dans le folklore mexicain et la fin tragique d'un amour.",
    audioGuide: {
      title: 'Le corps sacrifié',
      duration: '2 min 45 s',
      durationSeconds: 165,
      speaker: 'Claire D., Conservatrice',
      audioSrc: '/audio/thorn-necklace.wav',
      transcript: "Voici l'Autoportrait au collier d'épines et au colibri de Frida Kahlo, peint en 1940. Après sa rupture avec Diego Rivera, l'artiste mexicaine convertit sa souffrance intime et corporelle en icône hiératique. Le feuillage touffu isole son visage comme dans une jungle étouffante. Autour de son cou, le collier d'épines s'enfonce dans la chair en perles de sang, retenant un colibri sans vie.",
    },
    tags: ['Symbolisme', 'Femme artiste', 'Art moderne', 'Mexique'],
    isFemaleArtist: true,
    isIncontournable: true,
    formatCategory: 'col-span-1',
  },
  {
    id: 'third-of-may',
    title: 'Le 3 Mai 1808',
    artist: 'Francisco de Goya',
    artistDates: '1746–1828',
    artistOrigin: 'Madrid, Espagne',
    year: 1814,
    dateDisplay: '1814 • Musée du Prado, Madrid',
    movement: 'Romantisme',
    period: 'XIXe siècle & Ruptures',
    technique: 'Huile sur toile',
    dimensions: '268 × 347 cm',
    museum: 'Musée du Prado',
    museumFull: 'Museo Nacional del Prado, Madrid',
    inventoryNumber: 'P000749',
    legalStatus: 'Domaine public mondial',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcNUsw6VzcleUW01RPf1_aqwDlZLhKeb9f8lFsmYPlhn1UpU0HptoCwxjoQ-Rlqe_WdeMNZLdZGX-hGIYURpSz93yVaCycqxROk5GttLqw5UAaUhRUTCI1e7Zig7JnbfWnzBLL1Sn2O_GE4JK15H7TCi17UP33M0Kd0Dcl98vNP0ayE9E0IOK_STmiQTtY2drZFthcar2yuND64F_XbyKRjCOSKkBkRmMDxZrT2h-sHaKHqAFD1Q',
    quote: "« Le cri silencieux de la liberté massacrée sous le fanal froid de la tyrannie. »",
    openingText: "Goya révolutionne la peinture d'histoire en représentant non pas des héros triomphants, mais des patriotes anonymes fusillés par les troupes napoléoniennes sur la colline du Príncipe Pío.",
    firstObservation: "L'homme en chemise blanche lumineuse lève les bras en croix face au peloton sans visage, métaphore christique de la pureté suppliciée.",
    audioGuide: {
      title: 'Lumière et terreur',
      duration: '3 min 20 s',
      durationSeconds: 200,
      speaker: 'Claire D., Conservatrice',
      audioSrc: '/audio/third-of-may.wav',
      transcript: "Le 3 Mai 1808 de Francisco de Goya marque l'avènement de la peinture moderne d'histoire. Sur la colline du Príncipe Pío à Madrid, face au peloton d'exécution napoléonien anonyme, un patriote en chemise blanche éclatante ouvre les bras en croix dans un geste sacrificiel. Le fanal cubique au sol projette une lumière crue séparant la tyrannie mécanique de la dignité humaine.",
    },
    tags: ['Romantisme', 'Clair-obscur', 'Espagne 1814', 'Grands formats'],
    isIncontournable: true,
    isGrandFormat: true,
    formatCategory: 'col-span-1',
  },
  {
    id: 'impression-sunrise',
    title: 'Soleil levant',
    subtitle: 'Impression, soleil levant',
    artist: 'Claude Monet',
    artistDates: '1840–1926',
    artistOrigin: 'Paris & Giverny, France',
    year: 1872,
    dateDisplay: '1872 • Musée Marmottan Monet, Paris',
    movement: 'Impressionnisme',
    period: 'XIXe siècle & Ruptures',
    technique: 'Huile sur toile',
    dimensions: '48 × 63 cm',
    museum: 'Marmottan Monet',
    museumFull: 'Musée Marmottan Monet, Paris',
    inventoryNumber: 'INV. 4014',
    legalStatus: 'Domaine public mondial',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3r5j65_PB2SIdYJSxSOSuu9SHHJzFOqcMuaPL2tlfKVS2UPKdi373CLEehGcrU5CjcjyJ9bTGaeGKOO6PJkeP9PmdG-4iYg6PnKiJqxi0QH3zzVRWsTW0HzcDizEjZy8Ofm_GqCnhq89spXXjoO8S_mfL6rQxKlGvB6xFbvqUTWpYbthPMzg-aHHEVqKSI90Rbx9E7jQ3sfJmgeX6BJ6ZyelTaMCaefZU1b_q0WVn-2zcXsJbjw',
    quote: "« Le paysage n'est qu'une impression, et instantanée, d'où ce titre. »",
    openingText: "Peinte d'une fenêtre de l'hôtel de l'Amirauté au Havre, cette toile donne son nom au mouvement impressionniste après la raillerie du critique Louis Leroy en 1874.",
    firstObservation: "Le disque solaire orange vif et son reflet discontinu vibrent sur l'eau argentée sans aucun contour délimité.",
    audioGuide: {
      title: "L'aube d'un mouvement",
      duration: '2 min 30 s',
      durationSeconds: 150,
      speaker: 'Claire D., Conservatrice',
      audioSrc: '/audio/impression-sunrise.wav',
      transcript: "Impression, soleil levant de Claude Monet, peinte en 1872 depuis une fenêtre du port du Havre. Cette vue brumeuse de l'avant-port dans la lumière orangée du matin va donner son nom à l'impressionnisme. Monet s'émancipe du dessin académique au profit d'une notation visuelle fugitive de reflets sur l'eau.",
    },
    tags: ['Impressionnisme', 'Paysages marins', 'Plein air', 'Paris'],
    associatedPath: {
      id: 'maitres-couleur',
      title: 'Les Maîtres de la Couleur',
      step: 'Étape 1 sur 8',
      duration: '45 min',
    },
    isIncontournable: true,
    formatCategory: 'col-span-1',
  },
  {
    id: 'judith-holofernes',
    title: 'Judith décapitant Holopherne',
    artist: 'Artemisia Gentileschi',
    artistDates: '1593–1656',
    artistOrigin: 'Rome & Florence, Italie',
    year: 1620,
    dateDisplay: '1620 • Galerie des Offices, Florence',
    movement: 'Baroque italien',
    period: "XVIIe siècle & Âge d'or",
    technique: 'Huile sur toile',
    dimensions: '199 × 162,5 cm',
    museum: 'Galerie des Offices, Florence',
    museumFull: 'Gallerie degli Uffizi, Florence',
    inventoryNumber: '1890 n. 1547',
    legalStatus: 'Domaine public mondial',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH2ntLHSdk6qE-EwkGeysOct1NwO_TYmZ7uUM8A7qSbTy-OOs1luO4vhQLWweu22gA66VR7JrSRToCNVI0rWPMy5HYGJ9f5c5wwgppiKR4RMxwAUJG0juwk2spCPRnfQ6p6yRBdXtI8s_4vMSLZ1EX12yryODeChTOuZCDQQvdA2Ajm2dRrKmsoXlIG1CHNcBUt9-WX5SQBgwPBvPQGDle0imItZWOaUK7hqCDVd-oNgUAe-m-0g',
    quote: "« Une détermination d'acier : la femme souveraine qui venge son peuple et subjugue la violence masculine. »",
    openingText: "Artemisia Gentileschi s'approprie le thème biblique avec un réalisme physique et psychologique sans précédent dans l'art européen, loin de la passivité conventionnelle accordée aux figures féminines.",
    firstObservation: "Les bras puissants de Judith et de sa servante Abra se croisent avec une géométrie implacable pour maintenir le général assyrien.",
    audioGuide: {
      title: 'Le triomphe de la peintre',
      duration: '3 min 15 s',
      durationSeconds: 195,
      speaker: 'Claire D., Conservatrice',
      audioSrc: '/audio/judith-holofernes.wav',
      transcript: "Judith décapitant Holopherne d'Artemisia Gentileschi, créée vers 1620. Formée dans le sillage du Caravage, Artemisia injecte à l'épisode biblique une intensité physique et psychologique sans équivalent. Remarquez la géométrie implacable des avant-bras croisés de Judith et de sa servante Abra maintenant le général assyrien.",
    },
    tags: ['Baroque italien', 'Femme artiste', 'Ténébrisme', 'Florence'],
    isFemaleArtist: true,
    isHighlight: true,
    isIncontournable: true,
    isGrandFormat: true,
    formatCategory: 'col-span-2',
  },
  {
    id: 'milkmaid',
    title: 'La Laitière',
    artist: 'Johannes Vermeer',
    artistDates: '1632–1675',
    artistOrigin: 'Delft, Provinces-Unies',
    year: 1658,
    dateDisplay: '1658 • Rijksmuseum, Amsterdam',
    movement: "Âge d'or hollandais",
    period: "XVIIe siècle & Âge d'or",
    technique: 'Huile sur toile',
    dimensions: '45,5 × 41 cm',
    museum: 'Rijksmuseum, Amsterdam',
    museumFull: 'Rijksmuseum, Amsterdam, Pays-Bas',
    inventoryNumber: 'SK-A-2344',
    legalStatus: 'Domaine public mondial',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW5vClwRVnHkQcl0Bq5uqtZCGBjb72JcOtERu7hucnegCGmlXia9cwYaJqiSujD4eFgCagDrZpgPkLYttBi1WCx4zLnWadsjmHKLl9bW5VccXfZfKsmtwU4IdVmCJdA5vSPJv_8Gd33Mu7X0iB5PB7BP9DdVmxzahiOlGXtu5YMKNngTXYXeCQ-AkXmg6yXzHASoXorNr2bzCUU9dZH7bwvcq3gfudihUeVohOCRKrCqlTvxqgiA',
    quote: "« Le filet de lait blanc coule dans une paix éternelle sous la lumière caressante de la fenêtre. »",
    openingText: "Une servante verse du lait dans un plat en terre cuite avec une concentration presque rituelle. Vermeer métamorphose un geste domestique modeste en monument de sérénité.",
    firstObservation: "Le ruissellement blanc et onctueux du lait forme un fil continu capturant les infimes reflets de la vitre cassée.",
    audioGuide: {
      title: 'Le silence domestique',
      duration: '2 min 40 s',
      durationSeconds: 160,
      speaker: 'Claire D., Conservatrice',
      audioSrc: '/audio/milkmaid.wav',
      transcript: "La Laitière de Johannes Vermeer, peinte vers 1658 au Rijksmuseum. Vermeer transforme une scène domestique modeste en un monument de plénitude. Admirez le filet de lait continu s'écoulant dans le récipient de terre cuite et la texture granuleuse du pain illuminé par la clarté rasante de la fenêtre.",
    },
    tags: ["Âge d'or hollandais", 'Scène de genre', 'Pigment outremer', 'Amsterdam'],
    isIncontournable: true,
    formatCategory: 'col-span-1',
  },
  {
    id: 'cezanne-sainte-victoire',
    title: 'La Montagne Sainte-Victoire',
    artist: 'Paul Cézanne',
    artistDates: '1839–1906',
    artistOrigin: 'Aix-en-Provence, France',
    year: 1904,
    dateDisplay: "1902–1906 • Période d'Aix",
    movement: 'Postimpressionnisme',
    period: 'XIXe siècle & Ruptures',
    technique: 'Huile sur toile',
    dimensions: '73 × 91,9 cm',
    museum: "Musée d'Orsay, Paris",
    museumFull: "Musée d'Orsay, Paris",
    inventoryNumber: 'RF 1971',
    legalStatus: 'Domaine public mondial',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5sVyCiOLtsTfmHIlDhz71lLeghoZGYZyNHjf8PeBemh4dO29NRsSnH8o4LapXTozzsqr5vU-zNw6zpS66zKCJjl3lAjre-gTCPQoQ-pCwHQgeeoWY0yrF7iQ5beMdiVOi8QKzdeBuZzlBz5HWo-TOPK1N1P3rHT1eVHVLv6i4dkZ2RaCoqLjLbSIAcWW-W91BC5-0jSzdPj2EPuQ0sSYJsbfKlBu-rYsvVkTJN5Ngo7edfs2C6g',
    quote: "« Quand la couleur est à sa richesse, la forme est à sa plénitude. »",
    openingText: "Cézanne refuse le modelé classique par ombre et lumière : chaque facette de bleu outremer et de gris bleuté vibre à plat pour construire le volume de la montagne. Le ciel et la pierre s'interpénètrent dans une architecture unifiée.",
    firstObservation: "La modulation par facettes bleutées remplace le clair-obscur traditionnel.",
    audioGuide: {
      title: 'Voix du conservateur',
      duration: '1 min 45 s',
      durationSeconds: 105,
      speaker: 'Dr. Hélène de Saint-Germain',
      audioSrc: '/audio/cezanne-sainte-victoire.wav',
      transcript: "La Montagne Sainte-Victoire de Paul Cézanne. Cézanne refuse le modelé classique par le clair-obscur : chaque facette de bleu outremer et d'ocre jaune construit le volume de la falaise comme une architecture autonome, jetant les ponts vers l'art moderne.",
    },
    hotspots: [
      {
        id: 1,
        x: 56,
        y: 32,
        badge: 'Coup de Pinceau Macro',
        title: 'Point 1 • La Modulation Chromatique du Ciel',
        description: "Cézanne refuse le modelé classique par ombre et lumière : chaque facette de bleu outremer et de gris bleuté vibre à plat pour construire le volume de la montagne.",
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5sVyCiOLtsTfmHIlDhz71lLeghoZGYZyNHjf8PeBemh4dO29NRsSnH8o4LapXTozzsqr5vU-zNw6zpS66zKCJjl3lAjre-gTCPQoQ-pCwHQgeeoWY0yrF7iQ5beMdiVOi8QKzdeBuZzlBz5HWo-TOPK1N1P3rHT1eVHVLv6i4dkZ2RaCoqLjLbSIAcWW-W91BC5-0jSzdPj2EPuQ0sSYJsbfKlBu-rYsvVkTJN5Ngo7edfs2C6g',
      },
      {
        id: 2,
        x: 68,
        y: 62,
        badge: 'Accord Complémentaire',
        title: 'Point 2 • La Plaine et les Pinèdes',
        description: "Taches rectangulaires d'ocre rouge et vert céladon structurant les plans moyens sans fuite perspective axiale.",
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyYz80B_5zjpcF-4YEqIj3s2fsXMqpdBwZHC-ROjRV6nBST5F4ZTjfmD-xWykuzfjDggs9j2OEe5id9elUEPbtuqFQFQdNjWSKlrtO7xiG32RYiAke7RDASvqEqxIchhXb5b5JxmvfyQhG7mA1eWPF_UetsOhPVrjVY3WQdupQUlAaqdqarlcs2Dgm5ItOT9x6qUdc0Ia6Cg1Cgt9J-pTbsp7O0uBGDI1_Q3OEyvxrmFJFGP_ZqQ',
      },
      {
        id: 3,
        x: 30,
        y: 78,
        badge: 'Facture Orthogonale',
        title: 'Point 3 • La Touche Architecturale',
        description: "Chaque coup de pinceau est un pavé de couleur orthogonal qui construit l'espace comme une maçonnerie plane.",
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQdL48gnDfZeKXScaSYgIuj9qLIMx116iu_AUu8Q9qMnQZw9T4Bj036hNHrUNORvw9ZAYUti-e8Y_q_MS2_hn9nqNdmPAtZziyEbtsS26hACzXBU3xrVPSr9Lb_K8csGFBuhRUT8seBjIYjtfIgd1-WJf-zTN2kIxA4sDJwwvhfNoLWqnNEEd7WcRYUsdbNtVGxBAs29eQhDdKz3AfgXIQ_Wcrq2gqexxnei8sdmKwLF_5aDqliQ',
      },
    ],
    tags: ['Postimpressionnisme', 'Provence', 'Géométrie', 'Cézanne'],
    associatedPath: {
      id: 'maitres-couleur',
      title: 'Les Maîtres de la Couleur',
      step: 'Étape 4 sur 8',
      duration: '45 min',
    },
    isIncontournable: true,
    formatCategory: 'col-span-2',
  },
  {
    id: 'joconde',
    title: 'La Joconde',
    subtitle: 'Portrait de Monna Lisa',
    artist: 'Léonard de Vinci',
    artistDates: '1452–1519',
    artistOrigin: 'Florence (Italie) & Amboise (France)',
    year: 1503,
    dateDisplay: 'Vers 1503–1519 • Musée du Louvre, Paris',
    movement: 'Haute Renaissance',
    period: 'Renaissance (1400–1600)',
    technique: 'Huile sur panneau de peuplier',
    dimensions: '77 × 53 cm',
    museum: 'Musée du Louvre, Paris',
    museumFull: 'Musée du Louvre, Paris, France',
    inventoryNumber: 'INV. 779',
    legalStatus: 'Domaine public mondial',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9Olt2yjdBWiB00u6RiMkn2__SXOh4vHPZSGV90rrg_WerK-KD8mSeKUCP6MaRIkDWqyjDCxl87xqNp3hWeP6QRzvoYyNSheU7swyyNHSvotSLCQyealGurXyVebcMwFVyez28wQoWhgoBuQN8WUyYRQ4SbN_Ewwm0OWL9BrkzCx0WBeEoXEebQbdUXCZww3iS0hXVHFc8d0ilL-LUxam-srDAzume9xVYZZG7jnB-fTbKuacd7w',
    quote: "« Le sourire insaisissable qui a fait de la peinture le miroir vivant des mouvements de l'âme. »",
    openingText: "Portrait de Lisa Gherardini, épouse du marchand florentin Francesco del Giocondo. Léonard ne s'en est jamais séparé jusqu'à sa mort au château du Clos Lucé, perfectionnant inlassablement ses glacis diaphanes pendant plus de quinze ans.",
    firstObservation: "Le coin des lèvres et des yeux est délibérément noyé dans l'ombre du sfumato, rendant son expression vivante et changeante selon l'angle de regard.",
    audioGuide: {
      title: 'Le mystère du sfumato',
      duration: '3 min 05 s',
      durationSeconds: 185,
      speaker: 'Claire D., Conservatrice',
      audioSrc: '/audio/joconde.wav',
      transcript: "La Joconde de Léonard de Vinci, peinte au Musée du Louvre. Le célèbre sfumato efface les contours rigides autour des commissures des yeux et de la bouche. En appliquant de multiples couches de glacis translucides de quelques microns d'épaisseur, Léonard donne à la chair un rayonnement intérieur vivant.",
    },
    hotspots: [
      {
        id: 1,
        x: 52,
        y: 35,
        badge: 'Le Sfumato Léonardien',
        title: 'Le regard et le sourire',
        description: 'Des dizaines de couches de glacis translucides d’un ou deux microns sans aucune trace de coup de pinceau visible.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9Olt2yjdBWiB00u6RiMkn2__SXOh4vHPZSGV90rrg_WerK-KD8mSeKUCP6MaRIkDWqyjDCxl87xqNp3hWeP6QRzvoYyNSheU7swyyNHSvotSLCQyealGurXyVebcMwFVyez28wQoWhgoBuQN8WUyYRQ4SbN_Ewwm0OWL9BrkzCx0WBeEoXEebQbdUXCZww3iS0hXVHFc8d0ilL-LUxam-srDAzume9xVYZZG7jnB-fTbKuacd7w',
      },
    ],
    deepDive: {
      composition: [
        'Pose en buste de trois-quarts à mi-corps qui a révolutionné le portrait de la Renaissance en brisant la tradition des profils hiératiques.',
        'Paysage de perspective atmosphérique en arrière-plan suggérant la genèse du monde par les eaux et les roches.',
      ],
      technique: {
        text: 'Huile sur bois de peuplier avec un sfumato incomparable.',
        pigments: ['Terres d’ombre', 'Ocre jaune', 'Noir de fumée', 'Glaçures d’huile de lin'],
      },
      context: {
        text: 'Peinte au carrefour de la Renaissance florentine et du séjour de Léonard auprès du roi François Ier.',
      },
      posterity: 'Icône universelle absolue de l’histoire de la peinture.',
    },
    tags: ['Renaissance', 'Portraits intimes', 'Sfumato', 'Louvre', 'Incontournable'],
    isIncontournable: true,
    isHighlight: true,
    formatCategory: 'col-span-1',
  },
  {
    id: 'caravaggio-matthieu',
    title: 'La Vocation de saint Matthieu',
    artist: 'Le Caravage',
    artistDates: '1571–1610',
    artistOrigin: 'Rome (Italie)',
    year: 1600,
    dateDisplay: '1599–1600 • Église Saint-Louis-des-Français, Rome',
    movement: 'Baroque & Ténèbres',
    period: "XVIIe siècle & Âge d'or",
    technique: 'Huile sur toile',
    dimensions: '322 × 340 cm',
    museum: 'Saint-Louis-des-Français, Rome',
    museumFull: 'Église Saint-Louis-des-Français, Rome, Italie',
    inventoryNumber: 'SLF.01',
    legalStatus: 'Domaine public mondial',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvHEpmwSODbzVy88H1s5bM0CqKHBxtMMi_6MESUb2nb0tSWNSTnqfZSKS7kUfqs_KNTkN1FLp7ckfILUMo7y6I5P1EDICoLm6tKDenJWnTHZUgk05vHqsNXPPi0WbMKPOf7V3u6aKONUKJQ_UaQcwwhHME6lQ-ErpS1O30347tyfGGB4SResIUpS8Tf8l7sxJoOFZhSEX-GSGlC7f_zKxCZ-ntFA_SbNnzkuhvskJTrcKf3pNUaQ',
    quote: "« Le faisceau oblique de la grâce divine déchirant les ténèbres d'une taverne romaine. »",
    openingText: "Le Caravage révolutionne la peinture sacrée en situant l'appel du Christ dans l'atmosphère interlope d'un bureau de péage. L'irruption de la lumière traverse l'espace en diagonale, symbole visuel de la grâce.",
    firstObservation: "Le doigt tendu du Christ, citation directe de la Création d'Adam de Michel-Ange, désigne le publicain incrédule au milieu des pièces d'or.",
    audioGuide: {
      title: "L'éclair du clair-obscur",
      duration: '3 min 10 s',
      durationSeconds: 190,
      speaker: 'Claire D., Conservatrice',
      audioSrc: '/audio/caravaggio-matthieu.wav',
      transcript: "La Vocation de saint Matthieu du Caravage. Dans la pénombre d'une taverne romaine, un faisceau de lumière oblique déchire l'obscurité. Le Christ désigne Matthieu au comptoir de douane, introduisant le drame sacré dans le réalisme populaire du quotidien.",
    },
    tags: ['Baroque italien', 'Ténébrisme', 'Rome 1600', 'Grands formats', 'Clair-obscur'],
    associatedPath: {
      id: 'clair-obscur',
      title: 'Le Clair-obscur et la Nuit',
      step: 'Étape 1 sur 5',
      duration: '20 min',
    },
    isIncontournable: true,
    isGrandFormat: true,
    formatCategory: 'col-span-2',
  },
  {
    id: 'hokusai-vague',
    title: 'La Grande Vague de Kanagawa',
    subtitle: 'Sous la vague au large de Kanagawa',
    artist: 'Katsushika Hokusai',
    artistDates: '1760–1849',
    artistOrigin: 'Edo (Tokyo, Japon)',
    year: 1831,
    dateDisplay: 'Vers 1830–1832 • Série des 36 vues du mont Fuji',
    movement: 'Traditions picturales mondiales (Ukiyo-e)',
    period: 'XIXe siècle & Ruptures',
    technique: 'Estampe polychrome (xylographie nishiki-e)',
    dimensions: '25,7 × 37,8 cm',
    museum: 'Musée national de Tokyo',
    museumFull: 'Tokyo National Museum / British Museum',
    inventoryNumber: 'BM 1906,1220,0.547',
    legalStatus: 'Domaine public mondial',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX93xpNhVT-cTzWYH3vdSNOsfDOtpii3HHfrjkquzj1sqVtStzFWfDiZEaGmQgyB6dvnI7T4a_YX2mPkL6m6Z4XYQopq6CnxyZIPGiOpPFzKkU2TaQoMMhhntSdLdkSBccC68k18vgpgDW7WScbpnsOsd0LMG8gAlNkQZ3sYakXOpK8C5oq90Kc3tpFoOBysR9FSR8WqDZLd4YFqL4V1nEJCE09fnkwVSknU6R_Umi_l_QHGiTxA',
    quote: "« Le déferlement monumental de la nature et l'immuable sérénité du Fuji éternel. »",
    openingText: "Chef-d'œuvre de l'art graphique japonais ayant bouleversé les impressionnistes et Van Gogh à Paris. L'introduction récente du bleu de Prusse chimique confère à cette vague écumante une profondeur cosmique.",
    firstObservation: "L'écume en griffes féroces semble prête à engloutir les barques de pêcheurs d'oshiokuri-bune tandis que le mont Fuji enneigé apparaît minuscule sous la crête.",
    audioGuide: {
      title: 'La vague et le mont Fuji',
      duration: '2 min 15 s',
      durationSeconds: 135,
      speaker: 'Claire D., Conservatrice',
      audioSrc: '/audio/general-guide.wav',
      transcript: "La Grande Vague de Kanagawa de Katsushika Hokusai, chef-d'œuvre de l'estampe japonaise Ukiyo-e. La composition oppose la fureur écumante et dynamique de la vague à la sérénité immuable et sacrée du mont Fuji dans le lointain.",
    },
    tags: ['Traditions mondiales', 'Ukiyo-e', 'Estampe', 'Japon', 'Bleu de Prusse'],
    isIncontournable: true,
    formatCategory: 'col-span-1',
  },
  {
    id: 'lascaux-aurochs',
    title: 'La Frise des Cerfs & Aurochs',
    subtitle: 'Art pariétal magdalénien',
    artist: 'Artistes paléolithiques de Lascaux',
    artistDates: '~17 000 av. J.-C.',
    artistOrigin: 'Vallée de la Vézère, Dordogne (France)',
    year: -17000,
    dateDisplay: 'Paléolithique supérieur • Grotte de Lascaux',
    movement: 'Origines & Antiquité',
    period: 'Antiquité & Moyen Âge',
    technique: 'Pigments minéraux naturels sur paroi calcaire (soufflage & frottis)',
    dimensions: 'Frise monumentale (~5,5 m)',
    museum: 'Grotte de Lascaux (Montignac)',
    museumFull: 'Sanctuaire orné de Lascaux, Dordogne',
    inventoryNumber: 'UNESCO World Heritage 85',
    legalStatus: 'Patrimoine mondial de l’humanité',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoINsKUP1f5RsC5lkhMBUB8iZHfhUgkBwXVLCidEJwEpSteYLQNCE7yjV-6Q4m6P5dpk64yO-XfLLPMYtvqwYi4jFavsX5opGR2r04i8g-mOen507n_bxd3UhQjHlUgGhU-8XBm-s_RcMz--ZwLTaGAFcfWeZim2dICYuWumMSza4UYDoCErIDS-vRlyLeKv3FORnLj4VcL-d2vSMVA8pPlws-1gG8BCmCVIQleq0pjIiGlhnniA',
    quote: "« La première aurore du génie humain : quand le trait anime la pierre brute d'un souffle sacré. »",
    openingText: "Bien avant l'écriture, les chasseurs-cueilleurs du Magdalénien exploitent les anfractuosités naturelles de la roche calcaire pour conférer du volume et du mouvement aux silhouettes d'aurochs, de chevaux et de cerfs.",
    firstObservation: "L'utilisation de charbon de bois pour les contours noirs et d'oxydes de fer pour les ocres rouges appliqués par projection de salive et de pigments.",
    audioGuide: {
      title: 'Le souffle pariétal',
      duration: '2 min 00 s',
      durationSeconds: 120,
      speaker: 'Claire D., Conservatrice',
      audioSrc: '/audio/general-guide.wav',
      transcript: "La Frise des Cerfs et Aurochs de Lascaux. Réalisée il y a 17 000 ans au Paléolithique supérieur, cette fresque monumentale tire parti des anfractuosités de la pierre pour insuffler vie et volume aux bêtes sacrées.",
    },
    tags: ['Antiquité & Moyen Âge', 'Origines', 'Art pariétal', 'Pigments naturels'],
    isRareMasterpiece: true,
    formatCategory: 'col-span-2',
  },
];

// Combine the 12 deep-dive interactive artworks with the 200+ canonical masterpieces catalog
export const ARTWORKS: Artwork[] = [
  ...BASE_DETAILED_ARTWORKS.map((b) => {
    const fromMasterpiece = MASTERPIECES_200.find((m) => m.id === b.id);
    return {
      ...b,
      rightsSource: b.rightsSource || fromMasterpiece?.rightsSource || `${b.museum} - Base des Collections Ouvertes`,
      photographicLicense: b.photographicLicense || fromMasterpiece?.photographicLicense || "Reproduction photographique 2D fidèle d'une œuvre du domaine public exempte de tout droit privatif exclusif (Directive européenne 2019/790, art. 14 / CJUE).",
      historicalSources: b.historicalSources || fromMasterpiece?.historicalSources || [
        `Catalogue raisonné et monographie de ${b.artist}`,
        `Dossier scientifique du département de conservation, ${b.museum}`,
        `Inventaire officiel du patrimoine muséal (N° ${b.inventoryNumber})`
      ],
    };
  }),
  ...MASTERPIECES_200.filter((m) => !BASE_DETAILED_ARTWORKS.some((b) => b.id === m.id)),
];

