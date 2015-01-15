function isInCurrentView($e) {
  var windowTopOffset = $(window).scrollTop()
  var windowHeight = $(window).height()
  var windowBottomOffset = windowTopOffset + windowHeight
  var elementPosition = $e.position().top
  console.table([{
    windowTopOffset: windowTopOffset,
    windowHeight: windowHeight,
    windowBottomOffset: windowBottomOffset,
    elementPosition: elementPosition
  }])
  return ((windowTopOffset <= elementPosition) <= windowBottomOffset)
}

$win = $(window)

Bacon.mergeAll([
  $win.asEventStream('load'),
  $win.asEventStream('scroll'),
  $win.asEventStream('resize')
])
  .debounce(100)
  .map(function() {
    windowHeight = $win.height()
    windowTop = $win.scrollTop()
    windowBottom = windowTop + windowHeight
    topbar = $('#topbar-2').position().top + $('#topbar-2').height()
    arvat = $('#arvat').position().top
    topVisible = windowTop < topbar
    bottomVisible = windowBottom > arvat
    return {
      windowHeight: windowHeight,
      windowTop: windowTop,
      windowBottom: windowBottom,
      topbar: topbar,
      arvat: arvat,
      topVisible: topVisible
    }
  })
  .onValue(function(x) {
    console.table([x])
    if (x.windowHeight < 600) {
      $('#sidebar')
        .css('position', 'absolute')
        .css('top', '10px')
        .css('bottom', '10px')
        .css('min-height', '500px')
        .css('max-height', '500px')
    } else if (x.topVisible) {
      console.log('top visible!')
      $('#sidebar')
        .css('position', 'fixed')
        .css('top', x.topbar - x.windowTop + 10)
        .css('bottom', '10px')
        .css('min-height', '500px')
        .css('max-height', '700px')
    // } else if (x.bottomVisible) {
    //   console.log('bottom visible')
    //   $('#sidebar')
    //     .css('position', 'absolute')
    //     .css('top', '10px')
    //     .css('bottom', x.windowBottom - x.arvat)
    } else {
      $('#sidebar')
        .css('position', 'fixed')
        .css('top', '10px')
        .css('bottom', '10px')
    }
  })
