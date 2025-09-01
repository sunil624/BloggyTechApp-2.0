import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import Login from "./Users/Login";
import Register from "./Users/Register";
import PublicUserProfile from "./Users/PublicUserProfile";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/AuthRoute/ProtectedRoute";
import AddPost from "./components/Posts/AddPost";
import PublicPosts from "./components/Posts/PublicPosts";
import PostDetails from "./components/Posts/PostDetails";
import PostList from "./components/Posts/PostList";
import UpdatePost from "./components/Posts/UpdatePost";
import NotFound from "./components/NotFound"; // Create a NotFound component for fallback

export default function App() {
  const { userAuth } = useSelector((state) => state.users);
  const isLoggedIn = userAuth?.userInfo?.token;

  // Choose proper Navbar based on auth state
  const Navbar = isLoggedIn ? PrivateNavbar : PublicNavbar;

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/public-posts" element={<PublicPosts />} />

        {/* Group protected routes under ProtectedRoute wrapper */}
        <Route element={<ProtectedRoute />}>
          <Route path="/posts/:postId" element={<PostDetails />} />
          <Route path="/posts/:postId/update" element={<UpdatePost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/users/public-profile/:userId" element={<PublicUserProfile />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
