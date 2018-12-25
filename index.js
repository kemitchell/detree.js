var ajv = require('ajv')
var lamos = require('lamos')
var schema = require('./schema')

exports.parse = function (text) {
  return lamos.parse(text)
}

exports.validate = function (tree) {
  var valid = ajv.validate(schema, tree)
  if (!valid) return tree.errors
  if (!allGoToTargetsValid(tree)) return false
  if (!allQuestionsReferenced(tree)) return false
  return true
}

function allGoToTargetsValid (tree) {
  var ids = Object.keys(tree)
  for (var questionIndex = 0; questionIndex < tree.length; questionIndex++) {
    var question = tree[questionIndex]
    for (var answerIndex = 0; answerIndex < question.answers.length; answerIndex++) {
      var answer = question.answers[answerIndex]
      if (answer.hasOwnProperty('goto')) {
        var goto = answer.goto
        if (ids.indexOf(goto) === -1) {
          return false // invalid goto
        }
      }
    }
  }
  return true
}

function allQuestionsReferenced (tree) {
  return Object.keys(tree).every(function (id) {
    return tree.some(function (question) {
      return question.answers.some(function (answer) {
        return answer.goto === id
      })
    })
  })
}
