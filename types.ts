export enum AppStep {
  UPLOAD = 'UPLOAD',
  SIMULATE = 'SIMULATE',
  RESULT = 'RESULT',
}

export enum Mode {
  CUT = 'CUT',
  COLOR = 'COLOR',
}

export interface HairOption {
  id: string;
  name: string;
  description: string;
  promptModifier: string; // The text to send to Gemini
  icon: string; // Emoji or simple visual indicator
}

export interface SimulationResult {
  generatedImageBase64: string | null;
  advice: string;
}
