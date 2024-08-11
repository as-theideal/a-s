import React, { memo, useEffect, useState } from "react";
import userStyle from "./user.module.css";
import supabase from "../../Supabase";
import Toast from "../toast/Toast";
import Profile from "./profile/Profile";
import Courses from "./courses/CoursesPanal";
import Payments from "./payments/Payments";
import LeftColTitle from "./left-col-title/LeftColTitle";
import Faqs from "./faqs/Faqs";

function User({ isLoggedIn }) {
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("");
  const [activeCom, setActiveCom] = useState("profile");
  const [courses, setcourses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetch = () => {
      supabase.auth.getUser().then(async ({ data }) => {
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
              if (userDb.error) {
                Toast(userDb.error.message);
              } else if (userDb.data.length) {
                if (userDb.data[0].courses) {
                  userDb.data[0].courses.map(async (courseId) => {
                    supabase
                      .from("courses_info")
                      .select("*")
                      .eq("id", courseId)
                      .then(({ data, error }) => {
                        if (data) {
                          setcourses((prev) =>
                            prev ? [...prev, data[0]] : [data[0]]
                          );
                        }
                        if (error) {
                          Toast(error.message);
                        }
                      });
                  });
                }
                supabase
                  .from("invoices")
                  .select(
                    "course_id,state,expire_date,fawry_code,invoice_id,invoice_key"
                  )
                  .eq("user_id", data.user.id)
                  .then(({ data, error }) => {
                    if (error) {
                      Toast("حدث خطا ما");
                      return;
                    }
                    if (data) {
                      setInvoices(data.reverse());
                    }
                  });
                supabase
                  .from("faqs")
                  .select("question,answer,course_id")
                  .eq("user_id", data.user.id)
                  .then(({ data, error }) => {
                    if (error) {
                      Toast(error.message);
                    } else if (data.length) {
                      supabase
                        .from("courses_info")
                        .select("title,id")
                        .then((infos) => {
                          data.map((el) =>
                            setFaqs((prev) => {
                              return [
                                {
                                  question: el.question,
                                  answer: el.answer,
                                  course_title: infos.data.map(
                                    (ele) =>
                                      ele.id === el.course_id && ele.title
                                  )[0],
                                },
                                ...prev,
                              ];
                            })
                          );
                        });
                    }
                  });
              } else {
                await supabase
                  .from("users")
                  .insert([
                    { email: data.user.user_metadata.email, courses: [] },
                  ])
                  .then((data) => console.log(data));
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
                onClick={() => setActiveCom("faqs")}
                className={activeCom === "faqs" ? userStyle.active : ""}
              >
                اسئلتي
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
                    : activeCom === "faqs"
                    ? "اسئلتي"
                    : "فواتيري"
                }
              />

              {activeCom === "profile" ? (
                <Profile user={user} />
              ) : activeCom === "courses" ? (
                <Courses courses={courses} />
              ) : activeCom === "faqs" ? (
                <Faqs faqs={faqs} />
              ) : (
                <Payments userId={userId} invoices={invoices} />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default memo(User);
