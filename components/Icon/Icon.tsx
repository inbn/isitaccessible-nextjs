import classNames from 'classnames'

import styles from './Icon.module.scss'

interface Props {
  name: string
  className?: string
}

const Icon: React.FC<Props> = ({ name, className, ...rest }) => {
  return (
    <svg className={classNames(styles.icon, className)} {...rest}>
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
}

export default Icon
