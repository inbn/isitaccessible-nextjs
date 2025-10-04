import styles from './VisuallyHidden.module.scss'

interface VisuallyHiddenProps {
  children: React.ReactNode
}

const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ children }) => (
  <span className={styles.visuallyHidden}>{children}</span>
)

export default VisuallyHidden
