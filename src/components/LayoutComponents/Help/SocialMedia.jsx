import React from "react";


const CommunityLinks = () => {
  return (
    <div className="flex items-center justify-center  ">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Join our vibrant community of learners and professionals on these platforms:
        </h1>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.facebook.com/dianaadvancedtech/"
              className="text-blue-500 text-lg font-semibold hover:text-blue-700 transition-all hover:underline hover:underline-offset-4"
            >
              Facebook Group
            </a>
          </li>
          <li>
            <a
              href="https://wa.me/+447441441208"
              className="text-green-500 text-lg font-semibold hover:text-green-700 transition-all hover:underline hover:underline-offset-4"
            >
              WhatsApp Group
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/diana-academy/"
              className="text-blue-900 text-lg font-semibold hover:text-blue-700 transition-all hover:underline hover:underline-offset-4"
            >
              LinkedIn Group
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommunityLinks;
