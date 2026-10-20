import 'fake-indexeddb/auto';
import crypto from 'crypto';

// Polyfill Web Crypto in Node environment
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = crypto.webcrypto;
}

// In-memory localStorage polyfill for Node test runner
const memoryStorage = new Map<string, string>();
// @ts-ignore
globalThis.localStorage = {
  getItem: (k: string) => memoryStorage.get(k) ?? null,
  setItem: (k: string, v: string) => memoryStorage.set(k, String(v)),
  removeItem: (k: string) => memoryStorage.delete(k),
  clear: () => memoryStorage.clear(),
  get length() { return memoryStorage.size; },
  key: (i: number) => Array.from(memoryStorage.keys())[i] ?? null,
};

// Directly import the REAL PRODUCTION SERVICES
import { indexedDbService } from '../src/services/indexedDbService.ts';
import { cryptoBackupService } from '../src/services/cryptoBackupService.ts';
import { catalogUpdateService } from '../src/services/catalogUpdateService.ts';
import { validateArtworksJson } from '../src/services/catalogValidator.ts';
import { ARTWORKS } from '../src/data/artworks.ts';

async function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ÉCHEC : ${msg}`);
    throw new Error(`Assertion failed: ${msg}`);
  }
  console.log(`  ✓ ${msg}`);
}

async function runProductionTests() {
  console.log('================================================================');
  console.log(' BANC D\'INTÉGRATION OFFICIEL : CODE DE PRODUCTION RÉEL (SERVICES)');
  console.log('================================================================\n');

  // --- TEST 1: Initialisation & Écriture de la progression utilisateur ---
  console.log('TEST 1 : Écriture et persistance réelle des données de progression...');
  await indexedDbService.saveUserProgress(250, [1, 2, 4]);
  await indexedDbService.addBookmark('starry-night');
  await indexedDbService.addBookmark('la-joconde');
  await indexedDbService.recordVisit('starry-night', 15);
  await indexedDbService.saveNote('Observation de la matière', 'Bleu cobalt', 'starry-night', 'note-1');

  const initialProg = await indexedDbService.getUserProgress();
  await assert(initialProg.points === 250, 'Points initiaux vérifiés (250 pts)');
  await assert(
    initialProg.completedSteps.includes(1) &&
    initialProg.completedSteps.includes(2) &&
    initialProg.completedSteps.includes(4),
    'Étapes terminées initiales vérifiées [1, 2, 4]'
  );

  // --- TEST 2: Export chiffré réel avec cryptoBackupService (AES-256-GCM) ---
  console.log('\nTEST 2 : Export chiffré réel (AES-GCM + PBKDF2 100 000 itérations)...');
  const passphrase = 'PasseSecuriseMusee2026!';
  const { jsonString } = await cryptoBackupService.exportBackup(passphrase);
  const container = JSON.parse(jsonString);

  await assert(container.format === 'regard-secure-backup', 'Format de conteneur chiffré valide');
  await assert(container.isEncrypted === true, 'Flag isEncrypted = true');
  await assert(container.encryption.iterations === 100000, 'KDF PBKDF2 avec 100 000 itérations vérifié');
  await assert(typeof container.ciphertext === 'string' && container.ciphertext.length > 50, 'Ciphertext AES-GCM généré');

  // --- TEST 3: Inspection avec phrase secrète incorrecte & corruption ---
  console.log('\nTEST 3 : Tentatives de déchiffrement avec mot de passe erroné et fichier altéré...');
  const badPassResult = await cryptoBackupService.inspectBackup(jsonString, 'MauvaisePhrase123');
  await assert(badPassResult.valid === false, 'Rejet immédiat en cas de phrase secrète erronée');
  await assert(badPassResult.error !== undefined, 'Message d\'erreur explicite retourné');

  // Corrupting ciphertext
  const corruptContainer = {
    ...container,
    ciphertext: container.ciphertext.slice(0, -8) + 'XXXXXXXX',
  };
  const corruptResult = await cryptoBackupService.inspectBackup(JSON.stringify(corruptContainer), passphrase);
  await assert(corruptResult.valid === false, 'Rejet immédiat en cas de données corrompues ou altérées');

  // Decrypt with correct passphrase
  const goodInspect = await cryptoBackupService.inspectBackup(jsonString, passphrase);
  await assert(goodInspect.valid === true, 'Déchiffrement réussi avec la phrase valide');
  await assert(goodInspect.decryptedData !== undefined, 'Données déchiffrées disponibles');

  // --- TEST 4: Restauration réelle, fermeture & réouverture de la base IndexedDB ---
  console.log('\nTEST 4 : Restauration en mode "replace", fermeture et réouverture complète d\'IndexedDB...');
  // Modify memory state before restore
  await indexedDbService.saveUserProgress(0, []);
  await indexedDbService.removeBookmark('starry-night');

  const restoreResult = await cryptoBackupService.restoreData(goodInspect.decryptedData, 'replace');
  await assert(restoreResult.success === true, 'Restauration atomique confirmée par cryptoBackupService');

  // Close the DB connection to test persistence across sessions
  await indexedDbService.closeDb();

  // Reopen DB and check getUserProgress
  const reopenedProgress = await indexedDbService.getUserProgress();
  await assert(reopenedProgress.points === 250, 'Points après réouverture de la base : 250 pts');
  await assert(
    Array.isArray(reopenedProgress.completedSteps) &&
    reopenedProgress.completedSteps.length === 3 &&
    reopenedProgress.completedSteps.includes(1) &&
    reopenedProgress.completedSteps.includes(2) &&
    reopenedProgress.completedSteps.includes(4),
    'RÉSOLU : completedSteps [1, 2, 4] parfaitement relu après fermeture et réouverture (clé unifiée) !'
  );

  const restoredBookmarks = await indexedDbService.getBookmarks();
  await assert(restoredBookmarks.some(b => b.artworkId === 'starry-night'), 'Favori "starry-night" restauré');
  await assert(restoredBookmarks.some(b => b.artworkId === 'la-joconde'), 'Favori "la-joconde" restauré');

  // --- TEST 5: Mode Fusion ("merge") des données utilisateur ---
  console.log('\nTEST 5 : Restauration en Mode Fusion ("merge")...');
  const incomingMergeData = {
    bookmarks: [{ artworkId: 'guernica', addedAt: Date.now() }],
    notes: [{ id: 'note-2', artworkId: 'guernica', title: 'Cubisme', content: 'Violence et guerre' }],
    progress: { points: 300, completedSteps: [5] },
  };

  await cryptoBackupService.restoreData(incomingMergeData, 'merge');
  await indexedDbService.closeDb();

  const mergedProgress = await indexedDbService.getUserProgress();
  await assert(mergedProgress.points === 300, 'Points fusionnés au maximum (300 pts)');
  await assert(
    mergedProgress.completedSteps.includes(1) &&
    mergedProgress.completedSteps.includes(2) &&
    mergedProgress.completedSteps.includes(4) &&
    mergedProgress.completedSteps.includes(5),
    'Étapes fusionnées en union stricte [1, 2, 4, 5]'
  );

  const mergedBookmarks = await indexedDbService.getBookmarks();
  await assert(mergedBookmarks.length === 3, '3 favoris présents (les 2 anciens + 1 nouveau)');

  // --- TEST 6: Interruption de transaction & Rollback automatique ---
  console.log('\nTEST 6 : Test de robustesse transactionnelle (Rollback sur interruption)...');
  const db = await indexedDbService.getDb();
  const bookmarksBefore = await indexedDbService.getBookmarks();

  let transactionAborted = false as boolean;
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(['bookmarks'], 'readwrite');
      const bStore = tx.objectStore('bookmarks');
      bStore.clear(); // Attempt to clear
      bStore.put({ artworkId: 'doomed-temp', addedAt: Date.now() });

      tx.onabort = () => {
        transactionAborted = true;
        reject(new Error('Transaction intentionnellement annulée pour tester le rollback'));
      };
      tx.onerror = () => reject(tx.error);
      tx.oncomplete = () => resolve();

      // Intentionally trigger an abort
      tx.abort();
    });
  } catch {
    // expected
  }

  await indexedDbService.closeDb();
  const bookmarksAfterAbort = await indexedDbService.getBookmarks();
  await assert(Boolean(transactionAborted), 'Événement tx.onabort intercepté');
  await assert(bookmarksAfterAbort.length === bookmarksBefore.length, 'Rollback validé : aucun favori perdu ni corrompu lors de l\'annulation');

  // --- TEST 7: Mise à jour catalogue avec checksum invalide & rejet ---
  console.log('\nTEST 7 : Mise à jour du catalogue avec empreinte SHA-256 invalide...');
  const fakeManifestWithBadHash = {
    schemaVersion: '1.0',
    catalogVersion: '9.9.9',
    releaseDate: '19 Octobre 2026',
    description: 'Manifeste avec faux hachage pour test d\'intégrité',
    artworksCount: 210,
    artistsCount: 105,
    sha256Checksum: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    catalogUrl: '/catalog/catalog-v1.2.json',
    changelog: ['Test rejet cryptographique'],
  };

  // Mock fetch to return real catalog JSON
  const fs = await import('fs');
  const realCatalogJson = fs.readFileSync('public/catalog/catalog-v1.2.json', 'utf8');

  // @ts-ignore
  globalThis.fetch = async (url: string) => {
    return {
      ok: true,
      status: 200,
      text: async () => realCatalogJson,
    } as any;
  };

  const updateResult = await catalogUpdateService.applyUpdate(fakeManifestWithBadHash);
  const isSecurityRejected = updateResult.success === false &&
    ((updateResult.error && (updateResult.error.includes('SHA-256') || updateResult.error.includes('intégrité'))) ||
     (updateResult.message && (updateResult.message.includes('SHA-256') || updateResult.message.includes('intégrité'))));

  await assert(isSecurityRejected === true, 'Rejet cryptographique immédiat du paquet si le hash SHA-256 ne correspond pas');

  // --- TEST 8: Conservation des données personnelles après mise à jour du catalogue ---
  console.log('\nTEST 8 : Conservation des données personnelles après mise à jour du catalogue...');
  // Save specific bookmarks and progress
  await indexedDbService.saveUserProgress(450, [1, 2, 3, 4, 5, 6]);
  const userBookmarksBefore = await indexedDbService.getBookmarks();
  const userNotesBefore = await indexedDbService.getNotes();

  // Perform atomicReplaceArtworks (what catalogUpdateService does)
  await indexedDbService.atomicReplaceArtworks(ARTWORKS.slice(0, 50), '1.2.0');
  await indexedDbService.closeDb();

  const userProgressAfterCatalog = await indexedDbService.getUserProgress();
  const userBookmarksAfterCatalog = await indexedDbService.getBookmarks();
  const userNotesAfterCatalog = await indexedDbService.getNotes();

  await assert(userProgressAfterCatalog.points === 450, 'Points de progression conservés intacts (450 pts)');
  await assert(userProgressAfterCatalog.completedSteps.length === 6, '6 étapes de parcours conservées intactes');
  await assert(userBookmarksAfterCatalog.length === userBookmarksBefore.length, 'Favoris personnels intégralement conservés');
  await assert(userNotesAfterCatalog.length === userNotesBefore.length, 'Notes de contemplation intégralement conservées');

  // --- TEST 9: Validation éditoriale stricte (rejet des fiches incomplètes & sans invention) ---
  console.log('\nTEST 9 : Validation éditoriale stricte (catalogValidator)...');
  const incompleteArtwork = {
    title: 'Toile Sans Artiste Ni Image',
    // Missing artist, year, imageUrl
  };
  const valResult = validateArtworksJson([incompleteArtwork]);
  await assert(valResult.isValid === false, 'Fiche incomplète rejetée par le validateur éditorial');
  await assert(valResult.errors.some(e => e.field === 'artist'), 'Erreur champ artiste obligatoire');
  await assert(valResult.errors.some(e => e.field === 'imageUrl'), 'Erreur champ URL d’image obligatoire');

  const validArtworkWithoutInventory = {
    title: 'Toile Valide',
    artist: 'Peintre Exemple',
    year: 1890,
    imageUrl: 'https://example.com/art.jpg',
    // Missing inventoryNumber and legalStatus
  };
  const valResult2 = validateArtworksJson([validArtworkWithoutInventory]);
  await assert(valResult2.isValid === true, 'Fiche avec champs obligatoires validée');
  await assert(
    valResult2.sanitizedArtworks[0].inventoryNumber === 'Non répertorié / En attente d’inventaire',
    'Numéro d’inventaire manquant étiqueté "Non répertorié" sans invention d’identifiant factice'
  );
  await assert(
    valResult2.sanitizedArtworks[0].legalStatus.includes('Non vérifié'),
    'Statut juridique manquant étiqueté "Non vérifié" sans invention de formule générique'
  );
  await assert(
    valResult2.sanitizedArtworks[0].audioGuide === undefined,
    'Aucun guide audio curatorial factice fabriqué si non renseigné dans la source'
  );

  console.log('\n================================================================');
  console.log(' TOUS LES TESTS D\'INTÉGRATION SUR LE CODE DE PRODUCTION SONT RÉUSSIS !');
  console.log('================================================================\n');
}

runProductionTests().catch((err) => {
  console.error('\n❌ Échec de la suite de tests d\'intégration :', err);
  process.exit(1);
});
