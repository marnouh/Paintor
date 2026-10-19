import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getConservationDossierForArtwork } from '../data/conservationDossiers.ts';

export const GigapixelInspectorScreen: React.FC = () => {
  const { goBack, selectedArtworkId, completeStep, addPoints, artworks } = useApp();

  const artwork =
    artworks.find((a) => a.id === selectedArtworkId) ||
    artworks.find((a) => a.id === 'cezanne-sainte-victoire') ||
    artworks[0];

  const conservationDossier = getConservationDossierForArtwork(
    artwork.id,
    artwork.title,
    artwork.artist,
    artwork.museum
  );

  // Canvas & Transformation state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const tileCacheRef = useRef<Map<string, HTMLCanvasElement>>(new Map());

  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Visual observation modes
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showTileGrid, setShowTileGrid] = useState<boolean>(false);
  const [opticalFilter, setOpticalFilter] = useState<'none' | 'infrared' | 'raking' | 'monochrome'>('none');
  const [activeTab, setActiveTab] = useState<'observation' | 'scientific' | 'pigments'>('observation');

  // Eyedropper / Pipette state
  const [isPipetteActive, setIsPipetteActive] = useState<boolean>(false);
  const [sampledColor, setSampledColor] = useState<{
    hex: string;
    rgb: string;
    luminance: number;
    matchingPigment?: string;
  } | null>(null);

  // Hotspots & Points
  const rawHotspots = artwork.hotspots && artwork.hotspots.length > 0
    ? artwork.hotspots
    : [
        {
          id: 1,
          x: 50,
          y: 35,
          badge: 'Composition & Rythme',
          title: 'Point d’Intérêt Central',
          description: artwork.openingText || "L'organisation spatiale concentre la tension dramatique et la distribution de la lumière.",
          image: artwork.imageUrl,
        },
        {
          id: 2,
          x: 30,
          y: 65,
          badge: 'Matière & Facture',
          title: 'Facture et Empâtement',
          description: artwork.firstObservation || "Travail de la pâte et superposition des couches picturales créant le modelé.",
          image: artwork.imageUrl,
        },
        {
          id: 3,
          x: 75,
          y: 70,
          badge: 'Atmosphère & Nuances',
          title: 'Transition Chromatique',
          description: "Gradation des valeurs de fond et harmonie des teintes complémentaires.",
          image: artwork.imageUrl,
        },
      ];

  const [activePointId, setActivePointId] = useState<number>(rawHotspots[0]?.id || 1);
  const currentHotspot = rawHotspots.find((p) => p.id === activePointId) || rawHotspots[0];

  // Completion & feedback
  const [hasValidated, setHasValidated] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Load image into memory with CORS
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = artwork.imageUrl;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      // Reset zoom and center
      setZoomLevel(1.0);
      setPan({ x: 0, y: 0 });
    };
    img.onerror = () => {
      // Fallback without crossOrigin if external restriction
      const fallbackImg = new Image();
      fallbackImg.src = artwork.imageUrl;
      fallbackImg.onload = () => {
        imageRef.current = fallbackImg;
        setImageLoaded(true);
      };
    };
  }, [artwork.imageUrl]);

  // Main canvas rendering engine
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Apply optical filters via context filter
    if (opticalFilter === 'infrared') {
      ctx.filter = 'grayscale(100%) contrast(150%) brightness(110%)';
    } else if (opticalFilter === 'raking') {
      ctx.filter = 'contrast(170%) brightness(95%) saturate(80%)';
    } else if (opticalFilter === 'monochrome') {
      ctx.filter = 'grayscale(100%) contrast(110%)';
    } else {
      ctx.filter = 'none';
    }

    // Calculate dimensions maintaining aspect ratio
    const imgAspect = img.width / img.height;
    const canvasAspect = width / height;

    let drawW: number;
    let drawH: number;

    if (canvasAspect > imgAspect) {
      drawH = height * 0.95;
      drawW = drawH * imgAspect;
    } else {
      drawW = width * 0.95;
      drawH = drawW / imgAspect;
    }

    // Apply scale and pan
    const scaledW = drawW * zoomLevel;
    const scaledH = drawH * zoomLevel;

    const centerX = width / 2 + pan.x;
    const centerY = height / 2 + pan.y;

    const destX = centerX - scaledW / 2;
    const destY = centerY - scaledH / 2;

    // Real Pyramidal Deep-Zoom Tile Engine
    // Determine pyramid level based on zoom
    let pyramidLevel = 0;
    let tileCols = 1;
    let tileRows = 1;

    if (zoomLevel > 4.5) {
      pyramidLevel = 3;
      tileCols = 8;
      tileRows = 8;
    } else if (zoomLevel > 2.2) {
      pyramidLevel = 2;
      tileCols = 4;
      tileRows = 4;
    } else if (zoomLevel > 1.2) {
      pyramidLevel = 1;
      tileCols = 2;
      tileRows = 2;
    }

    const tileW = scaledW / tileCols;
    const tileH = scaledH / tileRows;
    let renderedTilesCount = 0;

    if (pyramidLevel > 0) {
      // 1. Draw base overview layer first
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
      ctx.drawImage(img, destX, destY, scaledW, scaledH);

      // 2. Render real high-resolution pyramidal tile slices for visible sub-regions
      for (let c = 0; c < tileCols; c++) {
        for (let r = 0; r < tileRows; r++) {
          const tX = destX + c * tileW;
          const tY = destY + r * tileH;

          // Viewport intersection culling: only process and draw visible tiles
          if (tX + tileW < 0 || tX > width || tY + tileH < 0 || tY > height) {
            continue;
          }

          const tileKey = `${artwork.id}_L${pyramidLevel}_${c}_${r}_${opticalFilter}`;
          let tileCanvas = tileCacheRef.current.get(tileKey);

          if (!tileCanvas) {
            tileCanvas = document.createElement('canvas');
            tileCanvas.width = 512;
            tileCanvas.height = 512;
            const tCtx = tileCanvas.getContext('2d');
            if (tCtx) {
              const srcW = img.naturalWidth / tileCols;
              const srcH = img.naturalHeight / tileRows;
              const srcX = c * srcW;
              const srcY = r * srcH;

              if (opticalFilter === 'infrared') {
                tCtx.filter = 'grayscale(100%) contrast(150%) brightness(110%)';
              } else if (opticalFilter === 'raking') {
                tCtx.filter = 'contrast(170%) brightness(95%) saturate(80%)';
              } else if (opticalFilter === 'monochrome') {
                tCtx.filter = 'grayscale(100%) contrast(110%)';
              } else {
                tCtx.filter = 'none';
              }

              tCtx.imageSmoothingEnabled = true;
              tCtx.imageSmoothingQuality = 'high';
              tCtx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, 512, 512);
              tileCacheRef.current.set(tileKey, tileCanvas);
            }
          }

          if (tileCanvas) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(tileCanvas, tX, tY, tileW, tileH);
            renderedTilesCount++;
          }
        }
      }
    } else {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, destX, destY, scaledW, scaledH);
      renderedTilesCount = 1;
    }

    // Reset filter for vector overlays
    ctx.filter = 'none';

    // 1. Tiling Matrix Overlay (when activated)
    if (showTileGrid) {
      ctx.save();
      ctx.strokeStyle = 'rgba(242, 202, 80, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#f2ca50';

      for (let c = 0; c <= tileCols; c++) {
        const x = destX + c * tileW;
        ctx.beginPath();
        ctx.moveTo(x, destY);
        ctx.lineTo(x, destY + scaledH);
        ctx.stroke();
      }

      for (let r = 0; r <= tileRows; r++) {
        const y = destY + r * tileH;
        ctx.beginPath();
        ctx.moveTo(destX, y);
        ctx.lineTo(destX + scaledW, y);
        ctx.stroke();
      }

      // Draw real tile coordinate labels with resolution and level
      for (let c = 0; c < tileCols; c++) {
        for (let r = 0; r < tileRows; r++) {
          const tx = destX + c * tileW + 4;
          const ty = destY + r * tileH + 14;
          if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
            ctx.fillText(`L${pyramidLevel}[${c},${r}]`, tx, ty);
          }
        }
      }
      ctx.restore();
    }

    // 2. Golden Ratio & Composition Thirds Grid
    if (showGrid) {
      ctx.save();
      ctx.strokeStyle = 'rgba(242, 202, 80, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 4]);

      // Rule of thirds
      const x1 = destX + scaledW / 3;
      const x2 = destX + (2 * scaledW) / 3;
      const y1 = destY + scaledH / 3;
      const y2 = destY + (2 * scaledH) / 3;

      ctx.beginPath();
      ctx.moveTo(x1, destY);
      ctx.lineTo(x1, destY + scaledH);
      ctx.moveTo(x2, destY);
      ctx.lineTo(x2, destY + scaledH);
      ctx.moveTo(destX, y1);
      ctx.lineTo(destX + scaledW, y1);
      ctx.moveTo(destX, y2);
      ctx.lineTo(destX + scaledW, y2);
      ctx.stroke();

      // Golden intersection markers
      const phi = 0.618;
      const gx = destX + scaledW * phi;
      const gy = destY + scaledH * phi;
      ctx.setLineDash([]);
      ctx.fillStyle = '#f2ca50';
      ctx.beginPath();
      ctx.arc(gx, gy, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }, [pan, zoomLevel, opticalFilter, showGrid, showTileGrid]);

  // Resize canvas to parent container
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (container && canvas) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        renderCanvas();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  useEffect(() => {
    if (imageLoaded) {
      renderCanvas();
    }
  }, [imageLoaded, renderCanvas]);

  // Pan interaction handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPipetteActive) {
      samplePixelAt(e.clientX, e.clientY);
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPipetteActive) {
      samplePixelAt(e.clientX, e.clientY);
      return;
    }
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom centered on cursor
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoomLevel((prev) => {
      const next = Math.min(8.0, Math.max(1.0, prev * zoomFactor));
      return Math.round(next * 100) / 100;
    });
  };

  // Touch pan & pinch
  const touchStartRef = useRef<{ dist: number; x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (isPipetteActive) {
        samplePixelAt(touch.clientX, touch.clientY);
        return;
      }
      setIsDragging(true);
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = { dist, x: pan.x, y: pan.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && touchStartRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStartRef.current.dist;
      setZoomLevel((prev) => Math.min(8.0, Math.max(1.0, prev * ratio)));
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current = null;
  };

  // Eyedropper sampling logic
  const samplePixelAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(clientX - rect.left);
    const y = Math.floor(clientY - rect.top);

    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
      const rgb = `rgb(${r}, ${g}, ${b})`;
      const luminance = Math.round(((0.299 * r + 0.587 * g + 0.114 * b) / 255) * 100);

      // Match closest historical pigment from dossier
      let closestPigment: string | undefined;
      let minDiff = Infinity;
      for (const p of conservationDossier.pigmentsDocumented) {
        const pr = parseInt(p.hex.slice(1, 3), 16) || 0;
        const pg = parseInt(p.hex.slice(3, 5), 16) || 0;
        const pb = parseInt(p.hex.slice(5, 7), 16) || 0;
        const diff = Math.hypot(r - pr, g - pg, b - pb);
        if (diff < minDiff) {
          minDiff = diff;
          closestPigment = p.name;
        }
      }

      setSampledColor({ hex, rgb, luminance, matchingPigment: closestPigment });
    } catch (err) {
      console.warn('Canvas pixel read notice:', err);
    }
  };

  // Hotspot click: smooth pan & zoom to point
  const handleSelectHotspot = (pt: (typeof rawHotspots)[0]) => {
    setActivePointId(pt.id);
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    // Center canvas onto hotspot normalized coordinate
    const targetZoom = Math.max(2.5, zoomLevel);
    setZoomLevel(targetZoom);

    const normX = pt.x / 100 - 0.5;
    const normY = pt.y / 100 - 0.5;

    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;
    let baseW = canvas.width * 0.95;
    let baseH = baseW / imgAspect;
    if (canvasAspect > imgAspect) {
      baseH = canvas.height * 0.95;
      baseW = baseH * imgAspect;
    }

    setPan({
      x: -normX * baseW * targetZoom,
      y: -normY * baseH * targetZoom,
    });
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setShowToast(`Couleur ${hex} copiée !`);
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleValidateObservation = () => {
    if (!hasValidated) {
      completeStep(4);
      addPoints(50);
      setHasValidated(true);
      setShowToast('Observation macro validée ! +50 points');
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  // Convert hotspot normalized coord to current canvas pixels for overlays
  const getHotspotPixelPos = (pt: (typeof rawHotspots)[0]) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return { x: -1000, y: -1000 };

    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;
    let drawW: number;
    let drawH: number;
    if (canvasAspect > imgAspect) {
      drawH = canvas.height * 0.95;
      drawW = drawH * imgAspect;
    } else {
      drawW = canvas.width * 0.95;
      drawH = drawW / imgAspect;
    }

    const scaledW = drawW * zoomLevel;
    const scaledH = drawH * zoomLevel;
    const centerX = canvas.width / 2 + pan.x;
    const centerY = canvas.height / 2 + pan.y;
    const destX = centerX - scaledW / 2;
    const destY = centerY - scaledH / 2;

    return {
      x: destX + (pt.x / 100) * scaledW,
      y: destY + (pt.y / 100) * scaledH,
    };
  };

  return (
    <div className="min-h-screen bg-[#0e0e12] text-[#e5e1e8] flex flex-col font-body-md select-none overflow-x-hidden">
      
      {/* 1. TOP APP BAR : Titre honnête & Commandes d'observation */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-3 sm:px-4 h-14 bg-[#141318]/95 backdrop-blur-md border-b border-[#4d4635]/25">
        <div className="flex items-center gap-2 max-w-[65%]">
          <button
            onClick={goBack}
            aria-label="Retour au catalogue"
            className="flex items-center justify-center w-8 h-8 rounded text-[#d0c5af] hover:text-[#f2ca50] transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col truncate">
            <span className="font-label-caps text-[9px] text-[#f2ca50] tracking-wider uppercase truncate font-semibold">
              Loupe Macro Haute Définition • Observation de Détails
            </span>
            <h1 className="font-title-editorial text-[14px] sm:text-[15px] text-[#e5e1e8] font-semibold truncate leading-tight">
              {artwork.artist} — {artwork.title}
            </h1>
          </div>
        </div>

        {/* Observation Controls Toolbar */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Eyedropper Pipette Tool */}
          <button
            onClick={() => setIsPipetteActive(!isPipetteActive)}
            title={isPipetteActive ? 'Désactiver la pipette de prélèvement' : 'Activer la pipette pour prélever les couleurs réelles sur l’œuvre'}
            className={`flex items-center justify-center px-2 h-8 rounded border transition-colors cursor-pointer text-[11px] font-label-caps ${
              isPipetteActive
                ? 'bg-[#f2ca50] text-[#3c2f00] border-[#f2ca50] font-bold'
                : 'bg-[#1c1b20] text-[#d0c5af] border-[#4d4635]/30 hover:text-[#f2ca50]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px] mr-1">colorize</span>
            <span className="hidden sm:inline">Pipette</span>
          </button>

          {/* Golden Grid toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Grille de composition géométrique (Nombre d'or & Tiers)"
            className={`flex items-center justify-center w-8 h-8 rounded border transition-colors cursor-pointer ${
              showGrid
                ? 'bg-[#f2ca50] text-[#3c2f00] border-[#f2ca50]'
                : 'bg-[#1c1b20] text-[#d0c5af] border-[#4d4635]/30 hover:text-[#f2ca50]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">grid_goldenratio</span>
          </button>

          {/* Tiling matrix toggle */}
          <button
            onClick={() => setShowTileGrid(!showTileGrid)}
            title="Afficher la matrice de tuilage haute définition"
            className={`flex items-center justify-center w-8 h-8 rounded border transition-colors cursor-pointer ${
              showTileGrid
                ? 'bg-[#f2ca50] text-[#3c2f00] border-[#f2ca50]'
                : 'bg-[#1c1b20] text-[#d0c5af] border-[#4d4635]/30 hover:text-[#f2ca50]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">view_module</span>
          </button>

          {/* Zoom Multipliers */}
          <div className="flex items-center bg-[#1c1b20] rounded border border-[#4d4635]/30 p-0.5">
            {[1, 2, 4, 8].map((z) => (
              <button
                key={z}
                onClick={() => setZoomLevel(z)}
                className={`px-1.5 py-0.5 rounded text-[10.5px] font-mono cursor-pointer transition-colors ${
                  zoomLevel === z
                    ? 'bg-[#f2ca50] text-[#3c2f00] font-bold'
                    : 'text-[#d0c5af] hover:text-[#e5e1e8]'
                }`}
              >
                {z}×
              </button>
            ))}
          </div>

          {/* Reset View */}
          <button
            onClick={() => {
              setZoomLevel(1.0);
              setPan({ x: 0, y: 0 });
            }}
            title="Réinitialiser le cadrage"
            className="flex items-center justify-center w-8 h-8 rounded bg-[#1c1b20] text-[#d0c5af] hover:text-[#f2ca50] border border-[#4d4635]/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">center_focus_strong</span>
          </button>
        </nav>
      </header>

      {/* 2. ZONE PRINCIPALE : VÉRITABLE MOTEUR CANVAS DEEP-ZOOM */}
      <main className="relative w-full flex-1 pt-14 pb-[380px] md:pb-[310px] bg-[#0e0e12] flex items-center justify-center overflow-hidden">
        
        {/* Superior Indicator & Pipette Badge */}
        <aside className="absolute top-16 left-4 flex flex-col gap-1.5 z-20 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e0e12]/90 backdrop-blur-md border border-[#4d4635]/40 text-[#d0c5af] font-label-caps text-[11px] shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-pulse" />
            <span className="font-semibold text-[#f2ca50]">{zoomLevel}×</span>
            <span>• Moteur Canvas Deep-Zoom</span>
            <span className="text-[#99907c] hidden sm:inline">({artwork.dimensions})</span>
          </div>

          {/* Sampled Color Live Chip */}
          {sampledColor && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141318]/95 backdrop-blur-md border border-[#f2ca50]/50 text-[11px] font-mono shadow-2xl animate-fade-in pointer-events-auto">
              <span
                className="w-4 h-4 rounded-full border border-white/30 shadow-inner"
                style={{ backgroundColor: sampledColor.hex }}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[#f2ca50] font-bold">{sampledColor.hex}</span>
                  <span className="text-[#99907c] text-[10px]">{sampledColor.rgb}</span>
                  <button
                    onClick={() => handleCopyHex(sampledColor.hex)}
                    className="text-[#d0c5af] hover:text-white cursor-pointer"
                    title="Copier la valeur Hex"
                  >
                    <span className="material-symbols-outlined text-[13px]">content_copy</span>
                  </button>
                </div>
                {sampledColor.matchingPigment && (
                  <span className="text-[10px] text-[#d0c5af] font-body-sm">
                    Nuance proche : {sampledColor.matchingPigment}
                  </span>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Optical Filter Toolbar */}
        <div className="absolute top-16 right-4 z-20 flex items-center gap-1 bg-[#141318]/90 backdrop-blur-md p-1 rounded-xl border border-[#4d4635]/30 text-[10.5px] font-label-caps">
          <span className="text-[#99907c] px-1.5 hidden sm:inline">Filtres Optiques :</span>
          <button
            onClick={() => setOpticalFilter('none')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              opticalFilter === 'none'
                ? 'bg-[#f2ca50] text-[#3c2f00] font-bold'
                : 'text-[#d0c5af] hover:text-white'
            }`}
            title="Couleurs naturelles fidèles"
          >
            Naturel
          </button>
          <button
            onClick={() => setOpticalFilter('infrared')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              opticalFilter === 'infrared'
                ? 'bg-[#f2ca50] text-[#3c2f00] font-bold'
                : 'text-[#d0c5af] hover:text-white'
            }`}
            title="Simulation numérique du contraste de réflectographie infrarouge pour observer les repentirs"
          >
            Infrarouge (simulé)
          </button>
          <button
            onClick={() => setOpticalFilter('raking')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              opticalFilter === 'raking'
                ? 'bg-[#f2ca50] text-[#3c2f00] font-bold'
                : 'text-[#d0c5af] hover:text-white'
            }`}
            title="Rehaussement de contraste simulant la lumière rasante pour révéler empâtements et craquelures"
          >
            Lumière Rasante (relief)
          </button>
          <button
            onClick={() => setOpticalFilter('monochrome')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              opticalFilter === 'monochrome'
                ? 'bg-[#f2ca50] text-[#3c2f00] font-bold'
                : 'text-[#d0c5af] hover:text-white'
            }`}
            title="Analyse des valeurs de gris et clair-obscur sans distraction de couleur"
          >
            Monochrome
          </button>
        </div>

        {/* Note d'intégrité muséale sur les filtres optiques */}
        {opticalFilter !== 'none' && (
          <aside className="absolute top-28 right-4 z-20 max-w-xs sm:max-w-sm p-2.5 rounded-lg bg-[#141318]/95 backdrop-blur-md border border-[#f2ca50]/40 text-[10.5px] text-[#d0c5af] space-y-1 shadow-xl animate-fade-in pointer-events-auto">
            <div className="flex items-center gap-1.5 text-[#f2ca50] font-label-caps uppercase font-bold text-[10px]">
              <span className="material-symbols-outlined text-[14px]">science</span>
              <span>Avis d'intégrité muséale &amp; optique</span>
            </div>
            <p className="leading-snug">
              Ce filtre est un <strong className="text-[#e5e1e8]">effet visuel numérique</strong> de rehaussement de texture et de contrastes. En l'absence de données de laboratoire spectral (IRR ou UV du C2RMF), il ne révèle pas d'authentiques repentirs sous-jacents.
            </p>
          </aside>
        )}

        {/* Interactive Canvas Viewport */}
        <div
          ref={containerRef}
          className="relative w-full h-[520px] sm:h-[580px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`w-full h-full block touch-none ${
              isPipetteActive ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
            }`}
          />

          {/* Hotspots Rendered via Transformed Screen Coordinates */}
          {!isPipetteActive &&
            rawHotspots.map((pt) => {
              const pos = getHotspotPixelPos(pt);
              const isActive = pt.id === activePointId;

              // Hide if off-canvas
              if (
                pos.x < -20 ||
                pos.x > (containerRef.current?.clientWidth || 1000) + 20 ||
                pos.y < -20 ||
                pos.y > (containerRef.current?.clientHeight || 800) + 20
              ) {
                return null;
              }

              return (
                <div
                  key={pt.id}
                  onClick={() => handleSelectHotspot(pt)}
                  style={{ top: `${pos.y}px`, left: `${pos.x}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                  title={pt.title}
                >
                  <div className="relative flex items-center justify-center">
                    {isActive && (
                      <span className="hotspot-ring absolute w-9 h-9 rounded-full bg-[#f2ca50]/25 border border-[#f2ca50] animate-ping" />
                    )}
                    <div
                      className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shadow-lg border transition-transform ${
                        isActive
                          ? 'bg-[#f2ca50] text-[#3c2f00] border-[#3c2f00]/40 scale-110 ring-2 ring-[#f2ca50]/50'
                          : 'bg-[#201f24] text-[#e5e1e8] border-[#f2ca50]/40 hover:scale-105'
                      }`}
                    >
                      {pt.id}
                    </div>
                  </div>

                  {isActive && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-52 sm:w-60 bg-[#1c1b20]/95 backdrop-blur-md border border-[#f2ca50]/50 p-2.5 rounded-xl shadow-2xl transition-all pointer-events-none">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]" />
                        <span className="font-label-caps text-[9px] text-[#f2ca50] tracking-wider uppercase font-bold">
                          {pt.badge}
                        </span>
                      </div>
                      <p className="font-body-sm text-[11.5px] text-[#e5e1e8] font-semibold leading-tight">
                        {pt.title}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

          {/* RADAR MINIMAP DYNAMIQUE D'ORIENTATION */}
          <div className="absolute bottom-4 right-4 z-20 bg-[#0e0e12]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#4d4635]/40 shadow-2xl flex flex-col items-center">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = (e.clientX - rect.left) / rect.width - 0.5;
                const clickY = (e.clientY - rect.top) / rect.height - 0.5;
                const canvas = canvasRef.current;
                if (canvas) {
                  setPan({
                    x: -clickX * canvas.width * zoomLevel,
                    y: -clickY * canvas.height * zoomLevel,
                  });
                }
              }}
              className="relative w-28 h-20 bg-[#201f24] rounded-lg overflow-hidden border border-[#4d4635]/30 cursor-crosshair group"
              title="Cliquer pour centrer la loupe macro"
            >
              <img
                src={artwork.imageUrl}
                alt="Minimap"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
              {/* Radar viewport bounding box */}
              <div
                style={{
                  width: `${Math.max(15, 100 / zoomLevel)}%`,
                  height: `${Math.max(15, 100 / zoomLevel)}%`,
                  top: `${Math.max(0, Math.min(85, 50 - (pan.y / 200) - 50 / zoomLevel))}%`,
                  left: `${Math.max(0, Math.min(85, 50 - (pan.x / 200) - 50 / zoomLevel))}%`,
                }}
                className="absolute border-2 border-[#f2ca50] bg-[#f2ca50]/20 shadow-[0_0_10px_rgba(242,202,80,0.5)] transition-all pointer-events-none"
              />
            </div>
            <div className="flex items-center justify-between w-full px-1 text-[9px] font-label-caps text-[#99907c] mt-1">
              <span>Radar Macro</span>
              <span className="text-[#f2ca50] font-mono">{zoomLevel}×</span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. PANNEAU INFÉRIEUR MULTI-ONGLETS SOURCÉ & HONNÊTE */}
      <section className="fixed bottom-0 left-0 w-full z-40 bg-[#1c1b20]/98 backdrop-blur-xl border-t border-[#4d4635]/30 rounded-t-2xl shadow-2xl flex flex-col">
        {/* Barre de préhension */}
        <div className="w-full flex items-center justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#4d4635]/60" />
        </div>

        <div className="px-4 sm:px-6 pb-4 max-w-4xl mx-auto w-full flex flex-col gap-3">
          
          {/* Navigation par Onglets */}
          <div className="flex items-center justify-between border-b border-[#4d4635]/20 pb-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('observation')}
                className={`px-3 py-1.5 rounded-lg font-label-caps text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'observation'
                    ? 'bg-[#f2ca50] text-[#3c2f00] shadow-sm'
                    : 'bg-[#201f24] text-[#d0c5af] hover:text-white border border-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">zoom_in</span>
                <span>Points d'Observation</span>
              </button>

              <button
                onClick={() => setActiveTab('scientific')}
                className={`px-3 py-1.5 rounded-lg font-label-caps text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'scientific'
                    ? 'bg-[#f2ca50] text-[#3c2f00] shadow-sm'
                    : 'bg-[#201f24] text-[#d0c5af] hover:text-white border border-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">science</span>
                <span>Dossier Scientifique (Sourcé)</span>
              </button>

              <button
                onClick={() => setActiveTab('pigments')}
                className={`px-3 py-1.5 rounded-lg font-label-caps text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'pigments'
                    ? 'bg-[#f2ca50] text-[#3c2f00] shadow-sm'
                    : 'bg-[#201f24] text-[#d0c5af] hover:text-white border border-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">palette</span>
                <span>Pigments Historiques</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[#f2ca50] font-label-caps text-[11px]">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>{artwork.museum}</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ONGLET 1 : POINTS D'OBSERVATION MACRO DYNAMIQUES DE L'ŒUVRE               */}
          {/* ========================================================================= */}
          {activeTab === 'observation' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
              <div className="md:col-span-8 flex flex-col gap-1.5">
                {/* Selector pill buttons for points */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {rawHotspots.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => handleSelectHotspot(pt)}
                      className={`px-2.5 py-1 rounded-md font-label-caps text-[10.5px] font-semibold transition-all cursor-pointer ${
                        activePointId === pt.id
                          ? 'bg-[#f2ca50] text-[#3c2f00]'
                          : 'bg-[#201f24] text-[#d0c5af] hover:text-white border border-white/5'
                      }`}
                    >
                      Point {pt.id} : {pt.badge}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30 font-label-caps text-[9.5px] uppercase font-bold">
                    {currentHotspot.badge}
                  </span>
                  <span className="text-[#99907c] text-xs font-mono">• {artwork.dateDisplay}</span>
                </div>

                <h2 className="font-headline-sm text-[16px] text-[#e5e1e8] font-semibold leading-tight">
                  {currentHotspot.title}
                </h2>
                <p className="font-body-sm text-[12.5px] text-[#d0c5af] leading-relaxed">
                  {currentHotspot.description}
                </p>

                <div className="text-[11px] text-[#99907c] flex items-center gap-1 pt-1">
                  <span className="material-symbols-outlined text-[14px] text-[#f2ca50]">info</span>
                  <span>Cliquez sur l'œuvre avec la pipette pour analyser les couleurs exactes en direct.</span>
                </div>
              </div>

              {/* Validation Action */}
              <div className="md:col-span-4 flex flex-col gap-2 bg-[#201f24] p-3 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-[11px] font-label-caps text-[#d0c5af]">
                  <span>Statut d'observation :</span>
                  <span className={hasValidated ? 'text-emerald-400 font-bold' : 'text-[#f2ca50]'}>
                    {hasValidated ? 'Validée' : 'À valider'}
                  </span>
                </div>

                <button
                  onClick={handleValidateObservation}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all active:scale-95 shadow-md cursor-pointer ${
                    hasValidated
                      ? 'bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/50'
                      : 'bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[17px]">
                      {hasValidated ? 'verified' : 'check_circle'}
                    </span>
                    <span className="font-label-md text-[12.5px] font-bold tracking-wide">
                      {hasValidated ? 'Observation Validée !' : "Valider l'observation"}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-label-caps text-[10px] font-bold ${
                      hasValidated ? 'bg-[#f2ca50]/20 text-[#f2ca50]' : 'bg-[#3c2f00] text-[#f2ca50]'
                    }`}
                  >
                    +50 pts
                  </span>
                </button>

                <div className="flex items-center justify-center gap-1 text-[9.5px] font-label-caps text-[#99907c] text-center">
                  <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">analytics</span>
                  <span>Moteur Canvas multi-échelles avec pixel reading</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ONGLET 2 : DOSSIER SCIENTIFIQUE & SOURCES CONSERVATOIRE SOURCÉES           */}
          {/* ========================================================================= */}
          {activeTab === 'scientific' && (
            <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scroll pr-1">
              <div className="p-3 bg-[#141318] rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">account_balance</span>
                    Laboratoire de Référence : {conservationDossier.laboratory}
                  </span>
                  <span className="text-[#99907c] text-[10px] font-mono">
                    {conservationDossier.laboratoryCity} • {conservationDossier.yearPublished}
                  </span>
                </div>

                <h3 className="text-[13px] font-semibold text-white">
                  {conservationDossier.studyTitle}
                </h3>
                <p className="text-[11px] text-[#99907c]">
                  Chercheurs & Conservateurs responsables : {conservationDossier.leadResearchers}
                </p>

                {/* Méthodes d'imagerie authentifiées */}
                <div className="pt-1.5 border-t border-white/5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-label-caps text-[#f2ca50] uppercase font-semibold">
                    Techniques d'examen :
                  </span>
                  {conservationDossier.imagingMethods.map((m, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-[#201f24] border border-white/10 text-[10px] text-[#d0c5af] font-mono"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Découvertes majeures */}
              <div className="p-3 bg-[#201f24] rounded-xl border border-white/5 space-y-1.5">
                <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">fact_check</span>
                  Constats de Laboratoire & Repentirs Authentifiés
                </span>
                <ul className="space-y-1 text-[11.5px] text-[#d0c5af]">
                  {conservationDossier.keyDiscoveries.map((disc, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#f2ca50] font-bold mt-0.5">•</span>
                      <span>{disc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notice méthodologique honnête */}
              <div className="p-2.5 rounded-lg bg-[#2b292f]/60 border border-[#f2ca50]/20 text-[10.5px] text-[#d0c5af] leading-relaxed">
                <span className="text-[#f2ca50] font-semibold block mb-0.5">
                  Notice d'intégrité méthodologique :
                </span>
                Les filtres optiques (infrarouge, relief rasante) proposés dans cette application sont des simulations numériques conçues pour l’éducation du regard. Les résultats d'analyses physiques ci-dessus proviennent des publications et rapports de conservation des musées et laboratoires mentionnés.
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ONGLET 3 : PIGMENTS HISTORIQUES & PIPETTE DE PRÉLÈVEMENT EN DIRECT        */}
          {/* ========================================================================= */}
          {activeTab === 'pigments' && (
            <div className="space-y-2 max-h-56 overflow-y-auto custom-scroll pr-1">
              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase font-bold">
                  Palette Historique & Stratigraphie Chimique
                </span>
                <span className="text-[10px] text-[#99907c]">
                  Support : {conservationDossier.substrateAndLayering}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {conservationDossier.pigmentsDocumented.map((pigment, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#201f24] border border-white/5 flex items-start gap-2.5 hover:border-[#f2ca50]/40 transition-colors"
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-md mt-0.5"
                      style={{ backgroundColor: pigment.hex }}
                    />
                    <div className="flex-1 min-w-0 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white truncate">{pigment.name}</span>
                        <button
                          onClick={() => handleCopyHex(pigment.hex)}
                          className="text-[#f2ca50] font-mono text-[10px] hover:underline cursor-pointer"
                        >
                          {pigment.hex}
                        </button>
                      </div>
                      {pigment.formula && (
                        <div className="text-[9.5px] text-[#99907c] font-mono">{pigment.formula}</div>
                      )}
                      <p className="text-[10.5px] text-[#d0c5af] mt-0.5 leading-snug">
                        {pigment.historicalNote}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Toast Feedback */}
      {showToast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#f2ca50] text-[#3c2f00] font-label-caps text-[11px] font-bold rounded-full shadow-2xl animate-fade-in border border-[#3c2f00]/30">
          {showToast}
        </div>
      )}
    </div>
  );
};
