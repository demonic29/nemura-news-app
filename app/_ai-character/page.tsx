'use client';
import React, { useState } from 'react'
import { Characters } from './config';
import CharacterSelect from './CharacterSelect';
import axios from 'axios';
import { playAudio } from '../lib/audio';

export default function Character() {

    const [character, setCharacter] = useState(Characters[0]);
    return (
        <div>
            <CharacterSelect setCharacter={setCharacter} playAudio={playAudio}/>
        </div>
    )
}
