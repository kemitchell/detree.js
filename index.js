var AJV = require('ajv')
var schema = require('./schema')

var ajv = new AJV()
var validate = ajv.compile(schema)

module.exports = function (tree) {
  var valid = validate(tree)
  if (!valid) return validate.errors
  var errors = []
  errors = errors.concat(allGoToTargetsValid(tree))
  errors = errors.concat(allQuestionsReferenced(tree))
  return errors
}

function allGoToTargetsValid (tree) {
  var errors = []
  var ids = Object.keys(tree)
  for (var questionIndex = 0; questionIndex < tree.length; questionIndex++) {
    var question = tree[questionIndex]
    for (var answerIndex = 0; answerIndex < question.answers.length; answerIndex++) {
      var answer = question.answers[answerIndex]
      if (answer.hasOwnProperty('goto')) {
        var goto = answer.goto
        if (ids.indexOf(goto) === -1) {
          errors.push(
            'Question ' + question.id + ', ' +
            'answer "' + answer.text + '"' +
            ' references nonexistent ' + answer.goto +
            '.'
          )
        }
      }
    }
  }
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
      errors.push('No answer references ' + id + '.')
    }
  })
  return errors
}
