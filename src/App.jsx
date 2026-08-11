import { useState } from 'react';
import Site from './components/Site';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [view, setView] = useState('site'); 
  
  const [horariosOcupados, setHorariosOcupados] = useState({});
  const [agendamentos, setAgendamentos] = useState([]); 

  const handleAgendar = (novoAgendamento) => {
    const chaveAgenda = `${novoAgendamento.data}_${novoAgendamento.barbeiro}`;
    
    setHorariosOcupados(prev => ({
      ...prev,
      [chaveAgenda]: [...(prev[chaveAgenda] || []), novoAgendamento.hora]
    }));
    setAgendamentos([...agendamentos, novoAgendamento]);
  };

  // O VAR ATUOU AQUI: Agora a função recebe o método de pagamento
  const handleConfirmar = (id, metodoPagamento) => {
    setAgendamentos(prev => prev.map(ag => 
      ag.id === id ? { ...ag, status: 'confirmado', pagamento: metodoPagamento } : ag
    ));
  };

  const handleCancelar = (id) => {
    const agendamentoCancelado = agendamentos.find(ag => ag.id === id);
    if(!agendamentoCancelado) return;

    const confirmacao = window.confirm(`Deseja realmente cancelar o corte de ${agendamentoCancelado.nome}? O horário voltará a ficar disponível.`);
    if(!confirmacao) return;

    const chaveAgenda = `${agendamentoCancelado.data}_${agendamentoCancelado.barbeiro}`;
    
    setHorariosOcupados(prev => {
      const horasDoDiaEProfissional = prev[chaveAgenda] || [];
      return { ...prev, [chaveAgenda]: horasDoDiaEProfissional.filter(h => h !== agendamentoCancelado.hora) };
    });
    setAgendamentos(prev => prev.filter(ag => ag.id !== id));
  };

  if (view === 'login') return <Login setView={setView} />;
  
  // Passando o handleConfirmar atualizado para o Dashboard
  if (view === 'admin') return <Dashboard agendamentos={agendamentos} handleConfirmar={handleConfirmar} handleCancelar={handleCancelar} setView={setView} />;

  return <Site setView={setView} horariosOcupados={horariosOcupados} handleAgendar={handleAgendar} />;
}