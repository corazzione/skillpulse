export interface IssueOpenedPayload {
  action: 'opened';
  issue: {
    number: number;
    title: string;
    body: string | null;
    labels: Array<{ name: string }>;
    user: { login: string };
    html_url: string;
  };
  repository: {
    owner: { login: string };
    name: string;
  };
}

export interface IssueCommentPayload {
  action: 'created';
  issue: {
    number: number;
    title: string;
    body: string | null;
    labels: Array<{ name: string }>;
    state: string;
  };
  comment: {
    body: string;
    user: { login: string };
  };
  repository: {
    owner: { login: string };
    name: string;
  };
}

export type GitHubPayload = IssueOpenedPayload | IssueCommentPayload;
