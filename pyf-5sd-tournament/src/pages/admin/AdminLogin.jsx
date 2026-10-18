
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { auth } from "../../firebase";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (
        !import.meta.env.VITE_ADMIN_UID ||
        credential.user.uid !== import.meta.env.VITE_ADMIN_UID
      ) {
        await auth.signOut();
        setError("This account does not have admin access.");
        return;
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Admin login failed:", err.code);
      setError("Unable to sign in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-icon">
          <LockKeyhole size={28} />
        </div>

        <p className="admin-eyebrow">
          PYF × 5SD · MANAGEMENT
        </p>

        <h1>
          ADMIN <span>PORTAL</span>
        </h1>

        <p className="admin-login-description">
          Sign in to manage tournament results and operations.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="admin-email">Email address</label>

          <div className="admin-input-wrap">
            <Mail size={18} />
            <input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <label htmlFor="admin-password">Password</label>

          <div className="admin-input-wrap">
            <LockKeyhole size={18} />
            <input
              id="admin-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="admin-login-footer">
          Authorized tournament staff only
        </p>
      </div>
    </main>
  );
}
