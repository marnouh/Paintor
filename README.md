<div align="center">

<img src="/src/assets/images/regard_pwa_logo_1791643215759.jpg" alt="Regard — L'Art de la Peinture Logo" width="160" style="border-radius: 28px; box-shadow: 0 10px 30px rgba(242, 202, 80, 0.25);" />

# 🏛️ Regard — L'Art de la Peinture

**Musée immersif autonome, carnet curatorial local et exploration scientifique des chefs-d'œuvre de la peinture mondiale.**

[![PWA Ready](https://img.shields.io/badge/PWA-Installable-F2CA50?style=for-the-badge&logo=pwa&logoColor=141318)](https://web.dev/progressive-web-apps/)
[![100% Offline](https://img.shields.io/badge/Stockage-IndexedDB%20%2B%20BM25-2ECC71?style=for-the-badge&logo=w3c&logoColor=white)](#-architecture-de-stockage-local-indexeddb-option-a)
[![TypeScript](https://img.shields.io/badge/TypeScript-ES2022-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[✨ Découvrir l'Application](#-fonctionnalités-phares) • [📱 Mode PWA & Raccourci](#-installation-pwa--raccourci) • [🗄️ Stockage IndexedDB](#-architecture-de-stockage-local-indexeddb-option-a) • [🔬 Visionneuse Gigapixel](#-visionneuse-ultra-hd-gigapixel) • [📚 Parcours & Histoire de l'Art](#-parcours-pédagogiques--quiz)

</div>

---

## 🎨 Présentation Générale

**Regard** est conçu pour transformer l'apprentissage de l'histoire de l'art en une expérience sensorielle, silencieuse et scientifique. Inspiré par les plus prestigieuses salles d'exposition nocturnes (Mauritshuis, Musée d'Orsay, National Gallery, Louvre), l'application privilégie la **contemplation active** face aux flux d'images éphémères des réseaux sociaux.

L'application fonctionne à **100% en mode autonome et local** : aucune dépendance serveur, aucun pistage publicitaire, et une architecture de persistance structurée **IndexedDB (RegardMuseumDB v1)** couplée à un moteur de recherche plein texte à index inversé (BM25) avec accent folding et pondération multicritère.

---

## 🖼️ Captures d'Écran de l'Application

<div align="center">

### 🌟 Sélection Curatoriale du Jour & Parcours Thématiques
<img src="/src/assets/images/regard_screen_home_1791643235495.jpg" alt="Regard — Accueil & Sélection du Conservateur" width="850" style="border-radius: 16px; border: 1px solid rgba(242, 202, 80, 0.35); box-shadow: 0 15px 40px rgba(0,0,0,0.7);" />

*Accueil éditorialisé avec chef-d'œuvre du jour, points d'observation focaux, axes d'exploration et reprise de lecture.*

<br/>

### 🔬 Visionneuse Macro HD & Analyse de Détails
<img src="/src/assets/images/regard_screen_gigapixel_1791643253226.jpg" alt="Regard — Visionneuse Macro HD et Grille de Composition" width="850" style="border-radius: 16px; border: 1px solid rgba(242, 202, 80, 0.35); box-shadow: 0 15px 40px rgba(0,0,0,0.7);" />

*Inspection macroscopique Canvas Deep-Zoom, grille géométrique, pipette d'échantillonnage de pixels et dossiers scientifiques sourcés.*

</div>

---

## ✨ Fonctionnalités Phares

### 1. 🏛️ Accueil Éditorial & Regard Minute
- **Chef-d'œuvre du jour** : Mise en valeur haute définition avec points focaux interactifs (ex. éclat de la perle chez Vermeer).
- **Regard Minute** : Découverte d'un détail caché en 60 secondes (ex. le miroir convexe des *Époux Arnolfini* par Van Eyck).
- **Axes d'exploration rapides** : Incontournables, chefs-d'œuvre méconnus, femmes artistes, Renaissance, impressionnisme, baroque & ténèbres.

### 2. 📖 Fiche Détaillée & Mode de Lecture Dual
- **Mode Découvrir (2 min)** : Citation curatoriale, accroche synthétique, observation première et hotspots visuels.
- **Mode Approfondir** : 4 chapitres scientifiques déployables (Composition & Rythme, Technique & Pigments, Contexte & Correspondances, Postérité & Mythe).
- **Cartel muséal complet** : Technique, support, dimensions, lieu de conservation, numéro d'inventaire officiel et statut juridique (domaine public mondial / patrimoine).
- **Lecteur Audio HTML5 Réel & Multi-Sources** : Balise native `<audio>` et `<source src="..." type="audio/wav">` intégrées directement dans le DOM (`AudioPlayerFloating` et `AudioPlayerModal`), alimentées par des fichiers acoustiques physiques locaux dans `/public/audio/` (format WAVE PCM 16-bit 22.05 kHz stéréo).
- **Contrôles Doubles & Vérification Visuelle** : Interface muséale enrichie + bouton d'affichage direct du lecteur standard navigateur (`<audio controls>`), barre de progression réactive, sauts -10s/+10s, sélecteur de vitesse (0.75x à 2.0x), et visualiseur spectral de fréquences (`AudioSpectrumVisualizer`).
- **Preuve Matérielle & Diapason Sonore** : Diagnostic technique intégré certifiant le fichier sonore et l'état de diffusion, complété par un bouton d'émission d'un diapason sinusoïdal (440 Hz) via Web Audio API (`AudioContext`) et une synthèse vocale française de secours (Web Speech API).
- **Lecteur Grand Format Dédié (`AudioPlayerModal`)** : Transcription intégrale du commentaire pour lire en silence, commande de volume sonore et raccourci direct vers le laboratoire Gigapixel.

### 3. 🔍 Visionneuse Macro HD & Analyse de Détails
- **Moteur Canvas Deep-Zoom interactif** : Paliers de zoom 1×, 2×, 4× et 8× avec zoom molette/tactile, panoramique fluide et minimap radar dynamique.
- **Grille géométrique & Matrice de tuilage** : Tracé géométrique du nombre d'or, lignes de force des tiers et grille de tuiles coordonnées (`T[c,r]`).
- **Échantillonneur chromatique réel (Pipette Canvas)** : Prélèvement direct des pixels de l'œuvre (`getImageData`), extraction des valeurs Hex, RGB, Luminance et correspondance avec les pigments historiques réels.
- **Filtres optiques d'observation** : Simulations éducatives de réflectographie infrarouge (mise en relief des sous-couches et repentirs), lumière rasante (accentuation du relief de matière et craquelures) et monochrome d'étude.
- **Dossiers de conservation sourcés** : Rapports authentifiés issus des laboratoires de référence (C2RMF - Musée du Louvre, Mauritshuis, MoMA Conservation, Musée d'Orsay, Rijksmuseum) décrivant les analyses réelles (IRR, MA-XRF, XRD, stratigraphies) et découvertes matérielles.

### 4. 🎓 Parcours Pédagogiques & Quiz Curatorial
- **Cycle « Les Maîtres de la Couleur »** : 8 étapes chronologiques ordonnées (de Giotto à Matisse).
- **Frise chronologique (1400–1945)** : Six siècles d'innovations esthétiques avec fiches mouvements interactives.
- **Vocabulaire du conservateur** : Glossaire technique (sfumato, glacis, impasto, chiaroscuro, divisionnisme, repentir).
- **Quiz interactif « Le Regard du Coloriste »** : Questions d'examen visuel, indice scientifique dépliable, calcul de score en temps réel et déblocage du badge officiel de conservateur.

### 5. 📚 Ma Collection & Carnet Tactile
- **Salons d'exposition personnalisés** : Classement par thématiques privées.
- **Statistiques d'immersion** : Heures de contemplation, toiles contemplées, jauge de points et rang d'érudition esthétique.
- **Notes d'analyse personnelles** : Ajout d'observations textuelles libres.
- **Souveraineté & Export** : Export de sauvegarde en fichier JSON chiffré sans aucun tiers distant.

### 6. ⚙️ Menu Hamburger, Mises à Jour & Accessibilité
- **Menu Hamburger Catégorisé** : Accès rapide structuré en 4 rubriques (*Découverte & Galerie*, *Étude & Savoir*, *Mon Espace Curatorial*, *Système & Préférences*).
- **Mises à Jour Automatiques en Arrière-plan** : Détection et installation silencieuse périodique (15 min à 24h) sans interrompre la lecture.
- **Paramètres Système Avancés** : Date de sortie officielle, date de dernière vérification, boutons « Vérifier les mises à jour » et « Forcer la mise à jour » (vidage de cache & synchronisation instantanée).
- **Thème Clair (« Galerie Diurne »)** : Bascule instantanée entre la pénombre feutrée muséale et la clarté éclatante d'une galerie d'exposition.
- **Onboarding & Mentions Légales Obligatoires** : Clause de non-responsabilité expresse du créateur sur les données culturelles et artistiques, validée par l'utilisateur.
- **Aide Contextuelle & Infobulles** : Bannières d'assistance pédagogique à la visite et bulles explicatives au survol de chaque commande.

---

## 📱 Installation PWA & Raccourci

**Regard** est une **Progressive Web App (PWA)** certifiée. Elle peut être installée directement sur smartphone, tablette ou ordinateur sans passer par un magasin d'applications.

<div align="center">

| Plateforme | Méthode d'Installation |
| :--- | :--- |
| **Android (Chrome)** | Cliquez sur le bouton doré **« Installation »** dans la barre supérieure ou sélectionnez *(⋮) > « Installer l'application »* |
| **iPhone & iPad (Safari)** | Touchez l'icône **Partager** (carré avec flèche ⎋) puis sélectionnez **« Sur l'écran d'accueil »** ⊕ |
| **Desktop (Chrome / Edge / Safari)** | Cliquez sur **« Installation »** dans l'en-tête ou sur l'icône **⊕ Installer** dans la barre d'adresse pour ouvrir en fenêtre autonome |

</div>

### Avantages du Mode PWA
- ⚡ **Lancement instantané** depuis l'écran d'accueil ou le bureau.
- 🔲 **Expérience plein écran (Standalone)** sans barre d'adresse de navigateur.
- 📶 **Fonctionnement hors-ligne** grâce au Service Worker et au pré-cache local.
- 🔒 **Confidentialité totale** : aucune donnée personnelle n'est envoyée vers des serveurs distants.

---

## 🗄️ Architecture de Stockage Local : Option A (IndexedDB)

Conformément au cahier des charges et aux arbitrages techniques d'architecture pour une Progressive Web App autonome, **l'Option A : Architecture IndexedDB Complète** a été retenue et intégrée.

### 1. Pourquoi IndexedDB plutôt que SQLite WASM ?

| Critère | Architecture Retenue : IndexedDB (Option A) | Alternative : SQLite WASM / FTS5 |
| :--- | :--- | :--- |
| **Poids & Téléchargement initial** | **0 Ko de surcoût** — API native intégrée dans 100% des navigateurs modernes. | **+1,5 à 4,5 Mo** de binaire WebAssembly (`sqlite3.wasm`) à charger au démarrage. |
| **Gestion mémoire (RAM)** | **Asynchrone non-bloquante**, gérée par le thread de stockage du navigateur. | Consommation importante de heap WASM (32–64 Mo) pouvant planter les navigateurs mobiles. |
| **Contraintes de Sécurité PWA** | **Aucun prérequis d'en-têtes HTTP**. Fonctionne sur tout hébergement statique ou CDN. | Nécessite des en-têtes stricts `COOP` (Same-Origin) et `COEP` (Require-Corp) qui **bloquent les images et audios externes**. |
| **Quota & Persistance** | **Multi-gigaoctets** (API `navigator.storage.estimate()`), persistance garantie sans perte. | Fichier virtuel OPFS / IDBFS sujet à des corruptions lors de fermetures intempestives d'onglets. |
| **Modèle de Données** | **Objets TypeScript structurés** sans désérialisation lourde. | Requêtes textuelles SQL avec sérialisation/désérialisation obligatoire. |

### 2. Schéma de la Base de Données `RegardMuseumDB` (v1)

L'ensemble des données réside dans la base IndexedDB locale `RegardMuseumDB` répartie en **7 ObjectStores** spécialisés :

1. `artworks` (clé primaire `id`) :
   - Contient l'intégralité du corpus de peintures (210 toiles canoniques certifiées et enrichies avec dimensions, pigments, cartel muséal, 4 chapitres scientifiques et points d'intérêt).
   - Index secondaires : `artist`, `movement`, `period`, `year`.
   - Modifiable à tout moment par l'utilisateur via le gestionnaire de catalogue (import/export JSON avec validation de schéma stricte).
2. `artists` (clé primaire `id`) :
   - Répertoire biographique des 105 peintres du monde (dates de naissance/mort, nationalité, biographies courte & longue, mouvements principaux, citations et contexte historique).
   - Index secondaire : `name`.
3. `bookmarks` (clé primaire `artworkId`) :
   - Sauvegarde des toiles favorites avec horodatage d'ajout réel (`addedAt`).
4. `history` (clé primaire `artworkId`) :
   - Historique d'exploration **réel et vierge à l'installation**. Enregistre les consultations effectives de l'utilisateur avec horodatage (`lastVisitedAt`), compteur de visites (`visitCount`) et durée cumulée de lecture (`readMinutes`).
5. `notes` (clé primaire `id`) :
   - Carnet d'analyse curatorial de l'utilisateur (CRUD complet de notes d'étude liées ou non à une œuvre spécifique, avec date de création et mise à jour).
6. `user_progress` (clé primaire `key`) :
   - Enregistrement des points d'érudition esthétique, paliers franchis (ex. *Initié*, *Amateur Éclairé*, *Conservateur Adjoint*), étapes de parcours complétées et badges débloqués.
7. `app_settings` (clé primaire `key`) :
   - Préférences utilisateur (thème sombre nocturne ou clair diurne, fréquence des mises à jour automatiques, activation des infobulles et bannières contextuelles).

### 3. Moteur de Recherche Plein Texte (FTS) Inversé BM25

Pour offrir la même puissance de recherche qu'un moteur SQLite FTS5 sans son surcoût binaire, l'application intègre un **moteur de recherche à index inversé en mémoire (BM25)** (`src/services/searchEngine.ts`) synchronisé avec IndexedDB :
- **Tokenisation & Pliage d'Accents (Accent Folding)** : Normalisation Unicode NFD, suppression des diacritiques (`é` → `e`, `à` → `a`, `ç` → `c`) et insensible à la casse.
- **Filtrage des Mots Vides (Stopwords)** : Élimination des termes parasites de la langue française (`le`, `la`, `de`, `du`, `dans`, etc.).
- **Pondération Multicritère** : Titre (poids 6.0), Sous-titre (4.0), Artiste (4.5), Mouvement (3.0), Technique (2.0), Musée (1.5), Tags (2.2), Description curatoriale & transcription audio (1.0).
- **Tolérance & Préfixes** : Correspondance instantanée dès 2 caractères saisis, recherche croisée toiles/artistes/mouvements/siècles en moins de 1 milliseconde.

### 4. Sauvegarde Chiffrée (AES-GCM 256 bits), Restauration & Mises à Jour Vérifiables

- **Sauvegarde Chiffrée Web Crypto API** (`src/services/cryptoBackupService.ts`) :
  - **Chiffrement fort AES-GCM 256 bits** avec tag d'authentification garantissant l'intégrité et la confidentialité.
  - Dérivation de clé par **PBKDF2-HMAC-SHA256** avec sel aléatoire de 16 octets et **100 000 itérations** (OWASP).
  - Vecteur d'initialisation (IV) de 12 octets aléatoires à chaque export.
  - Deux modes au choix : **Conteneur chiffré sécurisé** (`.regard.json` protégé par mot de passe/phrase secrète) ou **Export JSON standard**.
- **Restauration avec Vérification & Prévisualisation** (`src/components/BackupRestoreModal.tsx`) :
  - Analyse préalable du fichier, contrôle de structure et déchiffrement authentifié (rejet immédiat si mot de passe erroné ou fichier altéré).
  - Écran de **prévisualisation détaillée** des données authentifiées (œuvres, favoris, notes, visites réelles, points).
  - Deux modes d'application : **Fusionner (Recommandé)** pour préserver les données existantes sans écrasement, ou **Remplacer**.
- **Mises à Jour Réelles & Déterministes du Catalogue** (`src/services/catalogUpdateService.ts`) :
  - Téléchargement du manifeste officiel `public/catalog/manifest.json` avec version (`1.2.0`) et journal des modifications.
  - **Contrôle d'intégrité cryptographique SHA-256** calculé dans le navigateur avant toute injection dans la base de données.
  - Validation stricte du schéma muséal des toiles (`catalogValidator.ts`).
  - Application atomique dans IndexedDB (`artworks`) sans jamais altérer les favoris, notes ou l'historique personnel de l'utilisateur.
  - Prise en charge transparente et gracieuse du mode 100% hors-ligne (aucune erreur bloquante en l'absence de réseau).

---

## 🛠️ Stack Technique

```
┌────────────────────────────────────────────────────────┐
│                      REGARD PWA                        │
├───────────────────────┬────────────────────────────────┤
│ Framework UI          │ React 19 + TypeScript (Strict) │
│ Outil de build        │ Vite 8 + @vitejs/plugin-react  │
│ Système de Design     │ Tailwind CSS v4 (@theme tokens)│
│ Typographies          │ Playfair Display & Plus Jakarta│
│ Iconographie          │ Google Material Symbols        │
│ Stockage Local        │ IndexedDB W3C (RegardMuseumDB) │
│ Indexation Plein Texte│ Moteur Inversé BM25 en mémoire │
│ Audio & Multimédia    │ HTML5 Audio + Web Speech API   │
│ Offline & Cache       │ Service Worker + Cache API     │
│ Architecture          │ Composants modulaires / Hooks  │
└───────────────────────┴────────────────────────────────┘
```

---

## 🚀 Démarrage en Développement Local

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-compte/regard-art-app.git
cd regard-art-app

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev

# 4. Compiler pour la production
npm run build
```

---

## ⚖️ Droits & Domaine Public

Toutes les toiles et reproductions numériques présentées au sein de l'application relèvent du **Domaine public mondial** ou des politiques d'accès ouvert (*Open Access*) des musées partenaires (The Metropolitan Museum of Art, Rijksmuseum, Mauritshuis, National Gallery of Art, Art Institute of Chicago).
