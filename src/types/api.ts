export type MotifDetails = {
  name: string;
  origin: string | null;
  philosophy: string | null;
  characteristics: string | null;
};

export type PredictSuccess = {
  status: 'success';
  data: {
    predicted_class: string;
    confidence_score: number;   // 0-100
    confidence_decimal: number; // 0-1
    motif_details: MotifDetails;
  };
  timestamp: string;
};

export type PredictError = { status: 'error'; message: string; code: number };
