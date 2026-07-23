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
import EmployeeDetailsPage from "./pages/company/workforce/onboarding/EmployeeDetails";
import AssignRolesResponsibilityPage from "./pages/company/workforce/onboarding/AssignRolesResponsibility";
import PolicyConfigurationPage from "./pages/company/organization/policy-configuration";
import AddPolicyPage from "./pages/company/organization/policy-configuration/AddPolicy";
import AllEmployeesPage from "./pages/company/workforce/all-employee";
import ReimbursementPage from "./pages/company/expense/reimbursement-claims";
import AddReimbursementPage from "./pages/company/expense/reimbursement-claims/AddReimbursement";
import ReimbursementDetailsPage from "./pages/company/expense/reimbursement-claims/ReimbursementDetails";
import OfficeExpensePage from "./pages/company/expense/office-expense";
import AddOfficeExpensePage from "./pages/company/expense/office-expense/AddOfficeExpense";
import OfficeExpenseDetailsPage from "./pages/company/expense/office-expense/OfficeExpenseDetails";
import OverallExpensePage from "./pages/company/expense/overall-expense";
import EmployeeDetailPage from "./pages/company/workforce/all-employee/EmployeeDetails";
import ResignedEmployeesPage from "./pages/company/workforce/resigned";
import TerminationPage from "./pages/company/workforce/termination";
import PromotionPage from "./pages/company/workforce/promotion";

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
            <Route path={pathNames.POLICY_CONFIGURATION} element={<PolicyConfigurationPage />} />
            <Route path={pathNames.ADD_POLICY} element={<AddPolicyPage />} />
          </Route>

          <Route path={pathNames.WORKFORCE}>
            <Route path={pathNames.ONBOARDING} element={<OnBoardingPage />} />
            <Route path={pathNames.ONBOARDING_DETAILS} element={<EmployeeDetailsPage />}/>
            <Route path={pathNames.ASSIGN_ROLES_RESPONSIBILITY} element={<AssignRolesResponsibilityPage />}/>

            <Route path={pathNames.ALL_EMPLOYEES} element={<AllEmployeesPage />}/>
            <Route path={pathNames.EMPLOYEE_DETAILS} element={<EmployeeDetailPage />}/>

            <Route path={pathNames.RESIGNED} element={<ResignedEmployeesPage />}/>
            <Route path={pathNames.TERMINATION} element={<TerminationPage />}/>

            <Route path={pathNames.PROMOTION} element={<PromotionPage />}/>
          </Route>

          <Route path={pathNames.EXPENSE}>
            <Route path={pathNames.REIMBURSEMENT} element={<ReimbursementPage />} />
            <Route path={pathNames.ADD_REIMBURSEMENT} element={<AddReimbursementPage />} />
            <Route path={pathNames.REIMBURSEMENT_DETAILS} element={<ReimbursementDetailsPage />} />
            <Route path={pathNames.OFFICE_EXPENSE} element={<OfficeExpensePage />} />
            <Route path={pathNames.ADD_OFFICE_EXPENSE} element={<AddOfficeExpensePage />} />
            <Route path={pathNames.OFFICE_EXPENSE_DETAILS} element={<OfficeExpenseDetailsPage />} />
            <Route path={pathNames.OVERALL_EXPENSE} element={<OverallExpensePage />} />
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
