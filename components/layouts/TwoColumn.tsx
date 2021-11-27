import styles from './TwoColumn.module.scss'

interface Props {
  mainContent: React.ReactNode
  sidebar: React.ReactNode
}

const TwoColumn: React.FC<Props> = ({ mainContent, sidebar }) => {
  return (
    <div className={styles.withSidebar}>
      <div>{mainContent}</div>
      <div>{sidebar}</div>
    </div>
  )
}

export default TwoColumn
