import React, { Component, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'

import { createRootDiv, loadSettings, loadQuotes, trimStart } from './util'

import 'Styles/options/style.scss'

const Spinner = () => (
  <section className="optionsSection optionsSection-empty">
    <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
  </section>
)

/*
 * The (behavior) settings section of the options page.
 */
class SettingsSection extends PureComponent {
  render() {
    if (!this.props.settings) {
      return <Spinner />
    }

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
class QuoteListItem extends PureComponent {
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

  classes() {
    return classNames(
      'quoteListItem', {
        'quoteListItem-is-hovered': this.state.hover,
      },
    )
  }

  render() {
    const { quote, openModal } = this.props

    return (
      // TODO: this should be / contain a button for a11y
      <li
        className={this.classes()}
        onClick={openModal}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className="truncatedText">
          {quote}
        </div>
        {this.state.hover ? <FontAwesomeIcon icon={faPencilAlt} /> : null}
      </li>
    )
  }
}

const AddQuoteButton = () => (
  // TODO: this should be / contain a button for a11y
  <li className="addQuoteButton">
    <FontAwesomeIcon icon={faPlus} />
    New quote…
  </li>
)

/*
 * The quotes section of the options page. An editable list of stored quotes.
 */
// eslint-disable-next-line react/prefer-stateless-function
class QuotesSection extends Component {
  // TODO: rename "quotes" (quoteRecords or something)
  render() {
    if (!this.props.quotes) {
      return <Spinner />
    }

    return (
      <section className="optionsSection optionsSection-quotes">
        <ul>
          {this.props.quotes.map(record => (
            <QuoteListItem
              key={record.quote}
              quote={record.quote}
              openModal={this.props.openModal}
            />
          ))}
          <AddQuoteButton />
        </ul>
      </section>
    )
  }
}

/*
 * The entire options page.
 */
const OptionsPage = ({ settings, quotes, openModal, closeModal }) => (
  <div>
    <h1 className="optionsHeading">Settings</h1>
    <SettingsSection settings={settings} />

    <h1 className="optionsHeading">Quotes</h1>
    <QuotesSection
      quotes={quotes}
      openModal={openModal}
      closeModal={closeModal}
    />
  </div>
)

/*
 * Loads the options page and holds state.
 */
class AppRoot extends Component {
  constructor() {
    super()
    this.state = {
      settings: null,
      quotes: null,
      modalIsOpen: false,
    }
  }

  // TODO: split up
  componentDidMount() {
    loadSettings().then((settings) => {
      this.setState({ settings })
    })
    loadQuotes().then((quotes) => {
      const sorted = quotes.sort((a, b) => (
        trimStart(a.quote).localeCompare(trimStart(b.quote))
      ))
      this.setState({ quotes: sorted })
    })
  }

  openModal = () => {
    this.setState({ modalIsOpen: true })
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  render() {
    return (
      <div className="optionsContainer">
        <OptionsPage
          settings={this.state.settings}
          quotes={this.state.quotes}
          openModal={this.openModal}
          closeModal={this.openModal}
        />

        <Modal
          className="modal"
          overlayClassName="modalOverlay"
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
        >
          The man who acquires the ability to take full possession of his own mind...
        </Modal>
      </div>
    )
  }
}

const root = createRootDiv()
Modal.setAppElement('#root')
ReactDOM.render(<AppRoot />, root)
