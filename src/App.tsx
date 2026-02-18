import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { AgeGate } from "@/components/AgeGate";
import Index from "./pages/Index";
import PremiumBrandsPage from "./pages/PremiumBrandsPage";
import ShippingInfoPage from "./pages/ShippingInfoPage";
import WhyChooseUsPage from "./pages/WhyChooseUsPage";
import StrengthsGuidePage from "./pages/StrengthsGuidePage";
import TobaccoFreePage from "./pages/TobaccoFreePage";
import FAQPage from "./pages/FAQPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminMetadata from "./pages/admin/AdminMetadata";
import AdminMenus from "./pages/admin/AdminMenus";
import AdminPages from "./pages/admin/AdminPages";
import AdminLearnMore from "./pages/admin/AdminLearnMore";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCarts from "./pages/admin/AdminCarts";
import PageEditor from "./pages/admin/PageEditor";
import DynamicPage from "./pages/DynamicPage";
// Italian Pages
import SnusBrandsPage from "./pages/SnusBrandsPage";
import SnusCoSeItPage from "./pages/SnusCoSeItPage";
import SpedizioneSnusPage from "./pages/SpedizioneSnusPage";
import PercheSceglierePouchesitalyPage from "./pages/PercheSceglierePouchesitalyPage";
import GuidaIntensitaGustiPage from "./pages/GuidaIntensitaGustiPage";
import SnusVsNicotinePouchesPage from "./pages/SnusVsNicotinePouchesPage";
import DomandeFrequentiSnusPage from "./pages/DomandeFrequentiSnusPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AnalyticsProvider>
            <TooltipProvider>
              <AgeGate />
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute requireAdmin>
                  <AdminProducts />
                </ProtectedRoute>
              } />
              <Route path="/admin/metadata" element={
                <ProtectedRoute requireAdmin>
                  <AdminMetadata />
                </ProtectedRoute>
              } />
              <Route path="/admin/menus" element={
                <ProtectedRoute requireAdmin>
                  <AdminMenus />
                </ProtectedRoute>
              } />
              <Route path="/admin/pages" element={
                <ProtectedRoute requireAdmin>
                  <AdminPages />
                </ProtectedRoute>
              } />
              <Route path="/admin/pages/:id" element={
                <ProtectedRoute requireAdmin>
                  <PageEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/learn-more" element={
                <ProtectedRoute requireAdmin>
                  <AdminLearnMore />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/carts" element={
                <ProtectedRoute requireAdmin>
                  <AdminCarts />
                </ProtectedRoute>
              } />
              {/* Dynamic Pages */}
              <Route path="/p/:slug" element={<DynamicPage />} />
              {/* English Pages */}
              <Route path="/premium-brands" element={<PremiumBrandsPage />} />
              <Route path="/shipping-info" element={<ShippingInfoPage />} />
              <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
              <Route path="/strengths-guide" element={<StrengthsGuidePage />} />
              <Route path="/tobacco-free" element={<TobaccoFreePage />} />
              <Route path="/faq" element={<FAQPage />} />
              {/* Italian Pages */}
              <Route path="/snus-brands" element={<SnusBrandsPage />} />
              <Route path="/snus-cose" element={<SnusCoSeItPage />} />
              <Route path="/spedizione-snus" element={<SpedizioneSnusPage />} />
              <Route path="/perche-scegliere-pouchesitaly" element={<PercheSceglierePouchesitalyPage />} />
              <Route path="/guida-intensita-gusti" element={<GuidaIntensitaGustiPage />} />
              <Route path="/snus-vs-nicotine-pouches" element={<SnusVsNicotinePouchesPage />} />
                <Route path="/domande-frequenti-snus" element={<DomandeFrequentiSnusPage />} />
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AnalyticsProvider>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
