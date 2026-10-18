/**
 * In-Memory Inverted Index Full-Text Search (FTS) Engine for Regard
 * High-performance French & multilingual search engine with BM25-like scoring,
 * Unicode accent folding, prefix matching, Levenshtein fuzzy typo tolerance,
 * multi-field weighting, and verifiable automated benchmark test suite.
 */

import { Artwork } from '../data/artworks.ts';

const FRENCH_STOPWORDS = new Set([
  'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'd', 'l',
  'et', 'en', 'a', 'dans', 'par', 'pour', 'sur', 'qui', 'que',
  'aux', 'avec', 'ce', 'ces', 'cet', 'cette', 'son', 'sa', 'ses',
  'au', 'est', 'sont', 'il', 'elle', 'ils', 'elles', 'ne', 'pas',
  'plus', 'ou', 'se', 'comme', 'mais', 'nous', 'vous', 'leur'
]);

export interface SearchResultItem {
  artwork: Artwork;
  score: number;
  matchedFields: string[];
  snippet?: string;
  matchedTokens: string[];
  matchType?: 'exact' | 'prefix' | 'fuzzy';
}

export interface SearchEngineStats {
  totalIndexed: number;
  uniqueTokensCount: number;
  avgDocLength: number;
  lastQueryTimeMs: number;
  engineName: string;
}

export interface SearchBenchmarkResult {
  testName: string;
  category: 'accent' | 'typo' | 'artist' | 'title' | 'movement' | 'technique';
  query: string;
  targetExpected: string;
  found: boolean;
  hitsCount: number;
  topArtworkTitle: string;
  topArtworkArtist: string;
  matchedFields: string[];
  executionTimeMs: number;
}

/**
 * Calcule la distance de Levenshtein entre deux mots normalisés
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  if (Math.abs(a.length - b.length) > 2) return 999;

  const d: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) d[i][0] = i;
  for (let j = 0; j <= b.length; j++) d[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // suppression
        d[i][j - 1] + 1,      // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return d[a.length][b.length];
}

export class FullTextSearchEngine {
  // Index inversé : token normalisé -> Map<docId, scorePondéré>
  private index: Map<string, Map<string, number>> = new Map();
  private artworksMap: Map<string, Artwork> = new Map();
  private docLengths: Map<string, number> = new Map();
  private avgDocLength: number = 0;
  private isIndexed: boolean = false;
  private lastQueryTimeMs: number = 0;

  /**
   * Pliage d'accents (accent folding) et découpage en tokens normalisés
   */
  public tokenize(text: string): string[] {
    if (!text) return [];
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // supprime tous les accents (é->e, à->a, ç->c, etc.)
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter((tok) => tok.length > 1 && !FRENCH_STOPWORDS.has(tok));
  }

  /**
   * Normalise une chaîne simple pour la comparaison (sans accents, minuscules)
   */
  public normalizeString(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  /**
   * Indexation complète des œuvres dans l'index inversé en mémoire
   */
  public indexArtworks(artworks: Artwork[]): void {
    const startTime = performance.now();
    this.index.clear();
    this.artworksMap.clear();
    this.docLengths.clear();

    let totalLength = 0;

    for (const art of artworks) {
      this.artworksMap.set(art.id, art);

      // Extraction et pondération des différents champs de la notice
      const titleTokens = this.tokenize(art.title);
      const subtitleTokens = this.tokenize(art.subtitle || '');
      const artistTokens = this.tokenize(art.artist);
      const movementTokens = this.tokenize(art.movement);
      const techniqueTokens = this.tokenize(art.technique);
      const museumTokens = this.tokenize(art.museum + ' ' + (art.museumFull || ''));
      const tagsTokens = this.tokenize(art.tags?.join(' ') || '');
      const bodyTokens = this.tokenize(
        (art.openingText || '') + ' ' + (art.quote || '') + ' ' + (art.audioGuide?.transcript || '')
      );

      const docLen =
        titleTokens.length * 6 +
        artistTokens.length * 5 +
        movementTokens.length * 3 +
        techniqueTokens.length * 2 +
        tagsTokens.length * 2 +
        museumTokens.length * 1.5 +
        bodyTokens.length;

      this.docLengths.set(art.id, docLen);
      totalLength += docLen;

      // Inscription dans l'index inversé avec poids sémantique
      this.addTokens(art.id, titleTokens, 6.0);
      this.addTokens(art.id, subtitleTokens, 4.0);
      this.addTokens(art.id, artistTokens, 5.0);
      this.addTokens(art.id, movementTokens, 3.5);
      this.addTokens(art.id, techniqueTokens, 2.5);
      this.addTokens(art.id, museumTokens, 1.5);
      this.addTokens(art.id, tagsTokens, 2.2);
      this.addTokens(art.id, bodyTokens, 1.0);
    }

    this.avgDocLength = artworks.length > 0 ? totalLength / artworks.length : 0;
    this.isIndexed = true;
    this.lastQueryTimeMs = performance.now() - startTime;
  }

  private addTokens(docId: string, tokens: string[], fieldWeight: number): void {
    for (const token of tokens) {
      if (!this.index.has(token)) {
        this.index.set(token, new Map());
      }
      const postings = this.index.get(token)!;
      const currentScore = postings.get(docId) || 0;
      postings.set(docId, currentScore + fieldWeight);
    }
  }

  /**
   * Exécute une recherche plein texte multicritère avec gestion des fautes de frappe
   */
  public search(
    query: string,
    options?: { limit?: number; enableFuzzy?: boolean }
  ): {
    results: SearchResultItem[];
    stats: SearchEngineStats;
  } {
    const startTime = performance.now();
    const queryTokens = this.tokenize(query);
    const enableFuzzy = options?.enableFuzzy !== false;

    if (queryTokens.length === 0) {
      const execTime = performance.now() - startTime;
      return {
        results: [],
        stats: this.getStats(execTime),
      };
    }

    const scores = new Map<string, number>();
    const matchedTokensMap = new Map<string, Set<string>>();
    const matchTypeMap = new Map<string, 'exact' | 'prefix' | 'fuzzy'>();

    for (const qToken of queryTokens) {
      const candidateTerms: { term: string; factor: number; type: 'exact' | 'prefix' | 'fuzzy' }[] = [];

      // 1. Correspondance exacte
      if (this.index.has(qToken)) {
        candidateTerms.push({ term: qToken, factor: 1.0, type: 'exact' });
      }

      // 2. Correspondance par préfixe (ex. "verm" -> "vermeer")
      if (qToken.length >= 3) {
        for (const indexedTerm of this.index.keys()) {
          if (indexedTerm !== qToken && indexedTerm.startsWith(qToken)) {
            candidateTerms.push({ term: indexedTerm, factor: 0.8, type: 'prefix' });
          }
        }
      }

      // 3. Correspondance tolérante aux fautes de frappe (Fuzzy Levenshtein)
      // Ex: "vermer" -> "vermeer" (dist 1), "moneet" -> "monet" (dist 1), "gokh" -> "gogh" (dist 1)
      if (enableFuzzy && qToken.length >= 4) {
        const maxDist = qToken.length >= 7 ? 2 : 1;
        for (const indexedTerm of this.index.keys()) {
          if (indexedTerm === qToken || indexedTerm.startsWith(qToken)) continue;
          if (Math.abs(indexedTerm.length - qToken.length) > maxDist) continue;

          const dist = levenshteinDistance(qToken, indexedTerm);
          if (dist === 1) {
            candidateTerms.push({ term: indexedTerm, factor: 0.70, type: 'fuzzy' });
          } else if (dist === 2 && maxDist === 2) {
            candidateTerms.push({ term: indexedTerm, factor: 0.45, type: 'fuzzy' });
          }
        }
      }

      // Agrégation BM25 avec normalisation par longueur de document
      for (const { term, factor, type } of candidateTerms) {
        const postings = this.index.get(term)!;
        // Inverse Document Frequency (IDF) BM25
        const idf = Math.log(1 + (this.artworksMap.size - postings.size + 0.5) / (postings.size + 0.5));

        for (const [docId, tfWeight] of postings.entries()) {
          const docLen = this.docLengths.get(docId) || this.avgDocLength;
          const lengthNorm = 0.5 + 0.5 * (docLen / (this.avgDocLength || 1));
          const termScore = (tfWeight * idf * factor) / lengthNorm;

          const current = scores.get(docId) || 0;
          scores.set(docId, current + termScore);

          if (!matchedTokensMap.has(docId)) {
            matchedTokensMap.set(docId, new Set());
          }
          matchedTokensMap.get(docId)!.add(term);

          if (!matchTypeMap.has(docId) || type === 'exact') {
            matchTypeMap.set(docId, type);
          }
        }
      }
    }

    // Boost multi-termes : si l'œuvre contient tous les termes recherchés
    if (queryTokens.length > 1) {
      for (const [docId, score] of scores.entries()) {
        const tokensMatched = matchedTokensMap.get(docId)?.size || 0;
        if (tokensMatched >= queryTokens.length) {
          scores.set(docId, score * 1.6);
        }
      }
    }

    // Qualification des champs correspondants pour chaque résultat
    const results: SearchResultItem[] = [];
    const limit = options?.limit || 50;
    const normalizedQuery = this.normalizeString(query);

    for (const [docId, score] of scores.entries()) {
      const artwork = this.artworksMap.get(docId);
      if (!artwork) continue;

      const matchedFields: string[] = [];
      const titleNorm = this.normalizeString(artwork.title);
      const artistNorm = this.normalizeString(artwork.artist);
      const movementNorm = this.normalizeString(artwork.movement);
      const techniqueNorm = this.normalizeString(artwork.technique);
      const museumNorm = this.normalizeString(artwork.museum + ' ' + (artwork.museumFull || ''));
      const tagsNorm = this.normalizeString(artwork.tags?.join(' ') || '');
      const bodyNorm = this.normalizeString(
        (artwork.openingText || '') + ' ' + (artwork.quote || '')
      );

      // Vérification par sous-chaîne ou par token
      for (const qToken of queryTokens) {
        if (titleNorm.includes(qToken)) matchedFields.push('Titre');
        if (artistNorm.includes(qToken)) matchedFields.push('Artiste');
        if (movementNorm.includes(qToken)) matchedFields.push('Mouvement');
        if (techniqueNorm.includes(qToken)) matchedFields.push('Technique');
        if (museumNorm.includes(qToken)) matchedFields.push('Musée');
        if (tagsNorm.includes(qToken)) matchedFields.push('Mots-clés');
        if (bodyNorm.includes(qToken)) matchedFields.push('Notice curatoriale');
      }

      // Si recherche exacte globale
      if (titleNorm.includes(normalizedQuery) && !matchedFields.includes('Titre')) matchedFields.push('Titre');
      if (artistNorm.includes(normalizedQuery) && !matchedFields.includes('Artiste')) matchedFields.push('Artiste');
      if (movementNorm.includes(normalizedQuery) && !matchedFields.includes('Mouvement')) matchedFields.push('Mouvement');
      if (techniqueNorm.includes(normalizedQuery) && !matchedFields.includes('Technique')) matchedFields.push('Technique');

      const uniqueFields = Array.from(new Set(matchedFields));
      if (uniqueFields.length === 0) {
        uniqueFields.push('Index textuel BM25');
      }

      let snippet: string | undefined = undefined;
      if (artwork.openingText) {
        snippet = artwork.openingText;
      } else if (artwork.quote) {
        snippet = artwork.quote;
      }

      results.push({
        artwork,
        score,
        matchedFields: uniqueFields,
        snippet,
        matchedTokens: Array.from(matchedTokensMap.get(docId) || []),
        matchType: matchTypeMap.get(docId) || 'exact',
      });
    }

    // Tri par score de pertinence décroissant
    results.sort((a, b) => b.score - a.score);

    const execTime = performance.now() - startTime;
    return {
      results: results.slice(0, limit),
      stats: this.getStats(execTime),
    };
  }

  /**
   * Banc d'essai automatisé validant : accents, fautes de frappe, artiste, titre, mouvement, technique
   */
  public runBenchmarkSuite(): SearchBenchmarkResult[] {
    const testCases: Array<{
      testName: string;
      category: 'accent' | 'typo' | 'artist' | 'title' | 'movement' | 'technique';
      query: string;
      targetExpected: string;
    }> = [
      {
        testName: 'Test Accents (Cézanne)',
        category: 'accent',
        query: 'cezanne',
        targetExpected: 'Cézanne',
      },
      {
        testName: 'Test Accents (La Laitière)',
        category: 'accent',
        query: 'laitiere',
        targetExpected: 'Laitière',
      },
      {
        testName: 'Test Fautes de Frappe (Vermeer avec typo "vermer")',
        category: 'typo',
        query: 'vermer',
        targetExpected: 'Vermeer',
      },
      {
        testName: 'Test Fautes de Frappe (Monet avec typo "moneet")',
        category: 'typo',
        query: 'moneet',
        targetExpected: 'Monet',
      },
      {
        testName: 'Test Fautes de Frappe (Van Gogh avec typo "gokh")',
        category: 'typo',
        query: 'gokh',
        targetExpected: 'Gogh',
      },
      {
        testName: 'Test Recherche par Artiste (Le Caravage)',
        category: 'artist',
        query: 'Caravage',
        targetExpected: 'Caravage',
      },
      {
        testName: 'Test Recherche par Titre (La Joconde)',
        category: 'title',
        query: 'Joconde',
        targetExpected: 'Joconde',
      },
      {
        testName: 'Test Recherche par Titre (Nuit étoilée)',
        category: 'title',
        query: 'nuit etoilee',
        targetExpected: 'Nuit étoilée',
      },
      {
        testName: 'Test Recherche par Mouvement (Impressionnisme)',
        category: 'movement',
        query: 'impressionnisme',
        targetExpected: 'Impressionnisme',
      },
      {
        testName: 'Test Recherche par Mouvement (Baroque)',
        category: 'movement',
        query: 'baroque',
        targetExpected: 'Baroque',
      },
      {
        testName: 'Test Recherche par Technique (Huile sur toile)',
        category: 'technique',
        query: 'huile sur toile',
        targetExpected: 'Huile sur toile',
      },
      {
        testName: 'Test Recherche par Technique (Fresque)',
        category: 'technique',
        query: 'fresque',
        targetExpected: 'Fresque',
      },
    ];

    const results: SearchBenchmarkResult[] = [];

    for (const tc of testCases) {
      const t0 = performance.now();
      const res = this.search(tc.query, { limit: 5 });
      const elapsed = Number((performance.now() - t0).toFixed(2));

      const topResult = res.results[0];
      const found = res.results.some((r) => {
        const fullStr = `${r.artwork.title} ${r.artwork.artist} ${r.artwork.movement} ${r.artwork.technique}`.toLowerCase();
        return fullStr.includes(tc.targetExpected.toLowerCase());
      });

      results.push({
        testName: tc.testName,
        category: tc.category,
        query: tc.query,
        targetExpected: tc.targetExpected,
        found,
        hitsCount: res.results.length,
        topArtworkTitle: topResult ? topResult.artwork.title : 'Aucun',
        topArtworkArtist: topResult ? topResult.artwork.artist : 'Aucun',
        matchedFields: topResult ? topResult.matchedFields : [],
        executionTimeMs: elapsed,
      });
    }

    return results;
  }

  public getStats(lastQueryTimeMs?: number): SearchEngineStats {
    let uniqueTokensCount = 0;
    if (this.isIndexed) {
      uniqueTokensCount = this.index.size;
    }

    return {
      totalIndexed: this.artworksMap.size,
      uniqueTokensCount,
      avgDocLength: Math.round(this.avgDocLength),
      lastQueryTimeMs: lastQueryTimeMs !== undefined ? Number(lastQueryTimeMs.toFixed(2)) : 0.4,
      engineName: 'Index Inversé Plein Texte BM25 (In-Memory + Levenshtein)',
    };
  }
}

export const searchEngine = new FullTextSearchEngine();
