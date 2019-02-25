import { combineReducers } from 'redux'
import { polyfillBrowser } from './util'

polyfillBrowser()

const normalizedQuotes = records => (
  records.reduce((map, record, idx) => {
    map.set(idx, Object.assign({ id: idx }, record))
    return map
  }, new Map())
)

const activeQuote = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_QUOTE':
      return action.payload
    case 'SET_NEW_ACTIVE_QUOTE':
      return { quote: '', author: '', url: '', category: '', id: 'new' }
    case 'PATCH_ACTIVE_QUOTE':
      return Object.assign({}, state, action.payload)
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
      const copy = new Map(state)
      const quote = Object.assign({}, action.payload)

      if (quote.id === 'new') {
        quote.id = Math.random()
      }
      copy.set(quote.id, quote)
      return copy
    }
    case 'DELETE_QUOTE': {
      const copy = new Map(state)
      copy.delete(action.payload)
      return copy
    }
    // TODO thunk it up
    case 'SAVE_QUOTES': {
      browser.storage.local.set({ storedQuotes: Array.from(state.values()) })
      return state
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
