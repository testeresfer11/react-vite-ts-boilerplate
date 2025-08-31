import React from 'react'
import Footer from "@/components/LandingLayout/Footer";
import Header from "@/components/LandingLayout/Header";

const Layout = ({ children }: { children: React.ReactElement }) => {
    return (
      <div className="landing-page">
        <Header />
        {children}
        <Footer />
        <style>{`
          .landing-page {
            font-family: 'Segoe UI', Arial, sans-serif;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        `}</style>
      </div>
    );
  };

export default Layout