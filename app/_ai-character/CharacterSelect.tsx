'use client'

import { Characters } from './config'
import { CharacterSelectProps } from './types'
import Select from 'react-select'

// キャラクター選択
const CharacterSelect = ({ setCharacter, playAudio }: CharacterSelectProps) => {
  return (
    <div className="flex items-center h-screen justify-center mb-2">
      <Select
        styles={{
          control: (styles, { isFocused }) => ({
            ...styles,
            width: 170,
            backgroundColor: 'white',
            boxShadow: 'none',
            borderRadius: '0.2rem',
            '&:hover': {
              borderColor: '#7fbfff',
            },
          }),
          option: (styles, { isSelected, isFocused }) => ({
            ...styles,
            backgroundColor: isSelected ? '#7fbfff' : isFocused ? '#d1e8ff' : 'white',
            color: isSelected ? 'white' : isFocused ? 'black' : 'black',
          }),
        }}
        id="selectbox"
        instanceId="selectbox"
        className="text-sm"
        options={Characters}
        defaultValue={Characters[0]}
        onChange={async (data) => {
          if (data) {
            setCharacter(data)
            // キャラクター変更時に音声を再生
            await playAudio(data.word, data.value)
          }
        }}
        components={{
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  )
}

export default CharacterSelect