import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductDetailPage from './pages/ProductDetail'
import Header from './components/Header'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoute'
import {AuthProvider} from './context/AuthContext'
import CartPage from './pages/CartPage'
import CreateProductPage from './pages/CreateProductPage'
import EditProductPage from './pages/EditProductPage'
import CreateAuctionsPage from './pages/CreateAuctionsPage'
import AllAuctions from './pages/AllAuctions'
import AuctionDetailPage from './pages/AuctionDetailPage'
import OwnerPage from './pages/OwnerPage'
import RegisterPage from './pages/RegisterPage'
function App() {
  return (
    <div className='App'>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route element={<PrivateRoutes/>}>
              <Route element={<HomePage/>} path="/"/>
              <Route element={<ProductDetailPage/>} path="/products/:id/" />
              <Route element={<CartPage/>} path="/cart/:id/" />
              <Route element={<CreateProductPage/>} path="/products/create/" />
              <Route element={<EditProductPage/>} path="/products/:id/edit/" />
              <Route element={<CreateAuctionsPage/>} path="/products/create-auction/"/>
              <Route element={<AllAuctions/>} path="/products/auctions/"/>
              <Route element={<AuctionDetailPage />} path="/products/auctions/:id/"/>
              <Route element={<OwnerPage />} path="/owner/:id/"/>
            </Route>
            <Route path="/login/" element={<LoginPage/>}/>
            <Route path="/register/" element={<RegisterPage/>}/>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
