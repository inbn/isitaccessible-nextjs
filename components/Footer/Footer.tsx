import classNames from 'classnames'

import Icon from '../Icon/Icon'
import Center from '../layouts/Center'
import Stack from '../layouts/Stack'
import styles from './Footer.module.scss'

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Center>
        <div className={styles.grid}>
          <Stack>
            <h2>About</h2>
            <p>
              When choosing a third-party library, it’s common to take into
              account its impact on performance, but what about its impact on
              accessibility? <em>IsItAccessible.dev</em> aggregates
              accessibility-related issues from GitHub to help you quickly make
              an informed decision.
            </p>
            <p>
              Please note that the content of this site should be used as a
              guide only. Zero accessibility-related issues on GitHub does not
              mean a perfectly accessible package — it just means that no issues
              have been reported.
            </p>
          </Stack>
          <Stack>
            <h2>Acknowledgments</h2>
            <p>
              This site was inspired by{' '}
              <a href="https://bundlephobia.com/">bundlephobia</a>, an
              indispensable tool for understanding the size of an npm package
              before it becomes a part of your bundle. It also wouldn’t be
              possible without the <a href="https://npms.io/">npms.io</a> API.
            </p>
            <h2>Contribute</h2>
            <p>
              Have an idea for a feature? Create an Issue or Pull Request on{' '}
              <a
                href="https://github.com/inbn/isitaccessible-nextjs"
                className={classNames(styles.socialLink, 'withIcon')}
              >
                <Icon name="github" className={styles.socialIcon} />
                GitHub
              </a>
              .
            </p>
          </Stack>
        </div>
      </Center>
    </footer>
  )
}

export default Footer
