import { combineReducers, loop, Cmd } from 'redux-loop'
import { notifyAfterSave, notifyAfterDelete } from './actions'


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
 * Puts the list of quotes in browser storage.
 */
const storeQuotes = quoteMap => (
  window.browser.storage.local.set({
    quotes: Array.from(quoteMap.values())
  })
)

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

const settings = (state = new Map(), action) => {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return new Map(Object.entries(action.payload))
    default:
      return state
  }
}

const quotes = (state = new Map(), action) => {
  switch (action.type) {
    case 'UPDATE_QUOTES': {
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
            successActionCreator: notifyAfterSave(quote)
            // TODO: define failActionCreator
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
            successActionCreator: notifyAfterDelete(quote)
            // TODO: define failActionCreator
          }
        )
      )
    }
    default:
      return state
  }
}

const alert_ = (state = { quote: null, type: null, shown: null }, action) => {
  switch (action.type) {
    case 'ALERT_AFTER_SAVE':
      return {
        quote: action.payload,
        type: 'save',
        shown: true
      }
    case 'ALERT_AFTER_DELETE':
      return {
        quote: action.payload,
        type: 'delete',
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
  settings,
  quotes,
  alert_
})
