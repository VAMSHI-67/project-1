import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "./firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let unsubscribeAdmin: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      unsubscribeAdmin?.();
      unsubscribeAdmin = undefined;
      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const bootstrapAdminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      if (currentUser.email && currentUser.email === bootstrapAdminEmail) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      unsubscribeAdmin = onSnapshot(
        doc(db, "adminUsers", currentUser.uid),
        (snapshot) => {
          setIsAdmin(snapshot.exists() && snapshot.data()?.isActive === true);
          setLoading(false);
        },
        () => {
          setIsAdmin(false);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAdmin?.();
      unsubscribeAuth();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      login: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
      },
      logout: async () => {
        await signOut(auth);
      }
    }),
    [isAdmin, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
