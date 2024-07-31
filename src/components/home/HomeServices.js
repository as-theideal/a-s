import React from "react";
import home from "./home.module.css";
import timesaving from "../../assets/save-time.svg";
import highquality from "../../assets/high-quality.svg";
import homeworks from "../../assets/tests.svg";
import qanda from "../../assets/faq.svg";
import services_banner from "../../assets/cartoon-smoke-illustrated.png";
import { motion } from "framer-motion";
import { ReactSVG } from "react-svg";

function HomeBenefits() {
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
        duration: 0.5,
      },
    },
  };
  return (
    <div className={home.services}>
      <img src={services_banner} alt="banner" />
      <div className={home.cards}>
        <motion.div
          variants={animate}
          initial="hidden"
          animate="visible"
          className={home.card}
        >
          <ReactSVG src={timesaving} style={{ top: -70, marginRight: -30 }} />
          <p>وفر وقتك و اتعلم من بيتك</p>
        </motion.div>

        <motion.div
          variants={animate}
          initial="hidden"
          animate="visible"
          className={home.card}
        >
          <ReactSVG src={highquality} style={{ top: -45 }} />
          <p>محتوى على اعلى مستوى</p>
        </motion.div>

        <motion.div
          variants={animate}
          initial="hidden"
          animate="visible"
          className={home.card}
        >
          <ReactSVG src={homeworks} style={{ top: -110, marginRight: -30 }} />

          <p>واجبات و امتحانات دورية</p>
        </motion.div>
        <motion.div
          variants={animate}
          initial="hidden"
          animate="visible"
          className={home.card}
        >
          <ReactSVG src={qanda} style={{ top: -75 }} />

          <p>اسأل و احنا نجاوبك</p>
        </motion.div>
      </div>
      <div className={home.services_banner}></div>
    </div>
  );
}

export default HomeBenefits;
