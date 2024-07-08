import { Fragment } from "react";
import Footer from "../footer";
import Student from "../student";
import Header from "../header";
import Sponsor from "../sponsor";
import Blog from "../blog";
import Banner from "../banner";
import Category from "../category";
import Achievement from "../achievement";
import About from "../about";
import Instructor from "../instructor";
import "../../index.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import '../../assets/css/icofont.min.css';
import '../../assets/css/animate.css';
import '../../assets/css/style.min.css';
const Home = () => {
   
    return (
     <div className="">
           <Fragment >  
            <Header />
            <Banner />
            <Sponsor />
            <Category />           
             <About />
            <Instructor />
            <Student />
            <Blog />
            <Achievement />
            <Footer />
        </Fragment>
     </div>
    );
}
 
export default Home;