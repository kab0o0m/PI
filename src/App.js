import Homepage from "./Components/Homepage/Homepage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/PI/" element={<Homepage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
