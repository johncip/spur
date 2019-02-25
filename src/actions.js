// modal-only
export const openModal = () => (
  { type: 'OPEN_MODAL' }
)
export const closeModal = () => (
  { type: 'CLOSE_MODAL' }
)


// quote record list
export const saveQuotes = () => (
  { type: 'SAVE_QUOTES' }
)

export const updateQuotes = quotes => (
  { type: 'UPDATE_QUOTES', payload: quotes }
)

export const putQuote = quote => (
  { type: 'PUT_QUOTE', payload: quote }
)

export const deleteQuote = id => (
  { type: 'DELETE_QUOTE', payload: id }
)


// settings
export const updateSettings = settings => (
  { type: 'UPDATE_SETTINGS', payload: settings }
)


// edit form
export const setActiveQuote = quote => (
  { type: 'SET_ACTIVE_QUOTE', payload: quote }
)
export const patchActiveQuote = patch => (
  { type: 'PATCH_ACTIVE_QUOTE', payload: patch }
)
export const setNewActiveQuote = () => (
  { type: 'SET_NEW_ACTIVE_QUOTE' }
)
