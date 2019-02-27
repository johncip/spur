import { combineReducers, loop, Cmd } from 'redux-loop'


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

const storeQuotes = (quoteMap) => {
  window.browser.storage.local.set({
    quotes: Array.from(quoteMap.values())
  })
}


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
        Cmd.run(storeQuotes, { args: [next] })
      )
    }
    case 'DELETE_QUOTE': {
      const next = new Map(state)
      next.delete(action.payload)
      return loop(
        next,
        Cmd.run(storeQuotes, { args: [next] })
      )
    }
    default:
      return state
  }
}

export default combineReducers({
  activeQuote,
  modalIsOpen,
  settings,
  quotes
})
