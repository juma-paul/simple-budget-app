import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Dashboard from "./pages/Dashboard";
import LogIn from "./pages/LogIn";
import Reviews from "./pages/Reviews";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      {/* Header */}
      <Header />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
