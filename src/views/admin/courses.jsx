import { EyeOpenIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { BsBuilding } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { db } from "@/firebase.config";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Adjust the import path as necessary
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { debounce } from "lodash";
export default function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]); // Tracks filtered courses
  const [searchTerm, setSearchTerm] = useState(""); // Tracks the search input
  const [imageLoading, setImageLoading] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const coursesList = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          index,
          ...doc.data(),
        }));
        setCourses(coursesList);
        setFilteredCourses(coursesList); // Initialize filtered courses
        setImageLoading(Array(coursesList.length).fill(true));
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };

    fetchCourses();
  }, []);

  const handleImageLoad = (index) => {
    setImageLoading((prev) => {
      const newImageLoading = [...prev];
      newImageLoading[index] = false;
      return newImageLoading;
    });
  };

  // Debounced function to update search results
  const debouncedSearch = debounce((term) => {
    setFilteredCourses(
      courses.filter((course) =>
        course.courseName.toLowerCase().includes(term.toLowerCase())
      )
    );
  }, 500); // 1-second debounce

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  return (
    <>
      <div className="rounded-md bg-graident-dark border-[0.5px] overflow-y-scroll ">
    
        <div className="w-[800px] md:w-full">
        <div className="pt-4 md:ml-[900px]">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative px-4">
              <Search className="absolute left-2.5 pr-6 top-2.5 h-4 w-14 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mx-4 sm:w-[300px] md:w-[200px] lg:w-[400px]"
              />
            </div>
          </form>
        </div>
          <div className="mt-8 px-4 py-4 grid grid-cols-3 grid-flow-row gap-4">
            {filteredCourses?.map((course, index) => (
              <Card key={course.id} className="pb-4">
                <div className="pt-4">
                  <CardTitle className="px-2 py-2">
                    {course.courseName}
                  </CardTitle>
                  <CardContent className="pt-2">
                    {imageLoading[index] && (
                      <div>
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
        </div>
      </div>
    </>
  );
}

const Actions = ({ id, slug }) => {
  return (
    <div className="flex items-center gap-2 md:flex-wrap">
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
