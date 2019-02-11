const DEFAULT_SETTINGS = {
  theme: 'indexCard',
  wakeTime: '6 am',
}

/**
 * Creates a div, appends it to the body, and returns it.
 */
export function createDiv(className) {
  const div = document.createElement('div')
  div.classList.add(className)
  document.body.appendChild(div)
  return div
}

/**
 * Reads an option from browser storage.
 */
export async function readKey(key) {
  const response = await browser.storage.local.get(key)
  if (!Object.keys(response).length) {
    return null
  }
  return response[key]
}

/**
 * Loads settings from storage, or supplies defaults.
 *
 * TODO: cleaner hash merge
 */
export async function loadSettings() {
  const settings = await readKey('settings')

  if (!settings) {
    return DEFAULT_SETTINGS
  }

  Object.keys(DEFAULT_SETTINGS).forEach((key) => {
    const val = settings[key]
    if (val === null || val === undefined || val === '') {
      settings[key] = DEFAULT_SETTINGS[key]
    }
  })
  return settings
}

/**
 * Seeds browser storage with the included quotes.
 */
function seedStorage() {
  const url = browser.extension.getURL('seeds.json')
  const storage = browser.storage.local

  return fetch(url).then(resp => resp.json())
    .then(seeds => storage.set({ storedQuotes: seeds }))
}

/**
 * Loads quote list from browser storage. If there are no quotes, storage is first seeded
 * with the included quotes.
 */
export async function loadQuotes() {
  const key = 'storedQuotes'
  const storage = browser.storage.local
  const quotes = await storage.get(key)

  if (!Object.keys(quotes).length) {
    await seedStorage()
    return loadQuotes()
  }
  return quotes[key]
}
