
export interface ImageFile {
  name: string;
  type: string;
  base64: string;
}

export interface PortraitOptions {
  sourceImages: ImageFile[];
  style: string;
  shot: string;
  aspectRatio: string;
  outfitDescription: string;
  outfitImage: ImageFile | null;
  quality: string;
  refinePrompt: string;
  hairstyleImage: ImageFile | null;
}

export interface GeneratedImage {
  id: string;
  src: string;
  alt: string;
}

export interface VideoOptions {
  prompt: string;
  sourceImage: ImageFile | null;
}

export type Language = 'en' | 'vi';

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export interface Option {
  id: string;
  nameKey: string;
  img?: string;
}