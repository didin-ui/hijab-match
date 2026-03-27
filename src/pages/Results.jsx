import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

function ColorSwatch({ color }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-12 h-12 rounded-2xl shadow-sm border border-black/5"
        style={{ backgroundColor: color.hex }}
        title={color.name}
      />
      <span className="text-xs text-stone-500 font-sans text-center leading-tight max-w-[56px]">
        {color.name}
      </span>
      <span className="text-[10px] text-stone-300 font-mono">{color.hex}</span>
    </div>
  );
}

function HijabCard({ hijab, index }) {
  const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p);

  return (
    <div
      className="card overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Product image area */}
      <div
        className="h-40 w-full flex items-center justify-center relative"
        style={{ backgroundColor: hijab.hex_color + '33' }}
      >
        <div
          className="w-24 h-24 rounded-2xl shadow-md border border-black/5"
          style={{ backgroundColor: hijab.hex_color }}
        />
        {/* Stock badge */}
        {hijab.stock && (
          <span className="absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
            Tersedia
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-serif font-semibold text-stone-800 text-base leading-tight">
            {hijab.name}
          </h3>
          <span className="text-[10px] bg-latte-light text-caramel font-medium px-2 py-0.5 rounded-full whitespace-nowrap ml-2 mt-0.5">
            {hijab.color_label}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0"
            style={{ backgroundColor: hijab.hex_color }}
          />
          <span className="text-xs text-stone-400 font-mono">{hijab.hex_color}</span>
          <span className="text-xs text-stone-300">·</span>
          <span className="text-xs text-stone-400">{hijab.category}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-sans font-semibold text-stone-700 text-sm">
            {formatPrice(hijab.price)}
          </span>
          <a
            href={hijab.shop_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-caramel text-white text-xs font-medium px-4 py-2 rounded-xl
                       hover:bg-opacity-90 transition-all active:scale-95 shadow-sm"
          >
            Shop This Color
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const { analysisResult, imagePreview, resetState } = useApp();
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike'

  // Guard: if no result, redirect
  useEffect(() => {
    if (!analysisResult) {
      navigate('/', { replace: true });
    }
  }, [analysisResult, navigate]);

  if (!analysisResult) return null;

  const { detectedColors, recommendations } = analysisResult;

  function handleTryAnother() {
    resetState();
    navigate('/upload', { replace: true });
  }

  function handleHome() {
    resetState();
    navigate('/', { replace: true });
  }

  function handleFeedback(type) {
    setFeedback(type);
    // TODO Phase 2: POST /api/feedback with { type, result_id }
  }

  return (
    <main className="flex flex-col flex-1 px-5 py-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleHome}
          aria-label="Beranda"
          className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-600 hover:bg-cream-dark transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="text-center">
          <h1 className="font-serif text-xl font-bold text-stone-800">Your Perfect Match</h1>
          <p className="text-xs text-stone-400">Rekomendasi hijab untuk kamu</p>
        </div>
        {/* Share button (Phase 3 placeholder) */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Eclif Match', text: 'Cek rekomendasi hijab saya dari Eclif Match!', url: window.location.href });
            }
          }}
          aria-label="Bagikan"
          className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-600 hover:bg-cream-dark transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      {/* Detected Colors Section */}
      {detectedColors?.length > 0 && (
        <section className="card p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            {imagePreview && (
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                <img src={imagePreview} alt="Outfit" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h2 className="font-sans font-semibold text-stone-700 text-sm">Warna Terdeteksi</h2>
              <p className="text-xs text-stone-400">Dari outfit kamu</p>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            {detectedColors.map((color, i) => (
              <ColorSwatch key={i} color={color} />
            ))}
          </div>
        </section>
      )}

      {/* Recommendations Grid */}
      <section className="mb-5">
        <h2 className="font-serif text-lg font-semibold text-stone-800 mb-3">
          Rekomendasi Hijab
          <span className="ml-2 text-sm font-sans font-normal text-stone-400">
            ({recommendations.length} pilihan)
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {recommendations.map((hijab, i) => (
            <HijabCard key={hijab.product_id} hijab={hijab} index={i} />
          ))}
        </div>
      </section>

      {/* Feedback */}
      <section className="card p-4 mb-5 text-center">
        <p className="text-sm text-stone-600 mb-3 font-sans">Seberapa cocok rekomendasinya?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleFeedback('like')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 text-sm font-medium transition-all ${
              feedback === 'like'
                ? 'bg-green-50 border-green-400 text-green-700'
                : 'border-stone-200 text-stone-500 hover:border-green-300'
            }`}
          >
            <span>👍</span> Cocok
          </button>
          <button
            onClick={() => handleFeedback('dislike')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 text-sm font-medium transition-all ${
              feedback === 'dislike'
                ? 'bg-red-50 border-red-300 text-red-600'
                : 'border-stone-200 text-stone-500 hover:border-red-200'
            }`}
          >
            <span>👎</span> Kurang
          </button>
        </div>
        {feedback && (
          <p className="text-xs text-stone-400 mt-2 animate-fade-in">
            {feedback === 'like' ? 'Senang bisa membantu! ✨' : 'Terima kasih! Kami akan terus belajar.'}
          </p>
        )}
      </section>

      {/* Try Another */}
      <button onClick={handleTryAnother} className="btn-primary flex items-center justify-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 .49-4.7L1 10" />
        </svg>
        Coba Outfit Lain
      </button>
    </main>
  );
}
