## 1.0.2 (2019-10-16)

### Bug fixes

Upgrade w3c-keyname package dependency.

## 1.0.1 (2018-02-23)

### Bug fixes

Upgrade `w3c-keyname` dependency to version 1.1.8 to prevent users getting stuck with a buggy version.

## 0.22.1 (2017-07-14)

### Bug fixes

Bindings like Alt-3 should now fire even if your keyboard produces a special character for that combination.

## 0.18.0 (2017-02-24)

### New features

Add a [`keydownHandler`](http://prosemirror.net/docs/ref/version/0.18.0.html#keymap.keydownHandler) function, which takes a keymap and produces a [`handleKeydown` prop](http://prosemirror.net/docs/ref/version/0.18.0.html#view.EditorProps.handleKeydown)-style function.

## 0.12.0 (2016-10-21)

### Breaking changes

Key names are now based on
[`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
instead of
[`.code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code).
This means that, for character-producing keys, you'll want to use the
character typed, not the key name. So `Ctrl-Z` now means uppercase Z,
and you'll usually want `Ctrl-z` instead. Single-quoted key names are
no longer supported.

## 0.11.0 (2016-09-21)

### Breaking changes

New module, takes the same role as the old built-in keymap support in
the `ProseMirror` class.

