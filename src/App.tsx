/**
 * @license
 * MIT License
 * Copyright (c) 2026 Hotlink Guard Project Contributors (https://github.com/mrbillionaire77/hotlink-guard)
 */

import React, { useState, useEffect, useRef } from 'react';
import { detectInitialLanguage, translations, Language } from './i18n/translations';
import { runHotlinkTest, validateImageUrl } from './utils/hotlinkTester';
import { TestResult, ReferrerPolicy, LocalFileMeta } from './types';
import { Globe, Github, Copy, Check, Sliders } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>(() => detectInitialLanguage());
  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Test state
  const [url, setUrl] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [referrerPolicy, setReferrerPolicy] = useState<ReferrerPolicy>('strict-origin-when-cross-origin');
  const [bypassCache, setBypassCache] = useState<boolean>(true);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Local file state
  const [localFileMeta, setLocalFileMeta] = useState<LocalFileMeta | null>(null);
  const localUrlRef = useRef<string | null>(null);

  // Synchronize html dir & lang attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('hotlink_lang', lang);
    } catch {
      // ignore
    }
  }, [lang, isRtl]);

  // Dynamically update result texts when language is switched
  useEffect(() => {
    if (!result) return;
    setResult((prev) => {
      if (!prev) return null;
      let title = prev.explanationTitle;
      let detail = prev.explanationText;

      const isNoReferer = prev.referrerPolicy === 'no-referrer';
      if (prev.status === 'allowed') {
        title = isNoReferer ? t.resultNoRefererGoodTitle : t.resultGoodTitle;
        detail = isNoReferer ? t.resultNoRefererGoodDetail : t.resultGoodDetail;
      } else if (prev.status === 'blocked') {
        title = isNoReferer ? t.resultNoRefererBadTitle : t.resultBadTitle;
        detail = isNoReferer ? t.resultNoRefererBadDetail : t.resultBadDetail;
      } else if (prev.status === 'inconclusive') {
        title = t.resultInconclusiveTitle;
        detail = t.resultInconclusiveDetail;
      } else if (prev.status === 'error') {
        title = t.resultErrorTitle;
        detail = t.resultErrorDetail;
      }

      return {
        ...prev,
        explanationTitle: title,
        explanationText: detail,
      };
    });
  }, [lang]);

  // Clean local object URLs on unmount
  useEffect(() => {
    return () => {
      if (localUrlRef.current) {
        URL.revokeObjectURL(localUrlRef.current);
      }
    };
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleTest = async (targetUrl?: string, overridePolicy?: ReferrerPolicy) => {
    const rawUrl = (targetUrl !== undefined ? targetUrl : url).trim();
    // Default to strict-origin-when-cross-origin (with Referer) unless overridePolicy is provided
    const policyToUse = overridePolicy !== undefined ? overridePolicy : 'strict-origin-when-cross-origin';

    if (!rawUrl) {
      setResult({
        status: 'error',
        url: '',
        testedAt: Date.now(),
        durationMs: 0,
        referrerPolicy: policyToUse,
        explanationTitle: t.resultErrorTitle,
        explanationText: t.errEmptyUrl,
        recommendations: [],
      });
      return;
    }

    const validation = validateImageUrl(rawUrl);
    if (!validation.valid) {
      let errorMsg = t.errInvalidUrlFormat;
      if (validation.errorCode === 'EMPTY_URL') errorMsg = t.errEmptyUrl;
      else if (validation.errorCode === 'INVALID_PROTOCOL') errorMsg = t.errInvalidProtocol;

      setResult({
        status: 'error',
        url: rawUrl,
        testedAt: Date.now(),
        durationMs: 0,
        referrerPolicy: policyToUse,
        errorMessage: errorMsg,
        explanationTitle: t.resultErrorTitle,
        explanationText: errorMsg,
        recommendations: [],
      });
      return;
    }

    setIsTesting(true);
    setResult(null);

    try {
      const outcome = await runHotlinkTest({
        url: rawUrl,
        referrerPolicy: policyToUse,
        bypassCache,
        timeoutMs: 9000,
      });

      const isNoReferer = policyToUse === 'no-referrer';

      if (outcome.status === 'allowed') {
        outcome.explanationTitle = isNoReferer ? t.resultNoRefererGoodTitle : t.resultGoodTitle;
        outcome.explanationText = isNoReferer ? t.resultNoRefererGoodDetail : t.resultGoodDetail;
      } else if (outcome.status === 'blocked') {
        outcome.explanationTitle = isNoReferer ? t.resultNoRefererBadTitle : t.resultBadTitle;
        outcome.explanationText = isNoReferer ? t.resultNoRefererBadDetail : t.resultBadDetail;
      } else if (outcome.status === 'inconclusive') {
        outcome.explanationTitle = t.resultInconclusiveTitle;
        outcome.explanationText = t.resultInconclusiveDetail;
      }

      setResult(outcome);
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;

    let statusLabel: string = result.status;
    if (result.status === 'allowed') statusLabel = t.reportStatusAllowed;
    else if (result.status === 'blocked') statusLabel = t.reportStatusBlocked;
    else if (result.status === 'error') statusLabel = t.reportStatusError;
    else if (result.status === 'inconclusive') statusLabel = t.reportStatusInconclusive;

    const reportText = `${t.reportHeader}
${t.reportUrl} ${result.url}
${t.reportStatus} ${statusLabel}
${t.reportLatency} ${result.durationMs}ms
${t.reportDimensions} ${result.width && result.height ? `${result.width}x${result.height}` : 'N/A'}
${t.reportPolicy} ${result.referrerPolicy}
${t.reportDetail} ${result.explanationText}
`;
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(t.errInvalidImageFile);
      return;
    }

    if (localUrlRef.current) {
      URL.revokeObjectURL(localUrlRef.current);
      localUrlRef.current = null;
    }

    const objectUrl = URL.createObjectURL(file);
    localUrlRef.current = objectUrl;

    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(width, height);
      const ratio = divisor > 0 ? `${width / divisor}:${height / divisor}` : 'N/A';

      const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      };

      setLocalFileMeta({
        name: file.name,
        sizeBytes: file.size,
        sizeFormatted: formatSize(file.size),
        type: file.type || 'image/*',
        dimensions: { width, height },
        aspectRatio: ratio,
        previewUrl: objectUrl,
      });
    };
    img.src = objectUrl;
  };

  return (
    <main style={{ maxWidth: '680px', margin: 'auto' }}>
      {/* Top Bar / Header */}
      <div className="flex items-center justify-between gap-3 pt-2 pb-1">
        <div className="brand-text">{t.brand}</div>
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-md bg-[#121a2e] border border-[#293650] cursor-pointer transition-colors"
            title="Switch Language / تبديل اللغة"
          >
            <Globe className="w-3.5 h-3.5 text-[#7c83ff]" />
            <span>{t.switchLang}</span>
          </button>

          {/* GitHub repo link */}
          <a
            href="https://github.com/mrbillionaire77/hotlink-guard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-slate-200 p-1 rounded transition-colors inline-flex items-center"
            title={t.repoLink}
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>

      <h1 className="app-h1">{t.title}</h1>
      <p className="app-desc">{t.description}</p>

      {/* PANEL 1: Primary Test */}
      <section className="panel-card">
        <span className="panel-pill">{t.pillBasic}</span>

        <label htmlFor="url" className="text-sm font-semibold block mt-2 mb-1.5">
          {t.urlLabel}
        </label>

        <div className="relative">
          <input
            id="url"
            type="url"
            dir="ltr"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isTesting && handleTest(url, showAdvanced ? referrerPolicy : 'strict-origin-when-cross-origin')}
            placeholder={t.urlPlaceholder}
            autoComplete="url"
            className="custom-input font-mono text-sm"
          />
          {url && (
            <button
              type="button"
              onClick={() => {
                setUrl('');
                setResult(null);
                setReferrerPolicy('strict-origin-when-cross-origin');
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 bg-[#121a2e] px-2 py-0.5 rounded cursor-pointer border border-[#293650]"
            >
              {t.clearBtn}
            </button>
          )}
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-slate-400">
          <span className="text-slate-500">{t.presetsLabel}</span>
          <button
            type="button"
            onClick={() => {
              const u = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png';
              setUrl(u);
              handleTest(u, 'strict-origin-when-cross-origin');
            }}
            className="px-2 py-0.5 rounded bg-[#0b1224] border border-[#293650] hover:border-[#7c83ff] text-slate-300 transition-colors cursor-pointer"
          >
            {t.presets.wikimedia}
          </button>
          <button
            type="button"
            onClick={() => {
              const u = 'https://placehold.co/600x400/121a2e/7c83ff.png?text=Hotlink+Test';
              setUrl(u);
              handleTest(u, 'strict-origin-when-cross-origin');
            }}
            className="px-2 py-0.5 rounded bg-[#0b1224] border border-[#293650] hover:border-[#7c83ff] text-slate-300 transition-colors cursor-pointer"
          >
            {t.presets.placehold}
          </button>
        </div>

        {/* Advanced Options Accordion */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
          >
            <Sliders className="w-3 h-3 text-[#7c83ff]" />
            <span>{t.advancedOptions}</span>
          </button>

          {showAdvanced && (
            <div className="mt-2 p-3 rounded-xl bg-[#0b1224] border border-[#293650] space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-300">{t.referrerPolicyLabel}</span>
                <select
                  value={referrerPolicy}
                  onChange={(e) => setReferrerPolicy(e.target.value as ReferrerPolicy)}
                  className="bg-[#121a2e] border border-[#394763] rounded px-2 py-1 text-slate-200 text-xs"
                >
                  <option value="strict-origin-when-cross-origin">{t.policyStrict}</option>
                  <option value="no-referrer">{t.policyNoReferer}</option>
                  <option value="origin">{t.policyOrigin}</option>
                  <option value="unsafe-url">{t.policyUnsafeUrl}</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#1e2a44]">
                <span className="text-slate-300">{t.bypassCacheLabel}</span>
                <input
                  type="checkbox"
                  checked={bypassCache}
                  onChange={(e) => setBypassCache(e.target.checked)}
                  className="cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Primary Test Button */}
        <button
          type="button"
          disabled={isTesting || !url.trim()}
          onClick={() => handleTest(url, showAdvanced ? referrerPolicy : 'strict-origin-when-cross-origin')}
          className="btn-accent"
        >
          {isTesting ? t.testingBtn : t.testBtn}
        </button>

        {/* Result Container */}
        {result && (
          <div
            className={`result-box ${
              result.status === 'allowed'
                ? 'good-box'
                : result.status === 'blocked'
                ? 'bad-box'
                : 'warn-box'
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <strong className="text-white text-base block">{result.explanationTitle}</strong>
                <p className="mt-1 text-sm text-slate-200 leading-relaxed">
                  {result.explanationText}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyReport}
                className="shrink-0 text-xs bg-black/30 hover:bg-black/50 text-slate-200 px-2.5 py-1 rounded border border-white/10 inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedReport ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedReport ? t.copiedReport : t.copyReport}</span>
              </button>
            </div>

            {/* Performance telemetry row */}
            <div className="flex flex-wrap items-center gap-4 mt-3 pt-2 border-t border-white/10 text-xs text-slate-300 font-mono">
              <span>{t.metricsLatency} <strong className="text-white">{result.durationMs}ms</strong></span>
              {result.width && result.height && (
                <span>{t.metricsDimensions} <strong className="text-white">{result.width}×{result.height}</strong></span>
              )}
              <span className="text-slate-400">({result.referrerPolicy})</span>
            </div>

            {/* Comparison button */}
            {result.status === 'blocked' && result.referrerPolicy !== 'no-referrer' && (
              <div className="mt-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleTest(result.url, 'no-referrer')}
                  className="text-xs text-indigo-300 hover:text-indigo-200 underline cursor-pointer"
                >
                  {t.testWithoutReferer}
                </button>
              </div>
            )}
            {result.referrerPolicy === 'no-referrer' && (
              <div className="mt-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleTest(result.url, 'strict-origin-when-cross-origin')}
                  className="text-xs text-amber-300 hover:text-amber-200 underline cursor-pointer"
                >
                  {t.testWithReferer}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Preview image if loaded */}
        {result && result.status === 'allowed' && (
          <img
            src={result.cacheBustedUrl || result.url}
            alt={t.previewAlt}
            referrerPolicy={result.referrerPolicy}
            className="preview-img"
          />
        )}

        <p className="custom-note">{t.noteUrl}</p>
      </section>

      {/* PANEL 2: Local File Preview */}
      <section className="panel-card">
        <span className="panel-pill">{t.pillLocal}</span>

        <label htmlFor="file" className="text-sm font-semibold block mt-2 mb-1.5">
          {t.fileLabel}
        </label>

        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="custom-input"
        />

        {localFileMeta && (
          <div className="mt-3 p-3 rounded-xl bg-[#0b1224] border border-[#293650] text-xs space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-300">
              <span>{localFileMeta.name}</span>
              <span className="font-mono text-slate-400">{localFileMeta.sizeFormatted}</span>
            </div>
            {localFileMeta.dimensions && (
              <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span>{t.fileDimensions} {localFileMeta.dimensions.width}×{localFileMeta.dimensions.height}</span>
                <span>{t.fileRatio} {localFileMeta.aspectRatio}</span>
                <span>{t.fileMime} {localFileMeta.type}</span>
              </div>
            )}
            <img
              src={localFileMeta.previewUrl}
              alt={t.localPreviewAlt}
              className="preview-img"
            />
          </div>
        )}

        <p className="custom-note">{t.fileNote}</p>
      </section>

      {/* PANEL: How to Read Results & Guides */}
      <section className="panel-card">
        <strong className="text-base text-white block mb-2">{t.howToReadTitle}</strong>
        <p className="app-desc text-sm">{t.howToRead1}</p>
        <p className="custom-note mt-2">{t.howToRead2}</p>

        <div className="mt-4 pt-3 border-t border-[#293650]">
          <strong className="text-sm text-[#aeb8ff] block mb-1">{t.howToVerifyTitle}</strong>
          <p className="text-xs text-slate-300 leading-relaxed">{t.howToVerifyText}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-6 text-center text-xs text-[#8e9bb5] pb-8 space-y-1">
        <div>{t.footerNote}</div>
        <div className="text-[11px] text-slate-500">
          <a
            href="https://github.com/mrbillionaire77/hotlink-guard"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-[#7c83ff]"
          >
            github.com/mrbillionaire77/hotlink-guard
          </a>
        </div>
      </footer>
    </main>
  );
}
