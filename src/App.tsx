import { Route, Routes, useLocation } from 'react-router';
import { AppShell } from './components/AppShell';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductsPage, ProductDetailPage, SalesChannelsPage } from './pages/ProductsPage';
import { SubscriptionPage, SubscriptionStatusPage } from './pages/SubscriptionPage';
import { SettingsPage, PrivacyPage } from './pages/SettingsPage';
import { findScreen, screens } from './routes/screens';
import { SurveyPage } from './pages/SurveyPage';
import { ResultsPage } from './pages/ResultsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { BrushingPage } from './pages/BrushingPage';
import { BrushingDetailPage } from './pages/BrushingDetailPage';
import { DevicePage } from './pages/DevicePage';
import { VideoPage } from './pages/VideoPage';

export function App() {
  const { pathname } = useLocation();
  return (
    <AppShell screen={findScreen(pathname)}>
      <Routes>
        {screens.map((screen) => <Route key={screen.id} path={screen.path} element={
          screen.id === 'S01' ? <HomePage /> : screen.id === 'S02' ? <SurveyPage />
            : screen.id === 'S03' ? <ResultsPage /> : screen.id === 'S04' ? <ResultsPage adviceOnly />
              : screen.id === 'S05' ? <RecommendationsPage /> : screen.id === 'S06' ? <BrushingPage />
                : screen.id === 'S07' ? <BrushingDetailPage /> : screen.id === 'S11' ? <DevicePage />
                  : screen.id === 'S12' ? <VideoPage /> : screen.id === 'S08' ? <ProductsPage />
                    : screen.id === 'S09' ? <ProductDetailPage /> : screen.id === 'S10' ? <SubscriptionPage />
                      : screen.id === 'S10a' ? <SubscriptionStatusPage /> : screen.id === 'S13' ? <SettingsPage />
                        : screen.id === 'S13a' ? <PrivacyPage /> : <SalesChannelsPage />
        } />)}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
