import styles from './Title.module.scss'

interface Props {
  children: React.ReactNode
}

const Title: React.FC<Props> = ({ children }) => {
  return <h1 className={styles.title}>{children}</h1>
}

export default Title
