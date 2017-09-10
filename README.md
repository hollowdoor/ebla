ebla
====

Install
------

`npm install ebla`

Imports
-----

```javascript
import { E, generate, spawn } from 'ebla';
E('<p>Hello world!</p>').appendTo(document.body);
```

Terminology
---------

`el` stands for the instance created from `E()` like `let el = E();`.


The Constructor
--------------

Use `E(value)` to capture, or manpulate the DOM using an `Ebla` instance.

See [dom-elementals](https://github.com/hollowdoor/dom_elementals) to find what values the `E()` constructor takes. `E(value, ...values)` takes the same input as `toElement` from `dom-elementals`.

Properties
---------


### el.element

`el.element` is the value passed to `E(value)`, or the literal tag version of `E()`.

### Properties not documented here

See [dom-properties-mixin](https://github.com/hollowdoor/dom_properties_mixin) to see what properties are on an instance of `E(value)`.

Static Methods
------------



DOM Manpulation Instance Methods
-------------

The `value` parameter on these methods can be the same as `E(value)`.

### el.appendTo(parent)

Append `el.element` to a `parent` element.

### el.append(value)

Append a child `value` to `el.element`.

### el.prepend(value)

Prepend a child `value` to `el.element`.

### el.before(value)

Insert value before `el.element`.

### el.after(value)

Insert value after `el.element`.

### el.html(something|undefined)

Set, or get the innerHTML of `el.element`.

`el.html()` returns `this` when set.

### el.text(something|undefined)

Set, or get the `textContent` of `el.element`.

`el.text()` returns `this` when set.
