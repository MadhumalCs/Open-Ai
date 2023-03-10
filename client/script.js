import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;
// let typeInterval;

// *** Implementing the loading function for bot
function loader(element) {
  // to stay empty the loader at the start (when the thinking start it should be empty dots)
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';

    // if the laoding indicator has reached three dots then reset it
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);

}

// *** Implement typing function for bot
function typeText(element, text) {
  let index = 0;
  let typeInterval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index); //this is going to get character under specific index
      index++;
    } else {
      clearInterval(typeInterval);
    }
  }, 20);
}

// *** Implement function to return unique Id
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

// *** Change color for the chatStripe
function chatStripe(isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
     <div class="chat">
      <div class="profile">
       <img
       src="${isAi ? bot : user}"
       alt="${isAi ? 'bot' : 'user'}"
       />
      </div>
      <div class="message" id="${uniqueId}">${value}</div>
     </div>
    </div>
    `
  )
}

// *** Function which is going to be the trigger for the Ai generated respond
const handleSubmit = async (e) => {
  e.preventDefault(); //this is going to prevent the default behaviour of the browser, which is to reload when a form is submited.

  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  // fetch data from server -> bot's response
  const response = await fetch('https://codex-bota.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();  // this is giving us the actual data comming from the back end
    const parseData = data.bot.trim();

    // console.log({ parseData }); 
    typeText(messageDiv, parseData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong.";
    alert(err);
  }

}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});

