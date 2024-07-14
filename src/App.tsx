import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import FoodProfile from "./components/FoodProfile";

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
              <Route path="/:id" element={<FoodProfile />}/>
          </Routes>
        
      </Router>
    </div>
  );
}

export default App;
