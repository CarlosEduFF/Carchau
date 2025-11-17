import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './cnhValidate.css';
import { CnhDetails, CnhSummary, getAllLocatariosCnhSummaries, getCnhDetails } from '../../services/cnh/cnhService';
import { setCnhValidationWeb } from '../../services/cnh/cnhUploadService';
import RoutesP from '../../constants/routes';

type LocationState = {
    locatarioId?: string;
    action?: 'validate' | 'details';
};

type CnhDoc = {
    fotoFront?: string | null;
    fotoBack?: string | null;
    cnhvalida?: 'valido' | 'invalido' | null;
    validar?: 'aceito' | 'recusado' | null;
    [k: string]: any;
};
interface Item {
    id?: string;
    _id?: string;
    nome: string;
    cnh?: { fotoFront?: string; fotoBack?: string };
    fotoPerfil?: string;
    fotoFront?: string;
    fotoBack?: string;
    cnhvalida?: any;
}
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
        } catch {
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
            setCnh(prev => prev ? { ...prev, cnhvalida: 'valido' } : prev);
            const res = await setCnhValidationWeb(locatarioId, 'valido');

            if (!res || !res.success) {
                await load();
                return setError(res?.message ?? 'Falha ao aceitar CNH.');
            }

            await load();
            navigate(RoutesP.Control, { state: { locatarioId, action: 'validate' } });
        } catch {
            setError('Erro ao aceitar CNH.');
            await load();
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
                return setError(res?.message ?? 'Falha ao recusar CNH.');
            }

            await load();
            navigate(RoutesP.Control, { state: { locatarioId, action: 'validate' } });
        } catch {
            setError('Erro ao recusar CNH.');
            await load();
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        navigate(RoutesP.Control, { state: { locatarioId, action: 'validate' } });
    };

    const getStatusLabel = () => {
        if (!cnh) return 'Pendente';
        if (cnh.cnhvalida === 'valido') return 'Validado';
        if (cnh.cnhvalida === 'invalido') return 'Recusado';
        return 'Pendente';
    };

    function normalizeCnhValida(raw: any): 'valida' | 'invalida' | null {
        if (raw === null || typeof raw === 'undefined') return null;

        // se já estiver exatamente no formato que usamos internamente
        if (raw === 'valida') return 'valida';
        if (raw === 'invalida') return 'invalida';

        // casos concretos esperados no banco: 'valido' / 'invalido'
        if (raw === 'valido') return 'valida';
        if (raw === 'invalido') return 'invalida';

        // por compatibilidade, aceitar strings semelhantes (trim + lowercase)
        if (typeof raw === 'string') {
            const s = raw.trim().toLowerCase();
            if (s === 'valido' || s === 'valida') return 'valida';
            if (s === 'invalido' || s === 'invalida') return 'invalida';
            return null;
        }

        // não aceitamos outros tipos (boolean, number, objetos) — retorna null
        return null;
    }
    type Filter = 'all' | 'pending' | 'validated' | 'rejected';
    // supondo: const [items, setItems] = useState<CnhDetails[]>([]);
    useEffect(() => {
        let unsub: (() => void) | undefined;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getCnhDetails(locatarioId || '');
                // normaliza: data pode ser CnhDetails | CnhDetails[] | null
                if (Array.isArray(data)) {
                    setItems(data);
                    console.debug('[CnhList] Loaded CNH summaries (count):', data.length);
                } else if (data) {
                    setItems([data]); // transforma objeto único em array de um elemento
                    console.debug('[CnhList] Loaded single CNH detail, wrapped into array');
                } else {
                    setItems([]); // ou setItems(null) se você permitir null no estado
                    console.debug('[CnhList] No CNH data returned (null), items set to []');
                }

                // logs seguros (evitar map se não for array)
                const safeArray = Array.isArray(data) ? data : (data ? [data] : []);
                console.debug(
                    '[CnhList] raw cnhvalida types/values:',
                    safeArray.map((d) => ({ id: d.id, type: typeof (d as any).cnhvalida, raw: (d as any).cnhvalida }))
                );
                console.debug(
                    '[CnhList] normalized cnhvalida values:',
                    safeArray.map((d) => ({ id: d.id, normalized: normalizeCnhValida((d as any).cnhvalida) }))
                );
            } catch (e) {
                console.error('[CnhList] Error loading data:', e);
                setError('Erro ao carregar dados.');
            } finally {
                setLoading(false);
            }
        };

        load();

        return () => {
            if (unsub) {
                unsub();
                console.debug('[CnhList] Realtime unsubscribed');
            }
        };
    }, [locatarioId]); // adicionar dependência locatarioId

    const [filter, setFilter] = useState<Filter>('all');
    const [search, setSearch] = useState('');
    const status = getStatusLabel;
    const [items, setItems] = useState<CnhDetails[]>([]);



    const statusToBadge = (val: any) => {
        const normalized = normalizeCnhValida(val); // 'valida' | 'invalida' | null/undefined
        if (normalized === 'valida') {
            return { key: 'aprovado', text: 'Validado', className: 'badge--validated' };
        }
        if (normalized === 'invalida') {
            return { key: 'recusado', text: 'Inválido', className: 'badge--rejected' };
        }
        return { key: 'pendente', text: 'Pendente', className: 'badge--pending' };
    };

    // memoiza apenas o ARRAY filtrado
    const filtered = useMemo((): CnhDetails[] => {
        const q = search?.trim().toLowerCase() || '';
        const result = items.filter((it) => {
            if (q) {
                if (!it.nome.toLowerCase().includes(q)) return false;
            }

            const normalized = normalizeCnhValida((it as any).cnhvalida);

            if (filter === 'pending') return normalized === null;
            if (filter === 'validated') return normalized === 'valida';
            if (filter === 'rejected') return normalized === 'invalida';
            return true;
        });

        return result;
    }, [items, search, filter]);


    return (
        <div className="validate-container">
            <div className="validate-wrapper">

                <div className="header" style={{ textAlign: "center" }}>
                    <h1>Revisão de Imagens da CNH</h1>
                    <p>Verifique as imagens da frente e do verso da CNH para prosseguir.</p>
                </div>
                {loading ? (
                    <p>Carregando...</p>
                ) : error ? (
                    <div className="error" role="alert">{error}</div>
                ) : !Array.isArray(filtered) || filtered.length === 0 ? (
                    <p>Nenhum usuário encontrado.</p>
                ) : (
                    filtered.map((user: CnhDetails) => {
                        const u = user as any;
                        const cnh = u.cnh || u;
                        const status = statusToBadge(u.cnhvalida); // { key, text, className }
                        const statusKey = status.key;
                        const statusText = status.text;
                        const statusClass = status.className;
                        const image = u.fotoPerfil || cnh.fotoFront;
                        const raw = u.cnhvalida;
                        const normalized = typeof normalizeCnhValida === "function"
                            ? normalizeCnhValida(raw)
                            : raw;

                        console.debug(
                            '[CnhList][Render]',
                            u.id || u._id,
                            '| raw:',
                            raw,
                            '| typeof:',
                            typeof raw,
                            '| normalized:',
                            normalized
                        );

                        return (
                            <div className="validate-card" key={u.id || u._id}>
                                <div className={`status-card ${statusClass}`}>
                                    <h2>Status da Verificação</h2>

                                    <div className="status-badge-container">
                                        <span className={`status-ping ${statusKey}`}></span>

                                        <span className={`status-badge ${statusKey}`}>
                                            <span className="material-symbols-outlined">
                                                {statusKey === "pendente" && "hourglass_empty"}
                                                {statusKey === "aprovado" && "check_circle"}
                                                {statusKey === "recusado" && "cancel"}
                                            </span>

                                            {statusText}
                                        </span>
                                    </div>
                                </div>

                                <div className="validate-grid">

                                    <div className="image-card">
                                        <h3>Frente da CNH</h3>

                                        <div className="image-area">
                                            {frontPreview ? (
                                                <img src={frontPreview} alt="Preview front" />
                                            ) : cnh?.fotoFront ? (
                                                <img src={cnh.fotoFront} alt="Front CNH" />
                                            ) : (
                                                <div style={{
                                                    width: "100%", height: 300, background: "#ccc",
                                                    display: "flex", alignItems: "center", justifyContent: "center"
                                                }}>
                                                    Sem imagem
                                                </div>
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
                                            {backPreview ? (
                                                <img src={backPreview} alt="Preview back" />
                                            ) : cnh?.fotoBack ? (
                                                <img src={cnh.fotoBack} alt="Back CNH" />
                                            ) : (
                                                <div style={{
                                                    width: "100%", height: 300, background: "#ccc",
                                                    display: "flex", alignItems: "center", justifyContent: "center"
                                                }}>
                                                    Sem imagem
                                                </div>
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
                                        onClick={() => handleAccept()}
                                        disabled={saving}
                                    >
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Aceitar
                                    </button>

                                    <button
                                        className="btn-reject"
                                        onClick={() => handleReject()}
                                        disabled={saving}
                                    >
                                        <span className="material-symbols-outlined">cancel</span>
                                        Recusar
                                    </button>

                                    <button className="btn-back" onClick={() => handleBack && handleBack()}>
                                        <span className="material-symbols-outlined">arrow_back</span>
                                        Voltar
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
export default CnhValidate;