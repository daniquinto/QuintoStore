import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import "./components/molecules/ProductCard"
import Layout from "./components/templates/Layout"
import Home from "./components/organisms/home/Home"
import ProductGallery from "./components/organisms/gallery/ProductGallery"
import Login from "./components/organisms/login/Login"
import Register from "./components/organisms/register/Register"
import Profile from "./components/organisms/profile/Profile"
import ProductDetail from "./components/organisms/productDetail/ProductDetail"
import ShoppingCart from "./components/organisms/cart/ShoppingCart"
import CheckoutPreview from "./components/organisms/checkout/CheckoutPreview"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="gallery" element={<ProductGallery />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<ShoppingCart />} />
          <Route path="checkout" element={<CheckoutPreview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
