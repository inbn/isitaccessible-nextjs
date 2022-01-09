import styles from './Card.module.scss'

interface Props {
  children: React.ReactNode
  tag?: keyof JSX.IntrinsicElements
}

const Card: React.FC<Props> = ({ children, tag: Wrapper = 'div' }) => {
  return <Wrapper className={styles.card}>{children}</Wrapper>
}

export default Card
