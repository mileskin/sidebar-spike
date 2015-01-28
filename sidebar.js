;
window.Spike.Sidebar = (function($) {

  var $win = $(window)
  var sidebarMinHeight = 600
  var sidebarPadding = 10

  function init(calculateBoxHeights) {
    var load = $win.asEventStream('load').take(1)
    var resize = $win.asEventStream('resize').debounce(500)
    var scroll = $win.asEventStream('scroll').skip(1).debounce(100)

    var reposition =
      Bacon
        .mergeAll(load, resize, scroll)
        .map(function() {
          return $win.width() < 769
        })
        .doAction(function(isMobile) {
          console.log('reposition event, is mobile?', isMobile)
        })

    // Re-calculation needed once when entering mobile width.
    reposition
      .skipDuplicates()
      .filter(function(isMobile) {
        return isMobile
      })
      .onValue(function() {
        applySidebarPositionOnMobile()
        calculateBoxHeights()
      })

    // We need to calculate box heights once when entering desktop width.
    reposition
      .skipDuplicates()
      .filter(function(isMobile) {
        return !isMobile
      })
      .onValue(function() {
        calculateBoxHeights()
      })

    // On desktop we need to re-calculate sidebar position after each reposition event.
    reposition
      .filter(function(isMobile) {
        return !isMobile
      })
      .onValue(function() {
        applySidebarPositionOnDesktop()
      })
  }

  function applySidebarPositionOnMobile() {
    console.log('### applySidebarPositionOnMobile')
    $('#sidebar')
      .css('position', 'relative')
      .css('top', '')
      .css('bottom', '')
  }

  function applySidebarPositionOnDesktop(x) {
    console.log('### applySidebarPositionOnDesktop')
    var windowWidth = $win.width()
    var windowHeight = $win.height()
    var windowTop = $win.scrollTop()
    var windowBottom = windowTop + windowHeight
    var topbar = $('#topbar-2').position().top + $('#topbar-2').height()
    var pageContentTop = $('#page-content').position().top
    var bottomContentTop = $('#bottom-content').position().top
    var topVisible = windowTop < topbar
    var bottomVisible = windowBottom > bottomContentTop + topbar

    if (windowHeight < sidebarMinHeight + topbar) {
      console.log('small window')
      $('#sidebar')
        .css('position', 'absolute')
        .css('top', sidebarPadding)
        .css('bottom', sidebarPadding)
        .css('max-height', sidebarMinHeight + 'px')
    } else if (topVisible) {
      console.log('top visible')
      $('#sidebar')
        .css('position', 'fixed')
        .css('top', topbar - windowTop + sidebarPadding)
        .css('bottom', sidebarPadding)
        .css('max-height', '1500px')
    } else if (bottomVisible) {
      console.log('bottom visible')
      var availableSideBarHeight = bottomContentTop - windowTop + pageContentTop - sidebarPadding - sidebarPadding
      var sidebarTopWhenEnoughRoom = windowTop - pageContentTop + sidebarPadding
      var sidebarTop = (function() {
        if (availableSideBarHeight < sidebarMinHeight) {
          return bottomContentTop - sidebarMinHeight - sidebarPadding - sidebarPadding
        } else {
          return sidebarTopWhenEnoughRoom
        }
      })()
      $('#sidebar')
        .css('position', 'absolute')
        .css('top', sidebarTop)
        .css('bottom', $('#page-content').height() - $('#main-content').height() + sidebarPadding)
        .css('max-height', '1500px')
    } else {
      console.log('main content only')
      $('#sidebar')
        .css('position', 'fixed')
        .css('top', sidebarPadding)
        .css('bottom', sidebarPadding)
        .css('max-height', '1500px')
    }
  }

  return {
    init: init
  }

})(jQuery)
