/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ImageFilters {
  brightness: number;     // 0 to 200 (100 is default)
  contrast: number;       // 0 to 200 (100 is default)
  exposure: number;       // 0 to 200 (100 is default)
  highlights: number;     // -100 to 100 (0 is default)
  shadows: number;        // -100 to 100 (0 is default)
  temperature: number;    // -100 to 100 (0 is default)
  tint: number;           // -100 to 100 (0 is default)
  hue: number;            // 0 to 360 (0 is default)
  saturation: number;     // 0 to 200 (100 is default)
  vibrance: number;       // 0 to 200 (100 is default)
  gamma: number;          // 1 to 300 (100 is default, i.e., 1.0)
  sharpness: number;      // 0 to 100 (0 is default)
  noiseReduction: number; // 0 to 100 (0 is default)
  blur: number;           // 0 to 100 (0 is default)
  vignette: number;       // 0 to 100 (0 is default)
  opacity: number;        // 0 to 100 (100 is default)
  cornerRadius: number;   // 0 to 100 (0 is default)
  borderWidth: number;    // 0 to 50 (0 is default)
  borderColor: string;    // HEX string (#000000)
  shadowBlur: number;     // 0 to 50 (0 is default)
  shadowColor: string;    // HEX string (#000000)
}

export interface ImageAdjustments {
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
    active: boolean;
  };
  rotate: number;          // 0, 90, 180, 270 degrees
  flipH: boolean;
  flipV: boolean;
  scaleX: number;
  scaleY: number;
  canvasWidth: number;
  canvasHeight: number;
}

export type PresetName = 'none' | 'hdr' | 'vintage' | 'bw' | 'sepia' | 'film' | 'glow';

export interface TextLayer {
  id: string;
  type: 'text';
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  isDragging?: boolean;
}

export interface StickerLayer {
  id: string;
  type: 'sticker';
  emoji: string;
  x: number;
  y: number;
  size: number;
  isDragging?: boolean;
}

export interface ShapeLayer {
  id: string;
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'star' | 'heart';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  borderWidth: number;
  borderColor: string;
  isDragging?: boolean;
}

export type OverlayLayer = TextLayer | StickerLayer | ShapeLayer;

export interface BackgroundConfig {
  type: 'transparent' | 'solid' | 'gradient' | 'ai-generated' | 'preset-theme';
  solidColor: string;
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number;
  presetThemeId?: string;
  customUploadedUrl?: string;
}

export interface PresetTheme {
  id: string;
  name: string;
  category: 'Studio' | 'Nature' | 'Urban' | 'Creative' | 'Festive';
  url: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
}
