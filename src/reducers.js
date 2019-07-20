import { combineReducers, loop, Cmd } from 'redux-loop'
import { showAlert, populateQuotes } from './actions'
import { storeSettings, storeQuotes, summarize, readQuotesFile } from './util'


// helpers

/*
 * Given an array of quote records, returns a map where the keys are
 * the array indices, the values are the records, and the records gain
 * a matching "id" property.
 */
const normalizedQuotes = records => (
  records.reduce((map, record, idx) => {
    map.set(idx, { ...record, id: idx })
    return map
  }, new Map())
)

/*
 * Returns a quote that is not new.
 */
const ensureId = (quote) => {
  const copy = { ...quote }
  if (copy.new) {
    copy.id = Math.random() // TODO: do something better
    delete copy.new
  }
  return copy
}

/*
 * Returns a new quote (a quote with no ID and a "new" flag).
 */
const newQuote = () => ({
  quote: '',
  author: '',
  url: '',
  category: '',
  new: true
})


// reducers

const activeQuote = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_QUOTE':
      return action.payload
    case 'SET_NEW_ACTIVE_QUOTE':
      return newQuote()
    case 'PATCH_ACTIVE_QUOTE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const quoteEdited = (state = false, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_QUOTE':
      return false
    case 'SET_NEW_ACTIVE_QUOTE':
      return false
    case 'PATCH_ACTIVE_QUOTE':
      return true
    default:
      return state
  }
}

const settingsEdited = (state = false, action) => {
  switch (action.type) {
    case 'POPULATE_SETTINGS':
      return false
    case 'PATCH_SETTINGS':
      return true
    case 'SAVE_SETTINGS':
      return false
    default:
      return state
  }
}

const chosenFile = (state = null, action) => {
  switch (action.type) {
    case 'CHOOSE_FILE':
      return action.payload
    case 'IMPORT_QUOTES': {
      return loop(
        state,
        Cmd.run(
          readQuotesFile, {
            args: [state, populateQuotes, Cmd.dispatch],
            successActionCreator: showAlert('Quotes JSON imported.')
          }
        )
      )
    }
    default:
      return state
  }
}

const modalIsOpen = (state = false, action) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return true
    case 'SET_ACTIVE_QUOTE':
      return true
    case 'SET_NEW_ACTIVE_QUOTE':
      return true
    case 'CLOSE_MODAL':
      return false
    case 'PUT_QUOTE':
      return false
    case 'DELETE_QUOTE':
      return false
    default:
      return state
  }
}

const settings = (state = {}, action) => {
  switch (action.type) {
    case 'POPULATE_SETTINGS':
      return { ...action.payload }
    case 'PATCH_SETTINGS': {
      return { ...state, ...action.payload }
    }
    case 'SAVE_SETTINGS':
      return loop(
        state,
        Cmd.run(
          storeSettings, {
            args: [state],
            successActionCreator: showAlert('Settings updated.')
          }
        )
      )
    default:
      return state
  }
}

const quotes = (state = new Map(), action) => {
  switch (action.type) {
    case 'POPULATE_QUOTES': {
      return normalizedQuotes(action.payload)
    }
    case 'PUT_QUOTE': {
      const next = new Map(state)
      const quote = ensureId({ ...action.payload })
      next.set(quote.id, quote)
      return loop(
        next,
        Cmd.run(
          storeQuotes, {
            args: [next],
            successActionCreator: showAlert(`${summarize(quote.text)} saved.`)
          }
        )
      )
    }
    case 'DELETE_QUOTE': {
      const next = new Map(state)
      const quote = action.payload
      next.delete(quote.id)
      return loop(
        next,
        Cmd.run(
          storeQuotes, {
            args: [next],
            successActionCreator: showAlert(`${summarize(quote.text)} deleted.`)
          }
        )
      )
    }
    default:
      return state
  }
}

const alert_ = (state = { message: null, shown: null }, action) => {
  switch (action.type) {
    case 'SHOW_ALERT':
      return {
        message: action.payload,
        shown: true
      }
    case 'DISMISS_ALERT':
      return { ...state, shown: false }
    case 'SET_ACTIVE_QUOTE':
      return { ...state, shown: false }
    case 'SET_NEW_ACTIVE_QUOTE':
      return { ...state, shown: false }
    default:
      return state
  }
}

export default combineReducers({
  activeQuote,
  modalIsOpen,
  quoteEdited,
  settingsEdited,
  settings,
  quotes,
  chosenFile,
  alert_
})
