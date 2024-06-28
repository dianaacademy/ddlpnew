// CourseContentComponent.jsx

import { useState } from "react";
import { Link } from "react-router-dom";

import closeIcon from "/icons/close.png";
import downArrowIcon from "/icons/down-arrow.svg";
import openFolderIcon from "/icons/open-folder.png";

import css from "./CourseContentComponent.module.css";

const icons = {
  video: {
    black: "https://ik.imagekit.io/growthx100/icon(10).svg?updatedAt=1719582119207",
    white: "https://ik.imagekit.io/growthx100/Group%20(1).svg?updatedAt=1719584006148"
  },
  quiz: {
    black: "https://ik.imagekit.io/growthx100/icon(11).svg?updatedAt=1719582119349",
    white: "https://ik.imagekit.io/growthx100/Group%20(3).svg?updatedAt=1719584006218"
  },
  lab: {
    black: "https://ik.imagekit.io/growthx100/icon(13).svg?updatedAt=1719582119148",
    white: "https://ik.imagekit.io/growthx100/Group.svg?updatedAt=1719584006179"
  },
  text: {
    black: "https://ik.imagekit.io/growthx100/icon(14).svg?updatedAt=1719582580684",
    white: "https://ik.imagekit.io/growthx100/Group%20(2).svg?updatedAt=1719584006212"
  }
};

const CourseContentComponent = (props) => {
  const { title = "", data = [], playerWidthSetter = () => {}, onChapterClick = () => {}, onClose = () => {}, activeChapter } = props;
  const [toggleBox, setToggleBox] = useState({});
  const [toggleDrpDwn, setToggleDrpDwn] = useState({});

  const getIcon = (type, isActive) => {
    const iconSet = icons[type] || icons.video; // Default to video if type is not recognized
    return isActive ? iconSet.white : iconSet.black;
  };

  return (
    <div className={css.outterDiv}>
      <div className={css.innerDiv}>
        {title ? (
          <div className={css.titleBox}>
            <span className={css.ttl}>{title}</span>
            <span
              className={css.imgBox}
              onClick={onClose}
            >
              <img src={closeIcon} alt="close icon" className={css.closeIcon} />
            </span>
          </div>
        ) : null}
        <div className={css.bdy}>
          {data?.map((item, id) => {
            return (
              <div className={css.tab} key={`tab-${id}`}>
                <div
                  className={css.tabTitleBox}
                  onClick={() =>
                    setToggleBox((p) => {
                      return { ...p, [id]: !p[id] };
                    })
                  }
                >
                  <div className={css.tabTitleLeft}>
                    <div className={css.tabTtl}>{`Section ${id + 1}: ${
                      item.ttl
                    }`}</div>
                    <div className={css.tabDesc}>
                      <span>10/10</span>
                      <span></span>
                      <span>40 min</span>
                    </div>
                  </div>
                  <div className={css.tabTitleRight}>
                    <img
                      src={downArrowIcon}
                      alt="down arrow"
                      className={[
                        css.icon,
                        toggleBox[id] ? css.iconReverse : null,
                      ].join(" ")}
                    />
                  </div>
                </div>
                {toggleBox[id] ? (
                  <div className={css.tabBdy}>
                    {item.list?.map((subItem) => {
                      const isActive = activeChapter && activeChapter.id === subItem.id;
                      return (
                        <div
                          className={`${css.descBdy} ${isActive ? css.activeChapter : ''}`}
                          key={`subItem-${subItem.id}`}
                          onClick={() => onChapterClick(subItem.id)}
                        >
                          <div className={css.s}>
                            {/* Checkbox code removed as per your previous version */}
                          </div>
                          <div className={css.descBdyRight}>
                            <div className={css.sbTtl}>{subItem.ttl}</div>
                            <div className={css.sbBox}>
                              <span className={css.subDur}>
                                <img 
                                  src={getIcon(subItem.type, isActive)} 
                                  className={css.plyIcon} 
                                  alt={`${subItem.type} icon`}
                                />
                                <span className={css.subDurTxt}>
                                  {subItem.dur}
                                </span>
                              </span>
                              {subItem?.resources?.length > 0 ? (
                                <span className={css.subDrp}>
                                  <div
                                    className={css.subDrpBox}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setToggleDrpDwn((p) => {
                                        return {
                                          [subItem.id]: p[subItem.id]
                                            ? !p[subItem.id]
                                            : true,
                                        };
                                      });
                                    }}
                                  >
                                    <img
                                      src={openFolderIcon}
                                      alt="icon"
                                      className={css.subIcon}
                                    />
                                    <div className={css.subDrpTxt}>
                                      Resources
                                    </div>
                                    <img
                                      src={downArrowIcon}
                                      icon="dropdown icon"
                                      className={[
                                        css.drowDownIcon,
                                        toggleDrpDwn[subItem.id]
                                          ? css.reverseDrowDownIcon
                                          : null,
                                      ].join(" ")}
                                    />
                                  </div>
                                  {toggleDrpDwn[subItem.id] ? (
                                    <div className={css.subDrpItemsBox}>
                                      {subItem?.resources?.map((resItem) => {
                                        return (
                                          <Link
                                            key={`resItem-${resItem.id}`}
                                            download={resItem.downloadable}
                                            to={resItem.link}
                                            className={css.resItem}
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <img
                                              src={resItem.icon}
                                              alt="icon"
                                              className={css.resItemIcon}
                                            />
                                            <span className={css.resItemTxt}>
                                              {resItem.text}
                                            </span>
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  ) : null}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseContentComponent;