import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function Landing() {
  const navigate = useNavigate();
  const { catalog, catalogLoading, catalogSource } = useApp();

  return (
    <main className="flex flex-col h-dvh px-6 py-6 animate-fade-in overflow-hidden">
      {/* Logo / Brand */}
      <header className="text-center pt-2">
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="text-2xl">✦</span>
          <span className="font-serif text-2xl font-semibold text-caramel tracking-wide">
            Eclif Match
          </span>
        </div>
        <p className="text-xs text-stone-400 uppercase tracking-widest font-sans">
          AI Hijab Color Matching
        </p>
      </header>

      {/* Hero — takes remaining space, centers content */}
      <section className="flex-1 flex flex-col items-center justify-center gap-4">
        {/* Decorative swatch stack — smaller */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <div
            className="absolute inset-0 rounded-3xl rotate-12 opacity-40"
            style={{ background: '#C8A09A' }}
          />
          <div
            className="absolute inset-0 rounded-3xl rotate-6 opacity-60"
            style={{ background: '#B2C4B0' }}
          />
          <div
            className="absolute inset-0 rounded-3xl shadow-xl flex items-center justify-center"
            style={{ background: '#D4A97A' }}
          >
            <span className="text-5xl select-none" role="img" aria-label="sparkle">
              ✨
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-stone-800 leading-tight mb-2">
            Find Your
            <span className="block text-caramel">Perfect Match</span>
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">
            Upload foto outfit kamu, AI kami akan rekomendasikan warna hijab yang paling serasi.
          </p>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-stone-400 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Tanpa login
          </span>
          <span className="text-stone-300">·</span>
          <span className="flex items-center gap-1.5 text-xs text-stone-400 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Selesai &lt; 5 detik
          </span>
        </div>

      </section>

      {/* CTAs + Footer — pinned to bottom */}
      <div className="flex flex-col gap-3 pb-2">
        <button
          onClick={() => navigate('/upload')}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Outfit
        </button>

        <button
          onClick={() => navigate('/manual')}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M18.66 5.34l1.41-1.41" />
          </svg>
          Pilih Warna Manual
        </button>

        <p className="text-center text-xs text-stone-400 pt-1">
          Foto kamu tidak disimpan — dianalisa lalu langsung dihapus.
        </p>

        {/* Catalog source indicator */}
        {!catalogLoading && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-sans">
            {catalogSource === 'sheets' ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                <span className="text-blue-400">{catalog.length} produk dari Google Sheets</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-300 inline-block" />
                <span className="text-stone-300">{catalog.length} produk (katalog lokal)</span>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
