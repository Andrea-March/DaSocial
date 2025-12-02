import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Broadcast from './pages/Broadcast'
import Market from './pages/Market'
import BottomNav from './components/BottomNav'
import Profile from "./pages/Profile";
import NewPost from "./components/NewPost";
import { usePostContext } from "./context/PostContext";


export default function App() {
  const location = useLocation();

  const { showNewPost, closeNewPost } = usePostContext();

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
              <Home />
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

      {showNewPost && (
        <NewPost onClose={closeNewPost} />
      )}
      {!hideBottomNav && <BottomNav />}
      
    </>
  );
}
