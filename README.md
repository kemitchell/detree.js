```javascript
var detree = require('detree')

var example = {
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
var errors = detree(example)
assert.deepEqual(errors, [])
```
