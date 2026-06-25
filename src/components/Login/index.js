import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaPencilAlt, FaArrowRight } from "react-icons/fa";
import styles from "./index.module.css";
import boardContext from "../../store/board-context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserLoginStatus } = useContext(boardContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("whiteboard_user_token", data.token);
        setUserLoginStatus(true);
        
        
        
        
        
        window.location.href = "/"; 
      }else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.brandSide}>
          <div className={styles.brandContent}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <FaPencilAlt />
              </div>
              <span>SketchBoard</span>
            </Link>
            <h1 className={styles.brandTitle}>Welcome back</h1>
            <p className={styles.brandSubtitle}>
              Sign in to access your canvases and continue creating with your
              team in real time.
            </p>
            <div className={styles.brandIllustration}>
              <svg viewBox="0 0 300 200" fill="none" className={styles.illustration}>
                <rect x="20" y="40" width="260" height="140" rx="12" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <path d="M50 130 Q90 60 150 100 T250 70" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <rect x="60" y="110" width="70" height="45" rx="6" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="rgba(255,255,255,0.05)" />
                <circle cx="210" cy="120" r="30" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="rgba(255,255,255,0.05)" />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.formSide}>
          <div className={styles.formWrapper}>
            <h2 className={styles.formTitle}>Sign in</h2>
            <p className={styles.formSubtitle}>
              Enter your credentials to access your account
            </p>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email address</label>
                <div className={styles.inputWrapper}>
                  <FaEnvelope className={styles.inputIcon} />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  <>
                    Sign In
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            <p className={styles.footerText}>
              Don&apos;t have an account?{" "}
              <Link to="/register">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;