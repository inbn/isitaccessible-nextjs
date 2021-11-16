import styles from './Stack.module.scss'

interface Props {
  children: React.ReactNode
  space?: string
}

const Stack: React.FC<Props> = ({ children, space }) => {
  const customProperties = { '--space': space } as React.CSSProperties

  return (
    <div className={styles.stack} style={customProperties}>
      {children}
    </div>
  )
}

export default Stack
