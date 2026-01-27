import React, { useEffect } from 'react';
import '../styles/main.css';
import { useTheme } from "../components/HeaderBackground";


const Skills = () => {
    const { theme } = useTheme(); 
  

  useEffect(() => {
    function initSkillBarAnimations() {
      if (typeof document === "undefined") return;

      const skillsSection = document.getElementById("skills");
      if (!skillsSection) return;

      const items = [];

      skillsSection.querySelectorAll(".skills__box").forEach((box) => {
        const rateElement = box.querySelector(".skills__box__head__rate");
        const barElement = box.querySelector(".skills__box__line span");

        if (!rateElement || !barElement) return;

        const rateText = (rateElement.textContent || "").trim();
        const match = rateText.match(/(\d+(?:\.\d+)?)/);

        if (!match) return;

        const parsed = parseFloat(match[1]);
        if (Number.isNaN(parsed)) return;

        const clampedRate = Math.min(100, Math.max(0, parsed));

        items.push({ box, bar: barElement, rate: clampedRate });
      });

      if (!items.length) return;

      const supportsWindow = typeof window !== "undefined";
      let prefersReducedMotion = false;

      if (supportsWindow && typeof window.matchMedia === "function") {
        prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }

      // Touch detection
      if (supportsWindow) {
        items.forEach(({ box }) => {
          const removeTouch = () => box.classList.remove("is-touch");

          box.addEventListener("touchstart", () => {
            box.classList.add("is-touch");
          }, { passive: true });

          box.addEventListener("touchend", removeTouch);
          box.addEventListener("touchcancel", removeTouch);
        });
      }

      // Reduced motion users
      if (!supportsWindow || prefersReducedMotion) {
        items.forEach(({ bar, rate }) => {
          bar.style.transition = "none";
          bar.style.width = `${rate}%`;
        });
        return;
      }

      // Reset initial width
      items.forEach(({ bar }) => {
        bar.style.width = "0";
      });

      const schedule =
        typeof window.requestAnimationFrame === "function"
          ? window.requestAnimationFrame.bind(window)
          : (cb) => window.setTimeout(cb, 0);

      const animate = () => {
        schedule(() => {
          items.forEach(({ bar, rate }) => {
            bar.style.width = `${rate}%`;
          });
        });
      };

      const resetBars = () => {
        items.forEach(({ bar }) => {
          bar.style.transition = "none";
          bar.style.width = "0";
        });

        // Force reflow
        void skillsSection.offsetWidth;

        items.forEach(({ bar }) => {
          bar.style.transition = "";
        });
      };

      // Navigation button trigger
      const skillsNavItem = document.getElementById("item-skills");
      if (skillsNavItem) {
        skillsNavItem.addEventListener("click", () => {
          resetBars();
          animate();
        });
      }

      // Start animation immediately on mount
      animate();
    }

    initSkillBarAnimations();
  }, []);

  return (
    <div className="page-section">
      <section className="skills" id="skills" data-theme={theme}>
        <div className="skills-container">
          <h1 className="skills__title text-capitalize">my skills</h1>
          <div className="row justify-content-center gy-0">
 
            {/* COLUMN 1 */}
            <div className="col-md-6">
              <div className="skills__box">
                <div className="skills__box__head">
                  <span className="skills__box__head__lang">GenAI (Agents, LangChain, MCP, FineTuning)</span>
                  <span className="skills__box__head__rate">90%</span>
                </div>
                <div className="skills__box__line">
                  <span data-rate="90"></span>
                </div>
              </div>

              <div className="skills__box">
                <div className="skills__box__head">
                  <span className="skills__box__head__lang">Machine Learning</span>
                  <span className="skills__box__head__rate">85%</span>
                </div>
                <div className="skills__box__line">
                  <span data-rate="80"></span>
                </div>
              </div>

              <div className="skills__box">
                <div className="skills__box__head">
                  <span className="skills__box__head__lang">Data Structures & Algorithms (Python)</span>
                  <span className="skills__box__head__rate">80%</span>
                </div>
                <div className="skills__box__line">
                  <span data-rate="85"></span>
                </div>
              </div>

              <div className="skills__box">
                <div className="skills__box__head">
                  <span className="skills__box__head__lang">Computer Vision & Audio</span>
                  <span className="skills__box__head__rate">70%</span>
                </div>
                <div className="skills__box__line">
                  <span data-rate="95"></span>
                </div>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="col-md-6">
              <div className="skills__box">
                <div className="skills__box__head">
                  <span className="skills__box__head__lang">MLOps / DevOps (Docker, Kubernetes, Terraform)</span>
                  <span className="skills__box__head__rate">90%</span>
                </div>
                <div className="skills__box__line">
                  <span data-rate="70"></span>
                </div>
              </div>

              <div className="skills__box">
                <div className="skills__box__head">
                  <span className="skills__box__head__lang">CI/CD (GitHub Actions, n8n)</span>
                  <span className="skills__box__head__rate">85%</span>
                </div>
                <div className="skills__box__line">
                  <span data-rate="80"></span>
                </div>
              </div>

              <div className="skills__box">
                <div className="skills__box__head">
                  <span className="skills__box__head__lang">Web Development (MERN Stack)</span>
                  <span className="skills__box__head__rate">80%</span>
                </div>
                <div className="skills__box__line">
                  <span data-rate="90"></span>
                </div>
              </div>

              <div className="skills__box">
                <div className="skills__box__head">
                  <span className="skills__box__head__lang">SEO / Hosting</span>
                  <span className="skills__box__head__rate">70%</span>
                </div>
                <div className="skills__box__line">
                  <span data-rate="80"></span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Skills;
