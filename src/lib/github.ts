// GitHub API integration for creating issues

const GITHUB_API_URL = "https://api.github.com";

interface CreateIssueParams {
  owner: string;
  repo: string;
  title: string;
  body: string;
  labels?: string[];
}

interface GitHubIssue {
  id: number;
  number: number;
  html_url: string;
  title: string;
  state: string;
}

export async function createGitHubIssue(
  params: CreateIssueParams,
  token: string
): Promise<GitHubIssue> {
  const response = await fetch(
    `${GITHUB_API_URL}/repos/${params.owner}/${params.repo}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        title: params.title,
        body: params.body,
        labels: params.labels,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create GitHub issue");
  }

  return response.json();
}

export function generateIssueTemplate(data: {
  agentIdentifier: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  patientContext: Record<string, unknown>;
  crmContext: Record<string, unknown>;
  conversation: Array<{ role: string; content: string }>;
  error?: string;
  additionalContext?: string;
}): string {
  const conversationMarkdown = data.conversation
    .slice(-6)
    .map(
      (msg) =>
        `**${msg.role === "user" ? "Usuário" : "Agente"}:** ${msg.content.slice(0, 300)}${msg.content.length > 300 ? "..." : ""}`
    )
    .join("\n\n");

  let template = `## Contexto

**Agente:** \`${data.agentIdentifier}\`
**Modelo:** \`${data.model}\`
**Temperature:** \`${data.temperature}\`

## Conversa (últimas mensagens)

${conversationMarkdown}
`;

  if (data.error) {
    template += `
## Erro Observado

\`\`\`
${data.error}
\`\`\`
`;
  }

  template += `
## Configuração

<details>
<summary>System Prompt</summary>

\`\`\`
${data.systemPrompt || "(vazio)"}
\`\`\`

</details>

<details>
<summary>Patient Context</summary>

\`\`\`json
${JSON.stringify(data.patientContext, null, 2)}
\`\`\`

</details>

<details>
<summary>CRM Context</summary>

\`\`\`json
${JSON.stringify(data.crmContext, null, 2)}
\`\`\`

</details>
`;

  if (data.additionalContext) {
    template += `
## Contexto Adicional

${data.additionalContext}
`;
  }

  template += `
---

*Issue criada automaticamente pelo AI Agents Dashboard*
`;

  return template;
}
