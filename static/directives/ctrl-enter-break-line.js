angular.module('webchatApp').directive('ctrlEnterBreakLine', function() {
  return function(scope, element, attrs) {
    var ctrlDown = false
    element.bind("keydown", function(evt) {
      if (evt.which == 17) {
        ctrlDown = true
        setTimeout(function() {
          ctrlDown = false
        }, 1000)
      }
      if (evt.which == 13) {
        if (ctrlDown) {
          scope.$apply(function() {
            scope.$eval(attrs.ctrlEnterBreakLine)
          })
          evt.preventDefault()
        }
      }
    })
  }
})
