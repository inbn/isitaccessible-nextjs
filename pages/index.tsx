import Head from 'next/head'

import SearchForm from '../components/SearchForm/SearchForm'
import Center from '../components/layouts/Center'
import Page from '../components/layouts/Page'
import Stack from '../components/layouts/Stack'

export default function Home() {
  return (
    <>
      <Head>
        <title>Is it accessible?</title>
        <meta
          name="description"
          content="Check if that npm package you’re about to install has accessibility issues"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <Center centerContentsHorizontally centerContentsVertically>
          <Stack>
            <h1>Is it accessible?</h1>
            <p>
              Check if that npm package you’re about to install has
              accessibility issues
            </p>
            <SearchForm />
          </Stack>
        </Center>
      </Page>
    </>
  )
}
