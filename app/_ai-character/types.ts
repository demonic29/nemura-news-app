import { Dispatch, SetStateAction } from 'react'

export type CharacterType = {
    value: string
    label: string
    word: string
}


// キャラクター選択の型定義
export type CharacterSelectProps = {
  setCharacter: Dispatch<SetStateAction<CharacterType>>
  playAudio: (text: string, speaker: string) => Promise<void>
}