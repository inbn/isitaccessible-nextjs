import styles from './BigNumbers.module.scss'

interface Props {
  numbers: {
    label: string
    value: number
    linkHref: string
  }[]
}

const BigNumbers: React.FC<Props> = ({ numbers }) => {
  return (
    <dl className={styles.bigNumbers}>
      {numbers.map(({ label, value, linkHref }) => (
        <div key={label} className={styles.bigNumber}>
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.value}>
            <a href={linkHref} className={styles.link}>
              {value}
            </a>
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default BigNumbers
