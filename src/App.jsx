
import './App.css'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import {IconButton} from "@mui/material";
import axios from "axios";
import {useEffect, useState} from "react";

function App() {

    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')

    const [previousChat, setPreviousChat] = useState([])
    const [currentTitle, setCurrentTitle] = useState('')

    useEffect(() => {

        if(!currentTitle && answer){
            setCurrentTitle(question)
        }

        if(currentTitle && answer){
            setPreviousChat(prev => (
                [...prev, {
                    title: currentTitle,
                    role: 'user',
                    content: question
                }, {
                    title: currentTitle,
                    role: answer.role,
                    content: answer.content
                }]
            ))
        }

    }, [answer, currentTitle])


    const fetchData = async (question) => {

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/completions`, {
            userMessage: question
        })

        return response

    }

    const handleSubmit = async () => {
        try{
            const response = await fetchData(question)
            setAnswer(response.data.choices[0].message)
            // setQuestion('')
            // setHistoryList([question, ...historyList ])
        }catch (e) {
            setAnswer(e.message)
        }

    }

    const handleChange = e => {
        setQuestion(e.target.value)
    }

    const startNewChat = () => {
        setQuestion('')
        setAnswer('')
        setCurrentTitle('')
    }

    const changeTopic = (title) => {
        setCurrentTitle(title)
        setQuestion('')
        setAnswer('')
    }

    const currentChat = previousChat.filter(chat => chat.title === currentTitle)
    const chatHistory = Array.from(new Set(previousChat.map(chat => chat.title)))
    console.log(chatHistory)
  return (
    <>
      <div className="gpt-container">
          <section className="side-bar">
              <button onClick={() => startNewChat()}>+ New chat</button>
              <div className="history">
                  {
                      chatHistory.reverse().map((title, index) => (
                          <p key={index} onClick={() => changeTopic(title)}>{title}</p>
                      ))
                  }
              </div>
              <nav>
                  <p>Made by Max</p>
              </nav>
          </section>

          <section className="main">
              { !currentTitle && <h1>MaxGPT</h1> }

              <ul className="feed">
                  {
                      currentChat?.map((chat, index) => (
                          <li key={index}>
                              <p className='role'>{chat.role}</p>
                              <p>{chat.content}</p>
                          </li>
                      ))
                  }
              </ul>
              <div className="bottom-section">
                  <div className="input-container">
                      <input type="text" value={question} onChange={(e) => handleChange(e)} />
                      <div id="submit">
                        <IconButton onClick={() => handleSubmit()}>
                            <ArrowCircleUpIcon fontSize='medium' />
                        </IconButton>
                      </div>
                  </div>
              </div>

              <p className="info">
                  Chat GPT Mar 2 version.
              </p>
          </section>
      </div>
    </>
  )
}

export default App
