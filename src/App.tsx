import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
//import AdminHomePage from './pages/AdminHomePage'

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/*<Route path="/admin" element={<AdminHomePage />} />*/}
        </Routes>
      </Router>
    </div>
  )
}