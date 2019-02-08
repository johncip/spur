import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons/faGlobeAmericas';

import { loadOptions, loadQuotes, randomItem, adjustedFontSize } from './util';

import 'Styles/app.scss';
import 'Styles/index_card.scss';
import 'Styles/index_card_dark.scss';

// ---------------------------------------------------------------------------------------

/*
 * expand the box
 */
let expanded = false;
document.getElementById('toggle').onclick = (event) => {
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
  loadOptions().then(opts => document.documentElement.classList.add(opts.theme));
} else {
  document.documentElement.classList.add('indexCard');
}

/**
 * Fills the DIVs with quote text, author, etc.
 */
function fill(record) {
  document.getElementById('quote').textContent = record.quote;
  document.getElementById('quote').style.fontSize = adjustedFontSize(record.quote);
  document.getElementById('author').textContent = record.author;
  document.getElementById('category').lastElementChild.textContent = record.category;
  document.getElementById('urla').setAttribute('href', record.url);
  document.getElementById('urla').textContent = record.url;
}

/*
 * print a quote
 */
if (window.browser) {
  loadQuotes().then(qs => fill(randomItem(qs)));
} else {
  fill({
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
