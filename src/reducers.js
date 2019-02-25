import { combineReducers } from 'redux'
import { polyfillBrowser } from './util'

polyfillBrowser()

const normalizedQuoteRecords = records => (
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
    case 'CLOSE_MODAL':
      return false
    case 'PUT_QUOTE_RECORD':
      return false
    case 'DELETE_QUOTE_RECORD':
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

const quoteRecords = (state = new Map(), action) => {
  switch (action.type) {
    case 'UPDATE_QUOTE_RECORDS': {
      return normalizedQuoteRecords(action.payload)
    }
    case 'PUT_QUOTE_RECORD': {
      const copy = new Map(state)
      const quoteRecord = Object.assign({}, action.payload)

      if (quoteRecord.id === 'new') {
        quoteRecord.id = Math.random()
      }
      copy.set(quoteRecord.id, quoteRecord)
      return copy
    }
    case 'DELETE_QUOTE_RECORD': {
      const copy = new Map(state)
      copy.delete(action.payload)
      return copy
    }
    // TODO thunk it up
    case 'SAVE_QUOTE_RECORDS': {
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
  quoteRecords,
})
