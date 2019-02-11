import React, { Component, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons/faGlobeAmericas'

import { createDiv, loadSettings, loadQuotes } from './util'

import 'Styles/app/style.scss'

/*
 * A button captioned with an up or down triangle.
 */
class VerticalToggle extends PureComponent {
  classes() {
    return classNames({
      verticalToggle: true,
      'verticalToggle-is-up': this.props.up,
      'verticalToggle-is-down': !this.props.up,
    })
  }

  render() {
    return (
      <button className={this.classes()} onClick={this.props.handleClick} type="button">
        {this.props.up ? '▲' : '▼'}
      </button>
    )
  }
}

/*
 * A displayed quote, with author, etc.
 */
class Quote extends Component {
  /**
   * Returns an appropriate font size for the given string. That is, longer strings will
   * return a smaller size, and shorter strings will return a larger size.
   *
   *  TODO: this should scale, so that a base size can be set in css
   */
  static adjustedFontSize(text) {
    const size = 160 * (1 / (text.length ** 0.3))
    return `${size}px`
  }

  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
    }
  }

  /**
   * Reverses state.expanded (which hides & shows the URL and category).
   */
  toggleDrawer = () => {
    this.setState(prev => ({ expanded: !prev.expanded }))
  }

  classes() {
    return classNames({
      quoteBox: true,
      'quoteBox-is-expanded': this.state.expanded,
      'quoteBox-is-collapsed': !this.state.expanded,
    })
  }

  render() {
    const quoteFontSize = this.constructor.adjustedFontSize(this.props.quote)

    return (
      <div className={this.classes()}>
        <div className="quoteBox--quote" style={{ fontSize: quoteFontSize }}>
          {this.props.quote}
        </div>
        <div className="quoteBox--author">{this.props.author}</div>
        <hr className="quoteBox--rule" />

        {this.props.url &&
          <div className="quoteBox--url">
            <a href={this.props.url}>
              <FontAwesomeIcon icon={faGlobeAmericas} />
              {this.props.url}
            </a>
          </div>
        }

        <div className="quoteBox--category">
          <FontAwesomeIcon icon={faBox} />
          <span id="categoryText">{this.props.category}</span>
        </div>

        <div className="quoteBox--optionsLink">
          <FontAwesomeIcon icon={faCog} onClick={() => browser.runtime.openOptionsPage()}/>
        </div>

        <VerticalToggle
          up={this.state.expanded}
          handleClick={this.toggleDrawer}
        />
      </div>
    )
  }
}

// TODO: load quote outside of react? we have to load the settings outside anyway
/*
 * Loads a quote and renders the <Quote/>.
 */
class QuoteLoader extends Component {
  static randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

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
    loadQuotes().then((quotes) => {
      this.setState(this.constructor.randomItem(quotes))
    })
  }

  render() {
    if (!this.state.quote) return null

    return (
      <Quote
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
  ReactDOM.render(<QuoteLoader />, createDiv('l-root'))
})()
