import { supabase } from "./supabase.js";
const messagesElement = document.querySelector('#messages')


// Define a function to use DOMPurify once it's loaded
function useDOMPurify() {
    // Ensure DOMPurify is available before using it
    if (typeof DOMPurify !== 'undefined') {
        // HTML content to be sanitized
        const untrustedHTML = '<script>alert("XSS Attack!");</script> This is unsafe content.';
        
        // Sanitize the HTML content using DOMPurify
        const sanitizedHTML = DOMPurify.sanitize(untrustedHTML);
        
        // Display the sanitized content
        //const sanitizedElement = document.getElementById('sanitized-content');
        //sanitizedElement.innerHTML = sanitizedHTML;
    } else {
        console.error('DOMPurify is not available yet.');
    }
}

// Check if DOMPurify is already loaded or listen for the script load event
if (typeof DOMPurify === 'undefined') {
    // Define a callback function to execute when DOMPurify is loaded
    function loadDOMPurify() {
        useDOMPurify();
    }

    // Create a new script element to load DOMPurify from a CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.3.3/purify.min.js';

    // Set the onload event to the callback function
    script.onload = loadDOMPurify;

    // Append the script element to the document's body
    document.body.appendChild(script);
} else {
    // DOMPurify is already loaded, so use it immediately
    useDOMPurify();
}

// Create a function to handle inserts
const handleInserts = (payload) => {
    console.log('Change received!', payload)
  }

function sanitizeText(text) {
    return DOMPurify.sanitize(text, {'ALLOWED TAGS': []});
}

function addMessageToPage(message) {
    const element = document.createElement('ul');
    element.innerHTML = `
        ${sanitizeText(message.content)}
        <font size=1>${sanitizeText("/" + message.username)}</font>`
    messagesElement.append(element);
    //element.scrollIntoView({ behavior: "smooth", block: "end" });

    // Scroll to the latest message by targeting the `messagesElement` container
    messagesElement.scrollTop = messagesElement.scrollHeight;
}

const form = document.querySelector('form')
const contentElement = document.querySelector('#content');

async function init() {
    // Message Logic
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const message = {
            username: formData.get('username'),
            content: formData.get('content'),
        };
    // After recieving signup input register to users - should add check to see if exists
    supabase
        .from('messages')
        .insert([
            message,
        ]).then(() => { 
            console.log('Message sent!'); 
        });
    });
    
    /*
    // Signup Logic
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const user = {
            username: formData.get('username'),
            password: formData.get('password'),
        };
    // After recieving signup input register to users - should add check to see if exists
    supabase
        .from('users')
        .insert([
            user,
        ]).then(() => { 
            console.log('User Added!'); 
        });
    });


// index.js
function handleLogin() {
    // Add your login functionality here
    console.log('Login button clicked');
    // You can call Supabase authentication functions or any other login logic here
    
    //login logic
    form.addEventListener('log-in', (event) => {
        console.log("logging in!");
        event.preventDefault();
        const formData = new FormData(form);
        const user = {
            username: formData.get('username'),
            password: formData.get('password'),
        };
    // After recieving signup input register to users - should add check to see if exists
    console.log("trying to log in...")
    supabase
        .from('users')
        .select([
            user,
        ]).then(() => { 
            console.log('User Verified!'); 
        });
    });
    */
}

// Attach an event listener to the "Login" button
// document.getElementById('login-button').addEventListener('click', handleLogin);
    
    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
    
    console.log(messages);
    messages.forEach(addMessageToPage);

    supabase
    .channel('room1')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
      console.log('Change received!', payload);
      addMessageToPage(payload.new);
    })
    .subscribe();
  
  



init();
