import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireOnboarding = false }) {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If onboarding is required and not completed, redirect to onboarding
  if (requireOnboarding && userProfile && !userProfile.user?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  // If trying to access onboarding but already completed, redirect to dashboard
  // UNLESS they have ?retake=true query parameter
  const searchParams = new URLSearchParams(location.search);
  const isRetaking = searchParams.get('retake') === 'true';
  
  if (location.pathname === '/onboarding' && userProfile?.user?.onboardingCompleted && !isRetaking) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
