import { Endpoints } from '@octokit/types'

const { Octokit } = require('@octokit/core')

type SearchIssuesResponse = Endpoints['GET /search/issues']['response']
type GetRepoResponse = Endpoints['GET /repos/{owner}/{repo}']['response']
type GetFileContentsResponse =
  Endpoints['GET /repos/{owner}/{repo}/contents/{path}']['response']

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
      const gitHubIssuesResponse: SearchIssuesResponse = await octokit.request(
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
      // TODO what to do if this also fails?
      const [userName, repoName] = repo.split('/')
      const gitHubRepoResponse: GetRepoResponse = await octokit.request(
        `GET /repos/${userName}/${repoName}`
      )

      if (gitHubRepoResponse.data.full_name !== repo) {
        fullRepoName = gitHubRepoResponse.data.full_name

        const gitHubIssuesResponse: SearchIssuesResponse =
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
    // GitHub API will fallover if you try to request result beyond the 1000th
  } while (issuesRemaining > 0 && gitHubIssues.length < 1000)

  return gitHubIssues
}

export const fetchPackageJson = async (repo: string) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_API_TOKEN,
  })

  try {
    const packageJsonResponse: GetFileContentsResponse = await octokit.request(
      `GET /repos/${repo}/contents/package.json`
    )

    // I hate TypeScript
    // See https://github.com/probot/probot/issues/1023
    const data: any = packageJsonResponse.data
    const packageJson = JSON.parse(
      Buffer.from(data.content, data.encoding).toString()
    )

    return packageJson
  } catch (error) {
    console.log(error)

    return null
  }
}
