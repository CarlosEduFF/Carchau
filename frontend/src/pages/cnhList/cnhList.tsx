import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './cnhList.css';
import {
  CnhSummary,
  getAllLocatariosCnhSummaries,
  subscribeToCnhSummaries,
} from '../../services/cnh/cnhService';
import RoutesP from '../../constants/routes';
import { useNavigate } from 'react-router-dom';

type Filter = 'all' | 'pending' | 'validated' | 'rejected';

/**
 * Normaliza estritamente para 'valida' | 'invalida' | null
 * - O banco pode ter "valido" ou "invalido" (ou null).
 * - Também aceitamos "valida"/"invalida" por segurança.
 * - Não fazemos parsing complexo nem tentamos mapear outros formatos.
 */
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

const statusToBadge = (val: any) => {
  const normalized = normalizeCnhValida(val);
  if (normalized === 'valida') return { text: 'Validado', className: 'badge--validated' };
  if (normalized === 'invalida') return { text: 'Inválido', className: 'badge--rejected' };
  return { text: 'Pendente', className: 'badge--pending' };
};


const CnhList: React.FC = () => {
  const [items, setItems] = useState<CnhSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [useRealtime, setUseRealtime] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    let unsub: (() => void) | undefined;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (useRealtime) {
          unsub = subscribeToCnhSummaries(setItems);
          console.debug('[CnhList] Subscribed to realtime updates');
        } else {
          const data = await getAllLocatariosCnhSummaries();
          setItems(data);
          console.debug('[CnhList] Loaded CNH summaries (count):', data.length);
          console.debug(
            '[CnhList] raw cnhvalida types/values:',
            data.map((d) => ({ id: d.id, type: typeof (d as any).cnhvalida, raw: (d as any).cnhvalida }))
          );
          console.debug(
            '[CnhList] normalized cnhvalida values:',
            data.map((d) => ({ id: d.id, normalized: normalizeCnhValida((d as any).cnhvalida) }))
          );
        }
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
  }, [useRealtime]);

  const filtered = useMemo(() => {
    const result = items.filter((it) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!it.nome.toLowerCase().includes(q)) return false;
      }

      // agora item.cnhvalida pode ser 'valido'/'invalido'/null (do banco)
      // normalize para 'valida'|'invalida'|null
      const normalized = normalizeCnhValida((it as any).cnhvalida);

      if (filter === 'pending') return normalized === null;
      if (filter === 'validated') return normalized === 'valida';
      if (filter === 'rejected') return normalized === 'invalida';
      return true;
    });

    console.debug(
      `[CnhList] Filter applied (${filter}):`,
      result.map((r) => ({
        id: r.id,
        nome: r.nome,
        cnhvalida: (r as any).cnhvalida,
        normalized: normalizeCnhValida((r as any).cnhvalida),
      }))
    );

    return result;
  }, [items, search, filter]);

  const handleValidate = useCallback(
    (locatarioId: string) => {
      console.debug('[CnhList] Navigate to validation for:', locatarioId);
      navigate(RoutesP.cnhValidate, {
        state: { locatarioId, action: 'validate' },
      });
    },
    [navigate]
  );

  return (
    <div className="page-root">
      <main className="page-main">
        <div className="container">
          <div className="title-row">
            <div className="flex-col">
              <h1 className="page-title">Painel de Validação</h1>
              <p className="page-sub">Revise e valide os documentos dos usuários pendentes.</p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <label style={{ marginRight: 8 }}>
                <input
                  type="checkbox"
                  checked={useRealtime}
                  onChange={() => setUseRealtime((v) => !v)}
                />{' '}
                Realtime
              </label>
            </div>
          </div>

          <div className="search-row">
            <div className="search-wrapper">
              <label className="search-label" style={{ display: 'block' }}>
                <div className="search-box">
                  <input
                    className="form-input"
                    placeholder="Buscar usuário por nome..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Buscar usuário"
                  />
                </div>
              </label>
            </div>

            <div className="filter-chips" role="tablist" aria-label="Filtros">
              <button
                className={`chip ${filter === 'all' ? 'chip--all' : 'chip--muted'}`}
                type="button"
                onClick={() => setFilter('all')}
              >
                Todos
              </button>
              <button
                className={`chip ${filter === 'pending' ? 'chip--all' : 'chip--muted'}`}
                type="button"
                onClick={() => setFilter('pending')}
              >
                Não validado
              </button>
              <button
                className={`chip ${filter === 'validated' ? 'chip--all' : 'chip--muted'}`}
                type="button"
                onClick={() => setFilter('validated')}
              >
                Validado
              </button>
              <button
                className={`chip ${filter === 'rejected' ? 'chip--all' : 'chip--muted'}`}
                type="button"
                onClick={() => setFilter('rejected')}
              >
                Inválido
              </button>
            </div>
          </div>

          {loading && <p>Carregando...</p>}
          {error && <p className="error">{error}</p>}

          <div className="cards-grid">
            {filtered.map((user) => {
              const status = statusToBadge((user as any).cnhvalida);
              const image = user.fotoPerfil || user.fotoFront;

              const raw = (user as any).cnhvalida;
              const normalized = normalizeCnhValida(raw);
              console.debug(
                '[CnhList][Render]',
                user.id,
                '| raw:',
                raw,
                '| typeof:',
                typeof raw,
                '| normalized:',
                normalized
              );

              return (
                <article key={user.id} className="card" role="article" aria-label={user.nome}>
                  <div className="card-head">
                    <div
                      className={`avatar-lg bg-cover ${!image ? 'avatar--empty' : ''}`}
                      data-alt={`Avatar de ${user.nome}`}
                      style={
                        image && typeof image === 'string'
                          ? { backgroundImage: `url('${image.replace(/'/g, "\\'")}')` }
                          : undefined
                      }
                    />

                    <div>
                      <p className="card-title truncate">{user.nome || '—'}</p>
                      <div className={`card-badge ${status.className}`}>{status.text}</div>
                    </div>
                  </div>

                  <div className="card-action mt-2">
                    {normalized === null ? (
                      <button
                        className="btn-full btn-primary"
                        type="button"
                        onClick={() => handleValidate(user.id)}
                        aria-label={`Validar CNH de ${user.nome}`}
                      >
                        Validar
                      </button>
                    ) : (
                      <button
                        className="btn-full btn-primary"
                        type="button"
                        onClick={() => handleValidate(user.id)}
                        aria-label={`Ver detalhes da CNH de ${user.nome}`}
                      >
                        Ver Detalhes
                      </button>
                    )}
                  </div>
                </article>
              );
            })}

            {filtered.length === 0 && !loading && <div style={{ padding: 20 }}>Nenhum resultado.</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CnhList;
