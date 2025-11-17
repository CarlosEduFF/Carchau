import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../config/firebaseConfig';
import RoutesP from '../../constants/routes';
import logo from "../../assets/icons/Logo-Carchau.png";


import '../login/login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };


  const handleSignUp = () => {
    setIsLoggedIn(true);
  };


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
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
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
              <input type="disabled" placeholder="Nome de usuário" disabled />
              <input type="email" placeholder="E-mail" disabled />
              <input type="password" placeholder="Senha" disabled />
            </div>
            <button className="button-login" onClick={handlePasswordReset} style={{ backgroundColor: "#707074ff" }} disabled>Cadastrar</button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Login;