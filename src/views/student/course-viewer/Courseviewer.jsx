import { useState, useEffect  } from "react";
import * as pptx2html from 'pptx2html';

import VideoPlayer from "../../../components/CourseVideoComponents/VideoPlayer/VideoPlayer";
import DetailDPComponent from "../../../components/CourseVideoComponents/DetailDPComponent/DetailDPComponent";
import CourseContentComponent from "../../../components/CourseVideoComponents/CourseContentComponent/CourseContentComponent";
import CourseViewTabComponent from "../../../components/CourseVideoComponents/CourseViewTabComponents/CourseViewTabComponent/CourseViewTabComponent";

import CourseVideoNavbar from "../../../components/LayoutComponents/CourseVideoNavbar/CourseVideoNavbar";
import Footer from "../../../components/LayoutComponents/Footer/Footer";

import css from "./CourseViewPage.module.css";

import { courseData } from "../../../fakedata/fakedata";

const CourseViewPage = () => {
  const data = {
    title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
  };

  const [playerFullWidth, setPlayerFullWidth] = useState(false);
  const pptxUrl = 'https://firebasestorage.googleapis.com/v0/b/ddlp-456ce.appspot.com/o/course_content%2Fdianaacademy%20weekly%20seo%20report.pptx?alt=media&token=8b3d6236-dcf3-46b6-a3f9-9748a09d25a1';

  const handlePPTXConversion = async () => {
    try {
      const html = await pptx2html.convert(pptxUrl);
      // Do something with the HTML content
      console.log(html);
    } catch (error) {
      console.error('Error converting PPTX:', error);
    }
  };

  useEffect(() => {
    handlePPTXConversion();
  }, []);

  return (
    <div className={css.outterDiv}>
      <CourseVideoNavbar data={data} />
      <div className={css.bdy}>
        <div
          className={css.left}
          style={{ width: playerFullWidth ? "100%" : "75%" }}
        >
          <div
            className={css.content}
            style={{
              height: playerFullWidth ? "700px" : "600px",
            }}
          >
            <VideoPlayer
              data={{ autoplay: true }}
              playerWidthState={playerFullWidth}
              playerWidthSetter={setPlayerFullWidth}
            />
          </div>
          <CourseViewTabComponent />
          
        </div>
        <div
          className={css.right}
          style={{ display: playerFullWidth ? "none" : "block" }}
        >
          <DetailDPComponent
            title="Take a DIana Assessment to check your skills"
            desc="Made by Diana, this generalized assessment is a great way to check in on your skills."
            btnTxt="Launch Assessment"
          />
          <CourseContentComponent
            title="Course Content"
            data={courseData}
            playerWidthSetter={setPlayerFullWidth}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseViewPage;
