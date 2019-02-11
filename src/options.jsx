import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'

import { createDiv, loadSettings, loadQuotes, trimStart } from './util'

import 'Styles/options/style.scss'

/*
 * The entire options page.
 */
class OptionsPage extends PureComponent {
  render() {
    return (
      <div className="optionsContainer">
        <h1 className="optionsHeading">Settings</h1>
        <SettingsSection settings={this.props.settings} />

        <h1 className="optionsHeading">Quotes</h1>
        <QuotesSection quotes={this.props.quotes} />
      </div>
    )
  }
}

/*
 * The (behavior) settings section of the options page.
 */
// eslint-disable-next-line react/prefer-stateless-function
class SettingsSection extends PureComponent {
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

/*
 * The quotes section of the options page. An editable list of stored quotes.
 */
class QuotesSection extends PureComponent {
  // TODO: rename "quotes" (quoteRecords or something)
  render() {
    return (
      <section className="optionsSection">
        <ul>
          {this.props.quotes.map(record => (
            <QuoteListItem key={record.quote} quote={record.quote} />
          ))}
        </ul>
      </section>
    )
  }
}

(async function main() {
  const settings = await loadSettings()
  const quotes = (await loadQuotes()).sort((a, b) => (
    trimStart(a.quote).localeCompare(trimStart(b.quote))
  ))
  ReactDOM.render(
    <OptionsPage settings={settings} quotes={quotes} />,
    await createDiv('l-root'),
  )
})()
