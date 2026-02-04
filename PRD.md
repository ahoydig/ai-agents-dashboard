# PRD - AI Agents Dashboard

## Product Requirements Document

**Versão**: 1.0
**Data**: 2026-02-03
**Autor**: Flávio Montenegro / Ahoy Digital
**Status**: Draft

---

## 1. Visão do Produto

### 1.1 Problema

Agentes de IA conversacionais (WhatsApp, chat, etc.) são difíceis de debugar e monitorar:
- Não há visibilidade do que o agente "pensou" antes de responder
- Erros são difíceis de reproduzir (contexto se perde)
- Custos de LLM são opacos
- Não há forma de comparar comportamento antes/depois de mudanças
- Escalar para múltiplos agentes multiplica esses problemas

### 1.2 Solução

**AI Agents Dashboard** - Plataforma centralizada de observabilidade para agentes de IA que permite:
- Visualizar cada interação com contexto completo
- Reproduzir (replay) qualquer turn para debugging
- Monitorar custos e performance em tempo real
- Gerenciar múltiplos agentes de uma única interface

### 1.3 Proposta de Valor

| Para | Que | O Dashboard |
|------|-----|-------------|
| Desenvolvedores de agentes | Precisam debugar comportamentos inesperados | Oferece replay exato com todo o contexto |
| Gestores de produto | Querem entender custos e performance | Fornece métricas e alertas em tempo real |
| Equipes de suporte | Precisam investigar reclamações | Permite buscar e visualizar conversas completas |

---

## 2. Personas

### 2.1 Dev (Desenvolvedor de Agentes)
- **Objetivo**: Debugar e melhorar o agente
- **Dores**: Não consegue reproduzir bugs, não sabe por que o agente respondeu X
- **Necessidades**: Ver tool calls, context, system prompt de cada turn

### 2.2 PM (Product Manager)
- **Objetivo**: Acompanhar métricas e custos
- **Dores**: Não sabe quanto está gastando, não tem visão de tendências
- **Necessidades**: Dashboard com KPIs, alertas, relatórios

### 2.3 Ops (Suporte/Operações)
- **Objetivo**: Resolver problemas de clientes
- **Dores**: Cliente reclama mas não consegue ver o que aconteceu
- **Necessidades**: Busca por telefone, timeline de conversa

### 2.4 Admin (Gestor da Plataforma)
- **Objetivo**: Gerenciar múltiplos agentes
- **Dores**: Cada agente é uma caixa preta separada
- **Necessidades**: Visão consolidada, onboarding de novos agentes

---

## 3. User Stories

### Epic 1: Visualização de Sessões

| ID | História | Prioridade |
|----|----------|------------|
| US-01 | Como Dev, quero buscar sessões por telefone para investigar um problema reportado | P0 |
| US-02 | Como Ops, quero ver a timeline completa de uma sessão para entender o contexto | P0 |
| US-03 | Como Dev, quero ver os detalhes de um turn específico (tool calls, context) | P0 |
| US-04 | Como PM, quero filtrar sessões por data e status para análise | P1 |
| US-05 | Como Dev, quero ver o system prompt usado em cada turn | P1 |

### Epic 2: Session Replay

| ID | História | Prioridade |
|----|----------|------------|
| US-10 | Como Dev, quero re-executar um turn com os mesmos inputs para reproduzir bug | P0 |
| US-11 | Como Dev, quero comparar resposta original vs replay para validar fix | P0 |
| US-12 | Como Dev, quero fazer replay de uma sessão inteira para teste de regressão | P1 |
| US-13 | Como Dev, quero modificar o system prompt e re-executar para testar mudanças | P2 |

### Epic 3: Analytics

| ID | História | Prioridade |
|----|----------|------------|
| US-20 | Como PM, quero ver métricas de turns/sessões por período | P0 |
| US-21 | Como PM, quero ver custo total de LLM por agente/período | P0 |
| US-22 | Como Dev, quero ver latência média e percentis (p50, p90, p99) | P1 |
| US-23 | Como PM, quero receber alertas quando custos ou erros saírem do normal | P2 |
| US-24 | Como PM, quero exportar dados para análise externa | P2 |

### Epic 4: Multi-Agente

| ID | História | Prioridade |
|----|----------|------------|
| US-30 | Como Admin, quero ver lista de todos os agentes configurados | P0 |
| US-31 | Como Admin, quero filtrar dados por agente específico | P0 |
| US-32 | Como Admin, quero adicionar novo agente à plataforma | P1 |
| US-33 | Como Admin, quero comparar métricas entre agentes | P2 |

### Epic 5: Configurações

| ID | História | Prioridade |
|----|----------|------------|
| US-40 | Como Admin, quero configurar alertas de erro/custo | P2 |
| US-41 | Como Admin, quero gerenciar usuários e permissões | P3 |
| US-42 | Como Dev, quero configurar webhooks para eventos | P3 |

---

## 4. Requisitos Funcionais

### 4.1 Dashboard Home (RF-01)
- Exibir cards com métricas: Total turns (24h), Sessões ativas, Latência média, Custo total
- Gráfico de linha: Turns por hora (últimas 24h)
- Gráfico de pizza: Distribuição por agente
- Gráfico de área: Custo acumulado por dia (últimos 7 dias)
- Lista: Últimos erros (5 mais recentes)

### 4.2 Busca de Sessões (RF-02)
- Campo de busca por telefone (formato: 5581999999999)
- Filtros: Data (de/até), Status (success/error/blocked), Agente
- Tabela de resultados: ID, Telefone, Início, Duração, Turns, Status
- Paginação (20 por página)
- Click para abrir detalhe da sessão

### 4.3 Timeline de Sessão (RF-03)
- Header: ID, Telefone, Data início/fim, Total turns, Tokens, Custo
- Timeline vertical intercalando:
  - Mensagens inbound (usuário) - alinhadas à esquerda
  - Mensagens outbound (agente) - alinhadas à direita
  - Markers de eventos (escalonamento, erro, etc.)
- Cada mensagem mostra: Timestamp, Conteúdo, Agent type (se outbound)
- Click em mensagem outbound abre detalhe do turn

### 4.4 Detalhe de Turn (RF-04)
- Header: ID, Timestamp, Agent type, Model, Status
- Seção "Input": User message
- Seção "Output": Assistant response, Final response (pós-guardrail)
- Seção "Tool Calls": Lista colapsável com nome, args, result, latency
- Seção "Context Snapshots": Patient context, CRM context (JSON collapsible)
- Seção "Métricas": Tokens (in/out), Custo, Latency breakdown
- Seção "Guardrails": Input safe/reason, Output safe/reason/sanitized
- Seção "Message Chain": Sequência completa de mensagens do modelo
- Botão "Replay this turn"

### 4.5 Session Replay (RF-05)
- Carregar payload de replay do turn original
- Exibir lado a lado: Original | Replay
- Botão "Execute Replay" - chama API do agente com payload
- Após execução, exibir:
  - Resposta do replay
  - Diff visual (texto verde/vermelho)
  - Comparação de métricas (tokens, latency)
- Opção de editar system prompt antes do replay

### 4.6 Lista de Agentes (RF-06)
- Cards por agente: Nome, Descrição, Status (active/paused), Turns (24h)
- Click para filtrar dashboard por agente
- Botão "Adicionar Agente" abre modal com instruções de integração

### 4.7 Configurações (RF-07)
- Conexão Supabase (URL, Anon Key)
- Alertas: Thresholds de erro, custo, latência
- Notificações: Email, Webhook URL
- Tema: Light/Dark mode

---

## 5. Requisitos Não-Funcionais

### 5.1 Performance
- Dashboard home carrega em < 2s
- Busca de sessões retorna em < 1s
- Timeline de sessão carrega em < 1s
- Replay executa em < tempo do turn original + 20%

### 5.2 Escalabilidade
- Suportar até 100K turns/dia por agente
- Suportar até 50 agentes simultâneos
- Queries com paginação para evitar timeout

### 5.3 Segurança
- Autenticação via Supabase Auth (futuro)
- Dados sensíveis (CPF, etc.) mascarados na UI
- HTTPS obrigatório
- Rate limiting em endpoints de replay

### 5.4 Disponibilidade
- Uptime target: 99.5%
- Deploy via Vercel ou Docker (VPS)
- Zero downtime deploys

### 5.5 Usabilidade
- Design responsivo (desktop-first, mobile-friendly)
- Dark mode por padrão
- Navegação por teclado
- Loading states e skeleton loaders

---

## 6. Arquitetura

### 6.1 Stack Tecnológica

| Componente | Tecnologia | Justificativa |
|------------|------------|---------------|
| Framework | Next.js 14 (App Router) | SSR, API routes, performance |
| Linguagem | TypeScript | Type safety, DX |
| Estilo | Tailwind CSS + shadcn/ui | Rápido, consistente, acessível |
| Estado | TanStack Query | Cache, revalidation, optimistic updates |
| Database | Supabase (PostgreSQL) | Já usado pelos agentes, RLS |
| Gráficos | Recharts | React-native, customizável |
| Deploy | Vercel ou Docker/VPS | Flexibilidade |

### 6.2 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUÁRIOS                                 │
│                    (Dev, PM, Ops, Admin)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AI AGENTS DASHBOARD                          │
│                      (Next.js 14 + React)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Dashboard  │  │   Sessions  │  │   Replay Interface      │  │
│  │   (home)    │  │  (busca)    │  │   (comparação)          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
          │                                      │
          │ Leitura (Supabase Client)           │ Replay (HTTP)
          ▼                                      ▼
┌─────────────────────┐              ┌─────────────────────────────┐
│      SUPABASE       │              │     AGENTES DE IA           │
│    (PostgreSQL)     │              │  (CenterFisio, outros...)   │
│  ┌───────────────┐  │              │  ┌─────────────────────┐    │
│  │ agent_turns   │  │              │  │ /admin/replay       │    │
│  │ sessions      │  │              │  │ (endpoint de replay)│    │
│  │ message_logs  │  │              │  └─────────────────────┘    │
│  │ error_logs    │  │              └─────────────────────────────┘
│  └───────────────┘  │
└─────────────────────┘
```

### 6.3 Fluxo de Dados

1. **Leitura**: Dashboard → Supabase → Tabelas (agent_turns, sessions, etc.)
2. **Replay**: Dashboard → API Agente → Execução → Resposta → Dashboard
3. **Escrita**: Agentes → Supabase (logging acontece nos agentes, não no dashboard)

---

## 7. Roadmap

### Fase 1: MVP (Semanas 1-2)
**Objetivo**: Dashboard funcional com busca e visualização

| Semana | Entregáveis |
|--------|-------------|
| 1 | Setup completo, Dashboard home com métricas reais, Busca de sessões funcionando |
| 2 | Timeline de sessão, Detalhe de turn, Deploy inicial (Vercel ou VPS) |

**Critérios de Aceite**:
- [ ] Buscar sessão por telefone e ver timeline
- [ ] Clicar em turn e ver tool calls + context
- [ ] Métricas atualizando em tempo real

### Fase 2: Replay (Semanas 3-4)
**Objetivo**: Capacidade de reproduzir turns para debugging

| Semana | Entregáveis |
|--------|-------------|
| 3 | Interface de replay, Integração com API do agente |
| 4 | Diff visual, Edição de system prompt |

**Critérios de Aceite**:
- [ ] Executar replay de um turn e ver resposta
- [ ] Comparar original vs replay lado a lado
- [ ] Modificar system prompt e re-executar

### Fase 3: Multi-Agente (Semanas 5-6)
**Objetivo**: Suporte a múltiplos agentes

| Semana | Entregáveis |
|--------|-------------|
| 5 | Filtro por agente, Lista de agentes |
| 6 | Onboarding de novos agentes, Documentação de integração |

**Critérios de Aceite**:
- [ ] Filtrar dashboard por agente específico
- [ ] Ver instruções para integrar novo agente
- [ ] Novo agente aparece automaticamente após logging

### Fase 4: Analytics Avançado (Semanas 7-8)
**Objetivo**: Métricas profundas e alertas

| Semana | Entregáveis |
|--------|-------------|
| 7 | Gráficos de custo, Análise de latência (percentis) |
| 8 | Sistema de alertas, Export de dados |

**Critérios de Aceite**:
- [ ] Ver custo por agente/período em gráfico
- [ ] Receber alerta quando erro > threshold
- [ ] Exportar dados de sessões em CSV

---

## 8. Métricas de Sucesso

### 8.1 Adoção
- **Usuários ativos diários**: Target 5+ (equipe interna)
- **Sessões visualizadas/dia**: Target 50+
- **Replays executados/semana**: Target 20+

### 8.2 Performance
- **Tempo médio para debug**: Reduzir de 30min para 5min
- **Bugs reproduzidos**: 90% dos bugs reportados conseguem ser reproduzidos via replay

### 8.3 Operacional
- **Uptime**: 99.5%
- **Latência p95**: < 500ms para queries
- **Erros não tratados**: < 1/dia

---

## 9. Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|----------|
| Volume de dados alto causa lentidão | Alto | Média | Paginação, índices, agregações no banco |
| Replay modifica estado do agente | Alto | Baixa | Replay em ambiente isolado ou read-only |
| Dados sensíveis expostos na UI | Alto | Média | Mascaramento automático de PII |
| Supabase fora do ar | Alto | Baixa | Cache local, graceful degradation |

---

## 10. Fora de Escopo (v1)

- Autenticação de usuários (usa Supabase anon key)
- Multi-tenancy (todos vêem todos os agentes)
- Edição de configuração dos agentes
- Deploy automatizado de agentes
- Integração com Slack/Discord
- Mobile app nativo

---

## 11. Glossário

| Termo | Definição |
|-------|-----------|
| Turn | Uma interação completa: mensagem do usuário → processamento → resposta do agente |
| Session | Conjunto de turns de um mesmo telefone em período contínuo |
| Replay | Re-execução de um turn usando os mesmos inputs (system prompt, context, message) |
| Agent Identifier | String única que identifica cada agente (ex: "centerfisio") |
| Context Snapshot | Estado do paciente/CRM capturado antes da execução do agente |

---

## Aprovações

| Papel | Nome | Data | Assinatura |
|-------|------|------|------------|
| Product Owner | | | |
| Tech Lead | | | |
| Stakeholder | | | |
