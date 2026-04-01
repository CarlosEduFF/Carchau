import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/firebaseConfig';
import RoutesP from '../../constants/routes';
import logo from "../../assets/icons/Logo-Carchau.png";
import authService from '../../services/authService';

import '../login/login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      // 1. Autenticação com Firebase Client (Senha)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase: Usuário logado');

      // 2. Captura o ID token JWT
      const idToken = await userCredential.user.getIdToken(true);
      localStorage.setItem('fb_id_token', idToken);
      localStorage.setItem('userId', userCredential.user.uid);

      // 3. Chama o backend para buscar dados do Locatário
      const userData = await authService.getUserInfo(email);
      console.log('Backend: Perfil carregado com sucesso');

      // 4. Salva o perfil completo no localStorage
      localStorage.setItem('user_profile', JSON.stringify(userData.locatario));

      // 5. Navegar para o painel de controle
      navigate(RoutesP.Control);
    } catch (err: any) {
      console.error('Erro ao autenticar:', err);
      setError('E-mail ou senha inválidos ou erro no servidor.');
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Digite seu e-mail para redefinir a senha.');
      setSuccess('');
      return;
    }
    try {
      // Usa o backend para gerar/enviar o link de redefinição
      await authService.resetPassword(email);
      setSuccess('E-mail de redefinição enviado com sucesso!');
      setError('');
    } catch (err: any) {
      console.error('Erro ao enviar e-mail de redefinição:', err);
      setError('Erro ao enviar e-mail de redefinição (verifique se o e-mail está correto).');
      setSuccess('');
    }
  };

  return (
    <div className="auth-container">
      <header className="auth-header">
        <img src={logo} alt="Logo" className="auth-logo" />
      </header>
      <div className="toggle-switch">
        <div className="auth-toggle">
          <p className={!isSignUp ? "active" : ""}>Login</p>
          <p className={isSignUp ? "active" : ""}>Sign Up</p>
        </div>
        <label htmlFor="checkbox" className="switch">
          <input
            id="checkbox"
            type="checkbox"
            aria-label="Alternar entre Login e Cadastro"
            onChange={toggleForm}
            checked={isSignUp}
          />
          <span className="slider"></span>
        </label>
      </div>
      <div className={`flip-card ${isSignUp ? "flipped" : ""}`}>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          {success && <p className="success-message" style={{ color: 'green' }}>{success}</p>}
          {/* Frente (Login) */}
          <div className="flip-card-front">
            <h2>Login</h2>

            <div className="input-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor='email'>E-mail</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor='password'>Senha</label>
            </div>


            <button className="button-login" type="submit">Entrar</button>
            <button className="recover" type="button" onClick={handlePasswordReset} style={{ backgroundColor: "#030728" }}>
              Recuperar a senha
            </button>
          </div>


          {/* Verso (Cadastro) */}
          <div className="flip-card-back">
            <h3 style={{ color: "#fff" }}>Em breve</h3>
            <h2 style={{ color: "#707074ff" }}>Sign up</h2>
            <div className="input-group">
              <input type="text" placeholder="Nome de usuário" disabled />
              <input type="email" placeholder="E-mail" disabled />
              <input type="password" placeholder="Senha" disabled />
            </div>
            <button className="button-login" style={{ backgroundColor: "#707074ff" }} disabled>Cadastrar</button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Login;