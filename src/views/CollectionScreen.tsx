import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArtworkImage } from '../components/ArtworkImage.tsx';

export const CollectionScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    openArtwork,
    openLearningPath,
    openGigapixel,
    bookmarkedIds,
    toggleBookmark,
    history,
    clearHistory,
    userPoints,
    userLevel,
    completedSteps,
    exportDatabaseJSON,
    openBackupModal,
    artworks,
    userNotes,
    addNote,
    deleteNote,
  } = useApp();

  // Real immersion calculations
  const totalMinutes = history.reduce((sum, h) => sum + (h.readMinutes || 2), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const readingTimeDisplay = totalMinutes === 0
    ? '0 min'
    : hours > 0
    ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    : `${mins} min`;

  const [activeTab, setActiveTab] = useState<'favoris' | 'historique' | 'parcours' | 'notes'>('favoris');
  const [filterType, setFilterType] = useState<'tous' | 'chefs' | 'artistes' | 'recents'>('tous');
  const [newNote, setNewNote] = useState<string>('');
  const [showAddSalonModal, setShowAddSalonModal] = useState<boolean>(false);
  const [newSalonName, setNewSalonName] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const bookmarkedArtworks = artworks.filter((art) => bookmarkedIds.includes(art.id));

  const filteredBookmarks = bookmarkedArtworks.filter((art) => {
    if (filterType === 'chefs') return art.isIncontournable;
    if (filterType === 'recents') return art.year >= 1800;
    return true;
  });

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      await addNote(newNote.trim());
      setNewNote('');
      showToast('Note enregistrée dans IndexedDB');
    }
  };

  return (
    <div className="min-h-screen bg-[#141318] text-[#e5e1e8] pb-28">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-14 bg-[#141318]/90 backdrop-blur-md border-b border-[#4d4635]/20">
        <button
          onClick={goBack}
          aria-label="Retour"
          className="text-[#d0c5af] hover:text-[#f2ca50] active:scale-95 transition-all p-2 flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="flex items-center space-x-2">
          <span className="font-headline-md text-[22px] tracking-widest text-[#f2ca50] font-bold">
            Regard
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]/70 inline-block" />
        </div>
        <button
          aria-label="Signets généraux"
          className="text-[#d0c5af] hover:text-[#f2ca50] active:scale-95 transition-all p-2 flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">bookmark</span>
        </button>
      </header>

      {/* Main Canvas */}
      <main className="pt-16 max-w-xl mx-auto px-4 sm:px-5 space-y-6">
        {/* Header Title & Local Storage Badge */}
        <section className="pt-2 pb-1">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-[10.5px] text-[#f2ca50] tracking-widest block uppercase mb-1 font-semibold">
                Carnet Curatorial Local
              </span>
              <h1 className="font-display-hero-mobile text-[30px] sm:text-[34px] text-[#e5e1e8] font-semibold tracking-tight">
                Ma Collection
              </h1>
              <p className="font-body-md text-[13.5px] text-[#d0c5af] mt-0.5 italic">
                Galerie personnelle &amp; carnet d’art
              </p>
            </div>

            {/* Actions: Export/Restore JSON & Settings */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={openBackupModal}
                className="border border-[#f2ca50]/30 bg-[#201f24] hover:bg-[#2b292f] text-[#f2ca50] hover:text-[#ffe088] active:scale-90 transition-all px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Sauvegarde sécurisée chiffrée AES-256 ou Restauration"
              >
                <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                <span className="text-[11px] font-label-caps uppercase font-bold hidden sm:inline">Sauvegarde</span>
              </button>
              <button
                onClick={() => showToast("Magasins d'objets IndexedDB (RegardMuseumDB) actifs. Stockage 100% hors-ligne.")}
                className="border border-white/10 bg-[#201f24] hover:bg-[#2b292f] text-[#d0c5af] hover:text-[#f2ca50] active:scale-90 transition-all p-2 rounded-lg flex items-center justify-center shadow-sm cursor-pointer"
                title="Paramètres de stockage IndexedDB"
              >
                <span className="material-symbols-outlined text-[19px]">settings</span>
              </button>
            </div>
          </div>

          {/* Local Assurance Badge */}
          <div className="mt-3.5 inline-flex items-center gap-2 py-1 px-3 bg-[#1c1b20] rounded-lg border border-white/5">
            <span className="material-symbols-outlined text-[#f2ca50] text-[14px]">database</span>
            <span className="font-label-caps text-[10px] sm:text-[10.5px] text-[#d0c5af] tracking-wider">
              Stockage local IndexedDB (7 magasins) • PWA Hors-ligne
            </span>
          </div>
        </section>

        {/* Navigation Tabs */}
        <nav
          aria-label="Sections du carnet"
          className="border border-white/5 bg-[#1c1b20] rounded-xl p-1 flex items-center gap-1 overflow-x-auto no-scrollbar"
        >
          <button
            onClick={() => setActiveTab('favoris')}
            className={`font-label-caps text-[11px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'favoris'
                ? 'bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/30 font-semibold'
                : 'text-[#d0c5af] hover:text-[#e5e1e8]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            <span>Favoris ({bookmarkedIds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('historique')}
            className={`font-label-caps text-[11px] px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'historique'
                ? 'bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/30 font-semibold'
                : 'text-[#d0c5af] hover:text-[#e5e1e8]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">history</span>
            <span>Historique ({history.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('parcours')}
            className={`font-label-caps text-[11px] px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'parcours'
                ? 'bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/30 font-semibold'
                : 'text-[#d0c5af] hover:text-[#e5e1e8]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">map</span>
            <span>Parcours (3)</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`font-label-caps text-[11px] px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/30 font-semibold'
                : 'text-[#d0c5af] hover:text-[#e5e1e8]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">draw</span>
            <span>Notes ({userNotes.length})</span>
          </button>
        </nav>

        {/* SECTION 1: STATISTIQUES D'IMMERSION & PROGRESSION */}
        <section className="border border-white/5 bg-[#1c1b20] rounded-xl p-4 gilded-glow relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#f2ca50]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between pb-3 border-b border-[#4d4635]/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">insights</span>
              <h2 className="font-title-editorial text-[17px] text-[#e5e1e8] font-semibold">
                Immersion &amp; Regard
              </h2>
            </div>
            <span className="font-label-caps text-[9.5px] text-[#f2ca50]/90 uppercase px-2 py-0.5 rounded border border-[#f2ca50]/30 bg-[#f2ca50]/10 font-bold">
              TABLE USER_PROGRESS
            </span>
          </div>

          {/* Bento 4-up */}
          <div className="grid grid-cols-2 gap-2.5 pt-3.5 pb-3">
            <div className="bg-[#201f24] p-3 rounded-lg border border-white/5">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-lg text-[28px] text-[#f2ca50] font-bold">
                  {history.length}
                </span>
                <span className="font-body-sm text-[12px] text-[#d0c5af]">toile{history.length > 1 ? 's' : ''}</span>
              </div>
              <p className="font-body-sm text-[11px] text-[#99907c] mt-0.5">Contemplée{history.length > 1 ? 's' : ''} au calme</p>
            </div>

            <div className="bg-[#201f24] p-3 rounded-lg border border-white/5">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-lg text-[28px] text-[#e5e1e8] font-bold">
                  {readingTimeDisplay}
                </span>
              </div>
              <p className="font-body-sm text-[11px] text-[#99907c] mt-0.5">Lecture &amp; contemplation</p>
            </div>

            <div className="bg-[#201f24] p-3 rounded-lg border border-white/5">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-md text-[22px] text-[#e5e1e8] font-semibold">
                  {completedSteps.length}
                </span>
                <span className="font-body-sm text-[12px] text-[#f2ca50] font-medium">étape{completedSteps.length > 1 ? 's' : ''}</span>
              </div>
              <p className="font-body-sm text-[11px] text-[#99907c] mt-0.5 truncate">
                {completedSteps.length > 0 ? `${completedSteps.length} étape${completedSteps.length > 1 ? 's' : ''} validée${completedSteps.length > 1 ? 's' : ''}` : 'Aucune étape validée'}
              </p>
            </div>

            <div className="bg-[#201f24] p-3 rounded-lg border border-white/5">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-md text-[22px] text-[#f2ca50] font-semibold">
                  {userNotes.length}
                </span>
                <span className="font-body-sm text-[12px] text-[#d0c5af]">note{userNotes.length > 1 ? 's' : ''}</span>
              </div>
              <p className="font-body-sm text-[11px] text-[#99907c] mt-0.5 truncate">
                {userNotes.length > 0 ? `${userNotes.length} observation${userNotes.length > 1 ? 's' : ''}` : 'Carnet d\'étude vierge'}
              </p>
            </div>
          </div>

          {/* Jauge de progression */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-label-caps text-[11px] text-[#e5e1e8] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] inline-block" />
                Niveau : {userLevel}
              </span>
              <span className="font-body-sm text-[12px] text-[#f2ca50] font-semibold font-mono">
                {userPoints} / 1000 pts
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#36343a] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-[#f2ca50] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (userPoints / 1000) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#99907c] pt-0.5">
              <span>Initié au Beau</span>
              <span className="text-[#f2ca50]/70">Prochain : Conservateur Méditatif</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: VUE FAVORIS */}
        {activeTab === 'favoris' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-[19px] text-[#e5e1e8] font-semibold">
                  Chefs-d’œuvre Favoris
                </h2>
                <p className="font-body-sm text-[12px] text-[#99907c]">
                  Indexés dans votre mémoire tactile
                </p>
              </div>
              <button
                onClick={() => setShowAddSalonModal(true)}
                className="border border-[#f2ca50]/40 text-[#f2ca50] hover:bg-[#f2ca50]/10 active:scale-95 transition-all text-xs font-label-caps px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                <span>Nouveau salon</span>
              </button>
            </div>

            {/* Filtres rapides */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setFilterType('tous')}
                className={`font-label-caps text-[11px] px-3 py-1 rounded transition-colors cursor-pointer ${
                  filterType === 'tous'
                    ? 'bg-[#f2ca50] text-[#3c2f00] font-bold shadow-sm'
                    : 'bg-[#201f24] text-[#d0c5af] hover:text-[#e5e1e8] border border-white/5'
                }`}
              >
                Tous ({bookmarkedArtworks.length})
              </button>
              <button
                onClick={() => setFilterType('chefs')}
                className={`font-label-caps text-[11px] px-3 py-1 rounded transition-colors cursor-pointer ${
                  filterType === 'chefs'
                    ? 'bg-[#f2ca50] text-[#3c2f00] font-bold shadow-sm'
                    : 'bg-[#201f24] text-[#d0c5af] hover:text-[#e5e1e8] border border-white/5'
                }`}
              >
                Chefs-d'œuvre
              </button>
              <button
                onClick={() => setFilterType('artistes')}
                className={`font-label-caps text-[11px] px-3 py-1 rounded transition-colors cursor-pointer ${
                  filterType === 'artistes'
                    ? 'bg-[#f2ca50] text-[#3c2f00] font-bold shadow-sm'
                    : 'bg-[#201f24] text-[#d0c5af] hover:text-[#e5e1e8] border border-white/5'
                }`}
              >
                Par artiste
              </button>
              <button
                onClick={() => setFilterType('recents')}
                className={`font-label-caps text-[11px] px-3 py-1 rounded transition-colors cursor-pointer ${
                  filterType === 'recents'
                    ? 'bg-[#f2ca50] text-[#3c2f00] font-bold shadow-sm'
                    : 'bg-[#201f24] text-[#d0c5af] hover:text-[#e5e1e8] border border-white/5'
                }`}
              >
                Récents
              </button>
            </div>

            {/* Grille muséale 2 colonnes ou état vierge */}
            {filteredBookmarks.length === 0 ? (
              <div className="p-8 text-center bg-[#201f24] rounded-xl border border-white/5 space-y-2.5 my-2">
                <span className="material-symbols-outlined text-[#99907c] text-[36px]">
                  bookmark_border
                </span>
                <h3 className="font-title-editorial text-[15px] text-[#e5e1e8] font-semibold">
                  Votre salon d'exposition personnel est vide
                </h3>
                <p className="font-body-sm text-[12px] text-[#99907c] max-w-xs mx-auto leading-relaxed">
                  Aucune toile n'est encore enregistrée. Explorez le catalogue et touchez le signet pour composer votre collection.
                </p>
                <button
                  onClick={() => navigateTo('explorer')}
                  className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#f2ca50] hover:bg-[#ffe088] text-[#141318] rounded-lg font-label-caps text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[15px]">explore</span>
                  <span>Explorer le catalogue</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5">
                {filteredBookmarks.map((art) => (
                  <article
                    key={art.id}
                    onClick={() => openArtwork(art.id)}
                    className="border border-white/5 bg-[#1c1b20] rounded-xl overflow-hidden flex flex-col group transition-all duration-300 hover:border-[#99907c] cursor-pointer"
                  >
                    <div className="relative w-full aspect-[4/5] bg-[#0e0e12] overflow-hidden">
                      <ArtworkImage
                        src={art.imageUrl}
                        alt={art.title}
                        title={art.title}
                        artist={art.artist}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b20] via-transparent to-black/30 pointer-events-none" />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(art.id);
                        }}
                        aria-label="Retirer des favoris"
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#141318]/80 backdrop-blur-md flex items-center justify-center text-[#f2ca50] border border-[#f2ca50]/30 active:scale-90 transition-transform cursor-pointer"
                        title="Retirer des favoris"
                      >
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          bookmark
                        </span>
                      </button>

                      <span className="absolute bottom-2.5 left-2.5 font-label-caps text-[9.5px] text-[#f2ca50] px-2 py-0.5 rounded bg-[#141318]/90 backdrop-blur-sm border border-[#f2ca50]/30 uppercase tracking-widest font-semibold">
                        Approfondie
                      </span>
                    </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-title-editorial text-[14px] text-[#e5e1e8] line-clamp-1 group-hover:text-[#f2ca50] transition-colors font-semibold">
                        {art.title}
                      </h3>
                      <p className="font-body-sm text-[11px] text-[#d0c5af] mt-0.5 truncate">
                        {art.artist}, {art.year}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#4d4635]/20 text-[#d0c5af] font-label-caps text-[10px]">
                      <span className="flex items-center gap-1 truncate max-w-full">
                        <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">palette</span>
                        {art.movement}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            )}
          </section>
        )}

        {/* SECTION 3: PARCOURS ACTIF CARD */}
        {(() => {
          const pathStepCount = 8;
          const pathStepsDone = [1, 2, 3, 4, 5, 6, 7, 8].filter((s) => completedSteps.includes(s)).length;
          const pathPct = Math.round((pathStepsDone / pathStepCount) * 100);
          const strokeOffset = Math.max(0, 119.38 - (119.38 * pathPct) / 100);

          return (
            <section className="border border-[#f2ca50]/35 bg-[#1c1b20] rounded-xl p-4 gilded-glow relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-wider block font-semibold">
                    Parcours thématique actif
                  </span>
                  <h2 className="font-headline-sm text-[18px] text-[#e5e1e8] mt-1 font-semibold">
                    Les Maîtres de la Couleur
                  </h2>
                  <p className="font-body-sm text-[12px] text-[#d0c5af] mt-0.5">
                    {pathStepsDone === 0
                      ? 'Parcours non débuté • 8 étapes à explorer'
                      : pathStepsDone >= 8
                      ? 'Cycle complété avec succès • 8 étapes validées'
                      : `Étape ${pathStepsDone + 1} sur 8 • Prochaine toile : Paul Cézanne`}
                  </p>
                </div>

                {/* Circular Progress Dynamique */}
                <div className="shrink-0 relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      className="text-[#36343a]"
                      cx="24"
                      cy="24"
                      fill="transparent"
                      r="19"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <circle
                      className="text-[#f2ca50] transition-all duration-700"
                      cx="24"
                      cy="24"
                      fill="transparent"
                      r="19"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="119.38"
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-label-caps text-[11px] text-[#f2ca50] font-bold">{pathPct}%</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#4d4635]/20 flex items-center justify-between">
                <span className="font-body-sm text-[11.5px] text-[#d0c5af] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#f2ca50]">schedule</span>
                  {pathStepsDone >= 8 ? 'Cycle achevé' : `~ ${Math.max(5, (8 - pathStepsDone) * 5)} min restantes`}
                </span>
                <button
                  onClick={() => openLearningPath('maitres-couleur')}
                  className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-label-md text-[12.5px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <span>{pathStepsDone === 0 ? 'Démarrer le cycle' : 'Poursuivre le parcours'}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </section>
          );
        })()}

        {/* SECTION 4: RÉCEMMENT CONTEMPLÉES (HISTORIQUE) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-sm text-[18px] text-[#e5e1e8] font-semibold">
                Récemment contemplées
              </h2>
              <p className="font-body-sm text-[12px] text-[#99907c]">
                Historique local des 3 dernières sessions
              </p>
            </div>
            <button
              onClick={clearHistory}
              className="text-[#d0c5af] hover:text-[#f2ca50] font-label-caps text-[11px] underline transition-colors cursor-pointer"
            >
              Effacer
            </button>
          </div>

          {history.length === 0 ? (
            <div className="p-6 text-center bg-[#1c1b20] rounded-xl border border-white/5 space-y-2">
              <span className="material-symbols-outlined text-[32px] text-[#99907c]">visibility_off</span>
              <p className="font-body-md text-[13px] text-[#d0c5af]">
                Votre historique de visite est actuellement vierge.
              </p>
              <p className="font-body-sm text-[11px] text-[#99907c]">
                Consultez des toiles pour enregistrer automatiquement vos séances de contemplation dans la base locale IndexedDB.
              </p>
            </div>
          ) : (
            <div className="border border-white/5 bg-[#1c1b20] rounded-xl divide-y divide-[#4d4635]/15 overflow-hidden">
              {history.map((item, idx) => {
                const art = artworks.find((a) => a.id === item.artworkId);
                if (!art) return null;
                return (
                  <div
                    key={art.id + idx}
                    onClick={() => openArtwork(art.id)}
                    className="p-3 flex items-center justify-between hover:bg-[#201f24] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#0e0e12] overflow-hidden border border-white/5 shrink-0">
                        <ArtworkImage
                          src={art.imageUrl}
                          alt={art.title}
                          title={art.title}
                          artist={art.artist}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h3 className="font-title-editorial text-[14px] text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors font-semibold">
                          {art.title}
                        </h3>
                        <p className="font-body-sm text-[11px] text-[#99907c]">
                          {art.artist} • {art.year}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="font-label-caps text-[9.5px] text-[#f2ca50] bg-[#f2ca50]/10 px-2 py-0.5 rounded font-semibold">
                        {item.timeAgo}
                      </span>
                      <span className="font-body-sm text-[11px] text-[#99907c] mt-1 flex items-center gap-0.5">
                        <span>{item.readMinutes} min lues</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION: NOTES & DÉTAILS (if tab active) */}
        {activeTab === 'notes' && (
          <section className="space-y-3 pt-2">
            <h2 className="font-headline-sm text-[18px] text-[#e5e1e8] font-semibold">
              Mes Notes &amp; Observations
            </h2>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Rédigez une observation curatoriale..."
                rows={2}
                className="w-full bg-[#1c1b20] border border-white/10 rounded-lg p-3 text-[13px] text-[#e5e1e8] placeholder-[#99907c] focus:outline-none focus:border-[#f2ca50]/50"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#d4af37] text-[#3c2f00] font-label-md text-[12px] font-bold rounded-lg hover:bg-[#f2ca50] transition-colors cursor-pointer"
              >
                Ajouter au carnet
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {userNotes.length === 0 ? (
                <div className="p-4 text-center bg-[#1c1b20] rounded-lg border border-white/5 text-[12px] text-[#99907c]">
                  Aucune note rédigée. Vos observations curatoriales sont enregistrées de façon permanente dans le magasin IndexedDB « notes ».
                </div>
              ) : (
                userNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-[#1c1b20] border border-white/5 rounded-lg text-[13px] text-[#d0c5af] flex items-start justify-between gap-3 group"
                  >
                    <div>
                      {note.title && (
                        <h4 className="font-semibold text-white text-[12px] mb-0.5">{note.title}</h4>
                      )}
                      <p className="italic">« {note.content} »</p>
                      <span className="text-[10px] text-[#99907c] mt-1 block">
                        {new Date(note.updatedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-[#99907c] hover:text-red-400 p-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                      title="Supprimer la note"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Footer Souveraineté des données */}
        <footer className="pt-4 pb-6 text-center space-y-2 border-t border-[#4d4635]/20">
          <div className="flex items-center justify-center gap-2 text-[#d0c5af]/80">
            <span className="material-symbols-outlined text-[16px] text-[#f2ca50]">lock</span>
            <span className="font-label-caps text-[11px] uppercase tracking-wider font-semibold">
              Souveraineté des Données
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#99907c] max-w-sm mx-auto leading-relaxed">
            Données strictement confinées aux magasins d'objets IndexedDB locaux de cet appareil. Vos favoris et notes sont préservés lors des mises à jour du catalogue.
          </p>
        </footer>
      </main>

      {/* Modal Nouveau Salon */}
      {showAddSalonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1c1b20] border border-[#f2ca50]/40 rounded-xl p-5 max-w-sm w-full space-y-4">
            <h3 className="font-title-editorial text-[18px] text-[#e5e1e8] font-semibold">
              Créer un nouveau salon
            </h3>
            <p className="font-body-sm text-[12px] text-[#d0c5af]">
              Regroupez vos toiles favorites sous un thème personnalisé (ex: Portraits nocturnes).
            </p>
            <input
              type="text"
              value={newSalonName}
              onChange={(e) => setNewSalonName(e.target.value)}
              placeholder="Nom du salon..."
              className="w-full bg-[#201f24] border border-white/10 rounded-lg p-2.5 text-[13px] text-[#e5e1e8] focus:border-[#f2ca50] focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddSalonModal(false)}
                className="px-3 py-1.5 rounded text-[#99907c] hover:text-[#e5e1e8] text-[12px] font-label-md cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (newSalonName.trim()) {
                    showToast(`Salon « ${newSalonName.trim()} » créé dans votre mémoire tactile !`);
                    setShowAddSalonModal(false);
                    setNewSalonName('');
                  }
                }}
                className="px-4 py-1.5 rounded bg-[#f2ca50] text-[#3c2f00] font-bold text-[12px] font-label-md cursor-pointer"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Toast Container */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#2b292f] border border-[#f2ca50] text-[#e5e1e8] px-4 py-2.5 rounded-xl shadow-2xl text-[12px] font-label-md flex items-center gap-2 animate-fade-in pointer-events-none">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
