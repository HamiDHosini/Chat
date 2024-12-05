// Firebase Initialization and Auth Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyApmhWMDGkJ96a5jOVvB-fYqietESz4BW0",
    authDomain: "hamid-cd6fc.firebaseapp.com",
    databaseURL: "https://hamid-cd6fc-default-rtdb.firebaseio.com",
    projectId: "hamid-cd6fc",
    storageBucket: "hamid-cd6fc.firebasestorage.app",
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

let userName = localStorage.getItem('userName');
if (!userName) {
    userName = prompt('لطفا نام خود را وارد کنید');
    localStorage.setItem('userName', userName);
}

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

onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();
    messagesDiv.innerHTML = '';

    for (let key in messages) {
        const message = messages[key];
        const messageElement = document.createElement('div');
        messageElement.classList.add(message.user === userName ? 'user-message' : 'system-message');
        messageElement.style.borderLeftColor = stringToColor(message.user);

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
            <button class="btn-reply btn btn-sm btn-outline-light mt-2" data-id="${key}">ریپلای</button>
        `;

        messagesDiv.appendChild(messageElement);
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    document.querySelectorAll('.btn-reply').forEach(button => {
        button.addEventListener('click', (e) => {
            const messageId = e.target.dataset.id;
            messageInput.dataset.replyTo = messageId;
            const repliedMessage = messages[messageId];
            replyPreview.innerHTML = `
                در حال پاسخ دادن به: <strong>${repliedMessage.user}</strong> - "${repliedMessage.text}"
                <button id="cancelReply" class="btn btn-sm btn-danger ms-2">لغو</button>
            `;
            replyPreview.style.display = 'block';
            messageInput.focus();
        });
    });
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
        });
        messageInput.value = '';
        delete messageInput.dataset.replyTo;
        replyPreview.style.display = 'none';
    }
}

document.addEventListener('click', (e) => {
    if (e.target.id === 'cancelReply') {
        replyPreview.style.display = 'none';
        delete messageInput.dataset.replyTo;
    }
});

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
