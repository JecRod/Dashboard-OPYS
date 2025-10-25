import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "../Api-Config"; // 👈 adjust path
import styles from "../module/Login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        API_CONFIG.BASE_URL + API_CONFIG.ENDPOINT.LOGIN,
        { email, password }
      );

      if (response.status !== 200) {
        setError("Login failed. Please try again.");
        return;
      }

      // ✅ Save token
      localStorage.setItem("login_token", response.data.token);

      // ✅ Redirect to home
      navigate("/");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.logo}>
            <h3>KaiaAdmin</h3>
            <p className={styles.textMuted}>Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formFooter}>
              <div className={styles.checkbox}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className={styles.link}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className={styles.signup}>
            <p className={styles.textMuted}>
              Don't have an account? <a href="#">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
