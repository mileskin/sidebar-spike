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

var $win = $(window)
var sidebarMinHeight = 500
var sidebarPadding = 10

Bacon.mergeAll([
  $win.asEventStream('load'),
  $win.asEventStream('scroll'),
  $win.asEventStream('resize')
])
  .debounce(100)
  .map(function() {
    var windowHeight = $win.height()
    var windowTop = $win.scrollTop()
    var windowBottom = windowTop + windowHeight
    var topbar = $('#topbar-2').position().top + $('#topbar-2').height()
    var pageContentTop = $('#page-content').position().top
    var arvat = $('#arvat').position().top
    var topVisible = windowTop < topbar
    var bottomVisible = windowBottom > arvat + topbar
    return {
      sidebarMinHeight: sidebarMinHeight,
      windowHeight: windowHeight,
      windowTop: windowTop,
      windowBottom: windowBottom,
      topbar: topbar,
      pageContentTop: pageContentTop,
      arvat: arvat,
      topVisible: topVisible,
      bottomVisible: bottomVisible
    }
  })
  .onValue(function(x) {
    console.table([x])
    if (x.windowHeight < x.sidebarMinHeight + x.topbar) {
      $('#sidebar')
        .css('position', 'absolute')
        .css('top', sidebarPadding)
        .css('bottom', sidebarPadding)
        .css('max-height', sidebarMinHeight + 'px')
    } else if (x.topVisible) {
      console.log('top visible!')
      $('#sidebar')
        .css('position', 'fixed')
        .css('top', x.topbar - x.windowTop + sidebarPadding)
        .css('bottom', sidebarPadding)
        .css('max-height', '1000px')
    } else if (x.bottomVisible) {
      var availableSideBarHeight = x.arvat - x.windowTop + x.pageContentTop - sidebarPadding - sidebarPadding
      var sidebarTopWhenEnoughRoom = x.windowTop - x.pageContentTop + sidebarPadding
      var sidebarTop = (function() {
        if (availableSideBarHeight < x.sidebarMinHeight) {
          return x.arvat - x.sidebarMinHeight - sidebarPadding - sidebarPadding
        } else {
          return sidebarTopWhenEnoughRoom
        }
      })()
      $('#sidebar')
        .css('position', 'absolute')
        .css('top', sidebarTop)
        .css('bottom', $('#page-content').height() - $('#tickets').height() + sidebarPadding)
        .css('max-height', '1000px')
    } else {
      console.log('no top or bottom')
      $('#sidebar')
        .css('position', 'fixed')
        .css('top', sidebarPadding)
        .css('bottom', sidebarPadding)
        .css('max-height', '1000px')
    }
  })
