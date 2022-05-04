import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/login/Login';
import ConfirmEmail from './components/register/ConfirmEmail';
import Register from './components/register/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/register'>
          <Route index={true} element={<Register />}></Route>
          <Route path='confirm-email' element={<ConfirmEmail />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
