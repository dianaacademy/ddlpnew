import React from 'react';
import CountUp from 'react-countup';

const subTitle = "START TO SUCCESS";
const title = "Achieve Your Goals With Diana";

const achievementList = [
    {
        count: '5',
        desc: 'Years of Experience',
    },
    {
        count: '1555248',
        desc: 'HAPPY STUDENTS',
    },
    {
        count: '244',
        desc: 'OUR TEACHERS',
    },
    {
        count: '265',
        desc: 'OUR COURSES',
    },
];

const achieveList = [
    {
        imgUrl: 'assets/images/achive/01.png',
        imgAlt: 'Diana',
        title: 'Start Teaching Today',
        desc: 'Share your knowledge, inspire students, and build a rewarding teaching career now!',
        btnText: 'Become A Instructor',
        siteLink: 'https://dianalearningportal.com/dashboard-page/',
    },
    {
        imgUrl: 'assets/images/achive/02.png',
        imgAlt: 'Diana',
        title: 'If You Join Our Course',
        desc: 'Gain skills, expert guidance, and a path to success in your chosen field!',
        btnText: 'Register For Free',
        siteLink: '/signup',
    },
];

const Achievement = () => {
    return (
        <div className="achievement-section padding-tb">
            <div className="container">
                <div className="section-header text-center">
                    <span className="subtitle">{subTitle}</span>
                    <h2 className="title">{title}</h2>
                </div>
                <div className="section-wrapper">
                    <div className="counter-part mb-4">
                        <div className="row g-4 row-cols-lg-4 row-cols-sm-2 row-cols-1 justify-content-center">
                            {achievementList.map((val, i) => (
                                <div className="col" key={i}>
                                    <div className="count-item">
                                        <div className="count-inner">
                                            <div className="count-content">
                                                <h2><span className="count"><CountUp end={val.count} /></span><span>+</span></h2>
                                                <p>{val.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="achieve-part">
                        <div className="row g-4 row-cols-1 row-cols-lg-2">
                            {achieveList.map((val, i) => (
                                <div className="col" key={i}>
                                    <div className="achieve-item">
                                        <div className="achieve-inner">
                                            <div className="achieve-thumb">
                                                <img src={`${val.imgUrl}`} alt={`${val.imgAlt}`} />
                                            </div>
                                            <div className="achieve-content">
                                                <h4>{val.title}</h4>
                                                <p>{val.desc}</p>
                                                <a href={val.siteLink} className="lab-btn"><span>{val.btnText}</span></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* New Section for the Added Image */}
                    <div className="achieve-image mt-20 text-center">
                        <img 
                            src="assets/images/achive/Ac01.webp" 
                            alt="Achievement Highlight" 
                            className="img-fluid"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Achievement;
