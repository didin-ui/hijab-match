import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Landing from './pages/Landing.jsx';
import Upload from './pages/Upload.jsx';
import Analyzing from './pages/Analyzing.jsx';
import Results from './pages/Results.jsx';
import ManualMatch from './pages/ManualMatch.jsx';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-dvh gradient-bg">
          {/* Constrain to mobile-first width, center on desktop */}
          <div className="mx-auto max-w-md min-h-dvh flex flex-col">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/analyzing" element={<Analyzing />} />
              <Route path="/results" element={<Results />} />
              <Route path="/manual" element={<ManualMatch />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
