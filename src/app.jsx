import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import sample from 'lodash.sample'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons/faGlobeAmericas'

import { createRootDiv, loadSettings, loadQuotes } from './util'

import 'Styles/app/style.scss'

/*
 * The main text of a quote.
 */
const Quote = ({ quote }) => {
  const size = 160 * (1 / (quote.length ** 0.3))
  return (
    <div className="quoteBox--quote" style={{ fontSize: `${size}px` }}>
      {quote}
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
    <span id="categoryText">
      {category}
    </span>
  </div>
)

/*
 * A gear linking to the options page.
 */
const OptionsButton = () => (
  <button
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
      'verticalToggle-is-down': !up,
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
class QuoteBox extends Component {
  constructor(props) {
    super(props)
    this.state = { expanded: false }
  }

  toggleDrawer = () => {
    this.setState(old => ({ expanded: !old.expanded }))
  }

  classes() {
    const { expanded } = this.state
    return classNames(
      'quoteBox', {
        'quoteBox-is-expanded': expanded,
        'quoteBox-is-collapsed': !expanded,
      },
    )
  }

  render() {
    const { quote, author, url, category } = this.props
    return (
      <div className={this.classes()}>
        <Quote quote={quote} />
        <Author author={author} />
        <Rule />

        {url && <Info url={url} />}
        <Category category={category} />

        <VerticalToggle
          up={this.state.expanded}
          handleClick={this.toggleDrawer}
        />
      </div>
    )
  }
}

/*
 * Loads a quote and renders the <QuoteBox />.
 */
class AppRoot extends Component {
  constructor(props) {
    super(props)

    this.state = {
      quote: undefined,
      author: undefined,
      url: undefined,
      category: undefined,
    }
  }

  componentDidMount() {
    loadQuotes().then(qs => this.setState(sample(qs)))
  }

  render() {
    if (!this.state.quote) return null;

    return (
      <div className="u-fullWidth">
        <OptionsButton />
        <QuoteBox
          quote={this.state.quote}
          author={this.state.author}
          url={this.state.url}
          category={this.state.category}
        />
      </div>
    )
  }
}

async function main() {
  const settings = await loadSettings()
  document.documentElement.classList.add(settings.theme)
  ReactDOM.render(<AppRoot />, createRootDiv())
  // browser.runtime.openOptionsPage()
}

main()
