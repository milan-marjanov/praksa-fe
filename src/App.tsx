import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AdminHomePage from './pages/AdminHomePage'

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<AdminHomePage />} />  
          <Route path="/admin" element={<AdminHomePage />} />
        </Routes>
      </Router>
    </div>
  )
}
