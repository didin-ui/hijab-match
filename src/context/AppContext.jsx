import { createContext, useContext, useState } from 'react';
import { useCatalog } from '../hooks/useCatalog.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Catalog loaded once at app start (Google Sheets or fallback)
  const { catalog, loading: catalogLoading, source: catalogSource, error: catalogError } = useCatalog();

  function resetState() {
    setAnalysisResult(null);
    setImagePreview(null);
    setUploadedFile(null);
  }

  return (
    <AppContext.Provider
      value={{
        analysisResult, setAnalysisResult,
        imagePreview, setImagePreview,
        uploadedFile, setUploadedFile,
        catalog, catalogLoading, catalogSource, catalogError,
        resetState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
