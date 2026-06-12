import React from "react";
import { Link } from "react-router-dom";
import {
  FaPaintBrush,
  FaUsers,
  FaCloud,
  FaBolt,
  FaArrowRight,
  FaPencilAlt,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import styles from "./index.module.css";

const features = [
  {
    icon: <FaPaintBrush />,
    title: "Freehand Drawing",
    description: "Sketch, draw, and annotate with a natural brush experience.",
  },
  {
    icon: <FaUsers />,
    title: "Real-time Collaboration",
    description: "Share canvases with teammates and draw together live.",
  },
  {
    icon: <FaCloud />,
    title: "Cloud Saved",
    description: "Your boards are saved securely and accessible anywhere.",
  },
  {
    icon: <FaBolt />,
    title: "Instant Tools",
    description: "Shapes, arrows, text, eraser — everything at your fingertips.",
  },
];

const Landing = () => {
  return (
    <div className={styles.page}>
      <div className={styles.bgGradient} />
      <div className={styles.bgGrid} />

      <nav className={styles.nav}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <FaPencilAlt />
          </div>
          <span className={styles.logoText}>SketchBoard</span>
        </div>
        <div className={styles.navLinks}>
          <Link to="/login" className={styles.navLink}>
            Sign In
          </Link>
          <Link to="/register" className={styles.navCta}>
            Get Started
            <FaArrowRight />
          </Link>
        </div>
      </nav>

      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <HiOutlineSparkles />
            <span>Collaborative Whiteboard</span>
          </div>
          <h1 className={styles.title}>
            Think visually.
            <br />
            <span className={styles.titleAccent}>Create together.</span>
          </h1>
          <p className={styles.subtitle}>
            A beautiful, real-time whiteboard for brainstorming, wireframing,
            and visual collaboration. Draw, share, and bring ideas to life.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register" className={styles.primaryBtn}>
              Start for Free
              <FaArrowRight />
            </Link>
            <Link to="/login" className={styles.secondaryBtn}>
              Sign In
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.mockBoard}>
            <div className={styles.mockToolbar}>
              <div className={styles.mockDot} style={{ background: "#ef4444" }} />
              <div className={styles.mockDot} style={{ background: "#f59e0b" }} />
              <div className={styles.mockDot} style={{ background: "#10b981" }} />
            </div>
            <svg className={styles.mockDrawing} viewBox="0 0 400 280" fill="none">
              <path
                d="M40 180 Q80 60 160 120 T280 80 T360 140"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                className={styles.drawPath1}
              />
              <rect
                x="60"
                y="160"
                width="100"
                height="70"
                rx="8"
                stroke="#06b6d4"
                strokeWidth="2.5"
                fill="rgba(6,182,212,0.08)"
                className={styles.drawPath2}
              />
              <circle
                cx="280"
                cy="180"
                r="45"
                stroke="#f59e0b"
                strokeWidth="2.5"
                fill="rgba(245,158,11,0.08)"
                className={styles.drawPath3}
              />
              <path
                d="M180 220 L240 180 L300 210"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                className={styles.drawPath4}
              />
              <text
                x="70"
                y="200"
                fontFamily="Caveat, cursive"
                fontSize="22"
                fill="#6366f1"
                className={styles.drawText}
              >
                Ideas ✨
              </text>
            </svg>
          </div>
          <div className={styles.floatingCard1}>
            <FaUsers />
            <span>Live sync</span>
          </div>
          <div className={styles.floatingCard2}>
            <FaCloud />
            <span>Auto-save</span>
          </div>
        </div>
      </main>

      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Everything you need to create</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <FaPencilAlt />
          <span>SketchBoard</span>
        </div>
        <p>© 2026 SketchBoard. Built for creators.</p>
      </footer>
    </div>
  );
};

export default Landing;
