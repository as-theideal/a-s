import home from "./home.module.css";
import timesaving from "../../assets/time.png";
import highquality from "../../assets/highQuality.png";
import homeworks from "../../assets/exams.png";
import qanda from "../../assets/faq.png";
import { useRef, useState } from "react";

import {
  Navigation,
  Pagination,
  EffectCreative,
  Autoplay,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-creative";

function HomeBenefits() {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  const [activeSlide, setActiveSlide] = useState(0);
  return (
    <div className={home.services}>
      <Swiper
        modules={[Pagination, EffectCreative, Autoplay]}
        effect={"creative"}
        loop={true}
        grabCursor={true}
        creativeEffect={{
          prev: {
            shadow: false,
            translate: [0, 0, -4000],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        }}
        slidesPerView={1}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        pagination={{ clickable: true, dynamicBullets: true }}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
      >
        <SwiperSlide>
          <div className={home.card}>
            <img src={timesaving} alt="service_img" />
            <p>وفر وقتك الغالي</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={home.card}>
            <img src={highquality} alt="service_img" />
            <p>محتوى على اعلى مستوى</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={home.card}>
            <img src={homeworks} alt="service_img" />

            <p>واجبات و امتحانات دورية</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={home.card} style={{ zIndex: 2 }}>
            <img src={qanda} alt="service_img" />

            <p>اسأل و احنا نجاوبك</p>
          </div>
        </SwiperSlide>
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
      {/* <div className={home.services_banner}></div> */}
    </div>
  );
}

export default HomeBenefits;
