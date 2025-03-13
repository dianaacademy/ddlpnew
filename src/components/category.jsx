import { Link } from "react-router-dom";
import CyberIcon from "../assets/images/category/icon/01.svg";
import aiIcon from "../assets/images/category/icon/ai.svg";
import Devops from "../assets/images/category/icon/Devops.svg";
import Blockchain from "../assets/images/category/icon/Blockchain.svg";
import Azure from "../assets/images/category/icon/Azure.svg";
import Linux from "../assets/images/category/icon/Linux.svg";
import fiveG from "../assets/images/category/icon/5G.svg";
import Bigdata from "../assets/images/category/icon/Bigdata.svg";

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
];

const Category = () => {
    return (
        <div className="category-section py-10">
            <div className="container mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">{title}</h2>
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
