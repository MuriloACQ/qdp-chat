# qdp-chat

client example

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.2/socket.io.js"></script>
<script>
//console.log(io);
  var socket = io('http://localhost:7890');
  var id = Date.now();
  var count = 0;
  socket.on('connect', function () {
    socket.emit('identification', id);
    setTimeout(function() {socket.send('uhuuuul')},1000);
  });
socket.on('message', function (data) {
    console.log(data);
    count++;
    setTimeout(function() {socket.send('hi baby i am ' + id + ' - ' + count)},2000);
  });
</script>
```
