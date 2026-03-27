import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { findMatchingHijabs, hexToRgb } from '../utils/colorMatching.js';

const PRESET_COLORS = [
  { name: 'Putih', hex: '#FFFFFF' },
  { name: 'Hitam', hex: '#1A1A1A' },
  { name: 'Navy', hex: '#1B2A4A' },
  { name: 'Olive', hex: '#7D7C52' },
  { name: 'Beige', hex: '#E8D8C0' },
  { name: 'Dusty Pink', hex: '#C8A09A' },
  { name: 'Sage', hex: '#8FA88A' },
  { name: 'Cream', hex: '#F5E6D0' },
  { name: 'Maroon', hex: '#7A2A3A' },
  { name: 'Sky Blue', hex: '#7FA9C0' },
];

function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

export default function ManualMatch() {
  const navigate = useNavigate();
  const { setAnalysisResult, setImagePreview, catalog } = useApp();

  const [selectedHex, setSelectedHex] = useState('');
  const [inputHex, setInputHex] = useState('#');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function selectPreset(hex) {
    setSelectedHex(hex);
    setInputHex(hex);
    setError('');
  }

  function handleInputChange(e) {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val.replace('#', '');
    val = val.slice(0, 7);
    setInputHex(val);
    if (isValidHex(val)) {
      setSelectedHex(val);
      setError('');
    }
  }

  async function handleMatch() {
    const hex = isValidHex(inputHex) ? inputHex : selectedHex;
    if (!hex) {
      setError('Pilih atau masukkan warna outfit kamu dulu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const rgb = hexToRgb(hex);
      const recommendations = findMatchingHijabs([rgb], catalog, 4);
      setAnalysisResult({
        detectedColors: [{ name: 'Warna Pilihan', hex, rgb }],
        recommendations,
      });
      setImagePreview(null);
      navigate('/results', { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal mencocokkan warna.');
    } finally {
      setLoading(false);
    }
  }

  const activeHex = isValidHex(inputHex) ? inputHex : selectedHex;

  return (
    <main className="flex flex-col flex-1 px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/')}
          aria-label="Kembali"
          className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-600 hover:bg-cream-dark transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <h1 className="font-serif text-xl font-bold text-stone-800">Pilih Warna Manual</h1>
          <p className="text-xs text-stone-400">Tanpa upload foto</p>
        </div>
      </div>

      {/* Color preview */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-20 h-20 rounded-2xl shadow-md border border-black/10 flex-shrink-0 transition-colors duration-300"
          style={{ backgroundColor: activeHex || '#E8D8C0' }}
        />
        <div>
          <p className="text-sm text-stone-600 font-sans mb-1">Warna dipilih</p>
          <p className="font-mono text-lg font-semibold text-stone-800">
            {activeHex || '—'}
          </p>
        </div>
      </div>

      {/* HEX input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Masukkan kode warna HEX
        </label>
        <div className="flex gap-3">
          <input
            type="color"
            value={activeHex || '#E8D8C0'}
            onChange={(e) => {
              setSelectedHex(e.target.value);
              setInputHex(e.target.value);
            }}
            className="w-12 h-12 rounded-xl border-2 border-stone-200 cursor-pointer p-0.5"
            title="Pilih warna dari color picker"
          />
          <input
            type="text"
            value={inputHex}
            onChange={handleInputChange}
            placeholder="#B2C4B0"
            maxLength={7}
            className="flex-1 border-2 border-stone-200 rounded-2xl px-4 py-3 font-mono text-base
                       focus:outline-none focus:border-caramel transition-colors bg-white"
          />
        </div>
      </div>

      {/* Preset colors */}
      <div className="mb-8">
        <p className="text-sm font-medium text-stone-700 mb-3">Warna populer</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => selectPreset(c.hex)}
              title={c.name}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-medium transition-all ${
                selectedHex === c.hex
                  ? 'border-caramel bg-cream-dark'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                style={{ backgroundColor: c.hex }}
              />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleMatch}
        disabled={loading || (!activeHex)}
        className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="15" strokeLinecap="round" />
            </svg>
            Mencocokkan...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Temukan Hijab Serasi
          </>
        )}
      </button>
    </main>
  );
}
