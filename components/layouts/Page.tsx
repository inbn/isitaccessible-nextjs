import Footer from '../Footer/Footer'
import styles from './Page.module.scss'

interface Props {
  children: React.ReactNode
}

const Page: React.FC<Props> = ({ children }) => {
  return (
    <>
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}

export default Page
