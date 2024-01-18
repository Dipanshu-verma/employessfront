import logo from './logo.svg';
import './App.css';
import { Navigate, Route,Routes } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Navbar from './Components/Navbar';
import { useState } from 'react';
function App() {
const bool =  localStorage.getItem("token")?true:false;
const [token,settoken]  = useState(bool);

  return (
    <div className="App">
    <Navbar/>
     <Routes>
      <Route path='/' element={<Login settoken={settoken} />}  />
      <Route path='/dashboard'  element={token ? <Dashboard  settoken={settoken}/> : <Navigate to="/" />} />
     </Routes>

    </div>
  );
}

export default App;
