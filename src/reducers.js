import { combineReducers } from 'redux'

const normalizedQuoteRecords = (records) => {
  return records.reduce((map, record, idx) => {
    map.set(idx, Object.assign({ id: idx }, record))
    return map
  }, new Map())
}

const activeQuote = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_QUOTE':
      return action.payload
    default:
      return state
  }
}

const editModal = (state = { isOpen: false }, action) => {
  switch (action.type) {
    case 'OPEN_EDIT_MODAL':
      return { isOpen: true }
    case 'CLOSE_EDIT_MODAL':
      return { isOpen: false }
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
    default:
      return state
  }
}

export default combineReducers({
  activeQuote,
  editModal,
  settings,
  quoteRecords,
})
