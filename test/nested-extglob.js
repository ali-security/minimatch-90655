var t = require('tap')
var minimatch = require('../')

function timed(fn) {
  var s = Date.now()
  var result = fn()
  return {
    result: result,
    ms: Date.now() - s
  }
}

var cases = [
  ['*(+(*(a|b)|c)|d)', 15],
  ['*(*(*(*(*(*(a|f)|g)|h)|i)|j)|k)', 15],
  ['*(+(*(+(*(+(a|m)|n)|o)|p)|q)|r)', 15],
  ['*(*(+(+(?(@(a|t)|u)|v)|w)|x)|y)', 15],
  ['*(*(*(a|a)))', 15],
  ['*(*(*(a|c)))', 17],
  ['*(*(*(a|e)))', 19],
  ['*(*(a|g))', 23],
  ['*(a|i)', 101],
]

cases.forEach(function (c) {
  var pat = c[0]
  var n = c[1]
  var str = new Array(n + 1).join('a') + 'z'
  var tm = timed(function () {
    return minimatch(str, pat)
  })
  t.ok(tm.ms < 100,
    pat + ' chars=' + n + ' ms=' + tm.ms,
    { wanted: 'ms should be < 100', ms: tm.ms })
})
