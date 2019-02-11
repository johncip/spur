import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'

import { createDiv, loadSettings, loadQuotes } from './util'

import 'Styles/options/style.scss'

class OptionsPage extends PureComponent {
  render() {
    return (
      <div className="optionsContainer">
        <h1 className="optionsHeading">Options</h1>
        <SettingsSection settings={this.props.settings} />
        <QuotesSection quotes={this.props.quotes} />
      </div>
    )
  }
}

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

        <div className="setting">
          <label htmlFor="id-wake-time">
            <span className="setting--labelText">Wake Time</span>
            <input type="text" id="id-wake-time" />
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
      <li className="quoteListItem">
        <DisplayedQuote key={record.quote} quote={record.quote} />
      </li>
    )
  }

  render() {
    return (
      <section className="optionsSection">
        <ul>{this.props.quotes.map(record => this.constructor.renderQuote(record))}</ul>
      </section>
    )
  }
}

class DisplayedQuote extends PureComponent {
  static stripStart(str) {
    return str.replace(/^\W+/, '');
  }

  render() {
    return (
      <div className="displayedQuote">
        {this.constructor.stripStart(this.props.quote)}
      </div>
    )
  }
}

// class EditableQuote extends PureComponent {
//   render() {
//     return (
//       <div>
//         <textarea className="edit edit-quote">{this.props.quote}</textarea>
//         <input type="text" className="edit edit-author" value={this.props.author} />
//         <input type="text" className="edit edit-category" value={this.props.category} />
//         <input type="text" className="edit edit-url" value={this.props.url} />
//       </div>
//     )
//   }
// }

(async function main() {
  const settings = await loadSettings()
  const quotes = await loadQuotes()
  ReactDOM.render(<OptionsPage settings={settings} quotes={quotes} />, createDiv('l-root'))
})()
