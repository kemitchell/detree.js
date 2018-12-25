var AJV = require('ajv')
var schema = require('./schema')

var ajv = new AJV()
var validate = ajv.compile(schema)

module.exports = function (tree) {
  var valid = validate(tree)
  if (!valid) return validate.errors
  var errors = []
  // TODO: Check for cycles.
  errors = errors.concat(hasStartQuestion(tree))
  errors = errors.concat(allGoToTargetsValid(tree))
  errors = errors.concat(allQuestionsReferenced(tree))
  return errors
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
