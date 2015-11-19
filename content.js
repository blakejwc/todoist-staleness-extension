var observer = new MutationObserver(function() {
  var today = new Date(),
      itemCache = JSON.parse(localStorage.Items),
      taskEditor = $('div#editor'),
      taskNotesModal = $('div#GB_window'),
      taskCompletedList = taskEditor.find('div#completed_app');

  function drawSquare(ctx, r, c) {
    ctx.beginPath();
    ctx.rect(c*7, r*7, 4, 4);
    ctx.fill();
  }

  function fillCanvas(ctx) {
    ctx.beginPath();
    ctx.rect(4, 4, 10, 10);
    ctx.fill();
  }

  function drawSquares(canvas, count) {
    var r,
        numSq = count,
        ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
    if (count > 9) {
      fillCanvas(ctx);
    } else {
      for (r = 0; numSq > 0 && r < 3; r++) {
          var c;
          for (c = 0; numSq > 0 && c < 3; c++) {
              drawSquare(ctx, r, c);
              numSq--;
          }
      }
    }
  }

  function getDaysBetween(today, dateAdded) {
    var dateDiff = today-dateAdded,
        dateFactor = 1000*60*60*24;
    return Math.round(dateDiff/dateFactor);
  }

  // Will esplode on completed list
  if (taskCompletedList.length === 0) {

    // The reorder item is not an actual task
    taskEditor.find('.task_item').not('.reorder_item').each(function () {
      var taskTableRow = $(this).find('tr'),
          itemId, item, dateAdded, canvas, stalenessEl;

      // skip if we already added a staleness container
      if (taskTableRow.find('.staleness-container').length === 0) {

        // recurring tasks are handled differently
        if (taskTableRow.find('img.cmp_recurring').length === 0) {

          // The id is on the task item element *Be warry when refactoring
          itemId = $(this)[0].id.slice(5);
          item = itemCache[itemId] || {};
          dateAdded = new Date(item.date_added);

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
          drawSquares(canvas, getDaysBetween(today, dateAdded));
        } else {
          // Handle the recurreing tasks by creating invisible space
          taskTableRow.prepend('<td class="staleness-container"></td>').find('.staleness-container').css('padding-right', '23px');
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
