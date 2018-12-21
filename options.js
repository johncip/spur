function renderQuote(quote, $root) {
  const $parent = $('<div class="quoteParent">');
  const $left = $('<div class="leftChild">').appendTo($parent);
  const $right = $('<div class="rightChild">').appendTo($parent);

  $('<textarea class="quoteInput">').val(quote['quote']).appendTo($left);
  $('<input type="text" class="authorInput">').val(quote['author']).appendTo($left);
  $('<input type="text" class="categoryInput">').val(quote['category']).appendTo($left);
  $('<input type="text" class="urlInput">').val(quote['url']).appendTo($left);

  $('<button>').text('✖').appendTo($right);

  $parent.appendTo($root);
}

/* Renders the options page. */
async function render() {
  // do options
  const opts = await loadOptions();
  $('#wakeTime').val(opts.wakeTime); // TODO: make this a time input

  // do quotes
  const quotes = await loadQuotes();
  const $root = $('#quotes');
  quotes.forEach((quote) => renderQuote(quote, $root));
}

$('button').click(async () => {
  await browser.storage.sync.set({
    options: {
      theme: $('#theme')[0].value,
      wakeTime: $('#wakeTime')[0].value
    }
  });
  $('#savedStatus').text('Saved!')
});

render();
