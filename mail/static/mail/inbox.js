document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  
}


// loadmail
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view').style.display = "none";

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 class="mb-3">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response=>response.json())
  .then(data => {
   for(i in data){
     const div = document.createElement('div')
     div.style.border = "1px solid rgba(0,0,0,.1)";
     div.style.borderRadius = "5px";
     div.style.cursor = "pointer"
     div.style.backgroundColor = "white";
     div.style.padding = "15px";
     div.id = data[i]['id']
     div.style.marginBottom = "10px";
     if(data[i]['read'] == true){
   
      div.innerHTML = `<b>${data[i]['recipients'][0]}</b> 
      <br> <span style="color:black;">${data[i]['subject']}</span>
       <br>
       <small class="text-muted" > ${data[i]['timestamp']}</small>
      
       `

    }
    else{
      div.innerHTML = `<b>${data[i]['recipients'][0]}</b> 
      <br><span style="color:blue;">${data[i]['subject']}</span>
      <br> <small class="text-muted" > ${data[i]['timestamp']}</small>
  
      `
    
    }
   
    div.addEventListener('click',function(){
      document.querySelector('#view').style.display = "block";
      document.querySelector('#emails-view').style.display = "none";
      show_mail(div.id)
     
    })


    document.querySelector('#emails-view').append(div)
   
    
   }
  })



}
// loadmail







// compose_function
document.addEventListener('DOMContentLoaded',function(){
  document.querySelector('#compose-form').onsubmit = function(){
    let receive = document.querySelector('#compose-recipients').value;
    let subject = document.querySelector('#compose-subject').value;
    let body = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: receive,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(data => {
        // Print result
        console.log(data);
        if ('error' in data){
          document.querySelector('#error').innerHTML = data['error']
          document.querySelector("#error").className = "alert alert-danger";
        
        }else{
          document.querySelector('#error').innerHTML = data['message']
          document.querySelector("#error").className = "alert alert-success";
          load_mailbox('sent')
        }

        
    });

    return false;
  
  
  }
})
// compose_function




// show_mail 
function show_mail(id){
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
// Print email
  document.querySelector('#view').innerHTML = `From:&nbsp;<b>${email['sender']}</b><br>
  To:&nbsp;<b>${email['recipients']}</b><br>
  Subject: ${email['subject']}</b>
  <br>

  <hr>
  <p>
  ${email['body']}
  </p>
  `  
  const btn = document.createElement('button');
  btn.className = "btn btn-outline-primary abtn"
  if (email['archived'] == true){
    btn.innerHTML = "unarchived";
  }
  else{
    btn.innerHTML = "archived";
  }
    document.querySelector("#view").append(btn)
    btn.addEventListener("click",function(){
      if(email['archived'] == true){
        btn.innerHTML = "archived"
        unarchived(email['id'])
      }
      else{
        btn.innerHTML = "unarchived"
        archive(email['id'])
      }
    })
  const reply = document.createElement('button');
  reply.innerHTML = "Reply";
  reply.className = "b btn btn-outline-primary";
  reply.addEventListener('click',function(){
    document.querySelector('#name').innerHTML = "Reply Email";
    compose_email()
    document.querySelector('#compose-recipients').value = `${email['sender']}`;
    document.querySelector('#compose-subject').value = `Re:${email['subject']}`;
    document.querySelector('#compose-body').value = `On ${email['timestamp']} ${email['sender']} wrote:`;

  })
  document.querySelector("#view").append(reply)
    
})
fetch(`/emails/${id}`,{
  method: 'PUT',
  body: JSON.stringify({
      read: true
  })
})


}
// show_mail 


// archive
function archive(id){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
}
function unarchived(id){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
}
// archive






