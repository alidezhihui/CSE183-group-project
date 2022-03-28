import React from "react";
import
{
  Box,
  AppBar,
  Toolbar,
  IconButton,
  CssBaseline,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  Typography,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import ChatIcon from '@material-ui/icons/Chat';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './Home.css';
import Home from "@material-ui/icons/Home";
import api from './utils/api';
import getChannels from './components/WorkspaceMenu'
import { number } from "prop-types";
import Emoji from "./Emoji";


class App extends React.Component{
  constructor(props){
    super(props);
    const user = JSON.parse(localStorage.user);
    this.state = {
      disPage: 'home',
      windowsize: window.innerWidth,
      channelCollapse: false,
      dMCollapse: false,
      inputValue: null,
      isActive: true,
      status: 'enter your thoughts',
      workspaces: null,
      workspaceToDis: 'CSE 183 Summer 2021',
      workspaceId:'1',
      channels: [],
      channelSelected: null,
      channelSelectedId: null,
      directMessage: [],
      loginUser: user,
      disMessages: [],
      selectedMessage: null,
      filter: null,
    };

    this.renderMobileChat = this.renderMobileChat.bind(this);
    this.whatToRender = this.whatToRender.bind(this);
    this.renderMobileProfile = this.renderMobileProfile.bind(this);
  }

  componentDidMount(){
    api.get('/workspace').then(
      ws=>this.setState({workspaces:ws}));
    api.get('/channels/'+this.state.workspaceId).then(c=>this.setState({channels:c}));
    api.get('/privatemessage/'+this.state.workspaceId).then(res => {
                this.setState({directMessage:res});
            })
    window.addEventListener("resize", this.handleResize);
  }

  prepareMessage = message => {
    const time = new Date(message.created);
    message.insertDate = time.getMonth()+1 + "/" + time.getDate()
    message.details = false
    return message;
  }

  postMessage = async (msg, parent_id) => {
    console.log(this.state);
    if(!msg){
      alert('you cant send empty message');
      return
    }
    let payload = {
        content: msg
    }
    if (parent_id) {
        payload.parent_id = Number(parent_id)
    }
    console.log(payload);
    const storedMessage = await api.post('/directmessage/' + this.state.channelSelectedId, payload);
    this.setState({disMessages:([...this.state.disMessages, this.prepareMessage(storedMessage)])});
}

  postPrivateMessage = async (msg) => {
    console.log(this.state);
    if(!msg){
      alert('you cant send empty message');
      return
    }
    let payload = {
        content: msg,
        toId: ((this.state.loginUser.user.id-1)?0:1)+1,
        Id: this.state.loginUser.user.id,
        workspaceId: Number(this.state.channelSelectedId)
    }
    console.log(payload);
    const storedMessage = await api.post('/privatemessage/', payload);
    this.setState({disMessages:([...this.state.disMessages, this.prepareMessage(storedMessage)])});
  }

  handleResize = (e) =>{
    this.setState({windowsize:window.innerWidth});
  }

  handleActiveSwitch = (e) =>{
    this.setState({isActive:!this.state.isActive});
  }

  toggleChannel = (e) =>{
    this.setState({channelCollapse:!this.state.channelCollapse});
  }

  toggleDM = (e) =>{
    this.setState({dMCollapse:!this.state.dMCollapse});
  }

  handleChatChange = async (e)=>{
    await this.setState({inputValue:e.target.value});
  }

  handleChatSubmit = (e)=>{
    e.preventDefault();
    this.postMessage(this.state.inputValue);
  }

  handleThreadSubmit = (e) =>{
    e.preventDefault();
    this.postMessage(this.state.inputValue,this.state.selectedMessage.id);
  }
  
  handleDirectSubmit = (e) =>{
    e.preventDefault();
    this.postPrivateMessage(this.state.inputValue);
  }

  handleSearchSubmit = (e)=>{
    console.log(this.state.inputValue);
  }

  handleStatusSubmit = (e) =>{
    this.setState({status:this.state.inputValue})
  }

  workspacesSelectPage = (e) =>{
    this.setState({disPage:'workspaceSelect'});
  }

  selectWorkspaceToDis = async (e) =>{
    await this.setState({workspaceToDis:e.target.innerHTML, workspaceId:e.target.attributes.id.value,disPage:'home'});
    api.get('/channels/'+this.state.workspaceId).then(c=>this.setState({channels:c}));
  }

  bottomBarHome = (e) =>{
    //from bottom to home
    this.setState({disPage:'home'});
  }

  bottomBarSearch = (e) =>{
    this.setState({disPage:'search'})
  }

  handleBackHome = (e) =>{
    //from anywhere to home
    this.setState({disPage:'home'});
  }

  handleBackChat = (e) =>{
    //from thread to chat
    this.setState({disPage:'chat'});
  }

  handleHomeClick = async (e) =>{
    //from home to chat
    await this.setState({disPage:'chat',channelSelected:e.target.innerHTML,channelSelectedId:e.target.attributes.id.value});
    console.log(e.target.attributes.id.value);
    console.log(this.state.channelSelectedId);
    api.get('/directmessage/' + this.state.channelSelectedId).then(res => {
      res.forEach(this.prepareMessage);
      this.setState({disMessages:res});
    })
  }

  handleDirectClick = async (e) =>{
    await this.setState({disPage:'direct',channelSelected:e.target.innerHTML,channelSelectedId:e.target.attributes.id.value});
    api.get('/privatemessage/'+this.state.channelSelectedId).then(res => {
      res.forEach(this.prepareMessage);
      this.setState({disMessages:res})
  })
  }

  getReplies = (msg) => {
    return this.state.disMessages.filter(message => message.parent_id == msg.id);
  }

  handleChatClick = (e) =>{
    //from chat to thread
    const selectedMessage = {userName:e.target.attributes.userName.nodeValue,
      insertDate:e.target.attributes.insertDate.nodeValue,
      wordContent: e.target.attributes.wordContent.nodeValue,
      numberofReplies: e.target.attributes.numberofReplies.nodeValue,
      id: e.target.attributes.msgId.nodeValue,
      parent_id:e.target.attributes.parent_id?e.target.attributes.parent_id.nodeValue:null};
    this.setState({disPage:'thread', selectedMessage:selectedMessage});
  }

  handleSetFilter = async (e) =>{
    await this.setState({filter:e.target.value});
  }

  goToProfile = (e) =>{
    this.setState({disPage:'profile'});
  }

  renderBottonBar(){
    return (
    <div className='bottomBar'>
        <HomeIcon onClick={this.bottomBarHome}/>
        <SearchIcon onClick={this.bottomBarSearch}/>
        <AccountCircleIcon onClick={this.goToProfile}/>
    </div>);
  }

  renderInputBar(){
    return(
      <div className='inputBar'>
        <input className='inputBox' onChange={this.handleChatChange}/>
        <button className='inputButton' onClick={this.handleChatSubmit}>Send</button>
      </div>
    );
  }

  renderDirectBar(){
    return(
      <div className='inputBar'>
        <input className='inputBox' onChange={this.handleChatChange}/>
        <button className='inputButton' onClick={this.handleDirectSubmit}>Send</button>
      </div>
    );
  }

  renderThreadBar(){
    return(
      <div className='inputBar'>
        <input className='inputBox' onChange={this.handleChatChange}/>
        <button className='inputButton' onClick={this.handleThreadSubmit}>Send</button>
      </div>
    );
  }

  renderSearchBar(){
    return(
      <div className='searchBar'>
        <input placeholder="search form last entered channel/DM" 
          value={this.state.filter} onChange={this.handleSetFilter} />
      </div>
    );
  }

  renderWorkspaceSelect(){
    const workspaces = this.state.workspaces;
    console.log(this.state.workspaces);
    return(
      <div>
          <AppBar position='sticky'>
            <Toolbar className='mobileToolbar'>
              <IconButton edge='start'>
                  <ArrowBackIcon onClick={this.handleBackHome}/>
              </IconButton>
              <Typography variant="h6" className='title'>
                Select Your Workspace
              </Typography>
            </Toolbar> 
          </AppBar>
          <div>
            {workspaces.map(ws=>(
              <div onClick={this.selectWorkspaceToDis} id={ws.id}>{ws.workspace_name}</div>
            ))}
          </div>
      </div>)
  }

  renderMobileProfile(){
    const name = this.state.loginUser.user.users_name;
    const status = this.state.isActive ? 'active' : 'inactive';
    const bottomBar = this.renderBottonBar();
    return(
    <div>
        <AppBar position='sticky'>
          <Toolbar className='mobileToolbar'>
            <IconButton edge='start' onClick={this.handleBackHome}>
                <ArrowBackIcon />
            </IconButton>
          </Toolbar> 
        </AppBar>
        <div className={status}>
          {name}
        </div>
        <div onClick={this.handleActiveSwitch}>
          {status}
        </div>
        <div className='statusBar'>
          <input className='inputBox' onChange={this.handleChatChange} placeholder={this.state.status}/>
          <button className='inputButton' onClick={this.handleStatusSubmit}>update</button>
        </div> 
        {bottomBar}
    </div>)
  }

  renderMobileHome(){
    const workspaceName = this.state.workspaceToDis;
    const channels = this.state.channels;
    const users = ['Molly', 'Anna'];
    const bottomBar = this.renderBottonBar();
    const whoIsSender = (this.state.loginUser.user.id-1)?0:1;
    return(
      <div>
        <AppBar position='sticky'>
          <Toolbar className='mobileToolbar'>
            <Typography variant="h6" className='title'>
              {workspaceName}
            </Typography>
            <div className='iconbutton'>
              <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={this.workspacesSelectPage}
                  color="inherit"
                >
                  <ArrowDropDownCircleIcon />
              </IconButton>
            </div>
          </Toolbar> 
        </AppBar>

        <div className='dimm' onClick={this.toggleChannel}>
          Channels
        </div>
        {this.state.channelCollapse ? null:(
          channels.map(channel => (
            <div className='content' id={channel.id} onClick={this.handleHomeClick}>
              {channel.channel_name}
            </div>
          )))}
        <div className='dimm' onClick={this.toggleDM}>
          Direct Messages
        </div>
        {this.state.dMCollapse ? null:(
              <div className='content' id={whoIsSender+1} onClick={this.handleDirectClick}>
                {users[whoIsSender]}
              </div>
            )}
        {bottomBar}
      </div>
    );
  }

  renderMobileDirect(){
    const channelName = this.state.channelSelected;
    const inputBar = this.renderDirectBar();
    const bottomBar = this.renderBottonBar();
    const users = ['Molly', 'Anna'];
    return(
      <div>
        <AppBar position='sticky'>
          <Toolbar className='mobileToolbar'>
            <IconButton edge='start'>
                <ArrowBackIcon onClick={this.handleBackHome}/>
            </IconButton>
            <Typography variant="h6" className='title'>
              {channelName}
            </Typography>
          </Toolbar> 
        </AppBar>
        <div className='chatscreen'>
        {this.state.disMessages.map((e)=>(
          <div>
            <div className='senderRoot'>
              <div className='messageSender'>
                {users[e.from_id-1]}
              </div>
              <div className='time'>
                {e.insertDate}
              </div>
            </div>
            <div className='message'>
              {e.content}
            </div>
          </div>
        ))}
        </div>

        {inputBar}
        {bottomBar}
      </div>
    )
  }

  renderMobileChat(){
    const channelName = this.state.channelSelected;
    const inputBar = this.renderInputBar();
    const bottomBar = this.renderBottonBar();
    return(
      <div>
        <AppBar position='sticky'>
          <Toolbar className='mobileToolbar'>
            <IconButton edge='start'>
                <ArrowBackIcon onClick={this.handleBackHome}/>
            </IconButton>
            <Typography variant="h6" className='title'>
              {channelName}
            </Typography>
          </Toolbar> 
        </AppBar>
        <div className='chatscreen'>
        {this.state.disMessages.map((e)=>(
          e.parent_id?null:
          <div>
            <div className='senderRoot'>
              <div className='messageSender'>
                {e.users_name}
              </div>
              <div className='time'>
                {e.insertDate}
              </div>
            </div>
            <div className='message'>
              {e.content}
            </div>
            <div className='replyButton' onClick={this.handleChatClick}
              userName={e.users_name} insertDate={e.insertDate}
              wordContent={e.content} numberofReplies={this.getReplies(e).length}
              msgId={e.id} parent_id={e.parent_id}>
              {this.getReplies(e).length} replies
            </div>
          </div>
        ))}
        </div>

        {inputBar}
        {bottomBar}
      </div>
    )
  }

  renderMobileThread(){
    const channelName = 'Thread '+this.state.channelSelected;
    const senderName = this.state.selectedMessage.userName;
    const messageToSend = this.state.selectedMessage.wordContent;
    const sendDate = this.state.selectedMessage.insertDate;
    const inputBar = this.renderThreadBar();
    const breakline = 
      <div className='breakLine'>
        <div>replies</div>
        <hr/>
      </div>;
    const bottomBar = this.renderBottonBar();
    console.log(this.state.selectedMessage.id);
    return(
      <div>
        <AppBar position='sticky'>
          <Toolbar className='mobileToolbar'>
            <IconButton edge='start' onClick={this.handleBackChat}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" className='title'>
              {channelName}
            </Typography>
          </Toolbar> 
        </AppBar>
        {/* here is the origional message */}
        <div className='senderRoot'>
          <div className='messageSender'>
            {senderName}
          </div>
          <div className='time'>
            {sendDate}
          </div>
        </div>
        <div className='message'>
          {messageToSend}
        </div>
        {breakline}

        {/* map all replies here */}
        {this.getReplies(this.state.selectedMessage).map((e)=>(
          <div>
            <div className='senderRoot'>
              <div className='messageSender'>
                {e.users_name}
              </div>
              <div className='time'>
                {e.insertDate}
              </div>
            </div>
            <div className='message'>
              {e.content}
            </div>
          </div>
        ))}

        {inputBar}
        {bottomBar}
      </div>
    )
  }

  renderMobileSearch(){
    const channelName = 'Search';
    const inputBar = this.renderSearchBar();
    const bottomBar = this.renderBottonBar();
    return(
      <div>
        <AppBar position='sticky'>
          <Toolbar className='mobileToolbar'>
            <IconButton edge='start'>
                <ArrowBackIcon onClick={this.handleBackHome}/>
            </IconButton>
            <Typography variant="h6" className='title'>
              {channelName}
            </Typography>
          </Toolbar> 
        </AppBar>
        {inputBar}
        {this.state.disMessages.map((e)=>(
          !this.state.filter?null:
          e.parent_id || !e.content.includes(this.state.filter)?null:
          <div>
            <div className='senderRoot'>
              <div className='messageSender'>
                {e.users_name}
              </div>
              <div className='time'>
                {e.insertDate}
              </div>
            </div>
            <div className='message'>
              {e.content}
            </div>
          </div>
        ))}
        {bottomBar}
      </div>
    )
  }

  whatToRender(){
    const disPage = this.state.disPage;
      if(disPage === 'home'){
        return this.renderMobileHome();
      }else if(disPage === 'search'){
        return this.renderMobileSearch();
      }else if(disPage === 'chat'){
        return this.renderMobileChat();
      }else if(disPage === 'thread'){
        return this.renderMobileThread();
      }else if(disPage === 'profile'){
        return this.renderMobileProfile();
      }else if(disPage === 'workspaceSelect'){
        return this.renderWorkspaceSelect();
      }else if(disPage === 'direct'){
        return this.renderMobileDirect();
      }
    //else is desktop
  }

  render() {
    // console.log(this.state.windowsize);
    const toRender = this.whatToRender();
    return(
      <div>
        {toRender}
      </div>
    );
  }
}


export default App;
