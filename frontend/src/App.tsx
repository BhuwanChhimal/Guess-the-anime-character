import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import { Routes,Route } from "react-router-dom";
const App = () => {
  return (
 
      <div className="h-screen bg-gradient-to-b from-gray-900 to-purple-900">
        <Navbar />
          <Routes>
            <Route element={<Home/>} path="/"/>
          </Routes>
      </div>

  );
};

export default App;
