import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// پیکربندی Firebase
const firebaseConfig = {
    apiKey: "AIzaSyApmhWMDGkJ96a5jOVvB-fYqietESz4BW0",
    authDomain: "hamid-cd6fc.firebaseapp.com",
    databaseURL: "https://hamid-cd6fc-default-rtdb.firebaseio.com",
    projectId: "hamid-cd6fc",
    storageBucket: "hamid-cd6fc.app",
    messagingSenderId: "503068161640",
    appId: "1:503068161640:web:2d11bcdceecf3057212ddd"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'messages/');

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const replyPreview = document.getElementById('replyPreview');
const userNameDisplay = document.getElementById('userNameDisplay');
const userColorDisplay = document.getElementById('userColorDisplay');

let userName = localStorage.getItem('userName');
if (!userName) {
    userName = prompt('لطفا نام خود را وارد کنید');
    localStorage.setItem('userName', userName);
}
userNameDisplay.textContent = userName;

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        color += ('00' + ((hash >> (i * 8)) & 0xFF).toString(16)).slice(-2);
    }
    return color;
}

const userColor = stringToColor(userName);
userColorDisplay.style.backgroundColor = userColor;

document.getElementById('userNameDisplay').innerHTML = `نام کاربری شما: ${userName}`;

onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();
    messagesDiv.innerHTML = '';
    if (!messages) {
        console.log('هیچ پیامی پیدا نشد');
        return;
    }

    for (let key in messages) {
        const message = messages[key];
        const messageElement = document.createElement('div');
        
        const messageColor = stringToColor(message.user);
        
        messageElement.classList.add(message.user === userName ? 'user-message' : 'system-message');
        messageElement.style.borderLeftColor = messageColor; 
        messageElement.style.color = messageColor; 
        
        let replyHTML = '';
        if (message.replyTo && messages[message.replyTo]) {
            const repliedMessage = messages[message.replyTo];
            replyHTML = `
                <div class="reply">
                    <strong>${repliedMessage.user}:</strong> ${repliedMessage.text}
                </div>
            `;
        }

        messageElement.innerHTML = `
            ${replyHTML}
            <div><strong>${message.user}:</strong> ${message.text}</div>
            <button class="btn-reply" data-id="${key}"> <i class="bi bi-reply-fill"></i>ریپلای</button>
        `;

        messagesDiv.appendChild(messageElement);
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

messagesDiv.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-reply')) {
        const messageId = event.target.dataset.id;
        const messageText = event.target.previousElementSibling.innerText;

        replyPreview.style.display = 'block';
        replyPreview.innerHTML = `
            پاسخ به: <strong>${messageText}</strong>
            <button id="cancelReply"><i class="bi bi-x-circle"></i></button>
        `;
        messageInput.dataset.replyTo = messageId;

        messageInput.focus();
    }
});

replyPreview.addEventListener('click', (event) => {
    if (event.target.id === 'cancelReply' || event.target.classList.contains('bi-x-circle')) {
        replyPreview.style.display = 'none';
        delete messageInput.dataset.replyTo;
    }
});

function sendMessage() {
    const text = messageInput.value.trim();
    const replyTo = messageInput.dataset.replyTo || null;

    if (text) {
        const newMessageKey = Date.now();
        set(ref(db, 'messages/' + newMessageKey), {
            user: userName,
            text,
            replyTo
        }).then(() => {
            console.log('پیام ارسال شد:', text);
        }).catch((error) => {
            console.error('خطا در ارسال پیام:', error);
        });

        messageInput.value = '';
        delete messageInput.dataset.replyTo;
        replyPreview.style.display = 'none';
    }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
