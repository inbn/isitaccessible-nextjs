import Icon from '../Icon/Icon'
import styles from './PackageLinks.module.scss'

interface Props {
  links: {
    href: string
    icon: string
    label: string
  }[]
}

const PackageLinks: React.FC<Props> = ({ links }) => {
  return (
    <ul className={styles.packageLinks}>
      {links.map(({ label, icon, href }) => (
        <li key={label}>
          <a href={href} className="withIcon">
            <Icon name={icon} className={styles.socialIcon} />
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default PackageLinks
