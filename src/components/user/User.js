import React, { memo, useEffect, useState } from "react";
import userStyle from "./user.module.css";
import supabase from "../../Supabase";
import Toast from "../toast/Toast";
import Profile from "./profile/Profile";
import Courses from "./courses/CoursesPanal";
import Payments from "./payments/Payments";
import LeftColTitle from "./left-col-title/LeftColTitle";

function User({ isLoggedIn }) {
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("");
  const [courses, setCourse] = useState([]);
  const [activeCom, setActiveCom] = useState("profile");
  useEffect(() => {
    const fetch = async () => {
      await supabase.auth.getUser().then(async ({ data }) => {
        if (!data.user) {
          setUser({});
          return;
        }
        if (data.user.aud === "authenticated") {
          setUser(data.user.user_metadata);
          setUserId(data.user.id);
          await supabase
            .from("users")
            .select("courses")
            .eq("id", data.user.id)
            .then(async (userDb) => {
              if (userDb.data[0]) {
                setCourse(userDb.data[0].courses);
              } else if (userDb.error) {
                Toast(userDb.error.message);
              } else {
                await supabase
                  .from("users")
                  .insert([
                    { email: data.user.user_metadata.email, courses: [] },
                  ]);
                setCourse([]);
              }
            });
        } else {
          setUser({});
        }
      });
    };

    if (isLoggedIn) {
      fetch();
    }
  }, [isLoggedIn]);

  return (
    isLoggedIn && (
      <div className={userStyle.user}>
        <div className="container">
          <div className={userStyle.inner}>
            <div className={userStyle.right_col}>
              <button
                onClick={() => setActiveCom("profile")}
                className={activeCom === "profile" ? userStyle.active : ""}
              >
                ملفي الشخصي
              </button>
              <button
                onClick={() => setActiveCom("courses")}
                className={activeCom === "courses" ? userStyle.active : ""}
              >
                كورساتي
              </button>
              <button
                onClick={() => setActiveCom("payments")}
                className={activeCom === "payments" ? userStyle.active : ""}
              >
                فواتيري
              </button>
            </div>
            <div className={userStyle.left_col}>
              <LeftColTitle
                text={
                  activeCom === "profile"
                    ? "ملفي الشخصي"
                    : activeCom === "courses"
                    ? "كورساتي"
                    : "فواتيري"
                }
              />

              {activeCom === "profile" ? (
                <Profile user={user} />
              ) : activeCom === "courses" ? (
                <Courses userId={userId} user={user} />
              ) : (
                <Payments userId={userId} />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default memo(User);
