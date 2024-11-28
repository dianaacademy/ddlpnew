import React, { useRef, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Rating from "./rating";


const subTitle = "Loved by 200,000+ students";
const title = "Students Community Feedback";
const VidURL = 'https://firebasestorage.googleapis.com/v0/b/ddlp-456ce.appspot.com/o/files%2FHomePage.mp4?alt=media&token=022dba09-2877-473d-a1ef-2acebbee2871';

const studentList = [
    {
        imgUrl: 'assets/images/feedback/student/01.jpg',
        imgAlt: 'Diana',
        name: 'Bret Phillips',
        degi: 'Network Security Analyst, Zscaler',
        desc: 'I highly recommend the CCNA course at Diana Advanced Tech Academy. The instructors are knowledgeable and provide practical insights. The course material is well-structured and engaging.',
    },
    {
        imgUrl: 'assets/images/feedback/student/02.jpg',
        imgAlt: 'Diana',
        name: 'Kiran Bernard',
        degi: 'Student, University of Bolton',
        desc: 'I never knew cybersecurity could be so fascinating until I took the Cyber Security Analyst course at Diana Tech Academy. The instructors made the material come alive and showed me how exciting the field can be.',
    }
];

const Student = () => {
    const videoRef = useRef(null);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.play();
            videoElement.loop = true;
        }
    }, []);

    const handleZoom = (factor) => {
        setZoom((prevZoom) => Math.max(1, prevZoom + factor));
    };

    return (
        <div className="student-feedbak-section padding-tb shape-img">
            <div className="container">
                <div className="section-header text-center">
                    <span className="subtitle">{subTitle}</span>
                    <h2 className="title">{title}</h2>
                </div>
                <div className="section-wrapper">
                    <div className="row justify-content-center row-cols-lg-2 row-cols-1">
                        <div className="col">
                            <div className="sf-left">
                                <div
                                    className="sfl-thumb overflow-hidden relative"
                                    style={{
                                        width: '650px',
                                        height: '450px',
                                        position: 'relative',
                                    }}
                                >
                                    <video
                                        ref={videoRef}
                                        src={VidURL}
                                        muted
                                        playsInline
                                        style={{
                                            transform: `scale(${zoom})`,
                                            transformOrigin: 'center center', // Centered zoom
                                            transition: 'transform 0.3s ease',
                                            objectFit: 'cover',
                                            width: '110%',
                                            height: '110%',
                                        }}
                                    />
                                </div>
                                <div className="zoom-controls text-center mt-3">
                                    <button onClick={() => handleZoom(0.1)} className="btn btn-primary">
                                        Zoom In
                                    </button>
                                    <button onClick={() => handleZoom(-0.1)} className="btn btn-secondary mx-2">
                                        Zoom Out
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            {studentList.map((val, i) => (
                                <div className="stu-feed-item" key={i}>
                                    <div className="stu-feed-inner">
                                        <div className="stu-feed-top">
                                            <div className="sft-left">
                                                <div className="sftl-thumb">
                                                    <img src={`${val.imgUrl}`} alt={val.imgAlt} />
                                                </div>
                                                <div className="sftl-content">
                                                    <Link to="/team-single"><h6>{val.name}</h6></Link>
                                                    <span>{val.degi}</span>
                                                </div>
                                            </div>
                                            <div className="sft-right">
                                                <Rating />
                                            </div>
                                        </div>
                                        <div className="stu-feed-bottom">
                                            <p>{val.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Student;
