import { TestResult, ReferrerPolicy } from '../types';

export type UrlErrorCode = 'EMPTY_URL' | 'INVALID_PROTOCOL' | 'INVALID_FORMAT';

export interface RunTestOptions {
  url: string;
  referrerPolicy: ReferrerPolicy;
  timeoutMs?: number;
  bypassCache?: boolean;
}

export function validateImageUrl(url: string): {
  valid: boolean;
  errorCode?: UrlErrorCode;
  cleanUrl?: string;
} {
  const trimmed = url.trim();
  if (!trimmed) {
    return { valid: false, errorCode: 'EMPTY_URL' };
  }

  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, errorCode: 'INVALID_PROTOCOL' };
    }
    return { valid: true, cleanUrl: trimmed };
  } catch {
    return { valid: false, errorCode: 'INVALID_FORMAT' };
  }
}

export async function runHotlinkTest(options: RunTestOptions): Promise<TestResult> {
  const { url, referrerPolicy, timeoutMs = 9000, bypassCache = true } = options;
  const startTime = performance.now();

  const validated = validateImageUrl(url);
  if (!validated.valid || !validated.cleanUrl) {
    return {
      status: 'error',
      url,
      testedAt: Date.now(),
      durationMs: 0,
      referrerPolicy,
      errorMessage: validated.errorCode,
      explanationTitle: '',
      explanationText: '',
      recommendations: [],
    };
  }

  const cleanUrl = validated.cleanUrl;
  let testUrl = cleanUrl;
  if (bypassCache) {
    const separator = cleanUrl.includes('?') ? '&' : '?';
    testUrl = `${cleanUrl}${separator}_hlt=${Date.now()}`;
  }

  return new Promise<TestResult>((resolve) => {
    let resolved = false;
    const img = new Image();

    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
      clearTimeout(timer);
    };

    const finish = (result: TestResult) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(result);
    };

    const timer = setTimeout(() => {
      const durationMs = Math.round(performance.now() - startTime);
      finish({
        status: 'inconclusive',
        url: cleanUrl,
        testedAt: Date.now(),
        durationMs,
        referrerPolicy,
        explanationTitle: '',
        explanationText: '',
        recommendations: [],
      });
    }, timeoutMs);

    img.referrerPolicy = referrerPolicy;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const durationMs = Math.round(performance.now() - startTime);
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      finish({
        status: 'allowed',
        url: cleanUrl,
        testedAt: Date.now(),
        durationMs,
        width,
        height,
        referrerPolicy,
        explanationTitle: '',
        explanationText: '',
        recommendations: [],
      });
    };

    img.onerror = () => {
      const durationMs = Math.round(performance.now() - startTime);

      finish({
        status: 'blocked',
        url: cleanUrl,
        testedAt: Date.now(),
        durationMs,
        referrerPolicy,
        explanationTitle: '',
        explanationText: '',
        recommendations: [],
      });
    };

    img.src = testUrl;
  });
}
