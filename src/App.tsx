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
import DesignationPage from "./pages/company/organization/designation";
import LeavePage from "./pages/company/organization/leave";
import HolidaysPage from "./pages/company/organization/holidays";
import OnBoardingPage from "./pages/company/workforce/onboarding";
import InviteEmployeePage from "./pages/company/workforce/onboarding/InviteEmployePage";
import EarningsPage from "./pages/company/pay-slip/earnings";
import PayslipDisclaimerPage from "./pages/company/pay-slip/earnings/PayslipDisclaimer";
import PayslipDeductionsPage from "./pages/company/pay-slip/deductions";

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
            <Route path={pathNames.BRANCH} element={<BranchPage  />} />
            <Route path={pathNames.SHIFT} element={<ShiftPage  />} />
            <Route path={pathNames.ADD_SHIFT} element={<AddShift  />} />
            <Route path={pathNames.DEPARTMENT} element={<DepartmentPage />}  />
            <Route path={pathNames.ADD_DEPARTMENT} element={<AddDepartmentPage />}  />
            <Route path={pathNames.DESIGNATION} element={<DesignationPage />} />
            <Route path={pathNames.LEAVE} element={<LeavePage />} />
            <Route path={pathNames.HOLIDAYS} element={<HolidaysPage />} />
          </Route>

          <Route path={pathNames.WORKFORCE}>
            <Route path={pathNames.ONBOARDING} element={<OnBoardingPage />} />
            
          </Route>

          <Route path={pathNames.PAY_SLIP}>
            <Route path={pathNames.EARNING} element={<EarningsPage />} />
            <Route path={pathNames.PAY_SLIP_DISCLAIMER} element={<PayslipDisclaimerPage />} />
            <Route path={pathNames.DEDUCTION} element={<PayslipDeductionsPage />} />
          </Route>
          <Route path="my-profile" element={<MyProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
        </Route>

        <Route path={pathNames.INVITE_EMPLOYEE_FORM + "/:id"} element={<InviteEmployeePage />} />

        {/* Catch all unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
