# my-messenger

`my-messenger` is an enhanced tool for iframe communication, which is light, simple and reliable to use

[![npm][npm-image]][npm-url]

[npm-image]: https://badge.fury.io/js/my-messenger.svg
[npm-url]: https://www.npmjs.com/package/my-messenger

## Installing

```js
npm i my-messenger -S
```

## usage

parent.html

```js
import Messenger from 'my-messenger';

// Messenger.Parent.debug = true; // open if you want debug info

const iframe = document.getElementById('iframe');
const parent = new Messenger.Parent(iframe);

parent.connect()
  .then(() => {
    console.log('>>> connected');
    parent.send('greet', 'hi');
  })
  .catch(e => {
    console.log('>>> connect failed', e);
  });
```

child.html
```js
import Messenger from 'my-messenger';

// Messenger.Child.debug = true; // open if you want debug info

const child = new Messenger.Child();

child.connect()
  .then(() => {
    console.log('>>> child.connected');
    child.on('greet', (data) => {
      console.log('>>> from parent', data);
    });
  })
  .catch(e => {
    console.log('>>> child.connect failed', e);
  });
```

## API

### new Parent(el: Element | Selector)

el: Element of Child iframe or a iframe Selector

### Parent.connect()

connect to Child

### Parent.send(event: string, data: any)

send msg to Child

### Parent.on(event: string, callback: Function)

listen to event from Child

### Parent.close()

clean and close

---

### Child.connect()

connect to Parent

### Child.send(event: string, data: any)

send msg to Parent

### Child.on(event: string, callback: Function)

listen to event from Parent

### Child.close()

clean and close