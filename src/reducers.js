import { combineReducers, loop, Cmd } from 'redux-loop'
import { notifyAfterSave, notifyAfterDelete } from './actions'


// helpers

/*
 * Given an array of quotes (see seeds.json), returns a map where the
 * array indices are the keys, and the quotes contain a matching id field.
 */
const normalizedQuotes = records => (
  records.reduce((map, record, idx) => {
    map.set(idx, { ...record, id: idx })
    return map
  }, new Map())
)

/*
 * Returns a copy of the given quote, assigning a new ID
 */
const ensureId = (quote) => {
  const copy = { ...quote }
  if (copy.id === 'new') {
    copy.id = Math.random() // TODO: do something better
  }
  return copy
}

/*
 * Returns a brief summary of a quote for use with the alert.
 */
const summary = ({ text }) => {
  const len = 20
  if (text.length < len) {
    return text
  }
  return `(“${text.substring(0, len)}…”)`
}

/*
 * Puts the list of quotes in browser storage.
 */
const storeQuotes = quoteMap => (
  window.browser.storage.local.set({
    quotes: Array.from(quoteMap.values())
  })
)


// reducers

const activeQuote = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_QUOTE':
      return action.payload
    case 'SET_NEW_ACTIVE_QUOTE':
      return { quote: '', author: '', url: '', category: '', id: 'new' }
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
      const quote = ensureId(action.payload)
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

const toast = (state = { message: null, shown: false }, action) => {
  switch (action.type) {
    case 'NOTIFY_AFTER_SAVE':
      return {
        message: `Quote ${summary(action.payload)} saved.`,
        shown: true
      }
    case 'NOTIFY_AFTER_DELETE':
      return {
        message: `Quote ${summary(action.payload)} deleted.`,
        shown: true
      }
    case 'DISMISS_TOAST':
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
  toast
})
