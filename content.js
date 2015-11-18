var observer = new MutationObserver(function() {
  var today = new Date();

  function getDaysBetween(today, dateAdded) {
    var dateDiff = today-dateAdded,
        dateFactor = 1000*60*60*24;
    return Math.round(dateDiff/dateFactor);
  }

  $('.task_item').not('.reorder_item').each(function () {
    var el = $(this),
        itemId, item, dateAdded;

    if (el.find('.staleness-container').length === 0) {

      itemId = el[0].id.slice(5);
      item = JSON.parse(localStorage.Items)[itemId];
      dateAdded = new Date(item.date_added);
      el.find('.invisible_space').text(getDaysBetween(today, dateAdded));
      //el.prepend('<div class="staleness-container"></div>').find('.staleness-container').text(getDaysBetween(today, dateAdded));
    }
  });
});

observer.observe(document, {
  subtree: true,
  attributes: true
});
