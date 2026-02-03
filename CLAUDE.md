# AI Agents Dashboard

Dashboard de observabilidade para agentes de IA com Session Replay, Analytics e Debugging.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript (strict mode)
- **Estilo**: Tailwind CSS + shadcn/ui
- **Estado**: TanStack Query (React Query)
- **Database**: Supabase (PostgreSQL)
- **Deploy**: Vercel (planejado)

## Estrutura

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Dashboard home
│   ├── sessions/           # Sessões de conversa
│   │   ├── page.tsx        # Lista/busca
│   │   └── [id]/page.tsx   # Detalhe de sessão
│   ├── turns/[id]/         # Detalhe de turn
│   ├── replay/[id]/        # Interface de replay
│   └── agents/             # Gestão de agentes
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── layout/             # Sidebar, header
├── hooks/                  # React Query hooks
├── lib/                    # Utils, Supabase client
└── types/                  # TypeScript definitions
```

## Configuração

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar com credenciais do Supabase

# 3. Rodar em desenvolvimento
npm run dev
```

## Conexão com Dados

O dashboard conecta diretamente ao Supabase (schema `centerfisio`) para ler:

- `agent_turns` - Turns detalhados com context snapshots, tool calls, métricas
- `conversation_sessions` - Sessões agrupadas
- `message_logs` - Mensagens individuais
- `error_logs` - Erros para debugging

## Features Planejadas

### Fase 1 - MVP (Semana 1-2)
- [x] Estrutura inicial do projeto
- [ ] Dashboard com métricas básicas
- [ ] Busca de sessões por telefone
- [ ] Visualização de timeline de sessão
- [ ] Detalhe de turn com tool calls

### Fase 2 - Replay (Semana 3-4)
- [ ] Interface de replay comparativo
- [ ] Integração com API do agente para re-execução
- [ ] Diff visual entre original e replay

### Fase 3 - Multi-Agente (Semana 5-6)
- [ ] Filtro por agent_identifier
- [ ] Configuração de novos agentes
- [ ] Métricas comparativas entre agentes

### Fase 4 - Analytics (Semana 7-8)
- [ ] Gráficos de custo por período
- [ ] Análise de latência
- [ ] Alertas de erros
- [ ] Export de dados

## Comandos

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run lint         # Lint
npm run type-check   # Type check
```
