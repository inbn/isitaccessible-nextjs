import { useEffect, useRef, useState, MouseEvent } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import useKey from '@rooks/use-key'

import { getSuggestions, Package } from '../../lib/npm-packages'

import Icon from '../Icon/Icon'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden'

import styles from './SearchForm.module.scss'

const SearchForm: React.FC = () => {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<Package[]>([])
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)
  const searchFormRef = useRef() as React.MutableRefObject<HTMLFormElement>
  const selectedItemRef = useRef() as React.MutableRefObject<HTMLLIElement>

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    const selectedResult = results[selectedItemIndex]
    if (selectedResult) {
      router.push(`package/${selectedResult.package.name}`)
    }
  }

  const handleClickOutside = (e: Event) => {
    // Inside click
    if (
      searchFormRef.current &&
      searchFormRef.current.contains(e.target as Node)
    ) {
      setIsOpen(true)
      return
    }
    // Outside click
    setIsOpen(false)
  }

  const handleKeyPressed = (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement
    if (target?.id !== 'search-input') {
      return
    }

    // console.log('event code:', e.code)
    // console.log('results: ', results)
    // console.log('selectedItemIndex: ', selectedItemIndex)

    switch (e.code) {
      case 'ArrowUp':
        e.preventDefault()
        // metaKey + arrowUp = select first item
        if (e.metaKey && results.length) {
          setSelectedItemIndex(0)
        } else {
          setSelectedItemIndex((prevSelectedItemIndex) =>
            prevSelectedItemIndex > -1
              ? prevSelectedItemIndex - 1
              : results.length - 1
          )
        }

        break

      case 'ArrowDown':
        e.preventDefault()
        // metaKey + arrowDown = select last item
        if (e.metaKey && results.length) {
          setSelectedItemIndex(results.length - 1)
        } else {
          setSelectedItemIndex((prevSelectedItemIndex) =>
            prevSelectedItemIndex < results.length - 1
              ? prevSelectedItemIndex + 1
              : 0
          )
        }
        break

      case 'Enter':
        // We don't want to submit the form
        e.preventDefault()
        if (results.length) {
          const selectedResult = results[selectedItemIndex]
          if (selectedResult) {
            router.push(`package/${selectedResult.package.name}`)
          }
        }
        break

      // Close the results and reset selectedItemIndex
      case 'Escape':
        setIsOpen(false)
        setSelectedItemIndex(-1)
        break

      case 'Home':
        e.preventDefault()
        if (results.length) {
          setSelectedItemIndex(1)
        }
        break

      case 'End':
        e.preventDefault()
        if (results.length) {
          setSelectedItemIndex(results.length - 1)
        }
        break

      case 'Tab':
        setIsOpen(false)
        break

      default:
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    async function fetchSuggestions() {
      const suggestions = await getSuggestions(query)
      setResults(suggestions)

      if (suggestions.length > 0) {
        setIsOpen(true)
        setSelectedItemIndex(0)
      }

      if (!suggestions) setResults([])
    }

    fetchSuggestions()
  }, [query])

  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      })
    }
  }, [selectedItemIndex])

  useKey(
    ['ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Tab', 'Home', 'End'],
    handleKeyPressed
  )

  return (
    <form
      autoComplete="off"
      ref={searchFormRef}
      action="/package"
      className={styles.form}
    >
      {!!results.length && query && (
        <p
          className="visually-hidden"
          id="search-results-count"
          aria-live="polite"
          aria-atomic="true"
        >
          Found {results.length} results for “{query}”
        </p>
      )}
      <div
        role="combobox"
        aria-expanded={isOpen && !!results.length}
        aria-owns="search-results-listbox"
        aria-haspopup="listbox"
      >
        <input
          id="search-input"
          name="name"
          className={classNames({
            [styles.input]: true,
            [styles.open]: isOpen,
          })}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ol
          id="search-results-listbox"
          className={styles.results}
          role="listbox"
          hidden={!isOpen || !results.length}
        >
          {results.map(({ package: { name, description } }, i) => (
            <li
              key={name}
              id={`result-${i}`}
              role="option"
              aria-selected={i === selectedItemIndex}
              ref={i === selectedItemIndex ? selectedItemRef : null}
              className={styles.result}
              onClick={handleClick}
              onMouseOver={() => setSelectedItemIndex(i)}
            >
              <span className={styles.packageName}>{name}</span>
              {!!description && (
                <p className={styles.packageDescription}>{description}</p>
              )}
            </li>
          ))}
        </ol>
      </div>
      <button
        type="submit"
        className={styles.submit}
        // onClick={(e) => {
        //   e.preventDefault()
        //   router.push(`package/${query}`)
        // }}
      >
        <VisuallyHidden>Submit search</VisuallyHidden>
        <Icon name="search" />
      </button>
    </form>
  )
}

export default SearchForm
