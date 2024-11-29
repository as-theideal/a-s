import React, { Fragment } from "react";
import home from "./home.module.css";
import HomePortfolio from "./HomePortfolio";
import HomeServices from "./HomeServices";
import HomeYears from "./HomeYears";
import edge from "../../assets/edge.lottie";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import Footer from "./Footer";

function Home() {
  const homes = [<HomePortfolio />, <HomeServices />, <HomeYears />];

  return (
    <div className={home.home}>
      <div className={home.edge}>
        <DotLottiePlayer src={edge} autoplay loop></DotLottiePlayer>
      </div>

      <div
        className="container"
        style={{ flexDirection: "column", gap: 20, marginTop: 100 }}
      >
        {homes.map((e, inn) => (
          <Fragment key={inn}>{e}</Fragment>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
