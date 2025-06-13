import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const AuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Store token in memory (not localStorage for security)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    navigate('/');
  }, []);

  return <div>Authenticating.....</div>;
};

export default AuthSuccessPage;