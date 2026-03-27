import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { extractDominantColors } from '../utils/colorExtractor.js';
import { findMatchingHijabs } from '../utils/colorMatching.js';

const STEPS = [
  'Membaca foto outfit kamu...',
  'Mendeteksi warna dominan...',
  'Mencocokkan dengan katalog hijab...',
  'Menyiapkan rekomendasimu ✨',
];

export default function Analyzing() {
  const navigate = useNavigate();
  const { setAnalysisResult, imagePreview, uploadedFile, catalog, catalogLoading } = useApp();

  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const hasFetched = useRef(false);

  // Cycle through step text
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (!uploadedFile) {
      navigate('/upload', { replace: true });
      return;
    }

    // Artificial minimum delay so the loading screen is visible
    const minDelay = new Promise((r) => setTimeout(r, 1800));
    // Wait for catalog to finish loading if still in progress
    const waitCatalog = new Promise((r) => {
      if (!catalogLoading) { r(); return; }
      const t = setInterval(() => { if (!catalogLoading) { clearInterval(t); r(); } }, 100);
    });

    const analyze = async () => {
      await waitCatalog;
      const detectedColors = await extractDominantColors(uploadedFile, 3);
      const outfitRgbs = detectedColors.map((c) => c.rgb);
      const recommendations = findMatchingHijabs(outfitRgbs, catalog, 4);
      return { detectedColors, recommendations };
    };

    Promise.all([analyze(), minDelay])
      .then(([result]) => {
        setAnalysisResult(result);
        navigate('/results', { replace: true });
      })
      .catch((err) => {
        setError(err.message || 'Gagal menganalisa gambar. Coba lagi.');
      });
  }, []);

  if (error) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-10 animate-fade-in">
        <div className="card p-8 w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-semibold text-stone-800 mb-2">Ups, ada masalah</h2>
          <p className="text-stone-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate('/upload', { replace: true })}
            className="btn-primary"
          >
            Coba Lagi
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 items-center justify-center px-6 py-10 animate-fade-in">
      {/* Outfit thumbnail (blurred, decorative) */}
      {imagePreview && (
        <div className="relative w-36 h-36 mb-8 rounded-3xl overflow-hidden shadow-lg">
          <img
            src={imagePreview}
            alt="Outfit kamu"
            className="w-full h-full object-cover blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-caramel/20 rounded-3xl" />
        </div>
      )}

      {/* Spinner */}
      <div className="relative w-20 h-20 mb-8">
        <svg
          className="absolute inset-0 animate-spin-slow text-latte"
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" strokeDasharray="200" strokeDashoffset="50" strokeLinecap="round" />
        </svg>
        <svg
          className="absolute inset-0 text-caramel"
          style={{ animation: 'spin 1.5s linear infinite reverse' }}
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="3" strokeDasharray="120" strokeDashoffset="30" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-caramel animate-pulse-soft" />
        </div>
      </div>

      {/* Status text */}
      <div className="text-center">
        <h2 className="font-serif text-2xl font-semibold text-stone-800 mb-3">
          Sedang dianalisa...
        </h2>
        <p key={stepIndex} className="text-stone-500 text-sm animate-fade-in min-h-[1.5rem]">
          {STEPS[stepIndex]}
        </p>
      </div>

      {/* Decorative color dots */}
      <div className="flex gap-2 mt-10">
        {['#B2C4B0', '#C8A09A', '#D4A97A', '#7FA9C0'].map((color, i) => (
          <div
            key={color}
            className="w-5 h-5 rounded-full shadow-sm animate-pulse-soft"
            style={{ backgroundColor: color, animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </main>
  );
}
