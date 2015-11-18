var observer = new MutationObserver(function() {
  var today = new Date(),
      itemArray = JSON.parse(localStorage.Items);

  function drawSquare(ctx, r, c) {
      ctx.beginPath();
    ctx.rect(c*7, r*7, 4, 4);
    ctx.fill();
  }

  function drawSquares(ctx, count) {
      var r,
      numSq = count > 9 ? 9 : count;

      ctx.fillStyle = '#000000';

      for (r = 0; numSq > 0 && r < 3; r++) {
          var c;
          for (c = 0; numSq > 0 && c < 3; c++) {
              drawSquare(ctx, r, c);
              numSq--;
          }
      }
  }

  function getDaysBetween(today, dateAdded) {
    var dateDiff = today-dateAdded,
        dateFactor = 1000*60*60*24;
    return Math.round(dateDiff/dateFactor);
  }

  $('.task_item').not('.reorder_item').each(function () {
    var el = $(this),
        itemId, item, dateAdded, canvas, context, stalenessEl;

    if (el.find('.staleness-container').length === 0) {

      itemId = el[0].id.slice(5);
      item = itemArray[itemId] || {};
      dateAdded = new Date(item.date_added);

      stalenessEl = el.find('tr').prepend('<td class="staleness-container"><canvas id="staleness"></canvas></td>').find('.staleness-container');
      stalenessEl.css('padding-right', '5px');
      stalenessEl.css('padding-top', '15px');

      canvas = el.find('#staleness')[0];
      context = canvas.getContext('2d');

      canvas.width = 18;
      canvas.height = 18;

      drawSquares(context, getDaysBetween(today, dateAdded));
    }
  });
});

observer.observe(document, {
  subtree: true,
  attributes: true
});
