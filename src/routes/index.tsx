import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import AppLayout from "../layouts/AppLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ClientsPage from "../pages/clients/ClientsPage";
import ClientDetailPage from "../pages/clients/ClientDetailPage";
import ProfessionalsPage from "../pages/professionals/ProfessionalsPage";
import ProfessionalDetailPage from "../pages/professionals/ProfessionalDetailPage";
import ServicesPage from "../pages/services/ServicesPage";
import AppointmentsPage from "../pages/appointments/AppointmentsPage";
import SettingsPage from "../pages/settings/SettingsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />
          <Route path="/professionals" element={<ProfessionalsPage />} />
          <Route path="/professionals/:id" element={<ProfessionalDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}