import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../config/firebaseConfig';
import RoutesP from '../../constants/routes';
import logo from "../../assets/icons/Logo-Carchau.png";
import authService from '../../services/authService';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';

import '../login/login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  
  // Estados para o Modal
  const [modal, setModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  const showNotification = (title: string, message: string, type: 'success' | 'error') => {
    setModal({ show: true, title, message, type });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    
    // Remove espaços em branco acidentais
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    try {
      // 1. Autenticação com Firebase Client (Senha)
      console.log('[Auth] Tentando login no Firebase com:', cleanEmail);
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      console.log('[Auth] Firebase: Login concluído');

      // 2. Captura o ID token JWT
      const idToken = await userCredential.user.getIdToken(true);
      localStorage.setItem('fb_id_token', idToken);
      localStorage.setItem('userId', userCredential.user.uid);

      // 3. Chama o backend para buscar dados do Locatário
      console.log('[Auth] Buscando perfil no Backend...');
      try {
        const userData = await authService.getUserInfo(cleanEmail);
        console.log('[Auth] Backend: Perfil carregado');

        // 4. Salva o perfil completo
        localStorage.setItem('user_profile', JSON.stringify(userData.locatario));

        // 5. Navegar para o painel de controle
        setLoading(false);
        navigate(RoutesP.Control);
      } catch (apiErr: any) {
        setLoading(false);
        console.error('[Auth] Erro na API do Backend:', apiErr);
        const msg = apiErr?.response?.data?.message || 'O usuário existe no Firebase Auth, mas não foi encontrado no banco de dados do Backend.';
        showNotification('Erro de Perfil', msg, 'error');
      }

    } catch (err: any) {
      setLoading(false);
      console.error('[Auth] Erro no Firebase Auth:', err);
      let msg = '';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
         msg = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/user-not-found') {
         msg = 'Usuário não encontrado.';
      } else {
         msg = `Erro de Autenticação (${err.code || 'Desconhecido'}): ${err.message || 'Tente novamente.'}`;
      }
      showNotification('Falha no Login', msg, 'error');
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      showNotification('Atenção', 'Digite seu e-mail para redefinir a senha.', 'error');
      return;
    }
    setLoading(true);
    try {
      // Usamos o SDK do Firebase diretamente para enviar o e-mail real de redefinição
      await sendPasswordResetEmail(auth, email.trim());
      setLoading(false);
      showNotification('E-mail Enviado', 'Verifique sua caixa de entrada para redefinir sua senha.', 'success');
    } catch (err: any) {
      setLoading(false);
      console.error('[Auth] Erro ao redefinir:', err);
      showNotification('Erro no Envio', `Não foi possível enviar o e-mail: ${err.message}`, 'error');
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

      {/* Modal Premium */}
      {modal.show && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className={`modal-content ${modal.type}`} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className={`material-symbols-outlined icon-${modal.type}`}>
                {modal.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <h3>{modal.title}</h3>
            </div>
            <div className="modal-body">
              <p>{modal.message}</p>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={closeModal}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingOverlay message="Autenticando..." />}
    </div>
  );
};

export default Login;