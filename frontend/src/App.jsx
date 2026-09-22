import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminApp from './AdminApp';
import ManagerApp from './components/manager/ManagerApp';
import './styles.css';
import NotFound from "./pages/NotFound";
import CashierLogin from "./pages/CashierLogin";
import CashierApp from './pages/CashierApp';
import CustomerApp from './components/customer/CustomerApp';
import UnifiedLogin from './UnifiedLogin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<UnifiedLogin />} />
        <Route path="/AdminLogin" element={<AdminApp />} />
        <Route path="/ManagerLogin" element={<ManagerApp />} />
        <Route path="/CustomerLogin" element={<CustomerApp />} />
        <Route path="/CashierLogin" element={<CashierLogin />} />
        <Route path="/CashierLogin/dashboard" element={<CashierApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
