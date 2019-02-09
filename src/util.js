const DEFAULT_OPTIONS = {
  theme: 'indexCard',
  wakeTime: '6 am',
};

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
