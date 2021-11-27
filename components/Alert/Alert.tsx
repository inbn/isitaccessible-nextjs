import styles from './Alert.module.scss'

interface Props {
  children: React.ReactNode
}

const Alert: React.FC<Props> = ({ children }) => {
  return <div className={styles.alert}>{children}</div>
}

export default Alert
