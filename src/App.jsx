import { useState } from 'react';
import Site from './components/Site';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  // A CHAVE DA JOGADA: O jogo TEM que começar no 'site'. 
  // Se estiver 'login', ele abre a tela restrita logo de cara!
  const [view, setView] = useState('site'); 
  
  // O "Banco de Dados" temporário do React
  const [horariosOcupados, setHorariosOcupados] = useState({});
  const [agendamentos, setAgendamentos] = useState([]); 

  // Quando o cliente agenda no Site.jsx, os dados chegam aqui:
  const handleAgendar = (novoAgendamento) => {
    setHorariosOcupados(prev => ({
      ...prev,
      [novoAgendamento.data]: [...(prev[novoAgendamento.data] || []), novoAgendamento.hora]
    }));
    setAgendamentos([...agendamentos, novoAgendamento]);
  };

  // Funções do Dashboard
  const handleConfirmar = (id) => {
    setAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, status: 'confirmado' } : ag));
  };

  const handleCancelar = (id) => {
    const agendamentoCancelado = agendamentos.find(ag => ag.id === id);
    if(!agendamentoCancelado) return;

    const confirmacao = window.confirm(`Deseja realmente cancelar o corte de ${agendamentoCancelado.nome}? O horário voltará a ficar disponível.`);
    if(!confirmacao) return;

    setHorariosOcupados(prev => {
      const horasDoDia = prev[agendamentoCancelado.data] || [];
      return { ...prev, [agendamentoCancelado.data]: horasDoDia.filter(h => h !== agendamentoCancelado.hora) };
    });
    setAgendamentos(prev => prev.filter(ag => ag.id !== id));
  };

  // Esquema Tático: Qual tela renderizar?
  if (view === 'login') {
    return <Login setView={setView} />;
  }

  if (view === 'admin') {
    return <Dashboard 
      agendamentos={agendamentos} 
      handleConfirmar={handleConfirmar} 
      handleCancelar={handleCancelar} 
      setView={setView} 
    />;
  }

  // Se não for nem login nem admin, renderiza o SITE principal
  return <Site 
    setView={setView} 
    horariosOcupados={horariosOcupados} 
    handleAgendar={handleAgendar} 
  />;
}