![Banner](https://capsule-render.vercel.app/api?type=waving&color=0:7b1fa2,100:e040fb&height=200&section=header&text=API%20Conecta%20Ajuda&fontSize=40&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Uma%20API%20inspirada%20no%20cenário%20atual%20de%20enchentes!&descAlignY=55&descSize=16)

# 🌊 Conecta Ajuda: Gestão Inteligente de Doações

Este projeto foi desenvolvido como parte do Desafio Técnico Final focado em desastres naturais. A ideia surgiu a partir da observação das enchentes recorrentes no Brasil, onde a solidariedade é imensa, mas a logística muitas vezes falha. Pensando nesse cenário, decidi focar no problema da descentralização e desequilíbrio de suprimentos, criando uma ponte digital direta entre quem quer doar e quem realmente precisa receber.
---

## 🛠️ Tecnologias Utilizadas

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-47A248?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)
![Bcrypt](https://img.shields.io/badge/Bcrypt-003A8F?style=for-the-badge)
![Cors](https://img.shields.io/badge/CORS-FFCA28?style=for-the-badge)

---

## 🧩 Arquitetura e Conceitos Aplicados

- 🔐 **Autenticação baseada em JWT (JSON Web Token)**
- 🔑 Uso de variáveis de ambiente para segurança (`JWT_SECRET`)
- 🔒 Hash de senhas com **bcrypt**
- 🧱 Estrutura RESTful
- 🗄️ Integração com banco de dados relacional (**PostgreSQL**)
- 🛡️ Middleware de autenticação para proteção de rotas
- 🔄 Tratamento de erros e respostas padronizadas

---

## ⚙️ Funcionalidades Principais

👤 Gestão de Usuários e Acesso
Níveis de Acesso: Diferenciação clara entre ADMIN (gestores de centros) e DOADORES.

Segurança: Senhas protegidas com bcrypt e sessões gerenciadas via tokens JWT.

Vínculo Logístico: Administradores são vinculados a Centros de Distribuição (CD) específicos via centro_id.

📦 Dashboard de Necessidades
Cálculo de Prioridade Automático: Algoritmo que prioriza itens com base na diferença entre a quantidade atual e o objetivo.

Métricas de Progresso: Cálculo em tempo real da porcentagem de conclusão de cada necessidade.

Agrupamento Inteligente: Uso de STRING_AGG para listar todos os responsáveis por um centro em uma única consulta, otimizando a performance.

🤝 Fluxo de Doação "Xeque-Mate"
Intenção de Doação: Doadores registram o que pretendem levar, gerando um status PENDENTE.

Itens Fora da Lista: Flexibilidade para doar itens que ainda não foram mapeados (ex: Cobertores), permitindo que a logística se adapte à solidariedade.

Confirmação de Recebimento: O estoque só é atualizado quando o ADMIN confirma a chegada física do item, mudando o status para ENTREGUE.

Integridade de Dados: Bloqueio de remoção de itens que possuem histórico de doações vinculadas, garantindo auditoria.

📊 Painel de Impacto Público
Estatísticas Globais: Rota pública que expõe o total de itens arrecadados e o número de causas concluídas.

Transparência: Exibição clara de quem está gerenciando cada necessidade no local.

---- 

## 🚀 Como consumir a API

**Base URL:**
https://conecta-ajuda-backend.onrender.com/

---

## 📚 Documentação da API

**🔗 [Acessar documentação completa no Postman](https://documenter.getpostman.com/view/19569624/2sBXqGrMUn/)**

---


<br>

## **👨‍💻 Autor**

Projeto desenvolvido para prática de **CRUD com API REST**.

<table>
<tr>
  <td align="center">
    <img src="https://avatars.githubusercontent.com/u/87991807?v=4" width="80" />
  </td>
  <td>
    **RafaRaizer-Dev** <br>
    <a href="https://api.whatsapp.com/send/?phone=47999327137">📱 WhatsApp</a> | 
    <a href="https://www.linkedin.com/in/raizer-rafael/">💼 LinkedIn</a> | 
    <a href="https://github.com/RaizerTechDev">🐱 GitHub</a> | 
    <a href="https://raizertechdev-portfolio.netlify.app/">🌐 Portfólio</a>