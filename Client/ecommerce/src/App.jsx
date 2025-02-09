import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Products from './Components/Products';
import Cart from './Components/Cart';
import Navbar from './Components/Navbar';
import ProductDetails from './Components/ProductDetails';
import Register from './Components/Register';
import Login from './Components/Login';
import PrivateRoute from './Components/PrivateRoute';  // Assuming PrivateRoute is defined in a separate file

export const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<PrivateRoute component={Cart} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
