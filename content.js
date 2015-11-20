var observer = new MutationObserver(function() {
  var today = new Date(),
      itemCache = JSON.parse(localStorage.Items),
      taskEditor = $('div#editor'),
      taskNotesModal = $('div#GB_window'),
      taskCompletedList = taskEditor.find('div#completed_app');

  function drawSquare(ctx, r, c) {
    /**
     * |* * *|
     * |* x x| ==> blockIndex = 5
     * |x x x|
     *         Although this calculation is based on how drawSquares works
     */
    var blockIndex = ((3-r)*3+(3-c)),
        rgbValue = 255 - blockIndex*18;

    // color should be increasing gradient (white -> black) as the blockIndex increase
    ctx.fillStyle = 'rgb(' + rgbValue + ','+ rgbValue + ','+ rgbValue +')';
    ctx.fillRect(c*7, r*7, 4, 4);
  }

  function drawSquares(canvas, count) {
    var r, c,
        numSq = count,
        ctx = canvas.getContext('2d');

    for (r = 2; numSq > 0 && r >= 0; r--) {
        for (c = 2; numSq > 0 && c >= 0; c--) {
            drawSquare(ctx, r, c);
            numSq--;
        }
    }
  }

  function getDaysBetween(today, dateAdded) {
    var dateDiff = today-dateAdded,
        msPerDay = 1000*60*60*24;
    return Math.round(dateDiff/msPerDay);
  }

  // Will esplode on completed list
  if (taskCompletedList.length === 0) {

    // The reorder item is not an actual task
    taskEditor.find('.task_item').not('.reorder_item').each(function () {
      var taskTableRow = $(this).find('tr'),
          itemId, item, dateAdded, canvas, stalenessEl, stalenessContainer, daysBetween;

      // skip if we already added a staleness container
      if (taskTableRow.find('.staleness-container').length === 0) {

        // recurring tasks are handled differently
        if (taskTableRow.find('img.cmp_recurring').length === 0) {

          // The id is on the task item element *Be warry when refactoring
          itemId = $(this)[0].id.slice(5);
          item = itemCache[itemId] || {};
          dateAdded = new Date(item.date_added);
          daysBetween = getDaysBetween(today, dateAdded);

          if (daysBetween === 0) {
            // 0 days get black sun
            stalenessContainer = taskTableRow.prepend('<td class="staleness-container">&#9728</td>').find('.staleness-container');
            stalenessContainer.css('padding-right', '1px');
            stalenessContainer.css('padding-top', '4px');
            stalenessContainer.css({'font-size': 24});
          }
          else if (daysBetween > 9) {
            // Greate that 9 days get comet of dooooom!
            stalenessContainer = taskTableRow.prepend('<td class="staleness-container">&#9732</td>').find('.staleness-container');
            stalenessContainer.css('padding-right', '1px');
            stalenessContainer.css('padding-top', '4px');
            stalenessContainer.css({'font-size': 24});
          } else {
            // Add an element to indicate staleness
            taskTableRow.prepend('<td class="staleness-container"><canvas id="staleness"></canvas></td>');

            // edit the staleness containter
            stalenessEl = taskTableRow.find('td.staleness-container');
            stalenessEl.css('padding-right', '5px');
            stalenessEl.css('padding-top', '15px');

            // edit the staleness canvas
            canvas = stalenessEl.find('#staleness')[0];
            canvas.width = 18;
            canvas.height = 18;

            // add the staleness indicator

            drawSquares(canvas, daysBetween);
          }
        } else {
          // Recurring tasks get coffee character
          stalenessContainer = taskTableRow.prepend('<td class="staleness-container">&#9749</td>').find('.staleness-container');
          stalenessContainer.css('padding-right', '1px');
          stalenessContainer.css('padding-top', '4px');
          stalenessContainer.css({'font-size': 24});
        }
      }
    });
  }

  // Get the task in the task notes modal separately
  taskNotesModal.find('.task_item').each(function () {
    var taskTableRow = $(this).find('tr'),
        itemId, item, dateAdded;

    if (taskTableRow.find('.staleness-container').length === 0) {

      // The id is on the task item element *Be warry when refactoring
      itemId = $(this)[0].id.slice(5);
      item = itemCache[itemId] || {};
      dateAdded = new Date(item.date_added);

      // Add element containing the days since the task was created
      taskTableRow.prepend('<td class="staleness-container"></td>').find('.staleness-container').text(getDaysBetween(today, dateAdded)).css('padding-right', '5px');
    }
  });
});

observer.observe(document, {
  subtree: true,
  childList: true
});
