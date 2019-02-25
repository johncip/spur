const DEFAULT_SETTINGS = {
  theme: 'indexCard',
  wakeTime: '6 am',
}

const seeds = require('../assets/seeds.json')

/**
 * Assigns browser shim unless browser is defined. Makes it possible to use
 * dev server.
 */
export function polyfillBrowser() {
  if (window.browser) { return }

  window.browser = {
    storage: {
      local: {
        get: (key) => {
          const val = localStorage.getItem(key)
          return val === null ? null : JSON.parse(val)
        },
        set: (obj) => {
          // note: assumes setting object with single key
          const key = Object.keys(obj)[0]
          return localStorage.setItem(key, JSON.stringify({ [key]: obj[key] }))
        },
      },
    },
    runtime: {
      openOptionsPage: () => {
        document.location.href = '/options.html'
      },
    },
  }
}

polyfillBrowser()

/**
 * Seeds browser storage with the included quotes.
 */
async function seedStorage() {
  browser.storage.local.set({ quotes: seeds })
}

/**
 * Reads a single key from browser storage and returns the value without the wrapper object.
 */
export async function getOneKey(key) {
  const response = await browser.storage.local.get(key)

  if (!response || !Object.keys(response).length) {
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
export async function loadQuotes(stop) {
  const quotes = await getOneKey('quotes')

  if (quotes || stop) {
    return quotes
  }

  await seedStorage()
  return loadQuotes(true)
}
