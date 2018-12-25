```javascript
var detree = require('detree')

var first = {
  // The `start` question is required.
  start: {
    question: 'Do you want anything back from your users?',
    answers: {
      No: {
        // End with the given decision.
        decision: 'CC0-1.0'
      },
      Yes: {
        // Go to the `attribution` question.
        goto: 'attribution'
      }
    }
  },
  attribution: {
    question: 'Do you want users to share their own work?',
    answers: {
      No: { decision: 'Apache-2.0' },
      Yes: { decision: 'GPL-3.0' }
    }
  }
}

var assert = require('assert')

assert.deepEqual(detree(first), [/* no errors */])

var second = {
  'not start': {
    question: 'Do you want anything back from your users?',
    answers: {
      No: { decision: 'CC0-1.0' },
      Yes: { decision: 'Apache-2.0' }
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
  start: {
    question: 'Do you want anything back from your users?',
    answers: {
      No: { decision: 'CC0-1.0' },
      Yes: { goto: 'nonexistent' }
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

var fourth = {
  start: {
    question: 'Do you want anything back from your users?',
    answers: {
      No: { decision: 'CC0-1.0' },
      Yes: { goto: 'attribution' }
    }
  },
  attribution: {
    question: 'Do you want users to share their own work?',
    answers: {
      No: { decision: 'Apache-2.0' },
      Yes: { goto: 'start' } // cycle
    }
  }
}

assert.deepEqual(
  detree(fourth),
  ['Question "start" cycles back to itself.']
)

var invalid = {
  'not': 'a valid decision tree'
}

var invalidErrors = detree(invalid)
assert(Array.isArray(invalidErrors))
assert(invalidErrors.length > 0)
```
