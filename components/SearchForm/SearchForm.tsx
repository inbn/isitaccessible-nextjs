import {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
  MouseEvent,
} from 'react'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import useKey from '@rooks/use-key'

import { getSuggestions, Package } from '../../lib/npm-packages'

import styles from './SearchForm.module.scss'

const SearchForm: FunctionComponent = () => {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<Package[]>([])
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)
  const searchFormRef = useRef() as React.MutableRefObject<HTMLDivElement>
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

    console.log('event code:', e.code)
    console.log('results: ', results)
    console.log('selectedItemIndex: ', selectedItemIndex)

    switch (e.code) {
      case 'ArrowUp':
        e.preventDefault()
        setSelectedItemIndex((prevSelectedItemIndex) =>
          prevSelectedItemIndex > -1
            ? prevSelectedItemIndex - 1
            : results.length - 1
        )
        break

      case 'ArrowDown':
        e.preventDefault()
        setSelectedItemIndex((prevSelectedItemIndex) =>
          prevSelectedItemIndex < results.length - 1
            ? prevSelectedItemIndex + 1
            : 0
        )
        break

      case 'Enter':
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

  useKey(['ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Tab'], handleKeyPressed)

  return (
    <div ref={searchFormRef}>
      {!!results.length && query && (
        <p
          className="visually-hidden"
          id={`search-results-count`}
          aria-live="polite"
          aria-atomic="true"
        >
          Found {results.length} results for “{query}”
        </p>
      )}
      <div
        role="combobox"
        aria-expanded={isOpen && !!results.length}
        aria-owns={`search-results-listbox`}
        aria-haspopup="listbox"
      >
        <input
          id="search-input"
          className={styles.input}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ol
          id={`search-results-listbox`}
          className={styles.results}
          role="listbox"
          hidden={!isOpen || !results.length}
        >
          {results.map(({ package: { name } }, i) => (
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
              {name}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default SearchForm
