import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../style.css";

export default function BoasVindas() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div>
      {/* HEADER */}
      <header className="header">
        <div className="logo">LOGO</div>

        <nav className="nav">
          <a href="#inicio">🏠 Início</a>
          <a href="#sobre">Sobre o Toolhub</a>
          <a href="#ajuda">Ajuda</a>
        </nav>

        <div className="right">
          <button className="theme-btn" onClick={() => setDark(!dark)}>
            {dark ? "🌙" : "☀️"}
          </button>

          <Link to="/login" className="btn-header">
            Acessar Site
          </Link>
        </div>
      </header>

      {/* HERO */}
      <main className="main">
        <section className="hero" id="inicio">
          <h1 className="title">ToolHub</h1>
          <h2 className="subtitle">
            Sistema de Gerenciamento de Ferramentas
          </h2>

          <div className="mock-box">
            <p>Espaço reservado para o vídeo/pitch do projeto</p>
          </div>

          <p className="description">
            Todas as informações que você precisa em um só lugar.
          </p>
        </section>

        {/* SOBRE */}
        <section className="sobre" id="sobre">
          <h2>Sobre o ToolHub</h2>

          <p>
            O ToolHub surgiu com o objetivo de centralizar e facilitar o
            gerenciamento de ferramentas dentro de empresas e equipes. A ideia
            nasceu da dificuldade comum em controlar empréstimos, localização e
            disponibilidade de equipamentos no dia a dia.
          </p>

          <p>
            Com uma abordagem simples e eficiente, o sistema permite organizar,
            monitorar e otimizar o uso de recursos, trazendo mais controle,
            produtividade e redução de perdas.
          </p>

          <p>
            Este projeto foi desenvolvido como parte de um Trabalho de Conclusão
            de Curso (TCC), com foco em resolver problemas reais utilizando
            tecnologia moderna e acessível.
          </p>
        </section>

        {/* AJUDA */}
        <section className="ajuda" id="ajuda">
          <h2>Ajuda</h2>

          <div className="faq">
            <h4>Como acessar o sistema?</h4>
            <p>
              Clique em "Acessar Site" no canto superior direito e faça login
              com suas credenciais.
            </p>

            <h4>Esqueci minha senha, o que faço?</h4>
            <p>
              Utilize a opção "Esqueceu a senha?" na tela de login.
            </p>

            <h4>O sistema funciona em celular?</h4>
            <p>
              Sim! O ToolHub possui versão web e pode ser adaptado para mobile.
            </p>
          </div>

          <div className="contato">
            <h4>Contato</h4>
            <p>Email: contato@toolhub.com</p>
            <p>Telefone: (11) 99999-9999</p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        © 2026 ToolHub. Todos os direitos reservados
      </footer>
    </div>
  );
}