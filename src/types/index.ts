export type TestStatus = 'idle' | 'testing' | 'allowed' | 'blocked' | 'error' | 'inconclusive';

export type ReferrerPolicy =
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

export interface TestResult {
  status: TestStatus;
  url: string;
  cacheBustedUrl?: string;
  testedAt: number;
  durationMs: number;
  width?: number;
  height?: number;
  referrerPolicy: ReferrerPolicy;
  errorMessage?: string;
  explanationTitle: string;
  explanationText: string;
  recommendations: string[];
  corsProbed?: boolean;
  httpStatus?: number | string;
}

export interface PresetImage {
  id: string;
  title: string;
  domain: string;
  url: string;
  badge: string;
}

export type ServerType = 'nginx' | 'apache' | 'cloudflare' | 'caddy' | 'express';

export interface LocalFileMeta {
  name: string;
  sizeFormatted: string;
  sizeBytes: number;
  type: string;
  dimensions?: { width: number; height: number };
  aspectRatio?: string;
  previewUrl: string;
}
