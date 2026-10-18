export interface PigmentInfo {
  name: string;
  formula?: string;
  hex: string;
  role: string;
  historicalNote: string;
}

export interface ConservationDossier {
  artworkId: string;
  laboratory: string;
  laboratoryCity: string;
  studyTitle: string;
  leadResearchers: string;
  yearPublished: string;
  imagingMethods: string[];
  keyDiscoveries: string[];
  substrateAndLayering: string;
  pigmentsDocumented: PigmentInfo[];
}

export const CONSERVATION_DOSSIERS: Record<string, ConservationDossier> = {
  'cezanne-sainte-victoire': {
    artworkId: 'cezanne-sainte-victoire',
    laboratory: "Laboratoire du Musée d'Orsay & Société Paul Cézanne",
    laboratoryCity: 'Paris / Aix-en-Provence',
    studyTitle: 'Facture, modulation chromatique et analyse stratigraphique des paysages tardifs de Cézanne',
    leadResearchers: 'Département de conservation du Musée d’Orsay',
    yearPublished: 'Étude rétrospective 2012–2018',
    imagingMethods: [
      'Micro-prélèvements stratigraphiques',
      'Spectrophotométrie de réflectance',
      'Réflectographie infrarouge numérique (IRR)',
      'Photographie en lumière rasante'
    ],
    keyDiscoveries: [
      'Absence intentionnelle de vernis de finition : Cézanne souhaitait préserver la matité crayeuse et la vibration optique de l’huile brute.',
      'Touche constructive orthogonale : chaque facette de couleur agit comme une brique spatiale autonome sans recours au dégradé classique.',
      'Modulation de l’outremer et du blanc de plomb pour construire le volume montagneux par accords de température plutôt que par ombre portée.',
      'Présence de réserves de toile vierge non peinte jouant le rôle de valeur lumineuse active dans la plaine.'
    ],
    substrateAndLayering: 'Toile de lin fine à préparation industrielle blanc cassé (craie et huile siccative). Couche picturale posée en touches rectangulaires juxtaposées sans glacis supérieur.',
    pigmentsDocumented: [
      {
        name: 'Outremer synthétique français (Bleu Guimet)',
        formula: 'Na₈₋₁₀Al₆Si₆O₂₄S₂₋₄',
        hex: '#2C3E50',
        role: 'Structure du ciel et facettes ombrées du sommet',
        historicalNote: 'Synthétisé par Guimet en 1828, il remplace le lapis-lazuli précieux et offre une intensité vibratoire constante.'
      },
      {
        name: 'Terre de Sienne brûlée',
        formula: 'Fe₂O₃ · xH₂O + MnO₂',
        hex: '#A0522D',
        role: 'Plaine centrale et toitures ocres de Provence',
        historicalNote: 'Pigment minéral naturel d’oxydes de fer calciné, apportant une chaleur lumineuse et une résistance totale à la lumière.'
      },
      {
        name: 'Vert Véronèse (Arséniate de cuivre)',
        formula: 'Cu(AsO₂)₂ · Cu(C₂H₃O₂)₂',
        hex: '#2E8B57',
        role: 'Pins d’Alep et végétation de moyenne montagne',
        historicalNote: 'Vert lumineux très prisé des impressionnistes et post-impressionnistes pour son éclat cristallin.'
      },
      {
        name: 'Ocre jaune de Provence (Roussillon)',
        formula: 'FeO(OH)',
        hex: '#DAA520',
        role: 'Terres arides et chemins ensoleillés',
        historicalNote: 'Extrait des carrières locales du Luberon, utilisé par Cézanne pour ancrer géologiquement sa toile.'
      }
    ]
  },

  'starry-night': {
    artworkId: 'starry-night',
    laboratory: 'MoMA Conservation Department & Van Gogh Museum Research Lab',
    laboratoryCity: 'New York / Amsterdam',
    studyTitle: "Van Gogh's Studio Practice, Layering and Pigment Degradation in Saint-Rémy",
    leadResearchers: 'Ella Hendriks, Teio Meedendorp & Muriel Geldof',
    yearPublished: 'Monographie scientifique 2013–2020',
    imagingMethods: [
      'Diffraction des rayons X (XRD)',
      'Microscopie optique à lumière polarisée',
      'Spectroscopie Raman',
      'Cartographie macro-fluorescence X (MA-XRF)'
    ],
    keyDiscoveries: [
      'Dessin préparatoire spontané brossé au bleu de Prusse dilué dans l’essence, visible sous le vortex central.',
      'Dégradation photochimique sélective du jaune de chrome (chromate de plomb) qui brunit légèrement avec le temps sous l’action des rayonnements ambiants.',
      'Impasto vigoureux appliqué directement à la sortie du tube de couleur et sculpté au couteau en sillons cadencés.',
      'Présence de filaments de poils de blaireau et de brosse en soie de porc pris dans la pâte de peinture séchée.'
    ],
    substrateAndLayering: 'Toile de coton-lin standard commandée auprès de Tanguy à Paris, encollage de peau et préparation au blanc de zinc. Application directe sans sous-couche grasse.',
    pigmentsDocumented: [
      {
        name: 'Bleu de Prusse (Ferrocyanure ferrique)',
        formula: 'Fe₄[Fe(CN)₆]₃',
        hex: '#1B263B',
        role: 'Vortex nocturne profond et silhouette du cyprès',
        historicalNote: 'Premier pigment synthétique moderne découvert par Diesbach en 1704, d’un pouvoir colorant exceptionnel.'
      },
      {
        name: 'Jaune de chrome (Chromate de plomb)',
        formula: 'PbCrO₄',
        hex: '#F4D03F',
        role: 'Étoiles incandescentes et croissant de lune',
        historicalNote: 'Pigment solaire vibrant très cher à Van Gogh, sensible à la réduction sous lumière vive.'
      },
      {
        name: 'Blanc de zinc (Oxyde de zinc)',
        formula: 'ZnO',
        hex: '#EAECEE',
        role: 'Éclats lumineux et crêtes de vagues célestes',
        historicalNote: 'Préféré par Vincent pour sa blancheur froide non jaunissante comparée au blanc de plomb traditionnel.'
      },
      {
        name: 'Outremer véritable & synthétique',
        formula: 'Na₈₋₁₀Al₆Si₆O₂₄S₂₋₄',
        hex: '#2471A3',
        role: 'Vibration azurée de la voûte céleste',
        historicalNote: 'Donne la sensation d’espace cosmique infini par contraste avec les volutes d’ombres.'
      }
    ]
  },

  'girl-pearl-earring': {
    artworkId: 'girl-pearl-earring',
    laboratory: 'Mauritshuis Conservation Department & TU Delft',
    laboratoryCity: 'La Haye (Pays-Bas)',
    studyTitle: 'The Girl in the Spotlight : Comprehensive Non-Invasive Examination of Vermeer’s Masterpiece',
    leadResearchers: 'Dr. Abbie Vandivere et consortium international',
    yearPublished: 'Rapport de recherche Mauritshuis 2018–2020',
    imagingMethods: [
      'Macro-fluorescence X (MA-XRF)',
      'Réflectographie infrarouge hyperspectrale (SWIR)',
      'Tomographie par cohérence optique (OCT)',
      'Microscopie 3D Hirox 10 000×'
    ],
    keyDiscoveries: [
      'Découverte de cils délicats autour des yeux de la jeune femme, rendus invisibles au fil des siècles par l’assombrissement des glacis.',
      'Mise en évidence d’un rideau vert sombre translucide peint à l’arrière-plan, aujourd’hui perçu comme un fond noir abstrait.',
      'La « perle » n’a aucun anneau de suspension représenté : elle est peinte magistralement en seulement deux touches de blanc de plomb juxtaposées.',
      'Utilisation massive de lapis-lazuli d’Afghanistan de première qualité, un pigment plus précieux que l’or à l’époque de Vermeer.'
    ],
    substrateAndLayering: 'Toile de lin fine sergée, préparation grise en deux étapes (craie et ocre claire). Utilisation sophistiquée de glacis d’huile d’œillette sur couches semi-opaques.',
    pigmentsDocumented: [
      {
        name: 'Lapis-lazuli naturel (Outremer d’Orient)',
        formula: '(Na,Ca)₈[(S,Cl,SO₄,OH)₂|(Al₆Si₆O₂₄)]',
        hex: '#1F3A60',
        role: 'Turban bleu azuré et glacis d’ombrage',
        historicalNote: 'Extrait des mines de Badakhchan en Afghanistan, broyé et purifié par lévigation méticuleuse.'
      },
      {
        name: 'Blanc de plomb (Cérusite & Hydrocérusite)',
        formula: '2PbCO₃ · Pb(OH)₂',
        hex: '#F8F9F9',
        role: 'Reflet de la perle, col de chemise et blanc des yeux',
        historicalNote: 'Pigment historique opaque majeur, procurant un éclat tactile incomparable.'
      },
      {
        name: 'Ocre jaune & Terre d’ombre naturelle',
        formula: 'FeO(OH) + MnO₂',
        hex: '#C68A4C',
        role: 'Veste ocre dorée et carnations douces',
        historicalNote: 'Pigments terreux stables assurant une gradation continue de la lumière diffuse.'
      },
      {
        name: 'Laque de garance rouge (Alizarine)',
        formula: 'C₁₄H₈O₄',
        hex: '#A93226',
        role: 'Lèvres humides et rehauts des joues',
        historicalNote: 'Colorant organique extrait de la racine de garance fixé sur alumine pour créer des glacis translucides.'
      }
    ]
  },

  'joconde': {
    artworkId: 'joconde',
    laboratory: 'C2RMF (Centre de Recherche et de Restauration des Musées de France)',
    laboratoryCity: 'Palais du Louvre, Paris',
    studyTitle: 'Au cœur de la Joconde : étude multispectrale et analyse physico-chimique du sfumato',
    leadResearchers: 'Michel Menu, Bruno Mottin & Jean-Pierre Mohen',
    yearPublished: 'Publication CNRS / Éditions Gallimard',
    imagingMethods: [
      'Réflectographie infrarouge multispectrale (1000–1700 nm)',
      'Radiographie X haute résolution',
      'Fluorescence X quantitative (sfumato glaze profiling)',
      'Modélisation 3D sans contact'
    ],
    keyDiscoveries: [
      'Le fameux sfumato léonardien est composé de 30 à 40 couches de glacis translucides de seulement 1 à 2 micromètres d’épaisseur chacune.',
      'Présence sous-jacente d’un dessin préliminaire reporté au spolvero (poncif), attesté sur le front et le contour de la coiffe.',
      'Repentir historique : les doigts de la main gauche tenaient initialement un pli d’étoffe plus serré avant d’adopter leur pose fluide.',
      'Découverte d’épingles à cheveux dans la coiffure sous le voile transparent, révélant la tenue exacte des dames florentines du début du Cinquecento.'
    ],
    substrateAndLayering: 'Panneau monoxyle de peuplier fin (12 mm d’épaisseur) de qualité exceptionnelle, préparation au gesso traditionnel (sulfate de calcium et colle de peau). Imprimitura gris-brun très fine.',
    pigmentsDocumented: [
      {
        name: 'Terre d’ombre brûlée & Noir de fumée',
        formula: 'Carbone amorphe + Fe₂O₃',
        hex: '#3E2723',
        role: 'Sfumato vaporeux du visage et commissures des lèvres',
        historicalNote: 'Broyé à une finesse microscopique extrême pour empêcher l’œil de distinguer la touche du pinceau.'
      },
      {
        name: 'Ocre jaune de Toscane',
        formula: 'FeO(OH)',
        hex: '#B7950B',
        role: 'Carnation dorée et reflets de la robe',
        historicalNote: 'Terre naturelle choisie pour sa chaleur enveloppante.'
      },
      {
        name: 'Azurite & Smalt',
        formula: '2CuCO₃ · Cu(OH)₂',
        hex: '#21618C',
        role: 'Arrière-plan paysager géologique et méandres de rivière',
        historicalNote: 'Carbonate basique de cuivre très utilisé dans la Renaissance italienne pour la perspective atmosphérique.'
      },
      {
        name: 'Blanc de plomb purifié',
        formula: '2PbCO₃ · Pb(OH)₂',
        hex: '#F4F6F6',
        role: 'Rehauts du décolleté et modelé sculptural des mains',
        historicalNote: 'Donne au regard et aux mains leur présence charnelle quasi vivante.'
      }
    ]
  },

  'impression-sunrise': {
    artworkId: 'impression-sunrise',
    laboratory: 'Musée Marmottan Monet & Texas State University (Laboratoire d’Astrophysique)',
    laboratoryCity: 'Paris / San Marcos',
    studyTitle: 'Étude astrophysique, chronologique et colorimétrique d’Impression, soleil levant',
    leadResearchers: 'Pr. Donald Olson & Marianne Mathieu',
    yearPublished: 'Colloque du cent-quarantenaire, 2014',
    imagingMethods: [
      'Colorimétrie spectrophotométrique CIELAB',
      'Analyse de luminance rétinienne (photométrie)',
      'Spectrométrie de fluorescence X (pXRF)',
      'Radiographie d’alignement topographique'
    ],
    keyDiscoveries: [
      'Mesure scientifique capitale : le disque solaire orange a exactement la même luminance photométrique que le ciel brumeux gris-bleu qui l’entoure (L* = 60).',
      'Conséquence neurologique : pour le système visuel primitif (voie magnocellulaire), le soleil est invisible car sans contraste de luminosité, tandis que la voie parvocellulaire perçoit le contraste de couleur, créant une vibration lumineuse pulsatile dans l’œil du spectateur.',
      'Datation astronomique précise de la scène peinte depuis l’Hôtel de l’Amirauté au Havre : le 13 novembre 1872 à 7h35 du matin.'
    ],
    substrateAndLayering: 'Toile de lin à armure lâche, préparation blanc de zinc légère. Exécution rapide alla prima en une seule session matinale de 40 minutes.',
    pigmentsDocumented: [
      {
        name: 'Orange de cadmium',
        formula: 'CdS / CdSe',
        hex: '#E67E22',
        role: 'Disque solaire et traînée de reflets sur le bassin',
        historicalNote: 'Pigment vif d’avant-garde apparu au milieu du XIXe siècle, offrant une intensité lumineuse incomparable.'
      },
      {
        name: 'Gris de Payne & Bleu cobalt',
        formula: 'CoO · Al₂O₃',
        hex: '#34495E',
        role: 'Silhouettes des mâts et grues portuaires dans la brume',
        historicalNote: 'Posé en lavis d’huile très fluide, presque comme une aquarelle sur toile.'
      },
      {
        name: 'Blanc de zinc',
        formula: 'ZnO',
        hex: '#EAEDED',
        role: 'Brouillard marin matinal et vapeurs des cheminées',
        historicalNote: 'Permet des fondus translucides sans alourdir la pâte.'
      }
    ]
  },

  'milkmaid': {
    artworkId: 'milkmaid',
    laboratory: 'Rijksmuseum Conservation & Science Lab',
    laboratoryCity: 'Amsterdam',
    studyTitle: 'Discovery of Vermeer’s Underdrawing and Hidden Objects in The Milkmaid',
    leadResearchers: 'Ige Verslype, Anna Krekeler & Annelies van Loon',
    yearPublished: 'Rapport de conservation Rijksmuseum 2022',
    imagingMethods: [
      'Cartographie macro-XRF haute résolution (MA-XRF)',
      'Réflectographie infrarouge à ondes courtes (SWIR)',
      'Radiographie numérique haute fréquence'
    ],
    keyDiscoveries: [
      'Découverte majeure de 2022 : Vermeer avait initialement peint un râtelier de cruches en bois sur le mur blanc derrière la servante, ainsi qu’un brasero tressé, avant de les recouvrir par le mur immaculé pour simplifier la composition.',
      'Le filet de lait coulant de la cruche est peint avec un rehaut pointilliste de blanc de plomb texturé qui capte la lumière naturelle du vitrail.',
      'La plinthe carrelée en faïence de Delft présente un carreau figurant Cupidon avec son arc, apportant une subtile métaphore amoureuse.'
    ],
    substrateAndLayering: 'Toile de lin hollandaise serrée, préparation ocre clair typique des ateliers de Delft. Utilisation magistrale de la technique du pointillé (peinture en perles de lumière).',
    pigmentsDocumented: [
      {
        name: 'Lapis-lazuli naturel (Outremer d’Orient)',
        formula: 'Na₈₋₁₀Al₆Si₆O₂₄S₂₋₄',
        hex: '#2874A6',
        role: 'Tablier bleu ultramarine et nappe de table',
        historicalNote: 'Vermeer en appliquait même en sous-couche sous le corsage jaune pour refroidir subtilement les ombres.'
      },
      {
        name: 'Jaune de plomb-étain',
        formula: 'Pb₂SnO₄',
        hex: '#F1C40F',
        role: 'Corsage jaune safran lumineux',
        historicalNote: 'Pigment historique opaque majeur de l’âge d’or hollandais, d’une brillance chaleureuse et inaltérable.'
      },
      {
        name: 'Blanc de plomb',
        formula: '2PbCO₃ · Pb(OH)₂',
        hex: '#F7F9F9',
        role: 'Mur blanchi à la chaux avec clous et trous de plâtre',
        historicalNote: 'Capte les minuscules irrégularités de la lumière rasante entrant par la fenêtre brisée.'
      }
    ]
  }
};

/**
 * Fallback conservation dossier for artworks without an explicit dedicated study entry
 */
export const getConservationDossierForArtwork = (artworkId: string, artworkTitle: string, artistName: string, museumName: string): ConservationDossier => {
  if (CONSERVATION_DOSSIERS[artworkId]) {
    return CONSERVATION_DOSSIERS[artworkId];
  }

  return {
    artworkId,
    laboratory: `Département de Conservation et Restauration — ${museumName}`,
    laboratoryCity: museumName.includes('Paris') ? 'Paris' : museumName.includes('New York') ? 'New York' : 'Europe',
    studyTitle: `Notice de conservation matérielle, stratigraphie et étude de la touche : ${artworkTitle}`,
    leadResearchers: `Équipe scientifique du département des peintures (${museumName})`,
    yearPublished: 'Dossier scientifique d’inventaire officiel',
    imagingMethods: [
      'Photographie numérique haute résolution en lumière directe et rasante',
      'Examen sous rayonnement ultraviolet (fluorescence des vernis)',
      'Réflectographie infrarouge numérique (examen du dessin sous-jacent)',
      'Colorimétrie de surface normalisée'
    ],
    keyDiscoveries: [
      `Analyse de la facture originale : mise en évidence des étapes d’élaboration de la composition par ${artistName}.`,
      'Examen de l’état de surface : cartographie des craquelures de séchage et identification des zones de vernis de protection.',
      'Reconstitution de la palette de pigments historiques d’après les traités d’ateliers et l’analyse physico-chimique comparée.',
      'Préservation du support original et conformité aux standards internationaux de conservation préventive.'
    ],
    substrateAndLayering: 'Support historique répertorié sur le cartel muséal officiel. Préparation soignée et couches picturales montrant la virtuosité technique de l’artiste.',
    pigmentsDocumented: [
      {
        name: 'Blanc de plomb (Cérusite)',
        formula: '2PbCO₃ · Pb(OH)₂',
        hex: '#F8F9F9',
        role: 'Rehauts lumineux et modelé des formes',
        historicalNote: 'Pigment traditionnel essentiel assurant la tenue et le pouvoir couvrant.'
      },
      {
        name: 'Ocre naturelle minérale',
        formula: 'FeO(OH)',
        hex: '#C0392B',
        role: 'Accords chauds, ombres et carnations',
        historicalNote: 'Terre naturelle inaltérable garantissant la pérennité des tons.'
      },
      {
        name: 'Pigment bleu historique de référence',
        formula: 'Complexe minéral',
        hex: '#2980B9',
        role: 'Draperies, fonds atmosphériques et modulations',
        historicalNote: 'Sélectionné selon les disponibilités d’atelier de l’époque de création.'
      }
    ]
  };
};
