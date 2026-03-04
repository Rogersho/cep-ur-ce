import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Choirs from './pages/Choirs';
// import Login from './pages/Login';
// import AdminDashboard from './pages/Admin/Dashboard';

function App() {
    return (
        <div className="app">
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/choirs" element={<Choirs />} />
                    {/* <Route path="/login" element={<Login />} /> */}
                    {/* <Route path="/admin/*" element={<AdminDashboard />} /> */}
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
