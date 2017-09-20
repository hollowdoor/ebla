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
E('#divvy').on('click mousemove', event=>{
    console.log(event.type);
});

let paras1 = generate((contents)=>`<p>${contents}</p>`);
paras1.create('one!').then(p=>p.appendTo(document.body));
let paras2 = generate(
    (contents)=>`<p>${contents}</p>`, document.body
);
paras2.create('two!').then(p=>paras2.create('three!'));
