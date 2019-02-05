import 'Styles/app.scss';
import 'Styles/index_card.scss';
import 'Styles/index_card_dark.scss';

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
function applyTheme(theme) {
  document.documentElement.classList.add(theme);
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

if (window.browser) {
  loadOptions().then(opts => applyTheme(opts['theme']));
} else {
  applyTheme({});
}

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
