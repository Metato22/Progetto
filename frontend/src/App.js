import NavBar from "./Navbar";
import './App.css';
import Contacts from "./Contacts";
import Homepage from "./Homepage";
import Home from "./Home";
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
      <div className="app">
        <NavBar />
        <main>
          <Routes>
            <Route index element={<Home />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="Homepage" element={<Homepage />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;


