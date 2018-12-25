```javascript
var detree = require('detree')

var first = {
  "start": {
    "question": "Do you want anything back from your users?",
    "answers": {
      "No": {
        "result": "CC0-1.0"
      },
      "Yes": {
        "goto": "attribution"
      }
    }
  },
  "attribution": {
    "question": "Do you want users to share code they build on similar terms?",
    "answers": {
      "No": {
        "result": "Apache-2.0"
      },
      "Yes": {
        "result": "GPL-3.0"
      }
    }
  }
}

var assert = require('assert')

assert.deepEqual(detree(first), [/* no errors */])

var second = {
  "not start": {
    "question": "Do you want anything back from your users?",
    "answers": {
      "No": {
        "result": "CC0-1.0"
      },
      "Yes": {
        "result": "Apache-2.0"
      }
    }
  }
}

assert.deepEqual(
  detree(second),
  [
    'Missing "start" question.',
    'No answer references "not start".'
  ]
)

var third = {
  "start": {
    "question": "Do you want anything back from your users?",
    "answers": {
      "No": {
        "result": "CC0-1.0"
      },
      "Yes": {
        "goto": "nonexistent"
      }
    }
  }
}

assert.deepEqual(
  detree(third),
  [
    'Question "start", answer "Yes" ' +
    'references nonexistent "nonexistent".'
  ]
)

var invalid = {
  'not': 'a valid decision tree'
}

var invalidErrors = detree(invalid)
assert(Array.isArray(invalidErrors))
assert(invalidErrors.length > 0)
```
