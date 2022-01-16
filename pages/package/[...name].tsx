import { Endpoints } from '@octokit/types'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'

import Alert from '../../components/Alert/Alert'
import BigNumbers from '../../components/BigNumbers/BigNumbers'
import Card from '../../components/Card/Card'
import Header from '../../components/Header/Header'
import PackageLinks from '../../components/PackageLinks/PackageLinks'
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

const getDaysBetweenDates = (date1: string, date2: string | null = null) => {
  var pastDate = new Date(date1)
  var currentDate = date2 ? new Date(date2) : new Date()

  // Difference in milliseconds
  var difference = currentDate.getTime() - pastDate.getTime()

  // Convert to days
  var days = difference / (1000 * 3600 * 24)

  return days
}

const getWarningText = (warning: string) => {
  switch (warning) {
    case 'monorepo':
      return (
        <>
          This package looks like it comes from a{' '}
          <a href="https://en.wikipedia.org/wiki/Monorepo">monorepo</a>. Some
          (or all) of the issues mentioned below may not be related to this
          specific npm package.
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

const getA11yScore = (closedIssuesCount: number, totalIssuesCount: number) => {
  if (totalIssuesCount === 0) {
    return 'N/A'
  }

  return +((100 * closedIssuesCount) / totalIssuesCount).toFixed(1)
}

const median = (values: number[]) => {
  if (values.length === 0) throw new Error('No inputs')

  // Make a new array to avoid mutating the original
  const sortedValues = [...values].sort((a, b) => a - b)
  // Get the middle value
  var half = Math.floor(sortedValues.length / 2)
  // If the array has an odd number of elements, return the middle one
  if (sortedValues.length % 2) return sortedValues[half]
  // Otherwise, return the average of the middle two
  return (sortedValues[half - 1] + sortedValues[half]) / 2.0
}

const getAverageIssueAge = (issues: SearchIssuesResponse['data']['items']) => {
  if (issues.length === 0) {
    return 'N/A'
  }

  const daysSinceIssues = issues.map((issue) =>
    getDaysBetweenDates(issue.created_at, issue.closed_at)
  )

  // Get the total number of days
  // const totalDays = daysSinceIssues.reduce((total, days) => total + days)
  // Get the average (mean) number of days
  // return +(totalDays / issues.length).toFixed(1)

  // Get the median number of days
  return median(daysSinceIssues)
}

interface Props {
  name: string
  homepageUrl: string
  description: string
  repo: string
  openIssues: SearchIssuesResponse['data']['items']
  closedIssues: SearchIssuesResponse['data']['items']
  warnings?: string[]
  averageAge: number | string
}

export default function Package({
  name,
  homepageUrl,
  description,
  repo,
  openIssues,
  closedIssues,
  averageAge,
  warnings = [],
}: Props) {
  const totalIssuesCount = openIssues.length + closedIssues.length
  const a11yScore = getA11yScore(closedIssues.length, totalIssuesCount)

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
                <Stack space="1.5rem">
                  <Title>{name}</Title>
                  {!!description && (
                    <p className="fontSizeLg italic">{description}</p>
                  )}
                  <div>
                    <h2 style={{ display: 'inline' }}>
                      {totalIssuesCount} GitHub issue
                      {totalIssuesCount !== 1 && 's'}
                    </h2>

                    <span>
                      {' '}
                      mentioning ‘accessibility’, ‘a11y’, ‘aria’, or
                      ‘screenreader’.
                    </span>
                  </div>

                  {!!warnings &&
                    warnings.length > 0 &&
                    warnings.map((warning) => (
                      <Alert key={warning}>{getWarningText(warning)}</Alert>
                    ))}

                  <BigNumbers
                    numbers={[
                      {
                        label: 'Score',
                        value: a11yScore,
                        unit: !(typeof a11yScore === 'string')
                          ? '%'
                          : undefined,
                      },
                      {
                        label: 'Average age',
                        value:
                          typeof averageAge === 'string'
                            ? averageAge
                            : +averageAge.toFixed(1),
                        unit:
                          typeof averageAge === 'number' ? ' days' : undefined,
                      },
                      {
                        label: 'Open',
                        value: openIssues.length,
                        linkHref: `https://github.com/${repo}/issues?q=is%3Aissue+is%3Aopen+accessibility+OR+a11y+OR+aria+OR+screenreader`,
                      },
                      {
                        label: 'Closed',
                        value: closedIssues.length,
                        linkHref: `https://github.com/${repo}/issues?q=is%3Aissue+is%3Aclosed+accessibility+OR+a11y+OR+aria+OR+screenreader`,
                      },
                    ]}
                  />

                  {!!openIssues && openIssues.length > 0 && (
                    <>
                      <h3>Open issues</h3>

                      <ul>
                        {openIssues.map(({ html_url, title, created_at }) => (
                          <li key={html_url}>
                            <a href={html_url}>{title}</a>
                            <span>
                              ({Math.ceil(getDaysBetweenDates(created_at))} days
                              old)
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
              <Stack space="1.5rem">
                <Card>
                  <Stack space="1em">
                    <h2>Links</h2>

                    <PackageLinks
                      links={[
                        {
                          label: 'npm',
                          href: `https://www.npmjs.com/package/${name}`,
                          icon: 'npm',
                        },
                        {
                          label: 'GitHub',
                          href: `https://github.com/${repo}`,
                          icon: 'github',
                        },
                        ...(homepageUrl
                          ? [
                              {
                                label: 'Homepage',
                                href: processHomepageUrl(homepageUrl),
                                icon: 'home',
                              },
                            ]
                          : []),
                      ]}
                    />
                  </Stack>
                </Card>
                <Card tag="aside">
                  <h2>What the numbers mean</h2>
                  <dl className="mt1em">
                    <div>
                      <dt className="bold">Score</dt>
                      <dd>
                        This is the percentage of all accessibility-related
                        issues that are closed. A higher number is better.
                      </dd>
                    </div>
                    <div className="mt1em">
                      <dt className="bold">Average age</dt>
                      <dd>
                        This is the <strong>median</strong> time taken between
                        an issue being opened and being closed. For issues that
                        are still open, the current date is used. A lower number
                        is better.
                      </dd>
                    </div>
                  </dl>
                </Card>
              </Stack>
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

  const averageAge = getAverageIssueAge(gitHubIssues)

  // created_at
  // closed_at
  // If closed_at is null, it's still open
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
      averageAge,
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
