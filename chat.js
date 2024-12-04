// Firebase Initialization and Auth Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyApmhWMDGkJ96a5jOVvB-fYqietESz4BW0",
    authDomain: "hamid-cd6fc.firebaseapp.com",
    databaseURL: "https://hamid-cd6fc-default-rtdb.firebaseio.com",
    projectId: "hamid-cd6fc",
    storageBucket: "hamid-cd6fc.appspot.com",
    messagingSenderId: "503068161640",
    appId: "1:503068161640:web:2d11bcdceecf3057212ddd"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const messagesRef = ref(db, 'messages/');

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

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
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}


function sendMessage(replyTo = null) {
    const message = messageInput.value.trim();
    if (message !== "") {
        const newMessageKey = Date.now();
        set(ref(db, 'messages/' + newMessageKey), {
            user: userName,
            text: message,
            timestamp: newMessageKey,
            replyTo: replyTo,
        });
        messageInput.value = "";
    }
}

onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();
    messagesDiv.innerHTML = '';
    for (let key in messages) {
        const message = messages[key];

    
        const newMessage = document.createElement('div');
        newMessage.classList.add(message.user === userName ? 'user-message' : 'system-message');
        newMessage.style.borderLeftColor = stringToColor(message.user);
        newMessage.innerHTML = `
            <div>${message.user}: ${message.text}</div>
            ${message.replyTo ? `<div class="reply">ریپلای: ${messages[message.replyTo]?.text || "پیام حذف شده"}</div>` : ""}
            <button class="btn-reply" data-id="${key}">ریپلای</button>
        `;
        messagesDiv.appendChild(newMessage);
    }


    messagesDiv.scrollTop = messagesDiv.scrollHeight;


    document.querySelectorAll('.btn-reply').forEach(button => {
        button.addEventListener('click', (e) => {
            const messageId = e.target.dataset.id;
            sendMessage(messageId);
        });
    });
});

sendButton.addEventListener('click', () => sendMessage());

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
