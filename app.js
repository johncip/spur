const get =  document.getElementById.bind(document);
let storage = null;

if (window.browser) {
  storage = browser.storage.sync;
} else {
  /* for quick loading of HTML, remove later */
  render({
    "quote"    : "People who are unable to motivate themselves must be content with mediocrity, no matter how impressive their other talents.",
    "author"   : "Andrew Carnegie",
    "category" : "Mindset",
    "url"      : "https://www.brainyquote.com/quotes/andrew_carnegie_391523"
  });
}

/**
 * Given the stored options, applies the selected theme, or the default.
 */
function applyTheme(options) {
  const theme = options['theme'] || 'indexCardDark';
  document.documentElement.classList.add(theme);
}

/**
 * Loads quote list from browser storage. If there are no quotes, storage is first seeded
 * with the included quotes.
 */
async function loadQuotes() {
  const key = 'storedQuotes';
  const quotes = await storage.get(key);
  if (!quotes) {
    await seedStorage();
    return loadQuotes();
  }
  return quotes[key];
}

/**
 * Seeds browser storage with the included quotes.
 */
function seedStorage() {
  const url = browser.extension.getURL('seeds.json');
  return fetch(url).then((resp) => resp.json())
                   .then((seeds) => storage.set({storedQuotes: seeds}));
}

/**
 * Returns an appropriate font size for the given text string. That is, longer strings will
 * have a smaller font size, and shorter strings will have a larger font size.
 *
 * (Line breaks are not taken into account.)
 */
function adjustedFontSize(text) {
  const size = 150 * (1 / (text.length ** 0.3));
  return size + 'px';
}

/**
 * Fills the DIVs with quote text, author, etc.
 */
function render(record) {
  // quote
  const quoteDiv = get('quote');
  quoteDiv.textContent = record['quote'];
  quoteDiv.style.fontSize = adjustedFontSize(record['quote']);

  // author
  get('author').textContent = record['author'];

  // category
  get('category').lastElementChild.textContent = record['category'];

  // url
  const urlAnchor = get('url');
  get('url').firstElementChild.setAttribute('href', record['url']);
  get('urlText').textContent = record['url'];
}


applyTheme({});
if (window.browser) {
  loadQuotes().then(qs => render(randomItem(qs)));
}
// storage.clear().then(loadQuotes);

// -- start expanded stuff
let expanded = false;

get('toggle').onclick = function(event) {
  const containerDiv =  get('container');
  const rootClasses = document.documentElement.classList;
  const button = event.target;

  expanded = !expanded;
  if (expanded) {
    rootClasses.remove('is-collapsed');
    rootClasses.add('is-expanded');
    button.textContent = "\u25b2";
  } else {
    rootClasses.remove('is-expanded');
    rootClasses.add('is-collapsed');
    button.textContent = "\u25bc";
  }
}
// -- end expanded stuff
