;
window.boxes = (function($) {

  function init() {
    $('#sidebar')
      .asEventStream('click', '.box')
      .map(function(e) {
        return $(e.currentTarget)
      })
      .onValue(function($box) {
        $box.toggleClass('expanded')
        calculateBoxHeights()
      })

    setTimeout(function() {
      calculateBoxHeights()
    }, 50)
  }

  function calculateBoxHeights() {
    var collapsedBoxHeight = 60
    var collapsedBoxes = $('#sidebar').find('.box:not(.expanded)')
    var expandedBoxes = $('#sidebar').find('.box.expanded')

    collapsedBoxes
      .each(function() {
        $(this).css('height', collapsedBoxHeight + 'px')
      })

    expandedBoxesWithMaxHeight =
      expandedBoxes
        .filter(function() {
          return $(this).css('max-height') != 'none'
        })

    expandedBoxesWithoutMaxHeight =
      expandedBoxes
        .filter(function() {
          return $(this).css('max-height') == 'none'
        })

    expandedBoxesWithMaxHeight
      .each(function() {
        $(this).css('height', $(this).css('max-height'))
      })

    expandedBoxesWithoutMaxHeight
      .each(function() {
        var relativeSpaceForBox = 100 / expandedBoxesWithoutMaxHeight.length
        var expandedTotalAbsoluteHeight =
          expandedBoxesWithMaxHeight
            .map(function() {
              return parseInt($(this).css('height'), 10)
            })
            .toArray()
            .reduce(function(total, height) {
              return total + height
            }, 0)
        var collapsedTotalHeight = collapsedBoxes.length * collapsedBoxHeight / expandedBoxesWithoutMaxHeight.length
        var absoluteSpaceUsed = collapsedTotalHeight + expandedTotalAbsoluteHeight / expandedBoxesWithoutMaxHeight.length
        var newBoxHeight = 'calc(' + relativeSpaceForBox + '% - ' + absoluteSpaceUsed + 'px)'
        console.log('new box height', newBoxHeight)
        $(this).css('height', newBoxHeight)
      })
  }

  return {
    init: init
  }

})(jQuery)
