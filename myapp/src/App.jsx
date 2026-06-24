import './App.css'
import { Route, Routes } from 'react-router-dom'

import Products from './Products'
import Login from './Login'
import About from './About'
import Service from './Service'
import Contact from './Contact'
import Addcart from './Addcart'
import Cart from './Cart'
import Navbar from './Navbar'
import Footer from './Footer'
import Home1 from "./Home1";
import Summary from './Summary'
import Success from './Success'
import OrderSummary from './Ordersummary'
import Register from './Register'
import Orders from './Orders'
import OrderHistory from './Orderhistory'
import CancelOrders from './CancelOrders'

function App() {
  return (
    <div className="app-container">

      <Navbar />

      <Routes>
        <Route path="/" element={<Home1 />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/addcart" element={<Addcart />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/register" element={<Register />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/success" element={<Success />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/cancel-orders" element={<CancelOrders />} />
        <Route path="/order-history/:type" element={<Orders />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App