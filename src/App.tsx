import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./components/shared/Navbar";
import { Footer } from "./components/shared/Footer";
import { QuickBookingWidget } from "./components/shared/QuickBookingWidget";
import { AdminRouteGuard } from "./components/admin/AdminRouteGuard";
import { HomePage } from "./pages/HomePage";
import { BookingPage } from "./pages/BookingPage";
import { ContactPage } from "./pages/ContactPage";

const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage").then((module) => ({ default: module.AdminLoginPage })));
const AdminDashboardPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage").then((module) => ({ default: module.AdminDashboardPage }))
);
const AdminBookingsPage = lazy(() => import("./pages/admin/AdminBookingsPage").then((module) => ({ default: module.AdminBookingsPage })));
const AdminCalendarPage = lazy(() => import("./pages/admin/AdminCalendarPage").then((module) => ({ default: module.AdminCalendarPage })));
const AdminWalkthroughPage = lazy(() =>
  import("./pages/admin/AdminWalkthroughPage").then((module) => ({ default: module.AdminWalkthroughPage }))
);

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 }
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.main
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.35 }}
  >
    {children}
  </motion.main>
);

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <div className="flex-1">{children}</div>
    <Footer />
    <QuickBookingWidget />
  </div>
);

const AdminPageFallback = () => <div className="section-padding">Loading admin page...</div>;

const App = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PublicLayout>
              <PageWrapper>
                <HomePage />
              </PageWrapper>
            </PublicLayout>
          }
        />
        <Route
          path="/booking"
          element={
            <PublicLayout>
              <PageWrapper>
                <BookingPage />
              </PageWrapper>
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <PageWrapper>
                <ContactPage />
              </PageWrapper>
            </PublicLayout>
          }
        />
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminPageFallback />}>
              <PageWrapper>
                <AdminLoginPage />
              </PageWrapper>
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminPageFallback />}>
              <PageWrapper>
                <AdminLoginPage />
              </PageWrapper>
            </Suspense>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<AdminPageFallback />}>
              <AdminRouteGuard>
                <PageWrapper>
                  <AdminDashboardPage />
                </PageWrapper>
              </AdminRouteGuard>
            </Suspense>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <Suspense fallback={<AdminPageFallback />}>
              <AdminRouteGuard>
                <PageWrapper>
                  <AdminBookingsPage />
                </PageWrapper>
              </AdminRouteGuard>
            </Suspense>
          }
        />
        <Route
          path="/admin/calendar"
          element={
            <Suspense fallback={<AdminPageFallback />}>
              <AdminRouteGuard>
                <PageWrapper>
                  <AdminCalendarPage />
                </PageWrapper>
              </AdminRouteGuard>
            </Suspense>
          }
        />
        <Route
          path="/admin/walkthrough"
          element={
            <Suspense fallback={<AdminPageFallback />}>
              <AdminRouteGuard>
                <PageWrapper>
                  <AdminWalkthroughPage />
                </PageWrapper>
              </AdminRouteGuard>
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
