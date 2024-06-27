// ./src/components/StudentHires.js
import React from 'react';

const StudentHires = () => {
  const students = [
    { name: "Saumitra Khano...", company: "OroPocket", hike: "50 % hike", image: "path/to/image1" },
    { name: "ADITYA KUMAR", company: "BARCLAYS", hike: "627 % hike", image: "path/to/image2" },
    { name: "Pankaj Kumar", company: "AXTRIA", hike: "186 % hike", image: "path/to/image3" },
    { name: "Shubham Raj", company: "amazon", hike: "375 % hike", image: "path/to/image4" },
    { name: "Tushar Sah", company: "Paytm (One97 Communications Limited)", hike: "80 % hike", image: "path/to/image5" },
    { name: "Bhavya Bhatia", company: "SIEMENS", hike: "100 % hike", image: "path/to/image6" },
    { name: "Aikansh Agarwal", company: "calsoft", hike: "300 % hike", image: "path/to/image7" },
    { name: "kishan kunal", company: "amazon", hike: "500 % hike", image: "path/to/image8" },
    { name: "Abhishek Shah", company: "OXXYY", hike: "66 % hike", image: "path/to/image9" },
    { name: "Naveen Kumar ...", company: "Optum", hike: "169 % hike", image: "path/to/image10" },
    { name: "Aakash", company: "Samsung", hike: "100 % hike", image: "path/to/image11" }
  ];

  return (
    <div className="bg-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Our students who took the course got hired at...</h2>
            <marquee behavior="repeat" direction="">
        <div className="grid grid-row-2 grid-flow-col  lg:grid-rows-2 gap-6">

          {students.map((student, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <img src={student.image} alt={student.name} className="w-16 h-16 rounded-full mr-4" />
              <div>
                <h3 className="text-lg font-semibold">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.company}</p>
                <p className="text-blue-500 font-semibold">{student.hike}</p>
              </div>
            </div>
          ))}
        </div>
          </marquee>
      </div>
    </div>
  );
};

export default StudentHires;
