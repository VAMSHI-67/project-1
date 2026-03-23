import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./components/shared/Navbar";
import { Footer } from "./components/shared/Footer";
import { QuickBookingWidget } from "./components/shared/QuickBookingWidget";
import { AdminRouteGuard } from "./components/admin/AdminRouteGuard";
import { HomePage } from "./pages/HomePage";
import { BookingPage } from "./pages/BookingPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminBookingsPage } from "./pages/admin/AdminBookingsPage";
import { AdminCalendarPage } from "./pages/admin/AdminCalendarPage";
import { AdminWalkthroughPage } from "./pages/admin/AdminWalkthroughPage";

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
            <PageWrapper>
              <AdminLoginPage />
            </PageWrapper>
          }
        />
        <Route
          path="/admin"
          element={
            <PageWrapper>
              <AdminLoginPage />
            </PageWrapper>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRouteGuard>
              <PageWrapper>
                <AdminDashboardPage />
              </PageWrapper>
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminRouteGuard>
              <PageWrapper>
                <AdminBookingsPage />
              </PageWrapper>
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/calendar"
          element={
            <AdminRouteGuard>
              <PageWrapper>
                <AdminCalendarPage />
              </PageWrapper>
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/walkthrough"
          element={
            <AdminRouteGuard>
              <PageWrapper>
                <AdminWalkthroughPage />
              </PageWrapper>
            </AdminRouteGuard>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
