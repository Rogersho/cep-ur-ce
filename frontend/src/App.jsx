import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Choirs from './pages/Choirs';
import Gallery from './pages/Gallery';
import Announcements from './pages/Announcements';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Imports
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLayout from './pages/Admin/AdminLayout';
import DashboardOverview from './pages/Admin/DashboardOverview';
import ManageEvents from './pages/Admin/ManageEvents';
import ManageGallery from './pages/Admin/ManageGallery';
import ManageAnnouncements from './pages/Admin/ManageAnnouncements';
import ManageChoirs from './pages/Admin/ManageChoirs';

function App() {
    return (
        <div className="app">
            <Routes>
                {/* Public Routes with Main Layout */}
                <Route path="/*" element={
                    <>
                        <Navbar />
                        <main style={{ minHeight: '80vh' }}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/events" element={<Events />} />
                                <Route path="/choirs" element={<Choirs />} />
                                <Route path="/gallery" element={<Gallery />} />
                                <Route path="/announcements" element={<Announcements />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </Routes>
                        </main>
                        <Footer />
                    </>
                } />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<ProtectedAdminRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<DashboardOverview />} />
                        <Route path="events" element={<ManageEvents />} />
                        <Route path="gallery" element={<ManageGallery />} />
                        <Route path="announcements" element={<ManageAnnouncements />} />
                        <Route path="choirs" element={<ManageChoirs />} />
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
