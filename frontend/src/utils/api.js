
const baseURL =  'http://localhost:3010/v0'

const api = {
    async get(endpoint){
        return await fetch(baseURL + endpoint,{headers:this.headers()}).then(j => j.json())
    },
    async post(endpoint, payload){
        return await this.complex(endpoint, payload, 'POST')
    },
    async put(endpoint, payload){
        return await this.complex(endpoint, payload, 'PUT')
    },
    async complex(endpoint, payload, method){
        return await fetch(baseURL + endpoint,{
            method: method,
            headers:this.headers(),
            body: JSON.stringify(payload)
        }).then(j => j.json())
    },
    headers(){
        const headers = {
            "content-type": "application/json; charset=UTF-8"
        };
        if(localStorage.user){
            const token = JSON.parse(localStorage.user).accessToken;
            headers.Authorization = `Bearer ${token}`
        }
        return headers;
    }
}
export default api;