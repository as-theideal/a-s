import React from "react";
import prevAttemptStyles from "../course.module.css";

function PrevAttempt({ prevAttempt, handleShowPrevAttemptResults }) {
  return (
    <div className={prevAttemptStyles.prev_attempt}>
      <h1>تم تسجيل محاولة سابقة</h1>
      <button onClick={handleShowPrevAttemptResults} className="primary_bt">
        عرض نتيجتي السابقة
      </button>
    </div>
  );
}

export default PrevAttempt;
