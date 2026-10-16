# 🏛️ CONTEXT.md — Regard : Philosophie, Architecture & Genèse

Ce document décrit le contexte de conception, les principes directeurs d'expérience utilisateur (UX/UI), la souveraineté technologique et le modèle de données de l'application **Regard — L'Art de la Peinture**.

---

## 1. Genèse & Vision Curatoriale

### Le Problème : La Saturation Visuelle
Sur les plateformes numériques modernes et les réseaux sociaux, les œuvres d'art sont fréquemment réduites à des vignettes miniatures défilées à grande vitesse. L'œil n'a ni le temps de s'arrêter sur la texture de la matière picturale, ni l'opportunité de comprendre les choix de composition ou l'évolution des pigments.

### La Réponse : « Le Regard plutôt que le Défilement »
**Regard** prend le contre-pied absolu de cette consommation rapide :
1. **Silence Visuel & Immersion Nocturne** : L'environnement graphique adopte les codes d'une salle de musée en nocturne — fond noir obsidienne (`#141318`), cartels texturés en ébène (`#1c1b20`), et rehauts d'or muséal antique (`#f2ca50` et `#d4af37`).
2. **Double Niveau de Lecture** : Tout amateur d'art peut choisir entre une découverte rapide (*Découvrir en 2 minutes*) ou une plongée scientifique complète (*Approfondir* en 4 chapitres structurés).
3. **Pédagogie Active** : L'utilisateur n'est pas passif ; il inspecte les toiles au microscope avec la grille du nombre d'or, analyse les spectres lumineux, écoute la voix des conservateurs et valide ses acquis dans des évaluations interactives.

---

## 2. Principes Fondamentaux d'Architecture

### A. Souveraineté Totale des Données & Fonctionnement 100% Hors-ligne (Architecture Option A : IndexedDB)
L'application a été conçue selon un impératif technique strict : **zéro dépendance vis-à-vis d'un serveur applicatif ou d'une base de données cloud propriétaire**.
- **Base Structurée IndexedDB (`RegardMuseumDB` v1)** : Stockage pérenne W3C asynchrone non-bloquant en 7 ObjectStores distincts (`artworks`, `artists`, `bookmarks`, `history`, `notes`, `user_progress`, `app_settings`).
- **Moteur FTS BM25 en Mémoire** : Index inversé local avec pliage d'accents (accent folding), élimination des stopwords et pondération multicritère garantissant une recherche instantanée sous la milliseconde sans le surcoût de 4 Mo d'un binaire SQLite WASM.
- **Historique Réel d'Exploration** : L'historique démarre vierge à l'installation et enregistre les toiles effectivement consultées par l'utilisateur, avec calcul de la durée de lecture et des occurrences de visite.
- **Sauvegarde Autonome Chiffrée (AES-GCM 256 bits)** : L'utilisateur peut à tout moment exporter sa collection au format JSON clair ou chiffré par mot de passe (dérivation PBKDF2 100 000 itérations), et la restaurer avec vérification et prévisualisation préalable (mode fusion ou remplacement).
- **Mises à Jour Déterministes Vérifiables** : Téléchargement du catalogue officiel via un manifeste versionné avec contrôle d'intégrité cryptographique SHA-256 et synchronisation PWA hors-ligne.

### B. Norme PWA (Progressive Web App)
Regard est configurée selon les standards PWA du W3C et du Web App Manifest :
- Installation directe sur smartphone (Android / iOS) et ordinateur (Windows / macOS / Linux).
- Lancement en mode **Standalone** (sans barre d'adresse ni boutons de navigation du navigateur).
- Service Worker dédié assurant la résilience hors-ligne et le pré-chargement des ressources essentielles.

---

## 3. Système Typographique & Chromatique

| Rôle | Police / Valeur | Intention Esthétique |
| :--- | :--- | :--- |
| **Titres & Cartels** | *Playfair Display* (Serif) | Noblesse éditoriale, évocation des catalogues raisonnés et des reliures d'art du XVIIIe siècle. |
| **Textes de Lecture** | *Plus Jakarta Sans* | Clarté moderne, lisibilité sur écran OLED et réduction de la fatigue oculaire. |
| **Fond Général** | `#141318` (Obsidienne) | Absence de reflets parasites, valorisation des contrastes lumineux des toiles. |
| **Surfaces & Cartels** | `#1c1b20` / `#201f24` | Hiérarchie feutrée sans bords durs agressifs. |
| **Accent Doré** | `#f2ca50` (Or muséal) | Rehauts de lumière inspirés des cadres baroques dorés à la feuille. |

---

## 4. Parcours d'Apprentissage & Rigueur Scientifique

Le corpus pédagogique est structuré en plusieurs cycles :
- **Les Maîtres de la Couleur** : 8 étapes historiques de la Renaissance flamande au Fauvisme (Giotto, Van Eyck, Le Caravage, Vermeer, Cézanne, Van Gogh, Seurat, Matisse).
- **Le Clair-obscur et la Nuit** : Du ténébrisme romain de Caravage aux nocturnes poétiques de Georges de La Tour et Rembrandt.
- **Révolution Impressionniste** : L'émergence de la peinture en plein air et les théories des couleurs complémentaires de Chevreul.
- **Femmes Peintres de Légende** : Réhabilitation des pionnières de l'art (Artemisia Gentileschi, Élisabeth Vigée Le Brun, Berthe Morisot, Frida Kahlo).

Toutes les notices techniques font état des dimensions réelles, des pigments historiques dominants et des numéros d'inventaire des collections publiques nationales et internationales.
