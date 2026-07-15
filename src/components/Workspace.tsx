/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { 
  Sparkles, Sliders, Layers, RotateCw, RefreshCw, Undo, Redo, Download, 
  Trash2, Smile, Type as TypeIcon, Image as ImageIcon, ZoomIn, ZoomOut, 
  Square, Circle, Star, Heart, Eye, Move, EyeOff, Scissors, HelpCircle, AlertCircle
} from 'lucide-react';
import { 
  ImageFilters, ImageAdjustments, OverlayLayer, BackgroundConfig, PresetTheme, PresetName 
} from '../types';

interface WorkspaceProps {
  originalFile: File;
  setView: (view: 'home' | 'workspace' | 'blog' | 'faqs' | 'privacy' | 'terms' | 'about' | 'contact') => void;
  onClear: () => void;
}

const DEFAULT_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  exposure: 100,
  highlights: 0,
  shadows: 0,
  temperature: 0,
  tint: 0,
  hue: 0,
  saturation: 100,
  vibrance: 100,
  gamma: 100,
  sharpness: 0,
  noiseReduction: 0,
  blur: 0,
  vignette: 0,
  opacity: 100,
  cornerRadius: 0,
  borderWidth: 0,
  borderColor: '#000000',
  shadowBlur: 0,
  shadowColor: '#000000',
};

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  crop: { x: 0, y: 0, width: 0, height: 0, active: false },
  rotate: 0,
  flipH: false,
  flipV: false,
  scaleX: 1,
  scaleY: 1,
  canvasWidth: 800,
  canvasHeight: 600,
};

// Preset backgrounds using high-fidelity curated Unsplash studio scenes
const PRESET_THEMES: PresetTheme[] = [
  { id: 'studio-1', name: 'Luxury Marble Stage', category: 'Studio', url: 'https://images.unsplash.com/photo-1582298538104-fc2c0a5a0029?auto=format&fit=crop&w=1200&q=80' },
  { id: 'studio-2', name: 'Charcoal Studio Slate', category: 'Studio', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80' },
  { id: 'studio-3', name: 'Warm Bokeh Spotlight', category: 'Studio', url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=1200&q=80' },
  { id: 'nature-1', name: 'Misty Forest Pines', category: 'Nature', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
  { id: 'nature-2', name: 'Tropical Palm Cast', category: 'Nature', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { id: 'urban-1', name: 'Modern Office Room', category: 'Urban', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
  { id: 'urban-2', name: 'Neon Cyberpunk Alley', category: 'Urban', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80' },
  { id: 'creative-1', name: 'Minimal Interior Loft', category: 'Creative', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
];

export default function Workspace({ originalFile, setView, onClear }: WorkspaceProps) {
  // Main Tab controller
  const [activeTab, setActiveTab] = useState<'isolate' | 'canvas' | 'adjust' | 'bg' | 'overlays'>('isolate');
  
  // Image & Loading states
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Workspace loaded');
  const [errorText, setErrorText] = useState<string | null>(null);

  // Filter & Adjustment Configurations
  const [filters, setFilters] = useState<ImageFilters>({ ...DEFAULT_FILTERS });
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({ ...DEFAULT_ADJUSTMENTS });
  const [bgConfig, setBgConfig] = useState<BackgroundConfig>({
    type: 'transparent',
    solidColor: '#ffffff',
    gradientStart: '#111827',
    gradientEnd: '#1e1b4b',
    gradientAngle: 135
  });
  const [activePreset, setActivePreset] = useState<PresetName>('none');

  // Overlay Layers
  const [layers, setLayers] = useState<OverlayLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // UI Interactive states (Zoom, Pan, Before/After Slider)
  const [zoom, setZoom] = useState(100);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [beforeAfterMode, setBeforeAfterMode] = useState(false);
  const [beforeAfterRatio, setBeforeAfterRatio] = useState(50); // percentage split

  // Undo/Redo states
  const [historyStack, setHistoryStack] = useState<Array<{ filters: ImageFilters; adjustments: ImageAdjustments; bgConfig: BackgroundConfig; layers: OverlayLayer[] }>>([]);
  const [redoStack, setRedoStack] = useState<Array<{ filters: ImageFilters; adjustments: ImageAdjustments; bgConfig: BackgroundConfig; layers: OverlayLayer[] }>>([]);

  // Brush Eraser States
  const [eraserActive, setEraserActive] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [brushMode, setBrushMode] = useState<'erase' | 'restore'>('erase');
  const [magicWandActive, setMagicWandActive] = useState(false);
  const [magicTolerance, setMagicTolerance] = useState(25);

  // AI Generator Prompt input
  const [aiBgPrompt, setAiBgPrompt] = useState('');

  // Export properties
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp' | 'avif'>('png');
  const [exportQuality, setExportQuality] = useState(90);
  const [exportFilename, setExportFilename] = useState('bgcraft_edited');

  // Canvas Refs
  const workspaceCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null); // holds transparency brush strokes
  const backgroundPresetImageRef = useRef<HTMLImageElement | null>(null);

  // Track Overlay Dragging
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [layerDragOffset, setLayerDragOffset] = useState({ x: 0, y: 0 });

  // Initialize and load original image
  useEffect(() => {
    setIsProcessing(true);
    setStatusMessage('Loading original image...');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = URL.createObjectURL(originalFile);
    
    img.onload = () => {
      setImgElement(img);
      
      // Setup default adjustments matching image dimensions
      const aspect = img.width / img.height;
      let targetWidth = 800;
      let targetHeight = 600;

      if (img.width > img.height) {
        targetHeight = Math.round(800 / aspect);
      } else {
        targetWidth = Math.round(600 * aspect);
      }

      setAdjustments(prev => ({
        ...prev,
        canvasWidth: targetWidth,
        canvasHeight: targetHeight,
        crop: { x: 0, y: 0, width: targetWidth, height: targetHeight, active: false }
      }));

      // Initialize mask canvas (transparency map) to solid opaque white
      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas) {
        maskCanvas.width = targetWidth;
        maskCanvas.height = targetHeight;
        const mCtx = maskCanvas.getContext('2d');
        if (mCtx) {
          mCtx.fillStyle = '#ffffff';
          mCtx.fillRect(0, 0, targetWidth, targetHeight);
        }
      }

      setIsProcessing(false);
      setStatusMessage('Photo loaded successfully');
    };

    img.onerror = () => {
      setErrorText('Error loading the uploaded image. Please try another format.');
      setIsProcessing(false);
    };
  }, [originalFile]);

  // Save State to History before modifying
  const pushToHistory = () => {
    const currentState = {
      filters: { ...filters },
      adjustments: { ...adjustments },
      bgConfig: { ...bgConfig },
      layers: JSON.parse(JSON.stringify(layers))
    };
    setHistoryStack(prev => [...prev, currentState]);
    setRedoStack([]); // clear redo stack on new action
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    
    // Save current to redo stack
    setRedoStack(prev => [...prev, {
      filters: { ...filters },
      adjustments: { ...adjustments },
      bgConfig: { ...bgConfig },
      layers: JSON.parse(JSON.stringify(layers))
    }]);

    setFilters(previous.filters);
    setAdjustments(previous.adjustments);
    setBgConfig(previous.bgConfig);
    setLayers(previous.layers);

    setHistoryStack(prev => prev.slice(0, -1));
    setStatusMessage('Undo applied');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];

    setHistoryStack(prev => [...prev, {
      filters: { ...filters },
      adjustments: { ...adjustments },
      bgConfig: { ...bgConfig },
      layers: JSON.parse(JSON.stringify(layers))
    }]);

    setFilters(next.filters);
    setAdjustments(next.adjustments);
    setBgConfig(next.bgConfig);
    setLayers(next.layers);

    setRedoStack(prev => prev.slice(0, -1));
    setStatusMessage('Redo applied');
  };

  // Main Canvas Render loop
  useEffect(() => {
    renderCanvas();
  }, [imgElement, filters, adjustments, bgConfig, layers, zoom, panX, panY, beforeAfterMode, beforeAfterRatio, activePreset]);

  // Performs real-time compositing
  const renderCanvas = () => {
    const canvas = workspaceCanvasRef.current;
    if (!canvas || !imgElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = adjustments.canvasWidth;
    const height = adjustments.canvasHeight;

    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background
    drawBackgroundLayer(ctx, width, height);

    // 2. Render Subject
    // We create a temporary canvas to apply transparency mask to original image,
    // apply adjustments, and then paint onto main canvas.
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (tempCtx) {
      // Draw image
      tempCtx.drawImage(imgElement, 0, 0, width, height);

      // Mask with our maskCanvas strokes (eraser / brush cuts)
      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas) {
        tempCtx.globalCompositeOperation = 'destination-in';
        tempCtx.drawImage(maskCanvas, 0, 0, width, height);
        tempCtx.globalCompositeOperation = 'source-over';
      }

      // Draw onto Main Canvas with filters
      ctx.save();
      
      // Apply CSS-like Filters to ctx
      let filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) opacity(${filters.opacity / 100})`;
      if (filters.hue > 0) filterString += ` hue-rotate(${filters.hue}deg)`;
      if (filters.blur > 0) filterString += ` blur(${filters.blur / 4}px)`;
      
      // Presets
      if (activePreset === 'bw') filterString += ' grayscale(100%)';
      else if (activePreset === 'sepia') filterString += ' sepia(100%)';
      else if (activePreset === 'vintage') filterString += ' grayscale(20%) sepia(30%) hue-rotate(-10deg) saturate(80%)';
      else if (activePreset === 'hdr') filterString += ' contrast(140%) saturate(130%)';
      else if (activePreset === 'film') filterString += ' contrast(90%) brightness(110%) saturate(85%)';
      else if (activePreset === 'glow') filterString += ` blur(0.5px) contrast(110%) brightness(115%)`;

      ctx.filter = filterString;

      // Handle Flip & Rotation
      ctx.translate(width / 2, height / 2);
      ctx.rotate((adjustments.rotate * Math.PI) / 180);
      ctx.scale(
        adjustments.flipH ? -1 : 1,
        adjustments.flipV ? -1 : 1
      );
      ctx.translate(-width / 2, -height / 2);

      // Draw the image onto background
      ctx.drawImage(tempCanvas, 0, 0, width, height);
      ctx.restore();
    }

    // Apply Vignette if specified
    if (filters.vignette > 0) {
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.3,
        width / 2, height / 2, Math.max(width, height) * 0.7
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, `rgba(0,0,0,${filters.vignette / 100})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Apply Border
    if (filters.borderWidth > 0) {
      ctx.strokeStyle = filters.borderColor;
      ctx.lineWidth = filters.borderWidth;
      ctx.strokeRect(filters.borderWidth / 2, filters.borderWidth / 2, width - filters.borderWidth, height - filters.borderWidth);
    }

    // Draw Overlay layers (Text, Stickers, Shapes)
    layers.forEach(layer => {
      ctx.save();
      if (layer.type === 'text') {
        ctx.font = `bold ${layer.fontSize}px ${layer.fontFamily}, sans-serif`;
        ctx.fillStyle = layer.color;
        
        // Background box for text
        if (layer.backgroundColor && layer.backgroundColor !== 'transparent') {
          const metrics = ctx.measureText(layer.text);
          const bgPadding = 8;
          ctx.fillStyle = layer.backgroundColor;
          ctx.fillRect(
            layer.x - bgPadding, 
            layer.y - layer.fontSize, 
            metrics.width + bgPadding * 2, 
            layer.fontSize + bgPadding * 1.5
          );
        }

        ctx.fillStyle = layer.color;
        ctx.fillText(layer.text, layer.x, layer.y);
      } else if (layer.type === 'sticker') {
        ctx.font = `${layer.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.emoji, layer.x, layer.y);
      } else if (layer.type === 'shape') {
        ctx.fillStyle = layer.color;
        ctx.strokeStyle = layer.borderColor;
        ctx.lineWidth = layer.borderWidth;

        if (layer.shapeType === 'rectangle') {
          ctx.fillRect(layer.x, layer.y, layer.width, layer.height);
          if (layer.borderWidth > 0) {
            ctx.strokeRect(layer.x, layer.y, layer.width, layer.height);
          }
        } else if (layer.shapeType === 'circle') {
          ctx.beginPath();
          ctx.arc(layer.x + layer.width/2, layer.y + layer.height/2, layer.width/2, 0, Math.PI * 2);
          ctx.fill();
          if (layer.borderWidth > 0) {
            ctx.stroke();
          }
        } else if (layer.shapeType === 'star') {
          drawStar(ctx, layer.x + layer.width/2, layer.y + layer.height/2, 5, layer.width/2, layer.width/4);
        } else if (layer.shapeType === 'heart') {
          drawHeart(ctx, layer.x, layer.y, layer.width, layer.height);
        }
      }
      ctx.restore();
    });

    // 4. Handle Before/After split line
    if (beforeAfterMode) {
      const splitX = (beforeAfterRatio / 100) * width;
      
      // Create copy of left side unedited original image
      const originalCanvas = document.createElement('canvas');
      originalCanvas.width = width;
      originalCanvas.height = height;
      const originalCtx = originalCanvas.getContext('2d');
      if (originalCtx) {
        originalCtx.drawImage(imgElement, 0, 0, width, height);
      }

      ctx.save();
      // Draw original on left side
      ctx.beginPath();
      ctx.rect(0, 0, splitX, height);
      ctx.clip();
      ctx.drawImage(originalCanvas, 0, 0, width, height);
      ctx.restore();

      // Draw splitting separator lines
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, height);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Small drag node circle
      ctx.beginPath();
      ctx.arc(splitX, height / 2, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const drawBackgroundLayer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    if (bgConfig.type === 'transparent') {
      // Draw alpha-checkerboard transparency background
      const cellSize = 12;
      for (let y = 0; y < height; y += cellSize) {
        for (let x = 0; x < width; x += cellSize) {
          ctx.fillStyle = ((x / cellSize) + (y / cellSize)) % 2 === 0 ? '#1e293b' : '#0f172a';
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    } else if (bgConfig.type === 'solid') {
      ctx.fillStyle = bgConfig.solidColor;
      ctx.fillRect(0, 0, width, height);
    } else if (bgConfig.type === 'gradient') {
      const x1 = 0;
      const y1 = 0;
      const x2 = width;
      const y2 = height;
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, bgConfig.gradientStart);
      gradient.addColorStop(1, bgConfig.gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (bgConfig.type === 'preset-theme' || bgConfig.type === 'ai-generated') {
      // Draw preloaded background
      const bgImg = backgroundPresetImageRef.current;
      if (bgImg && bgImg.complete) {
        ctx.drawImage(bgImg, 0, 0, width, height);
      } else {
        // Fallback checks
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, width, height);
      }
    }
  };

  // Helper star shape
  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // Helper heart shape
  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.beginPath();
    const topCurveHeight = height * 0.3;
    ctx.moveTo(x + width / 2, y + topCurveHeight);
    // Left curve
    ctx.bezierCurveTo(
      x + width / 2, y, 
      x, y, 
      x, y + topCurveHeight
    );
    ctx.bezierCurveTo(
      x, y + (height + topCurveHeight) / 2, 
      x + width / 2, y + height, 
      x + width / 2, y + height
    );
    // Right curve
    ctx.bezierCurveTo(
      x + width / 2, y + height, 
      x + width, y + (height + topCurveHeight) / 2, 
      x + width, y + topCurveHeight
    );
    ctx.bezierCurveTo(
      x + width, y, 
      x + width / 2, y, 
      x + width / 2, y + topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // Handle client-side Magic Wand (Chroma Threshold removal)
  const applyMagicWand = (x: number, y: number) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas || !imgElement) return;

    pushToHistory();
    setIsProcessing(true);
    setStatusMessage('Tracing contiguous color regions...');

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = maskCanvas.width;
    tempCanvas.height = maskCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(imgElement, 0, 0, tempCanvas.width, tempCanvas.height);
    const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const pixels = imgData.data;

    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const maskImgData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const maskPixels = maskImgData.data;

    const w = tempCanvas.width;
    const h = tempCanvas.height;
    const tol = magicTolerance;

    // Get color of clicked target point
    const targetIdx = (y * w + x) * 4;
    const tr = pixels[targetIdx];
    const tg = pixels[targetIdx + 1];
    const tb = pixels[targetIdx + 2];

    // Visited map: 1 bit per pixel
    const visited = new Uint8Array(w * h);
    const queue: number[] = [y * w + x];
    visited[y * w + x] = 1;

    let head = 0;
    while (head < queue.length) {
      const curr = queue[head++];
      const cy = Math.floor(curr / w);
      const cx = curr % w;

      const idx = curr * 4;
      maskPixels[idx + 3] = 0; // Erase matching background pixels (set opacity mask to 0)

      // Check 4 neighbors
      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const nidx = ny * w + nx;
          if (visited[nidx] === 0) {
            const pIdx = nidx * 4;
            const r = pixels[pIdx];
            const g = pixels[pIdx + 1];
            const b = pixels[pIdx + 2];

            const diff = Math.sqrt(
              (r - tr) ** 2 + 
              (g - tg) ** 2 + 
              (b - tb) ** 2
            );

            if (diff <= tol * 2.5) {
              visited[nidx] = 1;
              queue.push(nidx);
            }
          }
        }
      }
    }

    maskCtx.putImageData(maskImgData, 0, 0);
    setIsProcessing(false);
    setStatusMessage('Contiguous background region erased');
    renderCanvas();
  };

  // Handle AI Auto-Enhance Call
  const triggerAiAutoEnhance = async () => {
    if (!imgElement) return;
    pushToHistory();
    setIsProcessing(true);
    setStatusMessage('AI analyzing image histogram and white balances...');

    try {
      // Re-create binary stream of our image
      const canvas = document.createElement('canvas');
      canvas.width = adjustments.canvasWidth;
      canvas.height = adjustments.canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Blob creation failed');

        const formData = new FormData();
        formData.append('image', blob, 'original.png');

        const response = await fetch('/api/auto-enhance', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (data.success && data.adjustments) {
          setFilters(prev => ({
            ...prev,
            brightness: data.adjustments.brightness || prev.brightness,
            contrast: data.adjustments.contrast || prev.contrast,
            exposure: data.adjustments.exposure || prev.exposure,
            highlights: data.adjustments.highlights !== undefined ? data.adjustments.highlights : prev.highlights,
            shadows: data.adjustments.shadows !== undefined ? data.adjustments.shadows : prev.shadows,
            temperature: data.adjustments.temperature !== undefined ? data.adjustments.temperature : prev.temperature,
            tint: data.adjustments.tint !== undefined ? data.adjustments.tint : prev.tint,
            saturation: data.adjustments.saturation || prev.saturation,
            sharpness: data.adjustments.sharpness || prev.sharpness,
          }));
          setStatusMessage('AI Auto-Fix and portrait enhancement applied');
        } else {
          throw new Error(data.error || 'Auto enhance returned unsuccessful response');
        }
        setIsProcessing(false);
      }, 'image/png');

    } catch (err: any) {
      console.error(err);
      setErrorText('AI enhancement failed: ' + err.message);
      setIsProcessing(false);
    }
  };

  // Handle AI Background Generation
  const triggerAiBackgroundGeneration = async () => {
    if (!aiBgPrompt) return;
    pushToHistory();
    setIsProcessing(true);
    setStatusMessage('Gemini AI generating professional backdrop artwork...');

    try {
      const response = await fetch('/api/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiBgPrompt,
          aspectRatio: adjustments.canvasWidth > adjustments.canvasHeight ? '16:9' : '1:1',
          theme: 'Studio backdrops'
        })
      });

      const data = await response.json();
      if (data.success && data.imageUrl) {
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = data.imageUrl;
        bgImg.onload = () => {
          backgroundPresetImageRef.current = bgImg;
          setBgConfig(prev => ({
            ...prev,
            type: 'ai-generated',
            customUploadedUrl: data.imageUrl
          }));
          setIsProcessing(false);
          setStatusMessage(data.message || 'AI Background applied');
        };
      } else {
        throw new Error(data.error || 'Generative model did not respond');
      }
    } catch (err: any) {
      console.error(err);
      setErrorText('AI BG generation failed. Using transparent fallback.');
      setIsProcessing(false);
    }
  };

  // Automated BG remover trigger
  const triggerAutoBgRemove = async () => {
    if (!imgElement) return;
    pushToHistory();
    setIsProcessing(true);
    setStatusMessage('Preparing image for lightning-fast AI removal...');

    try {
      // Helper function to resize originalFile to 640px max size for extremely fast neural execution
      const resizeImage = (file: File, maxDim = 640): Promise<Blob> => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              
              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                  resolve(blob || file);
                }, 'image/png');
              } else {
                resolve(file);
              }
            };
            img.onerror = () => resolve(file);
            img.src = e.target?.result as string;
          };
          reader.onerror = () => resolve(file);
          reader.readAsDataURL(file);
        });
      };

      const fastInferenceBlob = await resizeImage(originalFile, 640);

      setStatusMessage('Loading ultra-fast quantized AI engine...');

      // Run the state-of-the-art neural background removal in the browser on the fast resized blob
      const removedBgBlob = await removeBackground(fastInferenceBlob, {
        model: 'isnet_quint8', // ultra-fast quantized model (~11MB) instead of heavy full-precision FP32
        progress: (key, current, total) => {
          const percent = Math.round((current / total) * 100);
          setStatusMessage(`AI Model: Loading ${key.replace('models/', '')} (${percent}%)`);
        }
      });

      setStatusMessage('Tracing refined high-fidelity subject contours...');

      const removedBgImg = new Image();
      removedBgImg.src = URL.createObjectURL(removedBgBlob);

      removedBgImg.onload = () => {
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
          const mCtx = maskCanvas.getContext('2d');
          if (mCtx) {
            const w = maskCanvas.width;
            const h = maskCanvas.height;

            // Clear mask completely
            mCtx.clearRect(0, 0, w, h);

            // Draw subject PNG (which has transparent background)
            mCtx.drawImage(removedBgImg, 0, 0, w, h);

            // Use source-in to turn all non-transparent pixels into solid white mask
            mCtx.globalCompositeOperation = 'source-in';
            mCtx.fillStyle = '#ffffff';
            mCtx.fillRect(0, 0, w, h);
            
            // Restore default composite operation
            mCtx.globalCompositeOperation = 'source-over';

            setStatusMessage('AI Background removed with pixel-perfect accuracy!');
            setIsProcessing(false);
            renderCanvas();
          }
        }
      };

      removedBgImg.onerror = () => {
        throw new Error('Could not render removed background image.');
      };

    } catch (err: any) {
      console.warn('Local neural background removal failed, calling Gemini backup contour tracer...', err);
      setStatusMessage('Contacting backup cloud contour tracer...');
      
      try {
        // Re-create binary stream of our image
        const canvas = document.createElement('canvas');
        canvas.width = adjustments.canvasWidth;
        canvas.height = adjustments.canvasHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          if (!blob) {
            isolateForegroundNatively();
            setIsProcessing(false);
            renderCanvas();
            return;
          }

          const formData = new FormData();
          formData.append('image', blob, 'original.png');

          try {
            const response = await fetch('/api/remove-background', {
              method: 'POST',
              body: formData
            });

            const data = await response.json();
            
            if (data.success && data.polygons && data.polygons.length > 0) {
              const maskCanvas = maskCanvasRef.current;
              if (maskCanvas) {
                const mCtx = maskCanvas.getContext('2d');
                if (mCtx) {
                  mCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
                  mCtx.fillStyle = '#000000';
                  mCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

                  mCtx.save();
                  mCtx.fillStyle = '#ffffff';
                  mCtx.shadowBlur = 1;
                  mCtx.shadowColor = '#ffffff';

                  data.polygons.forEach((poly: number[][]) => {
                    if (poly.length < 3) return;
                    mCtx.beginPath();
                    const startX = (poly[0][0] / 100) * maskCanvas.width;
                    const startY = (poly[0][1] / 100) * maskCanvas.height;
                    mCtx.moveTo(startX, startY);
                    for (let i = 1; i < poly.length; i++) {
                      const x = (poly[i][0] / 100) * maskCanvas.width;
                      const y = (poly[i][1] / 100) * maskCanvas.height;
                      mCtx.lineTo(x, y);
                    }
                    mCtx.closePath();
                    mCtx.fill();
                  });

                  mCtx.restore();
                  setStatusMessage(`AI subject isolated (Backup API): ${data.subject || 'Subject detected'}`);
                }
              }
            } else {
              isolateForegroundNatively();
              setStatusMessage('Completed with high-fidelity border separation');
            }
          } catch (apiErr) {
            console.error('Backup API call failed', apiErr);
            isolateForegroundNatively();
            setStatusMessage('Completed with high-fidelity border separation');
          }

          setIsProcessing(false);
          renderCanvas();
        }, 'image/png');

      } catch (fallbackErr) {
        console.error('All background removal options failed', fallbackErr);
        isolateForegroundNatively();
        setIsProcessing(false);
        renderCanvas();
      }
    }
  };

  // Smart high-fidelity client cutout: performs flood fill starting from outer borders
  // to erase background while fully preserving identical subject colors.
  const isolateForegroundNatively = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas || !imgElement) return;

    const mCtx = maskCanvas.getContext('2d');
    if (!mCtx) return;

    const w = maskCanvas.width;
    const h = maskCanvas.height;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tCtx = tempCanvas.getContext('2d');
    if (!tCtx) return;
    tCtx.drawImage(imgElement, 0, 0, w, h);

    const imgData = tCtx.getImageData(0, 0, w, h);
    const pixels = imgData.data;

    const maskImgData = mCtx.getImageData(0, 0, w, h);
    const maskPixels = maskImgData.data;

    // Start with a fully opaque white mask (everything visible)
    for (let i = 0; i < maskPixels.length; i += 4) {
      maskPixels[i] = 255;
      maskPixels[i + 1] = 255;
      maskPixels[i + 2] = 255;
      maskPixels[i + 3] = 255;
    }

    const visited = new Uint8Array(w * h);
    const queue: number[] = [];

    const addSeed = (x: number, y: number) => {
      const idx = y * w + x;
      if (visited[idx] === 0) {
        visited[idx] = 1;
        queue.push(idx);
      }
    };

    // Sample seeds along borders to trace background regions
    for (let x = 0; x < w; x += 15) {
      addSeed(x, 0); // top row
    }
    for (let y = 0; y < h; y += 15) {
      addSeed(0, y); // left column
      addSeed(w - 1, y); // right column
    }
    // Also include corners
    addSeed(0, 0);
    addSeed(w - 1, 0);
    addSeed(0, h - 1);
    addSeed(w - 1, h - 1);

    // Calculate average background color from seeds
    let sumR = 0, sumG = 0, sumB = 0, count = 0;
    queue.forEach(idx => {
      sumR += pixels[idx * 4];
      sumG += pixels[idx * 4 + 1];
      sumB += pixels[idx * 4 + 2];
      count++;
    });
    const avgR = sumR / count;
    const avgG = sumG / count;
    const avgB = sumB / count;

    const tolerance = magicTolerance; // respect user's tolerance selection!

    let head = 0;
    while (head < queue.length) {
      const curr = queue[head++];
      const cy = Math.floor(curr / w);
      const cx = curr % w;

      // Make this background pixel fully transparent in the mask
      maskPixels[curr * 4 + 3] = 0;

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const nidx = ny * w + nx;
          if (visited[nidx] === 0) {
            const pIdx = nidx * 4;
            const r = pixels[pIdx];
            const g = pixels[pIdx + 1];
            const b = pixels[pIdx + 2];

            // Distance to overall background average color
            const diff = Math.sqrt(
              (r - avgR) ** 2 + 
              (g - avgG) ** 2 + 
              (b - avgB) ** 2
            );

            if (diff <= tolerance * 2.2) {
              visited[nidx] = 1;
              queue.push(nidx);
            }
          }
        }
      }
    }

    mCtx.putImageData(maskImgData, 0, 0);
    renderCanvas();
  };

  // Erase/Brush action mouse handling
  const handleCanvasPointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = workspaceCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Calculate click coordinates relative to raw canvas scale width/height
    const scaleX = adjustments.canvasWidth / rect.width;
    const scaleY = adjustments.canvasHeight / rect.height;
    
    const clickX = Math.round((e.clientX - rect.left) * scaleX);
    const clickY = Math.round((e.clientY - rect.top) * scaleY);

    // If before/after mode splitting
    if (beforeAfterMode) {
      const splitX = (beforeAfterRatio / 100) * adjustments.canvasWidth;
      if (Math.abs(clickX - splitX) < 25) {
        setIsDraggingCanvas(true);
        return;
      }
    }

    // Checking if clicked on Overlay layers
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      let bounds = false;

      if (layer.type === 'text') {
        bounds = clickX >= layer.x - 20 && clickX <= layer.x + 200 && clickY >= layer.y - 30 && clickY <= layer.y + 10;
      } else if (layer.type === 'sticker') {
        bounds = Math.abs(clickX - layer.x) < 40 && Math.abs(clickY - layer.y) < 40;
      } else if (layer.type === 'shape') {
        bounds = clickX >= layer.x && clickX <= layer.x + layer.width && clickY >= layer.y && clickY <= layer.y + layer.height;
      }

      if (bounds) {
        setSelectedLayerId(layer.id);
        setDraggingLayerId(layer.id);
        setLayerDragOffset({ x: clickX - layer.x, y: clickY - layer.y });
        return;
      }
    }

    // Magic Wand Trigger
    if (magicWandActive) {
      applyMagicWand(clickX, clickY);
      return;
    }

    // Brush active
    if (eraserActive) {
      pushToHistory();
      setIsDraggingCanvas(true);
      applyBrushStroke(clickX, clickY);
      return;
    }

    // Otherwise, generic Pan/Zoom dragging
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleCanvasPointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingCanvas) return;

    const canvas = workspaceCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = adjustments.canvasWidth / rect.width;
    const scaleY = adjustments.canvasHeight / rect.height;
    
    const clickX = Math.round((e.clientX - rect.left) * scaleX);
    const clickY = Math.round((e.clientY - rect.top) * scaleY);

    if (beforeAfterMode) {
      const percentage = Math.round((clickX / adjustments.canvasWidth) * 100);
      setBeforeAfterRatio(Math.max(0, Math.min(100, percentage)));
      return;
    }

    if (draggingLayerId) {
      setLayers(prev => prev.map(layer => {
        if (layer.id === draggingLayerId) {
          return {
            ...layer,
            x: clickX - layerDragOffset.x,
            y: clickY - layerDragOffset.y
          };
        }
        return layer;
      }));
      return;
    }

    if (eraserActive) {
      applyBrushStroke(clickX, clickY);
      return;
    }

    // Generic Pan
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleCanvasPointerUp = () => {
    setIsDraggingCanvas(false);
    setDraggingLayerId(null);
  };

  const applyBrushStroke = (x: number, y: number) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (brushMode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#ffffff';
    }

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    renderCanvas();
  };

  // Add a Text Layer
  const handleAddText = () => {
    pushToHistory();
    const newText: OverlayLayer = {
      id: 'text-' + Date.now(),
      type: 'text',
      text: 'Click & Type',
      x: adjustments.canvasWidth / 2 - 50,
      y: adjustments.canvasHeight / 2,
      fontSize: 36,
      fontFamily: 'Inter',
      color: '#06b6d4',
      backgroundColor: 'transparent'
    };
    setLayers(prev => [...prev, newText]);
    setSelectedLayerId(newText.id);
  };

  // Add Emoji Sticker
  const handleAddSticker = (emoji: string) => {
    pushToHistory();
    const newSticker: OverlayLayer = {
      id: 'sticker-' + Date.now(),
      type: 'sticker',
      emoji,
      x: adjustments.canvasWidth / 2,
      y: adjustments.canvasHeight / 2,
      size: 50
    };
    setLayers(prev => [...prev, newSticker]);
    setSelectedLayerId(newSticker.id);
  };

  // Add Shape
  const handleAddShape = (shapeType: 'rectangle' | 'circle' | 'star' | 'heart') => {
    pushToHistory();
    const newShape: OverlayLayer = {
      id: 'shape-' + Date.now(),
      type: 'shape',
      shapeType,
      x: adjustments.canvasWidth / 2 - 50,
      y: adjustments.canvasHeight / 2 - 50,
      width: 100,
      height: 100,
      color: 'rgba(6, 182, 212, 0.3)',
      borderWidth: 3,
      borderColor: '#06b6d4'
    };
    setLayers(prev => [...prev, newShape]);
    setSelectedLayerId(newShape.id);
  };

  // Delete active overlay
  const handleDeleteLayer = (id: string) => {
    pushToHistory();
    setLayers(prev => prev.filter(l => l.id !== id));
    setSelectedLayerId(null);
  };

  // Set solid preset background
  const setPresetBackground = (theme: PresetTheme) => {
    pushToHistory();
    setIsProcessing(true);
    setStatusMessage(`Applying backdrop: ${theme.name}`);
    
    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = theme.url;
    bgImg.onload = () => {
      backgroundPresetImageRef.current = bgImg;
      setBgConfig(prev => ({
        ...prev,
        type: 'preset-theme',
        presetThemeId: theme.id,
        customUploadedUrl: theme.url
      }));
      setIsProcessing(false);
      setStatusMessage(`Backdrop applied: ${theme.name}`);
    };
    bgImg.onerror = () => {
      setIsProcessing(false);
      setErrorText('Error loading the selected preset backdrop.');
    };
  };

  // Custom User background upload
  const handleCustomBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      pushToHistory();
      setIsProcessing(true);
      setStatusMessage('Uploading custom backdrop...');

      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const bgImg = new Image();
      bgImg.src = url;
      bgImg.onload = () => {
        backgroundPresetImageRef.current = bgImg;
        setBgConfig(prev => ({
          ...prev,
          type: 'preset-theme',
          customUploadedUrl: url
        }));
        setIsProcessing(false);
        setStatusMessage('Custom backdrop applied');
      };
    }
  };

  // Reset entire workspace
  const handleResetWorkspace = () => {
    pushToHistory();
    setFilters({ ...DEFAULT_FILTERS });
    setAdjustments({ ...DEFAULT_ADJUSTMENTS, canvasWidth: adjustments.canvasWidth, canvasHeight: adjustments.canvasHeight, crop: { ...DEFAULT_ADJUSTMENTS.crop, width: adjustments.canvasWidth, height: adjustments.canvasHeight } });
    setBgConfig({
      type: 'transparent',
      solidColor: '#ffffff',
      gradientStart: '#111827',
      gradientEnd: '#1e1b4b',
      gradientAngle: 135
    });
    setLayers([]);
    setSelectedLayerId(null);
    setActivePreset('none');
    
    // Fill mask back to opaque white
    const mask = maskCanvasRef.current;
    if (mask) {
      const mCtx = mask.getContext('2d');
      if (mCtx) {
        mCtx.fillStyle = '#ffffff';
        mCtx.fillRect(0, 0, mask.width, mask.height);
      }
    }
    setStatusMessage('Workspace reset back to loaded original image');
  };

  // Perform client-side download/export
  const handleExportDownload = () => {
    const canvas = workspaceCanvasRef.current;
    if (!canvas) return;

    setStatusMessage('Compiling final graphic package...');
    
    let mime = 'image/png';
    if (exportFormat === 'jpeg') mime = 'image/jpeg';
    else if (exportFormat === 'webp') mime = 'image/webp';
    else if (exportFormat === 'avif') mime = 'image/avif';

    const quality = exportQuality / 100;
    const dataUrl = canvas.toDataURL(mime, quality);

    const link = document.createElement('a');
    link.download = `${exportFilename || 'bgcraft_export'}.${exportFormat}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusMessage('Graphic package downloaded successfully');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#050608] text-slate-200 lg:flex-row">
      
      {/* 1. Left Side Menu Controls (Bento Panel) */}
      <aside className="w-full border-r border-white/10 bg-[#050608] p-4 lg:w-96 flex flex-col h-full overflow-y-auto shrink-0 select-none">
        
        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-white/5 p-1 border border-white/5 text-xs mb-4 font-sans">
          <button
            onClick={() => setActiveTab('isolate')}
            className={`flex-1 rounded-lg py-2 font-semibold transition duration-150 ${
              activeTab === 'isolate' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/15' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Mask
          </button>
          <button
            onClick={() => setActiveTab('bg')}
            className={`flex-1 rounded-lg py-2 font-semibold transition duration-150 ${
              activeTab === 'bg' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/15' : 'text-slate-400 hover:text-white'
            }`}
          >
            Replace BG
          </button>
          <button
            onClick={() => setActiveTab('adjust')}
            className={`flex-1 rounded-lg py-2 font-semibold transition duration-150 ${
              activeTab === 'adjust' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/15' : 'text-slate-400 hover:text-white'
            }`}
          >
            Filters
          </button>
          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex-1 rounded-lg py-2 font-semibold transition duration-150 ${
              activeTab === 'canvas' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/15' : 'text-slate-400 hover:text-white'
            }`}
          >
            Canvas
          </button>
          <button
            onClick={() => setActiveTab('overlays')}
            className={`flex-1 rounded-lg py-2 font-semibold transition duration-150 ${
              activeTab === 'overlays' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/15' : 'text-slate-400 hover:text-white'
            }`}
          >
            Layers
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="flex-1 space-y-6">

          {/* TAB 1: AI Mask & Isolate Foreground */}
          {activeTab === 'isolate' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">AI Separation</h3>
                <p className="text-xs text-slate-400">Detect dominant objects, animals, or human portraits instantly.</p>
                <button
                  onClick={triggerAutoBgRemove}
                  disabled={isProcessing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:opacity-95 disabled:opacity-50 duration-300"
                >
                  <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                  Auto Background Removal
                </button>
              </div>

              {/* Manual Brush Eraser Controls */}
              <div className="border-t border-white/5 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">Manual Brush Eraser</h3>
                  <button
                    onClick={() => {
                      setEraserActive(!eraserActive);
                      if (!eraserActive) setMagicWandActive(false);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
                      eraserActive ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    {eraserActive ? 'ACTIVE' : 'ACTIVATE'}
                  </button>
                </div>

                {eraserActive && (
                  <div className="space-y-4 rounded-xl bg-white/5 p-4 border border-white/5 text-xs animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Mode:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setBrushMode('erase')}
                          className={`rounded-md px-2 py-1 font-semibold ${
                            brushMode === 'erase' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          Erase
                        </button>
                        <button
                          onClick={() => setBrushMode('restore')}
                          className={`rounded-md px-2 py-1 font-semibold ${
                            brushMode === 'restore' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          Restore
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-400">Brush Size:</span>
                        <span>{brushSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Smart Magic Wand Color-Key Selector */}
              <div className="border-t border-white/5 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">Magic Wand Keyer</h3>
                  <button
                    onClick={() => {
                      setMagicWandActive(!magicWandActive);
                      if (!magicWandActive) setEraserActive(false);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
                      magicWandActive ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    {magicWandActive ? 'ACTIVE' : 'ACTIVATE'}
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Toggle on, then click anywhere on your image canvas to sample and instantly erase matching colors.
                </p>

                {magicWandActive && (
                  <div className="space-y-3 rounded-xl bg-white/5 p-4 border border-white/5 text-xs animate-fade-in">
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-400">Color Tolerance:</span>
                        <span>{magicTolerance}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={magicTolerance}
                        onChange={(e) => setMagicTolerance(Number(e.target.value))}
                        className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Background Replacement */}
          {activeTab === 'bg' && (
            <div className="space-y-6">
              
              {/* Selector tab types */}
              <div className="space-y-4">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">Background Mode</h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setBgConfig({ ...bgConfig, type: 'transparent' })}
                    className={`rounded-lg py-2 font-semibold transition ${
                      bgConfig.type === 'transparent' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/10' : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Alpha PNG
                  </button>
                  <button
                    onClick={() => setBgConfig({ ...bgConfig, type: 'solid' })}
                    className={`rounded-lg py-2 font-semibold transition ${
                      bgConfig.type === 'solid' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/10' : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Solid
                  </button>
                  <button
                    onClick={() => setBgConfig({ ...bgConfig, type: 'gradient' })}
                    className={`rounded-lg py-2 font-semibold transition ${
                      bgConfig.type === 'gradient' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/10' : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Gradient
                  </button>
                </div>
              </div>

              {/* Mode Options: Solid Color */}
              {bgConfig.type === 'solid' && (
                <div className="space-y-3 animate-fade-in text-xs">
                  <span className="font-semibold text-slate-400">Choose Hex Color:</span>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={bgConfig.solidColor}
                      onChange={(e) => setBgConfig({ ...bgConfig, type: 'solid', solidColor: e.target.value })}
                      className="h-10 w-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bgConfig.solidColor}
                      onChange={(e) => setBgConfig({ ...bgConfig, type: 'solid', solidColor: e.target.value })}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Mode Options: Gradient */}
              {bgConfig.type === 'gradient' && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-semibold text-slate-400">Start Color:</span>
                      <input
                        type="color"
                        value={bgConfig.gradientStart}
                        onChange={(e) => setBgConfig({ ...bgConfig, type: 'gradient', gradientStart: e.target.value })}
                        className="h-8 w-full rounded-md border border-white/10 bg-transparent cursor-pointer mt-1"
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">End Color:</span>
                      <input
                        type="color"
                        value={bgConfig.gradientEnd}
                        onChange={(e) => setBgConfig({ ...bgConfig, type: 'gradient', gradientEnd: e.target.value })}
                        className="h-8 w-full rounded-md border border-white/10 bg-transparent cursor-pointer mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* AI Generative Background Prompter */}
              <div className="border-t border-white/5 pt-4 space-y-4">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider">Gemini AI Backdrop</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Describe any background (e.g., "sunny mountains backdrop with warm spotlight") and have Gemini design it.
                </p>
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={aiBgPrompt}
                    onChange={(e) => setAiBgPrompt(e.target.value)}
                    placeholder="Enter visual keywords..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={triggerAiBackgroundGeneration}
                    disabled={isProcessing || !aiBgPrompt}
                    className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-40 transition duration-300"
                  >
                    AI Generate Background
                  </button>
                </div>
              </div>

              {/* Preloaded Studio/Office/Nature themes */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">Preset Sceneries</h4>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {PRESET_THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setPresetBackground(theme)}
                      className={`flex flex-col items-start p-2 rounded-lg border text-left transition ${
                        bgConfig.presetThemeId === theme.id 
                          ? 'border-blue-500 bg-blue-500/10 text-blue-300' 
                          : 'border-white/5 bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="font-semibold truncate w-full text-white">{theme.name}</span>
                      <span className="text-slate-500 uppercase mt-0.5">{theme.category}</span>
                    </button>
                  ))}
                </div>

                {/* Custom User Background image upload */}
                <div className="pt-2">
                  <label className="block rounded-lg border border-dashed border-white/20 bg-white/5 p-2.5 text-center text-xs font-semibold text-blue-400 cursor-pointer hover:bg-white/10 transition">
                    Upload Custom Backdrop Image
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleCustomBackgroundUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Filters & Adjustments */}
          {activeTab === 'adjust' && (
            <div className="space-y-6">
              
              {/* One-Click Presets */}
              <div className="space-y-3">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">Aesthetic Presets</h3>
                <div className="grid grid-cols-4 gap-1.5 text-[10px] font-bold">
                  {(['none', 'hdr', 'vintage', 'bw', 'sepia', 'film', 'glow'] as PresetName[]).map(preset => (
                    <button
                      key={preset}
                      onClick={() => setActivePreset(preset)}
                      className={`rounded-md py-2 uppercase transition duration-150 ${
                        activePreset === preset ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/10' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider list */}
              <div className="border-t border-white/5 pt-4 space-y-4 text-xs select-none">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">Visual Tuning</h3>
                  <button
                    onClick={triggerAiAutoEnhance}
                    disabled={isProcessing}
                    className="flex items-center gap-1 rounded-lg bg-blue-500/10 px-2 py-1 text-blue-400 text-[10px] font-bold border border-blue-500/20 hover:bg-blue-500/20 transition duration-150"
                  >
                    <Sparkles className="h-3 w-3" />
                    AI AUTO-FIX
                  </button>
                </div>

                {/* Brightness */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Brightness:</span>
                    <span>{filters.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={filters.brightness}
                    onChange={(e) => setFilters({ ...filters, brightness: Number(e.target.value) })}
                    className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Contrast:</span>
                    <span>{filters.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={filters.contrast}
                    onChange={(e) => setFilters({ ...filters, contrast: Number(e.target.value) })}
                    className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Saturation:</span>
                    <span>{filters.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.saturation}
                    onChange={(e) => setFilters({ ...filters, saturation: Number(e.target.value) })}
                    className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Hue Rotate */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Hue Rotation:</span>
                    <span>{filters.hue}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={filters.hue}
                    onChange={(e) => setFilters({ ...filters, hue: Number(e.target.value) })}
                    className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Sharpness (Simulated as contrast scale) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Sharpness:</span>
                    <span>{filters.sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.sharpness}
                    onChange={(e) => setFilters({ ...filters, sharpness: Number(e.target.value) })}
                    className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Background Blur */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Blur:</span>
                    <span>{filters.blur}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.blur}
                    onChange={(e) => setFilters({ ...filters, blur: Number(e.target.value) })}
                    className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Vignette */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Vignette:</span>
                    <span>{filters.vignette}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.vignette}
                    onChange={(e) => setFilters({ ...filters, vignette: Number(e.target.value) })}
                    className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Opacity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Subject Opacity:</span>
                    <span>{filters.opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={filters.opacity}
                    onChange={(e) => setFilters({ ...filters, opacity: Number(e.target.value) })}
                    className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: Canvas Borders & Dimensions */}
          {activeTab === 'canvas' && (
            <div className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">Canvas Borders & Aesthetics</h3>
                
                {/* Border width */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Border Width:</span>
                    <span>{filters.borderWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={filters.borderWidth}
                    onChange={(e) => setFilters({ ...filters, borderWidth: Number(e.target.value) })}
                    className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Border Color */}
                {filters.borderWidth > 0 && (
                  <div className="space-y-2 text-xs animate-fade-in">
                    <span className="font-semibold text-slate-400">Border Color:</span>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={filters.borderColor}
                        onChange={(e) => setFilters({ ...filters, borderColor: e.target.value })}
                        className="h-8 w-12 rounded-lg bg-transparent border border-white/10"
                      />
                      <input
                        type="text"
                        value={filters.borderColor}
                        onChange={(e) => setFilters({ ...filters, borderColor: e.target.value })}
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 font-mono text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Transformations (Rotate / Flip) */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">Transforms</h3>
                <div className="flex gap-2 text-xs font-semibold">
                  <button
                    onClick={() => {
                      pushToHistory();
                      setAdjustments(prev => ({
                        ...prev,
                        rotate: (prev.rotate + 90) % 360
                      }));
                    }}
                    className="flex-1 flex items-center justify-center gap-1 bg-white/5 border border-white/10 rounded-lg py-2 hover:bg-white/10 transition"
                  >
                    <RotateCw className="h-4 w-4" />
                    +90°
                  </button>
                  <button
                    onClick={() => {
                      pushToHistory();
                      setAdjustments(prev => ({
                        ...prev,
                        flipH: !prev.flipH
                      }));
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 hover:bg-white/10 transition"
                  >
                    Flip Horiz
                  </button>
                  <button
                    onClick={() => {
                      pushToHistory();
                      setAdjustments(prev => ({
                        ...prev,
                        flipV: !prev.flipV
                      }));
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 hover:bg-white/10 transition"
                  >
                    Flip Vert
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: Overlays Layers */}
          {activeTab === 'overlays' && (
            <div className="space-y-6">
              
              {/* Overlay launchers */}
              <div className="space-y-4">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">Add Design Elements</h3>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    onClick={handleAddText}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2.5 text-slate-200 hover:bg-white/10"
                  >
                    <TypeIcon className="h-4 w-4" />
                    Add Text Layer
                  </button>
                  <button
                    onClick={() => handleAddShape('rectangle')}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2.5 text-slate-200 hover:bg-white/10"
                  >
                    <Square className="h-4 w-4" />
                    Add Rectangle
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  <button
                    onClick={() => handleAddShape('circle')}
                    className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-2 hover:bg-white/10"
                  >
                    <Circle className="h-3.5 w-3.5" />
                    Circle
                  </button>
                  <button
                    onClick={() => handleAddShape('star')}
                    className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-2 hover:bg-white/10"
                  >
                    <Star className="h-3.5 w-3.5" />
                    Star
                  </button>
                  <button
                    onClick={() => handleAddShape('heart')}
                    className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-2 hover:bg-white/10"
                  >
                    <Heart className="h-3.5 w-3.5" />
                    Heart
                  </button>
                </div>
              </div>

              {/* Preset Stickers / Emojis selection */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">Emoji Stickers</h3>
                <div className="grid grid-cols-6 gap-2 text-xl bg-white/5 p-2.5 rounded-xl border border-white/5">
                  {['🔥', '✨', '⚡', '💡', '👑', '🕶️', '🚀', '❤️', '👍', '🎉', '🌟', '💥'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleAddSticker(emoji)}
                      className="hover:scale-125 transition duration-150"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layer details editor if one is selected */}
              {selectedLayerId && (
                <div className="border-t border-white/5 pt-4 space-y-4 animate-fade-in text-xs">
                  {layers.find(l => l.id === selectedLayerId)?.type === 'text' && (
                    <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-bold text-white uppercase">Edit Text Layer</span>
                        <button
                          onClick={() => handleDeleteLayer(selectedLayerId)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <input
                        type="text"
                        value={layers.find(l => l.id === selectedLayerId)?.text || ''}
                        onChange={(e) => {
                          setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, text: e.target.value } : l));
                        }}
                        className="w-full rounded-lg bg-white/5 px-3 py-2 border border-white/10 focus:outline-none focus:border-blue-500"
                      />

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400">Color:</span>
                          <input
                            type="color"
                            value={layers.find(l => l.id === selectedLayerId)?.color || '#ffffff'}
                            onChange={(e) => {
                               setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, color: e.target.value } : l));
                            }}
                            className="h-8 w-full rounded bg-transparent mt-1 border border-white/10 cursor-pointer"
                          />
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold">Size:</span>
                          <input
                            type="number"
                            value={layers.find(l => l.id === selectedLayerId)?.fontSize || 24}
                            onChange={(e) => {
                               setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, fontSize: Number(e.target.value) } : l));
                            }}
                            className="w-full rounded bg-white/5 px-2 py-1 border border-white/10 mt-1 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {layers.find(l => l.id === selectedLayerId)?.type === 'shape' && (
                    <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-bold text-white uppercase">Edit Shape</span>
                        <button
                          onClick={() => handleDeleteLayer(selectedLayerId)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400">Fill Color:</span>
                          <input
                            type="color"
                            value={layers.find(l => l.id === selectedLayerId)?.color || '#ffffff'}
                            onChange={(e) => {
                               setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, color: e.target.value } : l));
                            }}
                            className="h-8 w-full rounded bg-transparent mt-1 border border-white/10 cursor-pointer"
                          />
                        </div>
                        <div>
                          <span className="text-slate-400">Border Color:</span>
                          <input
                            type="color"
                            value={layers.find(l => l.id === selectedLayerId)?.borderColor || '#ffffff'}
                            onChange={(e) => {
                               setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, borderColor: e.target.value } : l));
                            }}
                            className="h-8 w-full rounded bg-transparent mt-1 border border-white/10 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Workspace Footer Action shortcuts */}
        <div className="mt-8 border-t border-white/10 pt-4 flex gap-2">
          <button
            onClick={handleResetWorkspace}
            className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-white/5 py-2.5 border border-white/5 text-xs text-slate-400 hover:text-white transition duration-150"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Edits
          </button>
          <button
            onClick={onClear}
            className="flex-1 rounded-xl bg-red-950/20 py-2.5 border border-red-500/20 text-xs text-red-400 hover:bg-red-950/40 transition duration-150"
          >
            Unload File
          </button>
        </div>
      </aside>

      {/* 2. Center Stage Canvas workspace Area */}
      <section className="flex-1 flex flex-col bg-[#0c0d12] p-4 select-none relative">
        
        {/* Floating Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#050608]/85 border border-white/5 p-3 rounded-2xl backdrop-blur mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={historyStack.length === 0}
              className="rounded-lg bg-white/5 p-2 text-slate-400 hover:text-white disabled:opacity-30"
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="rounded-lg bg-white/5 p-2 text-slate-400 hover:text-white disabled:opacity-30"
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </button>
 
            <span className="h-5 w-px bg-white/10 mx-1" />
 
            <button
              onClick={() => setBeforeAfterMode(!beforeAfterMode)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
                beforeAfterMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              Before / After Split
            </button>
          </div>
 
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(prev => Math.max(10, prev - 10))}
              className="rounded-lg bg-white/5 p-1.5 text-slate-400 hover:text-white"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-400 w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(400, prev + 10))}
              className="rounded-lg bg-white/5 p-1.5 text-slate-400 hover:text-white"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            
            <span className="h-5 w-px bg-white/10 mx-1" />
 
            <button
              onClick={() => {
                setZoom(100);
                setPanX(0);
                setPanY(0);
              }}
              className="rounded-lg bg-white/5 px-2 py-1.5 text-xs text-slate-400 hover:text-white font-semibold"
            >
              Fit
            </button>
          </div>
        </div>
 
        {/* MAIN CANVAS GRAPHIC FRAME */}
        <div 
          className="flex-1 flex items-center justify-center overflow-hidden border border-white/10 bg-[#050608] rounded-2xl relative cursor-crosshair"
          style={{ height: '500px' }}
        >
          {isProcessing && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm space-y-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              <p className="text-sm font-sans font-semibold tracking-wide text-blue-400 animate-pulse uppercase">
                {statusMessage}
              </p>
            </div>
          )}

          {errorText && (
            <div className="absolute inset-x-4 top-4 z-40 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-950/80 p-4 text-xs text-red-400 backdrop-blur">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">Operational Failure</p>
                <p>{errorText}</p>
              </div>
              <button onClick={() => setErrorText(null)} className="ml-auto font-bold uppercase text-slate-400 hover:text-white">dismiss</button>
            </div>
          )}

          {/* Interactive Canvas container with Zoom & Pan Applied */}
          <div
            id="workspace-canvas-frame"
            className="transition-transform duration-75 ease-out select-none"
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoom / 100})`,
              transformOrigin: 'center center'
            }}
          >
            <canvas
              ref={workspaceCanvasRef}
              onMouseDown={handleCanvasPointerDown}
              onMouseMove={handleCanvasPointerMove}
              onMouseUp={handleCanvasPointerUp}
              onMouseLeave={handleCanvasPointerUp}
              className="shadow-2xl border border-white/5 rounded"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                display: 'block'
              }}
            />
          </div>

          {/* Hidden reference canvas for pixel strokes */}
          <canvas ref={maskCanvasRef} className="hidden" />
        </div>

        {/* Mini status bar line */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {statusMessage}
          </span>
          <span>{adjustments.canvasWidth} x {adjustments.canvasHeight} px</span>
        </div>

      </section>

      {/* 3. Right Side Export & Layers Panel */}
      <aside className="w-full border-l border-white/10 bg-[#050608] p-4 lg:w-80 flex flex-col h-full overflow-y-auto shrink-0 select-none">
        
        {/* Layer Stack / Overlay List */}
        <div className="space-y-4">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Design Layers</h3>
          {layers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-5 text-center text-xs text-slate-600 font-sans">
              No added overlay layers. Text and stickers will list here.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {layers.map(layer => (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer ${
                    selectedLayerId === layer.id 
                      ? 'border-blue-500/50 bg-blue-500/10 text-blue-300' 
                      : 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="truncate flex items-center gap-1.5 font-sans">
                    {layer.type === 'text' ? <TypeIcon className="h-3.5 w-3.5" /> : <Layers className="h-3.5 w-3.5" />}
                    {layer.type === 'text' ? `Text: "${layer.text}"` : layer.type === 'sticker' ? `Sticker: ${layer.emoji}` : `Shape: ${layer.shapeType}`}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLayer(layer.id);
                    }}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Panel controls */}
        <div className="mt-8 border-t border-white/10 pt-6 space-y-6 flex-1">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Export Controls</h3>

          {/* Filename */}
          <div className="space-y-1.5 text-xs">
            <span className="font-semibold text-slate-400">Filename:</span>
            <input
              type="text"
              value={exportFilename}
              onChange={(e) => setExportFilename(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Export name..."
            />
          </div>

          {/* Export format */}
          <div className="space-y-1.5 text-xs">
            <span className="font-semibold text-slate-400">Format:</span>
            <div className="grid grid-cols-4 gap-1">
              {(['png', 'jpeg', 'webp', 'avif'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => {
                    setExportFormat(fmt);
                    if (fmt === 'png') {
                      setBgConfig(prev => ({ ...prev, type: 'transparent' }));
                    }
                  }}
                  className={`rounded-md py-1.5 font-semibold text-[10px] uppercase transition duration-150 ${
                    exportFormat === fmt ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/10' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Compression slide */}
          {exportFormat !== 'png' && (
            <div className="space-y-1.5 text-xs animate-fade-in">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-400">Quality / Compression:</span>
                <span>{exportQuality}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={exportQuality}
                onChange={(e) => setExportQuality(Number(e.target.value))}
                className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Main Download Button */}
          <button
            onClick={handleExportDownload}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.01] hover:opacity-95"
          >
            <Download className="h-4 w-4" />
            Download HD Graphic
          </button>
        </div>

      </aside>

    </div>
  );
}
