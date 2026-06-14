import { Toaster } from 'sonner'
import { Routes, Route } from 'react-router-dom'
import TopAppBar from './components/TopAppBar'
import BottomNavBar from './components/BottomNavBar'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import GalleryPage from './pages/GalleryPage'
import CustomOrderPage from './pages/CustomOrderPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <TopAppBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/custom-order" element={<CustomOrderPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
      </Routes>
      <BottomNavBar />
    </>
  )
}

export default App
