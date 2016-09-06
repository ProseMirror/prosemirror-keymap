const {keymap} = require("../src/keymap")
const keyCodes = require("w3c-keycode")
const ist = require("ist")

const fakeView = {state: {}, props: {onAction: () => {}}}

function dispatch(map, key, mods) {
  let event = {}
  if (/^'.'$/.test(key)) {
    event.charCode = key.charCodeAt(1)
    map.props.handleKeyPress(fakeView, event)
  } else {
    if (mods) for (let prop in mods) event[prop] = mods[prop]
    for (let code in keyCodes) if (keyCodes[code] == key) event.keyCode = code
    if (!event.keyCode) throw new Error("Unknown key " + key)
    map.props.handleKeyDown(fakeView, event)
  }
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
    dispatch(map, "Space", {ctrlKey: true})
    dispatch(map, "Space", {ctrlKey: true, shiftKey: true})
    ist(s.count, 0)
    ist(c_s.count, 1)
    ist(s_c_s.count, 1)
    ist(a_s.count, 0)
  })

  it("normalizes key names", () => {
    let x = counter(), one = counter()
    dispatch(keymap({X: x}), "KeyX")
    ist(x.count, 1)
    dispatch(keymap({"1": one}), "Numpad1")
    ist(one.count, 1)
  })

  it("handles key press events", () => {
    let a = counter(), b = counter()
    dispatch(keymap({"'a'": a, "'b'": b}), "'a'")
    ist(a.count, 1)
    ist(b.count, 0)
  })

  it("passes the state, onAction, and view", () => {
    dispatch(keymap({X: (state, onAction, view) => {
      ist(state, fakeView.state)
      ist(onAction, fakeView.props.onAction)
      ist(view, fakeView)
    }}), "KeyX")
  })
})
