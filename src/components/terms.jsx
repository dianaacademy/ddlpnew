import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
          <h2 className="text-xl text-gray-600">Diana Advanced Tech Academy - Privacy Policy</h2>
          <p className="text-sm text-gray-500 mt-2">Last updated: 20 FEBRUARY 2024</p>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction to this Policy</h2>
            <div className="space-y-4 pl-4">
              <p>1.1. This privacy policy ("Policy") relates to the Diana Learning Portal Application and Diana Sentinel ("Website"), which is owned and operated by Diana Advanced Tech Academy.</p>
              <p>1.2. You should read this Policy carefully as it contains important information about how we will use your Information (as defined below in clause 4.1). In certain circumstances (see below), you will be required to indicate your consent to the processing of your Information as set out in this Policy when you first submit such Information to or through the Website. For further information about consent, see clause 7 below.</p>
              <p>1.3. We may update this Policy from time to time in accordance with clause 16 below. This Policy was last updated on 20 FEBRUARY 2024.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">2. About Us</h2>
            <div className="space-y-4 pl-4">
              <p>2.1. The terms "Diana Learning Portal," "Diana Sentinel," or "us," or "we" refer to Diana Advanced Tech Academy, the owner of the Website. We are a company registered in the United Kingdom. The term "you" refers to the individual accessing and/or submitting Information to the Website.</p>
              <p>2.2. We, as the Data Controller, can be contacted via email at info@dianaadvancedtechacademy.uk.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Data Protection</h2>
            <div className="space-y-4 pl-4">
              <p>3.1. References in this Policy to:</p>
              <div className="pl-4">
                <p>3.1.1. "Privacy and Data Protection Requirements" means the General Data Protection Regulation 2016/679 ("GDPR") and all applicable laws and regulations in force from time to time relating to the processing of Personal Data and privacy.</p>
                <p>3.1.2. "Personal Data," "Data Controller," "Data Processor," and "processing" shall have the meanings given to them under applicable Privacy and Data Protection Requirements.</p>
              </div>
              <p>3.2. For the purposes of applicable Privacy and Data Protection Requirements, we (Diana Advanced Tech Academy) are the Data Controller and therefore responsible for, and control the processing of, your Personal Data in accordance with applicable Privacy and Data Protection Requirements.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">4. Information We May Collect About You</h2>
            <div className="space-y-4 pl-4">
              <p>4.1. When you use the Website and/or when you otherwise interact with us, we may collect the following information about you ("Information"):</p>
              <div className="pl-4">
                <p>4.1.1. Personal information, including first and last name.</p>
                <p>4.1.2. Contact information, including primary email address, company name, and/or primary phone number.</p>
                <p>4.1.3. Technical information, including IP address, operating system, browser type, and related information regarding the device you used to visit the Website.</p>
                <p>4.1.4. Information obtained through our correspondence and monitoring in accordance with clause 4.2 below.</p>
                <p>4.1.5. Details of any enquiries made by you through the Website, together with details relating to subsequent correspondence (if applicable).</p>
              </div>
              <p>4.2. We may monitor your use of the Website through 'cookies' and similar tracking technologies. We track your usage of our Website to improve services and provide insights back to your training organization, if applicable. We may also monitor traffic, location, and other data about users of the Website.</p>
              <p>4.3. We may receive information about you from third-party sources if you connect to the Website from any third-party websites and applications that integrate with our services.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">5. How Long We Keep Your Information</h2>
            <div className="space-y-4 pl-4">
              <p>5.1. We will keep your Information only for the purposes set out below:</p>
              <div className="pl-4">
                <p>5.1.1. 6 months post-account or course expiration period, where the legal basis for processing is necessary for the performance of the contract.</p>
                <p>5.1.2. 6 months post-account or course expiration period or until consent is withdrawn (whichever is sooner), where the legal basis is express consent.</p>
              </div>
              <p>5.2. If required, we will retain Information for longer periods to comply with our legal or regulatory obligations.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">6. Legal Basis for Processing Your Information</h2>
            <div className="space-y-4 pl-4">
              <p>6.1. Under applicable Privacy and Data Protection Requirements, we may only process your Information if we have a "legal basis" for doing so. Our legal basis for processing your Information is as follows:</p>
              <ul className="list-decimal pl-6">
                <li>Contractual necessity: to operate, administer, maintain, and improve the Website and the services available through it.</li>
                <li>Legitimate interests: to investigate and address any comments, queries, or complaints made by you.</li>
                <li>Legal obligations: to comply with laws, including preventing unlawful activity.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">7. Your Consent to Processing</h2>
            <div className="space-y-4 pl-4">
              <p>7.1. You may be required to give consent to certain processing activities when submitting your Information to us. Where applicable, we will seek this consent when you first submit Information.</p>
              <p>7.2. You can withdraw your consent at any time through your account or by notifying us in writing at info@dianaadvancedtechacademy.uk.</p>
              <p>7.3. If you withdraw consent and we have no other legal basis for processing your Information, we will stop processing it. If we have another legal basis, we may continue to process it subject to your rights.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">8. Disclosure of Your Information</h2>
            <div className="space-y-4 pl-4">
              <p>8.1. We may disclose your Information to:</p>
              <ul className="list-decimal pl-6">
                <li>Other companies within our group.</li>
                <li>Business partners, service providers, or third-party contractors who perform services on our behalf.</li>
                <li>Law enforcement agencies or regulators when required.</li>
              </ul>
              <p>8.2. We may disclose aggregated, anonymous information to third parties, including analytics providers, for improving and optimizing the Website.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">9. Keeping Your Information Secure</h2>
            <div className="space-y-4 pl-4">
              <p>9.1. We will use appropriate technical and organizational measures to safeguard your Information, including encryption.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">10. Monitoring</h2>
            <div className="space-y-4 pl-4">
              <p>We may monitor and record communications for quality assurance, training, and compliance purposes.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">11. Overseas Transfers</h2>
            <div className="space-y-4 pl-4">
              <p>We may transfer your Information to countries outside the EEA, such as the USA, for business purposes. We will take steps to ensure the security of your Information when transferred.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">12. Information About Other Individuals</h2>
            <div className="space-y-4 pl-4">
              <p>If you provide us with Information about a third party, you confirm that you have their consent to process their data.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">13. Your Rights</h2>
            <div className="space-y-4 pl-4">
              <p>You have the following rights regarding your Personal Data:</p>
              <ul className="list-disc pl-6">
                <li>The right to access your data.</li>
                <li>The right to rectify inaccurate information.</li>
                <li>The right to delete or restrict processing of your data in certain circumstances.</li>
                <li>The right to data portability and to object to processing in specific situations.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">14. 'Cookies' and Related Software</h2>
            <div className="space-y-4 pl-4">
              <p>We use cookies and similar technologies to track and improve your user experience. You can manage your cookie settings, but disabling them may affect Website functionality. For more information, visit www.aboutcookies.org.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">15. Changes to this Policy</h2>
            <div className="space-y-4 pl-4">
              <p>We may update this Policy from time to time. The latest version will be posted on this page.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">16. Links to Other Websites</h2>
            <div className="space-y-4 pl-4">
              <p>Our Website may contain links to other websites. This Policy applies only to our Website, and we are not responsible for the privacy practices of third-party sites.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">17. Accessibility</h2>
            <div className="space-y-4 pl-4">
              <p>We aim to provide this Policy in an accessible format. If you need assistance or an alternative format, please contact us.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">18. Contact Us</h2>
            <div className="space-y-4 pl-4">
              <p>If you have any questions or concerns about this Policy, please email us at info@dianaadvancedtechacademy.uk.</p>
            </div>
          </div>
        </section>

        <footer className="mt-12 pt-6 border-t text-sm text-gray-600">
          <p>This Policy is subject to change. Please check this page regularly for updates.</p>
        </footer>
      </div>
    </div>
  );
};

export default TermsAndConditions;