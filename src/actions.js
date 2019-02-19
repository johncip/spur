export const openAddModal = () => (
  { type: 'OPEN_ADD_MODAL' }
)
export const closeAddModal = () => (
  { type: 'CLOSE_ADD_MODAL' }
)


export const openEditModal = () => (
  { type: 'OPEN_EDIT_MODAL' }
)
export const closeEditModal = () => (
  { type: 'CLOSE_EDIT_MODAL' }
)


export const saveQuoteRecords = () => (
  { type: 'SAVE_QUOTE_RECORDS' }
)
export const updateQuoteRecords = quoteRecords => (
  { type: 'UPDATE_QUOTE_RECORDS', payload: quoteRecords }
)
export const updateQuoteRecord = quote => (
  { type: 'UPDATE_QUOTE_RECORD', payload: quote }
)
export const deleteQuoteRecord = id => (
  { type: 'DELETE_QUOTE_RECORD', payload: id }
)


export const updateSettings = settings => (
  { type: 'UPDATE_SETTINGS', payload: settings }
)


export const setActiveQuote = quote => (
  { type: 'SET_ACTIVE_QUOTE', payload: quote }
)
export const setNewActiveQuote = () => (
  { type: 'SET_NEW_ACTIVE_QUOTE' }
)
