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

export default function CourseTable() {
  const [courses, setCourses] = useState([]);
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

  return (
    <>
      <div className="rounded-md bg-graident-dark border-[0.5px] overflow-y-scroll ">
        <div className="w-[800px] md:w-full">
          <div className="mt-8 px-4 py-4 grid grid-cols-3 grid-flow-row gap-4">
            {courses?.map((course, index) => {
              return (
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
              );
            })}
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
