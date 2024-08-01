import React from "react";
import home from "./home.module.css";
import timesaving from "../../assets/time.png";
import highquality from "../../assets/highQuality.png";
import homeworks from "../../assets/exams.png";
import qanda from "../../assets/faq.png";
import services_banner from "../../assets/view-3d-male-chemist-lab.png";
import { motion } from "framer-motion";

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
          <img src={timesaving} alt="service_img" />
          <p>وفر وقتك الغالي</p>
        </motion.div>

        <motion.div
          variants={animate}
          initial="hidden"
          animate="visible"
          className={home.card}
        >
          <img src={highquality} alt="service_img" />
          <p>محتوى على اعلى مستوى</p>
        </motion.div>

        <motion.div
          variants={animate}
          initial="hidden"
          animate="visible"
          className={home.card}
        >
          <img src={homeworks} alt="service_img" />

          <p>واجبات و امتحانات دورية</p>
        </motion.div>
        <motion.div
          variants={animate}
          initial="hidden"
          animate="visible"
          className={home.card}
          style={{ zIndex: 2 }}
        >
          <img src={qanda} alt="service_img" />

          <p>اسأل و احنا نجاوبك</p>
        </motion.div>
      </div>
      <div className={home.services_banner}></div>
    </div>
  );
}

export default HomeBenefits;
