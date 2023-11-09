import { supabase } from "./supabase.js";

const messagesElement = document.querySelector('#messages')


// Create a function to handle inserts
const handleInserts = (payload) => {
    console.log('Change received!', payload)
  }

function sanitizeText(text) {
    return DOMPurify.sanitize(text, {'ALLOWED TAGS': []});
}

function addMessageToPage(message) {
    const element = document.createElement('li');
    element.classList.add('card','m-2')
    element.innerHTML = `
        <div class="col-sm-10">
        <p>${sanitizeText(message.content)}</p>
        <font size=1>${sanitizeText(message.username)}</font>
        </div>`
    messagesElement.append(element);
    setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
    }, 300);

}

const form = document.querySelector('form')
const contentElement = document.querySelector('#content');

async function init() {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const message = {
            username: formData.get('username'),
            content: formData.get('content'),
        };
    contentElement.value = '';
    supabase
        .from('messages')
        .insert([
            message,
        ]).then(() => { 
            console.log('Message sent!'); 
        });
    });

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
  
  

}

init();
