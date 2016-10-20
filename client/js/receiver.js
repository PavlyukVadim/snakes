var input = document.getElementById('input');
var btnInput = document.getElementById('btn-input');
var messages = document.getElementById('messages');
var chat = document.getElementById('chat');

btnInput.onclick = sendMessage;

function sendMessage(event) {
  socket.send(JSON.stringify({
    name: userName,
    value: input.value
  }));
}

socket.onmessage = (event) => {
  let change = JSON.parse(event.data);
  if (change.name) {
    addNewMessage(change);
  }
  else if (change.x){
    drawAllSnakes(change);
  } 
  //console.log(change);
};

function addNewMessage(change) {
  var li = document.createElement('li');
  var pAutor = document.createElement('p');
  pAutor.classList.add('message-autor');
  pAutor.textContent = change.name; 

  var pText = document.createElement('p');
  pText.classList.add('message-text');
  pText.textContent = change.value; 

  li.appendChild(pAutor);
  li.appendChild(pText);

  messages.appendChild(li);
  chat.scrollTop = chat.scrollHeight;  
}