// AllCoursesComponent.jsx
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { db } from "@/firebase.config";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
  where,
  orderBy,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { Card, CardImage } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, EyeIcon } from "lucide-react";
import '../../student/Style.css';

import { useAuth, doSignOut } from "@/auth/hooks/useauth";

export default function AllCoursesComponent() {
   const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [imageLoading, setImageLoading] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const coursesPerPage = 15;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCategories();
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get("cat");
    setSelectedCategory(categoryParam || "all");
  }, [location.search]);

  useEffect(() => {
    fetchCourses();
    updateTotalCourses();
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = courses.filter((course) =>
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchQuery, courses]);

  const handleImageLoad = (index) => {
    setImageLoading((prev) => {
      const newImageLoading = [...prev];
      newImageLoading[index] = false;
      return newImageLoading;
    });
  };

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const uniqueCategories = new Set();
      querySnapshot.docs.forEach((doc) => {
        const category = doc.data().category;
        if (category) uniqueCategories.add(category);
      });
      setCategories(Array.from(uniqueCategories));
    } catch (error) {
      console.error("Error fetching categories: ", error);
      setError("Unable to fetch categories. Please check your Firestore permissions.");
    }
  };

  const fetchCourses = async (loadMore = false) => {
    setLoading(true);
    setError(null);
    try {
      let q = query(collection(db, "courses"), orderBy("courseName"));

      if (selectedCategory !== "all") {
        q = query(q, where("category", "==", selectedCategory));
      }

      if (loadMore && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      q = query(q, limit(coursesPerPage));

      const querySnapshot = await getDocs(q);
      const coursesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourses((prev) => (loadMore ? [...prev, ...coursesList] : coursesList));
      setImageLoading(Array(coursesList.length).fill(true));
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === coursesPerPage);
    } catch (error) {
      console.error("Error fetching courses: ", error);
      setError("Unable to fetch courses. Please check your Firestore permissions.");
    } finally {
      setLoading(false);
    }
  };

  const updateTotalCourses = async () => {
    try {
      let q = collection(db, "courses");
      if (selectedCategory !== "all") {
        q = query(q, where("category", "==", selectedCategory));
      }
      const snapshot = await getCountFromServer(q);
      setTotalCourses(snapshot.data().count);
    } catch (error) {
      console.error("Error getting total courses: ", error);
      setError("Unable to count courses. Please check your Firestore permissions.");
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setLastVisible(null);
    setCourses([]);
    if (value === "all") {
      navigate("/admin/courses", { replace: true });
    } else {
      navigate(`?cat=${value}`, { replace: true });
    }
  };

  const loadMoreCourses = async () => {
    setLoadingMore(true);
    await fetchCourses(true);
    setLoadingMore(false);
  };

  if (error) {
    return (
      <div className="p-4 text-red-400">
        {error}
        <p className="text-gray-400">Please check your Firestore security rules and authentication.</p>
      </div>
    );
  }

  return (
    <div className="bg-green-100 bg-opacity-0 min-h-screen mt-5">
      
      <div className="container mx-auto  ">
        

        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/5 w-full">
          <div className= "font-Poppins font-bold text-white text-4xl	font-Poppins 	fontpop" >Hey !{ currentUser.displayName } </div>
      <div className= "font-Poppins  text-white text-xl	font-Poppins mt-3	fontpop mb-5" >All Courses offered by Diana ATA</div>
            <Select
              onValueChange={handleCategoryChange}
              value={selectedCategory}
            >
              <SelectTrigger className="w-full bg-gray-800 text-gray-100 border-gray-700 rounded-md px-4 py-2 text-sm">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-gray-100">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-gray-100">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:w-4/5 w-full">
            <input
              type="text"
              className="w-[100px] bg-gray-800 text-gray-100 border-gray-700 rounded-md px-4 py-2 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(loading ? Array(6) : filteredCourses).map((course, index) => (
                <Card
                  key={course?.id || index}
                  className="pb-4 flex flex-col h-full bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors"
                >
                  {course ? (
                    <>
                      <CardImage
                        className={`w-full h-48 object-cover rounded-t-md ${
                          imageLoading[index] ? "hidden" : "block"
                        }`}
                        height={192}
                        width={340}
                        src={course.thumbnailUrl}
                        alt={course.courseName} 
                        onLoad={() => handleImageLoad(index)}
                      />
                      <div className="px-4 py-2 flex-grow">
                        <div className="text-lg font-medium h-12 mb-3 text-gray-100">
                          {course.courseName}
                        </div>
                      </div>
                      <div className="px-4 pb-2 mt-auto">
                        <Link to={`${course.id}`} className="w-full">
                          <Button
                            className="flex gap-2 items-center w-full justify-center bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600"
                            variant="outline"
                          >
                            <EyeIcon size={16} />
                            View Course
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <Skeleton className="h-8 w-1/2 bg-gray-700" />
                  )}
                </Card>
              ))}
            </div>

            {hasMore && courses.length < totalCourses && (
              <div className="m-3 text-center">
                <Button 
                  onClick={loadMoreCourses} 
                  disabled={loadingMore}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-100 disabled:bg-gray-800 disabled:text-gray-400"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}