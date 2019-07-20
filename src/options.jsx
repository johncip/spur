import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import { bindActionCreators, createStore } from 'redux'
import { install as installLoop } from 'redux-loop'
import classNames from 'classnames'
import Select from 'react-select'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faAt } from '@fortawesome/free-solid-svg-icons/faAt'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faFirefox } from '@fortawesome/free-brands-svg-icons/faFirefox'
import { faChrome } from '@fortawesome/free-brands-svg-icons/faChrome'
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons/faArrowCircleLeft'

import * as actions from './actions'
import reducers from './reducers'
import { loadSettings, loadQuotes, polyfillBrowser } from './util'

import 'Styles/options/style.scss'

const store = createStore(reducers, undefined, installLoop())
const { dispatch, getState } = store

const {
  setActiveQuote, setNewActiveQuote, patchActiveQuote,
  populateSettings, patchSettings, saveSettings,
  populateQuotes, putQuote, deleteQuote, closeModal, dismissAlert
} = bindActionCreators(actions, dispatch)


// TODO: replace with new tab page in real extension
/*
 * A gear linking back to the main page.
 */
const BackButton = () => (
  <button
    type="button"
    className="backButton"
    onClick={() => window.history.back()}
  >
    <FontAwesomeIcon icon={faArrowCircleLeft} />
  </button>
)

/*
 * The settings section of the options page.
 */
const SettingsSection = () => {
  const { settings, settingsEdited } = getState()

  const themes = [
    { value: 'indexCard', label: 'Index Card' },
    { value: 'indexCardDark', label: 'Index Card Dark' }
  ]

  const wakeTimes = [
    { value: 4, label: '4 am' },
    { value: 5, label: '5 am' },
    { value: 6, label: '6 am' },
    { value: 7, label: '7 am' },
    { value: 8, label: '8 am' }
  ]

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#aaa' : 'white',
      ':hover': {
        backgroundColor: state.isSelected ? '#aaa' : '#ccc'
      }
    })
  }

  return (
    <section className="optionsSection">
      <div className="setting">
        <label htmlFor="id-theme">
          <span className="setting--labelText">Theme</span>
          <Select
            className="setting--select"
            isSearchable={false}
            onChange={opt => patchSettings('theme', opt.value)}
            options={themes}
            value={themes.find(x => x.value === settings.theme)}
            styles={customStyles}
          />
        </label>
      </div>

      <div className="setting">
        <label htmlFor="id-time">
          <span className="setting--labelText">Wake Time</span>
          <Select
            className="setting--select"
            isSearchable={false}
            onChange={opt => patchSettings('wakeTime', opt.value)}
            options={wakeTimes}
            value={wakeTimes.find(x => x.value === settings.wakeTime)}
            styles={customStyles}
          />
        </label>
      </div>

      <button
        type="button"
        className="btn btn-save"
        onClick={saveSettings}
        disabled={!settingsEdited}
      >
        Save
      </button>
    </section>
  )
}

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
    <h1 className="optionsHeading">Quotes</h1>
    <QuotesSection quotes={quotes} />

    <h1 className="optionsHeading">Settings</h1>
    <SettingsSection settings={settings} />

    <h1 className="optionsHeading">Links</h1>
    <LinksSection />
  </div>
)

/*
 * A save button for the modal.
 */
const SaveButton = ({ onClick, disabled }) => (
  <button
    type="button"
    className="btn btn-save"
    onClick={onClick}
    disabled={disabled}
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
  const { activeQuote, modalIsOpen, quoteEdited } = getState()
  const title = !activeQuote.new ? 'Edit Quote' : 'Add Quote'
  const valid = activeQuote.text && activeQuote.author

  return (
    <Modal
      className="modal"
      overlayClassName="modalOverlay"
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel={title}
    >
      <h1 className="modal--heading">{title}</h1>
      <hr className="modal--rule" />

      <QuoteForm
        text={activeQuote.text}
        author={activeQuote.author}
        url={activeQuote.url}
        category={activeQuote.category}
      >
        <SaveButton
          onClick={() => putQuote(activeQuote)}
          disabled={!quoteEdited || !valid}
        />
        {activeQuote.new
          ? null
          : <DeleteButton onClick={() => deleteQuote(activeQuote)} />}
        <CancelButton onClick={closeModal} />
      </QuoteForm>
    </Modal>
  )
}


/*
 * Displays a floating notification in response to some action.
 */
const Alert = ({ message, shown, onClose }) => {
  if (!message) return null

  const classes = classNames('alert', { 'alert-hidden': !shown })

  return (
    <div className={classes}>
      <div className="alert--message">
        {message}
      </div>
      <button type="button" className="alert--closeBtn" onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  )
}


/*
 * Loads the options page and holds state.
 */
const AppRoot = () => {
  const { settings, quotes, alert_: { message, shown } } = getState()

  useEffect(() => {
    loadSettings().then(populateSettings)
    loadQuotes().then(populateQuotes)
  }, [])

  return [
    <BackButton />,
    <Alert
      key="alert"
      message={message}
      shown={shown}
      onClose={dismissAlert}
    />,
    <OptionsPage
      key="opts"
      settings={settings}
      quotes={quotes}
    />,
    <EditModal key="edit-modal" />
  ]
}


polyfillBrowser()
const render = () => ReactDOM.render(<AppRoot />, window.root)
store.subscribe(render)
Modal.setAppElement('#root')
render()
