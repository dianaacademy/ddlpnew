import React, { useState, useEffect } from 'react';
import banner from "../assets/images/banner/01.png";

const Banner = () => {
  const sentences = [
    "Get set for the Transformation!!",
    "Embrace the forthcoming revolution!!",
    "Level up your skills for success!!"
  ];

  const [displayText, setDisplayText] = useState('');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let typingTimer;
    let removingTimer;

    if (isTyping) {
      // Typing effect
      if (displayText.length < sentences[currentSentenceIndex].length) {
        typingTimer = setTimeout(() => {
          setDisplayText(sentences[currentSentenceIndex].slice(0, displayText.length + 1));
        }, 50);
      } else {
        // Pause before starting removal
        setTimeout(() => setIsTyping(false), 1500);
      }
    } else {
      // Removing effect
      if (displayText.length > 0) {
        removingTimer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
      } else {
        // Move to the next sentence
        setCurrentSentenceIndex((prev) => (prev + 1) % sentences.length);
        setIsTyping(true);
      }
    }

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(removingTimer);
    };
  }, [displayText, currentSentenceIndex, isTyping]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`/course?query=${encodeURIComponent(searchQuery)}`, '_blank');
      setSearchQuery('');
    }
  };

  const handleButtonClick = () => {
    // Simple button click effect
    const button = document.getElementById('search-button');
    if (button) {
      button.classList.add('button-clicked');
      setTimeout(() => {
        button.classList.remove('button-clicked');
      }, 200);
    }
  };

  const subTitle = "Welcome to Diana Advanced Tech Academy";
  const desc = "Best online courses from the world's Leading experts. Join 1.5+ million learners today.";

  const categoryList = [
    { name: 'Cyber Security', link: '/course?cat=CyberSecurity' },
    { name: 'Artificial intelligence', link: '/course?cat=AI' },
    { name: 'DevOps', link: '/course?cat=DevOps' },
    { name: 'Linux', link: '/course?cat=Linux' },
    { name: 'Azure', link: '/course?cat=Azure' },
    { name: 'Bigdata', link: '/course?cat=Bigdata' },
    { name: 'fiveG', link: '/course?cat=5G' },
  ];
  
  const UserList = [
    { name: 'Kids', link: '/junior' },
    { name: 'Parents', link: '/parents' },
    { name: 'Instructor', link: '/login' },
    { name: 'Working Professional', link: '/course' },
  ];

  const shapeList = [
    { name: '1.5M+ Happy Students ', link: '#', className: 'ccl-shape shape-1' },
    { name: '265+ Total Courses', link: '#', className: 'ccl-shape shape-2' },
    { name: '244+ Teachers', link: '#', className: 'ccl-shape shape-3' },
    { name: '5+ Years of Experience', link: '#', className: 'ccl-shape shape-4' },
    { name: 'Lloyd Certified', link: '#', className: 'ccl-shape shape-5' },
  ];

  return (
    <section className="banner-section">
      <div className="container">
        <div className="section-wrapper">
          <div className="row align-items-top">
            <div className="col-xxl-5 col-xl-6 col-lg-10">
              <div className="banner-content">
                <h6 className="subtitle text-uppercase fw-medium">{subTitle}</h6>
                <div className="h-28 mb-6">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                    <span className="inline-block text-transparent bg-clip-text text-black	text-5xl relative">
                      {displayText}
                      <span className="absolute right-[-10px] top-0 animate-blink text-gray-700">
                        |
                      </span>
                    </span>
                  </h1>
                </div>
                
                {/* Search Form */}
                <form onSubmit={handleSearch} className="search-form w-full mb-6 astin">
                  <div className="relative flex items-center w-full astin">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for courses..." 
                      className="w-full py-3 pl-12 pr-20 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent "
                    />
                    <div className="absolute left-4 text-gray-500">
                      <i className="icofont-search"></i>
                    </div>
                    <button 
                      id="search-button"
                      type="submit" 
                      onClick={handleButtonClick}
                      className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    >
                      Search Courses
                    </button>
                  </div>
                </form>
                
                <p className="desc">{desc}</p>
                
                <div className="banner-category d-flex flex-wrap mt-10 text-bold">
                  <ul className="lab-ul flex flex-wrap gap-2">
                    {UserList.map((item, index) => (
                      <li key={index}>
                        <a 
                          href={item.link} 
                          className="block p-1 rounded hover:bg-gray-50 transition duration-300"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="banner-category d-flex flex-wrap mt-10">
                  <p>Most Popular: </p>
                  <ul className="lab-ul flex flex-wrap gap-2">
                    {categoryList.map((item, index) => (
                      <li key={index}>
                        <a 
                          href={item.link} 
                          className="block p-1 rounded hover:bg-gray-50 transition duration-300"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xxl-7 col-xl-6">
              <div className="banner-thumb">
                <img src={banner} alt="Banner" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="all-shapes"></div>
      <div className="cbs-content-list">
        <ul className="lab-ul">
          {shapeList.map((item, index) => (
            <li className={item.className} key={index}>
              <a href={item.link}>{item.name}</a>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Additional CSS for button click effect */}
      <style jsx>{`
        @keyframes buttonPulse {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        
        .button-clicked {
          animation: buttonPulse 0.2s ease-in-out;
        }
        
        .animate-blink {
          animation: blink 1s step-start infinite;
        }
        
        @keyframes blink {
          50% { opacity: 0; }
        }

        .banner-section .section-wrapper .banner-content form input{
        width: 100%;}

        .astin{
        border-radius: 10px;}
      `}</style>
    </section>
  );
};

export default Banner;