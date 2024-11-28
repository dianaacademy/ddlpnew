
import { Link } from "react-router-dom";

const newsTitle = "Want To Updates, What's Happening in Tech";
const siteTitle = "Site Map";
const useTitle = "Useful Links";
const socialTitle = "Social Contact";
const supportTitle = "Our Support";


const siteList = [
    // {
    //     text: 'Documentation',
    //     link: '#',
    // },
    {
        text: 'Feedback',
        link: 'https://dianaadvancedtechacademy.uk/submit-feedback/',
    },
    // {
    //     text: 'Plugins',
    //     link: '#',
    // },
    // {
    //     text: 'Support Forums',
    //     link: '#',
    // },
    // {
    //     text: 'Themes',
    //     link: '#',
    // },
]

const useList = [
    {
        text: 'About Us',
        link: 'https://dianaadvancedtechacademy.uk/about-us/',
    },
    
    {
        text: 'Terms & Conditions',
        link: 'https://dianaadvancedtechacademy.uk/terms-and-conditions/',
    },
    
    {
        text: 'Privacy Policy',
        link: 'https://dianaadvancedtechacademy.uk/privacy-policy/',
    },
]

const socialList = [
    {
        text: 'Facebook',
        link: 'https://www.facebook.com/dianaadvancedtech/',
    },
    {
        text: 'Twitter',
        link: 'https://twitter.com/academydiana',
    },
    {
        text: 'Instagram',
        link: 'https://www.instagram.com/dianaadvancedtech/',
    },
    {
        text: 'Linkedin',
        link: 'https://www.linkedin.com/in/diana-academy/',
    },
    // {
    //     text: 'Github',
    //     link: '#',
    // },
]

const supportList = [
    {
        text: 'Help',
        link: 'mailto:info@dianaadvancedtechacademy.uk',
    },
    {
        text: 'Contact Us',
        link: 'https://dianaadvancedtechacademy.uk/contactus/',
    },
    // {
    //     text: 'Paid with Mollie',
    //     link: '#',
    // },
    // {
    //     text: 'Status',
    //     link: '#',
    // },
    // {
    //     text: 'Changelog',
    //     link: '#',
    // },
    
]



const Footer = () => {
    return (
        <div className="news-footer-wrap">
            <div className="fs-shape">
                <img src="assets/images/shape-img/03.png" alt="fst" className="fst-1" />
                <img src="assets/images/shape-img/04.png" alt="fst" className="fst-2" />
            </div>
            
            <div className="news-letter">
                <div className="container">
                    <div className="section-wrapper">
                        <div className="news-title">
                            <h3>{newsTitle}</h3>
                        </div>
                        <div className="news-form">
                            <form action="/">
                                <div className="nf-list">
                                    <input type="email" name="email" placeholder="Enter Your Email" />
                                    <input type="submit" name="submit" value="Subscribe Now" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer>
                <div className="footer-top padding-tb pt-0">
                    <div className="container">
                        <div className="row g-4 row-cols-xl-4 row-cols-md-2 row-cols-1 justify-content-center">
                            <div className="col">
                                <div className="footer-item">
                                    <div className="footer-inner">
                                        <div className="footer-content">
                                            <div className="title">
                                                <h4>{siteTitle}</h4>
                                            </div>
                                            <div className="content">
                                                <ul className="lab-ul">
                                                    {siteList.map((val, i) => (
                                                        <li key={i}><a href={val.link}>{val.text}</a></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="footer-item">
                                    <div className="footer-inner">
                                        <div className="footer-content">
                                            <div className="title">
                                                <h4>{useTitle}</h4>
                                            </div>
                                            <div className="content">
                                                <ul className="lab-ul">
                                                    {useList.map((val, i) => (
                                                        <li key={i}><a href={val.link}>{val.text}</a></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="footer-item">
                                    <div className="footer-inner">
                                        <div className="footer-content">
                                            <div className="title">
                                                <h4>{socialTitle}</h4>
                                            </div>
                                            <div className="content">
                                                <ul className="lab-ul">
                                                    {socialList.map((val, i) => (
                                                        <li key={i}><a href={val.link}>{val.text}</a></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="footer-item">
                                    <div className="footer-inner">
                                        <div className="footer-content">
                                            <div className="title">
                                                <h4>{supportTitle}</h4>
                                            </div>
                                            <div className="content">
                                                <ul className="lab-ul">
                                                    {supportList.map((val, i) => (
                                                        <li key={i}><a href={val.link}>{val.text}</a></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom style-2">
                    <div className="container">
                        <div className="section-wrapper">
                            <p>&copy; 2024 <Link to="/">Diana Advanced Tech Academy</Link>  </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
 
export default Footer;