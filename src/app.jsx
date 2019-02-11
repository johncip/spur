import React, { Component, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import sample from 'lodash.sample'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons/faGlobeAmericas'

import { createDiv, loadSettings, loadQuotes } from './util'

import 'Styles/app/style.scss'

const Quote = ({ quote }) => {
  const size = 160 * (1 / (quote.length ** 0.3))
  return (
    <div className="quoteBox--quote" style={{ fontSize: `${size}px` }}>
      {quote}
    </div>
  )
}

const Author = ({ author }) => (
  <div className="quoteBox--author">
    {author}
  </div>
)

const Rule = () => <hr className="quoteBox--rule" />

const Url = ({ url }) => (
  <div className="quoteBox--url">
    <a href={url}>
      <FontAwesomeIcon icon={faGlobeAmericas} />
      {url}
    </a>
  </div>
)

const Category = ({ category }) => (
  <div className="quoteBox--category">
    <FontAwesomeIcon icon={faBox} />
    <span id="categoryText">
      {category}
    </span>
  </div>
)

const OptionsLink = () => (
  <div className="quoteBox--optionsLink">
    <FontAwesomeIcon icon={faCog} onClick={() => browser.runtime.openOptionsPage()} />
  </div>
)

/*
 * A button captioned with an up or down triangle.
 */
const VerticalToggle = (props) => {
  const classes = classNames(
    'verticalToggle', {
      'verticalToggle-is-up': props.up,
      'verticalToggle-is-down': !props.up,
    }
  )
  return (
    <button type="button" className={classes} onClick={props.handleClick}>
      {props.up ? '▲' : '▼'}
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
    const { expanded } = this.state;
    return classNames(
      'quoteBox', {
        'quoteBox-is-expanded': expanded,
        'quoteBox-is-collapsed': !expanded,
      }
    )
  }

  render() {
    const { quote, author, url, category } = this.props;
    return (
      <div className={this.classes()}>
        <Quote quote={quote} />
        <Author author={author} />
        <Rule />

        {url && <Url url={url} />}
        <Category category={category} />
        <OptionsLink />

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
    if (!this.state.quote) return null

    return (
      <QuoteBox
        quote={this.state.quote}
        author={this.state.author}
        url={this.state.url}
        category={this.state.category}
      />
    )
  }
}

(async function main() {
  const settings = await loadSettings()
  document.documentElement.classList.add(settings.theme)
  ReactDOM.render(<AppRoot />, createDiv('l-root'))
})()
