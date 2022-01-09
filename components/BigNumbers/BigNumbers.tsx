import classNames from 'classnames'

import styles from './BigNumbers.module.scss'

interface Props {
  numbers: {
    label: string
    value: number | string
    unit?: string
    linkHref?: string
  }[]
}

const BigNumbers: React.FC<Props> = ({ numbers }) => {
  return (
    <dl className={styles.bigNumbers}>
      {numbers.map(({ label, value, unit, linkHref }) => (
        <div
          key={label}
          className={classNames({
            [styles.bigNumber]: true,
            [styles.hasLink]: !!linkHref,
          })}
        >
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.value}>
            {linkHref ? (
              <a href={linkHref} className={styles.link}>
                {value}
                {!!unit && <span className={styles.unit}>{unit}</span>}
              </a>
            ) : (
              <>
                {value}
                {!!unit && <span className={styles.unit}>{unit}</span>}
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default BigNumbers
