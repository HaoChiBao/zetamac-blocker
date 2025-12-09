// import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import '../App.css';

export const PrivacyPolicy = () => {
  return (
    <div className="landing-page">
      <Navbar />

      <div className="container section">
        <div className="section-header" style={{ textAlign: 'left', margin: '40px 0' }}>
            <h1>Privacy Policy</h1>
            <p className="last-updated" style={{ color: '#666', marginTop: '10px' }}>Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="privacy-content" style={{ maxWidth: '800px', fontSize: '16px', lineHeight: '1.8' }}>
            <section style={{ marginBottom: '50px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>1. Introduction</h3>
                <p>
                    Lowkey Smarter ("we", "our", or "us") respects your privacy and is committed to protecting it. 
                    This Privacy Policy describes the types of information being processed by our Chrome Extension ("the Extension") 
                    and how we handle that data.
                </p>
                <p style={{ marginTop: '15px' }}>
                    <strong>The Core Principle:</strong> We believe your data belongs to you. Our extension is designed to operate 
                    offline-first and minimizes data interaction. We do not collect, transmit, or sell your personal information.
                </p>
            </section>

            <section style={{ marginBottom: '50px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>2. Information We Do Not Collect</h3>
                <p>
                    We want to be explicitly clear about what we <strong>do not</strong> collect. When you use the Extension, we do not record:
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '15px', color: '#333' }}>
                    <li><strong>Personal Identification Information (PII):</strong> We do not know who you are, your email, name, or location.</li>
                    <li><strong>Browsing History:</strong> We do not track the websites you visit, your search history, or your content consumption.</li>
                    <li><strong>Usage Analytics:</strong> We do not use third-party analytics services (like Google Analytics, Mixpanel, etc.) to track your behavior within the extension.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '50px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>3. Data Stored Locally</h3>
                <p>
                    The Extension stores specific data <strong>locally on your device</strong> using the Chrome Storage API (`chrome.storage.local`). 
                    This data never leaves your browser instance.
                </p>
                <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '0px', border: '1px solid #000', marginTop: '20px' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>What is stored:</h4>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '0' }}>
                        <li><strong>Preferences:</strong> Your blocked websites list, game difficulty settings, and configuration options.</li>
                        <li><strong>Game Statistics:</strong> High scores, number of games played, and completion times.</li>
                        <li><strong>Session State:</strong> Temporary timestamps to manage the "unlocked" state of websites.</li>
                    </ul>
                </div>
            </section>

            <section style={{ marginBottom: '50px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>4. Permissions Usage</h3>
                <p>The Extension requests specific permissions strictly for functionality. Here is why we need them:</p>
                
                <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>Tabs & Web Navigation</h4>
                    <p style={{ color: '#666' }}>
                        Used to detect the current URL you are visiting. This allows the extension to compare the URL against your local blocklist 
                        and determine if the game overlay should be triggered. This check happens entirely on your device.
                    </p>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>Scripting</h4>
                    <p style={{ color: '#666' }}>
                        Required to inject the game overlay (HTML/CSS/JS) into the webpage you are viewing. This serves as the "gate" that interrupts 
                        your browsing. We do not modify or read page content other than to display this overlay.
                    </p>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>Storage</h4>
                    <p style={{ color: '#666' }}>
                        Used to read and write your personalized settings and game progress to your local browser storage.
                    </p>
                </div>
            </section>

            <section style={{ marginBottom: '50px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>5. Data Security</h3>
                <p>
                    Because all data is stored locally on your device, the security of your data relies on the security of your own computer or device. 
                    If you uninstall the extension, all locally stored data associated with it is permanently deleted by the browser.
                </p>
            </section>

            <section style={{ marginBottom: '50px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>6. Changes to This Policy</h3>
                <p>
                    We may update our Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. 
                    Any changes will be posted on this page with an updated "Last Updated" date.
                </p>
            </section>

            <section style={{ marginBottom: '50px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>7. Contact Us</h3>
                <p>
                    If you have questions about this Privacy Policy or our privacy practices, please contact us via the support section on the Chrome Web Store page.
                </p>
            </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};
