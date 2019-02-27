/*
 * modal-specific
 */
export const openModal = () => (
  { type: 'OPEN_MODAL' }
)
export const closeModal = () => (
  { type: 'CLOSE_MODAL' }
)

/*
 * toast-specific
 */
export const dismissToast = () => (
  { type: 'DISMISS_TOAST' }
)


/*
 * quote record list
 */
export const saveQuotes = () => (
  { type: 'SAVE_QUOTES' }
)

export const updateQuotes = quotes => (
  { type: 'UPDATE_QUOTES', payload: quotes }
)

export const putQuote = quote => (
  { type: 'PUT_QUOTE', payload: quote }
)

export const deleteQuote = quote => (
  { type: 'DELETE_QUOTE', payload: quote }
)


/*
 * settings
 */
export const updateSettings = settings => (
  { type: 'UPDATE_SETTINGS', payload: settings }
)


/*
 * edit form
 */
export const setActiveQuote = quote => (
  { type: 'SET_ACTIVE_QUOTE', payload: quote }
)
export const patchActiveQuote = (key, value) => (
  { type: 'PATCH_ACTIVE_QUOTE', payload: { [key]: value } }
)
export const setNewActiveQuote = () => (
  { type: 'SET_NEW_ACTIVE_QUOTE' }
)
