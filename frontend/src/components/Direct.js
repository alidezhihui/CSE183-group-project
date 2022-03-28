import api from '../utils/api';
import { useState, useEffect } from 'react';

export default function Direct({workspace}){
    const [directMessage, setdirectMessage] = useState([]);
    useEffect(()=>{
        if(workspace){
            api.get('/privatemessage/'+workspace.id).then(res => {
                setdirectMessage(res);
            })
        }
    }, [workspace]);
    return (
        <div>
            {directMessage.map(message => (
                <section>
                    <div>userName</div>
                    <div>{message.content}</div>
                    <div>time</div>
                </section>
            ))}
        </div>
    )
}