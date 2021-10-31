import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'
import { Endpoints } from '@octokit/types'

import { fetchGitHubIssues} from '../../lib/github-issues'

type searchIssuesResponse = Endpoints['GET /search/issues']['response']

// Test with:
// git+https://github.com/facebook/react.git
const extractGitHubRepoFromUrl = (url: string) => {
  const matches = url.match(/^.+?(?=github\.com)([^\/:]+)\/(.+).git?$/)
  return !!matches && matches[2]
}

const processHomepageUrl = (url: string) => {
  var pattern = /^((http|https):\/\/)/

  if (!pattern.test(url)) {
    url = `http://${url}`
  }

  return url
}

const getDaysSinceDate = (date: string) => {
  var pastDate = new Date(date)
  var currentDate = new Date()

  // Difference in milliseconds
  var difference = currentDate.getTime() - pastDate.getTime()

  // Convert to days
  var days = Math.ceil(difference / (1000 * 3600 * 24))

  return days
}

interface Props {
  name: string
  homepageUrl: string
  description: string
  repo: string
  openIssues: searchIssuesResponse['data']['items']
  closedIssues: searchIssuesResponse['data']['items']
}

export default function Package({
  name,
  homepageUrl,
  description,
  repo,
  openIssues,
  closedIssues,
}: Props) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <h1>{name}</h1>
        {!!description && <p>{description}</p>}

        <h2>Links</h2>

        <ul>
          <li>
            <a href={`https://www.npmjs.com/package/${name}`}>NPM</a>
          </li>
          <li>
            <a href={`https://github.com/${repo}`}>GitHub</a>
          </li>
          {!!homepageUrl && (
            <li>
              <a href={processHomepageUrl(homepageUrl)}>Homepage</a>
            </li>
          )}
        </ul>

        <h2>GitHub issues</h2>

        <p>Mentioning ‘accessibility’, ‘a11y’, ‘aria’, or ‘screenreader’.</p>

        <dl>
          <div>
            <dt>Open</dt>
            <dd><a href={`https://github.com/${repo}/issues?q=is%3Aissue+is%3Aopen+accessibility+OR+a11y+OR+aria+OR+screenreader`}>{openIssues.length}</a></dd>
          </div>

          <div>
            <dt>Closed</dt>
            <dd><a href={`https://github.com/${repo}/issues?q=is%3Aissue+is%3Aclosed+accessibility+OR+a11y+OR+aria+OR+screenreader`}>{closedIssues.length}</a></dd>
          </div>
        </dl>

        {!!openIssues && openIssues.length > 0 && (
          <>
            <h3>Open issues</h3>

            <ul>
              {openIssues.map(({ html_url, title, created_at }) => (
                <li key={html_url}>
                  <a href={html_url}>{title}</a>
                  <span>({getDaysSinceDate(created_at)} days old)</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>

      <footer>Disclaimer: The content of this site should be used as a guide only. A package with no accessibility-related GitHub issues does not guarantee an accessible package. A package with no accessibility issues can still be used to build something inaccessible.</footer>
    </div>
  )
}

interface Params {
  name: string[]
}

type PackagePageStaticProps = GetStaticProps<Params>

export const getStaticProps: PackagePageStaticProps = async ({ params }) => {
  // 1. Use the npms.io API (https://api-docs.npms.io/)
  // to fetch the most popular packages
  const API_URL = 'https://api.npms.io/v2/package/'

  if (!params?.name || !Array.isArray(params.name)) {
    return { notFound: true }
  }

  const npmResponse = await fetch(
    `${API_URL}${encodeURIComponent(params.name.join('/'))}`
  )

  const data = await npmResponse.json()

  if (npmResponse.status !== 200) {
    return { notFound: true }
  }

  const metadata = data.collected.metadata
  // console.log(data.collected.metadata)

  const name = metadata?.name || null
  const description = metadata?.description || null
  const homepageUrl =
    data?.collected?.github?.homepage || metadata?.links?.homepage || null
  const repo = metadata?.repository?.url
    ? extractGitHubRepoFromUrl(metadata.repository.url)
    : null

  const gitHubIssues = repo ? await fetchGitHubIssues(repo) : []

  const openIssues = gitHubIssues.filter((issue) => issue.state === 'open')
  const closedIssues = gitHubIssues.filter((issue) => issue.state === 'closed')

  // console.log(res.status)
  // console.log(data)

  return {
    props: {
      name,
      description,
      homepageUrl,
      repo,
      // Show oldest issues first
      openIssues: openIssues.sort((a, b) =>
        a.created_at > b.created_at ? 1 : -1
      ),
      closedIssues,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  // List of all npm packages: https://replicate.npmjs.com/_all_docs
  // Can be paginated: https://docs.couchdb.org/en/stable/ddocs/views/pagination.html#paging
  const packages = [
    ['react']
  ]
  // Generate an array of paths we want to pre-render
  const paths = packages.map((name) => ({
    params: { name },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn’t exist.
  return { paths, fallback: 'blocking' }
}

