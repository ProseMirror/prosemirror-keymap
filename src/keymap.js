const keyName = require("w3c-keyname")
const {Plugin} = require("prosemirror-state")

// declare global: navigator

const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false

function normalizeKeyName(name) {
  let parts = name.split(/-(?!$)/), result = parts[parts.length - 1]
  if (result == "Space") result = " "
  let isChar = result.length == 1 && result != " "
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
  if (shift && !isChar) result = "Shift-" + result
  return result
}

function normalize(map) {
  let copy = Object.create(null)
  for (let prop in map) copy[normalizeKeyName(prop)] = map[prop]
  return copy
}

function modifiers(name, event) {
  let isChar = name.length == 1 && name != " "
  if (event.altKey) name = "Alt-" + name
  if (event.ctrlKey) name = "Ctrl-" + name
  if (event.metaKey) name = "Meta-" + name
  if (!isChar && event.shiftKey) name = "Shift-" + name
  return name
}

// :: (Object) → Plugin
// Create a keymap plugin for the given set of bindings.
//
// Bindings should map key names to [command](#commands)-style
// functions, which will be called with `(EditorState, onAction,
// EditorView)` arguments, and should return true when they've handled
// the key. Note that the view argument isn't part of the command
// protocol, but can be used as an escape hatch if a binding needs to
// directly interact with the UI.
//
// Key names may be strings like `"Shift-Ctrl-Enter"`, a key
// identifier prefixed with zero or more modifiers. Key identifiers
// are based on the strings that can appear in
// [`KeyEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key).
// You may use `"Space"` as an alias for the `" "` name.
//
// Modifiers can be given in any order. `Shift-` (or `s-`), `Alt-` (or
// `a-`), `Ctrl-` (or `c-` or `Control-`) and `Cmd-` (or `m-` or
// `Meta-`) are recognized. For single-character key names other than
// space, the `Shift-` modifier is ignored, since the effect of shift
// is already captured in the character.
//
// You can use `Mod-` as a shorthand for `Cmd-` on Mac and `Ctrl-` on
// other platforms.
//
// You can add multiple keymap plugins to an editor. The order in
// which they appear determines their precedence (the ones early in
// the array get to dispatch first).
function keymap(bindings) {
  let map = normalize(bindings)

  return new Plugin({
    props: {
      handleKeyDown(view, event) {
        let bound = map[modifiers(keyName(event), event)]
        return !!(bound && bound(view.state, view.props.onAction, view))
      }
    }
  })
}
exports.keymap = keymap
