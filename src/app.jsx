import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons/faGlobeAmericas';

import { loadOptions, loadQuotes } from './util';

import 'Styles/app.scss';
import 'Styles/index_card.scss';
import 'Styles/index_card_dark.scss';

/*
 * A button captioned with an up or down triangle.
 */
class ToggleButton extends Component {
  render() {
    return (
      <button id="toggle" onClick={this.props.handleClick}>
        {this.props.up ? '\u25b2' : '\u25bc'}
      </button>
    );
  }
}

/*
 * A displayed quote, with author, etc.
 */
class Quote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  /**
   * Reverses state.expanded (which hides & shows the URL and category).
   */
  toggleDrawer = () => {
    this.setState({expanded: !this.state.expanded});
  }

  /**
   * Returns an appropriate font size for the given text string. That is, longer strings will
   * have a smaller font size, and shorter strings will have a larger font size.
   */
  adjustedFontSize(text) {
    const size = 150 * (1 / (text.length ** 0.3));
    return `${size}px`;
  }

  containerClass() {
    if (this.state.expanded)
      return 'is-expanded';
    else
      return 'is-collapsed';
  }

  render() {
    return (
      <div id="container" className={this.containerClass()}>
        <div id="quote" style={{fontSize: this.adjustedFontSize(this.props.quote)}}>
          {this.props.quote}
        </div>
        <div id="author">{this.props.author}</div>
        <hr/>
        <div id="url">
          <i className="fas fa-globe-americas"></i>
          <a href={this.props.url} id="urla">{this.props.url}</a>
        </div>
        <div id="category">
          <i className="fas fa-box"></i>
          <span id="categoryText">{this.props.category}</span>
        </div>

        <ToggleButton
          up={this.state.expanded}
          handleClick={this.toggleDrawer}
        />
      </div>
    );
  }
}

/*
 * Loads a quote and renders the <Quote/>.
 */
class QuoteLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quote: undefined,
      author: undefined,
      url: undefined,
      category: undefined,
    };
  }

  randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  componentDidMount() {
    loadQuotes().then(quotes => this.setState(this.randomItem(quotes)));
  }

  render() {
    if (!this.state.quote) return null;

    return (
      <Quote
        quote={this.state.quote}
        author={this.state.author}
        url={this.state.url}
        category={this.state.category}
      />
    );
  }
}

(async function () {
  // apply theme
  const options = await loadOptions();
  document.documentElement.classList.add(options.theme);

  ReactDOM.render(<QuoteLoader />, document.body);

  // font-awesome
  library.add(faBox, faGlobeAmericas);
  dom.watch();
})();
