import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Broadcast from './pages/Broadcast'
import Market from './pages/Market'
import BottomNav from './components/layout/BottomNav'
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";


export default function App() {
  const location = useLocation();


  // Mostriamo la BottomNav solo nelle pagine interne
  const hideBottomNav = 
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password";

  return (
    <>
      <Routes>
        {/* PUBBLICHE */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* INTERNE */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/broadcast"
          element={
            <ProtectedRoute>
              <Broadcast />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/market"
          element={
            <ProtectedRoute>
              <Market />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!hideBottomNav && <BottomNav />}
      
    </>
  );
}
