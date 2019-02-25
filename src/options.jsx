import React, { Component, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
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
  patchActiveQuote,
  closeModal,
  updateSettings,
  updateQuoteRecords,
  putQuoteRecord,
  deleteQuoteRecord,
} from './actions'
import { compose2, loadSettings, loadQuotes } from './util'

import 'Styles/options/style.scss'


const store = createStore(reducers)
const { dispatch, getState } = store


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
const EditQuoteButton = ({ quoteRecord }) => (
  <button
    type="button"
    className="editQuoteButton"
    onClick={() => dispatch(setActiveQuote(quoteRecord))}
  >
    <div className="truncatedText">
      <span>{quoteRecord.quote}</span>
      <span className="inlineAuthor">{` — ${quoteRecord.author}`}</span>
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
    onClick={() => dispatch(setNewActiveQuote())}
  >
    <FontAwesomeIcon icon={faPlus} />
    New quote…
  </button>
)


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


/*
 * A modal for editing the clicked-on quote.
 */
const EditModal = () => {
  const { activeQuote, quoteRecords, modalIsOpen } = getState()
  const handleClose = compose2(dispatch, closeModal)
  const handleDelete = () => dispatch(deleteQuoteRecord(activeQuote.id))
  const handleChange = (field, event) => {
    dispatch(patchActiveQuote({ [field]: event.target.value }))
  }
  const quoteExists = quoteRecords.has(activeQuote.id)

  return (
    <Modal
      className="modal"
      overlayClassName="modalOverlay"
      isOpen={modalIsOpen}
      onRequestClose={handleClose}
      contentLabel={quoteExists ? 'Edit Quote' : 'Add Quote'}
    >
      <h1 className="modal--heading">Edit Quote</h1>
      <hr className="modal--rule" />

      <QuoteForm
        quote={activeQuote.quote}
        author={activeQuote.author}
        url={activeQuote.url}
        category={activeQuote.category}
        handleChange={handleChange}
      >
        <button
          type="button"
          className="btn btn-save"
          onClick={() => dispatch(putQuoteRecord(activeQuote))}
        >
          Save
        </button>
        {quoteExists
          ? <DeleteButton onClick={handleDelete} />
          : null}
        <CancelButton onClick={handleClose} />
      </QuoteForm>
    </Modal>
  )
}


/*
 * Loads the options page and holds state.
 */
const AppRoot = () => {
  const { settings, quoteRecords } = getState()
  const fetched = settings.size && quoteRecords.size

  useEffect(() => {
    if (fetched) { return }
    loadSettings().then(compose2(dispatch, updateSettings))
    loadQuotes().then(compose2(dispatch, updateQuoteRecords))
  })

  return fetched ? [
    <OptionsPage
      key="opts"
      settings={settings}
      quoteRecords={quoteRecords}
    />,
    <EditModal key="edit-modal" />,
  ] : null
}


const rootEl = document.getElementById('root')
Modal.setAppElement('#root')
const render = () => {
  ReactDOM.render(<AppRoot />, rootEl)
}
store.subscribe(render)
render()
