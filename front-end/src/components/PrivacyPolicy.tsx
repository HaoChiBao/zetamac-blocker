import React from 'react';
import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="privacy-container">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h1>Privacy Policy</h1>
      <p>Effective Date: {new Date().toLocaleDateString()}</p>

      <section>
        <p>
          Lowkey Smarter ("we", "us", or "our") respects your privacy and is committed to protecting the personal information that you share with us. 
          This Privacy Policy explains how we collect, use, and safeguard your information when you use the Lowkey Smarter Chrome extension.
        </p>
      </section>

      <section>
        <h2>1. Information We Collect</h2>
        <p>
          When you use the Lowkey Smarter extension, we prioritize your privacy.
        </p>
        <p>
          <strong>Local Data:</strong> We store information locally on your device, including:
          <ul>
            <li>Game history and performance metrics (e.g., scores, times).</li>
            <li>User settings (e.g., blocked sites list, game preferences).</li>
          </ul>
        </p>
        <p>
          We <strong>do not</strong> collect, transmit, or store any of your personal data, browsing history, or game data on our external servers.
        </p>
      </section>

      <section>
        <h2>2. How We Use the Information</h2>
        <p>
          The information stored locally is used solely for the purpose of:
          <ul>
            <li>Providing the core functionality of blocking distracting sites and presenting games.</li>
            <li>Tracking your progress and game statistics to show your improvement over time.</li>
            <li>Persisting your customized settings and preferences.</li>
          </ul>
        </p>
        <p>
          We do not sell, rent, or trade any personal information to third parties.
        </p>
      </section>

      <section>
        <h2>3. Data Storage and Security</h2>
        <p>
          We take your privacy seriously. Since all data is stored locally on your device, it remains under your control. 
          We do not have access to your data. However, please note that you are responsible for the security of your own device.
        </p>
      </section>

      <section>
        <h2>4. Third-Party Services</h2>
        <p>
          Lowkey Smarter operates independently and does not share data with third-party services. 
          The extension interacts with the websites you visit only to the extent necessary to block access as per your settings.
        </p>
      </section>

      <section>
        <h2>5. Your Choices</h2>
        <p>
          You can stop the collection of local information by the Lowkey Smarter extension by uninstalling the extension from your browser. 
          Uninstalling will remove all locally stored data associated with the extension.
        </p>
      </section>

      <section>
        <h2>6. Data Retention and Deletion</h2>
        <p>
          We do not retain any of your data on our servers. All data is retained locally on your device for as long as you have the extension installed. 
          You may delete your data at any time by clearing your browser's local storage or uninstalling the extension.
        </p>
      </section>

      <section>
        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted here with an updated effective date.
        </p>
      </section>

      <section>
        <h2>8. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, please contact us at: <a href="mailto:nathan.wan23@gmail.com">nathan.wan23@gmail.com</a>
        </p>
      </section>
    </div>
  );
};
