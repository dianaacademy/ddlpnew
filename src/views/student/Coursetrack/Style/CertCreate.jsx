import React, {useState} from 'react';
import '../components/style.css';
function getFirstThreeLettersOfSecondWord(str) {
const words = str.split(' ');

  // Check if there are at least two words
  if (words.length >= 2) {
    // Get the second word and extract the first 3 letters
    const secondWord = words[1];
    const firstThreeLetters = secondWord.slice(0, 3).toUpperCase();
    return firstThreeLetters;
  }
  return ''; 
}


function generateCertificateNumber( firstName, lastName, recognized, date) {
  const recognizedAsPrefix = recognized.slice(0, 3).toUpperCase();
  const recognizedAsSuffix = getFirstThreeLettersOfSecondWord(recognized);
  const lastNamePrefix = lastName[0].toUpperCase();
  const firstNamePrefix = firstName[0].toUpperCase();

  // Check if a date is provided, otherwise, use the current date and time
  let dateFormatted;
  if (date) {
    const dateParts = date.split("-");
    const today = new Date();
    const hours = String(today.getUTCHours()).padStart(2, '0');
    const minutes = String(today.getUTCMinutes()).padStart(2, '0');
    dateFormatted = `${dateParts[2]}${dateParts[1]}${dateParts[0]}-${hours}${minutes}`;
  } else {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    const hours = String(today.getUTCHours()).padStart(2, '0');
    const minutes = String(today.getUTCMinutes()).padStart(2, '0');

    dateFormatted = `${dd}${mm}${yyyy}-${hours}${minutes}`;
  }

  return `DATA / ${recognizedAsPrefix}-${recognizedAsSuffix} / ${firstNamePrefix}${lastNamePrefix}-${dateFormatted} / DATA`;
}

function App() {
  const [domain, setDomain] = useState('Cyber Security');
  const [activeTab, setActiveTab] = useState('tycon');
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const title = document.getElementById("title").value;
    const firstName = document.getElementById("Firstname").value;
    const lastName = document.getElementById("Lastname").value;
    const recognized = document.getElementById("recognized").value;
    const date = document.getElementById("date").value;
    const email = document.getElementById("email").value;

    // Generate the certificate number
    const certname = generateCertificateNumber(firstName, lastName, recognized, date);
    
    // Set the certificate number in the input field
    document.getElementById("certname").value = certname;

    // Build the query string
    const queryString = `?title=${encodeURIComponent(title)}&name=${encodeURIComponent(firstName)}&name2=${encodeURIComponent(lastName)}&recognized=${encodeURIComponent(recognized)}&date=${encodeURIComponent(date)}&certname=${encodeURIComponent(certname)}&email=${encodeURIComponent(email)}`;

    // Redirect to the "Kanban" page with the query string
    window.location.href = `Kanban${queryString}`;
  };







  
  const handleSubmit2 = (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const title = document.getElementById("title").value;
    const firstName = document.getElementById("Firstname").value;
    const lastName = document.getElementById("Lastname").value;
    const recognized = document.getElementById("recognized").value;
    const date = document.getElementById("date").value;
    const email = document.getElementById("email").value;

    // Generate the certificate number
    const certname = generateCertificateNumber(firstName, lastName, recognized, date);
    
    // Set the certificate number in the input field
    document.getElementById("certname").value = certname;

    // Build the query string
    const queryString = `?title=${encodeURIComponent(title)}&name=${encodeURIComponent(firstName)}&name2=${encodeURIComponent(lastName)}&recognized=${encodeURIComponent(recognized)}&date=${encodeURIComponent(date)}&certname=${encodeURIComponent(certname)}&email=${encodeURIComponent(email)}`;

    // Redirect to the "Kanban" page with the query string
    window.location.href = `internship${queryString}`;
  };
  const handleSubmit3 = (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const title = document.getElementById("title").value;
    const fullname = document.getElementById("fullname").value;
    const recognized = document.getElementById("recognized").value;
    const keynotes = document.getElementById("keynotes").value;





    function formatDate(inputDate) {
      const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
      ];
  
      const dateObj = new Date(inputDate);
      const day = dateObj.getDate();
      const monthIndex = dateObj.getMonth();
      const year = dateObj.getFullYear();
  
      function getDaySuffix(day) {
          if (day >= 11 && day <= 13) {
              return "th";
          }
          switch (day % 10) {
              case 1:
                  return "st";
              case 2:
                  return "nd";
              case 3:
                  return "rd";
              default:
                  return "th";
          }
      }
  
      const monthName = months[monthIndex];
      const daySuffix = getDaySuffix(day);
  
      return `${day}${daySuffix} ${monthName} ${year}`;
  }

  const date = document.getElementById("date").value;
  const sdate = document.getElementById("sdate").value;
  const enddate = document.getElementById("enddate").value;
  
  const formatteddate = formatDate(date);
  const formattedsdate = formatDate(sdate);
  const formattedenddate = formatDate(enddate);
  









    // Build the query string
    const queryString = `?title=${encodeURIComponent(title)}&fullname=${encodeURIComponent(fullname)}&recognized=${encodeURIComponent(recognized)}&date=${encodeURIComponent(formatteddate)}&sdate=${encodeURIComponent(formattedsdate)}&enddate=${encodeURIComponent(formattedenddate)}&keynotes=${encodeURIComponent(keynotes)}`;

    // Redirect to the "Kanban" page with the query string
    window.location.href = `internshipLetter${queryString}`;
  };
  const handleDomainChange = (event) => {
    setDomain(event.target.value);
  };
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  const Submit = (e) => {
    e.preventDefault();}



  
}


export default App;