import { useState } from "react"
import api from "../utils/api";
export default function Status(){
    let user =  JSON.parse(localStorage.user)
    const [status, setStatus] = useState(user.user.mythoughts);
    const updateStatus = async (ev) => {
        ev.preventDefault()
        await api.put('/users', {content: status})
        user.user.mythoughts = status;
        localStorage.setItem('user', JSON.stringify(user))
    }
    return (
        <form onSubmit={updateStatus}>
            <label>{user.user.users_name}</label>   
            <input value={status} onChange = {ev => setStatus(ev.target.value)} />
        </form>

    )
}