# Lessons Learned - AI Agents Dashboard

## Padrões a Seguir

### Next.js App Router
- Usar Server Components por padrão, Client Components (`"use client"`) só quando necessário (hooks, eventos)
- Queries de dados em Server Components quando possível
- useQuery (TanStack) para dados que precisam de revalidação no client

### Supabase
- Sempre usar schema `centerfisio` explicitamente: `.schema("centerfisio")`
- Usar tipos TypeScript gerados para type safety
- Paginação em todas as queries com muitos resultados

### Componentes
- Usar shadcn/ui como base, customizar via Tailwind
- Componentes de UI em `src/components/ui/`
- Componentes de domínio em `src/components/` (ex: `SessionCard`, `TurnDetail`)

### Estado
- TanStack Query para dados do servidor
- useState para UI local simples
- Context para estado global (agente selecionado, tema)

---

## Erros Comuns e Soluções

(adicionar conforme encontrados)

---

## Decisões de Arquitetura

### 2026-02-03: Supabase Direto vs API Própria
**Decisão**: Conectar direto ao Supabase via client
**Razão**: Simplicidade, RLS já configurado, sem necessidade de API intermediária
**Trade-off**: Menos controle sobre queries, dependência do Supabase client

### 2026-02-03: Vercel vs Docker/VPS
**Decisão**: Suportar ambos, priorizar Docker/VPS para consistência com agentes
**Razão**: Já temos infra VPS funcionando, mais controle
**Trade-off**: Mais trabalho de ops vs Vercel zero-config
