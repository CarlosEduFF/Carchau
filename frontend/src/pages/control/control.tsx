import { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import './control.css';
import { Locatario } from '../../types/Locatario';


const Control: React.FC = () => {

    const [locatario, setLocatario] = useState<Locatario | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchLocatario = async () => {
            try {
                const token = localStorage.getItem('fb_id_token');
                if (!token) {
                    setError('Usuário não autenticado');
                    return;
                }

                const resp = await fetch('http://localhost:8080/api/locatarios/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!resp.ok) {
                    const text = await resp.text();
                    throw new Error(`Erro ${resp.status}: ${text}`);
                }

                const data: Locatario = await resp.json();
                setLocatario(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Erro ao buscar dados');
            }
        };

        fetchLocatario();
    }, []);
    return (
        <><div className="root">
            <Header />
            <div className="layout-container">
                <div className="center-row">
                    <div className="sidebar-column">
                        <div className="card">
                            <div className="card-column">
                                <div className="profile-row">
                                    <div className="avatar">
                                        {locatario?.fotoPerfil ? (
                                            <img src={locatario.fotoPerfil} alt="Avatar" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                                        ) : (
                                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ccc' }} />
                                        )}
                                    </div>
                                    <div className="user-info">
                                        <h1 className="user-name">{locatario?.nome ?? '—'}</h1>
                                        <p className="user-handle">{locatario?.email ? `@${locatario.email.split('@')[0]}` : '@usuario'}</p>
                                    </div>
                                </div>

                                <nav className="menu">
                                    <button className="menu-item active" type="button">
                                        <span className="icon" aria-hidden="true">
                                            {/*<!-- house icon -->*/}
                                            <svg viewBox="0 0 256 256" width="24" height="24" fill="currentColor" aria-hidden="true">
                                                <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
                                            </svg>
                                        </span>
                                        <span className="menu-label">Início</span>
                                    </button>

                                    <button className="menu-item" type="button">
                                        <span className="icon" aria-hidden="true">
                                            {/*<!-- magnifying glass -->*/}
                                            <svg viewBox="0 0 256 256" width="24" height="24" fill="currentColor" aria-hidden="true">
                                                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                                            </svg>
                                        </span>
                                        <span className="menu-label">Explorar</span>
                                    </button>

                                    <button className="menu-item" type="button">
                                        <span className="icon" aria-hidden="true">
                                            {/*<!-- bell -->*/}
                                            <svg viewBox="0 0 256 256" width="24" height="24" fill="currentColor" aria-hidden="true">
                                                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                                            </svg>
                                        </span>
                                        <span className="menu-label">Notificações</span>
                                    </button>

                                    <button className="menu-item" type="button">
                                        <span className="icon" aria-hidden="true">
                                            {/*<!-- envelope -->*/}
                                            <svg viewBox="0 0 256 256" width="24" height="24" fill="currentColor" aria-hidden="true">
                                                <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"></path>
                                            </svg>
                                        </span>
                                        <span className="menu-label">Mensagens</span>
                                    </button>

                                    <button className="menu-item" type="button">
                                        <span className="icon" aria-hidden="true">
                                            {/*<!-- list -->*/}
                                            <svg viewBox="0 0 256 256" width="24" height="24" fill="currentColor" aria-hidden="true">
                                                <path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z"></path>
                                            </svg>
                                        </span>
                                        <span className="menu-label">Listas</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="layout-content">
                        <div className="layout-container">
                            <div className="center-row">
                                <div className="layout-content">
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                    {!locatario && !error && <p>Carregando dados...</p>}
                                    {locatario && (
                                        <div>
                                            <h2>Dados do locatário</h2>
                                            <p><strong>Nome:</strong> {locatario.nome}</p>
                                            <p><strong>Email:</strong> {locatario.email}</p>
                                            <p><strong>CPF:</strong> {locatario.cpf}</p>
                                            <p><strong>Profissão:</strong> {locatario.profissao}</p>
                                            <p><strong>Telefone:</strong> {locatario.telefone}</p>
                                            <p><strong>Nacionalidade:</strong> {locatario.nacionalidade}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>

    )
};
export default Control;