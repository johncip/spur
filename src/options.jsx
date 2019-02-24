import React, { Component, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import classNames from 'classnames'
import { createStore } from 'redux'
import { connect } from 'react-redux'

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
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  updateSettings,
  updateQuoteRecords,
  updateQuoteRecord,
  // saveQuoteRecords,
  deleteQuoteRecord,
} from './actions'
import { compose2, loadSettings, loadQuotes } from './util'

import 'Styles/options/style.scss'


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
class _EditQuoteButton extends PureComponent {
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
    this.props.setActiveQuote(this.props.quoteRecord)
    this.props.openModal()
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
const EditQuoteButton = connect(
  null,
  {
    setActiveQuote: quoteRecord => setActiveQuote(quoteRecord),
    openModal: openEditModal,
  },
)(_EditQuoteButton)


/*
 * Button for adding a new quote.
 */
class _AddQuoteButton extends Component {
  handleClick = () => {
    this.props.setNewActiveQuote()
    this.props.openModal()
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
const AddQuoteButton = connect(
  null,
  {
    setNewActiveQuote,
    openModal: openAddModal,
  },
)(_AddQuoteButton)


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
 * A form for editing a quote. Buttons should be passed in as children.
 */
const QuoteForm = ({ quote, author, url, category, children, handleChange }) => (
  <form className="quoteForm">
    <label className="quoteForm--label" htmlFor="id-quote">Quote</label>
    <textarea
      id="id-quote"
      className="quoteForm--field quoteForm--field-textarea"
      value={quote}
      onChange={event => handleChange('quote', event)}
    />

    <label className="quoteForm--label" htmlFor="id-author">Author</label>
    <input
      id="id-author"
      className="quoteForm--field"
      value={author}
      onChange={event => handleChange('author', event)}
    />

    <label className="quoteForm--label" htmlFor="id-url">URL</label>
    <input
      id="id-url"
      className="quoteForm--field"
      value={url}
      onChange={event => handleChange('url', event)}
    />

    <label className="quoteForm--label" htmlFor="id-category">Category</label>
    <input
      id="id-category"
      className="quoteForm--field"
      value={category}
      onChange={event => handleChange('category', event)}
    />

    <div className="btnContainer">
      {children}
    </div>
  </form>
)


// TODO: delete AddQuoteModal
// TODO: make this a presentational component?
/*
 * A modal for editing the clicked-on quote.
 */
class _AddQuoteModal extends Component {
  handleChange = (field, event) => {
    this.props.setActiveQuote(
      Object.assign({}, this.props.quoteRecord, { [field]: event.target.value }),
    )
  }

  handleSave = () => {
    this.props.updateQuoteRecord(this.props.quoteRecord)
    this.props.saveQuoteRecords()
    this.props.closeModal()
  }

  render() {
    const { quoteRecord, isOpen, closeModal } = this.props
    const { quote, author, url, category } = quoteRecord

    return (
      <Modal
        className="modal"
        overlayClassName="modalOverlay"
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Add Quote"
      >
        <h1 className="modal--heading">Add Quote</h1>
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
          <CancelButton onClick={closeModal} />
        </QuoteForm>
      </Modal>
    )
  }
}
const AddQuoteModal = connect(
  state => ({
    quoteRecord: state.activeQuote,
    isOpen: state.addModal.isOpen,
  }),
  {
    saveQuoteRecords,
    closeModal: closeAddModal,
    setActiveQuote: quoteRecord => setActiveQuote(quoteRecord),
    updateQuoteRecord: quoteRecord => updateQuoteRecord(quoteRecord),
  },
)(_AddQuoteModal)


// TODO: make this a presentational component?
/*
 * A modal for editing the clicked-on quote.
 */
class _EditQuoteModal extends Component {
  handleChange = (field, event) => {
    this.props.setActiveQuote(
      Object.assign({}, this.props.quoteRecord, { [field]: event.target.value }),
    )
  }

  handleSave = () => {
    this.props.updateQuoteRecord(this.props.quoteRecord)
    // this.props.saveQuoteRecords()
    this.props.closeModal()
  }

  handleDelete = () => {
    this.props.deleteQuoteRecord(this.props.quoteRecord.id)
    // this.props.saveQuoteRecords()
    this.props.closeModal()
  }

  render() {
    const { quoteRecord, isOpen, closeModal } = this.props
    const { quote, author, url, category } = quoteRecord
    return (
      <Modal
        className="modal"
        overlayClassName="modalOverlay"
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Quote"
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
          <DeleteButton onClick={this.handleDelete} />
          <CancelButton onClick={closeModal} />
        </QuoteForm>
      </Modal>
    )
  }
}
const EditQuoteModal = connect(
  state => ({
    quoteRecord: state.activeQuote,
    isOpen: state.editModal.isOpen,
  }),
  {
    saveQuoteRecords,
    deleteQuoteRecord,
    closeModal: closeEditModal,
    updateQuoteRecord: quoteRecord => updateQuoteRecord(quoteRecord),
    setActiveQuote: quoteRecord => setActiveQuote(quoteRecord),
  },
)(_EditQuoteModal)


/*
 * Loads the options page and holds state.
 */
class _AppRoot extends Component {
  componentDidMount() {
    loadSettings().then(settings => this.props.updateSettings(settings))
    loadQuotes().then(quoteRecords => this.props.updateQuoteRecords(quoteRecords))
  }

  render() {
    const { settings, quoteRecords } = this.props
    if (!settings.size || !quoteRecords.size) {
      return null
    }

    return [
      <OptionsPage
        key="opts"
        settings={settings}
        quoteRecords={quoteRecords}
      />,
      <EditQuoteModal key="edit-modal" />,
      <AddQuoteModal key="add-modal" />,
    ]
  }
}
const AppRoot = connect(
  state => ({
    settings: state.settings,
    quoteRecords: state.quoteRecords,
  }),
  {
    updateSettings: settings => updateSettings(settings),
    updateQuoteRecords: quoteRecordList => updateQuoteRecords(quoteRecordList),
  },
)(_AppRoot)



class Provider extends Component {
  getChildContext() {
    return { store: this.props.store }
  }

  render() {
    return this.props.children
  }
}

Provider.childContextTypes = {
  store: PropTypes.object,
}

const rootEl = document.getElementById('root')
const store = createStore(reducers)
Modal.setAppElement('#root')

const render = () => {
  ReactDOM.render((
    <Provider store={store}>
      <AppRoot />
    </Provider>
  ), rootEl)
}

store.subscribe(render)
render()
