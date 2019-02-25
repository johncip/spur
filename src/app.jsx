import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import sample from 'lodash.sample'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons/faGlobeAmericas'

import { loadSettings, loadQuotes, polyfillBrowser } from './util'
import 'Styles/app/style.scss'

polyfillBrowser()

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
class AppRoot extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: undefined,
      author: undefined,
      url: undefined,
      category: undefined,
      expanded: false
    }
  }

  componentDidMount() {
    loadQuotes().then(quotes => this.setState(sample(quotes)))
  }

  toggle = () => {
    this.setState(old => ({ expanded: !old.expanded }))
  }

  render() {
    if (!this.state.text) return null

    return [
      <OptionsButton key="opts-btn" />,
      <QuoteBox
        key="quote-box"
        text={this.state.text}
        author={this.state.author}
        url={this.state.url}
        category={this.state.category}
        expanded={this.state.expanded}
        toggle={this.toggle}
      />
    ]
  }
}

async function main() {
  const settings = await loadSettings()
  const rootEl = document.getElementById('root')
  rootEl.classList.add(settings.theme)
  ReactDOM.render(<AppRoot />, rootEl)
}

main()
