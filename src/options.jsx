import React, { Component, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import classNames from 'classnames'
import { createStore } from 'redux'
import { connect, Provider } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'

import reducers from './reducers'
import {
  setActiveQuote,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  updateSettings,
  updateQuoteRecords,
} from './actions'
import { loadSettings, loadQuotes, sortedQuoteRecords } from './util'

import 'Styles/options/style.scss'


/*
 * The (behavior) settings section of the options page.
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
 * A clickable displayed quote.
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
    openEditModal: () => dispatch(openEditModal),
    setActiveQuote: () => dispatch(setActiveQuote(own.quoteRecord)),
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
  (dispatch, own) => ({
    openAddModal: () => dispatch(openAddModal),
  }),
)(_AddQuoteButton)

/*
 * The quotes section of the options page. An editable list of stored quotes.
 */
const QuotesSection = ({ quoteRecords, openEditModal }) => {
  const values = Array.from(quoteRecords.values())
  const sorted = sortedQuoteRecords(values)

  return (
    <section className="optionsSection">
      {sorted.map(quoteRecord => (
        <QuoteListItem
          key={quoteRecord.id}
          quoteRecord={quoteRecord}
        />
      ))}
      <AddQuoteButton />
    </section>
  )
}

/*
 * The entire options page.
 */
const OptionsPage = ({ settings, quoteRecords }) => (
  <div>
    <h1 className="optionsHeading">Settings</h1>
    <SettingsSection settings={settings} />

    <h1 className="optionsHeading">Quotes</h1>
    <QuotesSection quoteRecords={quoteRecords} />
  </div>
)

/*
 * A modal for editing the clicked-on quote.
 */
const _EditQuoteModal = ({ quoteRecord, isOpen, closeEditModal }) => (
  <Modal
    className="modal"
    overlayClassName="modalOverlay"
    isOpen={isOpen}
    onRequestClose={closeEditModal}
    contentLabel="Edit Quote"
  >
    {quoteRecord.quote}
  </Modal>
)
const EditQuoteModal = connect(
  state => ({
    quoteRecord: state.activeQuote,
    isOpen: state.editModal.isOpen,
  }),
  dispatch => ({
    closeEditModal: () => dispatch(closeEditModal),
  }),
)(_EditQuoteModal)

// TODO: make this a presentational component
/*
 * A modal for editing the clicked-on quote.
 */
const _AddQuoteModal = ({ isOpen, closeAddModal }) => (
  <Modal
    className="modal"
    overlayClassName="modalOverlay"
    isOpen={isOpen}
    onRequestClose={closeAddModal}
    contentLabel="Add Quote"
  >
    hello
  </Modal>
)
const AddQuoteModal = connect(
  state => ({
    isOpen: state.addModal.isOpen,
  }),
  dispatch => ({
    closeAddModal: () => dispatch(closeAddModal),
  }),
)(_AddQuoteModal)


/*
 * Loads the options page and holds state.
 */
class _AppRoot extends Component {
  constructor() {
    super()
    this.state = { settings: null, quoteRecords: null }
  }

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

    return (
      <div className="optionsContainer">
        <OptionsPage
          settings={settings}
          quoteRecords={quoteRecords}
        />
        <EditQuoteModal />
      </div>
    )
  }
}
const AppRoot = connect(
  state => ({
    settings: state.settings,
    quoteRecords: state.quoteRecords,
  }),
  (dispatch, own) => ({
    updateSettings: settings => dispatch(updateSettings(settings)),
    updateQuoteRecords: quoteRecords => dispatch(updateQuoteRecords(quoteRecords)),
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
