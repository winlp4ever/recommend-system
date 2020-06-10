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

    const [isTyping,setIsTyping] = useState(false)

    useEffect(() => {
        socket.on('q-hints', msg => {
            if (msg.uid == props.uid) {
                setHints(msg.hints)
                setIsTyping(false)
            }
        })

        return (() => socket.off('*'))
    }, [])

    useInterval(() => socket.emit('poll-hints', {
        uid: props.uid,
        q: q
    }))

    const applyHint = (txt) => {
        setQ(txt)
        setIsTyping(true)
    }

    const handleChange = (e) => {
        setQ(e.target.value)
        setIsTyping(true)
    }

    return <div className='ask'>
        <TextareaAutosize
            placeholder="ask your question"
            onChange={handleChange}
        />     
        <Hints hints={hints} applyHint={applyHint}/>
    </div>
}

const App = (props) => {
    const [uid, setuid] = useState(uuidv4())
    return <div className='app'>
        <Ask uid={uid}/>
    </div>
}

export default App;