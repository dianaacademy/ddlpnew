import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import playIcon from "/icons/play-button.png";
import downArrowIcon from "/icons/down-arrow.svg";
import openFolderIcon from "/icons/open-folder.png";

import { getCompletedChapters, markChapterAsComplete } from "../../../views/student/component/Progressservice"; // Import your progress tracking functions

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
  const [completedChapters, setCompletedChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(null);

  useEffect(() => {
    const fetchCompletedChapters = async () => {
      try {
        const chapters = await getCompletedChapters(); // Assuming a function to get completed chapters
        setCompletedChapters(chapters);
      } catch (error) {
        console.error("Error fetching completed chapters:", error);
      }
    };

    fetchCompletedChapters();
  }, []);

  const handleChapterClick = async (chapterId, moduleId, index) => {
    await onChapterClick(chapterId, moduleId);
    await markChapterAsComplete(chapterId); // Mark chapter as complete
    setCompletedChapters((prev) => [...prev, chapterId]); // Update local state
    setCurrentChapterIndex(index); // Set the current chapter index
  };



  const getIcon = (type, isActive) => {
    const iconSet = icons[type] || icons.video; // Default to video if type is not recognized
    return isActive ? iconSet.white : iconSet.black;
  };

  return (
    <div className="flex">
      <div className=" p-4">
        {title && (
          <div className="flex justify-between  mb-4">
            <span className="text-xl font-bold">{title}</span>
         
          </div>
        )}
        <div>
          {data?.map((item, id) => (
            <div key={`tab-${id}`} className="mb-2">
              <div
                className="flex justify-between  cursor-pointer p-2 "
                onClick={() =>
                  setToggleBox((p) => {
                    return { ...p, [id]: !p[id] };
                  })
                }
              >
                <div>
                  <div className="font-semibold">{item.ttl}</div>
                  <div className="text-sm text-gray-600">
                    <span>{item.completedCount}</span>                  
                    </div>

                </div>
                <div>
                  <img
                    src={downArrowIcon}
                    alt="down arrow"
                    className={`w-4 h-4 flex float-right transition-transform ${toggleBox[id] ? "transform rotate-180" : ""}`}
                  />
                </div>
              </div>
              {toggleBox[id] && (
                <div className="p-2 bg-white border border-gray-200">
                  {item.list?.map((subItem, subIndex) => (
                    <div
                      key={`subItem-${subItem.id}`}
                      className={`flex justify-between items-center p-2 my-2 border rounded cursor-pointer ${completedChapters.includes(subItem.id) ? "bg-green-100" : "bg-gray-50"}`}
                      onClick={() => handleChapterClick(subItem.id, item.id, subIndex)}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 ${completedChapters.includes(subItem.id) ? "bg-green-500" : "bg-gray-200"}`} />
                        <div className="font-medium">{subItem.ttl}</div>
                      </div>
                      <div className="flex items-center">
                        <span className="flex items-center text-sm text-gray-600 mr-4">
                          <img src={playIcon} className="w-4 h-4 mr-1" />
                          <span>{subItem.dur}</span>
                        </span>
                        {subItem?.resources?.length > 0 && (
                          <div className="relative">
                            <div
                              className="flex items-center text-sm text-blue-500 cursor-pointer"
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
                                className="w-4 h-4 mr-1"
                              />
                              <span>Resources</span>
                              <img
                                src={downArrowIcon}
                                alt="dropdown icon"
                                className={`w-3 h-3 ml-1 transition-transform ${toggleDrpDwn[subItem.id] ? "transform rotate-180" : ""}`}
                              />
                            </div>
                            {toggleDrpDwn[subItem.id] && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                                {subItem?.resources?.map((resItem) => (
                                  <Link
                                    key={`resItem-${resItem.id}`}
                                    download={resItem.downloadable}
                                    to={resItem.link}
                                    className="flex items-center p-2 hover:bg-gray-100"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <img
                                      src={resItem.icon}
                                      alt="icon"
                                      className="w-4 h-4 mr-2"
                                    />
                                    <span>{resItem.text}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
  
    </div>
  );
};

export default CourseContentComponent;
