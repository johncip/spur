function renderQuote(quote, $root) {
  const $parent = $('<div class="quoteParent">');
  const $left = $('<div class="leftChild">').appendTo($parent);
  const $right = $('<div class="rightChild">').appendTo($parent);

  $('<textarea class="input-quote">').val(quote['quote']).appendTo($left);
  $('<input type="text" class="input-author">').val(quote['author']).appendTo($left);
  $('<input type="text" class="input-category">').val(quote['category']).appendTo($left);
  $('<input type="text" class="input-url">').val(quote['url']).appendTo($left);

  $('<button>').addClass('deleteBtn').text('✖').appendTo($right);

  $parent.appendTo($root);
}

/* Renders the options page. */
async function render() {
  // do options
  const opts = await loadOptions();
  $('#wakeTime').val(opts.wakeTime); // TODO: make this a time input

  // do quotes
  const quotes = await loadQuotes();
  const $root = $('.js-quotes').eq(0);
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

function sup() {
  var AppView = Backbone.View.extend({
    el: '#bb-container',
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html('supbra');
    }
  });

  new AppView();
}

sup();
