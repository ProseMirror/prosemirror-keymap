const {keymap} = require("../dist/keymap")
const ist = require("ist")

const fakeView = {state: {}, dispatch: () => {}}

function dispatch(map, key, mods) {
  let event = {}
  if (mods) for (let prop in mods) event[prop] = mods[prop]
  event.key = key
  map.props.handleKeyDown(fakeView, event)
}

function counter() {
  function result() { result.count++ }
  result.count = 0
  return result
}

describe("keymap", () => {
  it("calls the correct handler", () => {
    let a = counter(), b = counter()
    dispatch(keymap({KeyA: a, KeyB: b}), "KeyA")
    ist(a.count, 1)
    ist(b.count, 0)
  })

  it("distinguishes between modifiers", () => {
    let s = counter(), c_s = counter(), s_c_s = counter(), a_s = counter()
    let map = keymap({"Space": s, "Control-Space": c_s, "s-c-Space": s_c_s, "alt-Space": a_s})
    dispatch(map, " ", {ctrlKey: true})
    dispatch(map, " ", {ctrlKey: true, shiftKey: true})
    ist(s.count, 0)
    ist(c_s.count, 1)
    ist(s_c_s.count, 1)
    ist(a_s.count, 0)
  })

  it("passes the state, dispatch, and view", () => {
    dispatch(keymap({X: (state, dispatch, view) => {
      ist(state, fakeView.state)
      ist(dispatch, fakeView.dispatch)
      ist(view, fakeView)
    }}), "X")
  })
})
