import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../config/firebaseConfig';
import RoutesP from '../../constants/routes';
import Header from '../../components/header/header';
import '../login/login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuário logado:', userCredential.user);

      // pega o ID token JWT do Firebase
      const idToken = await userCredential.user.getIdToken(/* forceRefresh= */ true);

      // opcional: salvar para uso posterior (control, chamadas subsequentes)
      localStorage.setItem('fb_id_token', idToken);

      // navegar para control (ou buscar dados antes de navegar)
      navigate(RoutesP.Control);
    } catch (err: any) {
      console.error('Erro ao autenticar:', err);
      setError('Email ou senha inválidos.');
      setSuccess('');
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Digite seu email para redefinir a senha.');
      setSuccess('');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Email de redefinição de senha enviado com sucesso!');
      setError('');
    } catch (err: any) {
      console.error('Erro ao enviar email de redefinição:', err);
      setError('Erro ao enviar email de redefinição.');
      setSuccess('');
    }
  };

  return (
    <div className='principal'>
      <Header />
      <h2 className='Title'>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <button type="button" onClick={handlePasswordReset} style={{ marginTop: '10px' }}>
        Esqueci a senha
      </button>
    </div>
  );
};

export default Login;
