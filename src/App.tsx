import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import FoodProfile from "./components/FoodProfile";

function App() {
  return (
    <div className="App">
      <Router basename="/mf-food-profile">
          <Routes>
              <Route path="/:id" element={<FoodProfile isAppBarVisible={false} onReady={()=>{}}/>}/>
          </Routes>
        
      </Router>
    </div>
  );
}

export default App;
