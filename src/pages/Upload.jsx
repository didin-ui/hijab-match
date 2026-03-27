import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function Upload() {
  const navigate = useNavigate();
  const { setImagePreview, setUploadedFile } = useApp();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  function handleFileSelect(selected) {
    setError('');

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError('Hanya file JPG, PNG, atau WEBP yang diterima.');
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran file maksimal ${MAX_SIZE_MB}MB.`);
      return;
    }

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreview(url);
  }

  function handleInputChange(e) {
    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragging(false), []);

  async function handleAnalyze() {
    if (!file) return;
    setImagePreview(preview);
    setUploadedFile(file);
    navigate('/analyzing');
  }

  function handleRemove() {
    setFile(null);
    setPreview(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }

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
          <h1 className="font-serif text-xl font-bold text-stone-800">Upload Outfit</h1>
          <p className="text-xs text-stone-400">Pilih foto outfit kamu</p>
        </div>
      </div>

      {/* Upload Area */}
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            flex-1 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed
            transition-all duration-200 cursor-pointer min-h-64
            ${dragging
              ? 'border-caramel bg-latte-light scale-[1.01]'
              : 'border-stone-300 bg-white hover:border-caramel hover:bg-cream'}
          `}
        >
          <div className="flex flex-col items-center gap-4 p-8 text-center pointer-events-none">
            <div className="w-16 h-16 rounded-2xl bg-cream-dark flex items-center justify-center">
              <svg className="w-8 h-8 text-caramel" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div>
              <p className="font-sans font-medium text-stone-700 mb-1">
                Tap untuk upload foto
              </p>
              <p className="text-sm text-stone-400">
                atau seret foto ke sini
              </p>
              <p className="text-xs text-stone-300 mt-2">JPG · PNG · WEBP · maks. 5MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          {/* Preview */}
          <div className="relative rounded-3xl overflow-hidden shadow-md bg-white flex-1 min-h-64">
            <img
              src={preview}
              alt="Preview outfit"
              className="w-full h-full object-cover"
              style={{ maxHeight: '360px' }}
            />
            <button
              onClick={handleRemove}
              className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm
                         flex items-center justify-center text-stone-600 shadow-md
                         hover:bg-white transition-colors"
              aria-label="Hapus foto"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-caramel font-medium text-center hover:underline"
          >
            Ganti foto
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Action buttons */}
      <div className="mt-6 flex flex-col gap-3">
        {file ? (
          <button onClick={handleAnalyze} className="btn-primary flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Analyze Colors
          </button>
        ) : (
          <>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Ambil Foto Sekarang
            </button>
          </>
        )}
      </div>
    </main>
  );
}
