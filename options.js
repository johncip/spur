function newRenderEditQuote(model) {
  return Mustache.render(`
    <div class="quoteParent">
      <div class="leftChild">
        <textarea class="input-quote">{{ quote }}</textarea>
        <input type="text" class="input-author" value="{{author}}"></input>
        <input type="text" class="input-category" value="{{category}}"></input>
        <input type="text" class="input-url" value="{{url}}"></input>
      </div>
        <div class="rightChild">
        </div>
    </div>
  `, model);
}

/* Renders the options page. */
async function oldRender() {
  // do options
  const opts = await loadOptions();
  $('#wakeTime').val(opts.wakeTime); // TODO: make this a time input

  // do quotes
  const quotes = await loadQuotes();
  const $root = $('.js-quotes').eq(0);
  quotes.forEach((quote) => oldRenderEditQuote(quote, $root));
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

// ---------------------------------------------------------------------------------------

const app = {};

app.QuoteModel = Backbone.Model.extend({
  defaults: {
    author: 'john',
    quote: "don't count your chickens before they hatch",
    category: 'chicken farming',
    url: 'http://google.com'
  }
});

app.QuoteView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },
  tagName: 'li',
  render: function() {
    const dom = newRenderEditQuote(this.model.attributes);
    $(dom).appendTo(this.$el);
  }
});

app.QuoteListView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },
  el: '#quoteList',
  render: function() {
    const aQuote = new app.QuoteView({model: new app.QuoteModel()});
    this.$el.append(aQuote.el);
  }
});

new app.QuoteListView();
