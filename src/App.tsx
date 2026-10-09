import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Skeleton } from './components/ui/Skeleton';

// Lazy loaded page views for optimal code-splitting and performance
const OverviewPage = lazy(() =>
  import('./pages/OverviewPage').then((m) => ({ default: m.OverviewPage }))
);
const GoldPage = lazy(() =>
  import('./pages/GoldPage').then((m) => ({ default: m.GoldPage }))
);
const SilverPage = lazy(() =>
  import('./pages/SilverPage').then((m) => ({ default: m.SilverPage }))
);
const PlatinumPage = lazy(() =>
  import('./pages/PlatinumPage').then((m) => ({ default: m.PlatinumPage }))
);
const PalladiumPage = lazy(() =>
  import('./pages/PalladiumPage').then((m) => ({ default: m.PalladiumPage }))
);
const PriceHistoryPage = lazy(() =>
  import('./pages/PriceHistoryPage').then((m) => ({ default: m.PriceHistoryPage }))
);
const DiamondGuidePage = lazy(() =>
  import('./pages/DiamondGuidePage').then((m) => ({ default: m.DiamondGuidePage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const PageLoadingFallback: React.FC = () => (
  <div className="space-y-6 animate-pulse py-4">
    <Skeleton className="h-10 w-64 rounded-lg" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
    </div>
    <Skeleton className="h-80 rounded-xl" />
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <OverviewPage />
              </Suspense>
            }
          />
          <Route
            path="gold"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <GoldPage />
              </Suspense>
            }
          />
          <Route
            path="silver"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <SilverPage />
              </Suspense>
            }
          />
          <Route
            path="platinum"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <PlatinumPage />
              </Suspense>
            }
          />
          <Route
            path="palladium"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <PalladiumPage />
              </Suspense>
            }
          />
          <Route
            path="history"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <PriceHistoryPage />
              </Suspense>
            }
          />
          <Route
            path="diamond-guide"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <DiamondGuidePage />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
