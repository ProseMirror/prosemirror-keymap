const keyCodes = require("w3c-keycode")
const {mac} = require("../util/browser")

const reduce = {
  MetaLeft: "Meta",
  MetaRight: "Meta",
  NumpadMultiply: "Multiply",
  NumpadAdd: "Add",
  NumpadComma: "Comma",
  NumpadSubtract: "Minus",
  NumpadDecimal: "Period",
  NumpadDivide: "Divide",
  ShiftLeft: "Shift",
  ShiftRight: "Shift",
  ControlLeft: "Control",
  ControlRight: "Control",
  AltLeft: "Alt",
  AltRight: "Alt"
}
for (let i = 0; i < 10; i++) {
  reduce["Numpad" + i] = "Digit" + i
  reduce["Digit" + i] = String(i)
}
for (var i = 65; i <= 90; i++)
  reduce["Key" + String.fromCharCode(i)] = String.fromCharCode(i)

function normalizeKeyName(name) {
  let parts = name.split(/-(?!'?$)/), result = parts[parts.length - 1]
  let alt, ctrl, shift, meta
  for (let i = 0; i < parts.length - 1; i++) {
    let mod = parts[i]
    if (/^(cmd|meta|m)$/i.test(mod)) meta = true
    else if (/^a(lt)?$/i.test(mod)) alt = true
    else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true
    else if (/^s(hift)?$/i.test(mod)) shift = true
    else if (/^mod$/i.test(mod)) { if (mac) meta = true; else ctrl = true }
    else throw new Error("Unrecognized modifier name: " + mod)
  }
  if (alt) result = "Alt-" + result
  if (ctrl) result = "Ctrl-" + result
  if (meta) result = "Meta-" + result
  if (shift) result = "Shift-" + result
  return result
}

function normalize(map) {
  let copy = Object.create(null)
  for (let prop in map) copy[normalizeKeyName(prop)] = map[prop]
  return copy
}

function modifiers(name, event) {
  if (event.altKey) name = "Alt-" + name
  if (event.ctrlKey) name = "Ctrl-" + name
  if (event.metaKey) name = "Meta-" + name
  if (event.shiftKey) name = "Shift-" + name
  return name
}

function keymap(bindings) {
  let map = normalize(bindings)

  return {
    onKeyDown(view, event) {
      for (let name = event.code || keyCodes[event.keyCode]; name; name = reduce[name]) {
        let bound = map[modifiers(name, event)]
        if (bound && bound(view.state, view.props.onAction)) return true
      }
      return false
    },

    onKeyPress(view, event) {
      let bound = map["'" + String.fromCharCode(event.charCode) + "'"]
      return bound ? bound(view.state, view.props.onAction) : false
    }
  }
}
exports.keymap = keymap
