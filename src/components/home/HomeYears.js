import React from "react";
import { motion } from "framer-motion";
import home from "./home.module.css";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import first from "../../assets/icons8-first-50.svg";
import second from "../../assets/icons8-medal-second-place-50 (1).svg";
import third from "../../assets/icons8-medal-third-place-50 (1).svg";
import wats from "../../assets/waQrCode.png";
import fb from "../../assets/fb_qr.svg";
import phone from "../../assets/phone.svg";
import { ReactSVG } from "react-svg";

function HomeYears() {
  const animate = {
    hidden: {
      y: "-100px",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: "0.3",
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
  };
  return (
    <>
      <motion.div
        variants={animate}
        initial="hidden"
        animate="visible"
        className={home.years}
      >
        <div className={home.item} style={{ top: 0, right: 0 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="80"
            height="80"
            viewBox="0,0,256,256"
            style={{ fill: "#eee" }}
          >
            <g
              fillRule="nonzero"
              stroke="none"
              strokeWidth="1"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeMiterlimit="10"
              strokeDasharray=""
              strokeDashoffset="0"
              fontFamily="none"
              fontWeight="none"
              fontSize="none"
              textAnchor="none"
            >
              <g
                transform="scale(5.12,5.12)"
                style={{ mixBlendMode: "normal" }}
              >
                <path d="M25,3c-12.15,0 -22,9.85 -22,22c0,11.03 8.125,20.137 18.712,21.728v-15.897h-5.443v-5.783h5.443v-3.848c0,-6.371 3.104,-9.168 8.399,-9.168c2.536,0 3.877,0.188 4.512,0.274v5.048h-3.612c-2.248,0 -3.033,2.131 -3.033,4.533v3.161h6.588l-0.894,5.783h-5.694v15.944c10.738,-1.457 19.022,-10.638 19.022,-21.775c0,-12.15 -9.85,-22 -22,-22z"></path>
              </g>
            </g>
          </svg>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.facebook.com/profile.php?id=61563526142445"
          >
            صفحة الفيسبوك
          </a>
          <img src={fb} alt="facebook QR" />
        </div>

        <div className={home.item} style={{ gridColumnStart: 2 }}>
          <ReactSVG src={phone} fill="#eee" />
          <p>01028282308</p>
        </div>
        <div className={home.item} style={{ top: 0, left: 0 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="80"
            height="80"
            viewBox="0,0,256,256"
          >
            <g
              fillRule="nonzero"
              stroke="none"
              strokeWidth="1"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeMiterlimit="10"
              strokeDasharray=""
              strokeDashoffset="0"
              fontFamily="none"
              fontWeight="none"
              fontSize="none"
              textAnchor="none"
              style={{ mixBlendMode: "normal" }}
            >
              <g transform="scale(5.12,5.12)">
                <path d="M25,2c-12.682,0 -23,10.318 -23,23c0,3.96 1.023,7.854 2.963,11.29l-2.926,10.44c-0.096,0.343 -0.003,0.711 0.245,0.966c0.191,0.197 0.451,0.304 0.718,0.304c0.08,0 0.161,-0.01 0.24,-0.029l10.896,-2.699c3.327,1.786 7.074,2.728 10.864,2.728c12.682,0 23,-10.318 23,-23c0,-12.682 -10.318,-23 -23,-23zM36.57,33.116c-0.492,1.362 -2.852,2.605 -3.986,2.772c-1.018,0.149 -2.306,0.213 -3.72,-0.231c-0.857,-0.27 -1.957,-0.628 -3.366,-1.229c-5.923,-2.526 -9.791,-8.415 -10.087,-8.804c-0.295,-0.389 -2.411,-3.161 -2.411,-6.03c0,-2.869 1.525,-4.28 2.067,-4.864c0.542,-0.584 1.181,-0.73 1.575,-0.73c0.394,0 0.787,0.005 1.132,0.021c0.363,0.018 0.85,-0.137 1.329,1.001c0.492,1.168 1.673,4.037 1.819,4.33c0.148,0.292 0.246,0.633 0.05,1.022c-0.196,0.389 -0.294,0.632 -0.59,0.973c-0.296,0.341 -0.62,0.76 -0.886,1.022c-0.296,0.291 -0.603,0.606 -0.259,1.19c0.344,0.584 1.529,2.493 3.285,4.039c2.255,1.986 4.158,2.602 4.748,2.894c0.59,0.292 0.935,0.243 1.279,-0.146c0.344,-0.39 1.476,-1.703 1.869,-2.286c0.393,-0.583 0.787,-0.487 1.329,-0.292c0.542,0.194 3.445,1.604 4.035,1.896c0.59,0.292 0.984,0.438 1.132,0.681c0.148,0.242 0.148,1.41 -0.344,2.771z"></path>
              </g>
            </g>
          </svg>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://wa.me/message/UJXY3M5BJVTRI1"
          >
            تواصل معانا
          </a>
          <img src={wats} alt="whatsapp QR" />
        </div>

        <div
          className={home.item}
          style={{ gridRowStart: 2, gridColumnStart: 1 }}
        >
          <ReactSVG src={first} style={{ marginTop: -10 }} />
          <NavLink to="years/1">اولى ثانوي</NavLink>
        </div>
        <div
          className={home.item}
          style={{ gridRowStart: 2, gridColumnStart: 2 }}
        >
          <ReactSVG src={second} style={{ marginTop: -10 }} />
          <NavLink to="years/2">ثانية ثانوي</NavLink>
        </div>
        <div
          className={home.item}
          style={{
            gridRowStart: 2,
            gridColumnStart: 3,
          }}
        >
          <ReactSVG src={third} style={{ marginTop: -10 }} />
          <NavLink to="years/3">ثالثة ثانوي</NavLink>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}

export default HomeYears;
