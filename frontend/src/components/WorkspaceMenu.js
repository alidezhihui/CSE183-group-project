import api from '../utils/api';
import { useState, useEffect } from 'react';

// workspace = for each workspace
// onChannelChange = return the channel name if the name is clicked
export default function WorkspaceMenu({workspace, onChannelChange}){
    const [channels, setChannels] = useState([]);

    const bindChannels = res => {
        setChannels(res)
    }
    // at the very beginning, get all the channels based on the id of workspace
    // channel[0] = {channle_name = 'assignment 1'}
    useEffect(()=>{
        api.get('/channels/'+workspace.id).then(bindChannels)
    },[])
    return (
        <div>
            <div className="bg-accent p-3 text-white">{workspace.workspace_name}</div>
            {channels.map(channel => (
                <button onClick={() => onChannelChange(channel)} className="bg-gray p-x-3 p-y-1 b-1 b-white b-rounded text-primary w-100p" key={channel.id} >{channel.channel_name}</button>
            ))}
        </div> 
    
    )
}