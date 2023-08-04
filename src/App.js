import React from 'react'
import {BrowserRouter,Route,Routes} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from './components/Navbar';
import ImageGenerationForm from './components/Generator';

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/generate' element={<ImageGenerationForm/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App