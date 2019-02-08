import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons/faGlobeAmericas';

import { loadOptions, loadQuotes, randomItem } from './util';

import 'Styles/app.scss';
import 'Styles/index_card.scss';
import 'Styles/index_card_dark.scss';

function get(id) {
  return document.getElementById(id);
}

/**
 * Given the stored options, applies the selected theme, or the default.
 */
function applyTheme(theme) {
  document.documentElement.classList.add(theme);
}

/**
 * Returns an appropriate font size for the given text string. That is, longer strings will
 * have a smaller font size, and shorter strings will have a larger font size.
 *
 * (Line breaks are not taken into account.)
 */
function adjustedFontSize(text) {
  const size = 150 * (1 / (text.length ** 0.3));
  return `${size}px`;
}

/**
 * Fills the DIVs with quote text, author, etc.
 */
function render(record) {
  // quote
  const quoteDiv = get('quote');
  quoteDiv.textContent = record.quote;
  quoteDiv.style.fontSize = adjustedFontSize(record.quote);

  // author
  get('author').textContent = record.author;

  // category
  get('category').lastElementChild.textContent = record.category;

  // url
  get('urla').setAttribute('href', record.url);
  get('urla').textContent = record.url;
}

// ---------------------------------------------------------------------------------------

/*
 * expand the box
 */
let expanded = false;
get('toggle').onclick = (event) => {
  const rootClasses = document.documentElement.classList;
  const button = event.target;

  expanded = !expanded;
  if (expanded) {
    rootClasses.remove('is-collapsed');
    rootClasses.add('is-expanded');
    button.textContent = '\u25b2';
  } else {
    rootClasses.remove('is-expanded');
    rootClasses.add('is-collapsed');
    button.textContent = '\u25bc';
  }
};

/*
 * apply theme
 */
if (window.browser) {
  loadOptions().then(opts => applyTheme(opts.theme));
} else {
  applyTheme('indexCard');
}

/*
 * print a quote
 */
if (window.browser) {
  loadQuotes().then(qs => render(randomItem(qs)));
} else {
  render({
    quote: 'People who are unable to motivate themselves must be content with mediocrity, no matter how impressive their other talents.',
    author: 'Andrew Carnegie',
    category: 'Mindset',
    url: 'https://www.brainyquote.com/quotes/andrew_carnegie_391523',
  });
}

/* font awesome */
library.add(faBox, faGlobeAmericas);
dom.watch();

// /* DEBUG: clear (and re-seed) storage */
// browser.storage.sync.clear().then(loadQuotes);