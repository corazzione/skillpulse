import { Octokit } from '@octokit/rest';

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN required');

  const octokit = new Octokit({ auth: token });
  const owner = 'corazzione';
  const repo = 'skillpulse';

  await octokit.repos.update({
    owner,
    repo,
    description:
      'Auto-updated registry of Claude Code skills, MCP servers, Cursor rules, and AI agent prompts. Refreshed every 6 hours.',
    homepage: 'https://corazzione.github.io/skillpulse',
    has_issues: true,
    has_projects: false,
    has_wiki: false,
  });

  await octokit.repos.replaceAllTopics({
    owner,
    repo,
    names: [
      'claude-code',
      'mcp',
      'mcp-server',
      'claude-skill',
      'agent-skill',
      'awesome-list',
      'cursor',
      'codex-cli',
      'gemini-cli',
      'ai-agent',
      'model-context-protocol',
      'llm-tools',
    ],
  });

  console.log('Repo description and topics updated.');
}

main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
