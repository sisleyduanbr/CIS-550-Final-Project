import { Card } from "@mui/material";
import Icon from '@mdi/react';
import { mdiCheck, mdiNoteEditOutline } from '@mdi/js';
import { useState, useEffect, useContext } from "react";
import http from '../HttpService'
import { LoginContext } from "../contexts/LoginContext";
import {useNavigate} from 'react-router-dom';
const config = require('../config.json');


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
        <>
        <div className="d-flex justify-content-center">
        {/* <div className="col-2"> */}
        {!editMode && <div className="d-flex justify-content-end">
            <div className="mt-4 btn btn-outline-secondary" style={{height:'40px'}} onClick={() => setEditMode(true)}>
                <Icon path={mdiNoteEditOutline} size={1} />
            </div>
        </div>}
        {!editMode &&
            <div className="m-2">
                <div className="m-4">
                    Username: 
                        {username}
                </div>
                <div className="m-4">
                    age: {age}
                </div>
                <div className="m-4">
                    gender: {gender}
                </div>
                <div className="m-4">
                    occupation: {occupation}
                </div>
                <div className="m-4">
                    zip_code: {zip_code}
                </div>
                <div className="m-4 col-10 btn btn-outline-danger" onClick={logout}>Logout</div>
            </div>}

        {editMode &&
            <div  className="justify-content-center m-2 " >
                <div className="m-4">
                    Username: {username}
                </div>
                <div className="m-4">
                    password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="m-4">
                    age:
                    <input type="text" value={age} onChange={(e) => setAge(e.target.value)} />
                </div>
                <div className="m-4">
                    gender:
                    <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
                </div>
                <div className="m-4">
                    occupation: 
                    <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
                </div>
                
            <div className="m-4 col-10 btn btn-secondary" onClick={handleSave}>Save </div>
            </div>}
            {/* </div> */}
        </div>
        </>
    )
}