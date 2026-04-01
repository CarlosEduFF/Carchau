import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './cnhList.css';
import cnhService, { CnhSummary } from '../../services/cnhService';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import RoutesP from '../../constants/routes';
import { useNavigate } from 'react-router-dom';

type Filter = 'all' | 'pending' | 'validated' | 'rejected';

function normalizeCnhValida(raw: any): 'valida' | 'invalida' | null {
  if (raw === null || typeof raw === 'undefined') return null;
  if (raw === 'valida' || raw === 'valido') return 'valida';
  if (raw === 'invalida' || raw === 'invalido') return 'invalida';
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
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await cnhService.getAllSummaries();
        setItems(data);
      } catch (e) {
        console.error('[CnhList] Error loading data:', e);
        setError('Erro ao carregar dados do servidor.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!it.nome.toLowerCase().includes(q)) return false;
      }

      const normalized = normalizeCnhValida(it.cnhvalida);
      if (filter === 'pending') return normalized === null;
      if (filter === 'validated') return normalized === 'valida';
      if (filter === 'rejected') return normalized === 'invalida';
      return true;
    });
  }, [items, search, filter]);

  const handleValidate = useCallback(
    (locatarioId: string) => {
      navigate(RoutesP.cnhValidate, {
        state: { locatarioId, action: 'validate' },
      });
    },
    [navigate]
  );

  return (
    <div className="page-main">
      <div className="container">
        <div className="search-row">
          <div className="search-wrapper">
            <div className="search-box">
              <input
                className="form-input"
                placeholder="Buscar usuário por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar usuário"
              />
            </div>
          </div>

          <div className="filter-chips">
            <button className={`chip ${filter === 'all' ? 'chip--all' : 'chip--muted'}`} onClick={() => setFilter('all')}> Todos </button>
            <button className={`chip ${filter === 'pending' ? 'chip--all' : 'chip--muted'}`} onClick={() => setFilter('pending')}> Não validado </button>
            <button className={`chip ${filter === 'validated' ? 'chip--all' : 'chip--muted'}`} onClick={() => setFilter('validated')}> Validado </button>
            <button className={`chip ${filter === 'rejected' ? 'chip--all' : 'chip--muted'}`} onClick={() => setFilter('rejected')}> Inválido </button>
          </div>
        </div>

        {loading && <LoadingOverlay message="Carregando locatários..." />}
        {error && <p className="error">{error}</p>}

        <div className="cards-grid">
          {filtered.map((user) => {
            const status = statusToBadge(user.cnhvalida);
            const image = user.fotoPerfil || user.fotoFront;
            const normalized = normalizeCnhValida(user.cnhvalida);

            return (
              <article key={user.id} className="card">
                <div className="card-head">
                  <div
                    className={`avatar-lg bg-cover ${!image ? 'avatar--empty' : ''}`}
                    style={image ? { backgroundImage: `url('${image}')` } : undefined}
                  />
                  <div>
                    <div className="card-title">{user.nome}</div>
                    <div className={`card-badge ${status.className}`}>{status.text}</div>
                  </div>
                </div>

                <div className="card-action mt-2">
                  <button
                    className={`btn-full ${normalized === null ? 'btn-validar' : 'btn-detalhes'}`}
                    onClick={() => handleValidate(user.id)}
                  >
                    {normalized === null ? 'Validar' : 'Ver Detalhes'}
                  </button>
                </div>
              </article>
            );
          })}
          {filtered.length === 0 && !loading && <div style={{ padding: 20 }}>Nenhum resultado.</div>}
        </div>
      </div>
    </div>
  );
};

export default CnhList;