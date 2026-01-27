import React, { useEffect } from 'react'
import '../styles/main.css'
import { useTheme } from "../components/HeaderBackground";

const Services = () => {
  const { theme } = useTheme(); 

  useEffect(() => {
    const icons = document.querySelectorAll(".services__wrapper__icons__item");
    const iconsWrapper = document.querySelector(".services__wrapper__icons");

    icons.forEach((div, index) => {
      const classes = [
        "deg-45",
        "deg-90",
        "deg-135",
        "deg-180",
        "deg-230",
        "deg-270",
      ];
      div.classList.add(classes[index]);
    });

    setTimeout(() => {
      if (iconsWrapper) {
        iconsWrapper.style.zIndex = "1";
      }
    }, 400); 

  }, []);

  return (
    <div className="page-section">
      {/* ADDED data-theme HERE */}
      <section className="services" id="services" data-theme={theme}>
        <div className="services__wrapper">
          <h1 className="services__wrapper__title">Services</h1>
          <div className="services__wrapper__circle rounding"></div>

          <div className="services__wrapper__icons" id="icon-div">
            <div className="services__wrapper__icons__item " data-service-name="AI Systems">
              <i className="demo-icon desktopicon-"></i>
            </div>

            <div className="services__wrapper__icons__item" data-service-name="Web Development">
              <i className="demo-icon codeicon-"></i>
            </div>

            <div className="services__wrapper__icons__item" data-service-name="UI / UX">
              <i className="demo-icon penicon-"></i>
            </div>

            <div className="services__wrapper__icons__item" data-service-name="Cloud Integration">
              <i className="demo-icon searchicon-"></i>
            </div>

            <div className="services__wrapper__icons__item" data-service-name="API Automation">
              <i className="demo-icon doc-texticon-"></i>
            </div>

            <div className="services__wrapper__icons__item" data-service-name="Deployment & Hosting">
              <i className="demo-icon servericon-"></i>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;