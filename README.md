# my-messenger

`my-messenger` is an enhanced tool for iframe communication, which is light, simple and reliable to use

## Installing

```js
npm i my-messenger -S
```

## usage

parent.html

```js
import Messenger from 'my-messenger';

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

### new Parent(el: Element)

el: Element of Child iframe

### Parent.connect()

connect to Child

### Parent.send(event: string, data: any)

send msg to Child

### Parent.on(event: string, callback: Function)

listen to event from Child

### Parent.close()

clear and close

---

### Child.connect()

connect to Parent

### Child.send(event: string, data: any)

send msg to Parent

### Child.on(event: string, callback: Function)

listen to event from Parent

### Child.close()

clear and close