import styles from './BigNumbers.module.scss'

interface Props {
  numbers: {
    label: string
    value: number | string
    linkHref?: string
  }[]
}

const BigNumbers: React.FC<Props> = ({ numbers }) => {
  return (
    <dl className={styles.bigNumbers}>
      {numbers.map(({ label, value, linkHref }) => (
        <div key={label} className={styles.bigNumber}>
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.value}>
            {linkHref ? (
              <a href={linkHref} className={styles.link}>
                {value}
              </a>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default BigNumbers
