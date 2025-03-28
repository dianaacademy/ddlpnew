import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { storage, db } from '@/firebase.config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import './Style/style.css';

function Certificate({ certData, certDocId }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef(null);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleGeneratePDF = async () => {
    if (!certificateRef.current || !certData) return;
    
    try {
      setIsGenerating(true);
      
      // A4 paper dimensions in points (landscape)
      const PDF_WIDTH = 841.89;  // 11.69 inches * 72 points per inch
      const PDF_HEIGHT = 595.28;  // 8.27 inches * 72 points per inch
      
      // Convert certificate to high-quality canvas
      const canvas = await html2canvas(certificateRef.current, {
        scale: 1.5, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: null,
        // Match the dimensions of our certificate container for pixel-perfect capture
        width: certificateRef.current.offsetWidth,
        height: certificateRef.current.offsetHeight
      });

      // Convert to image
      const imgData = canvas.toDataURL('image/png', 1.0);

      // Calculate the scale to fit certificate within A4 landscape
      const certificateAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = PDF_WIDTH / PDF_HEIGHT;
      
      let scaledWidth, scaledHeight, xOffset, yOffset;
      
      if (certificateAspectRatio > pdfAspectRatio) {
        // Certificate is wider than PDF proportion
        scaledWidth = PDF_WIDTH;
        scaledHeight = PDF_WIDTH / certificateAspectRatio;
        xOffset = 0;
        yOffset = (PDF_HEIGHT - scaledHeight) / 2;
      } else {
        // Certificate is taller than PDF proportion
        scaledHeight = PDF_HEIGHT;
        scaledWidth = PDF_HEIGHT * certificateAspectRatio;
        xOffset = (PDF_WIDTH - scaledWidth) / 2;
        yOffset = 0;
      }

      // Create new PDF in landscape orientation with A4 size
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
      });

      // Add the image centered on the page
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);

      // Convert PDF to Blob
      const pdfBlob = pdf.output('blob');

      // Upload to Firebase Storage
      const fileName = `certificates/${certData.uid}_${certData.courseId}_${Date.now()}.pdf`;
      const fileRef = storageRef(storage, fileName);
      
      await uploadBytes(fileRef, pdfBlob);
      
      // Get Download URL
      const downloadURL = await getDownloadURL(fileRef);

      // Update Firestore
      await updateDoc(doc(db, "cert_generate", certDocId), {
        cert_URL: downloadURL,
        cert_generated: true
      });

      // Open certificate in new tab
      window.open(downloadURL, '_blank');

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate certificate.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="certificate-generator">
      <button
        className="cert_download_btn_k7j9h"
        onClick={handleGeneratePDF}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating Certificate...' : 'Generate Certificate'}
      </button>

      <div id="cert_x7d9f1" ref={certificateRef}>
        <div className="cert_header_t7b1h">
          <img src="https://dcm2.vercel.app/static/media/topd.d5bc5d0c62f7e1b8e6e1.png" alt="Header decoration" width="500px"/>
        </div>

        <div className="cert_number_q9x4z">
          <h1>
            CERTIFICATE NO. <span id="certname">{certData?.CertNumber || 'DCM-2023'}</span>
          </h1>
        </div>

        <div className="cert_wrapper_a4b2e">
          <div className="cert_logo_left_p2k7j">
            {/* Using CertThumb from certData instead of fixed image */}
            <img src={certData?.CertThumb || "https://dcm2.vercel.app/static/media/logojs.42ffd49ca2a35478a563.webp"} 
                alt="Logo" width="200px" />
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
          
          <div class="cert_text_intro_w3s6f">
  This is to certify that {certData?.title && certData.title} 
  <span class="cert_recipient_u5x7m">{certData?.name || ''}</span>
</div>
          
          <div className="cert_text_suffix_z9t2d">
            has completed the Course successfully and is recognized as 
            <span id="email"> {certData?.recognizeAs || ''}</span> with Diana Advanced Tech Academy.
          </div>

          <div className="cert_qr_e4r7s">
            <img src="https://dcm2.vercel.app/static/media/qr.e02c5650a59ad7018804.png" alt="Certificate QR code" width="100px" />
          </div>

          <div className="cert_date_box_n2k8p">
            <h1>
              Date:- <span id="date">{certData?.requestedAt ? formatDate(certData.requestedAt) : 'March 18, 2025'}</span>
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

export default Certificate;