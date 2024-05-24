const HomeCard = () => {
  return (
    <div className="w-1/3 bg-white rounded-lg shadow-md overflow-hidden ">
        
      <img
        src="https://ik.imagekit.io/growthx100/default-image.jpg?updatedAt=1709902412480"
        alt="Beautiful Home"
        className="w-full h-64 object-cover"
      />
      <div className="p-4 bg-white">
        <span className="bg-teal-500 text-white text-xs font-semibold py-1 px-2 rounded-full">
          NEW
        </span>
        <h2 className="text-xl font-semibold mt-2">Cyber Security with AI</h2>
        <p className="text-gray-600 text-sm">6 months • 70 Hours</p>
        <p className="text-lg font-bold mt-2">$1,900.00</p>
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((rating, index) => (
            <svg
              key={index}
              className={`w-4 h-4 fill-current ${
                index < 4 ? 'text-yellow-500' : 'text-gray-300'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
          <span className="text-gray-600 text-sm ml-2">34 reviews</span>
        </div>
        <a href="/student/tabs" className="block w-full">
  <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3">
    Explore
  </button>
</a>
      </div>
      </div>
   
  );
};

export default HomeCard;