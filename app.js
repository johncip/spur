/**
 * Returns a random array element.
 */
function randomItem(arr) {
  const rIndex = Math.floor(Math.random() * arr.length);
  return arr[rIndex];
  // return arr[3]; // randomly selected by fair dice roll
}

/**
 * Loads quote list from browser storage. If there are no quotes, storage is first seeded
 * with the included quotes.
 */
function loadQuotes() {
  const storage = browser.storage.sync;
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
  const storage = browser.storage.sync;
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
  const quoteDiv = document.getElementById('quote');
  quoteDiv.textContent = record['quote'];
  quoteDiv.style.fontSize = adjustedFontSize(record['quote']);

  // author
  document.getElementById('author').textContent = record['author'];

  // category
  document.getElementById('category').textContent = record['category'];

  // url
  const aTag = document.createElement('a');
  aTag.setAttribute('href', record['url']);
  aTag.innerHTML = record['url'];
  document.getElementById('url').append(aTag);
}

// loadQuotes();
browser.storage.sync.clear().then(loadQuotes);
