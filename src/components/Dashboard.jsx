import { useState } from 'react';
import '../index.css';

export default function Dashboard({ agendamentos, handleConfirmar, handleCancelar, setView }) {
  const [adminTab, setAdminTab] = useState('agenda'); 
  const faturamentoTotal = agendamentos.reduce((acc, ag) => acc + ag.preco, 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#000', borderBottom: '2px solid var(--gold)', padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--gold)', fontSize: '2rem' }}>Painel de Controle | Batatabowl</h2>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => setAdminTab('agenda')} style={{ background: adminTab === 'agenda' ? 'var(--gold)' : 'transparent', color: adminTab === 'agenda' ? '#000' : 'var(--gold)', border: '2px solid var(--gold)', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>Agenda</button>
          <button onClick={() => setAdminTab('relatorios')} style={{ background: adminTab === 'relatorios' ? 'var(--gold)' : 'transparent', color: adminTab === 'relatorios' ? '#000' : 'var(--gold)', border: '2px solid var(--gold)', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>Relatórios</button>
          <button onClick={() => setView('site')} style={{ background: '#333', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem' }}>Sair</button>
        </nav>
      </header>

      <main style={{ padding: '60px 5%', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        {adminTab === 'agenda' && (
          <div>
            <h3 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '30px' }}>Próximos Cortes</h3>
            <div style={{ backgroundColor: '#1A1A1A', borderRadius: '16px', overflow: 'hidden', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left', fontSize: '1.2rem' }}>
                <thead style={{ backgroundColor: '#222', color: 'var(--gold)' }}>
                  <tr>
                    <th style={{ padding: '30px' }}>Data</th><th style={{ padding: '30px' }}>Hora</th><th style={{ padding: '30px' }}>Cliente</th><th style={{ padding: '30px' }}>Telefone</th><th style={{ padding: '30px' }}>Serviço</th><th style={{ padding: '30px', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentos.length === 0 ? (
                    <tr><td colSpan="6" style={{ padding: '50px', textAlign: 'center', color: '#888', fontSize: '1.5rem' }}>Nenhum agendamento ainda.</td></tr>
                  ) : (
                    agendamentos.map((ag) => (
                      <tr key={ag.id} style={{ borderBottom: '1px solid #333', backgroundColor: ag.status === 'confirmado' ? 'rgba(37, 211, 102, 0.05)' : 'transparent' }}>
                        <td style={{ padding: '30px' }}>{ag.data.split('-').reverse().join('/')}</td>
                        <td style={{ padding: '30px', fontWeight: 'bold', color: 'var(--gold)' }}>{ag.hora}</td>
                        <td style={{ padding: '30px' }}>{ag.nome}</td><td style={{ padding: '30px' }}>{ag.telefone}</td><td style={{ padding: '30px' }}>{ag.corte}</td>
                        <td style={{ padding: '30px', textAlign: 'center' }}>
                          {ag.status === 'pendente' ? (
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                              <button onClick={() => handleConfirmar(ag.id)} title="Confirmar Presença" style={{ background: '#25D366', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</button>
                              <button onClick={() => handleCancelar(ag.id)} title="Cancelar Corte" style={{ background: '#FF3B30', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>X</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: '#25D366', fontWeight: 'bold', fontSize: '1rem' }}>✅ Confirmado</span>
                              <button onClick={() => handleCancelar(ag.id)} style={{ background: 'transparent', color: '#FF3B30', border: '1px solid #FF3B30', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>Cancelar</button>
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

        {adminTab === 'relatorios' && (
          <div>
            <h3 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '30px' }}>Relatório Financeiro</h3>
            <div style={{ display: 'flex', gap: '40px', marginBottom: '60px' }}>
              <div style={{ flex: 1, backgroundColor: '#1A1A1A', padding: '50px', borderRadius: '16px', border: '1px solid #333', textAlign: 'center' }}>
                <p style={{ color: '#888', margin: '0 0 15px 0', fontSize: '1.5rem' }}>Total de Clientes</p>
                <h4 style={{ color: '#fff', margin: 0, fontSize: '5rem', fontWeight: '300' }}>{agendamentos.length}</h4>
              </div>
              <div style={{ flex: 1, backgroundColor: 'rgba(218, 165, 32, 0.1)', padding: '50px', borderRadius: '16px', border: '1px solid var(--gold)', textAlign: 'center' }}>
                <p style={{ color: 'var(--gold)', margin: '0 0 15px 0', fontSize: '1.5rem' }}>Faturamento Estimado</p>
                <h4 style={{ color: 'var(--gold)', margin: 0, fontSize: '5rem', fontWeight: 'bold' }}>R$ {faturamentoTotal.toFixed(2).replace('.', ',')}</h4>
              </div>
            </div>
            <div style={{ backgroundColor: '#1A1A1A', borderRadius: '16px', overflow: 'hidden', border: '1px solid #333' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left', fontSize: '1.2rem' }}>
                <thead style={{ backgroundColor: '#222', color: 'var(--gold)' }}>
                  <tr><th style={{ padding: '30px' }}>Cliente</th><th style={{ padding: '30px' }}>Serviço</th><th style={{ padding: '30px' }}>Data</th><th style={{ padding: '30px', textAlign: 'right' }}>Valor</th></tr>
                </thead>
                <tbody>
                  {agendamentos.map((ag) => (
                    <tr key={ag.id} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '30px' }}>{ag.nome}</td><td style={{ padding: '30px' }}>{ag.corte}</td><td style={{ padding: '30px' }}>{ag.data.split('-').reverse().join('/')}</td>
                      <td style={{ padding: '30px', textAlign: 'right', fontWeight: 'bold', color: '#25D366' }}>R$ {ag.preco.toFixed(2).replace('.', ',')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}