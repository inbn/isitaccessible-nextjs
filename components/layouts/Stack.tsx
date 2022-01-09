import styles from './Stack.module.scss'

interface Props {
  children: React.ReactNode
  space?: string
  tag?: keyof JSX.IntrinsicElements
}

const Stack: React.FC<Props> = ({ children, space, tag: Wrapper = 'div' }) => {
  const customProperties = { '--space': space } as React.CSSProperties

  return (
    <Wrapper className={styles.stack} style={customProperties}>
      {children}
    </Wrapper>
  )
}

export default Stack
