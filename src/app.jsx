import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import sample from 'lodash.sample'
import { compose } from 'redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons/faGlobeAmericas'

import { loadSettings, loadQuotes, polyfillBrowser } from './util'
import 'Styles/app/style.scss'


/*
 * The main text of a quote.
 */
const Quote = ({ text }) => {
  const size = 160 * (1 / (text.length ** 0.3))
  return (
    <div className="quoteBox--text" style={{ fontSize: `${size}px` }}>
      {text}
    </div>
  )
}

/*
 * The quote's author.
 */
const Author = ({ author }) => (
  <div className="quoteBox--author">
    {author}
  </div>
)

/*
 * A horizonal rule.
 */
const Rule = () => <hr className="quoteBox--rule" />

/*
 * A link to additional info, like the quote's source.
 */
const Info = ({ url }) => (
  <a href={url} className="quoteBox--infoLink">
    <FontAwesomeIcon icon={faGlobeAmericas} />
    {url}
  </a>
)

/*
 * The quote's category.
 */
const Category = ({ category }) => (
  <div className="quoteBox--category">
    <FontAwesomeIcon icon={faBox} />
    {category}
  </div>
)

/*
 * A gear linking to the options page.
 */
const OptionsButton = () => (
  <button
    type="button"
    className="optionsButton"
    onClick={() => browser.runtime.openOptionsPage()}
  >
    <FontAwesomeIcon icon={faCog} />
  </button>
)

/*
 * A button captioned with an up or down triangle.
 */
const VerticalToggle = ({ up, handleClick }) => {
  const classes = classNames(
    'verticalToggle', {
      'verticalToggle-is-up': up,
      'verticalToggle-is-down': !up
    },
  )
  return (
    <button type="button" className={classes} onClick={handleClick}>
      {up ? '▲' : '▼'}
    </button>
  )
}

/*
 * A displayed quote, with author, etc.
 */
const QuoteBox = ({ text, author, url, category, expanded, toggle }) => {
  const classes = classNames(
    'quoteBox', {
      'quoteBox-is-expanded': expanded,
      'quoteBox-is-collapsed': !expanded
    },
  )
  return (
    <div className={classes}>
      <Quote text={text} />
      <Author author={author} />
      <Rule />
      {url && <Info url={url} />}
      <Category category={category} />
      <VerticalToggle up={expanded} handleClick={toggle} />
    </div>
  )
}

/*
 * Loads a quote and renders the <QuoteBox />.
 */
const AppRoot = () => {
  const [expanded, setExpanded] = useState(false)
  const [quote, setQuote] = useState({})
  const loaded = !!quote.text

  useEffect(() => {
    if (!loaded) loadQuotes().then(compose(setQuote, sample))
  })

  return loaded ? [
    <OptionsButton key="opts-btn" />,
    <QuoteBox
      key="quote-box"
      text={quote.text}
      author={quote.author}
      url={quote.url}
      category={quote.category}
      expanded={expanded}
      toggle={() => setExpanded(!expanded)}
    />
  ] : null
}

async function main() {
  polyfillBrowser()
  const settings = await loadSettings()
  window.root.classList.add(settings.theme)
  ReactDOM.render(<AppRoot />, window.root)
}

main()
