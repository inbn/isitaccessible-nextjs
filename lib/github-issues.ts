const { Octokit } = require('@octokit/core')
import { Endpoints } from '@octokit/types'

type searchIssuesResponse = Endpoints['GET /search/issues']['response']
type getRepoResponse = Endpoints['GET /repos/{owner}/{repo}']['response']

export const fetchGitHubIssues = async (repo: string) => {
  let fullRepoName = repo
  let gitHubIssues = []
  let page = 1
  let issuesRemaining = 0

  const octokit = new Octokit({
    auth: process.env.GITHUB_API_TOKEN,
  })

  // TODO this could be DRYer but I don't have the energy to do it right now
  do {
    try {
      const gitHubIssuesResponse: searchIssuesResponse = await octokit.request(
        'GET /search/issues',
        {
          q: `accessibility OR a11y OR aria OR screenreader repo:${fullRepoName} type:issue`,
          per_page: 100,
          page,
        }
      )
      gitHubIssues.push(...gitHubIssuesResponse.data.items)
      if (gitHubIssuesResponse.data.total_count > 100) {
        issuesRemaining = ~~Math.max(
          gitHubIssuesResponse.data.total_count - 100 * page,
          0
        )
        page += 1
      }
    } catch (error) {
      // The search end point may error if a user moves a repo but doesn't
      // update npm. Check the repo endpoint to see if it has moved
      const [userName, repoName] = repo.split('/')
      const gitHubRepoResponse: getRepoResponse = await octokit.request(
        `GET /repos/${userName}/${repoName}`
      )

      if (gitHubRepoResponse.data.full_name !== repo) {
        fullRepoName = gitHubRepoResponse.data.full_name

        const gitHubIssuesResponse: searchIssuesResponse =
          await octokit.request('GET /search/issues', {
            q: `accessibility OR a11y OR aria OR screenreader repo:${fullRepoName} type:issue`,
            per_page: 100,
            page,
          })
        gitHubIssues.push(...gitHubIssuesResponse.data.items)
        if (gitHubIssuesResponse.data.total_count > 100) {
          issuesRemaining = ~~Math.max(
            gitHubIssuesResponse.data.total_count - 100 * page,
            0
          )
          page += 1
        }
      }
    }
  } while (issuesRemaining > 0)

  return gitHubIssues
}
