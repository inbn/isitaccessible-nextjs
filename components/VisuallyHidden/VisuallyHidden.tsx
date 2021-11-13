import styles from './VisuallyHidden.module.scss'

const VisuallyHidden: React.FC = ({ children }) => (
  <span className={styles.visuallyHidden}>{children}</span>
)

export default VisuallyHidden
