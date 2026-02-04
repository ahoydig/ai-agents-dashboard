# Deploy - AI Agents Dashboard

## Opção 1: Docker/VPS (Recomendado)

### Pré-requisitos
- VPS com Docker instalado
- Traefik configurado (já existe em `/opt/core/traefik/`)
- Rede `traefik-public` criada
- DNS apontando `dashboard.ai-agents.ahoy.digital` para o IP da VPS

### Passos

```bash
# 1. Na VPS, criar diretório
sudo mkdir -p /opt/stacks/ai-agents-dashboard
cd /opt/stacks/ai-agents-dashboard

# 2. Clonar repositório
git clone https://github.com/ahoydig/ai-agents-dashboard.git .

# 3. Criar arquivo .env
cat > .env << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://jgbkyoajkxgfkyftzrsu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>
EOF

# 4. Build e deploy
docker-compose up -d --build

# 5. Verificar logs
docker-compose logs -f

# 6. Testar
curl https://dashboard.ai-agents.ahoy.digital/api/health
```

### Atualização

```bash
cd /opt/stacks/ai-agents-dashboard
git pull origin main
docker-compose up -d --build
```

### Troubleshooting

```bash
# Ver logs
docker-compose logs -f dashboard

# Reiniciar
docker-compose restart

# Rebuild completo
docker-compose down
docker-compose up -d --build --force-recreate
```

---

## Opção 2: Vercel

### Passos

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New Project"
3. Importe `ahoydig/ai-agents-dashboard`
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique em "Deploy"
6. Configure domínio customizado (opcional)

### Atualização
- Push para `main` faz deploy automático

---

## Verificação Pós-Deploy

1. Acesse a URL do dashboard
2. Verifique se a sidebar carrega
3. Verifique se os cards do dashboard mostram dados (ou "--" se não houver)
4. Teste busca de sessão com telefone conhecido
5. Verifique console do browser para erros

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Anon key do Supabase |
| `CENTERFISIO_API_URL` | Não | URL da API do CenterFisio (para replay) |

---

## Portas e URLs

| Ambiente | URL |
|----------|-----|
| Local | http://localhost:3000 |
| Produção (VPS) | https://dashboard.ai-agents.ahoy.digital |
| Produção (Vercel) | https://ai-agents-dashboard.vercel.app |
