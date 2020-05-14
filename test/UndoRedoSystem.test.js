// const assert = require('assert')
sinon = require('sinon')
const UndoRedoManager = require('../src/undoredo/UndoRedoManager')

describe('UndoRedoManager', () => {
  let undoRedoManager

  before(() => {
    undoRedoManager = new UndoRedoManager()
    console.log(undoRedoManager)
  })

  describe('getCurrentChange()', () => {
    it('should return nothing', () => {
      undoRedoManager.getCurrentChange()
      // assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})
