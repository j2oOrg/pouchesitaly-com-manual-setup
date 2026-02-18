import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { useLanguage } from "@/context/LanguageContext";
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
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import NotFound from "./pages/NotFound";
import { SEOHead } from "@/components/SEOHead";

const queryClient = new QueryClient();
type Locale = "en" | "it";

const NonIndexRoute = ({ children, title, description }: { children: ReactNode; title?: string; description?: string }) => (
  <>
    <SEOHead
      noindex
      defaultTitle={title || "Pouchesitaly - Private Section"}
      defaultDescription={
        description ||
        "This section is restricted and is not indexed by search engines."
      }
    />
    {children}
  </>
);

const LocaleShell = ({ locale }: { locale: Locale }) => {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage(locale);
  }, [locale, setLanguage]);

  return <Outlet />;
};

const AppRoutes = () => (
  <>
    <Route index element={<Index />} />
    {/* Auth */}
    <Route
      path="login"
      element={
        <NonIndexRoute
          title="Pouchesitaly - Login"
          description="Secure login area for staff and administrators. Not indexed for SEO."
        >
          <LoginPage />
        </NonIndexRoute>
      }
    />
    {/* Admin Routes */}
    <Route path="admin" element={
      <NonIndexRoute title="Pouchesitaly - Admin Dashboard" description="Private admin dashboard for managing products and settings.">
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      </NonIndexRoute>
    } />
    <Route path="admin/products" element={
      <NonIndexRoute title="Pouchesitaly - Admin Products" description="Private admin products manager. Not indexed for SEO.">
        <ProtectedRoute requireAdmin>
          <AdminProducts />
        </ProtectedRoute>
      </NonIndexRoute>
    } />
    <Route path="admin/metadata" element={
      <NonIndexRoute title="Pouchesitaly - Admin Metadata" description="Private admin metadata manager. Not indexed for SEO.">
        <ProtectedRoute requireAdmin>
          <AdminMetadata />
        </ProtectedRoute>
      </NonIndexRoute>
    } />
    <Route path="admin/menus" element={
      <NonIndexRoute title="Pouchesitaly - Admin Menus" description="Private admin menu manager. Not indexed for SEO.">
        <ProtectedRoute requireAdmin>
          <AdminMenus />
        </ProtectedRoute>
      </NonIndexRoute>
    } />
    <Route path="admin/pages" element={
      <NonIndexRoute title="Pouchesitaly - Admin Pages" description="Private admin page manager. Not indexed for SEO.">
        <ProtectedRoute requireAdmin>
          <AdminPages />
        </ProtectedRoute>
      </NonIndexRoute>
    } />
    <Route path="admin/pages/:id" element={
      <NonIndexRoute title="Pouchesitaly - Page Editor" description="Private admin page editor. Not indexed for SEO.">
        <ProtectedRoute requireAdmin>
          <PageEditor />
        </ProtectedRoute>
      </NonIndexRoute>
    } />
    <Route path="admin/learn-more" element={
      <NonIndexRoute title="Pouchesitaly - Admin Learn More" description="Private admin learn more content manager. Not indexed for SEO.">
        <ProtectedRoute requireAdmin>
          <AdminLearnMore />
        </ProtectedRoute>
      </NonIndexRoute>
    } />
    <Route path="admin/orders" element={
      <NonIndexRoute title="Pouchesitaly - Admin Orders" description="Private admin orders view. Not indexed for SEO.">
        <ProtectedRoute requireAdmin>
          <AdminCarts />
        </ProtectedRoute>
      </NonIndexRoute>
    } />
    <Route path="admin/users" element={
      <NonIndexRoute title="Pouchesitaly - Admin Users" description="Private admin user manager. Not indexed for SEO.">
        <ProtectedRoute requireAdmin>
          <AdminUsers />
        </ProtectedRoute>
      </NonIndexRoute>
    } />
    <Route path="admin/carts" element={
      <NonIndexRoute title="Pouchesitaly - Admin Carts" description="Private admin cart manager. Not indexed for SEO.">
        <ProtectedRoute requireAdmin>
          <AdminCarts />
        </ProtectedRoute>
      </NonIndexRoute>
    } />
    {/* Dynamic Pages */}
    <Route path="p/:slug" element={<DynamicPage />} />
    {/* English Pages */}
    <Route path="premium-brands" element={<PremiumBrandsPage />} />
    <Route path="shipping-info" element={<ShippingInfoPage />} />
    <Route path="why-choose-us" element={<WhyChooseUsPage />} />
    <Route path="strengths-guide" element={<StrengthsGuidePage />} />
    <Route path="tobacco-free" element={<TobaccoFreePage />} />
    <Route path="faq" element={<FAQPage />} />
    <Route path="privacy" element={<PrivacyPolicyPage />} />
    <Route path="terms" element={<TermsConditionsPage />} />
    {/* Italian Pages */}
    <Route path="snus-brands" element={<SnusBrandsPage />} />
    <Route path="snus-cose" element={<SnusCoSeItPage />} />
    <Route path="spedizione-snus" element={<SpedizioneSnusPage />} />
    <Route path="perche-scegliere-pouchesitaly" element={<PercheSceglierePouchesitalyPage />} />
    <Route path="guida-intensita-gusti" element={<GuidaIntensitaGustiPage />} />
    <Route path="snus-vs-nicotine-pouches" element={<SnusVsNicotinePouchesPage />} />
    <Route path="domande-frequenti-snus" element={<DomandeFrequentiSnusPage />} />
    {/* Catch-all */}
    <Route path="*" element={<NotFound />} />
  </>
);

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
                <Route
                  path="/"
                  element={<LocaleShell locale="it" />}
                >
                  <AppRoutes />
                </Route>
                <Route
                  path="/en"
                  element={<LocaleShell locale="en" />}
                >
                  <AppRoutes />
                </Route>
                <Route
                  path="/it"
                  element={<LocaleShell locale="it" />}
                >
                  <AppRoutes />
                </Route>
              </Routes>
            </TooltipProvider>
          </AnalyticsProvider>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
