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

const QuoteListItem = Backbone.View.extend({
  tagName: 'li',
  initialize(options) {
    this.model = options.model
    this.listenTo(this.model, 'change', this.render)
  },

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
    return Mustache.render(template, this.model.attributes)
  },

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


(async function renderOptions() {
  const opts = await loadOptions()
  $('#wakeTime').val(opts.wakeTime)

  $('button').click(async () => {
    await browser.storage.sync.set({
      options: {
        theme: $('#theme')[0].value,
        wakeTime: $('#wakeTime')[0].value,
      },
    })
    $('#savedStatus').text('Saved!')
  })
})()

(async function renderQuotes() {
  const quotes = await loadQuotes()
  const view = new QuoteListView({
    collection: quotes,
  })
  view.render()

  $('body').click((ev) => {
    if ($('.js-quoteList')[0].contains(ev.target)) {
      return
    }
    if (!document.body.contains(ev.target)) {
      return
    }
    view.handleClick(ev)
  })
})()
