import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import PublicRoute from "./routes/PublicRoute";
import ForgotPassword from "./pages/forgot-password";
import AuthLayout from "./layouts/AuthLayout";
import OTPVerifyPage from "./pages/otp-verify";
import ResetPasswordPage from "./pages/reset-password";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import MyProfilePage from "./pages/my-profile";
import ChangePasswordPage from "./pages/change-password";
import DashboardPage from "./pages/dashboard";
import BranchPage from "./pages/company/organization/Branch";
import { pathNames } from "./constants/constants";
import ShiftPage from "./pages/company/organization/shift/Shift";
import AddShift from "./components/company/organization/shift/AddShift";
import DepartmentPage from "./pages/company/organization/department";
import AddDepartmentPage from "./pages/company/organization/department/AddDepartment";
import NotFoundPage from "./pages/not-found";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/otp-verify"
            element={
              <PublicRoute>
                <OTPVerifyPage />
              </PublicRoute>
            }
          />

          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />
        </Route>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          
          {/* Organization */}
          <Route path={pathNames.ORGANIZATION}>
            <Route path={pathNames.BRANCH} element={<BranchPage />} />
            <Route path={pathNames.SHIFT} element={<ShiftPage />} />
            <Route path={pathNames.ADD_SHIFT} element={<AddShift />} />
            <Route path={pathNames.DEPARTMENT} element={<DepartmentPage />} />
            <Route path={pathNames.ADD_DEPARTMENT} element={<AddDepartmentPage />} />
          </Route>

          <Route path="my-profile" element={<MyProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
        </Route>

        {/* Catch all unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
