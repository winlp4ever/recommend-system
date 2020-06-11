import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import { v4 as uuidv4 } from 'uuid';

import './_app.scss'

const socket = io()

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
        }
    }, [delay]);
}

const Hints = (props) => {
    if (props.hints.length == 0) return null
    return <div className='hints'>
        {props.hints.map((h, id) => <div 
            key={id}
            className='hint'
            onClick={_ => props.applyHint(h.text)}
        >
            <span>{h.text}</span>
            <span className='score'>{h.score}</span>
        </div>)}
    </div>
}

const Ask = (props) => {
    const [q, setQ] = useState('')
    const [hints, setHints] = useState([])
    const [viewHints, setViewHints] = useState(true)

    const [isTyping,setIsTyping] = useState(false)

    const text = useRef()

    useEffect(() => {
        socket.on('q-hints', msg => {
            if (msg.uid == props.uid) {
                setHints(msg.hints)
            }
        })

        return (() => socket.off('q-hints'))
    }, [])

    useInterval(() => {
        if (q.length > 2) if (isTyping) {
            socket.emit('poll-hints', {
                uid: props.uid,
                q: q
            })
            setIsTyping(false)
        }
    }, 100)

    const sendQ = (q) => {
        socket.emit('ask', {
            uid: props.uid,
            q: q
        })
    }

    const handleKeyDown = (e) => {
        let keycode = e.keyCode || e.which
        if (keycode == 13) {
            e.preventDefault()
            sendQ(q)
        } else if (keycode == 27) {
            e.preventDefault()
            setViewHints(false)
        }
    }

    const applyHint = (txt) => {
        setQ(txt)
        text.current.value = txt
        setIsTyping(false)
    }

    const handleChange = (e) => {
        setQ(e.target.value)
        setIsTyping(true)
        setViewHints(true)
    }

    return <div className='ask'
        onKeyDown={handleKeyDown}
    >
        <TextareaAutosize
            ref={text}
            placeholder="ask your question"
            onChange={handleChange}
        />     
        {viewHints && <Hints hints={hints} applyHint={applyHint}/>}
    </div>
}

const Answer = (props) => {
    const [answer, setAnswer] = useState('')
    useEffect(() => {
        socket.on('answer', msg => {
            if (msg.uid == props.uid) {
                setAnswer(msg.answer)
            }
        })

        return (() => socket.off('answer'))
    }, [])
    return <div className='answer'>
        <h4>Answer:</h4>
        <div className='ans'>
            {answer}
        </div>
    </div>
}

const App = (props) => {
    const [uid, setuid] = useState(uuidv4())
    return <div className='app'>
        <Ask uid={uid}/>
        <Answer uid={uid}/>
    </div>
}

export default App;