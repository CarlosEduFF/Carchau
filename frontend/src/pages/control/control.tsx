import { useEffect, useState } from "react";
import "./control.css";
import ReportList from "../reportList/reportList";
import CnhList from "../cnhList/cnhList";
import authService from "../../services/authService";
import { Locatario } from "../../types/Locatario";

const Control: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "profile" | "reportList" | "cnhList"
  >("profile");

  const [locatario, setLocatario] = useState<Locatario | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchLocatario = async () => {
      try {
        const data = await authService.getMyProfile();
        setLocatario(data);
      } catch (err: any) {
        console.error(err);
        setError("Erro ao carregar dados do perfil. Verifique sua conexão ou login.");
      }
    };

    fetchLocatario();
  }, []);

  return (
    <>
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
            <div className="sidebar-logo">
                {locatario?.fotoPerfil ? (
                    <img  className="sidebar-logo" src={locatario.fotoPerfil} alt="Avatar" />
                ) : (
                    <div className="sidebar-logo" style={{ backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCbVhEXVDMS22_bcXTGUHX88QM_PTK5B0JRn8wqyeWFvV9DBZAyAAwo-mn6Vx8g3S2Q7-Dj0opZckrnfm485sWBCysIjdPWbXA_50FINKG-lheC0YR1mPZD7RKQakFNQO_Uutn9xx5m_5JYEReDfLHIFK4DG90rI1S0tkvNj-uFeJQhuhQkugBIxkyvufjxxAyNc_VsimhRrrs0QuqUdX5Q1JZuojwbVeVPBbfjZ0X4bkWH_pHOzTSlM7LjIikgrc9ecpNn8hgsAsm7")',
                     }} />
                )}
            </div>
            <div className="sidebar-title">
                <h1>{locatario?.nome ?? '—'}</h1>
                <p >{locatario?.email ? `@${locatario.email.split('@')[0]}` : '@usuario'}</p>
            </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeView === "profile" ? "active" : ""}`}
            onClick={() => setActiveView("profile")}
          >
            <span className="material-symbols-outlined">home</span>
            <p>Início</p>
          </button>

          <button
            className={`nav-item ${
              activeView === "cnhList" ? "active" : ""
            }`}
            onClick={() => setActiveView("cnhList")}
          >
            <span className="material-symbols-outlined">shield</span>
            <p>Validar CNH</p>
          </button>

          <button
            className={`nav-item ${
              activeView === "reportList" ? "active" : ""
            }`}
            onClick={() => setActiveView("reportList")}
          >
            <span className="material-symbols-outlined filled">flag</span>
            <p>Visualizar Denúncias</p>
          </button>

       
        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">
        {activeView === "profile" && (
          <div className="header">
            <h2>Perfil do Locatário</h2>
            <p>Visualize seus dados pessoais cadastrados.</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!locatario && !error && <p>Carregando dados...</p>}
            {locatario && (
              <div className="profile-info">
                <p>
                  <strong>Nome:</strong> {locatario.nome}
                </p>
                <p>
                  <strong>Email:</strong> {locatario.email}
                </p>
                <p>
                  <strong>CPF:</strong> {locatario.cpf}
                </p>
                <p>
                  <strong>Profissão:</strong> {locatario.profissao}
                </p>
                <p>
                  <strong>Telefone:</strong> {locatario.telefone}
                </p>
                <p>
                  <strong>Nacionalidade:</strong> {locatario.nacionalidade}
                </p>
              </div>
            )}
          </div>
        )}

        {activeView === "reportList" && (
          <>
            <div className="header">
              <h2>Denúncias Recebidas</h2>
              <p>Gerencie e resolva as denúncias de usuários.</p>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', height: 'calc(100vh - 120px)' }}>
              <ReportList />
            </div>
          </>
        )}

        {activeView === "cnhList" && (
          <>
            <div className="header">
              <h2>Validação de CNH</h2>
              <p>Verifique e aprove os documentos enviados pelos usuários.</p>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', height: 'calc(100vh - 120px)' }}>
              <CnhList />
            </div>
          </>
        )}


      </main>
    </div>
  </>
  );
};

export default Control;
