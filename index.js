const keyCodes = require("w3c-keycode")

const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false

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

// :: (Object) → Object
// Create a keymap plugin for the given set of bindings, which should
// map key names to [command](#command) functions.
//
// Key names may be strings like `"Ctrl-Shift-Enter"`, a key
// identifier prefixed with zero or more modifiers. Key identifiers
// are based on the strings that can appear in
// [`KeyEvent.code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code).
//
// For convenience, this module adds a few shorthands, like being able
// to say `A` instead of `KeyA` for the A key, and `1` instead of
// `Digit1`. It also allows `Shift` to cover both `LeftShift` and
// `RightShift`, and similarly for other keys that have both a left and
// right variant.
//
// Modifiers can be given in any order. `Shift-` (or `s-`), `Alt-` (or
// `a-`), `Ctrl-` (or `c-` or `Control-`) and `Cmd-` (or `m-` or
// `Meta-`) are recognized. You can say `Mod-` as a shorthand for
// `Cmd-` on Mac and `Ctrl-` on other platforms.
//
// Binding a typed character (i.e. a `keypress` instead of a `keydown`
// event) is done by wrapping the character in single quotes, as in
// `"'x'"`. No modifiers are allowed for typed characters (since
// `keypress` events don't expose modifier info).
//
// You can add multiple keymap plugins to an editor. The order in
// which they appear determines their precedence (the ones early in
// the array get to dispatch first).
function keymap(bindings) {
  let map = normalize(bindings)

  return {
    handleKeyDown(view, event) {
      for (let name = event.code || keyCodes[event.keyCode]; name; name = reduce[name]) {
        let bound = map[modifiers(name, event)]
        if (bound && bound(view.state, view.props.onAction, view)) return true
      }
      return false
    },

    handleKeyPress(view, event) {
      let bound = map["'" + String.fromCharCode(event.charCode) + "'"]
      return bound ? bound(view.state, view.props.onAction) : false
    }
  }
}
exports.keymap = keymap
