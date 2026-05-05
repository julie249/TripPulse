import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import PlanTrip from "./pages/PlanTrip";
import Result from "./pages/Result";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Loading from "./pages/Loading";
import TripDetails from "./pages/TripDetails";
import SavedTrips from "./pages/SavedTrips";
import Profile from "./pages/Profile";
import ChatAssistant from "./pages/ChatAssistant";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/plan" element={<PlanTrip />} />
        <Route path="/result" element={<Result />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/chat" element={<ChatAssistant />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/saved"
          element={
          <ProtectedRoute>
              <SavedTrips />
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

        <Route
          path="/trip-details"
          element={
            <ProtectedRoute>
              <TripDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

