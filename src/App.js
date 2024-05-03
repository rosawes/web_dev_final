import React, { useState } from "react";
import "./App.css";
import Login from "./login.js";
import logo from './EpicNotesLogo.jpeg';
import ThemeSelector from './ThemeSelector.js';

function App() {
  //set variable states
    const [theme, setTheme] = useState('default');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [title, setTitle] = useState("");
    const [des, setDes] = useState("");
    const [topic, setTopic] = useState("");
    const [customTopic, setCustomTopic] = useState("");
    const [count, setCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState(""); 

    // login and set theme
    // get notes from local storage

    function getAllNotes(){
        const savedNotes = localStorage.getItem('notes');
        const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];

        return parsedNotes
    }

    function getNotes(){

        if(!isAuthenticated()){return groupNotesByTopic([])}
        const savedNotes = localStorage.getItem('notes');
        const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];

        console.log(savedNotes)

        const username = getUsername();
        
        return groupNotesByTopic(
        parsedNotes.filter((e) => e["username"] === username ));

    }

    const [notes, setNotes] = useState(()=>{
        return getNotes()        
    });

    // delete notes
    function remove(id) {
        const updatedNotes = Object.values(getAllNotes()).flat().filter((e) => e.key !== id);
        localStorage.setItem("notes", JSON.stringify(updatedNotes))
        setNotes(getNotes())
        
    }
    if (!isLoggedIn) {
        return <Login onLogin={onLogin} onThemeSelect={setTheme}/>;
    }

    function getUsername(){
        return JSON.parse(localStorage.getItem("authenticated"))["username"]
    }

    function isAuthenticated(){
        const authObj = localStorage.getItem("authenticated")
        const auth = authObj ? JSON.parse(authObj)["auth"] : false
        return auth
    }

    function onLogin(val){
        setIsLoggedIn(val);
        setNotes(getNotes())
    }

    function onThemeSelect(selectedTheme) {
      setTheme(selectedTheme);
    }

    // new note
    function handle() {
        if (!title || !des || (!topic && !customTopic)) {
            window.alert("Incomplete input");
            return;
        }
        const noteTopic = topic ==="other" ? customTopic : topic;
        const newNote = { key: count, title: title, des: des, topic: noteTopic, username: getUsername() };
        const updatedNotes = [...Object.values(getAllNotes()), newNote];
        updatedNotes.sort((a,b) => a.topic.toLowerCase().localeCompare(b.topic.toLowerCase()));

        localStorage.setItem("notes", JSON.stringify(updatedNotes))
        setNotes(getNotes())
        // setNotes(groupNotesByTopic(updatedNotes));
        setCount(count + 1);
        setTitle("");
        setDes("");
        setTopic("");
        setCustomTopic("");
        console.log(notes)
        console.log(updatedNotes)

    }

    function handleLogout(){
        const authState = {
            "auth": false
        }
        localStorage.setItem("authenticated", JSON.stringify(authState))
        setIsLoggedIn(false);
        setNotes([])
    }

    // categorize notes
    function groupNotesByTopic(notesArray) {
        const grouped = {};
        notesArray.forEach(note => {
            const topicKey = note.topic.toLowerCase();
            if (!grouped[topicKey]) {
                grouped[topicKey] = [];
            }
            grouped[topicKey].push(note);
        });
        return grouped;
    }

    // search bar
    const filteredNotes = searchTerm.trim() ? Object.fromEntries(
        Object.entries(notes).map(([topic, notesArray]) => [
            topic,
            notesArray.filter(note => note.title.toLowerCase().includes(searchTerm.toLowerCase()))
        ])
    ) : notes;

    // set everything up
    return (
        <div className={`App ${theme}`}>
            <ThemeSelector onThemeSelect={setTheme}/>
            <div className="card">
                <div className="head">
                  <div style={{marginBottom: '10px'}}>
                <img src={logo} alt="Epic Notes Logo" style={{ width: "100px" }} /> 
                </div>
                
                    <h1>Your Epic Thoughts</h1>
                    </div>
                    <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by title"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="notes">
                    {Object.entries(filteredNotes).map(([topic, notesArray]) => (
                        <div key={topic}>
                            <h2 className="topic-heading">{topic}</h2>
                            {notesArray.map((note) => (
                                <div className="notes-item" key={note.key}>
                                    <div style={{ width: "90%" }}>
                                        <h4>Title: {note.title}</h4>
                                        <p>Note: {note.des}</p>
                                    </div>
                                    <button
                                        onClick={() => remove(note.key)}
                                        style={{
                                            fontSize: "20px",
                                            width: "8%",
                                            height: "35px",
                                            padding: "0 2% 0 2%",
                                            color: "black",
                                          }}
                                          
                                      >
                                          X
                                      </button>
                                  </div>
                              ))}
                          </div>
                      ))}
                    <div className="innerbox">
                        <h3>New Note</h3>
                        <input
                            type="text"
                            id="title"
                            placeholder="Add title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        ></input>
                        <input
                            type="text"
                            id="description"
                            placeholder="Note"
                            value={des}
                            onChange={(e) => setDes(e.target.value)}
                        ></input>
                        <select
                            className="topic-dropdown"
                            value={topic}
                            onChange={(e) => {
                                setTopic(e.target.value);
                                if (e.target.value !== "other") {
                                    setCustomTopic("");
                                }
                            }}
                        >
                            <option value="">Select topic</option>
                            <option value="school">School</option>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="food">Food</option>
                            <option value="other">Other</option>
                        </select>
                        {topic === "other" && (
                            <input
                                type="text"
                                placeholder="Custom topic"
                                value={customTopic}
                                onChange={(e) => setCustomTopic(e.target.value)}
                            />
                        )}
                        <button className="submit-button" onClick={handle}>
                            Submit
                        </button>
                    </div>
                    <div style = {{marginTop: '30px'}}>
      <button onClick={handleLogout}>Log Out</button>
                </div>
                </div>
            </div>
        </div>
    );
}

export default App;