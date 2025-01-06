import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Component/Header';
import Login from './Component/Login';
import Register from './Component/Register';
import Home from './Component/Home';
import Maintenance from './Component/Maintenance';



function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Maintenance" element={<Maintenance />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
