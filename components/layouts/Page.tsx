import Footer from '../Footer/Footer'
import styles from './Page.module.scss'

interface Props {
  headerComponent?: React.ReactNode
  children: React.ReactNode
}

const Page: React.FC<Props> = ({ children, headerComponent = null }) => {
  return (
    <>
      {!!headerComponent && headerComponent}
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}

export default Page
