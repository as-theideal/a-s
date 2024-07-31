import React, { useEffect, useState } from "react";
import supabase from "../../../Supabase";
import Toast from "../../toast/Toast";
import result from "../course.module.css";

function Result({
  questions,
  courseId,
  elId,
  prevAttemptAnswers,
  showPrevAttemptResults,
}) {
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [correctSelection, setCorrectSelecteion] = useState(0);
  const [wrongSelection, setWrongSelection] = useState(0);
  useEffect(() => {
    const fetchCorrectAnswers = async () => {
      await supabase
        .from(courseId.join("-"))
        .select("correct_answers")
        .eq("id", elId)
        .then(({ data, error }) => {
          if (error) {
            Toast("حدث خطا ما");
            return;
          }
          if (data[0]) {
            setCorrectAnswers(data[0].correct_answers);
            // eslint-disable-next-line array-callback-return
            data[0].correct_answers.map((correctAnswer, inn) => {
              if (showPrevAttemptResults) {
                if (correctAnswer === prevAttemptAnswers[inn]) {
                  setCorrectSelecteion((prev) => prev + 1);
                } else {
                  setWrongSelection((prev) => prev + 1);
                }
              } else {
                if (correctAnswer === questions[inn].selectedAnswer) {
                  setCorrectSelecteion((prev) => prev + 1);
                } else {
                  setWrongSelection((prev) => prev + 1);
                }
              }
            });
          }
        });
    };
    fetchCorrectAnswers();
  }, [courseId, elId, prevAttemptAnswers, questions]);
  return (
    questions && (
      <div className={result.result_panal}>
        <h1 className={result.per}>
          {Math.trunc((correctSelection / correctAnswers.length) * 100)}%
        </h1>
        <div className={result.selected_answers_num}>
          <div className={result.correct_selection_num}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
            <p>الاجابات الصحيحة : {correctSelection}</p>
          </div>
          <div className={result.wrong_selection_num}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm36-190 114-114 114 114 56-56-114-114 114-114-56-56-114 114-114-114-56 56 114 114-114 114 56 56Zm-2 110h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z" />
            </svg>
            <p>الاجابات الخاطئة : {wrongSelection}</p>
          </div>
        </div>
        <div className={result.answers_section}>
          {correctAnswers.map((correctAnswer, inn) => {
            if (showPrevAttemptResults) {
              if (correctAnswer === prevAttemptAnswers[inn]) {
                return (
                  <div
                    key={inn}
                    className={result.card}
                    style={{
                      backgroundColor: "var(--primary-color)",
                      opacity: 0.7,
                    }}
                  >
                    <p>
                      {inn + 1} : {questions[inn].question}
                    </p>
                    <div className={result.correct_selection}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e8eaed"
                      >
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                      </svg>
                      <p>{questions[inn].answers[correctAnswer]}</p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={inn}
                    className={result.card}
                    style={{ backgroundColor: "#ff0000d9" }}
                  >
                    <p>
                      {inn + 1} : {questions[inn].question}
                    </p>
                    <div className={result.wrong_selection}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e8eaed"
                      >
                        <path d="M330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm36-190 114-114 114 114 56-56-114-114 114-114-56-56-114 114-114-114-56 56 114 114-114 114 56 56Zm-2 110h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z" />
                      </svg>
                      <p>{questions[inn].answers[+prevAttemptAnswers[inn]]}</p>
                    </div>
                    <div className={result.correct_selection}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e8eaed"
                      >
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                      </svg>
                      <p>{questions[inn].answers[correctAnswer]}</p>
                    </div>
                  </div>
                );
              }
            } else {
              if (correctAnswer === questions[inn].selectedAnswer) {
                return (
                  <div
                    key={inn}
                    className={result.card}
                    style={{
                      backgroundColor: "var(--primary-color)",
                      opacity: 0.7,
                    }}
                  >
                    <p>
                      {inn + 1} : {questions[inn].question}
                    </p>
                    <div className={result.correct_selection}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e8eaed"
                      >
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                      </svg>
                      <p>{questions[inn].answers[correctAnswer]}</p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={inn}
                    className={result.card}
                    style={{ backgroundColor: "#ff0000d9" }}
                  >
                    <p>
                      {inn + 1} : {questions[inn].question}
                    </p>
                    <div className={result.wrong_selection}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e8eaed"
                      >
                        <path d="M330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm36-190 114-114 114 114 56-56-114-114 114-114-56-56-114 114-114-114-56 56 114 114-114 114 56 56Zm-2 110h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z" />
                      </svg>
                      <p>
                        {questions[inn].answers[questions[inn].selectedAnswer]}
                      </p>
                    </div>
                    <div className={result.correct_selection}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e8eaed"
                      >
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                      </svg>
                      <p>{questions[inn].answers[correctAnswer]}</p>
                    </div>
                  </div>
                );
              }
            }
          })}
        </div>
      </div>
    )
  );
}

export default Result;
