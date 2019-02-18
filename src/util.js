const DEFAULT_SETTINGS = {
  theme: 'indexCard',
  wakeTime: '6 am',
}

const STORAGE = browser.storage.local

/**
 * Seeds browser storage with the included quotes.
 */
async function seedStorage() {
  const url = browser.extension.getURL('seeds.json')

  await fetch(url)
    .then(resp => resp.json())
    .then(seeds => STORAGE.set({ storedQuotes: seeds }))

  return true
}

/**
 * Returns string with leading nonword characters removed.
 */
function trimStart(str) {
  return str.replace(/^\W+/, '')
}

/**
 * Returns quote records sorted by quote. Ignores leading ellipsis.
 */
// TODO: currently unused
export const sortedQuoteRecords = (records) => {
  return records.sort((a, b) => (
    trimStart(a.quote).localeCompare(trimStart(b.quote))
  ))
}

/**
 * Reads a single key from browser storage and returns the value without the wrapper object.
 */
export async function getOneKey(key) {
  const response = await STORAGE.get(key)
  if (!Object.keys(response).length) {
    return null
  }
  return response[key]
}

/**
 * Loads settings from storage, or supplies defaults.
 */
export async function loadSettings() {
  const settings = await getOneKey('settings')

  if (!settings) {
    return DEFAULT_SETTINGS
  }

  return Object.assign(DEFAULT_SETTINGS, settings)
}

/**
 * Loads quotes from browser storage. If they are not found, seeds storage with the
 * included quotes and tries again.
 */
export async function loadQuotes() {
  const quotes = await getOneKey('storedQuotes')
  return quotes || (await seedStorage() && loadQuotes())
}
