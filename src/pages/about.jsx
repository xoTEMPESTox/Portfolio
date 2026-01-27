import React, { useEffect } from "react";
import "../styles/main.css";
import { useTheme } from "../components/HeaderBackground";


const About = () => {
    const { theme } = useTheme(); 
  
  useEffect(() => {
    // same behavior as your original JS
    const triggerAboutInfoIntro = () => {
      if (typeof document === "undefined" || typeof window === "undefined")
        return;

      const aboutSection = document.getElementById("about");
      if (!aboutSection) return;

      const infoBoxes = aboutSection.querySelectorAll(".about__info");
      if (!infoBoxes.length) return;

      const prefersReducedMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Reset classes and styles
      infoBoxes.forEach((box) => {
        box.classList.remove("about__info--intro");
        box.style.removeProperty("--about-info-delay");
      });

      if (prefersReducedMotion) return;

      const baseDelayMs = 400;
      const staggerMs = 120;

      infoBoxes.forEach((box, index) => {
        const delaySeconds = (baseDelayMs + staggerMs * index) / 1000;

        box.style.setProperty("--about-info-delay", `${delaySeconds}s`);

        // Force browser reflow
        void box.offsetWidth;

        box.classList.add("about__info--intro");
      });
    };

    triggerAboutInfoIntro();
  }, []); // runs once on mount

  return (
    <div className="page-section">
      <section className="about" id="about" data-theme={theme}>
        <div className="container">
          <div className="about__layout">
            <div className="about__stack about__stack--left">
              <div className="about__info">
                <span className="about__info__label">Job:</span>
                <span className="about__info__value">
                  Full Stack AI Engineer
                </span> 
              </div>
              <div className="about__info">
                <span className="about__info__label">Degree:</span>
                <span className="about__info__value">
                  B.Tech Honors CS ( AI & ML )
                </span>
              </div>
              <div className="about__info">
                <span className="about__info__label">Address:</span>
                <span className="about__info__value">Mumbai, India</span>
              </div>
              <div className="about__info">
                <span className="about__info__label">Phone:</span>
                <span className="about__info__value">+91 7666774342</span>
              </div>
            </div>

            <div className="about__center">
              <div className="about__img">
                <img
                  src="/assets/images/person/man-2-min.jpg"
                  alt="Professional headshot of Priyanshu Sah"
                  draggable="false"
                  loading="lazy"
                />
              </div>
              <h1 className="about__title">Priyanshu Sah</h1>
            </div>

            <div className="about__stack about__stack--right">
              <div className="about__info">
                <span className="about__info__label">Birthday:</span>
                <span className="about__info__value">8 Nov 2004</span>
              </div>
              <div className="about__info">
                <span className="about__info__label">Experience:</span>
                <span className="about__info__value">1.5 years</span>
              </div>
              <div className="about__info">
                <span className="about__info__label">Email:</span>
                <span className="about__info__value">
                  priyanshu123sah@gmail.com
                </span>
              </div>
              <div className="about__info">
                <span className="about__info__label">Freelance:</span>
                <span className="about__info__value">Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
