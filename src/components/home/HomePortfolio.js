import React from "react";
import home from "./home.module.css";
import { motion } from "framer-motion";
import portfoliolottie from "../../assets/portfolioPgLottie.json";
import { DotLottiePlayer } from "@dotlottie/react-player";
import portfolioimg from "../../assets/portfolio_img.png";
import portfolioimgmini from "../../assets/portfolio_img_mini.png";
const HomePortfolio = () => {
  const animate = {
    hidden: {
      y: "-100px",
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: "0",
      opacity: 1,
      scale: 1,
      transition: {
        duration: "0.3",
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
  };

  return (
    <motion.div
      variants={animate}
      initial="hidden"
      animate="visible"
      className={home.portfolio}
    >
      {window.innerWidth >= 450 ? (
        <>
          <div className={home.scroll}>
            <span>Scroll</span>
            <span></span>
          </div>
          <div className={home.portfolio_img}>
            <img src={portfolioimg} alt="personal img" loading="lazy" />
          </div>
          <div className={home.text}>
            <div className={home.portofolio_lottie}>
              <DotLottiePlayer
                src={portfoliolottie}
                autoplay
                loop
              ></DotLottiePlayer>
            </div>
            <h1>Dr \</h1>
            <h2>hmed Salama</h2>
            <span>The ideal in chemistry</span>
          </div>
        </>
      ) : (
        <>
          <div className={home.text}>
            <div className={home.portofolio_lottie}>
              <DotLottiePlayer
                src={portfoliolottie}
                autoplay
                loop
              ></DotLottiePlayer>
            </div>
            <h1>Dr \</h1>
            <h2>hmed Salama</h2>
            <span>The ideal in chemistry</span>
          </div>
          <div className={home.portfolio_img}>
            <img src={portfolioimgmini} alt="personal img" loading="lazy" />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default HomePortfolio;
