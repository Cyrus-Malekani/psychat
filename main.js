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
    element.innerHTML = `
        <div class="col-sm-10">
        <p>${sanitizeText(message.content)}</p>
        <font size=1>${sanitizeText(message.username)}</font>
        </div>`
    messagesElement.append(element);
    //element.scrollIntoView({ behavior: "smooth", block: "end" });

    // Scroll to the latest message by targeting the `messagesElement` container
    messagesElement.scrollTop = messagesElement.scrollHeight;
}

const form = document.querySelector('form')
const contentElement = document.querySelector('#content');

async function init() {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const user = {
            username: formData.get('username'),
            content: formData.get('password'),
        };
    contentElement.value = '';
    supabase
        .from('users')
        .insert([
            user,
        ]).then(() => { 
            console.log('User Added!'); 
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

form.addEventListener('sign-up', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const message = {
        username: formData.get('username'),
        content: formData.get('password'),
    };
contentElement.value = '';
supabase
    .from('users')
    .insert([
        message,
    ]).then(() => { 
        console.log('Message sent!'); 
    });
});

// Define the signUpNewUser function
async function signUpNewUser() {
    const email = 'example@email.com';
    const password = 'example-password';
    const { data, error } = await supabase.auth.signUp({
        email: 'example@email.com',
        password: 'example-password',
      })

    if (error) {
        console.log('Error signing up:');
    } else {
        console.log('Successfully signed up:');
    }
}

// Event listener for the "Sign Up" button
document.getElementById('sign-up').addEventListener('click', () => {
    signUpNewUser();
});

const { data, error } = await supabase.auth.signInWithPassword({
    email: 'example@email.com',
    password: 'example-password',
  })

async function signOut() {
const { error } = await supabase.auth.signOut()
}

async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'example@email.com',
      password: 'example-password',
      options: {
        redirectTo: 'https//example.com/welcome'
      }
    })
  }
