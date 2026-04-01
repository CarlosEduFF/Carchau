import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './cnhValidate.css';
import cnhService from '../../services/cnhService';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import RoutesP from '../../constants/routes';

type LocationState = {
    locatarioId?: string;
    action?: 'validate' | 'details';
};

const CnhValidate: React.FC = () => {
    const { state } = useLocation();
    const typed = (state || {}) as LocationState;
    const locatarioId = typed.locatarioId;
    const navigate = useNavigate();

    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!locatarioId) {
            setError('Locatário não informado.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await cnhService.getDetails(locatarioId);
            setDetails(data);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar dados da CNH.');
        } finally {
            setLoading(false);
        }
    }, [locatarioId]);

    useEffect(() => {
        load();
    }, [load]);

    const handleUpdateStatus = async (status: 'valida' | 'invalida') => {
        if (!locatarioId) return;
        setSaving(true);
        try {
            await cnhService.updateStatus(locatarioId, status);
            // Atualiza localmente para refletir na UI antes de navegar
            setDetails((prev: any) => ({ ...prev, cnhvalida: status }));
            navigate(RoutesP.Control);
        } catch (err) {
            console.error(err);
            alert('Erro ao atualizar status.');
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        navigate(RoutesP.Control);
    };

    // Normalização para a UI
    const getStatusInfo = () => {
        const raw = details?.cnhvalida;
        if (raw === 'valida' || raw === 'valido') {
            return { key: 'aprovado', text: 'Validado', className: 'badge--validated' };
        }
        if (raw === 'invalida' || raw === 'invalido') {
            return { key: 'recusado', text: 'Inválido', className: 'badge--rejected' };
        }
        return { key: 'pendente', text: 'Pendente', className: 'badge--pending' };
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="validate-container">
            {loading && <LoadingOverlay message="Carregando dados da CNH..." />}
            {saving && <LoadingOverlay message="Atualizando status..." />}

            <div className="validate-wrapper">
                <div className="header" style={{ textAlign: "center" }}>
                    <h1>Revisão de Imagens da CNH</h1>
                    <p>Verifique as imagens da frente e do verso da CNH para prosseguir.</p>
                </div>

                {error && <div className="error" role="alert" style={{ textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

                {details && !loading && (
                    <>
                        <div className="status-card">
                            <h2>Status da Verificação</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span className={`status-ping ${statusInfo.key}`}></span>
                                <span className={`status-badge ${statusInfo.key}`}>
                                    <span className="material-symbols-outlined">
                                        {statusInfo.key === "pendente" && "hourglass_empty"}
                                        {statusInfo.key === "aprovado" && "check_circle"}
                                        {statusInfo.key === "recusado" && "cancel"}
                                    </span>
                                    {statusInfo.text}
                                </span>
                            </div>
                        </div>

                        <div className="validate-grid">
                            <div className="image-card">
                                <h3>Frente da CNH</h3>
                                <div className="image-area">
                                    {details?.fotoFront ? (
                                        <img src={details.fotoFront} alt="Front CNH" />
                                    ) : (
                                        <div className="placeholder-image">Sem imagem da frente</div>
                                    )}
                                    <div className="image-actions">
                                        <button type="button"><span className="material-symbols-outlined">zoom_in</span></button>
                                        <button type="button"><span className="material-symbols-outlined">zoom_out</span></button>
                                    </div>
                                </div>
                            </div>

                            <div className="image-card">
                                <h3>Verso da CNH</h3>
                                <div className="image-area">
                                    {details?.fotoBack ? (
                                        <img src={details.fotoBack} alt="Back CNH" />
                                    ) : (
                                        <div className="placeholder-image">Sem imagem do verso</div>
                                    )}
                                    <div className="image-actions">
                                        <button type="button"><span className="material-symbols-outlined">zoom_in</span></button>
                                        <button type="button"><span className="material-symbols-outlined">zoom_out</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="validate-buttons">
                            <button
                                className="btn-accept"
                                onClick={() => handleUpdateStatus('valida')}
                                disabled={saving}
                            >
                                <span className="material-symbols-outlined">check_circle</span>
                                Aceitar
                            </button>

                            <button
                                className="btn-reject"
                                onClick={() => handleUpdateStatus('invalida')}
                                disabled={saving}
                            >
                                <span className="material-symbols-outlined">cancel</span>
                                Recusar
                            </button>

                            <button className="btn-back" onClick={handleBack} disabled={saving}>
                                <span className="material-symbols-outlined">arrow_back</span>
                                Voltar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CnhValidate;