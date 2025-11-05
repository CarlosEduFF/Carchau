// src/components/CnhValidate.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './cnhValidate.css';
import { getCnhDetails } from '../../services/cnh/cnhService';
import { setCnhValidationWeb } from '../../services/cnh/cnhUploadService';
import RoutesP from '../../constants/routes';


type LocationState = {
    locatarioId?: string;
    action?: 'validate' | 'details';
};

type CnhDoc = {
    fotoFront?: string | null;
    fotoBack?: string | null;
    cnhvalida?: 'valido' | 'invalido' | null; // << agora é string
    validar?: 'aceito' | 'recusado' | null;
    [k: string]: any;
};




const CnhValidate: React.FC = () => {
    const { state } = useLocation();
    const typed = (state || {}) as LocationState;
    const locatarioIdFromState = typed.locatarioId;
    const navigate = useNavigate();

    const [locatarioId] = useState<string | undefined>(locatarioIdFromState);
    const [cnh, setCnh] = useState<CnhDoc | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [frontPreview, setFrontPreview] = useState<string | null>(null);
    const [backPreview, setBackPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    const load = useCallback(async () => {
        if (!locatarioId) {
            setError('Locatário não informado.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const details = await getCnhDetails(locatarioId);
            setCnh(details ? (details as CnhDoc) : null);
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

    useEffect(() => {
        if (frontFile) {
            const url = URL.createObjectURL(frontFile);
            setFrontPreview(url);
            return () => URL.revokeObjectURL(url);
        } else setFrontPreview(null);
    }, [frontFile]);

    useEffect(() => {
        if (backFile) {
            const url = URL.createObjectURL(backFile);
            setBackPreview(url);
            return () => URL.revokeObjectURL(url);
        } else setBackPreview(null);
    }, [backFile]);


    const handleAccept = async () => {
        if (!locatarioId) return setError('Locatário não informado.');
        setSaving(true);
        setError(null);
        try {
            // Atualiza localmente para dar resposta imediata na UI (optimistic)
            setCnh(prev => prev ? { ...prev, cnhvalida: 'valido' } : prev);

            const res = await setCnhValidationWeb(locatarioId, 'valido');
            if (!res || !res.success) {
                // reverter otimista se necessário
                await load(); // tenta recarregar o estado real
                setError(res?.message ?? 'Falha ao aceitar CNH.');
                return;
            }

            // garante que dados fiquem consistentes com o backend
            await load();
            navigate(RoutesP.Control, {
                state: { locatarioId, action: 'validate' },
            });
        } catch (err) {
            console.error(err);
            setError('Erro ao aceitar CNH.');
            await load(); // tenta recarregar o estado real
        } finally {
            setSaving(false);
        }
    };

    const handleReject = async () => {
        if (!locatarioId) return setError('Locatário não informado.');
        setSaving(true);
        setError(null);
        try {
            setCnh(prev => prev ? { ...prev, cnhvalida: 'invalido' } : prev);

            const res = await setCnhValidationWeb(locatarioId, 'invalido');
            if (!res || !res.success) {
                await load();
                setError(res?.message ?? 'Falha ao recusar CNH.');
                return;
            }

            await load();
            navigate(RoutesP.CnhList, {
                state: { locatarioId, action: 'validate' },
            });
        } catch (err) {
            console.error(err);
            setError('Erro ao recusar CNH.');
            await load();
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        navigate(RoutesP.Control, {
            state: { locatarioId, action: 'validate' },
        });;
    }
    const getStatusLabel = () => {
        if (!cnh) return 'Pendente';
        if (cnh.cnhvalida === 'valido') return 'Validado';
        if (cnh.cnhvalida === 'invalido') return 'Recusado';
        return 'Pendente';
    };

    return (
        <div className="page-root">
            <div className="layout-container">
                <main className="main" role="main">
                    <div className="content">
                        <section className="hero">
                            <h1 className="hero-title">Confirm CNH Images</h1>
                            <p className="hero-sub">Verify the front and back images of the CNH before proceeding with validation.</p>
                        </section>

                        {loading ? (
                            <p>Carregando...</p>
                        ) : error ? (
                            <div className="error" role="alert">{error}</div>
                        ) : (
                            <>
                                <section className="cards">
                                    <article className="card">
                                        <div className="card-media" role="img" aria-label="Front of CNH">
                                            {frontPreview ? (
                                                <img src={frontPreview} alt="Preview front" />
                                            ) : cnh?.fotoFront ? (
                                                <img src={cnh.fotoFront} alt="Front of CNH" />
                                            ) : (
                                                <div style={{ width: 640, height: 400, backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    Sem imagem
                                                </div>
                                            )}
                                        </div>

                                    </article>

                                    <article className="card">
                                        <div className="card-media" role="img" aria-label="Back of CNH">
                                            {backPreview ? (
                                                <img src={backPreview} alt="Preview back" />
                                            ) : cnh?.fotoBack ? (
                                                <img src={cnh.fotoBack} alt="Back of CNH" />
                                            ) : (
                                                <div style={{ width: 640, height: 400, backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    Sem imagem
                                                </div>
                                            )}
                                        </div>

                                    </article>
                                </section>

                                <div className="actions" style={{ display: 'flex', gap: 12, marginTop: 12 }}>

                                    <button className="btn-primary" type="button" onClick={handleAccept} disabled={saving}>
                                        Aceitar
                                    </button>
                                    <button className="btn-danger" type="button" onClick={handleReject} disabled={saving}>
                                        Recusar
                                    </button>
                                    <button className="btn-ghost" type="button" onClick={handleBack}>
                                        Voltar
                                    </button>
                                </div>

                                <div style={{ marginTop: 12 }}>
                                    <strong>Status:</strong> {getStatusLabel()}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CnhValidate;
