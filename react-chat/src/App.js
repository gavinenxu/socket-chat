import SockJS from 'sockjs-client'
import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }

    const sock = new SockJS('http://localhost:8080/chat')

    sock.onopen = () => {
      console.log('connection to server open')
    }

    sock.onmessage = e => {
      const { messages } = this.state
      this.setState({
        messages: [e.data, ...messages]
      })
    }

    sock.onclose = () => {
      console.log('close')
    }

    this.sock = sock

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  handleFormSubmit(e) {
    e.preventDefault()
    if (this.sock) {
      this.sock.send(this.msgNode.value)
    }
    this.msgNode.value = ''
    // const { value } = e.target[0]
    // this.setState(state => {
    //   return {
    //     messages: [...state.messages, value]
    //   }
    // })
  }

  render() {
    const { messages } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form onSubmit={this.handleFormSubmit}>
            <input
              ref={node => {
                this.msgNode = node
              }}
              type="text"
              placeholder="Type here to chat..."
            />
            <button type="submit">Send</button>
          </form>
          {messages.map((message, index) => {
            // eslint-disable-next-line react/no-array-index-key
            return <div key={index}>{message}</div>
          })}
        </header>
      </div>
    )
  }
}

export default App
