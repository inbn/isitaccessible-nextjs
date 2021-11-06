import styles from './Center.module.scss'

interface Props {
  children: React.ReactNode
  maxWidth?: string
}

const Center: React.FC<Props> = ({ children, maxWidth }) => {
  const customProperties = { '--max-width': maxWidth } as React.CSSProperties;

  return (
    <div className={styles.center} style={customProperties}>
      {children}
    </div>
  )
}

export default Center
