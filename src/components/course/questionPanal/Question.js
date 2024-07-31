import React from "react";
import questionStyle from "../course.module.css";

function Question({ question, inn, length }) {
  const abcd = ["ا", "ب", "ج", "د"];
  const handleSelect = (inn, e) => {
    document
      .querySelectorAll(".answer")
      .forEach((answer) => (answer.className = "answer"));
    e.target.className = "answer selected_answer";
    let newQuestionObj = question;
    newQuestionObj.selectedAnswer = inn;
  };

  return (
    <div className={questionStyle.question}>
      <span className={questionStyle.length}>
        {length}/{inn}
      </span>
      <h1>
        {inn} : {question.question}
      </h1>
      <div className={questionStyle.answers}>
        {question.answers.map((answer, inn) => {
          return (
            <div
              onClick={(e) => handleSelect(inn, e)}
              className={`${
                Object.keys(question).includes("selectedAnswer")
                  ? question.selectedAnswer === inn
                    ? "answer selected_answer"
                    : "answer"
                  : "answer"
              }`}
              key={inn}
            >
              {abcd[inn]} : {answer}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Question;
