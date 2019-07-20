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

// notifyAfter* should be curried with the message.
export const showAlert = message => () => (
  { type: 'SHOW_ALERT', payload: message }
)

/*
 * quote record list
 */
export const saveQuotes = () => (
  { type: 'SAVE_QUOTES' }
)

export const populateQuotes = quotes => (
  { type: 'POPULATE_QUOTES', payload: quotes }
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
export const populateSettings = settings => (
  { type: 'POPULATE_SETTINGS', payload: settings }
)

export const patchSettings = (key, value) => (
  { type: 'PATCH_SETTINGS', payload: { [key]: value } }
)

export const saveSettings = settings => (
  { type: 'SAVE_SETTINGS', payload: settings }
)

export const chooseFile = file => (
  { type: 'CHOOSE_FILE', payload: file }
)

export const importQuotes = () => (
  { type: 'IMPORT_QUOTES' }
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
