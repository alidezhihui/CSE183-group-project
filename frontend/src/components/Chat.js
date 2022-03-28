import api from '../utils/api';
import Emoji from '../Emoji';
import { useState, useEffect } from 'react';

export default function Chat({ channel }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(''); // the current message you want to send
    const [filter, setFilter] = useState(''); // filter the messages you need
    const [updating, setUpdating] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);

    const postMessage = async (ev, parent_id) => {
        ev.preventDefault();
        let payload = {
            content: newMessage
        }
        if (parent_id) {
            payload.parent_id = parent_id
        }
        const storedMessage = await api.post('/directmessage/' + channel.id, payload);
        setMessages([...messages, prepareMessage(storedMessage)]);
        setNewMessage('')
    }

    const prepareMessage = message => {
        const time = new Date(message.created);
        message.insertDate = time.getMonth() + "/" + time.getDate()
        message.details = false
        return message;
    }

    // call this function everytime the value of 'channel' is modified
    // get the list of messages
    useEffect(() => {
        console.log('in Chat', channel)
        if (channel) {
            api.get('/directmessage/' + channel.id).then(res => {
                res.forEach(prepareMessage)
                setMessages(res)

            })
        }
    }, [channel])

    const getReplies = (msg) => {
        return messages.filter(message => message.parent_id === msg.id)
    }
    const toggleReplyView = index => {
        setMessages(existing => {
            existing[index].details = !existing[index].details;
            return existing;
        })
        setUpdating(old => !old)
        console.log(updating)
    }

    return (
        <div>
            <h3>{channel ? channel.channel_name : 'Select Channel'}</h3>
            <input placeholder="search" value={filter} onChange={ev => setFilter(ev.target.value)} />
            <div className="bg-gray p-3 d-flex" style={{ flexDirection: 'column' }}>
                <div className="f-1" style={{ overflowY: 'auto' }}>
                    {messages.map((message, i) => (
                        <div key={message.id}>
                            {!message.parent_id && message.content.includes(filter) ? (
                                <section className="grid-3-6-3 m-y-3">
                                    <div>{message.users_name}</div>
                                    <div className="bg-white b-rounded-2 p-2 m-x-2">
                                        <p>{message.content} ({message.id})</p>
                                        <div>
                                            {getReplies(message).length}
                                            <button onClick={() => toggleReplyView(i)}>reply</button>
                                        </div>
                                    </div>
                                    <div>{message.insertDate}</div>

                                    {message.details ? (
                                        <form onSubmit={ev => postMessage(ev, message.id)}>
                                            <input value={newMessage} onChange={ev => setNewMessage(ev.target.value)} />
                                        </form>
                                    ) : null}
                                </section>
                            ) : null}
                            <div className="replies">
                                {getReplies(message).map(reply => (
                                    <p key={reply.id}>{reply.users_name}: {reply.content}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={postMessage}>
                    <input className="bg-white b-rounded b-gray p-x-2 p-y-1 focus:raise-1-accent w-100p" value={newMessage} onChange={ev => setNewMessage(ev.target.value)} />

                </form>
                <div>
                    <button onClick={()=>setShowEmoji(old => !old)}>insert emoji</button>
                    <Emoji onSelect={emoji => setNewMessage(e => e + emoji)} show={showEmoji} />
                </div>
            </div>
        </div>
    )
}