import home from "./home.module.css";
import timesaving from "../../assets/time.png";
import highquality from "../../assets/highQuality.png";
import homeworks from "../../assets/exams.png";
import qanda from "../../assets/faq.png";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
function HomeBenefits() {
  return (
    <div className={home.services}>
      {/* <img src={services_banner} alt="banner" /> */}
      <Swiper
        style={{ width: "100%", height: "fit-content" }}
        // install Swiper modules
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
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
      </Swiper>
      {/* <div className={home.services_banner}></div> */}
    </div>
  );
}

export default HomeBenefits;
