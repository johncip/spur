import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import { bindActionCreators, createStore } from 'redux'
import { install as installLoop } from 'redux-loop'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faAt } from '@fortawesome/free-solid-svg-icons/faAt'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faFirefox } from '@fortawesome/free-brands-svg-icons/faFirefox'
import { faChrome } from '@fortawesome/free-brands-svg-icons/faChrome'

import * as actions from './actions'
import reducers from './reducers'
import { loadSettings, loadQuotes, summarize, polyfillBrowser } from './util'

import 'Styles/options/style.scss'

const store = createStore(reducers, undefined, installLoop())
const { dispatch, getState } = store

const {
  setActiveQuote, setNewActiveQuote, patchActiveQuote,
  updateSettings, updateQuotes,
  putQuote, deleteQuote, closeModal, dismissToast
} = bindActionCreators(actions, dispatch)


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


/*
 * A clickable displayed quote. Includes a pencil icon on hover.
 */
const EditQuoteButton = ({ quote }) => (
  <button
    type="button"
    className="editQuoteButton"
    onClick={() => setActiveQuote(quote)}
  >
    <div className="truncatedText" tabIndex="-1">
      <span>{quote.text}</span>
      <span className="inlineAuthor">{` — ${quote.author}`}</span>
    </div>
    <FontAwesomeIcon icon={faPencilAlt} className="editQuoteButton--pencil" />
  </button>
)


/*
 * Button for adding a new quote.
 */
const AddQuoteButton = () => (
  <button
    className="editQuoteButton editQuoteButton-add"
    type="button"
    onClick={() => setNewActiveQuote()}
  >
    <FontAwesomeIcon icon={faPlus} />
    New quote…
  </button>
)


/*
 * The quotes section of the options page. An editable list of stored quotes.
 */
const QuotesSection = ({ quotes }) => {
  const values = Array.from(quotes.values())
  return (
    <section className="optionsSection">
      {values.map(quote => (
        <EditQuoteButton
          key={quote.id}
          quote={quote}
        />
      ))}
      <AddQuoteButton />
    </section>
  )
}

/*
 * Future home of a link to spur in the chrome store.
 */
const ChromeStoreLink = () => (
  <a className="link" href="https://chrome.google.com/webstore/category/extensions">
    <FontAwesomeIcon icon={faChrome} />
    Spur in the
    <b> Chrome Web Store</b>
  </a>
)

/*
 * Future home of a link to spur in the firefox store.
 */
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
const OptionsPage = ({ settings, quotes }) => (
  <div className="optionsContainer">
    <h1 className="optionsHeading">Settings</h1>
    <SettingsSection settings={settings} />

    <h1 className="optionsHeading">Quotes</h1>
    <QuotesSection quotes={quotes} />

    <h1 className="optionsHeading">Links</h1>
    <LinksSection />
  </div>
)

/*
 * A save button for the modal.
 */
const SaveButton = ({ onClick }) => (
  <button
    type="button"
    className="btn btn-save"
    onClick={onClick}
  >
    Save
  </button>
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
const QuoteFormField = ({ name, value, onChange }) => (
  <div className="quoteForm--field">
    <label className="quoteForm--label" htmlFor={`id-${name}`}>
      {name}
    </label>
    <input
      id={`id-${name}`}
      className="quoteForm--input"
      value={value}
      onChange={onChange}
    />
  </div>
)


/*
 * A form for editing a quote. Buttons should be passed in as children.
 */
const QuoteForm = ({ text, author, url, category, children }) => {
  const handleChangeFor = field => event => patchActiveQuote(field, event.target.value)

  return (
    <form className="quoteForm">
      <div className="quoteForm--field">
        <label className="quoteForm--label" htmlFor="id-text">Quote</label>
        <textarea
          id="id-text"
          className="quoteForm--input quoteForm--input-textarea"
          value={text}
          onChange={handleChangeFor('text')}
        />
      </div>

      <QuoteFormField onChange={handleChangeFor('author')} name="Author" value={author} />
      <QuoteFormField onChange={handleChangeFor('url')} name="URL" value={url} />
      <QuoteFormField onChange={handleChangeFor('category')} name="Category" value={category} />

      <div className="btnContainer">
        {children}
      </div>
    </form>
  )
}


/*
 * A modal for editing the clicked-on quote.
 */
const EditModal = () => {
  const { activeQuote, quotes, modalIsOpen } = getState()
  const quoteExists = quotes.has(activeQuote.id)

  return (
    <Modal
      className="modal"
      overlayClassName="modalOverlay"
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel={quoteExists ? 'Edit Quote' : 'Add Quote'}
    >
      <h1 className="modal--heading">Edit Quote</h1>
      <hr className="modal--rule" />

      <QuoteForm
        text={activeQuote.text}
        author={activeQuote.author}
        url={activeQuote.url}
        category={activeQuote.category}
      >
        <SaveButton onClick={() => putQuote(activeQuote)} />
        {quoteExists
          ? <DeleteButton onClick={() => deleteQuote(activeQuote)} />
          : null}
        <CancelButton onClick={closeModal} />
      </QuoteForm>
    </Modal>
  )
}


/*
 * Displays a floating notification in response to some action.
 */
const Toast = ({ alertType, quote, shown, onClose }) => {
  const classes = classNames(
    'toast', {
      'toast-hidden': !shown
    }
  )

  const message = (() => {
    if (!quote) return null
    const prefix = `Quote ${summarize(quote.text)}`

    switch (alertType) {
      case 'save':
        return `${prefix} saved.`
      case 'delete':
        return `${prefix} deleted.`
      default:
        return 'error'
    }
  })()

  return quote ? (
    <div className={classes}>
      <div className="toast--message">
        {message}
        <button type="button" className="toast--undoBtn">Undo</button>
      </div>
      <button type="button" className="toast--closeBtn" onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  ) : null
}


/*
 * Loads the options page and holds state.
 */
const AppRoot = () => {
  const { settings, quotes, toast: { alertType, quote, shown } } = getState()
  const fetched = settings.size && quotes.size

  useEffect(() => {
    if (fetched) return
    loadSettings().then(updateSettings)
    loadQuotes().then(updateQuotes)
  })

  return fetched ? [
    <Toast
      key="toast"
      alertType={alertType}
      quote={quote}
      shown={shown}
      onClose={dismissToast}
    />,
    <OptionsPage
      key="opts"
      settings={settings}
      quotes={quotes}
    />,
    <EditModal key="edit-modal" />
  ] : null
}


polyfillBrowser()
const render = () => ReactDOM.render(<AppRoot />, window.root)
store.subscribe(render)
Modal.setAppElement('#root')
render()
