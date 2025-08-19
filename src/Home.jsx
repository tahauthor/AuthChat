import React from 'react'
import { useState } from 'react'
import './App.css'
import logo from './assets/logo.jpeg'


const Home = () => {
    const[User, seUser]=useState(
        { id:1, nom:"Author", message: "Hi Guys", Time:"O6h00"}   
    );

const[message, setMessage]=useState("");
const[messages, setMessages]=useState([])

function handleChange(event) {
    setMessage(event.target.value);
    
}

function handleSend() {
    if (message.trim()==="") {
        return;
    }

setMessage([...messages,message]);
setMessage("")
    
}

  return (
      
    <>
         <h1>AuthorChat</h1>
    <div>
        <p className='msg1'>Bonjour les amis</p>
        <p>Hey, Jespère que tu vas</p>
    </div>


         <div className='chatMessages'>
            {messages.map(function (msg, index) {
                return <p key={index}><b>Vous</b>{msg} </p>
            })}
         </div>


         <div className='chatInput'>
            <input type="text" placeholder="Ecrivez un message" value={message} 
            onChange={handleChange}/> 
            <button onClick={handleSend}  type="submit">Envoyer</button>
         </div>

    </>

  )
}

export default Home