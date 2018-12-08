const get =  document.getElementById.bind(document);
// const storage = browser.storage.sync;

/**
 * Returns a random array element.
 */
function randomItem(arr) {
  const rIndex = Math.floor(Math.random() * arr.length);
  return arr[rIndex];
  // return arr[3]; // randomly selected by fair dice roll
}

/**
 * Given the stored options, applies the selected theme, or the default.
 */
function applyTheme(options) {
  const theme = options['theme'] || 'indexCard';
  document.documentElement.classList.add(theme);
}

/**
 * Loads quote list from browser storage. If there are no quotes, storage is first seeded
 * with the included quotes.
 */
function loadQuotes() {
  storage.get('storedQuotes').then((response) => {
    var quotes = response['storedQuotes'];
    if (!quotes) {
      seedStorage().then(loadQuotes);
    }
    render(randomItem(quotes));
  });
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
  get('category').textContent = record['category'];

  // url
  const aTag = document.createElement('a');
  aTag.setAttribute('href', record['url']);
  aTag.innerHTML = record['url'];
  get('url').append(aTag);
}


applyTheme({});
// loadQuotes();
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
