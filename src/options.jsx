import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import classNames from 'classnames'
import { createStore } from 'redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faAt } from '@fortawesome/free-solid-svg-icons/faAt'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faFirefox } from '@fortawesome/free-brands-svg-icons/faFirefox'
import { faChrome } from '@fortawesome/free-brands-svg-icons/faChrome'

import reducers from './reducers'
import {
  setActiveQuote,
  setNewActiveQuote,
  openModal,
  closeModal,
  updateSettings,
  updateQuoteRecords,
  putQuoteRecord,
  // saveQuoteRecords,
  deleteQuoteRecord,
} from './actions'
import { compose2, loadSettings, loadQuotes } from './util'

import 'Styles/options/style.scss'

const store = createStore(reducers)


/*
 * The settings section of the options page.
 */
const SettingsSection = () => (
  <section className="optionsSection">
    <div className="setting">
      <label htmlFor="id-theme">
        <span className="setting--labelText">Theme</span>
        <select className="setting--select" id="id-theme">
          <option value="indexCard">Index Card</option>
          <option value="indexCardDark">Index Card Dark</option>
        </select>
      </label>
    </div>

    <button className="btn btn-save" type="button">Save</button>
  </section>
)


// TODO: use hooks for hover
/*
 * A clickable displayed quote. Includes a pencil icon on hover.
 */
class EditQuoteButton extends Component {
  constructor(props) {
    super(props)
    this.state = { hover: false }
  }

  handleMouseEnter = () => {
    this.setState({ hover: true })
  }

  handleMouseLeave = () => {
    this.setState({ hover: false })
  }

  handleClick = () => {
    store.dispatch(setActiveQuote(this.props.quoteRecord))
    store.dispatch(openModal())
  }

  classes() {
    return classNames(
      'editQuoteButton', {
        'editQuoteButton-is-hovered': this.state.hover,
      },
    )
  }

  render() {
    const { quoteRecord: { quote, author } } = this.props
    return (
      <button
        className={this.classes()}
        type="button"
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onFocus={this.handleMouseEnter}
        onBlur={this.handleMouseLeave}
      >
        <div className="truncatedText">
          <span>{quote}</span>
          <span className="inlineAuthor">{` — ${author}`}</span>
        </div>
        {this.state.hover ? <FontAwesomeIcon icon={faPencilAlt} /> : null}
      </button>
    )
  }
}


/*
 * Button for adding a new quote.
 */
class AddQuoteButton extends Component {
  handleClick = () => {
    store.dispatch(setNewActiveQuote())
    store.dispatch(openModal())
  }

  render() {
    return (
      <button
        className="editQuoteButton editQuoteButton-add"
        type="button"
        onClick={this.handleClick}
      >
        <FontAwesomeIcon icon={faPlus} />
        New quote…
      </button>
    )
  }
}


/*
 * The quotes section of the options page. An editable list of stored quotes.
 */
const QuotesSection = ({ quoteRecords }) => {
  const values = Array.from(quoteRecords.values())
  return (
    <section className="optionsSection">
      {values.map(quoteRecord => (
        <EditQuoteButton
          key={quoteRecord.id}
          quoteRecord={quoteRecord}
        />
      ))}
      <AddQuoteButton />
    </section>
  )
}

const ChromeStoreLink = () => (
  <a className="link" href="https://chrome.google.com/webstore/category/extensions">
    <FontAwesomeIcon icon={faChrome} />
    Spur in the
    <b> Chrome Web Store</b>
  </a>
)

const FirefoxStoreLink = () => (
  <a className="link" href="https://addons.mozilla.org/en-US/firefox/">
    <FontAwesomeIcon icon={faFirefox} />
    Spur at
    <b> Firefox Add-ons</b>
  </a>
)

/*
 * Links section.
 */
const LinksSection = () => (
  <section className="optionsSection">
    <a className="link" href="https://github.com/johncip/spur">
      <FontAwesomeIcon icon={faGithub} />
      Spur on
      <b> GitHub</b>
    </a>

    {navigator.userAgent.includes('Firefox') ? <FirefoxStoreLink /> : null}
    {navigator.userAgent.includes('Chrome') ? <ChromeStoreLink /> : null}

    <a className="link" href="mailto:spur.tab@gmail.com">
      <FontAwesomeIcon icon={faAt} />
      Email John at
      <b> spur.tab@gmail.com</b>
    </a>

    <p>
      Thanks for using Spur! If you like it, please consider leaving a rating!
      <span role="img" aria-label="surf emoji"> 🏄</span>
    </p>
  </section>
)

/*
 * The entire options page.
 */
const OptionsPage = ({ settings, quoteRecords }) => (
  <div className="optionsContainer">
    <h1 className="optionsHeading">Settings</h1>
    <SettingsSection settings={settings} />

    <h1 className="optionsHeading">Quotes</h1>
    <QuotesSection quoteRecords={quoteRecords} />

    <h1 className="optionsHeading">Links</h1>
    <LinksSection />
  </div>
)

/*
 * A cancel button for the modals.
 */
const CancelButton = ({ onClick }) => (
  <button
    type="button"
    className="btn btn-cancel"
    onClick={onClick}
  >
    Cancel
  </button>
)


/*
 * A button for the edit modals that deletes the active quote.
 */
const DeleteButton = ({ onClick }) => (
  <button
    type="button"
    className="btn btn-delete"
    onClick={onClick}
  >
    Delete
  </button>
)

/*
 * A parameterized input for the quote form.
 */
const QuoteFormField = ({ name, value, handleChange }) => (
  <div className="quoteForm--field">
    <label className="quoteForm--label" htmlFor={`id-${name}`}>
      {name}
    </label>
    <input
      id={`id-${name}`}
      className="quoteForm--input"
      value={value}
      onChange={event => handleChange(name.toLowerCase(), event)}
    />
  </div>
)


/*
 * A form for editing a quote. Buttons should be passed in as children.
 */
const QuoteForm = ({ quote, author, url, category, children, handleChange }) => (
  <form className="quoteForm">
    <div className="quoteForm--field">
      <label className="quoteForm--label" htmlFor="id-quote">Quote</label>
      <textarea
        id="id-quote"
        className="quoteForm--input quoteForm--input-textarea"
        value={quote}
        onChange={event => handleChange('quote', event)}
      />
    </div>

    <QuoteFormField name="Author" value={author} handleChange={handleChange} />
    <QuoteFormField name="URL" value={url} handleChange={handleChange} />
    <QuoteFormField name="Category" value={category} handleChange={handleChange} />

    <div className="btnContainer">
      {children}
    </div>
  </form>
)


// TODO: make this a presentational component?
// TODO: add a prop for whether or not to allow delete
// TODO: parameterize title
/*
 * A modal for editing the clicked-on quote.
 */
class EditModal extends Component {
  closeModal = () => {
    store.dispatch(closeModal())
  }

  handleChange = (field, event) => {
    store.dispatch(
      setActiveQuote(
        Object.assign({}, store.getState().activeQuote, { [field]: event.target.value }),
      ),
    )
  }

  handleSave = () => {
    store.dispatch(putQuoteRecord(store.getState().activeQuote))
    // store.dispatch(saveQuoteRecords())
    this.closeModal()
  }

  handleDelete = () => {
    store.dispatch(deleteQuoteRecord(store.getState().activeQuote.id))
    // store.dispatch(saveQuoteRecords())
    this.closeModal()
  }

  render() {
    const { activeQuote, quoteRecords, modalIsOpen } = store.getState()
    const { quote, author, url, category } = activeQuote
    const quoteExists = quoteRecords.has(activeQuote.id)

    return (
      <Modal
        className="modal"
        overlayClassName="modalOverlay"
        isOpen={modalIsOpen}
        onRequestClose={this.closeModal}
        contentLabel={quoteExists ? 'Edit Quote' : 'Add Quote'}
      >
        <h1 className="modal--heading">Edit Quote</h1>
        <hr className="modal--rule" />

        <QuoteForm
          quote={quote}
          author={author}
          url={url}
          category={category}
          handleChange={this.handleChange}
        >
          <button
            type="button"
            className="btn btn-save"
            onClick={this.handleSave}
          >
            Save
          </button>
          {quoteExists ? <DeleteButton onClick={this.handleDelete} /> : null}
          <CancelButton onClick={this.closeModal} />
        </QuoteForm>
      </Modal>
    )
  }
}


/*
 * Loads the options page and holds state.
 */
class AppRoot extends Component {
  componentDidMount() {
    // TODO: move this stuff into the store
    loadSettings().then(compose2(store.dispatch, updateSettings))
    loadQuotes().then(compose2(store.dispatch, updateQuoteRecords))
  }

  render() {
    const { settings, quoteRecords } = store.getState()
    if (!settings.size || !quoteRecords.size) {
      return null
    }

    return [
      <OptionsPage
        key="opts"
        settings={settings}
        quoteRecords={quoteRecords}
      />,
      <EditModal key="edit-modal" />,
    ]
  }
}


const rootEl = document.getElementById('root')
Modal.setAppElement('#root')
const render = () => {
  ReactDOM.render(<AppRoot />, rootEl)
}
store.subscribe(render)
render()
