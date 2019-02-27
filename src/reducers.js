import { combineReducers, loop, Cmd } from 'redux-loop'


// helpers

const normalizedQuotes = records => (
  records.reduce((map, record, idx) => {
    map.set(idx, Object.assign({ id: idx }, record))
    return map
  }, new Map())
)

const ensureId = (quote) => {
  const copy = Object.assign({}, quote)
  if (copy.id === 'new') {
    copy.id = Math.random()
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
