/* Renders the options page. */
async function render() {
  // do options
  const opts = await loadOptions();
  $('#wakeTime').val(opts.wakeTime); // TODO: make this a time input
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
