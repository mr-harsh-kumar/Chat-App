
import './App.css';
import { BrowserRouter as Router, Routes, Route,  Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Chat_app from './components/Chat_app';
function App() {

  let link = document.getElementById("favicon");
  link.href = './HK chatApp logo.png';


  return (
    <>
    {/* <Home/> */}
    <Router>
     
      <Navbar />
    <Routes>
        <Route exact path="/home" element={<Home/>} />
        
        <Route path="" element={<Navigate to="/home" />} />

        <Route exact path="/about" element={<About />} />
       <Route exact path="/chat_app/" element={<Chat_app />} />
       {/* <Route path="/chat_app/:username" element={<Chat_app />} /> */}
      </Routes>
      
    </Router>
   


    </>

  );
}

export default App;
