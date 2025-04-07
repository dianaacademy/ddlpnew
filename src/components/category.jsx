import { Link } from "react-router-dom";
import CyberIcon from "../assets/images/category/icon/01.svg";
import aiIcon from "../assets/images/category/icon/ai.svg";
import Devops from "../assets/images/category/icon/Devops.svg";
import Blockchain from "../assets/images/category/icon/Blockchain.svg";
import Azure from "../assets/images/category/icon/Azure.svg";
import Linux from "../assets/images/category/icon/Linux.svg";
import fiveG from "../assets/images/category/icon/5G.svg";
import Bigdata from "../assets/images/category/icon/Bigdata.svg";


import Aws from "../assets/images/category/icon/aws.svg";
import Vmware from "../assets/images/category/icon/vmware-logo-grey.svg";
import WebDevelopment from "../assets/images/category/icon/websiter.svg";
import DigitalMarketing from "../assets/images/category/icon/ddmm.svg";
import Coding from "../assets/images/category/icon/coding.svg";
import Oracle from "../assets/images/category/icon/oracle.svg";
import DianaJunior from "../assets/images/category/icon/junior.svg";

import MiniCourseList from "./Home/ShowFreeCourse";

const title = "Top Categories";
const categoryList = [
    { imgUrl: CyberIcon, title: "Cyber Security", url: "/course?cat=CyberSecurity" },
    { imgUrl: aiIcon, title: "artificial intelligence", url: "/course?cat=AI" },
    { imgUrl: Devops, title: "DevOps", url: "/course?cat=DevOps" },
    { imgUrl: Blockchain, title: "Blockchain ", url: "/course?cat=BlockChain" },
    { imgUrl: Azure, title: "Linux", url: "/course?cat=Linux" },
    { imgUrl: Linux, title: "Azure", url: "/course?cat=Azure" },
    { imgUrl: Bigdata, title: "Bigdata", url: "/course?cat=BigData" },
    { imgUrl: fiveG, title: "5G", url: "/course?cat=5G" },
    { imgUrl: Aws, title: "Aws", url: "/course?cat=AWS" },
    { imgUrl: Vmware, title: "Vmware", url: "/course?cat=VMWARE" },
    { imgUrl: WebDevelopment, title: "Web Development", url: "/course?cat=Web+Development" },
    { imgUrl: DigitalMarketing, title: "Digital Marketing", url: "/course?cat=Digital+Marketing" },
    { imgUrl: Coding, title: "Coding", url: "/course?cat=Coding" },
    { imgUrl: Oracle, title: "Oracle", url: "/course?cat=Oracle" },
    { imgUrl: DianaJunior, title: "Diana Junior", url: "/course?cat=Diana+Junior" },
];

const Category = () => {
    return (
        <div className="category-section py-10">
            <div className="container mx-auto">
                <div className="text-center mb-8">

                    <h2 className="text-2xl font-bold">Free Courses</h2>
                    <MiniCourseList/>
                    <h2 className="text-2xl font-bold mt-5">{title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categoryList.map((category, index) => (
                        <Link
                            to={category.url}  // Custom URL for each category
                            key={index}
                            className=" bg-white border border-gray-200 rounded-lg  hover:shadow-lg hover:bg-gray-100 transition-all p-4 flex items-center space-x-4"
                        >
                            <div className="flex-shrink-0">
                                <img
                                    src={category.imgUrl}
                                    alt={category.title}
                                    className="w-12 h-12 object-contain"
                                />
                            </div>
                            <div>
                                <h6 className="text-lg font-semibold text-gray-800">{category.title}</h6>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Category;
