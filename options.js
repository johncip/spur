const Quote = Backbone.Model.extend({
  defaults: {}
});

const Corpus = Backbone.Collection.extend({
  model: Quote
});

const QuoteListItem = Backbone.View.extend({
  tagName: 'li',
  renderEdit: function() {
    return Mustache.render(`
      <div class="quoteListItem">
        <div class="quoteListItem--first">
          <textarea class="edit edit-quote">{{ quote }}</textarea>
          <input type="text" class="edit edit-author" value="{{author}}"></input>
          <input type="text" class="edit edit-category" value="{{category}}"></input>
          <input type="text" class="edit edit-url" value="{{url}}"></input>
        </div>
        <div class="quoteListItem--second">
          <button class="deleteBtn">✖</button>
        </div>
      </div>
    `, this.model.attributes);
  },
  renderDisplay: function() {
    return Mustache.render(`
      <div class="quoteListItem">
        <div class="quoteListItem--first">
          <div class="display display-quote">{{ quote }}</div>
          <div class="display display-author">{{ author }}</div>
          <div class="display display-category">{{ category }}</div>
          <div class="display display-url">{{ url }}</div>
        </div>
        <div class="quoteListItem--second">
          <button class="deleteBtn">✖</button>
        </div>
      </div>
    `, this.model.attributes);
  },
  render: function() {
    // const dom = this.renderEdit();
    const dom = this.renderDisplay();
    $(dom).appendTo(this.$el);
    return this;
  }
});

const QuoteListView = Backbone.View.extend({
  collection: null,
  el: '.js-quoteList',
  initialize: function(options) {
    this.collection = options.collection;
  },
  render: function() {
    this.$el.empty();

    this.collection.forEach((item) => {
      var view = new QuoteListItem({
        model: new Quote(item)
      });
      this.el.append(view.render().el);
    });

    return this;
  }
});


async function renderOptions() {
  const opts = await loadOptions();
  $('#wakeTime').val(opts.wakeTime); // TODO: make this a time input

  $('button').click(async () => {
    await browser.storage.sync.set({
      options: {
        theme: $('#theme')[0].value,
        wakeTime: $('#wakeTime')[0].value
      }
    });
    $('#savedStatus').text('Saved!')
  });
}

async function renderQuotes() {
  const quotes = await loadQuotes();
  const view = new QuoteListView({
    collection: quotes
  });
  view.render();
}

renderOptions();
renderQuotes();
