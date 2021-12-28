import Head from 'next/head'

import Header from '../components/Header/Header'
import SearchForm from '../components/SearchForm/SearchForm'
import Title from '../components/Title/Title'
import Center from '../components/layouts/Center'
import Page from '../components/layouts/Page'
import Stack from '../components/layouts/Stack'

export default function ErrorPage() {
  return (
    <>
      <Head>
        <title>404 Page Not Found | Is it accessible?</title>
      </Head>

      <Page
        headerComponent={
          <Header searchComponent={<SearchForm variant="header" />} />
        }
      >
        <Center stretchContentsHorizontally>
          <Stack>
            <Title>404</Title>
            <p>Sorry, that page couldn’t be found.</p>
            <p>
              Please try searching again using the form at the top of this page.
            </p>
          </Stack>
        </Center>
      </Page>
    </>
  )
}
