import { useState, useEffect, useRef } from 'react';
import '../index.css';

const FadeIn = ({ children, style, delay = '0s' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.1 }); 
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={domRef} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(50px)', transition: `opacity 0.8s ease-out ${delay}, transform 0.8s ease-out ${delay}`, ...style }}>
      {children}
    </div>
  );
};

export default function Site({ setView, horariosOcupados, handleAgendar }) {
  const [activePage, setActivePage] = useState('inicio');
  const [formulario, setFormulario] = useState({ nome: '', telefone: '', corte: '', data: '', hora: '' });

  const horariosBase = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
  const cortesDisponiveis = [
    { id: 'Degradê', nome: 'Degradê', preco: 'R$ 40,00', valorReal: 40, desc: 'Corte moderno com transição perfeita.' },
    { id: 'Social', nome: 'Social Clássico', preco: 'R$ 35,00', valorReal: 35, desc: 'O tradicional que nunca sai de moda.' },
    { id: 'Barba', nome: 'Barba Completa', preco: 'R$ 25,00', valorReal: 25, desc: 'Alinhamento, toalha quente e navalha.' },
    { id: 'Combo', nome: 'Combo: Cabelo + Barba', preco: 'R$ 60,00', valorReal: 60, desc: 'O pacote completo para o seu visual.' }
  ];

  const horariosDisponiveis = formulario.data ? horariosBase.filter(hora => !(horariosOcupados[formulario.data] || []).includes(hora)) : [];

  const handleChange = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });
  const selecionarCorte = (idCorte) => setFormulario({ ...formulario, corte: idCorte });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formulario.corte) return alert("Falta o último passo! Escolha um tipo de corte.");

    const corteEscolhido = cortesDisponiveis.find(c => c.id === formulario.corte);
    
    handleAgendar({
      ...formulario,
      preco: corteEscolhido.valorReal,
      id: Date.now(),
      status: 'pendente'
    });

    const dataFormatada = formulario.data.split('-').reverse().join('/');
    
    // O VAR ATUOU AQUI: Novo número e nova mensagem configurados!
    const telefoneBarbearia = "553291440052"; 
    const mensagem = `Confirmo o agendamento com o Barber shop Batatabowl dia ${dataFormatada} às ${formulario.hora}!`;
    
    window.open(`https://wa.me/${telefoneBarbearia}?text=${encodeURIComponent(mensagem)}`, '_blank');

    setFormulario({ nome: '', telefone: '', corte: '', data: '', hora: '' });
  };

  const scrollToSection = (id) => {
    setActivePage(id); 
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const inputStyle = { width: '100%', padding: '18px', marginBottom: '30px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1A1A1A', color: 'var(--text-light)', fontSize: '1.2rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      
      <header style={{ 
        backgroundImage: `url('/Cabecalho.png')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#0A0A0A', 
        padding: '30px 20px 20px', 
        textAlign: 'center', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000 
      }}>
        
        <div style={{ position: 'absolute', top: '20px', right: '30px' }}>
          <button onClick={() => setView('login')} style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid #444', color: '#ccc', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>⚙️ Área Restrita</button>
        </div>

        <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button onClick={() => scrollToSection('inicio')} style={{ background: 'transparent', border: 'none', color: activePage === 'inicio' ? 'var(--gold)' : '#fff', borderBottom: activePage === 'inicio' ? '3px solid var(--gold)' : '3px solid transparent', padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Início</button>
          <button onClick={() => scrollToSection('agendamento')} style={{ background: 'transparent', border: 'none', color: activePage === 'agendamento' ? 'var(--gold)' : '#fff', borderBottom: activePage === 'agendamento' ? '3px solid var(--gold)' : '3px solid transparent', padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Agendar Horário</button>
          <button onClick={() => scrollToSection('sobre-localizacao')} style={{ background: 'transparent', border: 'none', color: activePage === 'sobre-localizacao' ? 'var(--gold)' : '#fff', borderBottom: activePage === 'sobre-localizacao' ? '3px solid var(--gold)' : '3px solid transparent', padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Sobre & Localização</button>
        </nav>
      </header>

      <section id="inicio" style={{ backgroundImage: `linear-gradient(to bottom, transparent 0%, transparent 70%, #121212 100%), url('/Banner.png')`, backgroundColor: '#000', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', textAlign: 'center', paddingBottom: '25vh' }}>
        <FadeIn style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: '2.8rem', color: '#fff', marginBottom: '20px', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Onde a tradição encontra o <strong style={{ color: 'var(--gold)' }}>seu melhor estilo.</strong></h2>
          <button onClick={() => scrollToSection('agendamento')} style={{ padding: '20px 50px', backgroundColor: 'var(--gold)', color: '#000', border: 'none', borderRadius: '8px', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(218, 165, 32, 0.3)' }}>Agendar Meu Horário</button>
        </FadeIn>
      </section>

      <main style={{ padding: '0 5%', maxWidth: '1600px', margin: '0 auto', width: '100%', flexGrow: 1 }}>
        <section id="agendamento" style={{ width: '100%', paddingTop: '60px', paddingBottom: '80px', scrollMarginTop: '140px' }}>
          <FadeIn><h2 style={{ color: 'var(--gold)', fontSize: '2.5rem', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '50px' }}>Agende seu Horário</h2></FadeIn>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '100px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <FadeIn style={{ flex: '1 1 500px' }} delay="0s">
              <h3 style={{ color: '#fff', marginBottom: '30px', fontSize: '1.5rem' }}>Seus Dados</h3>
              <input type="text" name="nome" value={formulario.nome} onChange={handleChange} required style={inputStyle} placeholder="Nome Completo" />
              <input type="tel" name="telefone" value={formulario.telefone} onChange={handleChange} required style={inputStyle} placeholder="WhatsApp" />
              <div style={{ display: 'flex', gap: '30px' }}>
                <input type="date" name="data" value={formulario.data} onChange={handleChange} required style={{...inputStyle, flex: 1}} />
                <select name="hora" value={formulario.hora} onChange={handleChange} required style={{...inputStyle, flex: 1}} disabled={!formulario.data}>
                  <option value="" disabled>Horário</option>
                  {horariosDisponiveis.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </FadeIn>
            <FadeIn style={{ flex: '1 1 500px' }} delay="0.2s">
              <h3 style={{ color: '#fff', marginBottom: '30px', fontSize: '1.5rem' }}>Serviço</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {cortesDisponiveis.map((c) => (
                  <div key={c.id} onClick={() => selecionarCorte(c.id)} style={{ padding: '30px 25px', borderRadius: '10px', cursor: 'pointer', backgroundColor: formulario.corte === c.id ? 'rgba(218, 165, 32, 0.15)' : '#1A1A1A', border: formulario.corte === c.id ? '2px solid var(--gold)' : '2px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><h4 style={{ margin: '0 0 8px 0', color: formulario.corte === c.id ? 'var(--gold)' : '#fff', fontSize: '1.4rem' }}>{c.nome}</h4><p style={{ margin: 0, color: '#aaa' }}>{c.desc}</p></div>
                    <span style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.5rem' }}>{c.preco}</span>
                  </div>
                ))}
              </div>
              <button type="submit" style={{ width: '100%', padding: '25px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.4rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '40px' }}>Confirmar no WhatsApp</button>
            </FadeIn>
          </form>
        </section>

        <div id="sobre-localizacao" style={{ display: 'flex', gap: '80px', flexWrap: 'wrap', marginTop: '60px', paddingTop: '100px', paddingBottom: '150px', alignItems: 'stretch', borderTop: '1px solid #222', scrollMarginTop: '140px' }}>
          <FadeIn style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column' }} delay="0s">
            <h2 style={{ color: 'var(--gold)', borderBottom: '2px solid #333', paddingBottom: '15px', fontSize: '2.5rem', marginBottom: '30px' }}>Sobre a Batatabowl</h2>
            <div style={{ backgroundColor: '#1A1A1A', padding: '40px', borderRadius: '16px', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <p style={{ lineHeight: '1.8', fontSize: '1.3rem', color: '#ccc', margin: 0 }}>Tradição, estilo e um ambiente exclusivo. Nossa barbearia foi pensada para entregar o melhor corte e a melhor experiência para você.</p>
            </div>
          </FadeIn>
          <FadeIn style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column' }} delay="0.2s">
            <h2 style={{ color: 'var(--gold)', borderBottom: '2px solid #333', paddingBottom: '15px', fontSize: '2.5rem', marginBottom: '30px' }}>Onde Estamos</h2>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '20px' }}>R. Sargento Cunha, 15 - Bandeirantes, Juiz de Fora - MG</p>
            <div style={{ flexGrow: 1, minHeight: '350px', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3705.513476405781!2d-43.34112108443834!3d-21.7603387856066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x989b604e4e976b%3A0xc3b83842183e8fa2!2sR.%20Sargento%20Cunha%2C%2015%20-%20Bandeirantes%2C%20Juiz%20de%20Fora%20-%20MG%2C%2036047-010!5e0!3m2!1spt-BR!2sbr!4v1680000000000!5m2!1spt-BR!2sbr" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}