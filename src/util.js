const DEFAULT_OPTIONS = {
  theme: 'indexCard',
  wakeTime: '6 am',
};

export const SAMPLE_QUOTE = {
  quote: 'People who are unable to motivate themselves must be content with mediocrity, no matter how impressive their other talents.',
  author: 'Andrew Carnegie',
  category: 'Mindset',
  url: 'https://www.brainyquote.com/quotes/andrew_carnegie_391523',
};

/**
 * Returns an appropriate font size for the given text string. That is, longer strings will
 * have a smaller font size, and shorter strings will have a larger font size.
 *
 * (Line breaks are not taken into account.)
 */
export function adjustedFontSize(text) {
  const size = 150 * (1 / (text.length ** 0.3));
  return `${size}px`;
}

/**
 * Returns a random array element.
 */
export function randomItem(arr) {
  const rIndex = Math.floor(Math.random() * arr.length);
  return arr[rIndex];
  // return arr[3]; // randomly selected by fair dice roll
}

/**
 * Reads an option from browser storage.
 */
export async function readKey(key) {
  const response = await browser.storage.sync.get(key);
  if (!Object.keys(response).length) {
    return null;
  }
  return response[key];
}

/**
 * Loads options from storage, or supplies defaults.
 *
 * TODO: cleaner hash merge
 */
export async function loadOptions() {
  const options = await readKey('options');

  if (!options) {
    return DEFAULT_OPTIONS;
  }

  Object.keys(DEFAULT_OPTIONS).forEach((key) => {
    const val = options[key];
    if (val === null || val === undefined || val === '') {
      options[key] = DEFAULT_OPTIONS[key];
    }
  });
  return options;
}

/**
 * Seeds browser storage with the included quotes.
 */
function seedStorage() {
  const url = browser.extension.getURL('seeds.json');
  const storage = browser.storage.sync;

  return fetch(url).then(resp => resp.json())
    .then(seeds => storage.set({ storedQuotes: seeds }));
}

/**
 * Loads quote list from browser storage. If there are no quotes, storage is first seeded
 * with the included quotes.
 */
export async function loadQuotes() {
  const key = 'storedQuotes';
  const storage = browser.storage.sync;
  const quotes = await storage.get(key);

  if (!Object.keys(quotes).length) {
    await seedStorage();
    return loadQuotes();
  }
  return quotes[key];
}
