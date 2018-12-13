/* Renders the options page. */
async function render() {
  const options = await loadOptions();
  console.log(options);
  $('#wakeTime')[0].value = options.wakeTime;
}

$('button').click(async () => {
  await browser.storage.sync.set({
    options: {
      theme: $('#theme')[0].value,
      wakeTime: $('#wakeTime')[0].value
    }
  });
  $('#savedStatus')[0].text = 'Saved!'
});

render();
