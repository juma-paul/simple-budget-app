import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedHeader from "./components/ProtectedHeader";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Dashboard from "./pages/Dashboard";
import LogIn from "./pages/LogIn";
import Reviews from "./pages/Reviews";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  );
}

function AppComponent() {
  const location = useLocation();

  const isProtected = location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditionally render headers */}
      {isProtected ? <ProtectedHeader /> : <Header />}

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          {/* Public */}
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
          <Route
            path="/login"
            element={
              <Layout>
                <LogIn />
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
          <Route
            path="/reviews"
            element={
              <Layout>
                <Reviews />
              </Layout>
            }
          />

          {/* Protected */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
          </Route>
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
export default App;
