import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./components/shared/Navbar";
import { Footer } from "./components/shared/Footer";
import { QuickBookingWidget } from "./components/shared/QuickBookingWidget";
import { HomePage } from "./pages/HomePage";
import { RoomsPage } from "./pages/RoomsPage";
import { RoomDetailPage } from "./pages/RoomDetailPage";
import { BookingPage } from "./pages/BookingPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminBookingsPage } from "./pages/admin/AdminBookingsPage";
import { AdminCalendarPage } from "./pages/admin/AdminCalendarPage";
import { AdminRouteGuard } from "./components/admin/AdminRouteGuard";
import { AuthProvider } from "./lib/auth";

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

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-forest-50">
    <div className="border-b border-forest-100 bg-white/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-display text-lg text-forest-800">GreenNest Admin</span>
      </div>
    </div>
    {children}
  </div>
);

const App = () => {
  const location = useLocation();

  return (
    <AuthProvider>
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
            path="/rooms"
            element={
              <PublicLayout>
                <PageWrapper>
                  <RoomsPage />
                </PageWrapper>
              </PublicLayout>
            }
          />
          <Route
            path="/rooms/:roomId"
            element={
              <PublicLayout>
                <PageWrapper>
                  <RoomDetailPage />
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
              <AdminLayout>
                <PageWrapper>
                  <AdminLoginPage />
                </PageWrapper>
              </AdminLayout>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRouteGuard>
                <AdminLayout>
                  <PageWrapper>
                    <AdminDashboardPage />
                  </PageWrapper>
                </AdminLayout>
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRouteGuard>
                <AdminLayout>
                  <PageWrapper>
                    <AdminBookingsPage />
                  </PageWrapper>
                </AdminLayout>
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/calendar"
            element={
              <AdminRouteGuard>
                <AdminLayout>
                  <PageWrapper>
                    <AdminCalendarPage />
                  </PageWrapper>
                </AdminLayout>
              </AdminRouteGuard>
            }
          />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
};

export default App;
