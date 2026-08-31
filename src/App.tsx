import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { employeePathNames, pathNames } from "./constants/constants";

// public route and auth layout
import PublicRoute from "./routes/PublicRoute";
import AuthLayout from "./layouts/AuthLayout";

// protected route and app layouts
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// pages
import Login from "./pages/login";
import ForgotPassword from "./pages/forgot-password";
import OTPVerifyPage from "./pages/otp-verify";
import ResetPasswordPage from "./pages/reset-password";
import MyProfilePage from "./pages/my-profile";
import ChangePasswordPage from "./pages/change-password";
import DashboardPage from "./pages/dashboard";
import BranchPage from "./pages/company/organization/Branch";
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
import PromotionLetterPage from "./pages/company/workforce/promotion/PromotionLetter";
import TerminationLetterPage from "./pages/company/workforce/termination/TerminationLetter";
import RelievingLetterPage from "./pages/company/workforce/resigned/RelievingLetter";
import ExperienceLetterPage from "./pages/company/workforce/resigned/ExperienceLetter";
import FnFLetterPage from "./pages/company/workforce/resigned/FnFLetter";
import LeaveRequestsPage from "./pages/company/performance/leave-requests";
import AttendancesPage from "./pages/company/performance/attendance";
import ManualPunchRequestPage from "./pages/company/performance/manual-punch-request";
import CompanyHierarchyPage from "./pages/company/organization/company-hierarchy";
import PeopleHierarchyPage from "./pages/company/organization/people-hierarchy";
import AddLeaveRequestPage from "./pages/company/performance/leave-requests/AddLeaveRequest";
import LeaveRequestDetailsPage from "./pages/company/performance/leave-requests/LeaveRequestDetails";
import EmployeeAttendanceDetailsPage from "./pages/company/performance/attendance/attendance-details";
import EmployeePayrollPage from "./pages/company/expense/employee-payroll";
import EmployeePayrollPerformancePage from "./pages/company/expense/employee-payroll/EmployeePayrollPerformance";
import PayslipPage from "./pages/company/pay-slip";
import EmployeeResignationPage from "./pages/employee/resignation";
import AllEmployeePayslipsPage from "./pages/company/pay-slip/employee-payslips";
import EmployeePayslipDetailsPage from "./pages/company/pay-slip/employee-payslips/EmployeePayslipDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* auth routes */}
        <Route
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="/login" element={<Login />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/otp-verify" element={<OTPVerifyPage />} />

          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* dashboard */}
          <Route index element={<DashboardPage />} />

          {/* Organization */}
          <Route path={pathNames.ORGANIZATION}>
            <Route path={pathNames.BRANCH} element={<BranchPage />} />
            <Route path={pathNames.SHIFT} element={<ShiftPage />} />
            <Route path={pathNames.ADD_SHIFT} element={<AddShift />} />
            <Route path={pathNames.DEPARTMENT} element={<DepartmentPage />} />
            <Route
              path={pathNames.ADD_DEPARTMENT}
              element={<AddDepartmentPage />}
            />
            <Route path={pathNames.DESIGNATION} element={<DesignationPage />} />
            <Route path={pathNames.LEAVE} element={<LeavePage />} />
            <Route path={pathNames.HOLIDAYS} element={<HolidaysPage />} />
            <Route
              path={pathNames.POLICY_CONFIGURATION}
              element={<PolicyConfigurationPage />}
            />
            <Route path={pathNames.ADD_POLICY} element={<AddPolicyPage />} />
            <Route
              path={pathNames.COMPANY_HIERARCHY}
              element={<CompanyHierarchyPage />}
            />
            <Route
              path={pathNames.PEOPLE_HIERARCHY}
              element={<PeopleHierarchyPage />}
            />
          </Route>

          {/* Workforce */}
          <Route path={pathNames.WORKFORCE}>
            <Route path={pathNames.ONBOARDING} element={<OnBoardingPage />} />
            <Route
              path={pathNames.ONBOARDING_DETAILS_ID}
              element={<EmployeeDetailsPage />}
            />
            <Route
              path={pathNames.ASSIGN_ROLES_RESPONSIBILITY_ID}
              element={<AssignRolesResponsibilityPage />}
            />

            <Route
              path={pathNames.ALL_EMPLOYEES}
              element={<AllEmployeesPage />}
            />
            <Route
              path={pathNames.EMPLOYEE_DETAILS}
              element={<EmployeeDetailPage />}
            />

            <Route
              path={pathNames.RESIGNED}
              element={<ResignedEmployeesPage />}
            />
            <Route
              path={pathNames.RELIEVING_LETTER_ID}
              element={<RelievingLetterPage />}
            />
            <Route
              path={pathNames.EXPERIENCE_LETTER_ID}
              element={<ExperienceLetterPage />}
            />
            <Route path={pathNames.FNF_LETTER_ID} element={<FnFLetterPage />} />
            <Route path={pathNames.TERMINATION} element={<TerminationPage />} />
            <Route
              path={pathNames.TERMINATION_LETTER_ID}
              element={<TerminationLetterPage />}
            />

            <Route path={pathNames.PROMOTION} element={<PromotionPage />} />
            <Route
              path={pathNames.PROMOTION_LETTER + "/:id"}
              element={<PromotionLetterPage />}
            />
          </Route>

          {/* Expense */}
          <Route path={pathNames.EXPENSE}>
            <Route
              path={pathNames.REIMBURSEMENT}
              element={<ReimbursementPage />}
            />
            <Route
              path={pathNames.ADD_REIMBURSEMENT}
              element={<AddReimbursementPage />}
            />
            <Route
              path={pathNames.REIMBURSEMENT_DETAILS}
              element={<ReimbursementDetailsPage />}
            />
            <Route
              path={pathNames.OFFICE_EXPENSE}
              element={<OfficeExpensePage />}
            />
            <Route
              path={pathNames.ADD_OFFICE_EXPENSE}
              element={<AddOfficeExpensePage />}
            />
            <Route
              path={pathNames.OFFICE_EXPENSE_DETAILS}
              element={<OfficeExpenseDetailsPage />}
            />
            <Route
              path={pathNames.OVERALL_EXPENSE}
              element={<OverallExpensePage />}
            />
            <Route
              path={pathNames.EMPLOYEE_PAYROLL}
              element={<EmployeePayrollPage />}
            />
            <Route
              path={pathNames.EMPLOYEE_PAYROLL_PERFORMANCE_ID}
              element={<EmployeePayrollPerformancePage />}
            />
          </Route>

          {/* Performance */}
          <Route path={pathNames.PERFORMANCE}>
            <Route path={pathNames.ATTENDANCE} element={<AttendancesPage />} />
            <Route
              path={pathNames.ATTENDANCE_DETAILS_ID}
              element={<EmployeeAttendanceDetailsPage />}
            />
            <Route
              path={pathNames.LEAVE_REQUEST}
              element={<LeaveRequestsPage />}
            />
            <Route
              path={pathNames.LEAVE_REQUEST_DETAILS_ID}
              element={<LeaveRequestDetailsPage />}
            />
            <Route
              path={pathNames.ADD_LEAVE_REQUEST_ID}
              element={<AddLeaveRequestPage />}
            />
            <Route
              path={pathNames.ADD_LEAVE_REQUEST}
              element={<AddLeaveRequestPage />}
            />
            <Route
              path={pathNames.MANUAL_PUNCH_REQUEST}
              element={<ManualPunchRequestPage />}
            />
          </Route>

          {/* pay slips */}
          <Route path={pathNames.PAY_SLIP}>
            <Route path={pathNames.EARNING} element={<EarningsPage />} />
            <Route
              path={pathNames.PAY_SLIP_DISCLAIMER}
              element={<PayslipDisclaimerPage />}
            />
            <Route
              path={pathNames.DEDUCTION}
              element={<PayslipDeductionsPage />}
            />
            <Route
              path={pathNames.ALL_EMPLOYEE_PAY_SLIP}
              element={<AllEmployeePayslipsPage />}
            />
            <Route
              path={pathNames.EMPLOYEE_PAY_SLIP_DETAILS_ID}
              element={<EmployeePayslipDetailsPage />}
            />            
          </Route>

          {/* employee */}
          <Route
            path={employeePathNames.REIMBURSEMENT}
            element={<ReimbursementPage />}
          />
          <Route
            path={employeePathNames.ADD_REIMBURSEMENT}
            element={<AddReimbursementPage />}
          />
          <Route
            path={employeePathNames.REIMBURSEMENT_DETAILS}
            element={<ReimbursementDetailsPage />}
          />
          <Route path={employeePathNames.PAY_SLIP} element={<PayslipPage />} />
          <Route
            path={employeePathNames.RESIGNATION}
            element={<EmployeeResignationPage />}
          />

          <Route path="my-profile" element={<MyProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
        </Route>

        {/* auth routes */}
        <Route
          path={pathNames.INVITE_EMPLOYEE_FORM + "/:id"}
          element={<InviteEmployeePage />}
        />

        {/* Catch all unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
