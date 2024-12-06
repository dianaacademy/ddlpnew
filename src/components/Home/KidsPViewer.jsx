import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { EyeIcon } from "lucide-react";
import { Link } from 'react-router-dom';

const DianaJuniorCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const location = useLocation();

  const dianaJuniorCategories = [
    { name: "All", link: "Diana Junior" },
    { name: "English", link: "Diana Junior English" },
    { name: "Math", link: "Diana Junior Math" },
    { name: "Science", link: "Diana Junior Science" },
    { name: "Social Science", link: "Diana Junior Social Science" },
  ];
  

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('cat');
    setActiveCategory(categoryParam || "Diana Junior");
  }, [location.search]);
  

  useEffect(() => {
    if (activeCategory) {
      fetchCourses();
    }
  }, [activeCategory]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const coursesRef = collection(db, "courses");
  
      // Query based on category
      const q = query(coursesRef, where("category", "==", activeCategory));
  
      const querySnapshot = await getDocs(q);
      const fetchedCourses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      console.log("Fetched Courses:", fetchedCourses); // Debugging log
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Error fetching Diana Junior courses:", error);
      setCourses([]); // Handle empty state
    } finally {
      setLoading(false);
    }
  };
  

  const handleCategoryChange = (category) => {
    // Update the active category
    setActiveCategory(category);
  };

  const truncateName = (name, maxLength = 30) => {
    return name.length > maxLength 
      ? name.substring(0, maxLength) + '...' 
      : name;
  };

  return (
    <div className="diana-junior-courses bg-gray-100 min-h-screen ">
      <div className="container mx-auto px-4  pl-5 pr-5 pb-5">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center pt-10">Diana Junior Courses</h1>
        
        <div className="category-buttons flex justify-center space-x-4 mb-8">
          {dianaJuniorCategories.map((category) => (
            <Button 
              key={category.link}
              variant={activeCategory === category.link ? "default" : "outline"}
              onClick={() => handleCategoryChange(category.link)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(loading ? Array(6) : courses).map((course, index) => (
            <Card 
              key={course?.id || index} 
              className="pb-4 flex flex-col h-full"
            >
              {course ? (
                <>
                  <img
                    className="w-full h-48 object-cover rounded-t-md"
                    src={course.thumbnailUrl}
                    alt={course.courseName}
                  />
                  <div className="px-4 py-2 flex-grow">
                    <div className="text-lg font-medium h-12 mb-3">
                      {truncateName(course.courseName, 40)}
                    </div>
                  </div>
                  <div className="px-4 pb-2 mt-auto">
                    <Link to={`/course/${course.id}`} className="w-full">
                      <Button 
                        className="flex gap-2 items-center w-full justify-center" 
                        variant="outline"
                      >
                        <EyeIcon size={16} />
                        View Course
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="px-4 py-2">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                </div>
              )}
            </Card>
          ))}
        </div>

        {!loading && courses.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No courses found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default DianaJuniorCoursesPage;