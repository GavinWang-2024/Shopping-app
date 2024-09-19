import { useState } from 'react'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoute'
import {AuthProvider} from './context/AuthContext'
function App() {
  return (
    <div className='App'>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route element={<PrivateRoutes/>}>
              <Route element={<HomePage/>} path="/"/>
            </Route>
            <Route path="/login/" element={<LoginPage/>}/>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
