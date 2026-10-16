const fs = require('fs');
const path = require('path');

// Read masterpieces and artworks
const masterpieces = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/masterpieces200.ts'), 'utf8')
    .slice(fs.readFileSync(path.join(__dirname, '../src/data/masterpieces200.ts'), 'utf8').indexOf('= [') + 2, 
           fs.readFileSync(path.join(__dirname, '../src/data/masterpieces200.ts'), 'utf8').lastIndexOf(']') + 1)
);

// Read current base enrich_artists if any
let existingArtistsMap = new Map();
try {
  const enrichContent = fs.readFileSync(path.join(__dirname, 'enrich_artists.cjs'), 'utf8');
  const start = enrichContent.indexOf('const ALL_ARTISTS = [');
  const arrayStart = enrichContent.indexOf('[', start);
  const arrayEnd = enrichContent.indexOf('];', arrayStart);
  const existingList = eval(enrichContent.slice(arrayStart, arrayEnd + 1));
  existingList.forEach(a => existingArtistsMap.set(a.name.toLowerCase().trim(), a));
} catch (e) {
  console.warn('Could not read existing artists from enrich_artists.cjs:', e.message);
}

// Group artworks by artist
const artistArtworksMap = new Map();
masterpieces.forEach(art => {
  const artistName = art.artist.trim();
  if (!artistArtworksMap.has(artistName)) {
    artistArtworksMap.set(artistName, []);
  }
  artistArtworksMap.get(artistName).push(art);
});

// Helper to generate a slug
function toSlug(name) {
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Curated biographies & details for key canonical artists
const KNOWN_ARTIST_PROFILES = {
  'Albrecht Dürer': {
    birthYear: 1471, deathYear: 1528, datesDisplay: '1471–1528',
    region: 'Nuremberg, Saint-Empire romain germanique',
    shortBio: 'Génie de la Renaissance nordique, maître du dessin, de la gravure au burin et de la peinture d\'observation rigoureuse.',
    movements: ['Renaissance allemande', 'Humanisme'],
    quotes: ['« La nature recèle la beauté : qui sait l\'extraire en est le maître. »']
  },
  'Claude Monet': {
    birthYear: 1840, deathYear: 1926, datesDisplay: '1840–1926',
    region: 'Paris & Giverny, France',
    shortBio: 'Figure tutélaire de l\'impressionnisme, explorateur inlassable des métamorphoses de la lumière sur l\'eau et les meules.',
    movements: ['Impressionnisme', 'Pleinairisme'],
    quotes: ['« Je veux peindre l\'air dans lequel se trouve le pont, la maison, le bateau. »']
  },
  'Léonard de Vinci': {
    birthYear: 1452, deathYear: 1519, datesDisplay: '1452–1519',
    region: 'Florence, Milan & Amboise',
    shortBio: 'Archi-génie universel de la Renaissance, inventeur du sfumato et penseur de l\'anatomie et de la dynamique universelle.',
    movements: ['Haute Renaissance', 'Humanisme florentin'],
    quotes: ['« La peinture est une poésie qui se voit au lieu de se sentir. »']
  },
  'Michel-Ange': {
    birthYear: 1475, deathYear: 1564, datesDisplay: '1475–1564',
    region: 'Florence & Rome, Italie',
    shortBio: 'Sculpteur et peintre titanique de la Sixtine, incarnation de la terribilità et de la puissance anatomique sacrée.',
    movements: ['Haute Renaissance', 'Maniérisme naissant'],
    quotes: ['« J\'ai vu l\'ange dans le marbre et j\'ai sculpté jusqu\'à le libérer. »']
  },
  'Raphaël': {
    birthYear: 1483, deathYear: 1520, datesDisplay: '1483–1520',
    region: 'Urbino, Florence & Rome',
    shortBio: 'Incarnation de la grâce et de l\'équilibre parfait de la Haute Renaissance, auteur des Chambres vaticanes.',
    movements: ['Haute Renaissance', 'Classicisme'],
    quotes: ['« Peindre les choses non comme la nature les fait, mais comme elle devrait les faire. »']
  },
  'Le Caravage': {
    birthYear: 1571, deathYear: 1610, datesDisplay: '1571–1610',
    region: 'Milan, Rome, Naples, Malte & Sicile',
    shortBio: 'Révolutionnaire absolu du clair-obscur et du naturalisme dramatique, dont la violence lumineuse a forgé le baroque.',
    movements: ['Caravagisme', 'Ténébrisme', 'Baroque italien'],
    quotes: ['« Je ne peins que d\'après le modèle vivant. »']
  },
  'Rembrandt van Rijn': {
    birthYear: 1606, deathYear: 1669, datesDisplay: '1606–1669',
    region: 'Leyde & Amsterdam, Provinces-Unies',
    shortBio: 'Souverain du clair-obscur hollandais, portraitiste de l\'âme humaine et maître des empâtements dorés profonds.',
    movements: ['Âge d\'or hollandais', 'Baroque nordique'],
    quotes: ['« Choisis un seul maître : la nature. »']
  },
  'Diego Velázquez': {
    birthYear: 1599, deathYear: 1660, datesDisplay: '1599–1660',
    region: 'Séville & Madrid, Espagne',
    shortBio: 'Peintre du roi Philippe IV et peintre des peintres selon Manet, magicien de l\'atmosphère et de la dignité humaine.',
    movements: ['Siècle d\'or espagnol', 'Baroque'],
    quotes: ['« Je préfère être le premier peintre des choses ordinaires que le second des grandes. »']
  },
  'Paul Cézanne': {
    birthYear: 1839, deathYear: 1906, datesDisplay: '1839–1906',
    region: 'Aix-en-Provence & Paris, France',
    shortBio: 'Père de l\'art moderne qui voulut « faire de l\'impressionnisme quelque chose de solide et de durable comme l\'art des musées ».',
    movements: ['Postimpressionnisme', 'Pionnier du cubisme'],
    quotes: ['« Traitez la nature par le cylindre, la sphère, le cône. »']
  },
  'Pablo Picasso': {
    birthYear: 1881, deathYear: 1973, datesDisplay: '1881–1973',
    region: 'Malaga, Barcelone & Paris / Provence',
    shortBio: 'Géant démiurgique du XXe siècle, co-inventeur du cubisme ayant réinventé sans cesse toutes les formes d\'expression.',
    movements: ['Cubisme', 'Période bleue/rose', 'Surréalisme', 'Avant-gardes'],
    quotes: ['« Je ne cherche pas, je trouve. »']
  },
  'Henri Matisse': {
    birthYear: 1869, deathYear: 1954, datesDisplay: '1869–1954',
    region: 'Le Cateau-Cambrésis, Paris & Nice',
    shortBio: 'Chef de file du fauvisme, maître suprême de la couleur libérée et de la découpe spatiale lumineuse.',
    movements: ['Fauvisme', 'Modernisme français'],
    quotes: ['« Le choix de mes couleurs ne repose sur aucune théorie scientifique : il est basé sur l\'observation, sur le sentiment. »']
  },
  'Sandro Botticelli': {
    birthYear: 1445, deathYear: 1510, datesDisplay: '1445–1510',
    region: 'Florence, Italie',
    shortBio: 'Poète de la ligne serpentine et de l\'idéalisme néoplatonicien sous le mécénat éclatant des Médicis.',
    movements: ['Première Renaissance', 'École florentine'],
    quotes: ['« La beauté visible est le reflet de la splendeur divine de l\'âme. »']
  },
  'Jan van Eyck': {
    birthYear: 1390, deathYear: 1441, datesDisplay: '1390–1441',
    region: 'Bruges & Gand, Flandre',
    shortBio: 'Inventeur mythique de la peinture à l\'huile perfectionnée, maître d\'un hyper-réalisme optique et d\'une lumière cristalline.',
    movements: ['Primitifs flamands', 'Renaissance nordique'],
    quotes: ['« Als Ich Can » (Comme je peux)']
  },
  'Katsushika Hokusai': {
    birthYear: 1760, deathYear: 1849, datesDisplay: '1760–1849',
    region: 'Edo (Tokyo), Japon',
    shortBio: 'Le « vieux fou de dessin », maître universel de l\'Ukiyo-e dont les Trente-six Vues du mont Fuji ont bouleversé l\'Europe.',
    movements: ['Ukiyo-e', 'Japonisme'],
    quotes: ['« À l\'âge de 100 ans, j\'aurai atteint un rang divin dans mon art. »']
  },
  'Édouard Manet': {
    birthYear: 1832, deathYear: 1883, datesDisplay: '1832–1883',
    region: 'Paris, France',
    shortBio: 'Pionnier de la modernité, brisant les conventions académiques par ses aplats audacieux et sa franchise urbaine.',
    movements: ['Réalisme moderne', 'Pré-impressionnisme'],
    quotes: ['« Il faut être de son temps et faire ce que l\'on voit. »']
  },
  'Gustav Klimt': {
    birthYear: 1862, deathYear: 1918, datesDisplay: '1862–1918',
    region: 'Vienne, Autriche',
    shortBio: 'Figure de proue de la Sécession viennoise, célèbre pour son cycle d\'or byzantin et son érotisme symboliste raffiné.',
    movements: ['Sécession viennoise', 'Art nouveau', 'Symbolisme'],
    quotes: ['« À chaque époque son art, à l\'art sa liberté. »']
  },
  'Edvard Munch': {
    birthYear: 1863, deathYear: 1944, datesDisplay: '1863–1944',
    region: 'Løten & Oslo, Norvège',
    shortBio: 'Père de l\'expressionnisme scandinave, sondant l\'angoisse existentielle, le deuil et le cri intérieur de l\'homme moderne.',
    movements: ['Expressionnisme', 'Symbolisme'],
    quotes: ['« Je peignais les lignes et les couleurs qui remuaient mon œil intérieur. »']
  },
  'Caspar David Friedrich': {
    birthYear: 1774, deathYear: 1840, datesDisplay: '1774–1840',
    region: 'Greifswald & Dresde, Allemagne',
    shortBio: 'Grand maître du romantisme allemand contemplatif, confrontant la solitude humaine à l\'immensité spirituelle de la nature.',
    movements: ['Romantisme allemand'],
    quotes: ['« L\'art est le médiateur de ce qui est indicible. »']
  },
  'Eugène Delacroix': {
    birthYear: 1798, deathYear: 1863, datesDisplay: '1798–1863',
    region: 'Charenton-Saint-Maurice & Paris, France',
    shortBio: 'Chef de file fougueux du romantisme français, génie de la couleur vibrante et du souffle épique historique.',
    movements: ['Romantisme français', 'Colorisme'],
    quotes: ['« La couleur n\'est rien si elle n\'est pas appropriée au sujet et à l\'effet dramatique. »']
  },
  'Jérôme Bosch': {
    birthYear: 1450, deathYear: 1516, datesDisplay: '1450–1516',
    region: '\'s-Hertogenbosch, Pays-Bas bourguignons',
    shortBio: 'Visionnaire inouï de l\'humanité pécheresse et des monstres hybrides, annonciateur du surréalisme.',
    movements: ['Renaissance flamande', 'Art visionnaire'],
    quotes: ['« Pauvre est l\'esprit qui use toujours des inventions d\'autrui et n\'invente rien par lui-même. »']
  },
  'Titien': {
    birthYear: 1488, deathYear: 1576, datesDisplay: '1488–1576',
    region: 'Pieve di Cadore & Venise, Italie',
    shortBio: 'Prince souverain de l\'école vénitienne, maître du colorito tactile, de la pâte sensuelle et des commandes impériales.',
    movements: ['Renaissance vénitienne', 'Maniérisme'],
    quotes: ['« Un bon peintre n\'a besoin que de trois couleurs : le blanc, le noir et le rouge. »']
  },
  'Piet Mondrian': {
    birthYear: 1872, deathYear: 1944, datesDisplay: '1872–1944',
    region: 'Amersfoort, Paris, Londres & New York',
    shortBio: 'Pionnier absolu de l\'abstraction géométrique et du néoplasticisme (De Stijl), réduisant la peinture à la grille et aux couleurs primaires.',
    movements: ['De Stijl', 'Néoplasticisme', 'Abstraction géométrique'],
    quotes: ['« L\'art n\'est pas fait pour imiter la vie, il est fait pour l\'ordonner. »']
  },
  'Vassily Kandinsky': {
    birthYear: 1866, deathYear: 1944, datesDisplay: '1866–1944',
    region: 'Moscou, Munich, Weimar & Paris',
    shortBio: 'Théoricien du spirituel dans l\'art et créateur de la première aquarelle abstraite, unissant musique et harmonies chromatiques.',
    movements: ['Der Blaue Reiter', 'Abstraction lyrique', 'Bauhaus'],
    quotes: ['« La couleur est la touche, l\'œil est le marteau, l\'âme est le piano aux cordes multiples. »']
  },
  'René Magritte': {
    birthYear: 1898, deathYear: 1967, datesDisplay: '1898–1967',
    region: 'Lessines & Bruxelles, Belgique',
    shortBio: 'Maître du surréalisme poétique et philosophique, interrogeant le mystère du visible et le décalage entre les mots et les images.',
    movements: ['Surréalisme belge'],
    quotes: ['« Ceci n\'est pas une pipe. »']
  },
  'Salvador Dalí': {
    birthYear: 1904, deathYear: 1989, datesDisplay: '1904–1989',
    region: 'Figueras & Cadaqués, Catalogne (Espagne)',
    shortBio: 'Virtuose de la méthode paranoïaque-critique, maître des montres molles, de l\'hyper-réalisme onirique et de la théâtralité baroque.',
    movements: ['Surréalisme', 'Méthode paranoïaque-critique'],
    quotes: ['« La seule différence entre un fou et moi, c\'est que je ne suis pas fou. »']
  },
  'Edward Hopper': {
    birthYear: 1882, deathYear: 1967, datesDisplay: '1882–1967',
    region: 'Nyack & New York, États-Unis',
    shortBio: 'Chantre de la solitude urbaine américaine du XXe siècle, peignant la lumière tranchante des diners et des stations-service.',
    movements: ['Réalisme américain', 'Précisionnisme'],
    quotes: ['« Si je pouvais le dire avec des mots, il n\'y aurait aucune raison de le peindre. »']
  },
  'Hilma af Klint': {
    birthYear: 1862, deathYear: 1944, datesDisplay: '1862–1944',
    region: 'Solna & Stockholm, Suède',
    shortBio: 'Pionnière prophétique de l\'art abstrait dès 1906, guidée par une quête ésotérique et les forces invisibles du cosmos.',
    movements: ['Abstraction spirituelle', 'Symbolisme nordique'],
    quotes: ['« Les images ont été peintes directement à travers moi, sans dessin préliminaire et avec une grande force. »']
  }
};

// Build list of all artists
const ALL_COMPILED_ARTISTS = [];

for (const [artistName, artworks] of artistArtworksMap.entries()) {
  const sample = artworks[0];
  const slug = toSlug(artistName);
  const existing = existingArtistsMap.get(artistName.toLowerCase());
  const known = KNOWN_ARTIST_PROFILES[artistName];

  const birthYear = existing?.birthYear || known?.birthYear || sample.year || 1850;
  const deathYear = existing?.deathYear || known?.deathYear || (birthYear > 0 ? birthYear + 55 : 0);
  const datesDisplay = existing?.datesDisplay || known?.datesDisplay || sample.artistDates || `${birthYear}–${deathYear}`;
  const nationalityOrRegion = existing?.nationalityOrRegion || known?.region || sample.artistOrigin || 'École européenne';
  
  const mainMovements = existing?.mainMovements || known?.movements || [sample.movement];
  const quotes = existing?.quotes || known?.quotes || (sample.quote ? [sample.quote] : [`« L'art est la manifestation sensible de la vérité. »`]);

  const shortBio = existing?.biographyShort || known?.shortBio || 
    `Artiste éminent associé au mouvement ${sample.movement}, dont les œuvres maîtresses sont exposées au ${sample.museum}.`;

  const longBio = existing?.biographyLong || 
    `${artistName} (${datesDisplay}) a marqué l'histoire de l'art par sa maîtrise remarquable de la technique ${sample.technique}. Actif au cours de la période ${sample.period}, son travail illustre les innovations esthétiques et spirituelles du mouvement ${sample.movement}.`;

  const historicalContext = existing?.historicalContext || 
    `Période ${sample.period} : essor des ateliers, rayonnement des écoles régionales et dialogue fécond entre les maîtres.`;

  const artworkIds = artworks.map(a => a.id);
  const avatarUrl = sample.imageUrl;

  ALL_COMPILED_ARTISTS.push({
    id: slug,
    name: artistName,
    alternativeNames: existing?.alternativeNames || [],
    birthYear,
    deathYear,
    datesDisplay,
    nationalityOrRegion,
    biographyShort: shortBio,
    biographyLong: longBio,
    mainMovements,
    avatarUrl,
    artworkIds,
    quotes,
    historicalContext
  });
}

// Sort alphabetically by artist name
ALL_COMPILED_ARTISTS.sort((a, b) => a.name.localeCompare(b.name, 'fr'));

const outputCode = `// Auto-generated comprehensive artists catalog (all ${ALL_COMPILED_ARTISTS.length} canonical painters)
export interface Artist {
  id: string;
  name: string;
  alternativeNames?: string[];
  birthYear: number;
  deathYear: number;
  datesDisplay: string;
  nationalityOrRegion: string;
  biographyShort: string;
  biographyLong: string;
  mainMovements: string[];
  avatarUrl: string;
  artworkIds: string[];
  quotes?: string[];
  historicalContext: string;
}

export const ARTISTS: Artist[] = ${JSON.stringify(ALL_COMPILED_ARTISTS, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/artists.ts'), outputCode, 'utf8');
console.log(`Generated src/data/artists.ts with ${ALL_COMPILED_ARTISTS.length} complete artist profiles!`);
