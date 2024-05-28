import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import InputUtil from "../../../utils/InputUtil/InputUtil";
import SelectDropdownUtil from "../../../utils/SelectDropdownUtil/SelectDropdownUtil";
import CourseCardWithOptions from "../../../utils/CourseCardWithOptions/CourseCardWithOptions";

import searchIcon from "/icons/search.png";
import shareIcon from "/icons/share.png";
import starIcon from "/icons/star-b.png";
import plusIcon from "/icons/plus.png";
import folderIcon from "/icons/folder.png";
import { courseDataWithOptions } from "../../../fakedata/fakedata";

import css from "./AllCoursesComponent.module.css";

const AllCoursesComponent = () => {
  const [filters, setFilers] = useState({
    sortBy: {},
    filterByCategory: {},
    filterByState: {},
    filterByInstructor: {},
  });

  const [resetBtn, setRestBtn] = useState(false);

  

  const optionsComps = [
    <div className={css.opt}>
      <div className={css.httl}>Lists</div>
      <Link to="/" className={css.ctxt}>
        Dynamics
      </Link>
      <Link to="/" className={css.ctxt}>
        NCloud
      </Link>
    </div>,
    <div className={css.opt}>
      <Link to="/" className={css.txtBox}>
        <span className={css.iconBox}>
          <img src={shareIcon} alt="icon" className={css.icon} />
        </span>
        <span className={css.txt}>Share</span>
      </Link>
      <Link to="/" className={css.txtBox}>
        <span className={css.iconBox}>
          <img src={plusIcon} alt="icon" className={css.icon} />
        </span>
        <span className={css.txt}>Create New List</span>
      </Link>
      <Link to="/" className={css.txtBox}>
        <span className={css.iconBox}>
          <img src={starIcon} alt="icon" className={css.icon} />
        </span>
        <span className={css.txt}>Favorite</span>
      </Link>
      <Link to="/" className={css.txtBox}>
        <span className={css.iconBox}>
          <img src={folderIcon} alt="icon" className={css.icon} />
        </span>
        <span className={css.txt}>Unarchive</span>
      </Link>
    </div>,
  ];

  return (
    <div className={css.outerDiv}>
      <div className={css.topBar}>
        <div className={css.filters}>
          
          
          
          
          
        </div>

        
      </div>
      <div className={css.bdy}>
        {courseDataWithOptions.map((item) => {
          return (
            <CourseCardWithOptions
              key={item.id }
              data={item}
              isOptions={true}
              options={optionsComps}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AllCoursesComponent;
