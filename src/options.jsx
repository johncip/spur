import React, { Component, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import classNames from 'classnames'
import { createStore } from 'redux'
import { connect, Provider } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faAt } from '@fortawesome/free-solid-svg-icons/faAt'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faFirefox } from '@fortawesome/free-brands-svg-icons'
import { faChrome} from '@fortawesome/free-brands-svg-icons'

import reducers from './reducers'
import {
  setActiveQuote,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  updateSettings,
  updateQuoteRecords,
  updateQuoteRecord,
} from './actions'
import { loadSettings, loadQuotes } from './util'

import 'Styles/options/style.scss'


/*
 * The settings section of the options page.
 */
class SettingsSection extends PureComponent {
  render() {
    return (
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
  }
}


/*
 * A clickable displayed quote. Includes a pencil icon on hover.
 */
class _QuoteListItem extends PureComponent {
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
    const { setActiveQuote, quoteRecord, openEditModal } = this.props
    setActiveQuote(quoteRecord)
    openEditModal()
  }

  classes() {
    return classNames(
      'quoteListItem', {
        'quoteListItem-is-hovered': this.state.hover,
      },
    )
  }

  render() {
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
          {this.props.quoteRecord.quote}
        </div>
        {this.state.hover ? <FontAwesomeIcon icon={faPencilAlt} /> : null}
      </button>
    )
  }
}
const QuoteListItem = connect(
  null,
  (dispatch, own) => ({
    setActiveQuote: () => dispatch(setActiveQuote(own.quoteRecord)),
    openEditModal: () => dispatch(openEditModal()),
  }),
)(_QuoteListItem)


/*
 * Button for adding a new quote.
 */
const _AddQuoteButton = ({ openAddModal }) => (
  <button
    className="quoteListItem quoteListItem-add"
    type="button"
    onClick={openAddModal}
  >
    <FontAwesomeIcon icon={faPlus} />
    New quote…
  </button>
)
const AddQuoteButton = connect(
  null,
  { openAddModal },
)(_AddQuoteButton)


/*
 * The quotes section of the options page. An editable list of stored quotes.
 */
const QuotesSection = ({ quoteRecords, openEditModal }) => {
  const values = Array.from(quoteRecords.values())
  return (
    <section className="optionsSection">
      {values.map(quoteRecord => (
        <QuoteListItem
          key={quoteRecord.id}
          quoteRecord={quoteRecord}
        />
      ))}
      <AddQuoteButton />
    </section>
  )
}

const ChromeStoreLink = () => (
  <a className="link" href="">
    <FontAwesomeIcon icon={faChrome} />
    Spur in the <b>Chrome Web Store</b>
  </a>
)

const FirefoxStoreLink = () => (
  <a className="link" href="">
    <FontAwesomeIcon icon={faFirefox} />
    Spur at <b>Firefox Add-ons</b>
  </a>
)

/*
 * Links section.
 */
const LinksSection = () => (
  <section className="optionsSection">
    <a className="link" href="https://github.com/johncip/spur">
      <FontAwesomeIcon icon={faGithub} />
      Spur on <b>GitHub</b>
    </a>

    {navigator.userAgent.includes('Firefox') ? <FirefoxStoreLink /> : null}
    {navigator.userAgent.includes('Chrome') ? <ChromeStoreLink /> : null}

    <a className="link" href="mailto:spur.tab@gmail.com">
      <FontAwesomeIcon icon={faAt} />
      Email John at <b>spur.tab@gmail.com</b>
    </a>

    <p>Thanks for using Spur! If you like it, please consider leaving a rating! 🏄</p>
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
const CancelButton = ({ onCancel }) => (
  <button
    type="button"
    className="btn btn-cancel"
    onClick={onCancel}
  >
    Cancel
  </button>
)


/*
 * A form for editing a quote. Buttons should be passed in as children.
 */
const QuoteForm = ({ quote, author, url, category, children, handleChange }) => (
  <form className="quoteForm">
    <label className="quoteForm--label">Quote</label>
    <textarea
      autoFocus
      className="quoteForm--field quoteForm--field-textarea"
      value={quote}
      onChange={(event) => handleChange('quote', event) }
    />

    <label className="quoteForm--label">Author</label>
    <input
      className="quoteForm--field"
      value={author}
      onChange={(event) => handleChange('author', event) }
    />

    <label className="quoteForm--label">URL</label>
    <input
      className="quoteForm--field"
      value={url}
      onChange={handleChange}
      onChange={(event) => handleChange('url', event) }
    />

    <label className="quoteForm--label">Category</label>
    <input
      className="quoteForm--field"
      value={category}
      onChange={handleChange}
      onChange={(event) => handleChange('category', event) }
    />

    <div className="btnContainer">
      {children}
    </div>
  </form>
)


// TODO: make this a presentational component
/*
 * A modal for editing the clicked-on quote.
 */
const _AddQuoteModal = ({ isOpen, closeModal }) => (
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
      quote=""
      author=""
      url=""
      category=""
    >
      <button type="button" className="btn btn-save">Add</button>
      <CancelButton onCancel={closeModal} />
    </QuoteForm>
  </Modal>
)
const AddQuoteModal = connect(
  state => ({
    isOpen: state.addModal.isOpen,
  }),
  { closeModal: closeAddModal },
)(_AddQuoteModal)


// TODO: make this a presentational component
/*
 * A modal for editing the clicked-on quote.
 */
class _EditQuoteModal extends Component {
  handleChange = (field, event) => {
    this.props.setActiveQuote(
      Object.assign({}, this.props.activeQuote, { [field]: event.target.value })
    )
  }

  handleSave = () => {
    const { activeQuote, updateQuoteRecord, closeModal } = this.props
    updateQuoteRecord(activeQuote)
    closeModal()
  }

  render() {
    const { activeQuote, isOpen, closeModal, updateQuoteRecord, setActiveQuote } = this.props;
    const { quote, author, url, category } = activeQuote;
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
          <CancelButton onCancel={closeModal} />
        </QuoteForm>
      </Modal>
    )
  }
}
const EditQuoteModal = connect(
  state => ({
    activeQuote: state.activeQuote,
    isOpen: state.editModal.isOpen,
  }),
  (dispatch, own) => ({
    closeModal: () => dispatch(closeEditModal()),
    updateQuoteRecord: qr => dispatch(updateQuoteRecord(qr)),
    setActiveQuote: qr => dispatch(setActiveQuote(qr)),
  }),
)(_EditQuoteModal)


/*
 * Loads the options page and holds state.
 */
class _AppRoot extends Component {
  componentDidMount() {
    const { updateSettings, updateQuoteRecords } = this.props
    loadSettings().then(settings => updateSettings(settings))
    loadQuotes().then(quoteRecords => updateQuoteRecords(quoteRecords))
  }

  render() {
    const { settings, quoteRecords } = this.props;
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
      <AddQuoteModal key="add-modal" />
    ]
  }
}
const AppRoot = connect(
  state => ({
    settings: state.settings,
    quoteRecords: state.quoteRecords,
  }),
  (dispatch, own) => ({
    updateSettings: sgs => dispatch(updateSettings(sgs)),
    updateQuoteRecords: qrs => dispatch(updateQuoteRecords(qrs)),
  }),
)(_AppRoot)


const rootEl = document.getElementById('root')
const store = createStore(reducers)
Modal.setAppElement('#root')
ReactDOM.render((
  <Provider store={store}>
    <AppRoot />
  </Provider>
), rootEl)
