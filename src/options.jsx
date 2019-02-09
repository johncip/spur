import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'

import { loadOptions, loadQuotes } from './util'

import 'Styles/options.scss'


class OptionsPage extends PureComponent {
  render() {
    return (
      <div className="l-container">
        <h1>Options</h1>
        <SettingsSection settings={this.props.settings} />
        <QuotesSection quotes={this.props.quotes} />
      </div>
    )
  }
}

class SettingsSection extends PureComponent {
  render() {
    return (
      <section className="optionSection">
        <div className="setting">
          <label htmlFor="theme">
            <span className="settingLabel">Theme</span>
            <select id="theme">
              <option value="indexCard">Index Card</option>
              <option value="indexCardDark">Index Card Dark</option>
            </select>
          </label>
        </div>

        <div className="setting">
          <label htmlFor="wakeTime">
            <span className="settingLabel">Wake Time</span>
            <input type="text" id="wakeTime" />
          </label>
        </div>

        <div>
          <button className="btn btn-save" type="button">Save</button>
          <span id="savedStatus">Not saved.</span>
        </div>
      </section>
    )
  }
}

class QuotesSection extends PureComponent {
  static renderQuote(record) {
    return (
      <li>
        <div className="quoteListItem">
          <div className="quoteListItem--first">
            <DisplayedQuote quote={record.quote} />
          </div>
          <div className="quoteListItem--second">
            <button className="btn btn-delete" type="button">✖</button>
          </div>
        </div>
      </li>
    )
  }

  render() {
    return (
      <section className="optionSection">
        <ul>{this.props.quotes.map(record => this.constructor.renderQuote(record))}</ul>
      </section>
    )
  }
}

class EditableQuote extends PureComponent {
  render() {
    return (
      <div>
        <textarea className="edit edit-quote">{this.props.quote}</textarea>
        <input type="text" className="edit edit-author" value={this.props.author} />
        <input type="text" className="edit edit-category" value={this.props.category} />
        <input type="text" className="edit edit-url" value={this.props.url} />
      </div>
    )
  }
}

class DisplayedQuote extends PureComponent {
  render() {
    return (
      <div className="display display-quote">
        {this.props.quote}
      </div>
    )
  }
}

(async function main() {
  const settings = await loadOptions()
  const quotes = await loadQuotes()

  ReactDOM.render(
    <OptionsPage settings={settings} quotes={quotes} />,
    document.body,
  )
})()
