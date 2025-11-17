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

   const toggleRealtime = () => setUseRealtime(prev => !prev);

  return (
    <>
      
        <main className="page-main">
          <div className="container">

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
                  aria-selected={filter === 'all'}
                >
                  Todos
                </button>
                <button
                  className={`chip ${filter === 'pending' ? 'chip--all' : 'chip--muted'}`}
                  type="button"
                  onClick={() => setFilter('pending')}
                  aria-selected={filter === 'pending'}
                >
                  Não validado
                </button>
                <button
                  className={`chip ${filter === 'validated' ? 'chip--all' : 'chip--muted'}`}
                  type="button"
                  onClick={() => setFilter('validated')}
                  aria-selected={filter === 'validated'}
                >
                  Validado
                </button>
                <button
                  className={`chip ${filter === 'rejected' ? 'chip--all' : 'chip--muted'}`}
                  type="button"
                  onClick={() => setFilter('rejected')}
                  aria-selected={filter === 'rejected'}
                >
                  Inválido
                </button>
                
                <button
                  className={`chip ${useRealtime ? 'chip--all' : 'chip--muted'}`}
                  type="button"
                  onClick={toggleRealtime}
                  style={{backgroundColor: useRealtime ? '#23b306' : '#e5e7eb', color: useRealtime ? '#fff' : '#4b5563'}}
                >
                  {useRealtime ? 'Mock Realtime ON' : 'Mock Realtime OFF'}
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
                        data-alt={user.nome ? user.nome.slice(0, 2).toUpperCase() : '—'}
                        style={
                          image && typeof image === 'string'
                            ? { backgroundImage: `url('${image.replace(/'/g, "\\'")}')` }
                            : undefined
                        }
                      />

                      <div>
                        <div className="card-title" title={user.nome || '—'}>{user.nome || '—'}</div>
                        <div className={`card-badge ${status.className}`}>{status.text}</div>
                      </div>
                    </div>

                    <div className="card-action mt-2">
                      {normalized === null ? (
                        <button
                          className="btn-full btn-validar"
                          type="button"
                          onClick={() => handleValidate(user.id)}
                          aria-label={`Validar CNH de ${user.nome}`}
                        >
                          Validar
                        </button>
                      ) : (
                        <button
                          className="btn-full btn-detalhes"
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
      
    </>
  );
};

export default CnhList;