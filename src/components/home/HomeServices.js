import home from "./home.module.css";
import { useEffect, useRef, useState } from "react";
import { DotLottiePlayer } from "@dotlottie/react-player";
import portfoliolottie from "../../assets/Animation - 1732276626901.json";
import Wave from "react-wavify";
function HomeBenefits() {
  const [jobTitle, setJobTitle] = useState("الكيميا في جيبك");
  const jobTitleAnimation = () => {
    let overlay = document.getElementsByClassName("overlay")[0].style;
    const jobs = ["شرح بسيط", "متابعة دورية", "امتحانات دورية", "وفر وقتك"];
    let i = 1;

    setInterval(() => {
      overlay.animationName = "to-right";

      setTimeout(() => {
        setJobTitle(jobs[i]);
        i === jobs.length - 1 ? (i = 0) : ++i;
        overlay.animationName = "to-left";
      }, 1000);
    }, 5000);
  };
  useEffect(() => {
    jobTitleAnimation();
  }, []);

  return (
    <div className={home.services}>
      <div className={home.upperwave}>
        <Wave
          fill="#ff9201"
          paused={false}
          style={{ display: "flex" }}
          options={{
            height: 50,
            amplitude: 40,
            speed: 0.15,
            points: 6,
          }}
        />
      </div>
      <div className={home.lowerwave}>
        <Wave
          fill="#333"
          paused={false}
          style={{ display: "flex" }}
          options={{
            height: 50,
            amplitude: 40,
            speed: 0.15,
            points: 6,
          }}
        />
      </div>

      <div className={home.lottie}>
        <DotLottiePlayer src={portfoliolottie} autoplay loop></DotLottiePlayer>
      </div>
      <div className={home.text}>
        <div className={home.firstH1}>
          <h1>الكيمياء بشكل</h1>
          <span></span>
        </div>
        <h1
          id={home.secondh1}
          style={{
            color: "var(--secondary-color)",
            marginRight: 150,
            textWrap: "nowrap",
          }}
        >
          جديد و بسيط
        </h1>
        <div className="job-box">
          <h2 className="job-title">{jobTitle}</h2>
          <div className="overlay"></div>
        </div>
      </div>
    </div>
  );
}

export default HomeBenefits;
