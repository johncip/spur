const DEFAULT_OPTIONS = {
  theme: 'indexCard',
  wakeTime: '6 am'
};

/**
 * Returns a random array element.
 */
function randomItem(arr) {
  const rIndex = Math.floor(Math.random() * arr.length);
  return arr[rIndex];
  // return arr[3]; // randomly selected by fair dice roll
}

/* reads an option from browser storage. */
async function readKey(key) {
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
async function loadOptions() {
  const options = await readKey('options');

  if (!options) {
    return DEFAULT_OPTIONS;
  }

  Object.keys(DEFAULT_OPTIONS).forEach((key) => {
    const val = options[key];
    if (val === null || val === undefined || val === "") {
      options[key] = DEFAULT_OPTIONS[key];
    }
  });
  return options;
}

/**
 * Loads quote list from browser storage. If there are no quotes, storage is first seeded
 * with the included quotes.
 */
async function loadQuotes() {
  const key = 'storedQuotes';
  const storage = browser.storage.sync;
  const quotes = await storage.get(key);

  if (!Object.keys(quotes).length) {
    await seedStorage();
    return loadQuotes();
  }
  return quotes[key];
}
