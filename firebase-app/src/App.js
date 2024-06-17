
import React from "react";
import "tailwindcss/tailwind.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Offers from "./pages/Offers";
import ForgotPassword from "./pages/ForgotPassword";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CreateDeal from "./pages/CreateDeal";
import EditDeal from "./pages/EditDeal";
import Deal from "./pages/Deal";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" Component={Profile} />
          </Route>
          <Route path="/sign-in" Component={SignIn} />
          <Route path="/sign-up" Component={SignUp} />
          <Route path="/forgot-password" Component={ForgotPassword} />
          <Route path="/offers" Component={Offers} />
          <Route path="/category/:categoryType/:dealID" Component={Deal} />
          <Route path="create-deal" element={<PrivateRoute />}>
            <Route path="/create-deal" Component={CreateDeal} />
          </Route>
          <Route path="edit-deal" element={<PrivateRoute />}>
            <Route path="/edit-deal:dealID" Component={EditDeal} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transitionBounce />
    </div>
  );
}

export default App;
