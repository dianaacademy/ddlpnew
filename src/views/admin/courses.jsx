import { EyeOpenIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { BsBuilding } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { db } from "@/firebase.config";
import { useState, useEffect } from "react";
import { collection, getDocs, query, limit, where, orderBy, startAfter, getCountFromServer } from "firebase/firestore";
import PropTypes from "prop-types";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [imageLoading, setImageLoading] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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
    }
  };

  const fetchCourses = async (loadMore = false) => {
    setLoading(true);
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

  return (
    <>
      <div className="m-4 flex items-center space-x-4">
        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
          <SelectTrigger className="w-[200px]">
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
        <span>Total {totalCourses} Courses</span>
      </div>
      <div className="rounded-md bg-graident-dark">
        <div className="w-[100%] md:w-full">
          {loading ? (
            <div className="mt-8 px-4 py-4 grid grid-cols-3 grid-flow-row gap-4">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="pb-4">
                  <div className="pt-4">
                    <CardContent className="pt-2">
                      <div className="m-2">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-8 px-4 py-4 grid grid-cols-3 grid-flow-row gap-4">
              {courses.map((course, index) => (
                <Card key={course.id} className="pb-4">
                  <div className="pt-4">
                    <CardTitle className="px-6 py-2 ">
                      {course.courseName}
                    </CardTitle>
                    <CardContent className="pt-2">
                      {imageLoading[index] && (
                        <div className="m-2">
                          <Skeleton className="h-8 w-1/2" />
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                        </div>
                      )}
                      <img
                        className={`w-72 h-72 object-cover rounded-md ${
                          imageLoading[index] ? "hidden" : "block"
                        }`}
                        height={300}
                        width={300}
                        src={course.thumbnailUrl}
                        alt={course.courseName}
                        onLoad={() => handleImageLoad(index)}
                      />
                      <Actions id={course.id} slug={course.id} />
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      {hasMore && courses.length < totalCourses && (
        <div className="m-3 text-center ">
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
    </>
  );
}

const Actions = ({ id, slug }) => {
  return (
    <div className="flex items-center gap-2 md:flex-wrap pt-3">
      <Link to={`${slug}`}>
        <Button className="flex gap-2 items-center" variant="outline">
          <EyeOpenIcon />
          View
        </Button>
      </Link>
      <Link to={`${id}`}>
        <Button className="flex gap-2 items-center" variant="outline">
          <Pencil1Icon />
          Edit
        </Button>
      </Link>
      <Link to={`build/${slug}`}>
        <Button className="flex gap-2 items-center" variant="outline">
          <BsBuilding />
          Build
        </Button>
      </Link>
    </div>
  );
};

Actions.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};