# my-messenger

`my-messenger` is an enhanced tool for iframe communication

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

const child = new Messenger.Child('http://127.0.0.1:5500');

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