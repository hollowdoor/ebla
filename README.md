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

`value` as a parameter stands for whatever `E(value)` accepts as a value.

`...values` as a parameter stands for an list of values that are each accepted by `E(value)`.


The Constructor
--------------

Use `E(value)` to capture, or manpulate the DOM using an `Ebla` instance.

See [dom-elementals](https://github.com/hollowdoor/dom_elementals) to find what values the `E()` constructor takes. `E(value, ...values)` takes the same input as `toElement` from `dom-elementals`.

Static Properties/Methods
------------

### E.fragment()

`E.fragment` is equivalent to `document.createDocumentFragment()`.

### E.plugin(create)

Add to the prototype of `Ebla`.

```javascript
E.plugin(proto=>{
    proto.log = function(){
        console.log(this.element);
    };
    //Optionally return an object.
    //init will be run on instantiation.
    return {
        init(){
            console.log(`'E()' is being constructed`);
        }
    }
});

E('#selected').log();
```

Properties
---------

### el.element

`el.element` is the value passed to `E(value)`, or the literal tag version of `E()`.

### Properties not documented here

See [dom-properties-mixin](https://github.com/hollowdoor/dom_properties_mixin) to see what properties are on an instance of `E(value)`.


E() DOM Manpulation Instance Methods
-----------------------

The `value` parameter on these methods can be the same as `E(value)`.

### el.appendTo(parent)

Append `el.element` to a `parent` element.

### el.append(...value)

Append child `values` to `el.element`.

### el.prepend(...values)

Prepend child `values` to `el.element`.

### el.before(...values)

Insert values before `el.element`.

### el.after(...values)

Insert values after `el.element`.

### el.html(something|undefined)

Set, or get the innerHTML of `el.element`.

`el.html()` returns `this` when set.

### el.text(something|undefined)

Set, or get the `textContent` of `el.element`.

`el.text()` returns `this` when set.

### el.attr(name|object, attribute value|undefined)

Set attributes like `element.setAttribute(name, attribute value)`.

If the first parameter is an object then the keys, and values will be set as attributes on `el.element`.

If the last parameter is undefined, and the first parameter is a string then the attribute value with that name will be returned.

### el.prop(name|object, property value|undefined)

`el.prop()` works similar to `el.attr()` except what you pass to `el.prop()` is set directly on `el.element`.

### el.css(source)

Set all CSS properties defined on `source`.

```javascript
E('.some-class').css({
    //Change the text color to red
    color: 'red'
});
```

### el.clone(deep)

`el.clone(deep)` is the same as `element.cloneNode(deep)`. Expect a copy of `el.element` to returned wrapped in a new instance of `E()`.

### el.contains(element)

`el.contains()` returns true if `element` is a child of `el.element`.

### el.animate(keyFrames, options)

Use `el.element.animate()`. You might need to add a polyfill of web animations. On isn't included with this library.

### el.generate()

Generate a copy (clone) of `el.element`. `el.generate()` takes no parameters. See the documentation for `generate`.

generate()
-------

Asynchronously create DOM elements using `generate`.

```javascript
import { generate } from 'ebla';
let paragraph = generate(contents=>`<p>${contents}</p>`);
paragraph.create(`Asynchronous processes do help.`).then(p=>{
    p.appendTo(document.body);
});
```

### generate(callback, parent|undefined)

Create a `ElementGenerator` instance.

Returned values from `callback` can be anything `E(value)` accepts as a value. `parent` can be undefined, or pass another element as `parent`. The element produced from the value returned form `callback` will be appended to `parent`.

The resolved value from the `ElementGenerator.prototype.create` is a DOM element wrapped in an instance of `E()`.

select()
------

Select an element from the DOM. `select(selector)` returns an array of instances of `E()` that are wrapped around each selected DOM element.

spawn()
-----

Synchronously reate a certain amount of elements using `spawn(value, num)`.

```javascript
import { spawn } from 'ebla';
let list = spawn('<li></li>', 3);
console.log(list.length); //prints 3
```
