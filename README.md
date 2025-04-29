# 🕒 Sistema de Ponto Eletrônico

Este é um sistema de ponto eletrônico desenvolvido com React e Firebase, com o objetivo de facilitar o controle de jornada dos funcionários e oferecer uma interface moderna tanto para colaboradores quanto para administradores.

## 🎯 Objetivo do Projeto

Criar uma aplicação web onde:
- Funcionários possam bater ponto (entrada, almoço, café e saída), acompanhar o tempo trabalhado e gerar relatórios.
- Administradores possam cadastrar usuários, visualizar registros e exportar dados em PDF.

## 🚀 Tecnologias Utilizadas

- **React** com Vite
- **Tailwind CSS** para estilização
- **Firebase (Firestore + Auth)** para autenticação e banco de dados
- **React Icons**
- **React Router DOM**
- **React Toastify** para notificações
- **html2pdf.js** para geração de relatórios em PDF

## ✅ Funcionalidades já implementadas

- [x] Tela de login com autenticação pelo Firebase
- [x] Diferenciação de usuários por cargo (funcionário/admin)
- [x] Dashboard para funcionário com:
  - Registro de ponto (Entrada, Almoço, Café e Saída)
  - Card de "Próxima Ação" com contagem regressiva
  - Card de "Tempo Trabalhado" em tempo real
- [x] Dashboard administrativo com:
  - Cadastro de novos usuários
  - Listagem de usuários
- [x] Tela de relatórios com filtros por data
- [x] Geração de relatório em PDF com botões diários e mensais
- [x] Layout responsivo e moderno

## 🔧 Em desenvolvimento

- [ ] Melhorias na lógica da "Próxima Ação" (baseada no último ponto registrado)
- [ ] Otimização da lógica do tempo trabalhado
- [ ] Filtro de relatório por nome do funcionário (modo admin)
- [ ] Validação de e-mail antes de envio de redefinição de senha
- [ ] Integração com WhatsApp via Z-API para envio de lembretes automáticos

## ▶️ Como rodar o projeto localmente

1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/nome-do-repo.git
