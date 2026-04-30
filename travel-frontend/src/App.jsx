import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
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
        <Route path="/trip-details" element={<TripDetails />} />
        <Route path="/saved" element={<SavedTrips />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<ChatAssistant />} />
      </Routes>
    </Router>
  );
}