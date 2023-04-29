import { Card } from "@mui/material";
import Icon from '@mdi/react';
import { mdiCheck } from '@mdi/js';
import { useState, useEffect } from "react";
import http from '../HttpService'
const config = require('../config.json');

const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

export default function ProfilePage() {
    const [username, setUsername] = useState("user1");
    const [pw, setPw] = useState('123456')
    const [age, setAge] = useState(21)
    const [gender, setGender] = useState('M')
    const [occupation, setOccupation] = useState('student')
    const [zip_code, setZipcode] = useState('19104')

    const [editMode, setEditMode] = useState(false);

    const handleSave = () => {
        setEditMode(false);
        // make a call to the back end
        http.post('/update_profile', {
            username: username,
            pw: pw,
            age: age,
            gender: gender,
            occupation: occupation,
            zip_code: zip_code
        })
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
            </div>}

        {editMode &&
            <div  className="justify-content-center">
                <div>
                    Username: {username}
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
                <div>
                    zip_code: {zip_code}
                    <input type="text" value={zip_code} onChange={(e) => setZipcode(e.target.value)} />
                </div>
            </div>}
        <div className="btn" onClick={handleSave}>Save </div>
        </div>
    )
}