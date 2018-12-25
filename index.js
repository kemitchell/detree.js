var AJV = require('ajv')
var schema = require('./schema')

var ajv = new AJV()
var validate = ajv.compile(schema)

module.exports = function (tree) {
  var valid = validate(tree)
  if (!valid) return validate.errors
  var errors = []
    .concat(cycles(tree))
    .concat(hasStartQuestion(tree))
    .concat(allGoToTargetsValid(tree))
    .concat(allQuestionsReferenced(tree))
  return errors
}

function cycles (tree) {
  var errors = []
  if (!tree.start) return errors
  recurse('start', [])
  return errors

  function recurse (key, previous) {
    if (previous.indexOf(key) !== -1) {
      errors.push('Question "' + key + '" cycles back to itself.')
      return
    }
    var question = tree[key]
    if (question === undefined) return
    var answers = Object.values(question.answers)
    answers.forEach(function (answer) {
      if (!answer.hasOwnProperty('goto')) return
      recurse(answer.goto, previous.concat(key))
    })
  }
}

function hasStartQuestion (tree) {
  var hasStart = Object.keys(tree).some(function (id) {
    return id === 'start'
  })
  return hasStart ? [] : ['Missing "start" question.']
}

function allGoToTargetsValid (tree) {
  var errors = []
  var ids = Object.keys(tree)
  Object.keys(tree).forEach(function (questionKey) {
    var question = tree[questionKey]
    Object.keys(question.answers).forEach(function (answerKey) {
      var answer = question.answers[answerKey]
      if (answer.hasOwnProperty('goto')) {
        var goto = answer.goto
        if (ids.indexOf(goto) === -1) {
          errors.push(
            'Question "' + questionKey + '", ' +
            'answer "' + answerKey + '" ' +
            'references nonexistent "' + answer.goto + '".'
          )
        }
      }
    })
  })
  return errors
}

function allQuestionsReferenced (tree) {
  var errors = []
  Object.keys(tree).forEach(function (id) {
    if (id === 'start') return
    var referenced = Object.values(tree)
      .some(function (question) {
        return Object.values(question.answers)
          .some(function (answer) {
            return answer.goto === id
          })
      })
    if (!referenced) {
      errors.push('No answer references "' + id + '".')
    }
  })
  return errors
}
