import { toElement, toHTML, isElement } from 'dom-elementals';
import arrayFrom from 'array-from';
import objectAssign from 'object-assign';
import { mixin } from 'dom-properties-mixin';
import { requestAnimationFrame } from 'animation-frame-polyfill';

class Ebla {
    constructor(value, ...values){
        mixin(this);
        this.element = toElement(value, ...values);
        Ebla.plugins.forEach(plugin=>plugin.init.call(this));
    }
    contains(v){
        return this.element.contains(v);
    }
    append(v){
        this.element.appendChild(toElement(v));
        return this;
    }
    appendTo(v){
        v.appendChild(this.element);
        return this;
    }
    prepend(v){
        this.element.insertBefore(
            toElement(v),
            this.first
        );
        return this;
    }
    before(v){
        if(this.element.parentNode){
            this.element.parentNode.insertBefore(
                toElement(v),
                this.element
            );
        }
        return this;
    }
    after(v){
        if(this.element.parentNode){
            this.element.parentNode.insertBefore(
                toElement(v),
                this.element.nextSibling
            );
        }
        return this;
    }
    html(s){
        if(s === void 0) return this.element.innerHTML;
        this.element.innerHTML = toHTML(s);
        return this;
    }
    text(s){
        if(s === void 0) return this.element.textContent;
        this.element.textContent = s;
        return this;
    }
    attr(name, value){
        if(value === void 0){
            this.element.setAttribute(name, value);
        }
        return this.element.getAttribute(name);
    }
    prop(name, value){
        if(value === void 0){
            this.element[name] = value;
        }
        return this.element[name];
    }
    clone(deep){
        return new Ebla(this.element.cloneNode(deep));
    }
    animate(...args){
        return this.element.animate(...args);
    }
    generate(){
        return generate(()=>this.element.cloneNode(true));
    }
}

export function E(value, ...values){
    if(this instanceof Ebla){
        Ebla.call(this, value, ...values);
    }else if(value instanceof Ebla){
        return value;
    }

    return new Ebla(value, ...values);
}

E.prototype = Object.create(Ebla.prototype);

Ebla.plugins = [];
objectAssign(E, {
    fragment(){
        return document.createDocumentFragment();
    },
    plugin(create){
        let control = create(Ebla.prototype);
        if(typeof control === 'function'){
            if(typeof control['init'] !== 'function'){
                return;
            }
            Elba.plugins.push(control);
        }
    }
});

export function select(s){
    try{
        return arrayFrom(
            document.querySelectorAll(s)
        ).map(e=>E(e));
    }catch(e){
        throw e;
    }
}

export function spawn(v, count = 1){
    if(typeof callback !== 'function'){
        const items = [];
        const e = E(v);
        for(let i=0; i<count; i++){
            items.push(e.clone());
        }
        return items;
    }
}

class ElementGenerator {
    constructor(create, parent = null){
        this._create = create;
        this._parent = parent;
    }
    create(...args){
        let create = this._create;
        return ElementGenerator.getElementAsync(
            create(...args),
            this._parent
        );
    }
    static getElementAsync(v, parent = null){
        return new Promise((resolve, reject)=>{
            requestAnimationFrame(()=>{
                try{
                    if(parent && isElement(parent)){
                        return resolve(E(v).appendTo(parent));
                    }
                    resolve(E(v));
                }catch(e){ reject(e); }
            });
        });
    }
    [Symbol.iterator](){
        return {
            next(...args){
                return this.create(...args);
            },
            done(){
                return false;
            }
        };
    }
}

export function generate(create, parent){
    let value;
    if(typeof create !== 'function'){
        value = create;
        create = ()=>value;
    }
    return new ElementGenerator(create, parent);
}
