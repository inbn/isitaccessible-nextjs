import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@iainmbean" />
          <meta name="twitter:title" content="Is it accessible?" />
          <meta
            name="twitter:description"
            content="Check if that npm package you’re about to install has accessibility issues"
          />
          <meta
            name="twitter:image"
            content={`https://${
              process.env.NEXT_PUBLIC_URL || 'isitaccessible.dev'
            }/share-image.png`}
          />
          <meta
            name="twitter:image:alt"
            content="Is it accessible? Check if that npm package you’re about to install has accessibility issues"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
