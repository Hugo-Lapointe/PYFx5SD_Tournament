
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="admin-loading">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!ADMIN_UID || user.uid !== ADMIN_UID) {
    return (
      <div className="admin-loading">
        Access denied. This account is not authorized.
      </div>
    );
  }

  return children;
}
