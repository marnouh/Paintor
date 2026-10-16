const fs = require('fs');
const path = require('path');

// 1. Read masterpieces200.ts and artworks.ts
const masterpiecesPath = path.join(__dirname, '../src/data/masterpieces200.ts');
const artworksPath = path.join(__dirname, '../src/data/artworks.ts');

let masterCode = fs.readFileSync(masterpiecesPath, 'utf8');
let artCode = fs.readFileSync(artworksPath, 'utf8');

// Artist name normalization map
const ARTIST_NORMALIZATION = {
  'Le Caravage (Michelangelo Merisi)': 'Le Caravage',
  'Caravage': 'Le Caravage',
  'Michel-Ange (Michelangelo Buonarroti)': 'Michel-Ange',
  'Raphaël (Raffaello Sanzio)': 'Raphaël',
  'Titien (Tiziano Vecellio)': 'Titien',
  'Jan et Hubert van Eyck': 'Jan van Eyck',
  'Artistes anonymes de Lascaux': 'Artistes paléolithiques de Lascaux',
  'Artistes paléolithiques anonymes': 'Artistes paléolithiques de Lascaux',
  'Le Tintoret (Tintoretto)': 'Le Tintoret',
  'Parmigianino (Le Parmesan)': 'Le Parmesan'
};

for (const [bad, good] of Object.entries(ARTIST_NORMALIZATION)) {
  masterCode = masterCode.split(`"${bad}"`).join(`"${good}"`);
  masterCode = masterCode.split(`'${bad}'`).join(`'${good}'`);
  artCode = artCode.split(`"${bad}"`).join(`"${good}"`);
  artCode = artCode.split(`'${bad}'`).join(`'${good}'`);
}

// Write back normalized artworks
fs.writeFileSync(artworksPath, artCode, 'utf8');

// Parse JSON in masterpieces200.ts to structure audioGuide nicely
const equalsIndex = masterCode.indexOf('= [');
const startIndex = masterCode.indexOf('[', equalsIndex);
const endIndex = masterCode.lastIndexOf(']');
const jsonString = masterCode.substring(startIndex, endIndex + 1);

let items = [];
try {
  items = JSON.parse(jsonString);
} catch (e) {
  console.error('Failed to parse jsonString in masterpieces200.ts:', e.message);
  process.exit(1);
}

// Enrich each artwork with structured audioGuide and rights/curatorial attributes
const enrichedItems = items.map((art) => {
  const normArtist = ARTIST_NORMALIZATION[art.artist] || art.artist;
  const audioSrc = art.audioSrc || '/audio/general-guide.wav';
  const durationSec = art.durationSeconds || 120;
  const durationStr = `${Math.floor(durationSec / 60)} min ${durationSec % 60} s`;
  const transcript = art.audioGuideTranscript || art.openingText || art.quote || `Commentaire approfondi sur ${art.title} par ${normArtist}.`;
  
  const audioGuide = {
    title: art.audioGuideTitle || 'Regard de conservateur',
    duration: durationStr,
    durationSeconds: durationSec,
    speaker: art.audioGuideSpeaker || 'Claire D., Conservatrice',
    audioSrc: audioSrc,
    transcript: transcript
  };

  const cleanArt = { ...art };
  delete cleanArt.audioGuideTitle;
  delete cleanArt.audioGuideSpeaker;
  delete cleanArt.audioSrc;
  delete cleanArt.durationSeconds;
  delete cleanArt.audioGuideTranscript;

  return {
    ...cleanArt,
    artist: normArtist,
    audioGuide: audioGuide,
    legalStatus: art.legalStatus || 'Domaine Public / Open Access',
    inventoryNumber: art.inventoryNumber || `INV-${art.id.toUpperCase().slice(0, 10)}`
  };
});

const newMasterCode = `// Auto-generated comprehensive master catalog of 200+ canonical masterpieces
// Normalized schema conforming to Artwork interface
import type { Artwork, AudioGuideData, Hotspot } from './artworks.ts';

export const MASTERPIECES_200: Artwork[] = ${JSON.stringify(enrichedItems, null, 2)};
`;

fs.writeFileSync(masterpiecesPath, newMasterCode, 'utf8');
console.log(`Successfully normalized ${enrichedItems.length} masterpieces in masterpieces200.ts`);
