import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo/01.png"
import css from "./CourseVideoNavbar.module.css";

const CourseVideoNavbar = ({ title, moduleName, chapterName, completedChapters, totalChapters }) => {
  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  const getCourseDetails = () => {
    let details = title;
    if (moduleName) {
      details += ` > ${moduleName}`;
      if (chapterName) {
        details += ` > ${chapterName}`;
      }
    }
    return details;
  };

  const courseDetails = getCourseDetails();
  const truncatedDetails = truncateText(courseDetails, 50);
  const completionPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  return (
    <div className={css.outerDiv}>
      <div className={css.left}>
        <Link to="/">
          <img height={60} width={60} src={logo} alt="logo" />
        </Link>
        <hr className={css.vhr} />
        <div className={css.ttl}>{truncatedDetails}</div>
      </div>
      <div className={css.right}>
        <div className={css.progressInfo}>
          <span className={css.progressText}>
          🟢{completedChapters} Out of {totalChapters} Chapters ({completionPercentage}% Completed)
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseVideoNavbar;