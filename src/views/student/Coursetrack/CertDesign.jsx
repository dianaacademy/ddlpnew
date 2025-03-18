import React, { useState, useEffect } from 'react';
import './Style/style.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    recognized: '',
    date: '',
    certname: '',
    title: '',
    name2: '',
  });

  useEffect(() => {
    // Parse URL parameters on component mount
    const urlParams = new URLSearchParams(window.location.search);
    setFormData({
      name: urlParams.get('name') || '',
      email: urlParams.get('email') || '',
      recognized: urlParams.get('recognized') || '',
      date: urlParams.get('date') || '',
      certname: urlParams.get('certname') || '',
      title: urlParams.get('title') || '',
      name2: urlParams.get('name2') || '',
    });
  }, []);

  // Function to handle downloading as PDF
  const handleDownloadPDF = () => {
    // PDF download functionality would be implemented here
    console.log("Download PDF functionality needs implementation");
    // You would typically use a library like html2pdf or jsPDF here
  };

  return (
    <div className="App">
      <button
        className="cert_download_btn_k7j9h"
        onClick={handleDownloadPDF}
      >
        Download Certificate
      </button>

      <div id="cert_x7d9f1">
        <div className="cert_header_t7b1h">
          <img src="https://dcm2.vercel.app/static/media/topd.d5bc5d0c62f7e1b8e6e1.png" alt="Header decoration" width="500px"/>
        </div>

        <div className="cert_number_q9x4z">
          <h1>
            CERTIFICATE NO. <span id="certname">{formData.certname || 'DCM-2023'}</span>
          </h1>
        </div>

        <div className="cert_wrapper_a4b2e">
          <div className="cert_logo_left_p2k7j">
            <img src="https://dcm2.vercel.app/static/media/logojs.42ffd49ca2a35478a563.webp" alt="Logo" width="200px" />
          </div>
          
          <div className="cert_logo_right_c6n3r">
            <img src="https://dcm2.vercel.app/static/media/lloyd.8328fb92c18dd77b6cf0.png" alt="Lloyd certification" width="90px" />
            <img src="https://dcm2.vercel.app/static/media/ukas.83587bd800db0850a74e.png" alt="UKAS certification" width="70px" />
          </div>

          <div className="cert_title_f8e0t">
            <div className="cert_title_main_h1y9d">Certificate</div>
          </div>

          <div className="cert_border_top_f5j2k">
            <img src="https://dcm2.vercel.app/static/media/border.add3240be0ba1bcdf6c24433d5db0ba3.svg" alt="Decorative border" width="350px" />
          </div>
          
          <div className="cert_title_sub_j4r2h">of Completion</div>
          
          <div className="cert_text_intro_w3s6f">This certificate is presented to </div>
          
          <div className="cert_text_prefix_g7b4v">
            This is to certify that {formData.title && <span id="title">{formData.title}</span>}
          </div>
          
          <div className="cert_recipient_u5x7m">
            <span id="name">{formData.name}</span>
            {formData.name2 && <span id="name2">&nbsp;{formData.name2}</span>}
          </div>
          
          <div className="cert_text_suffix_z9t2d">
            has completed the Course successfully and is recognized as 
            <span id="email"> {formData.email}</span> with Diana Advanced Tech Academy
            {formData.recognized && <span id="recognized"> - {formData.recognized}</span>}
          </div>

          <div className="cert_qr_e4r7s">
            <img src="https://dcm2.vercel.app/static/media/qr.e02c5650a59ad7018804.png" alt="Certificate QR code" width="100px" />
          </div>

          <div className="cert_date_box_n2k8p">
            <h1>
              Date:- <span id="date">{formData.date || 'March 18, 2025'}</span>
            </h1>
          </div>

          <div className="cert_signatures_y9i6o">
            <div className="cert_director_b8v2d">
              <div className="cert_sign_dir_v3x8q">
                <img src="https://dcm2.vercel.app/static/media/sign.81002233fba8749b2015.png" alt="Director signature" width="200px" />
              </div>
              <div className="cert_title_role_d3f7h">DIRECTOR</div>
              <div className="cert_border_bottom_q1w3e">
                <img src="https://dcm2.vercel.app/static/media/border.add3240be0ba1bcdf6c24433d5db0ba3.svg" alt="Decorative border" width="350px" />
              </div>
            </div>

            <div className="cert_middle_logo_j7h4s">
              <img src="https://dcm2.vercel.app/static/media/cert.83fa574975c9ce2bdc13.png" alt="Certification logo" width="200px" />
            </div>

            <div className="cert_ceo_l1m5p">
              <div className="cert_sign_ceo_r2t5u">
                <img src="https://dcm2.vercel.app/static/media/signceo.14d169f207939106c9f6.png" alt="CEO signature" width="250px" />
              </div>
              <div className="cert_title_role_d3f7h">CEO</div>
            </div>
          </div>

          <div className="cert_bottom_k3f0p"></div>
        </div>
      </div>
    </div>
  );
}

export default App;