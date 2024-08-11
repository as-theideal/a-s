import coursesStyle from "./coursesPanal.module.css";
import { NavLink } from "react-router-dom";

function Courses({ courses }) {
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
