import NavBar from "./public/NavBar";
import './App.css';
import Contacts from "./public/Contacts";
import Homepage from "./public/Homepage";
import Home from "./public/Home";
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


