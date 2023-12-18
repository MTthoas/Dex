import React from "react";
import Landpage from "./modules/landpage/Landpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./modules/header/Header";
import Footer from "./modules/footer/Footer";

export default function App() {
  return (
    <>
      <Router>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <main style={{ flex: "1" }}>
            <Header />
            <Routes>
              <Route path="/" element={<Landpage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
}
