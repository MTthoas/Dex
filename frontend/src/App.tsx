import Landpage from "./components/landpage/Landpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import TokenPage from "./components/tokens/TokenPage";

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
                <Route path="/tokens" element={<TokenPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
}