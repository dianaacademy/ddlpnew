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

export default function CourseStudent() {
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
  const [debouncedSearchUpdate, setDebouncedSearchUpdate] = useState(false);
  const coursesPerPage = 15;

  const navigate = useNavigate();
  const location = useLocation();

  // Initialize from URL params only on first load
  useEffect(() => {
    fetchCategories();
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get("cat");
    const queryParam = searchParams.get("query");
    
    if (categoryParam) setSelectedCategory(categoryParam);
    if (queryParam) setSearchQuery(queryParam);
  }, []); // Empty dependency array - only run once on mount

  // Fetch courses when category changes
  useEffect(() => {
    fetchCourses();
    updateTotalCourses();
  }, [selectedCategory]);

  // Filter courses based on search query
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

  // Debounce search updates to avoid too many URL changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchUpdate(true);
    }, 500);
    
    return () => {
      clearTimeout(timer);
      setDebouncedSearchUpdate(false);
    };
  }, [searchQuery]);

  // Update URL when search query changes (debounced)
  useEffect(() => {
    if (!debouncedSearchUpdate) return;
    
    const currentParams = new URLSearchParams(location.search);
    
    if (searchQuery) {
      currentParams.set("query", searchQuery);
    } else {
      currentParams.delete("query");
    }
    
    // Keep category if it exists
    if (selectedCategory !== "all") {
      currentParams.set("cat", selectedCategory);
    } else {
      currentParams.delete("cat");
    }
    
    const newQueryString = currentParams.toString();
    const newPath = location.pathname + (newQueryString ? `?${newQueryString}` : "");
    
    // Only update if the URL would actually change
    if (newPath !== location.pathname + location.search) {
      navigate(newPath, { replace: true });
    }
    
    setDebouncedSearchUpdate(false);
  }, [debouncedSearchUpdate, searchQuery, selectedCategory, navigate, location]);

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

      setCourses((prev) => (loadMore ? [...prev, ...coursesList] : coursesList));
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

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setLastVisible(null);
    setCourses([]);
    
    const currentParams = new URLSearchParams(location.search);
    if (value === "all") {
      currentParams.delete("cat");
    } else {
      currentParams.set("cat", value);
    }
    
    // Preserve search query if it exists
    if (searchQuery) {
      currentParams.set("query", searchQuery);
    } else {
      currentParams.delete("query");
    }
    
    const newQueryString = currentParams.toString();
    const newPath = location.pathname + (newQueryString ? `?${newQueryString}` : "");
    navigate(newPath, { replace: true });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
            <input
              type="text"
              className="w-full bg-white rounded-md px-4 py-2 mb-4"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearchChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(loading ? Array(6) : filteredCourses).map((course, index) => (
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
                      <div className="px-4 py-2 flex-grow">
                        <div className="text-lg font-medium h-12 mb-3">
                          {course.courseName}
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
                    <Skeleton className="h-8 w-1/2" />
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