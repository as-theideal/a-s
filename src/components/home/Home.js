import React, { useEffect, useState } from "react";
import home from "./home.module.css";
import HomePortfolio from "./HomePortfolio";
import HomeServices from "./HomeServices";
import HomeYears from "./HomeYears";
import edge from "../../assets/edge.lottie";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";

// import home_banner from '../../assets/home_banner.jpg'
function Home({ isLoggedIn }) {
  const [currPg, setCurrPg] = useState(0);
  const homes = [<HomePortfolio />, <HomeServices />, <HomeYears />];
  useEffect(() => {
    if (window.innerWidth >= 768) {
      onwheel = (e) => {
        if (e.deltaY > 0 && currPg <= 1) {
          setCurrPg(currPg + 1);
        } else if (e.deltaY < 0 && currPg >= 1) {
          setCurrPg(currPg - 1);
        }
      };
    }
  });

  return (
    <div
      className={home.home}
      style={{ height: `${window.innerWidth >= 768 && "100vh"}` }}
    >
      {currPg < 2 && (
        <div className={home.edge}>
          <DotLottiePlayer src={edge} autoplay loop></DotLottiePlayer>
        </div>
      )}

      <div className="container">
        <div
          className={home.inner}
          style={{
            height: `${window.innerWidth >= 768 && "calc(100vh - 100px)"}`,
          }}
        >
          {window.innerWidth >= 768 ? (
            <>
              <div className={home.show_curr_pg}>
                <span
                  onClick={() => setCurrPg(0)}
                  style={{
                    backgroundColor: `${
                      currPg === 0 ? "var(--secondary-color)" : "transparent"
                    }`,
                  }}
                ></span>
                <span
                  onClick={() => setCurrPg(1)}
                  style={{
                    backgroundColor: `${
                      currPg === 1 ? "var(--secondary-color)" : "transparent"
                    }`,
                  }}
                ></span>
                <span
                  onClick={() => setCurrPg(2)}
                  style={{
                    backgroundColor: `${
                      currPg === 2 ? "var(--secondary-color)" : "transparent"
                    }`,
                  }}
                ></span>
              </div>
              {window.navigator.platform !== "Win32" && (
                <div className={home.scroll_arrows}>
                  <span
                    onClick={() => currPg >= 1 && setCurrPg(currPg - 1)}
                    style={{ transform: "rotateZ(135deg)" }}
                  ></span>
                  <span
                    onClick={() => currPg <= 1 && setCurrPg(currPg + 1)}
                  ></span>
                </div>
              )}
              {homes[currPg]}
            </>
          ) : (
            homes.map((e) => e)
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
