import { supabase } from "./supabase.js";
const messagesElement = document.querySelector('#messages')


// // Define a function to use DOMPurify once it's loaded
// function useDOMPurify() {
//     // Ensure DOMPurify is available before using it
//     if (typeof DOMPurify !== 'undefined') {
//         // HTML content to be sanitized
//         const untrustedHTML = '<script>alert("XSS Attack!");</script> This is unsafe content.';
        
//         // Sanitize the HTML content using DOMPurify
//         const sanitizedHTML = DOMPurify.sanitize(untrustedHTML);
        
//         // Display the sanitized content
//         //const sanitizedElement = document.getElementById('sanitized-content');
//         //sanitizedElement.innerHTML = sanitizedHTML;
//     } else {
//         console.error('DOMPurify is not available yet.');
//     }
// }

// // Check if DOMPurify is already loaded or listen for the script load event
// if (typeof DOMPurify === 'undefined') {
//     // Define a callback function to execute when DOMPurify is loaded
//     function loadDOMPurify() {
//         useDOMPurify();
//     }

//     // Create a new script element to load DOMPurify from a CDN
//     const script = document.createElement('script');
//     script.src = 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.3.3/purify.min.js';

//     // Set the onload event to the callback function
//     script.onload = loadDOMPurify;

//     // Append the script element to the document's body
//     document.body.appendChild(script);
// } else {
//     // DOMPurify is already loaded, so use it immediately
//     useDOMPurify();
// }

// Create a function to handle inserts
const handleInserts = (payload) => {
    console.log('Change received!', payload)
  }

function sanitizeText(text) {
    return DOMPurify.sanitize(text, {ALLOWED_TAGS: []});
}

function addMessageToPage(message) {
    const element = document.createElement('ul');
    element.innerHTML = `
        <h1>${sanitizeText(message.content)}</h1>
        <font size=1>${message.created_at} /${sanitizeText(message.username)}</font>`
    messagesElement.append(element);

    setTimeout(() => {}, "1000");
    element.scrollIntoView({behavior: "auto"});

    // Scroll to the latest message by targeting the `messagesElement` container
    // messagesElement.scrollBottom = messagesElement.scrollHeight;
}

// Form query selection
const form = document.querySelector('form')
const contentElement = document.querySelector('#content');

async function init() {
    // Form data
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const message = {
            username: formData.get('username'),
            content: formData.get('content'),
        };
        if (message.username == '') {
            message.username = 'Anonymous'
        }

    // Sending message logic
    supabase
        .from('messages')
        .insert([
            message,
        ]).then(() => { 
            console.log('Message sent!'); 
        });
    }); 
    // Retrieving message logic  
    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
    
    // Display message logic
    console.log(messages);
    messages.forEach(addMessageToPage);
    
    // Update logic
    supabase
    .channel('schema-db-changes')
    .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'messages' }, 
    (payload) => {
      console.log('Change received!');
      console.log(payload);
      addMessageToPage(payload.new);
    })
    .subscribe();
}

init();