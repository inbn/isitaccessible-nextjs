import classNames from 'classnames'

import styles from './Center.module.scss'

interface Props {
  children: React.ReactNode
  maxWidth?: string
  centerContentsHorizontally?: boolean
  centerContentsVertically?: boolean
  stretchContentsHorizontally?: boolean
}

const Center: React.FC<Props> = ({
  children,
  maxWidth,
  centerContentsHorizontally = false,
  centerContentsVertically = false,
  stretchContentsHorizontally = false,
}) => {
  const customProperties = { '--max-width': maxWidth } as React.CSSProperties

  return (
    <div
      className={classNames({
        [styles.center]: true,
        [styles.centerContentsHorizontally]: centerContentsHorizontally,
        [styles.centerContentsVertically]: centerContentsVertically,
        [styles.stretchContentsHorizontally]: stretchContentsHorizontally,
      })}
      style={customProperties}
    >
      {children}
    </div>
  )
}

export default Center
