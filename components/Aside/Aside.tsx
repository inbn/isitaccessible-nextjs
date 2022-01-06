import styles from './Aside.module.scss'

interface Props {
  children: React.ReactNode
}

const Aside: React.FC<Props> = ({ children }) => {
  return <div className={styles.aside}>{children}</div>
}

export default Aside
