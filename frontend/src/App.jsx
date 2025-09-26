import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster} from 'sonner';

import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import JobSeekerDashboard from './pages/JobSeeker/JobSeekerDashboard';
import JobDetails from './pages/JobSeeker/JobDetails';
import SavedJobs from './pages/JobSeeker/SavedJobs';
import UserProfile from './pages/JobSeeker/UserProfile';
import EmployerDashboard from './pages/Employer/EmployerDashboard';
import JobPostingForm from './pages/Employer/JobPostingForm';
import ManageJobs from './pages/Employer/ManageJobs';
import ApplicationViewer from './pages/Employer/ApplicationViewer';
import EmployerProfilePage from './pages/Employer/EmployerProfilePage';
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/" element={<MainLayout />}>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/find-jobs" element={<JobSeekerDashboard />} />
            <Route path="/job/:jobId" element={<JobDetails />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/profile" element={<UserProfile />} />

            {/* Private routes */}
            <Route element={<ProtectedRoute requiredRole="employer" />}>
              <Route path="/employer-dashboard" index element={<EmployerDashboard />} />
              <Route path="/post-job" index element={<JobPostingForm />} />
              <Route path="/manage-jobs" index element={<ManageJobs />} />
              <Route path="/application" index element={<ApplicationViewer />} />
              <Route path="/company-profile" index element={<EmployerProfilePage />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to={"/"} replace />} />
          </Route>
        </Routes>
      </Router>

      <Toaster
        closeButton
        richColors
        position="top-right"
        duration={5000}
        expand={false}
      />
    </div>
  )
}

export default App;
