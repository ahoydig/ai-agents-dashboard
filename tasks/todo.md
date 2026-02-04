# AI Agents Dashboard - TODO

## Status Geral
- **Fase Atual**: 0 - Setup
- **Próxima Milestone**: MVP (Fase 1)
- **Última Atualização**: 2026-02-03

---

## Fase 0: Setup [EM ANDAMENTO]

### Ambiente de Desenvolvimento
- [x] Criar repositório GitHub
- [x] Estrutura inicial Next.js 14
- [x] Configurar TypeScript strict
- [x] Configurar Tailwind CSS + shadcn/ui
- [x] Criar tipos TypeScript para agent_turns
- [x] Criar hooks básicos (useAgentTurns, useSessions)
- [ ] Clonar repo localmente
- [ ] Instalar dependências (`npm install`)
- [ ] Configurar .env.local com credenciais Supabase
- [ ] Testar conexão com Supabase
- [ ] Rodar `npm run dev` e verificar http://localhost:3000

### Infraestrutura de Deploy
- [ ] Decidir: Vercel ou Docker/VPS?
- [ ] Se VPS: Criar docker-compose.yml
- [ ] Se VPS: Configurar Traefik para dashboard.ai-agents.ahoy.digital
- [ ] Se Vercel: Conectar repo e configurar env vars
- [ ] Deploy inicial (mesmo que placeholder)

---

## Fase 1: MVP (Semanas 1-2)

### Semana 1: Dashboard + Busca

#### Dashboard Home (src/app/page.tsx)
- [ ] Query para total de turns (últimas 24h)
- [ ] Query para sessões ativas (últimas 2h)
- [ ] Query para latência média
- [ ] Query para custo total
- [ ] Implementar cards com dados reais
- [ ] Gráfico de turns por hora (Recharts LineChart)
- [ ] Gráfico de distribuição por agente (PieChart)
- [ ] Lista de últimos erros

#### Busca de Sessões (src/app/sessions/page.tsx)
- [ ] Input de telefone com validação
- [ ] Botão de busca com loading state
- [ ] Query para buscar sessões por telefone
- [ ] Tabela de resultados com colunas: ID, Início, Turns, Status
- [ ] Link para detalhe da sessão
- [ ] Filtros: Data range, Status
- [ ] Paginação

### Semana 2: Timeline + Detalhe

#### Timeline de Sessão (src/app/sessions/[id]/page.tsx)
- [ ] Query para buscar sessão por ID
- [ ] Query para buscar turns da sessão
- [ ] Query para buscar messages da sessão
- [ ] Header com métricas da sessão
- [ ] Timeline vertical com mensagens
- [ ] Estilo diferenciado para inbound/outbound
- [ ] Timestamps formatados
- [ ] Click em outbound abre turn detail
- [ ] Loading skeleton

#### Detalhe de Turn (src/app/turns/[id]/page.tsx)
- [ ] Query para buscar turn por ID
- [ ] Header: ID, timestamp, agent, model, status
- [ ] Seção Input: user_message
- [ ] Seção Output: assistant_response, final_response
- [ ] Seção Tool Calls: lista expansível
- [ ] Seção Context: patient + CRM (JSON viewer)
- [ ] Seção Métricas: tokens, custo, latency breakdown
- [ ] Seção Guardrails: input/output status
- [ ] Botão "Replay this turn"
- [ ] Copy buttons para JSONs

#### Deploy MVP
- [ ] Deploy em produção
- [ ] Testar todas as features
- [ ] Corrigir bugs encontrados
- [ ] Documentar no CLAUDE.md

---

## Fase 2: Replay (Semanas 3-4)

### Semana 3: Interface de Replay

#### Replay Page (src/app/replay/[id]/page.tsx)
- [ ] Carregar turn original
- [ ] Exibir payload de replay (system prompt, context, message)
- [ ] Botão "Execute Replay"
- [ ] Loading state durante execução
- [ ] Exibir resposta do replay
- [ ] Layout lado a lado: Original | Replay

#### Integração com API
- [ ] Criar lib/agent-api.ts
- [ ] Função para chamar endpoint de replay do agente
- [ ] Tratamento de erros (timeout, 500, etc.)
- [ ] Suporte a múltiplos agentes (URLs diferentes)

### Semana 4: Comparação

#### Diff Visual
- [ ] Instalar lib de diff (diff ou similar)
- [ ] Componente DiffViewer
- [ ] Highlight de adições (verde)
- [ ] Highlight de remoções (vermelho)
- [ ] Toggle: Unified vs Side-by-side

#### Edição de Prompt
- [ ] Textarea editável para system prompt
- [ ] Botão "Replay with modified prompt"
- [ ] Salvar prompts modificados (localStorage?)

---

## Fase 3: Multi-Agente (Semanas 5-6)

### Semana 5: Filtros

#### Seletor de Agente
- [ ] Query para listar agent_identifiers distintos
- [ ] Dropdown no header
- [ ] Context para agente selecionado
- [ ] Filtrar todas as queries por agente
- [ ] URL param ?agent=centerfisio

#### Lista de Agentes (src/app/agents/page.tsx)
- [ ] Cards com nome, descrição, status
- [ ] Métricas por agente: turns/24h, custo/24h
- [ ] Link para dashboard filtrado

### Semana 6: Onboarding

#### Adicionar Agente
- [ ] Modal "Adicionar Agente"
- [ ] Instruções de integração (código Python)
- [ ] Snippet copiável
- [ ] Checklist de verificação
- [ ] Teste de conexão

#### Documentação
- [ ] Página /docs com guia de integração
- [ ] Exemplos de código para Python, Node.js
- [ ] Troubleshooting comum

---

## Fase 4: Analytics (Semanas 7-8)

### Semana 7: Gráficos

#### Custo
- [ ] Query agregada de custo por dia
- [ ] Gráfico de área: custo acumulado
- [ ] Filtro por período
- [ ] Breakdown por agente

#### Latência
- [ ] Query para percentis (p50, p90, p99)
- [ ] Gráfico de linha com percentis
- [ ] Heatmap de latência por hora/dia

### Semana 8: Alertas

#### Sistema de Alertas
- [ ] Configuração de thresholds
- [ ] Checagem periódica (cron ou webhook)
- [ ] Notificação por email (Resend?)
- [ ] Notificação por webhook

#### Export
- [ ] Botão "Export CSV"
- [ ] Seleção de campos
- [ ] Filtros aplicados ao export
- [ ] Download direto

---

## Backlog (Não Priorizado)

- [ ] Autenticação de usuários (Supabase Auth)
- [ ] Multi-tenancy (organizações)
- [ ] Dark/Light mode toggle
- [ ] Favoritar sessões
- [ ] Anotações em turns
- [ ] Integração Slack/Discord
- [ ] API pública do dashboard
- [ ] Mobile responsive melhorias
- [ ] Testes E2E (Playwright)
- [ ] Testes unitários (Vitest)

---

## Bugs Conhecidos

(nenhum ainda)

---

## Notas de Sessão

### 2026-02-03
- Criado repositório e estrutura inicial
- PRD completo escrito
- Próximo: Setup local e primeiro deploy
