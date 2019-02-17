import React, { Component, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import classNames from 'classnames'
import { createStore, combineReducers } from 'redux'
import { connect, Provider } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'

import { createRootDiv, loadSettings, loadQuotes, trimStart } from './util'

import 'Styles/options/style.scss'

// -- redux crap -----------------------------------------------------------------------

const normalizedQuoteRecords = (records) => {
  return records.reduce((map, record, idx) => {
    map.set(idx, Object.assign({ id: idx }, record))
    return map
  }, new Map())
}

const defaultActiveQuote = {
  quote: 'sup bra',
  author: 'some dude',
  url: 'http://google.com',
  category: 'Mindset',
}

const activeQuoteReducer = (state = defaultActiveQuote, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_QUOTE':
      return action.payload
    default:
      return state
  }
}

const store = createStore(combineReducers({ activeQuote: activeQuoteReducer }))

const setActiveQuote = quote => {
  return store.dispatch({ type: 'SET_ACTIVE_QUOTE', payload: quote })
}

// -- end redux crap --------------------------------------------------------------------

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
    const { setActiveQuote, quoteRecord, openModal } = this.props
    setActiveQuote(quoteRecord)
    openModal()
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
const mapDispatchToProps = {
  setActiveQuote,
}
const QuoteListItem = connect(null, mapDispatchToProps)(_QuoteListItem)


/*
 * Button for adding a new quote.
 */
const AddQuoteButton = () => (
  <button className="quoteListItem quoteListItem-add" type="button">
    <FontAwesomeIcon icon={faPlus} />
    New quote…
  </button>
)

const sortedQuoteRecords = (records) => {
  return records.sort((a, b) => (
    trimStart(a.quote).localeCompare(trimStart(b.quote))
  ))
}

/*
 * The quotes section of the options page. An editable list of stored quotes.
 */
const QuotesSection = ({ quoteRecords, openModal }) => {
  const sorted = sortedQuoteRecords(Array.from(quoteRecords.values()))

  return (
    <section className="optionsSection">
      <div>
        {sorted.map(quoteRecord => (
          <QuoteListItem
            key={quoteRecord.id}
            quoteRecord={quoteRecord}
            openModal={openModal}
          />
        ))}
        <AddQuoteButton />
      </div>
    </section>
  )
}

/*
 * The entire options page.
 */
const OptionsPage = ({ settings, quoteRecords, openModal }) => (
  <div>
    <h1 className="optionsHeading">Settings</h1>
    <SettingsSection settings={settings} />

    <h1 className="optionsHeading">Quotes</h1>
    <QuotesSection
      quoteRecords={quoteRecords}
      openModal={openModal}
    />
  </div>
)

/*
 * A modal for editing the clicked-on quote.
 */
const _EditQuoteModal = ({ quoteRecord, isOpen, onRequestClose }) => (
  <Modal
    className="modal"
    overlayClassName="modalOverlay"
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Edit Quote"
  >
    {quoteRecord.quote}
  </Modal>
)
const mapStateToProps = (state) => ({
  quoteRecord: state.activeQuote,
})
const EditQuoteModal = connect(mapStateToProps)(_EditQuoteModal)

/*
 * Loads the options page and holds state.
 */
class AppRoot extends Component {
  constructor() {
    super()
    this.state = {
      settings: null,
      quoteRecords: null,
      modalIsOpen: false,
    }
  }

  componentDidMount() {
    loadSettings().then((settings) => {
      this.setState({ settings })
    })
    loadQuotes().then((records) => {
      const normalized = normalizedQuoteRecords(records)
      this.setState({ quoteRecords: normalized })
    })
  }

  openModal = () => {
    this.setState({ modalIsOpen: true })
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  render() {
    const { settings, quoteRecords, modalIsOpen } = this.state;

    if (!settings || !quoteRecords) {
      return null;
    }

    return (
      <div className="optionsContainer">
        <OptionsPage
          settings={settings}
          quoteRecords={quoteRecords}
          openModal={this.openModal}
        />

        <EditQuoteModal
          onRequestClose={this.closeModal}
          isOpen={modalIsOpen}
        />
      </div>
    )
  }
}

const rootEl = document.getElementById('root')
Modal.setAppElement('#root')
ReactDOM.render((
  <Provider store={store}>
    <AppRoot />
  </Provider>
), rootEl)
