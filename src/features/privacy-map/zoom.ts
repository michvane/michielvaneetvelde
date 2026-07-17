export type PrecisionLevel = {
  name: string;
  coordinates: string;
  scale: number;
};

export type PrivacyMapState = {
  precision: number;
  refusals: number;
};

// Coordinates get less precise as the camera gets closer: that inversion is
// the joke, and the redaction blocks are content rather than styling.
export const PRECISION_LEVELS: readonly PrecisionLevel[] = [
  { name: "Western Europe", coordinates: "≈ 51°N, 4°E", scale: 1 },
  { name: "Belgium", coordinates: "≈ 51.1°N, 3.7°E", scale: 1.5 },
  { name: "Ghent-ish", coordinates: "51.0██°N, 3.7██°E", scale: 4.4 },
];

export const MAX_PRECISION = PRECISION_LEVELS.length - 1;

const REFUSAL_MESSAGES = [
  "Precision limit reached. Privacy layer enabled.",
  "The privacy layer remains enabled.",
  "Zooming with more determination does not disable privacy.",
  "Persistence noted. Precision unchanged.",
] as const;

// Start one step away from the limit so the first zoom-in succeeds and the
// second one meets the privacy layer.
export const initialPrivacyMapState: PrivacyMapState = {
  precision: MAX_PRECISION - 1,
  refusals: 0,
};

export function zoomIn(state: PrivacyMapState): PrivacyMapState {
  if (state.precision < MAX_PRECISION) {
    return { ...state, precision: state.precision + 1 };
  }

  return { ...state, refusals: state.refusals + 1 };
}

export function zoomOut(state: PrivacyMapState): PrivacyMapState {
  if (state.precision === 0) {
    return state;
  }

  return { ...state, precision: state.precision - 1 };
}

export function precisionLevel(state: PrivacyMapState): PrecisionLevel {
  return PRECISION_LEVELS[state.precision];
}

// The privacy layer only presents itself at the precision limit; zooming
// back out returns the map to ordinary, unremarkable behavior.
export function refusalMessage(state: PrivacyMapState): string | null {
  if (state.refusals === 0 || state.precision < MAX_PRECISION) {
    return null;
  }

  return REFUSAL_MESSAGES[Math.min(state.refusals, REFUSAL_MESSAGES.length) - 1];
}
