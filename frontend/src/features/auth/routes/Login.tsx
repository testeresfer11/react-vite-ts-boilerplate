import { useNavigate } from 'react-router-dom';

import { LoginForm } from '../components/LoginForm';
import { LoginLayout } from '../components/Layout';

export const Login = () => {
  const navigate = useNavigate();

  return (
    <LoginLayout title="Login">
      <LoginForm onSuccess={() => navigate('/admin')} />
    </LoginLayout>
  );
};
