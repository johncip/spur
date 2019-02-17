export const openEditModal = { type: 'OPEN_EDIT_MODAL' }

export const closeEditModal = { type: 'CLOSE_EDIT_MODAL' }

export const setActiveQuote = quote => (
  { type: 'SET_ACTIVE_QUOTE', payload: quote }
)

export const updateSettings = settings => (
  { type: 'UPDATE_SETTINGS', payload: settings }
)

export const updateQuoteRecords = quoteRecords => (
  { type: 'UPDATE_QUOTE_RECORDS', payload: quoteRecords }
)
