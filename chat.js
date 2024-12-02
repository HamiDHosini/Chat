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

// Initialize Firebase
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

function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== "") {
        const newMessageKey = Date.now(); 
        set(ref(db, 'messages/' + newMessageKey), {
            user: userName,
            text: message,
            timestamp: newMessageKey
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
        newMessage.textContent = `${message.user}: ${message.text}`;
        messagesDiv.appendChild(newMessage);
    }
    messagesDiv.scrollTop = messagesDiv.scrollHeight; 
});


sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
