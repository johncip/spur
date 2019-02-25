// modal-only
export const openModal = () => (
  { type: 'OPEN_MODAL' }
)
export const closeModal = () => (
  { type: 'CLOSE_MODAL' }
)


// quote record list
export const saveQuoteRecords = () => (
  { type: 'SAVE_QUOTE_RECORDS' }
)

export const updateQuoteRecords = quoteRecords => (
  { type: 'UPDATE_QUOTE_RECORDS', payload: quoteRecords }
)

export const putQuoteRecord = quote => (
  { type: 'PUT_QUOTE_RECORD', payload: quote }
)

export const deleteQuoteRecord = id => (
  { type: 'DELETE_QUOTE_RECORD', payload: id }
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
