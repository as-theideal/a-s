/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import supabase from "../../../Supabase";
import Toast from "../../toast/Toast";
import coursesStyle from "./coursesPanal.module.css";
import { NavLink } from "react-router-dom";

function Courses({ userId, user }) {
  const [courses, setcourses] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      await supabase
        .from("users")
        .select("courses")
        .eq("id", userId)
        .then(({ data }) => {
          if (data[0].courses) {
            data[0].courses.map(async (courseId) => {
              await supabase
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
        });
    };
    if (userId) {
      fetchCourses();
    }
  }, [setcourses, userId]);

  return (
    <div className={coursesStyle.courses}>
      {courses ? (
        courses.map((course, inn) => {
          return (
            <NavLink to={"./course/" + course.url} key={inn}>
              <div className={coursesStyle.course}>
                <img
                  src={`https://as-theideal.b-cdn.net/courses_imgs/${course.img_url}`}
                  alt="img"
                />
                <hr />
                <p>{course.title}</p>
              </div>
            </NavLink>
          );
        })
      ) : (
        <h1>No courses</h1>
      )}
    </div>
  );
}

export default Courses;
