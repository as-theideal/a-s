import React, { useEffect, useState } from "react";
import supabase from "../../Supabase";
import courseStyle from "./course.module.css";
import Toast from "../toast/Toast";
import QuestionsPanal from "./questionPanal/QuestionsPanal";
import FilePanal from "./filePanal/FilePanal";
import VideoPanal from "./videoPanal/VideoPanal";

function Course() {
  const courseurlFromLink = window.location.pathname.split("/")[3];
  const [data, setData] = useState([]);
  const [activePanal, setActivePanal] = useState();
  const [activeElement, setActiveElement] = useState();
  const [courseId, setCourseId] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchCourse = async (courseId) => {
      await supabase
        .from(courseId)
        .select("title,type,content,id,url")
        .then(({ data, error }) => {
          if (data) {
            setData(data);
          }
          if (error) {
            Toast(error.message);
          }
        });
    };
    supabase.auth.getUser().then(async (userData) => {
      if (userData.error) {
        Toast(userData.error.message);
        return;
      }
      if (userData.data) {
        setUserId(userData.data.user.id.split("-"));
        await supabase
          .from("courses_info")
          .select("id")
          .eq("url", courseurlFromLink)
          .then(async ({ data, error }) => {
            if (error) {
              Toast(error.message);
              return;
            }
            if (data) {
              await supabase
                .from("users")
                .select("courses")
                .eq("id", userData.data.user.id)
                .then((userCourses) => {
                  if (userCourses.error) {
                    Toast(error.message);
                    return;
                  }
                  if (userCourses.data[0].courses) {
                    // eslint-disable-next-line array-callback-return
                    userCourses.data[0].courses.map((courseId) => {
                      if (courseId === data[0].id) {
                        fetchCourse(data[0].id);
                        setCourseId(data[0].id.split("-"));
                      }
                    });
                  }
                });
            }
          });
      }
    });
  }, [courseurlFromLink]);

  return (
    data.length && (
      <div className={courseStyle.course}>
        <div className="container">
          <div className={courseStyle.inner}>
            <div className={courseStyle.active_panal}>
              {activePanal === "mcq" ? (
                <QuestionsPanal
                  data={data[activeElement].content}
                  courseId={courseId}
                  elId={data[activeElement].id}
                  userId={userId}
                />
              ) : activePanal === "file" ? (
                <FilePanal data={data[activeElement]} />
              ) : (
                activePanal === "video" && (
                  <VideoPanal data={data[activeElement]} />
                )
              )}
            </div>
            <div className={courseStyle.elements}>
              {data.map((el, inn) => {
                return (
                  <div
                    className={courseStyle.element}
                    key={inn}
                    onClick={() => {
                      setActiveElement(inn);
                      setActivePanal(el.type);
                    }}
                  >
                    {el.type === "mcq" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e8eaed"
                      >
                        <path d="M560-360q17 0 29.5-12.5T602-402q0-17-12.5-29.5T560-444q-17 0-29.5 12.5T518-402q0 17 12.5 29.5T560-360Zm-30-128h60q0-29 6-42.5t28-35.5q30-30 40-48.5t10-43.5q0-45-31.5-73.5T560-760q-41 0-71.5 23T446-676l54 22q9-25 24.5-37.5T560-704q24 0 39 13.5t15 36.5q0 14-8 26.5T578-596q-33 29-40.5 45.5T530-488ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                      </svg>
                    ) : el.type === "video" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e8eaed"
                      >
                        <path d="m380-300 280-180-280-180v360ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e8eaed"
                      >
                        <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                      </svg>
                    )}
                    <div className={courseStyle.text}>
                      <p>{el.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Course;
