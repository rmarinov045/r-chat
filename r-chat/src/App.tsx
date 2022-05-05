import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home/Home';
import Login from './components/login/Login';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import ConfirmEmail from './components/register/ConfirmEmail';
import Register from './components/register/Register';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PublicRoute component={<Login />} />}></Route>
        <Route path='/register'>
          <Route index={true} element={<PublicRoute component={<Register />} />}></Route>
          <Route path='confirm-email' element={<PublicRoute component={<ConfirmEmail />} />}></Route>
        </Route>
        <Route path='/home'>
          <Route index={true} element={<PrivateRoute component={<Home />} />}></Route>
          <Route path=':userId' element={<PrivateRoute component={<Home />} />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
