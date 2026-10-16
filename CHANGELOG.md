# 📜 CHANGELOG — Regard : Journal des Modifications

Toutes les modifications notables apportées au projet **Regard — L'Art de la Peinture** sont consignées dans ce document, selon les principes de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [2.5.0] - 2026-10-10

### 🎧 Guide Audio Réel & Lecteur Interactif Déployé
- **Vrais fichiers audio natifs** :
  - Génération et intégration d'une bibliothèque complète de pistes audio pour chaque chef-d'œuvre dans `/public/audio/` (carillons de musée, résonances acoustiques harmoniques, ambiance de galerie).
  - Couverture complète des œuvres du musée (Van Gogh, Vermeer, Frida Kahlo, Goya, Monet, Artemisia Gentileschi, Cézanne, De Vinci, Le Caravage, Hokusai, Lascaux).
  - Intégration du moteur HTML5 `Audio` avec écouteurs d'événements réels (`timeupdate`, `durationchange`, `play`, `pause`, `waiting`, `canplay`, `error`, `ended`).
- **Contrôles Complets de Progression & Navigation Temporelle** :
  - Curseur de défilement interactif (scrubber) permettant de sauter instantanément à n'importe quel moment de la piste audio.
  - Horodatage précis en direct : temps écoulé / durée totale (`00:42 / 02:14`) et temps restant.
  - Boutons de saut temporel d'avance et de recul rapide de 10 secondes (`-10s` / `+10s`).
  - Sélecteur de vitesse de lecture configurable (`0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`).
  - Contrôle du volume sonore et bouton de coupure (sourdine / mute).
- **Gestion Avancée des Erreurs & Résilience** :
  - Détection automatique et gestion des erreurs de chargement, de réseau ou de décodage (`hasError`, `errorMessage`).
  - Bannière d'alerte claire avec bouton **« Réessayer »** pour relancer la lecture.
  - Bascule instantanée de secours vers la **Synthèse Vocale Assistée (Web Speech API)** en langue française (`fr-FR`) pour garantir que l'utilisateur ne soit jamais privé de l'explication curatoriale.
- **Lecteur Flottant & Grand Format Dédié** :
  - Barre flottante persistante (`AudioPlayerFloating`) avec miniature, titres, barre de progression interactive, contrôles de transport et bouton de minimisation.
  - Nouveau lecteur grand format (`AudioPlayerModal`) avec visuel haute définition, commandes enrichies, transcription intégrale du commentaire et raccourci direct vers le mode Gigapixel.
  - Intégration dans la fiche de l'œuvre (`ArtworkDetailScreen`) avec curseur en direct et transcription textuelle dépliable.

## [2.4.2] - 2026-10-10

### ✨ Ajouté
- **Menu Hamburger Catégorisé** :
  - Tiroir coulissant fluide accessible depuis la barre supérieure (`TopAppBar`).
  - Organisation des fonctionnalités par catégories :
    1. *🏛️ Découverte & Galerie* : Accueil, Explorer le Catalogue, Recherche FTS5, Laboratoire Gigapixel.
    2. *🎓 Étude & Savoir* : Parcours Pédagogiques (« Les Maîtres de la Couleur »), Frise chronologique (1400–1945), Quiz Curatorial.
    3. *📚 Mon Espace Curatorial* : Ma Collection, Salons privés, Profil & Érudition.
    4. *⚙️ Système & Préférences* : Paramètres système, Thème, Onboarding & Mentions Légales, Installation PWA.
- **Menu des Paramètres Système & Mises à Jour** (`SystemSettingsModal`) :
  - Affichage de la date de sortie officielle de la version (`10 Octobre 2026`).
  - Affichage de la date et heure de la dernière vérification effectuée.
  - Bouton interactif **« Vérifier les mises à jour »** avec vérification en temps réel du Service Worker et des caches.
  - Bouton **« Forcer la mise à jour »** réinitialisant le cache de l'application et rechargeant la dernière mouture du catalogue sans perte de données.
- **Système de Mises à Jour Automatiques en Arrière-plan** :
  - Boucle d'arrière-plan autonome vérifiant la disponibilité de nouvelles versions à intervalle configurable (15 min, 30 min, 1h, 6h, 24h).
  - Téléchargement et application silencieuse en tâche de fond.
- **Thème Clair (« Galerie Diurne »)** :
  - Palette chaleureuse inspirée des galeries en marbre clair et papier vergé (`#f7f5f0`, `#ffffff`, or bruni `#9c7310`, bordures douces).
  - Bascule instantanée en un clic depuis la barre supérieure, le menu Hamburger ou les paramètres de profil.
- **Onboarding & Mentions Légales Obligatoires** (`OnboardingModal`) :
  - Parcours d'accueil en 3 étapes guidant l'utilisateur sur la contemplation autonome et le gigapixel.
  - Étape légale dédiée stipulant expressément la clause d'exonération : *« L'éditeur décline toute responsabilité quant aux données fournies dans l'application »*.
  - Validation explicite avec case à cocher avant l'entrée dans le musée, re-consultable à tout moment.
- **Onboarding Contextuel & Infobulles (« Tooltips »)** :
  - Composant `Tooltip` pour afficher au survol et à l'interaction l'intitulé clair de chaque commande.
  - Bannières d'astuces contextuelles dismissables (`ContextualTipBanner`) guidant l'exploration sur l'accueil et la galerie.
  - Option de réactivation ou de masquage global dans les paramètres système.

---

## [1.0.4] - 2026-10-10

### ✨ Ajouté
- **Support PWA (Progressive Web App)** complet :
  - Création du `manifest.json` avec identifiants W3C, mode `standalone`, orientation portrait et couleurs système.
  - Génération de l'emblème doré officiel PWA et des icônes vectorielles SVG (192×192 et 512×512 avec zone de sécurité maskable).
  - Création du `public/sw.js` pour la mise en cache hors-ligne et l'exécution sans connexion.
  - Métadonnées Apple Touch et balises plein écran dans `index.html`.
- **Bouton « Installation »** :
  - Ajout d'un bouton d'installation doré accessible directement depuis la barre supérieure (`TopAppBar`).
  - Section dédiée dans `ProfileScreen` avec présentation du mode autonome.
  - Modale d'installation `PwaInstallModal` avec gestion de l'événement natif `beforeinstallprompt` et instructions par plateforme (iOS Safari, Android Chrome, Desktop).
- **Documentation du Dépôt** :
  - Création de `README.md` complet avec captures d'écran haute définition de l'accueil et du mode Gigapixel, badges et guide d'installation.
  - Création de `CONTEXT.md` détaillant la philosophie curatoriale, l'esthétique nocturne et la souveraineté locale.
  - Création de `CHANGELOG.md` répertoriant l'historique des versions.

---

## [1.0.3] - 2026-10-10

### 🔄 Modifié & Amélioré
- **Interconnexion des Fiches Muséales** :
  - Rapprochement dynamique : le clic sur le nom de l'artiste ou sur le mouvement ouvre instantanément la notice détaillée correspondante.
  - Les éléments de la frise chronologique d'*Apprendre* ouvrent la notice historique du mouvement.
  - Les puces d'axes d'exploration de l'écran d'accueil pré-filtrent directement le catalogue d'*Explorer*.
- **Conformité & Accessibilité** :
  - Remplacement de tous les appels `window.alert` par des bannières toast in-app élégantes.
  - Application globale des préférences d'accessibilité (tailles de police standard/confort/grand, contraste renforcé et réduction des animations).

---

## [1.0.2] - 2026-10-10

### ✨ Ajouté
- **Notices Artistes & Mouvements** :
  - Création des modales `ArtistDetailModal` et `MovementDetailModal`.
  - Intégration des données biographiques, contextes historiques, citations majeures et liste des œuvres associées.
- **Enrichissement du Corpus de Chefs-d'œuvre** :
  - Ajout de la *Joconde* (Léonard de Vinci), de *La Vocation de saint Matthieu* (Le Caravage), de *La Grande Vague de Kanagawa* (Hokusai) et de *La Frise des Cerfs* (Grotte de Lascaux).

---

## [1.0.1] - 2026-10-10

### ✨ Ajouté
- **Visionneuse Gigapixel Ultra-HD** :
  - Niveaux de grossissement 1× à 4× avec tuilage haute résolution.
  - Grille géométrique du nombre d'or et analyse spectrale/thermique.
  - Nuancier de pigments avec copie immédiate des codes couleur.
- **Évaluation « Le Regard du Coloriste »** :
  - Étape finale du parcours pédagogique avec 5 questions à choix multiples, indices scientifiques dépliables et attribution du badge de conservateur.
- **Audio Guide Flottant Persistant** :
  - Lecteur audio universel avec visualisation d'ondes en direct.

---

## [1.0.0] - 2026-10-10

### 🎉 Lancement Initial
- Mise en place de l'application React 19, Vite et Tailwind CSS v4.
- Thème **Nocturne Curatorial** (`#141318`, `#f2ca50`, Playfair Display & Plus Jakarta Sans).
- Implémentation des 5 écrans fondamentaux : *Accueil*, *Explorer* (catalogue 840 toiles), *Apprendre* (parcours guidés), *Recherche FTS5* et *Ma Collection* (salons et export JSON chiffré).
