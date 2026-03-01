import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import EditorLayout from './features/editor/EditorLayout';
import ToastContainer from './components/ui/ToastContainer';
import CommandPalette from './features/command-palette/CommandPalette';

const PreviewPage = lazy(() => import('./features/preview/PreviewPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditorLayout />} />
        <Route
          path="/preview"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[var(--pv-bg)]"><p>Loading preview...</p></div>}>
              <PreviewPage />
            </Suspense>
          }
        />
      </Routes>
      <ToastContainer />
      <CommandPalette />
    </BrowserRouter>
  );
}
