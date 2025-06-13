import Navbar from './components/Navbar';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { Loader, MessageSquare } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
import AuthSuccessPage from './pages/AuthSuccessPage';

const App = () => {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex flex-col justify-center items-center h-screen gap-6 bg-gradient-to-b from-base-100 to-base-200'>
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse group-hover:bg-primary/20 transition-all duration-500">
            <MessageSquare className="size-10 text-primary group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="absolute mt-3 -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
            Welcome to Chatty
          </h2>
          <p className="text-base-content/60 animate-pulse">
            Loading your chat experience...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/sign-up" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/auth/success" element={<AuthSuccessPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App;


