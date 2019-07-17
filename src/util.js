const DEFAULT_SETTINGS = {
  theme: 'indexCard',
  wakeTime: '6 am'
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
          const val = window.localStorage.getItem(key)
          return val === null ? null : JSON.parse(val)
        },
        set: (obj) => {
          // note: assumes setting object with single key
          const key = Object.keys(obj)[0]
          const val = JSON.stringify({ [key]: obj[key] })
          return window.localStorage.setItem(key, val)
        }
      }
    },
    runtime: {
      openOptionsPage: () => {
        document.location.href = '/options.html'
      }
    }
  }
}

/**
 * Seeds browser storage with the included quotes.
 */
async function seedStorage() {
  window.browser.storage.local.set({ quotes: seeds })
}

/*
 * Puts the list of quotes in browser storage.
 */
export const storeQuotes = quoteMap => (
  window.browser.storage.local.set({
    quotes: Array.from(quoteMap.values())
  })
)

/*
 * Puts the settings in browser storage.
 */
export const storeSettings = settings => (
  window.browser.storage.local.set({ settings })
)

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
    console.log('WARNING: loaded default settings')
    return DEFAULT_SETTINGS
  }
  return { ...DEFAULT_SETTINGS, settings }
}

/**
 * Loads quotes from browser storage. If they are not found, seeds storage with the
 * included quotes and tries again.
 */
export async function loadQuotes(stop) {
  const quotes = await getOneKey('quotes')

  // the length check can come out if
  //  - I prevent removal of the last quote
  //  - I add a blank state to the index page & don't auto-seed
  if (stop || (quotes && Object.keys(quotes).length)) {
    return quotes
  }

  await seedStorage()
  return loadQuotes(true)
}

/*
 * Returns a brief summary of text for use with the alert.
 *
 * Trims at word boundaries & adds an ellipsis at the end if needed.
 *
 * Tries to make it look better by removing some leading and
 * trailing punctuation.
 */
export const summarize = (text, len = 5) => {
  // TODO: it'd be better to trim to length, then trim at the last word boundary

  /* eslint-disable no-multi-spaces */
  const words = (
    text
      .replace(/["“”]/g, '') // remove quotation marks
      .split(/\s+/)          // split on whitespace
  )

  const end = words.length - 1
  words[0] = words[0].replace(/^\W+/g, '')     // no leading nonword chars
  words[end] = words[end].replace(/\W+$/g, '') // no trailing nonword chars

  const trimmed = (
    words
      .slice(0, len)        // take first n words
      .join(' ')            // join string
      .substring(0, 200)    // make sure it's short
  )

  const core = words.length <= len
    ? trimmed
    : `${trimmed}…`

  return `“${core}”`
  /* eslint-enable no-multi-spaces */
}
