import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'

import { createDiv, loadSettings, loadQuotes } from './util'

import 'Styles/options/style.scss'

function stripStart(str) {
  return str.replace(/^\W+/, '');
}

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

        <div>
          <button className="btn btn-save" type="button">Save</button>
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
  render() {
    return (
      <div className="displayedQuote">
        {stripStart(this.props.quote)}
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
  const quotes = (await loadQuotes()).sort((a, b) => {
    return stripStart(a.quote).localeCompare(stripStart(b.quote))
  })
  ReactDOM.render(<OptionsPage settings={settings} quotes={quotes} />, createDiv('l-root'))
})()
