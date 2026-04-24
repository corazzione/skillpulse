# Launch Checklist

## T-24h
- [ ] Verify all GitHub Actions workflows show green in Actions tab
- [ ] Confirm site loads at https://corazzione.github.io/skillpulse
- [ ] Run manual refresh: `gh workflow run refresh.yml`
- [ ] Verify data/snapshots/latest.json has 100+ entries
- [ ] README renders correctly on GitHub (mobile + desktop)
- [ ] All issue templates work (test by opening draft issues)
- [ ] Dependabot PRs enabled (check repo settings)

## T-1h
- [ ] Final README sanity check — all sections populated
- [ ] Site loads without console errors
- [ ] OG image preview via https://opengraph.xyz
- [ ] GitHub repo: description set, topics set (see scripts/setup-repo.ts)
- [ ] Star the repo yourself first

## T-0: Post in this order (wait 30min between)
1. Hacker News: https://news.ycombinator.com/submit
2. Twitter/X thread (see launch/twitter-thread.md)
3. Reddit: r/ClaudeAI, r/LocalLLaMA, r/programming

## T+1h
- [ ] Monitor HN comments — respond within 10min
- [ ] Reply to Twitter mentions
- [ ] Check GitHub Issues for first submissions

## T+24h
- [ ] If top 10 HN: crosspost to dev.to and hashnode
- [ ] Check if GitHub Trending (category: TypeScript)
- [ ] Tally: stars, issues submitted, site traffic (if Plausible enabled)

## T+7d
- [ ] Verify weekly digest ran (check digests/ folder and GitHub Discussion)
- [ ] Review first week's submissions (close resolved issues)
- [ ] Update README star count badge if milestone reached
