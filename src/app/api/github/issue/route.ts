import { NextRequest, NextResponse } from "next/server";
import { createGitHubIssue, generateIssueTemplate } from "@/lib/github";

interface CreateIssueRequest {
  title: string;
  labels?: string[];
  agentIdentifier: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  patientContext: Record<string, unknown>;
  crmContext: Record<string, unknown>;
  conversation: Array<{ role: string; content: string }>;
  error?: string;
  additionalContext?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateIssueRequest = await request.json();

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;

    if (!token || !owner || !repo) {
      return NextResponse.json(
        {
          error: "GitHub configuration missing",
          details:
            "GITHUB_TOKEN, GITHUB_REPO_OWNER, and GITHUB_REPO_NAME must be set",
        },
        { status: 500 }
      );
    }

    const issueBody = generateIssueTemplate({
      agentIdentifier: body.agentIdentifier,
      model: body.model,
      temperature: body.temperature,
      systemPrompt: body.systemPrompt,
      patientContext: body.patientContext,
      crmContext: body.crmContext,
      conversation: body.conversation,
      error: body.error,
      additionalContext: body.additionalContext,
    });

    const issue = await createGitHubIssue(
      {
        owner,
        repo,
        title: body.title,
        body: issueBody,
        labels: body.labels,
      },
      token
    );

    return NextResponse.json({
      url: issue.html_url,
      number: issue.number,
    });
  } catch (error) {
    console.error("Failed to create GitHub issue:", error);
    return NextResponse.json(
      {
        error: "Failed to create GitHub issue",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
