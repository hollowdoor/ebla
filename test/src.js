import { E, generate } from '../';
console.log(E('title').textContent);
console.log(E('title').html());
E('title').html("Hello Universe!");
console.log(E('#divvy').innerHTML);
E('#divvy').prepend('<i>ieee</i>');
let s = E('<p>Something</p>');
s.appendTo(document.body);
s.before('<p>Before something</p>');
s.after('<p>After something</p>');
let divvy = E('#divvy');
divvy.data.thing = 'bla thing data';
console.log(divvy.data.thing);
divvy.on('click mousemove', event=>{
    console.log(event.type);
    divvy.style.color = 'red';
});

let removed = E('<p>To be removed</p>');
removed.appendTo(document.body);
setTimeout(()=>removed.remove(), 2000);

let paras1 = generate((contents)=>`<p>${contents}</p>`);
paras1.create('one!').then(p=>p.appendTo(document.body));
let paras2 = generate(
    (contents)=>`<p>${contents}</p>`, document.body
);
paras2.create('two!').then(p=>paras2.create('three!'));
