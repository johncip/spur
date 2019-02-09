import $ from 'jquery'
import Backbone from 'backbone'
import Mustache from 'mustache'

import { loadOptions, loadQuotes } from './util'

import 'Styles/options.scss'

const Quote = Backbone.Model.extend({
  defaults: {
    mode: 'display',
  },
})

// // TODO: use me
// const Corpus = Backbone.Collection.extend({
//   model: Quote,
// });

const QuoteListItem = Backbone.View.extend({
  tagName: 'li',
  initialize(options) {
    this.model = options.model
    this.listenTo(this.model, 'change', this.render)
  },

  // TODO: this seems backwards
  wrapTemplate(middle) {
    return `
      <div class="quoteListItem">
        <div class="quoteListItem--first">
          ${middle}
        </div>
        <div class="quoteListItem--second">
          <button class="btn btn-delete">✖</button>
        </div>
      </div>
    `
  },
  renderEdit() {
    const template = this.wrapTemplate(`
      <textarea class="edit edit-quote">{{ quote }}</textarea>
      <input type="text" class="edit edit-author" value="{{author}}"></input>
      <input type="text" class="edit edit-category" value="{{category}}"></input>
      <input type="text" class="edit edit-url" value="{{url}}"></input>
    `, this.model.attributes)
    return Mustache.render(template, this.model.attributes)
  },
  renderDisplay() {
    const template = this.wrapTemplate(`
      <div class="display display-quote">{{ quote }}</div>
    `)
    // <div class="display display-author">{{ author }}</div>
    // <div class="display display-category">{{ category }}</div>
    // <div class="display display-url">{{ url }}</div>
    return Mustache.render(template, this.model.attributes)
  },

  // TODO: look into class-based polymorphism for backbone views
  render() {
    let dom = null
    if (this.model.attributes.mode === 'display') {
      dom = this.renderDisplay()
    } else {
      dom = this.renderEdit()
    }

    this.$el.empty().append(dom)
    return this
  },
})

// TODO: use the Corpus collection (am I just using an array right now?)
const QuoteListView = Backbone.View.extend({
  collection: null,
  el: '.js-quoteList',
  initialize(options) {
    this.collection = options.collection
    this.viewList = []
  },
  events: {
    click: 'handleClick',
  },
  handleClick(event) {
    this.viewList.forEach((view) => {
      if (view.el.contains(event.target)) {
        view.model.set({ mode: 'edit' })
      } else {
        view.model.set({ mode: 'display' })
      }
    })
  },
  render() {
    this.$el.empty()

    this.collection.forEach((item) => {
      const view = new QuoteListItem({
        model: new Quote(item),
      })
      this.viewList.push(view)
      this.el.append(view.render().el)
    })

    return this
  },
})


async function renderOptions() {
  const opts = await loadOptions()
  $('#wakeTime').val(opts.wakeTime) // TODO: make this a time input

  $('button').click(async () => {
    await browser.storage.sync.set({
      options: {
        theme: $('#theme')[0].value,
        wakeTime: $('#wakeTime')[0].value,
      },
    })
    $('#savedStatus').text('Saved!')
  })
}

async function renderQuotes() {
  const quotes = await loadQuotes()
  const view = new QuoteListView({
    collection: quotes,
  })
  view.render()

  $('body').click((ev) => {
    if ($('.js-quoteList')[0].contains(ev.target)) {
      return
    }
    /* if they clicked in a display-mode quote & it got removed
       from the dom (updated) already by container click handler */
    if (!document.body.contains(ev.target)) {
      return
    }
    view.handleClick(ev)
  })
}

renderOptions()
renderQuotes()
