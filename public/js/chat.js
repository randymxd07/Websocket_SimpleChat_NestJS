// OBTENDO EL USERNAME DEL LOCALSTORAGE //
const username = localStorage.getItem('name');

// SI NO EXISTE EL USERNAME EN EL LOCALSTORAGE LO DEVUELVO A LA PANTALLA PRINCIPAL //
if(!username) {
    window.location.replace('/');
    throw new Error('Username is required');
}

// ? REFERENCIAS HTML //
const labelStatusOnline = document.querySelector('#status-online');
const labelStatusOffline = document.querySelector('#status-offline');
const usersUlElement = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('input');
const chatElement = document.querySelector('#chat');

// ? RENDERIZAR EL LISTADO DE LOS USUARIOS EN LOS ELEMENTOS LI //
const renderUsers = (users) => {
    usersUlElement.innerHTML = '';
    users.forEach(user => {
        const liElement = document.createElement('li');
        liElement.innerText = user.name;
        usersUlElement.appendChild(liElement);
    });
}

// ? RENDERIZAR LOS MENSAJES DE LOS USUARIOS EN EL CHAT //
const renderMessage = (payload) => {

    const { userId, message, name } = payload;

    const divElement = document.createElement('div');
    divElement.classList.add('message');

    if(userId == socket.id) {
        divElement.classList.add('mymessages');
    }

    divElement.innerHTML = `
        <small>${name}</small>
        <p>${message}</p>
    `;
    chatElement.appendChild(divElement);

    // Scroll all final de los mensajes //
    chatElement.scrollTop = chatElement.scrollHeight;

}

// PARA ENVIAR EL MENSAJE DEL CLIENTE AL CHAT, SE LIMPIA EL INPUT //
form.addEventListener('submit', (event) => {
   event.preventDefault();
   const message = input.value;
   input.value = '';
   socket.emit('send-message', message); 
});

// ? ESTE ES EL OBJETO SOCKET, PUEDO AGREGARLE COSAS AL OBJETO PARA QUE EL BACKEND LO OBTENGA //
const socket = io({
    auth: {
        token: 'ABC-123',
        name: username
    }
});

// ESTO ES PARA CUANDO EL USUARIO ESTE CONECTADO, CAMBIA EL ESTADO EN EL HTML //
socket.on('connect', () => {
    console.log('Conectado');
    labelStatusOnline.classList.remove('hidden')
    labelStatusOffline.classList.add('hidden')
});

// ESTO ES PARA CUANDO EL USUARIO ESTE DESCONECTADO, CAMBIA EL ESTADO EN EL HTML //
socket.on('disconnect', () => {
    console.log('Desconectado');
    labelStatusOnline.classList.add('hidden')
    labelStatusOffline.classList.remove('hidden')
});

// ESTE MENSAJE ES PARA CUANDO EL CLIENTE ENTRA AL CHAT POR PRIMERA VEZ //
socket.on('welcome-message', (data) => {
    console.log(data);
});

// CUANDO LOS CLIENTES CAMBIEN LLAMO LA FUNCION RENDERIZAR USUARIOS //
socket.on('on-clients-changed', renderUsers);

// PARA MOSTRAR LOS MENSAJES EN EL CHAT //
socket.on('on-message', renderMessage);