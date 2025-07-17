import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Dashboard from "./pages/Dashboard";
import LogIn from "./pages/LogIn";
import Reviews from "./pages/Reviews";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        {/* Fixed Header */}
        <Header />

        {/* Main content with padding from layout - grows to fill available space */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <AboutUs />
                </Layout>
              }
            />
            <Route element={<PrivateRoute />}>
              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
            </Route>
            <Route
              path="/login"
              element={
                <Layout>
                  <LogIn />
                </Layout>
              }
            />
            <Route
              path="/reviews"
              element={
                <Layout>
                  <Reviews />
                </Layout>
              }
            />
            <Route
              path="/signup"
              element={
                <Layout>
                  <SignUp />
                </Layout>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
