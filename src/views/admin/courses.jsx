import { EyeOpenIcon, Pencil1Icon,  } from "@radix-ui/react-icons";
import { BsBuilding } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { db } from "@/firebase.config";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
    Card, 
    CardTitle,
    CardContent,
 } from "@/components/ui/card";

export default function CourseTable() {
    const [courses, setCourses] = useState([]);
    console.log(courses);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "courses"));
                const coursesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCourses(coursesList);
            } catch (error) {
                console.error("Error fetching courses: ", error);
            }
        };

        fetchCourses();
    }, []);


	return (
		<>
			<div className="rounded-md bg-graident-dark border-[0.5px] overflow-y-scroll ">
				<div className="w-[800px] md:w-full">
					<div className=" mt-8 px-4 py-4  grid grid-cols-3 grid-flow-row gap-4">
                            {courses?.map((courses, index) => {
                                
                                return (
                                    <Card className="pb-4">
                                    <div className="pt-4" key={index}>
                                        <CardTitle className ="px-2 py-2">
                                            {courses.courseName}
                                        </CardTitle>
                                        <CardContent className= "pt-2">

                                        <img 
                                        className="w-72 h-72 object-cover rounded-md"
                                        height={300}
                                        width={300}
                                        
                                        src={courses.thumbnailUrl} alt="" />

                                        <Actions  id={courses.id } slug={courses.id} />
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
            <Link to={`${slug }`}>
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
