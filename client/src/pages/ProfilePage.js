import { Card } from "@mui/material";
import Icon from '@mdi/react';
import { mdiCheck } from '@mdi/js';
import { useState, useEffect, useContext } from "react";
import http from '../HttpService'
import { LoginContext } from "../contexts/LoginContext";
import {useNavigate} from 'react-router-dom';
const config = require('../config.json');

const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

export default function ProfilePage() {
    
    const {username, setUsername, password, setPassword, 
        age, setAge, gender, setGender, occupation, setOccupation,
        login, setLogin
    } = useContext(LoginContext);
    const zip_code = 19104;
    const navigate = useNavigate();
    

    const [editMode, setEditMode] = useState(false);

    const handleSave = () => {
        setEditMode(false);
        // make a call to the back end
        http.post('/update_profile', {
            username: username,
            pw: password,
            age: age,
            gender: gender,
            occupation: occupation,
            zip_code: zip_code
        })
    }

    const logout = async () => {
        setUsername("");
        setPassword("");
        setAge("");
        setGender("");
        setOccupation("");
        setLogin(false);
        navigate('/login');
    }

    return (
        <div className="d-flex justify-content-center">
        <div className="btn btn-outline" onClick={() => setEditMode(true)}>edit button</div>
        {!editMode &&
            <div >
                <div>
                    Username: 
                        {username}
                </div>
                <div>
                    age: {age}
                </div>
                <div>
                    gender: {gender}
                </div>
                <div>
                    occupation: {occupation}
                </div>
                <div>
                    zip_code: {zip_code}
                </div>
                <button onClick={logout}>Logout</button>
            </div>}

        {editMode &&
            <div  className="justify-content-center">
                <div>
                    Username: {username}
                </div>
                <div>
                    password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    age:
                    <input type="text" value={age} onChange={(e) => setAge(e.target.value)} />
                </div>
                <div>
                    gender:
                    <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
                </div>
                <div>
                    occupation: 
                    <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
                </div>
                
            </div>}
        <div className="btn" onClick={handleSave}>Save </div>
        </div>
    )
}