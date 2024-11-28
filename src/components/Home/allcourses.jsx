import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { db } from "@/firebase.config";
import { useState, useEffect } from "react";
import { collection, getDocs, query, limit, where, orderBy, startAfter, getCountFromServer } from "firebase/firestore";
import { Card, CardTitle, CardContent, CardImage } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, EyeIcon } from "lucide-react";

export default function CourseStudent() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
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
    const categoryParam = searchParams.get('cat');
    setSelectedCategory(categoryParam || "all");
  }, [location.search]);

  useEffect(() => {
    fetchCourses();
    updateTotalCourses();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const uniqueCategories = new Set();
      querySnapshot.docs.forEach(doc => {
        const category = doc.data().category;
        if (category) uniqueCategories.add(category);
      });
      setCategories(Array.from(uniqueCategories));
    } catch (error) {
      console.error("Error fetching categories: ", error);
      setError("Unable to fetch categories. Check your Firestore permissions.");
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

      setCourses(prev => loadMore ? [...prev, ...coursesList] : coursesList);
      setImageLoading(Array(coursesList.length).fill(true));
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === coursesPerPage);
    } catch (error) {
      console.error("Error fetching courses: ", error);
      setError("Unable to fetch courses. Check your Firestore permissions.");
    } finally {
      setLoading(false);
    }
  };

  const truncateName = (name, maxLength = 30) => {
    return name.length > maxLength 
      ? name.substring(0, maxLength) + '...' 
      : name;
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
      setError("Unable to count courses. Check your Firestore permissions.");
    }
  };

  const handleImageLoad = (index) => {
    setImageLoading((prev) => {
      const newImageLoading = [...prev];
      newImageLoading[index] = false;
      return newImageLoading;
    });
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
      <div className="p-4 text-red-600">
        {error}
        <p>Please check your Firestore security rules and authentication.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">All Courses</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/5 w-full">
            <Select 
              onValueChange={handleCategoryChange} 
              value={selectedCategory}
            >
              <SelectTrigger className="w-full bg-white rounded-md px-4 py-2 text-sm">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:w-4/5 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(loading ? Array(6) : courses).map((course, index) => (
                <Card 
                  key={course?.id || index} 
                  className="pb-4 flex flex-col h-full"
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
                      {imageLoading[index] && (
                        <div className="px-4 py-2">
                          <Skeleton className="h-8 w-1/2" />
                        </div>
                      )}
                      <div className="px-4 py-2 flex-grow">
                        <div className="text-lg font-medium h-12 mb-3">
                          {truncateName(course.courseName, 40)}
                        </div>
                        
                      </div>
                      <div className="px-4 pb-2 mt-auto">
                        <Link to={`${course.id}`} className="w-full">
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

            {hasMore && courses.length < totalCourses && (
              <div className="m-3 text-center">
                <Button onClick={loadMoreCourses} disabled={loadingMore}>
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
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