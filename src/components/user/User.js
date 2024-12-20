import React, { memo, useEffect, useState } from "react";
import userStyle from "./user.module.css";
import supabase from "../../Supabase";
import Toast from "../toast/Toast";
import Profile from "./profile/Profile";
import Courses from "./courses/CoursesPanal";
import Payments from "./payments/Payments";
import Faqs from "./faqs/Faqs";

function User({ isLoggedIn }) {
  const [user, setUser] = useState({});
  const [userType, setUserType] = useState(true);
  const [userId, setUserId] = useState("");
  const [activeCom, setActiveCom] = useState("profile");
  const [courses, setcourses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [approved, setApproved] = useState(true);

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
          setUserType(data.user.user_metadata.type);

          await supabase
            .from("users")
            .select("courses")
            .eq("id", data.user.id)
            .then(async (userDb) => {
              if (userDb.error) {
                Toast(userDb.error.message);
              } else if (userDb.data.length) {
                supabase
                  .from("users")
                  .select("approved")
                  .eq("id", data.user.id)
                  .then((approved) => {
                    if (!approved.data[0].approved) {
                      setApproved(false);
                      return;
                    } else {
                      setApproved(true);
                    }
                  });
                if (userDb.data[0].courses) {
                  userDb.data[0].courses.map(async (courseId) => {
                    if (courseId === "1ee8038e-b2c5-4b57-9bd4-f15771c0f3cb") {
                      supabase
                        .from("center_courses")
                        .select("title,img_url,url")
                        .eq("id", courseId)
                        .then(({ data, error }) => {
                          if (data.length) {
                            setcourses((prev) =>
                              prev ? [...prev, data[0]] : [data[0]]
                            );
                          }
                          if (error) {
                            Toast(error.message);
                          }
                        });
                    } else if (
                      courseId === "bbe2b1b2-6df8-41c9-8aed-4ca0eaf5a126"
                    ) {
                      supabase
                        .from("center_courses")
                        .select("title,img_url,url")
                        .eq("id", courseId)
                        .then(({ data, error }) => {
                          if (data.length) {
                            setcourses((prev) =>
                              prev ? [...prev, data[0]] : [data[0]]
                            );
                          }
                          if (error) {
                            Toast(error.message);
                          }
                        });
                    } else if (
                      courseId === "d29e64c5-8920-4ddc-9a25-2de9edba81fb"
                    ) {
                      supabase
                        .from("center_courses")
                        .select("title,img_url,url")
                        .eq("id", courseId)
                        .then(({ data, error }) => {
                          if (data.length) {
                            setcourses((prev) =>
                              prev ? [...prev, data[0]] : [data[0]]
                            );
                          }
                          if (error) {
                            Toast(error.message);
                          }
                        });
                    } else {
                      supabase
                        .from("courses_info")
                        .select("title,img_url,url")
                        .eq("id", courseId)
                        .then(({ data, error }) => {
                          if (data.length) {
                            setcourses((prev) =>
                              prev ? [...prev, data[0]] : [data[0]]
                            );
                          }
                          if (error) {
                            Toast(error.message);
                          }
                        });
                    }
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
                    {
                      email: data.user.user_metadata.email,
                      phone: data.user.user_metadata.phone,
                      parent_phone: data.user.user_metadata.parentPhone,
                      name: data.user.user_metadata.name,
                      courses: data.user.user_metadata.type
                        ? []
                        : [
                            `${
                              data.user.user_metadata.year === 1
                                ? "1ee8038e-b2c5-4b57-9bd4-f15771c0f3cb"
                                : data.user.user_metadata.year === 2
                                ? "bbe2b1b2-6df8-41c9-8aed-4ca0eaf5a126"
                                : data.user.user_metadata.year === 3 &&
                                  "d29e64c5-8920-4ddc-9a25-2de9edba81fb"
                            }`,
                          ],
                      type: data.user.user_metadata.type,
                      approved: data.user.user_metadata.type,
                      year: data.user.user_metadata.year,
                    },
                  ])
                  .then(setApproved(data.user.user_metadata.type));
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
            {approved ? (
              <>
                <div className={userStyle.right_col}>
                  <button
                    onClick={() => setActiveCom("profile")}
                    className={activeCom === "profile" ? userStyle.active : ""}
                  >
                    ملفي الشخصي
                  </button>
                  {courses.length > 0 && (
                    <button
                      onClick={() => setActiveCom("courses")}
                      className={
                        activeCom === "courses" ? userStyle.active : ""
                      }
                    >
                      كورساتي
                    </button>
                  )}
                  {faqs.length > 0 && (
                    <button
                      onClick={() => setActiveCom("faqs")}
                      className={activeCom === "faqs" ? userStyle.active : ""}
                    >
                      اسئلتي
                    </button>
                  )}
                  {invoices.length > 0 && (
                    <button
                      onClick={() => setActiveCom("payments")}
                      className={
                        activeCom === "payments" ? userStyle.active : ""
                      }
                    >
                      فواتيري
                    </button>
                  )}
                </div>
                <div className={userStyle.left_col}>
                  {activeCom === "profile" ? (
                    <Profile user={user} />
                  ) : activeCom === "courses" ? (
                    <Courses
                      courses={courses}
                      userType={userType}
                      userId={userId}
                    />
                  ) : activeCom === "faqs" ? (
                    <Faqs faqs={faqs} />
                  ) : (
                    <Payments userId={userId} invoices={invoices} />
                  )}
                </div>
              </>
            ) : (
              <p>تواصل مع الدعم لتفعيل الحساب</p>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default memo(User);
