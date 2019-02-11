import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'

import { createDiv, loadSettings, loadQuotes, trimStart } from './util'

import 'Styles/options/style.scss'

/*
 * The (behavior) settings section of the options page.
 */
// eslint-disable-next-line react/prefer-stateless-function
class SettingsSection extends Component {
  render() {
    return (
      <section className="optionsSection">
        <div className="setting">
          <label htmlFor="id-theme">
            <span className="setting--labelText">Theme</span>
            <select id="id-theme">
              <option value="indexCard">Index Card</option>
              <option value="indexCardDark">Index Card Dark</option>
            </select>
          </label>
        </div>

        <button className="btn btn-save" type="button">Save</button>
      </section>
    )
  }
}

/*
 * A clickable displayed quote.
 */
// TODO: this should be / contain a button for a11y
const QuoteListItem = ({ quote }) => (
  <li className="quoteListItem">
    {quote}
  </li>
)

const AddQuoteButton = () => (
  <li className="addQuoteButton">
    <FontAwesomeIcon icon={faPlus} />
    New quote…
  </li>
)


/*
 * The quotes section of the options page. An editable list of stored quotes.
 */
// eslint-disable-next-line react/prefer-stateless-function
class QuotesSection extends Component {
  // TODO: rename "quotes" (quoteRecords or something)
  render() {
    return (
      <section className="optionsSection">
        <ul>
          {this.props.quotes.map(record => (
            <QuoteListItem key={record.quote} quote={record.quote} />
            ))}
          <AddQuoteButton />
        </ul>
      </section>
    )
  }
}

/*
 * The entire options page.
 */
const OptionsPage = ({ settings, quotes }) => (
  <div className="optionsContainer">
    <h1 className="optionsHeading">Settings</h1>
    <SettingsSection settings={settings} />

    <h1 className="optionsHeading">Quotes</h1>
    <QuotesSection quotes={quotes} />
  </div>
)


async function main() {
  const settings = await loadSettings()
  const quotes = (await loadQuotes()).sort((a, b) => (
    trimStart(a.quote).localeCompare(trimStart(b.quote))
  ))

  ReactDOM.render(
    <OptionsPage settings={settings} quotes={quotes} />,
    createDiv('l-root'),
  )
}

main()
