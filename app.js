function randomItem(arr) {
  const rIndex = Math.floor(Math.random() * arr.length);
  return arr[rIndex];
}

function populate(record) {
  // quote
  const quoteDiv = document.getElementById('quote');
  quoteDiv.textContent = record['quote'];

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


// TODO: seed quotes on first run (or empty storage), but not after
function seedQuotes(func) {
  // const url = browser.extension.getURL('seeds.json');
  // fetch(url).then((response) => response.json())
  //           .then((seeds) => browser.storage.sync.set({seeds}))
  //           //
  //           .then(() => {
  //             browser.storage.sync.get('seeds')
  //               .then((response) => func(response['seeds']));
  //           });

  browser.storage.sync.get('seeds')
    .then((response) => func(response['seeds']));
}

function go(corpus) {
  console.log(corpus);
  populate(randomItem(corpus));
  // populate(corpus[corpus.length - 1]);
}

seedQuotes(go);