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
 * alert-specific
 */
export const dismissAlert = () => (
  { type: 'DISMISS_ALERT' }
)

// notifyAfter* should be curried with the active quote.
export const notifyAfterSave = quote => () => (
  { type: 'ALERT_AFTER_SAVE', payload: quote }
)

// also they aren't dispatched from the app, but in response to other actions.
export const notifyAfterDelete = quote => () => (
  { type: 'ALERT_AFTER_DELETE', payload: quote }
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

export const patchSettings = (key, value) => (
  { type: 'PATCH_SETTINGS', payload: { [key]: value } }
)

export const saveSettings = settings => (
  { type: 'SAVE_SETTINGS', payload: settings }
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
