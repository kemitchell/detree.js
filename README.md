```javascript
var detree = require('detree')

var example = {
  "start": {
    "question": "Do you want users of your software to preserve your credit and licensing information?",
    "answers": {
      "No": {
        "result": "CC0-1.0"
      },
      "Yes": {
        "goto": "copyleft"
      }
    }
  },
  "copyleft": {
    "question": "Do you want users of your software to contribute their own work as open source?",
    "answers": {
      "No": {
        "result": "Apache-2.0"
      },
      "Yes": {
        "goto": "strong copyleft"
      }
    }
  },
  "strong copyleft": {
    "question": "What kind of work by others do you want to require them to release?",
    "answers": {
      "Changes to my work": {
        "goto": "narrow copyleft"
      },
      "Larger programs they build with my work": {
        "goto": "broad copyleft"
      }
    }
  },
  "narrow copyleft": {
    "question": "Do you want others to share work when they use yours to offer network services?",
    "answers": {
      "Yes": {
        "result": "OSL-3.0"
      },
      "No": {
        "result": "MPL-2.0"
      }
    }
  },
  "broad copyleft": {
    "question": "Do you want others to share work when they use yours to offer network services?",
    "answers": {
      "Yes": {
        "result": "AGPL-3.0"
      },
      "No": {
        "result": "GPL-3.0"
      }
    }
  }
}

var assert = require('assert')
var errors = detree(example)
assert.deepEqual(errors, [])
```
