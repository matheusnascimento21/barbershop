import { useState } from 'react';
import '../index.css';

export default function Dashboard({ agendamentos, handleConfirmar, handleCancelar, setView }) {
  const [adminTab, setAdminTab] = useState('agenda'); 
  const [confirmandoId, setConfirmandoId] = useState(null);
  
  // VAR: Novo estado para controlar o filtro de pagamento
  const [filtroPagamento, setFiltroPagamento] = useState('Todos');

  const agendamentosConfirmados = agendamentos.filter(ag => ag.status === 'confirmado');
  
  // Lógica do filtro: se for "Todos", mostra tudo. Se não, filtra pelo método exato.
  const agendamentosFiltrados = filtroPagamento === 'Todos' 
    ? agendamentosConfirmados 
    : agendamentosConfirmados.filter(ag => ag.pagamento === filtroPagamento);

  // Calcula o faturamento baseado apenas nos itens filtrados
  const faturamentoTotal = agendamentosFiltrados.reduce((acc, ag) => acc + ag.preco, 0);

  const btnPagamentoStyle = {
    background: '#333', color: '#fff', border: '1px solid var(--gold)', padding: '6px 10px', 
    borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', display: 'flex', flexDirection: 'column' }}>
      
      <header style={{ backgroundColor: '#000', borderBottom: '2px solid var(--gold)', padding: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', alignItems: 'center', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--gold)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', flex: '1 1 100%' }}>Painel de Controle | Batatabowl</h2>
        <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setAdminTab('agenda')} style={{ background: adminTab === 'agenda' ? 'var(--gold)' : 'transparent', color: adminTab === 'agenda' ? '#000' : 'var(--gold)', border: '2px solid var(--gold)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>Agenda</button>
          <button onClick={() => setAdminTab('relatorios')} style={{ background: adminTab === 'relatorios' ? 'var(--gold)' : 'transparent', color: adminTab === 'relatorios' ? '#000' : 'var(--gold)', border: '2px solid var(--gold)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>Relatórios</button>
          <button onClick={() => setView('site')} style={{ background: '#333', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>Sair</button>
        </nav>
      </header>

      <main style={{ padding: '30px 5%', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        
        {/* ABA 1: AGENDA DE CORTES */}
        {adminTab === 'agenda' && (
          <div>
            <h3 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '20px' }}>Próximos Cortes</h3>
            <div style={{ backgroundColor: '#1A1A1A', borderRadius: '16px', overflowX: 'auto', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', color: '#fff', textAlign: 'left', fontSize: '1rem' }}>
                <thead style={{ backgroundColor: '#222', color: 'var(--gold)' }}>
                  <tr>
                    <th style={{ padding: '20px' }}>Data</th><th style={{ padding: '20px' }}>Hora</th><th style={{ padding: '20px' }}>Barbeiro</th><th style={{ padding: '20px' }}>Cliente</th><th style={{ padding: '20px' }}>Telefone</th><th style={{ padding: '20px' }}>Serviços</th><th style={{ padding: '20px', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentos.length === 0 ? (
                    <tr><td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: '1.2rem' }}>Nenhum agendamento ainda.</td></tr>
                  ) : (
                    agendamentos.map((ag) => (
                      <tr key={ag.id} style={{ borderBottom: '1px solid #333', backgroundColor: ag.status === 'confirmado' ? 'rgba(37, 211, 102, 0.05)' : 'transparent' }}>
                        <td style={{ padding: '20px' }}>{ag.data.split('-').reverse().join('/')}</td>
                        <td style={{ padding: '20px', fontWeight: 'bold', color: 'var(--gold)' }}>{ag.hora}</td>
                        <td style={{ padding: '20px', fontWeight: 'bold', color: '#fff' }}>{ag.barbeiro}</td>
                        <td style={{ padding: '20px' }}>{ag.nome}</td>
                        <td style={{ padding: '20px' }}>{ag.telefone}</td>
                        <td style={{ padding: '20px', color: '#ccc' }}>{ag.servicosDescricao}</td>
                        
                        <td style={{ padding: '20px', textAlign: 'center', minWidth: '200px' }}>
                          {ag.status === 'pendente' ? (
                            confirmandoId === ag.id ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>Como foi pago?</span>
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                  <button onClick={() => { handleConfirmar(ag.id, 'Pix'); setConfirmandoId(null); }} style={btnPagamentoStyle}>Pix</button>
                                  <button onClick={() => { handleConfirmar(ag.id, 'Dinheiro'); setConfirmandoId(null); }} style={btnPagamentoStyle}>Dinheiro</button>
                                  <button onClick={() => { handleConfirmar(ag.id, 'Débito'); setConfirmandoId(null); }} style={btnPagamentoStyle}>Débito</button>
                                  <button onClick={() => { handleConfirmar(ag.id, 'Crédito'); setConfirmandoId(null); }} style={btnPagamentoStyle}>Crédito</button>
                                  <button onClick={() => setConfirmandoId(null)} style={{ background: 'transparent', color: '#FF3B30', border: 'none', padding: '4px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button onClick={() => setConfirmandoId(ag.id)} title="Confirmar Presença e Pagamento" style={{ background: '#25D366', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✓</button>
                                <button onClick={() => handleCancelar(ag.id)} title="Cancelar Corte" style={{ background: '#FF3B30', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                              </div>
                            )
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                              <span style={{ color: '#25D366', fontWeight: 'bold', fontSize: '0.9rem' }}>✅ {ag.pagamento}</span>
                              <button onClick={() => handleCancelar(ag.id)} style={{ background: 'transparent', color: '#FF3B30', border: '1px solid #FF3B30', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Cancelar</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 2: RELATÓRIOS FINANCEIROS */}
        {adminTab === 'relatorios' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', margin: 0 }}>Relatório Financeiro</h3>
              
              {/* O VAR ATUOU AQUI: Seletor de Filtro por Pagamento */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>Filtrar por:</span>
                <select 
                  value={filtroPagamento} 
                  onChange={(e) => setFiltroPagamento(e.target.value)}
                  style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--gold)', backgroundColor: '#1A1A1A', color: 'var(--gold)', fontSize: '1rem', outline: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  <option value="Todos">Todos os Métodos</option>
                  <option value="Pix">Pix</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Débito">Débito</option>
                  <option value="Crédito">Crédito</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <div style={{ flex: '1 1 250px', backgroundColor: '#1A1A1A', padding: '30px', borderRadius: '16px', border: '1px solid #333', textAlign: 'center' }}>
                <p style={{ color: '#888', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Cortes Finalizados ({filtroPagamento})</p>
                <h4 style={{ color: '#fff', margin: 0, fontSize: '4rem', fontWeight: '300' }}>{agendamentosFiltrados.length}</h4>
              </div>
              <div style={{ flex: '1 1 250px', backgroundColor: 'rgba(218, 165, 32, 0.1)', padding: '30px', borderRadius: '16px', border: '1px solid var(--gold)', textAlign: 'center' }}>
                <p style={{ color: 'var(--gold)', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Faturamento ({filtroPagamento})</p>
                <h4 style={{ color: 'var(--gold)', margin: 0, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold' }}>R$ {faturamentoTotal.toFixed(2).replace('.', ',')}</h4>
              </div>
            </div>

            <div style={{ backgroundColor: '#1A1A1A', borderRadius: '16px', overflowX: 'auto', border: '1px solid #333' }}>
              <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', color: '#fff', textAlign: 'left', fontSize: '1rem' }}>
                <thead style={{ backgroundColor: '#222', color: 'var(--gold)' }}>
                  <tr>
                    <th style={{ padding: '20px' }}>Data</th><th style={{ padding: '20px' }}>Cliente</th><th style={{ padding: '20px' }}>Profissional</th><th style={{ padding: '20px' }}>Serviços</th><th style={{ padding: '20px' }}>Método</th><th style={{ padding: '20px', textAlign: 'right' }}>Valor Recebido</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentosFiltrados.length === 0 ? (
                    <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>Nenhum pagamento registrado para este filtro.</td></tr>
                  ) : (
                    agendamentosFiltrados.map((ag) => (
                      <tr key={ag.id} style={{ borderBottom: '1px solid #333' }}>
                        <td style={{ padding: '20px' }}>{ag.data.split('-').reverse().join('/')}</td>
                        <td style={{ padding: '20px' }}>{ag.nome}</td>
                        <td style={{ padding: '20px', fontWeight: 'bold' }}>{ag.barbeiro}</td>
                        <td style={{ padding: '20px', color: '#ccc' }}>{ag.servicosDescricao}</td>
                        <td style={{ padding: '20px' }}><span style={{ backgroundColor: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>{ag.pagamento}</span></td>
                        <td style={{ padding: '20px', textAlign: 'right', fontWeight: 'bold', color: '#25D366' }}>R$ {ag.preco.toFixed(2).replace('.', ',')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}