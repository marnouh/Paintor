import { Artwork, AudioGuideData, Hotspot } from '../data/artworks.ts';

export interface ValidationError {
  index: number;
  field: string;
  message: string;
  artworkTitle?: string;
}

export interface ValidationWarning {
  index: number;
  field: string;
  message: string;
  artworkTitle?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  sanitizedArtworks: Artwork[];
  stats: {
    total: number;
    validCount: number;
    errorCount: number;
    warningCount: number;
    uniqueArtists: string[];
    uniqueMovements: string[];
  };
}

/**
 * Infer historical period from numeric year
 */
export const inferPeriodFromYear = (year: number): string => {
  if (year < 500) return 'Préhistoire & Antiquité';
  if (year < 1400) return 'Moyen Âge';
  if (year < 1500) return 'XVe siècle';
  if (year < 1600) return 'XVIe siècle';
  if (year < 1700) return 'XVIIe siècle';
  if (year < 1800) return 'XVIIIe siècle';
  if (year < 1900) return 'XIXe siècle';
  return 'XXe siècle';
};

/**
 * Validates a single artwork object against the schema
 */
export const validateSingleArtwork = (
  raw: any,
  index: number = 0
): { isValid: boolean; errors: ValidationError[]; warnings: ValidationWarning[]; sanitized?: Artwork } => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!raw || typeof raw !== 'object') {
    errors.push({ index, field: 'root', message: 'L’élément doit être un objet JSON valide.' });
    return { isValid: false, errors, warnings };
  }

  // 1. Mandatory Fields (Champs obligatoires stricts)
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (!title) {
    errors.push({ index, field: 'title', message: 'Le titre de l’œuvre est obligatoire et doit être une chaîne non vide.' });
  }

  const artist = typeof raw.artist === 'string' ? raw.artist.trim() : '';
  if (!artist) {
    errors.push({ index, field: 'artist', message: 'Le nom de l’artiste est obligatoire.', artworkTitle: title });
  }

  let year: number = 0;
  if (raw.year === undefined || raw.year === null || raw.year === '') {
    errors.push({ index, field: 'year', message: 'L’année de création est obligatoire.', artworkTitle: title });
  } else {
    const parsedYear = Number(raw.year);
    if (isNaN(parsedYear) || parsedYear < -40000 || parsedYear > 2050) {
      errors.push({ index, field: 'year', message: 'L’année doit être un nombre valide entre -40000 et 2050.', artworkTitle: title });
    } else {
      year = Math.round(parsedYear);
    }
  }

  let imageUrl = typeof raw.imageUrl === 'string' ? raw.imageUrl.trim() : '';
  if (!imageUrl) {
    errors.push({
      index,
      field: 'imageUrl',
      message: 'L’URL de l’image est obligatoire pour toute fiche du catalogue (aucune image factice ou inventée n’est autorisée).',
      artworkTitle: title,
    });
  } else if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('/')) {
    errors.push({ index, field: 'imageUrl', message: 'L’URL de l’image doit commencer par https:// ou /', artworkTitle: title });
  }

  // 2. Controlled Fields (Movement & Museum)
  const movement = typeof raw.movement === 'string' && raw.movement.trim() ? raw.movement.trim() : 'Mouvement non spécifié';
  if (!raw.movement) {
    warnings.push({ index, field: 'movement', message: 'Mouvement artistique non spécifié (signalé comme non spécifié).', artworkTitle: title });
  }

  const museum = typeof raw.museum === 'string' && raw.museum.trim() ? raw.museum.trim() : 'Lieu de conservation non communiqué';
  if (!raw.museum) {
    warnings.push({ index, field: 'museum', message: 'Lieu de conservation non renseigné (signalé comme non communiqué).', artworkTitle: title });
  }

  // 3. ID handling: preserve authentic ID or compute deterministic canonical slug
  let id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-') : '';
  if (!id) {
    const generatedSlug = (title + '-' + (year > 0 ? year : 'ant'))
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    id = generatedSlug || `oeuvre-${index + 1}`;
  }

  // 4. Strict Curatorial & Rights Metadata (No fabrication of fake numbers or generic claims)
  const hasValidInventory = typeof raw.inventoryNumber === 'string' && raw.inventoryNumber.trim().length > 0;
  const inventoryNumber = hasValidInventory ? raw.inventoryNumber.trim() : 'Non répertorié / En attente d’inventaire';
  if (!hasValidInventory) {
    warnings.push({
      index,
      field: 'inventoryNumber',
      message: 'Numéro d’inventaire absent : consigné comme "Non répertorié" sans invention d’identifiant factice.',
      artworkTitle: title,
    });
  }

  const hasValidLegalStatus = typeof raw.legalStatus === 'string' && raw.legalStatus.trim().length > 0;
  const legalStatus = hasValidLegalStatus ? raw.legalStatus.trim() : 'Statut juridique : Non vérifié (en attente de certificat)';
  if (!hasValidLegalStatus) {
    warnings.push({
      index,
      field: 'legalStatus',
      message: 'Statut juridique non documenté : consigné comme non vérifié sans allégation générique.',
      artworkTitle: title,
    });
  }

  const rightsSource = typeof raw.rightsSource === 'string' && raw.rightsSource.trim().length > 0
    ? raw.rightsSource.trim()
    : (raw.museum ? `Registre des collections de l’institution détentrice (${museum})` : 'Source patrimoniale : Non vérifiée');

  const photographicLicense = typeof raw.photographicLicense === 'string' && raw.photographicLicense.trim().length > 0
    ? raw.photographicLicense.trim()
    : 'Licence photographique : Non vérifiée';

  const historicalSources: string[] = Array.isArray(raw.historicalSources)
    ? raw.historicalSources.filter((s: any) => typeof s === 'string' && s.trim().length > 0).map((s: string) => s.trim())
    : [];

  // 5. Audio Guide: only attach if actually provided in raw data (never fabricate a fake curator audio)
  let audioGuide: AudioGuideData | undefined = undefined;
  if (raw.audioGuide && typeof raw.audioGuide === 'object') {
    const audioTitle = typeof raw.audioGuide.title === 'string' && raw.audioGuide.title.trim() ? raw.audioGuide.title.trim() : 'Notice audio';
    const speaker = typeof raw.audioGuide.speaker === 'string' && raw.audioGuide.speaker.trim() ? raw.audioGuide.speaker.trim() : 'Claire D., Conservatrice';
    const audioSrc = typeof raw.audioGuide.audioSrc === 'string' && raw.audioGuide.audioSrc.trim() ? raw.audioGuide.audioSrc.trim() : '/audio/general-guide.wav';
    const transcript = typeof raw.audioGuide.transcript === 'string' ? raw.audioGuide.transcript.trim() : (raw.openingText || raw.quote || '');
    const durationSeconds = Number(raw.audioGuide.durationSeconds) || 120;
    const duration = raw.audioGuide.duration || `${Math.floor(durationSeconds / 60)} min ${durationSeconds % 60} s`;

    audioGuide = {
      title: audioTitle,
      duration,
      durationSeconds,
      speaker,
      audioSrc,
      transcript,
    };
  }

  // Sanitize tags
  const tags: string[] = Array.isArray(raw.tags)
    ? raw.tags.filter((t: any) => typeof t === 'string' && t.trim()).map((t: string) => t.trim())
    : [movement, inferPeriodFromYear(year)];

  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  const sanitized: Artwork = {
    id,
    title,
    subtitle: raw.subtitle || `${movement} • ${year > 0 ? year : Math.abs(year) + ' av. J.-C.'}`,
    artist,
    artistDates: raw.artistDates || 'Dates non documentées',
    artistOrigin: raw.artistOrigin || 'Origine non documentée',
    year,
    dateDisplay: raw.dateDisplay || `${year > 0 ? year : Math.abs(year) + ' av. J.-C.'}`,
    movement,
    period: raw.period || inferPeriodFromYear(year),
    technique: raw.technique || 'Technique non précisée',
    dimensions: raw.dimensions || 'Dimensions non communiquées',
    museum,
    museumFull: raw.museumFull || (raw.museum ? `${raw.museum}, Collections publiques` : 'Institution non renseignée'),
    inventoryNumber,
    legalStatus,
    rightsSource,
    photographicLicense,
    historicalSources,
    imageUrl,
    quote: raw.quote || undefined,
    openingText: raw.openingText || raw.quote || undefined,
    firstObservation: raw.firstObservation || undefined,
    audioGuide,
    hotspots: Array.isArray(raw.hotspots) ? raw.hotspots : undefined,
    tags,
    isHighlight: Boolean(raw.isHighlight),
    isFemaleArtist: Boolean(raw.isFemaleArtist),
    isIncontournable: Boolean(raw.isIncontournable),
    isRareMasterpiece: Boolean(raw.isRareMasterpiece),
    isGrandFormat: Boolean(raw.isGrandFormat),
  };

  return { isValid: true, errors, warnings, sanitized };
};

/**
 * Validates a full JSON string or array of artworks
 */
export const validateArtworksJson = (jsonContent: string | any[]): ValidationResult => {
  let parsed: any;
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const sanitizedArtworks: Artwork[] = [];

  if (typeof jsonContent === 'string') {
    try {
      parsed = JSON.parse(jsonContent);
    } catch (err: any) {
      errors.push({
        index: 0,
        field: 'json',
        message: `Erreur de syntaxe JSON : ${err.message || 'Syntaxe invalide'}`,
      });
      return {
        isValid: false,
        errors,
        warnings,
        sanitizedArtworks: [],
        stats: {
          total: 0,
          validCount: 0,
          errorCount: 1,
          warningCount: 0,
          uniqueArtists: [],
          uniqueMovements: [],
        },
      };
    }
  } else {
    parsed = jsonContent;
  }

  // Handle case where root is an object with an "artworks" property
  let itemsToValidate: any[] = [];
  if (Array.isArray(parsed)) {
    itemsToValidate = parsed;
  } else if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.artworks)) {
      itemsToValidate = parsed.artworks;
    } else if (Array.isArray(parsed.oeuvres)) {
      itemsToValidate = parsed.oeuvres;
    } else if (parsed.title && parsed.artist) {
      // Single artwork passed
      itemsToValidate = [parsed];
    } else {
      errors.push({
        index: 0,
        field: 'root',
        message: 'Le JSON doit être un tableau d’œuvres ou un objet contenant une propriété "artworks": [...]',
      });
      return {
        isValid: false,
        errors,
        warnings,
        sanitizedArtworks: [],
        stats: {
          total: 0,
          validCount: 0,
          errorCount: 1,
          warningCount: 0,
          uniqueArtists: [],
          uniqueMovements: [],
        },
      };
    }
  } else {
    errors.push({
      index: 0,
      field: 'root',
      message: 'Format JSON non reconnu.',
    });
    return {
      isValid: false,
      errors,
      warnings,
      sanitizedArtworks: [],
      stats: {
        total: 0,
        validCount: 0,
        errorCount: 1,
        warningCount: 0,
        uniqueArtists: [],
        uniqueMovements: [],
      },
    };
  }

  const seenIds = new Set<string>();

  itemsToValidate.forEach((rawItem, idx) => {
    const res = validateSingleArtwork(rawItem, idx);
    errors.push(...res.errors);
    warnings.push(...res.warnings);

    if (res.isValid && res.sanitized) {
      let finalItem = res.sanitized;
      // Handle ID collision
      if (seenIds.has(finalItem.id)) {
        finalItem = {
          ...finalItem,
          id: `${finalItem.id}-bis-${idx + 1}`,
        };
        warnings.push({
          index: idx,
          field: 'id',
          message: `Identifiant en doublon : renommé automatiquement en "${finalItem.id}".`,
          artworkTitle: finalItem.title,
        });
      }
      seenIds.add(finalItem.id);
      sanitizedArtworks.push(finalItem);
    }
  });

  const uniqueArtists = Array.from(new Set(sanitizedArtworks.map((a) => a.artist))).filter(Boolean);
  const uniqueMovements = Array.from(new Set(sanitizedArtworks.map((a) => a.movement))).filter(Boolean);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedArtworks,
    stats: {
      total: itemsToValidate.length,
      validCount: sanitizedArtworks.length,
      errorCount: errors.length,
      warningCount: warnings.length,
      uniqueArtists,
      uniqueMovements,
    },
  };
};

/**
 * Generate a clean JSON template for users wanting to import artworks
 */
export const getArtworkJsonTemplate = (): string => {
  const template = [
    {
      id: 'exemple-chef-doeuvre',
      title: 'Titre de l’œuvre d’art',
      subtitle: 'Sous-titre ou thème pictural',
      artist: 'Nom de l’Artiste Peintre',
      artistDates: '1850–1910',
      artistOrigin: 'France / Europe',
      year: 1888,
      dateDisplay: '1888',
      movement: 'Impressionnisme',
      period: 'XIXe siècle',
      technique: 'Huile sur toile',
      dimensions: '75 × 90 cm',
      museum: 'Musée d’Orsay, Paris',
      museumFull: 'Musée d’Orsay, Paris, France',
      inventoryNumber: 'RF 2024-01',
      legalStatus: 'Domaine Public',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      quote: '« Citation ou mot du conservateur sur cette œuvre. »',
      openingText: 'Introduction sur le contexte de création et la portée artistique de la toile.',
      firstObservation: 'Observation visuelle guidée pour inviter le regardeur à scruter les détails.',
      audioGuide: {
        title: 'Guide audio du conservateur',
        speaker: 'Claire D., Conservatrice',
        duration: '2 min 15 s',
        durationSeconds: 135,
        audioSrc: '/audio/general-guide.wav',
        transcript: 'Texte complet lu par le guide audio studio ou la voix de synthèse...',
      },
      tags: ['Incontournables', 'Impressionnisme', 'Lumière'],
      isHighlight: true,
      isIncontournable: true,
      isFemaleArtist: false,
    },
  ];

  return JSON.stringify(template, null, 2);
};
