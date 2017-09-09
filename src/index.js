import { toElement } from 'dom-elementals';
import cssProxy from 'css-proxy';
import arrayFrom from 'array-from';
import { mixin } from 'dom-properties-mixin';

class Ebla {
    constructor(value, ...values){
        this.element = toElement(value, ...values);
    }

    contains(v){
        return this.element.contains(v);
    }
    append(v){
        this.element.appendChild(element(v).element);
        return this;
    }
    appendTo(v){
        element(v).append(this.element);
        return this;
    }
    prepend(v){
        this.element.insertBefore(
            element(v).element,
            this.first
        );
        return this;
    }
    html(s){
        if(!defined(s)) return this.element.innerHTML;
        this.element.innerHTML = '';
        this.append(s);
        return this;
    }
    text(s){
        if(!defined(s)) return this.element.textContent;
        this.element.textContent = s;
        return this;
    }
    attr(name, value){
        if(defined(value)){
            this.element.setAttribute(name, value);
        }
        return this.element.getAttribute(name);
    }
    prop(name, value){
        if(defined(value)){
            this.element[name] = value;
        }
        return this.element[name];
    }
    clone(deep){
        return element(this.element.cloneNode(deep));
    }
}

export function E(value, ...values){
    return new Ebla(values, ...values);
}

export function select(s){
    try{
        return arrayFrom(
            document.querySelectorAll(s)
        );
    }catch(e){
        throw e;
    }
}

export function spawn(v, count = 1){
    const items = [];
    v = toElement(v);
    for(let i=0; i<count; i++){
        items.push(element(v.cloneNode(true)));
    }
    return items;
}
