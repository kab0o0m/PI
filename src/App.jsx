import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";

function App() {
  return (
    <Router>
      <div className="App">
        {/* The Routes component defines your application's routes */}
        <Routes>
          {/* Define a Route for the "/PI/" path that renders the Homepage component */}
          <Route path="/PI/" element={<Homepage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;