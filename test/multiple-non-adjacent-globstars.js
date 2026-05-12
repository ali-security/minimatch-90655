var tap = require('tap')
var minimatch = require('../')

tap.test('GHSA-7r86-cg39-jmmj', function (t) {
  var k = 50
  var parts = []
  var i
  for (i = 0; i < k; i++) {
    parts.push('**/a')
  }
  var pattern = parts.join('/') + '/b/**'
  var aparts = []
  for (i = 0; i < 100; i++) {
    aparts.push('a')
  }
  var patha = aparts.join('/') + '/a'
  var pathb = aparts.join('/') + '/b/c/d/.e/a/b'

  var starta = Date.now()
  t.equal(minimatch(patha, pattern), false)
  var dura = Date.now() - starta
  t.ok(dura < 1000, 'should take less than 1s to find mismatch (' + dura + 'ms)')

  var startb = Date.now()
  t.equal(minimatch(pathb, pattern, { dot: true }), true)
  var durb = Date.now() - startb
  t.ok(durb < 1000, 'should take less than 1s to find match (' + durb + 'ms)')

  var startc = Date.now()
  t.equal(minimatch(pathb, pattern), false)
  var durc = Date.now() - startc
  t.ok(durc < 1000, 'should take less than 1s to find dot mismatch (' + durc + 'ms)')

  t.end()
})

tap.test('alphabetical', function (t) {
  var alphabet = 'abcdefghijklmnopqrstuvwxyz'
  var repeated = ''
  var i, j
  for (i = 0; i < 5; i++) {
    repeated += alphabet
  }
  var chars = repeated.split('')
  var patternParts = []
  for (i = 0; i < chars.length; i++) {
    patternParts.push('**/' + chars[i])
  }
  var pattern = patternParts.join('/') + '/**'

  function exclude(c) {
    return alphabet.split('').filter(function (ch) { return ch !== c })
  }

  var pathParts = []
  for (i = 0; i < chars.length; i++) {
    var ex = exclude(chars[i])
    for (j = 0; j < ex.length; j++) {
      pathParts.push(ex[j])
    }
  }
  var tail = exclude('a').concat(['a'])
  for (i = 0; i < tail.length; i++) {
    pathParts.push(tail[i])
  }
  var path = pathParts.join('/')

  var start = Date.now()
  t.equal(minimatch(path, pattern, { maxGlobstarRecursion: 30 }), false)
  t.equal(minimatch(path, pattern), true)
  var dur = Date.now() - start
  t.ok(dur < 5000, 'alphabet test completed in ' + dur + 'ms')

  t.end()
})

tap.test('tail handling 1', function (t) {
  var pattern = '.x/**/*/*/**'
  var match = '.x/.y/.z/'
  var nomatch = '.x/.y/.z'
  t.equal(minimatch(match, pattern, { dot: true }), true)
  t.equal(minimatch(nomatch, pattern, { dot: true }), false)
  t.end()
})

tap.test('tail handling 2', function (t) {
  var pattern = '.x/**/**/*'
  var match = '.x/.y/.z/'
  var nomatch = '.x/'
  t.equal(minimatch(match, pattern, { dot: true }), true)
  t.equal(minimatch(nomatch, pattern, { dot: true }), false)
  t.end()
})
