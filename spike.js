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

$win.asEventStream('scroll')
  .debounce(100)
  .map(function() {
    return {
      top: $win.scrollTop(),
      bottom: $win.scrollTop() + $win.height(),
      topbar: $('#topbar-2').position().top + $('#topbar-2').height()
    }
  })
  .doAction(function(x) {
    console.table([x])
  })
  .map(function(o) {
    return {
      topbarVisible: o.top < o.topbar
    }
  })
  .onValue(function(x) {
    console.table([x])
  })
