import Link from 'next/link'

import Center from '../layouts/Center'
import styles from './Header.module.scss'

interface Props {
  searchComponent: React.ReactNode
}

const Header: React.FC<Props> = ({ searchComponent }) => {
  return (
    <header className={styles.header}>
      <Center>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.homeLink}>
            Is it accessible?
          </Link>
          {searchComponent}
        </div>
      </Center>
    </header>
  )
}

export default Header
