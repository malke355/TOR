import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import InvestmentPortal from './pages/InvestmentPortal';
import InvestmentDetail from './pages/InvestmentDetail';
import TradePortal from './pages/TradePortal';
import ServicesDirectory from './pages/ServicesDirectory';
import NewsPortal from './pages/NewsPortal';
import NewsDetail from './pages/NewsDetail';
import DocumentsPage from './pages/DocumentsPage';
import ContactPage from './pages/ContactPage';
import ServicePortal from './pages/ServicePortal';

// Admin CMS Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageOpportunities from './pages/admin/ManageOpportunities';
import ManageNews from './pages/admin/ManageNews';
import ManageDocuments from './pages/admin/ManageDocuments';
import MessagesInbox from './pages/admin/MessagesInbox';
import ManageApplications from './pages/admin/ManageApplications';
import ManageTrade from './pages/admin/ManageTrade';
import ManageServices from './pages/admin/ManageServices';

function PublicLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-emerald-600 selection:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Portal Layout */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="investment" element={<InvestmentPortal />} />
                <Route path="investment/:id" element={<InvestmentDetail />} />
                <Route path="trade" element={<TradePortal />} />
                <Route path="services" element={<ServicesDirectory />} />
                <Route path="services/portal/:serviceId" element={<ServicePortal />} />
                <Route path="news" element={<NewsPortal />} />
                <Route path="news/:id" element={<NewsDetail />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>

              {/* Staff CMS Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Staff CMS Area */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="applications" element={<ManageApplications />} />
                <Route path="opportunities" element={<ManageOpportunities />} />
                <Route path="trade" element={<ManageTrade />} />
                <Route path="services" element={<ManageServices />} />
                <Route path="news" element={<ManageNews />} />
                <Route path="documents" element={<ManageDocuments />} />
                <Route path="messages" element={<MessagesInbox />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
