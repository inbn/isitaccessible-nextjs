import { Endpoints } from '@octokit/types'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'

import Alert from '../../components/Alert/Alert'
import Header from '../../components/Header/Header'
import Icon from '../../components/Icon/Icon'
import SearchForm from '../../components/SearchForm/SearchForm'
import Title from '../../components/Title/Title'
import Center from '../../components/layouts/Center'
import Page from '../../components/layouts/Page'
import Stack from '../../components/layouts/Stack'
import TwoColumn from '../../components/layouts/TwoColumn'
import { fetchGitHubIssues, fetchPackageJson } from '../../lib/github-issues'
import { getDependencyWarnings } from '../../lib/npm-packages'

type SearchIssuesResponse = Endpoints['GET /search/issues']['response']

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

const getWarningText = (warning: string) => {
  switch (warning) {
    case 'monorepo':
      return (
        <>
          This package looks like it comes from a{' '}
          <a href="https://en.wikipedia.org/wiki/Monorepo">monorepo</a>.<br />
          Some of the issues mentioned below may not be related to this specific
          npm package.
        </>
      )
    case 'package-name':
      return (
        <>
          This package has a name which includes one or more of the search
          keywords. There may be some false positives in the issues below.
        </>
      )
    case 'package-description':
      return (
        <>
          The description for this package includes one or more of the search
          keywords. There may be some false positives in the issues below.
        </>
      )
    default:
      return null
  }
}

interface Props {
  name: string
  homepageUrl: string
  description: string
  repo: string
  openIssues: SearchIssuesResponse['data']['items']
  closedIssues: SearchIssuesResponse['data']['items']
  warnings?: string[]
}

export default function Package({
  name,
  homepageUrl,
  description,
  repo,
  openIssues,
  closedIssues,
  warnings = [],
}: Props) {
  return (
    <>
      <Head>
        <title>{name} | Is it accessible?</title>
      </Head>

      <Page
        headerComponent={
          <Header
            searchComponent={
              <SearchForm variant="header" initialValue={name} />
            }
          />
        }
      >
        <Center stretchContentsHorizontally>
          <TwoColumn
            mainContent={
              <>
                <Stack>
                  <Title>{name}</Title>
                  {!!description && <p>{description}</p>}
                  <h2>GitHub issues</h2>

                  <p>
                    mentioning ‘accessibility’, ‘a11y’, ‘aria’, or
                    ‘screenreader’.
                  </p>

                  {!!warnings &&
                    warnings.length > 0 &&
                    warnings.map((warning) => (
                      <Alert key={warning}>{getWarningText(warning)}</Alert>
                    ))}

                  <dl>
                    <div>
                      <dt>Open</dt>
                      <dd>
                        <a
                          href={`https://github.com/${repo}/issues?q=is%3Aissue+is%3Aopen+accessibility+OR+a11y+OR+aria+OR+screenreader`}
                        >
                          {openIssues.length}
                        </a>
                      </dd>
                    </div>

                    <div>
                      <dt>Closed</dt>
                      <dd>
                        <a
                          href={`https://github.com/${repo}/issues?q=is%3Aissue+is%3Aclosed+accessibility+OR+a11y+OR+aria+OR+screenreader`}
                        >
                          {closedIssues.length}
                        </a>
                      </dd>
                    </div>
                  </dl>

                  {!!openIssues && openIssues.length > 0 && (
                    <>
                      <h3>Open issues</h3>

                      <ul>
                        {openIssues.map(({ html_url, title, created_at }) => (
                          <li key={html_url}>
                            <a href={html_url}>{title}</a>
                            <span>
                              ({getDaysSinceDate(created_at)} days old)
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </Stack>
              </>
            }
            sidebar={
              <>
                <h2>Links</h2>

                <ul>
                  <li>
                    <a href={`https://www.npmjs.com/package/${name}`}>
                      <Icon name="npm" />
                      NPM
                    </a>
                  </li>
                  <li>
                    <a href={`https://github.com/${repo}`}>
                      <Icon name="github" />
                      GitHub
                    </a>
                  </li>
                  {!!homepageUrl && (
                    <li>
                      <a href={processHomepageUrl(homepageUrl)}>
                        <Icon name="home" />
                        Homepage
                      </a>
                    </li>
                  )}
                </ul>
              </>
            }
          />
        </Center>
      </Page>
    </>
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

  const packageName = params.name.join('/')

  const npmResponse = await fetch(
    `${API_URL}${encodeURIComponent(packageName)}`
  )

  const data = await npmResponse.json()

  if (npmResponse.status !== 200) {
    return { notFound: true }
  }

  const metadata = data.collected.metadata

  const name = metadata?.name || null
  const description = metadata?.description || null
  const homepageUrl =
    data?.collected?.github?.homepage || metadata?.links?.homepage || null
  const repo = metadata?.repository?.url
    ? extractGitHubRepoFromUrl(metadata.repository.url)
    : null

  const gitHubIssues = repo ? await fetchGitHubIssues(repo) : []

  // Get the package.json for the main repo
  // This will tell us, amongst other things, whether it's a monorepo
  const packageJson = repo ? await fetchPackageJson(repo) : []

  const dependencies = packageJson?.dependencies || null
  const devDependencies = packageJson?.devDependencies || null
  const warnings = getDependencyWarnings({
    ...(dependencies ? dependencies : {}),
    ...(devDependencies ? devDependencies : {}),
  })

  if (
    ['a11y', 'accessibility', 'aria', 'screenreader'].some((substring) =>
      packageName.toLowerCase().includes(substring)
    )
  ) {
    warnings.push('package-name')
  }

  if (
    description &&
    ['a11y', 'accessibility', 'aria', 'screenreader'].some((substring) =>
      description.toLowerCase().includes(substring)
    )
  ) {
    warnings.push('package-description')
  }

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
      warnings,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  // List of all npm packages: https://replicate.npmjs.com/_all_docs
  // Can be paginated: https://docs.couchdb.org/en/stable/ddocs/views/pagination.html#paging
  // TODO get most commonly searched packages from analytics
  const packages = [['react']]
  // Generate an array of paths we want to pre-render
  const paths = packages.map((name) => ({
    params: { name },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn’t exist.
  return { paths, fallback: 'blocking' }
}
