/**
 * In-Memory Inverted Index Full-Text Search (FTS) Engine for Regard
 * High-performance, zero-dependency French & multilingual search engine with BM25-like scoring,
 * accent folding, prefix matching, field weighting, and snippet generation.
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
}

export interface SearchEngineStats {
  totalIndexed: number;
  uniqueTokensCount: number;
  avgDocLength: number;
  lastQueryTimeMs: number;
  engineName: string;
}

export class FullTextSearchEngine {
  // Inverted index: token -> Map<artworkId, weightedScore>
  private index: Map<string, Map<string, number>> = new Map();
  private artworksMap: Map<string, Artwork> = new Map();
  private docLengths: Map<string, number> = new Map();
  private avgDocLength: number = 0;
  private isIndexed: boolean = false;
  private lastQueryTimeMs: number = 0;

  /**
   * Normalize and tokenize text with accent folding
   */
  public tokenize(text: string): string[] {
    if (!text) return [];
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter((tok) => tok.length > 1 && !FRENCH_STOPWORDS.has(tok));
  }

  /**
   * Index all artworks
   */
  public indexArtworks(artworks: Artwork[]): void {
    const startTime = performance.now();
    this.index.clear();
    this.artworksMap.clear();
    this.docLengths.clear();

    let totalLength = 0;

    for (const art of artworks) {
      this.artworksMap.set(art.id, art);

      // Extract weighted fields
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
        titleTokens.length * 5 +
        artistTokens.length * 4 +
        movementTokens.length * 3 +
        tagsTokens.length * 2 +
        techniqueTokens.length * 1.5 +
        museumTokens.length * 1.2 +
        bodyTokens.length;

      this.docLengths.set(art.id, docLen);
      totalLength += docLen;

      // Add tokens with weights
      this.addTokens(art.id, titleTokens, 6.0);
      this.addTokens(art.id, subtitleTokens, 4.0);
      this.addTokens(art.id, artistTokens, 4.5);
      this.addTokens(art.id, movementTokens, 3.0);
      this.addTokens(art.id, techniqueTokens, 2.0);
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
   * Execute Full-Text Search Query
   */
  public search(query: string, options?: { limit?: number; minScore?: number }): {
    results: SearchResultItem[];
    stats: SearchEngineStats;
  } {
    const startTime = performance.now();
    const queryTokens = this.tokenize(query);

    if (queryTokens.length === 0) {
      const execTime = performance.now() - startTime;
      return {
        results: [],
        stats: this.getStats(execTime),
      };
    }

    // Accumulator: docId -> score
    const scores = new Map<string, number>();
    const matchedTokensMap = new Map<string, Set<string>>();
    const matchedFieldsMap = new Map<string, Set<string>>();

    for (const qToken of queryTokens) {
      // Find exact or prefix matches in index
      const matchingTerms: { term: string; factor: number }[] = [];

      // 1. Exact match
      if (this.index.has(qToken)) {
        matchingTerms.push({ term: qToken, factor: 1.0 });
      }

      // 2. Prefix match (e.g. "verm" matches "vermeer")
      if (qToken.length >= 3) {
        for (const indexedTerm of this.index.keys()) {
          if (indexedTerm !== qToken && indexedTerm.startsWith(qToken)) {
            matchingTerms.push({ term: indexedTerm, factor: 0.75 });
          }
        }
      }

      // Aggregate scores with BM25 doc length normalization
      for (const { term, factor } of matchingTerms) {
        const postings = this.index.get(term)!;
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
        }
      }
    }

    // Multi-term boost: if an artwork matched ALL query tokens, give bonus
    if (queryTokens.length > 1) {
      for (const [docId, score] of scores.entries()) {
        const tokensMatched = matchedTokensMap.get(docId)?.size || 0;
        if (tokensMatched >= queryTokens.length) {
          scores.set(docId, score * 1.5);
        }
      }
    }

    // Determine matched fields for snippet
    const results: SearchResultItem[] = [];
    const limit = options?.limit || 50;

    for (const [docId, score] of scores.entries()) {
      const artwork = this.artworksMap.get(docId);
      if (!artwork) continue;

      const matchedFields: string[] = [];
      const qLower = query.toLowerCase();

      if (artwork.title.toLowerCase().includes(qLower)) matchedFields.push('Titre');
      if (artwork.artist.toLowerCase().includes(qLower)) matchedFields.push('Artiste');
      if (artwork.movement.toLowerCase().includes(qLower)) matchedFields.push('Mouvement');
      if (artwork.technique.toLowerCase().includes(qLower)) matchedFields.push('Technique');
      if (artwork.museum.toLowerCase().includes(qLower)) matchedFields.push('Musée');
      if (artwork.tags?.some((t) => t.toLowerCase().includes(qLower))) matchedFields.push('Mots-clés');
      if (artwork.openingText?.toLowerCase().includes(qLower)) matchedFields.push('Notice');

      if (matchedFields.length === 0) {
        matchedFields.push('Index textuel');
      }

      // Generate snippet
      let snippet: string | undefined = undefined;
      if (artwork.openingText) {
        snippet = artwork.openingText;
      } else if (artwork.quote) {
        snippet = artwork.quote;
      }

      results.push({
        artwork,
        score,
        matchedFields,
        snippet,
        matchedTokens: Array.from(matchedTokensMap.get(docId) || []),
      });
    }

    // Sort by descending score
    results.sort((a, b) => b.score - a.score);

    const execTime = performance.now() - startTime;
    return {
      results: results.slice(0, limit),
      stats: this.getStats(execTime),
    };
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
      lastQueryTimeMs: lastQueryTimeMs !== undefined ? Number(lastQueryTimeMs.toFixed(2)) : 0.5,
      engineName: 'Index Inversé Plein Texte (BM25)',
    };
  }
}

export const searchEngine = new FullTextSearchEngine();
