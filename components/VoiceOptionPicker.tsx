'use client'

import { playAudio } from "@/app/lib/audio";
import { VOICES } from "@/app/lib/voices";
import { GraphicIcon } from "@icons";

type VoiceOptionPickerProps = {
  selectedVoiceId: string;
  disabled?: boolean;
  onSelect: (voiceId: string) => void;
};

type VoiceButtonProps = {
  disabled: boolean;
  isSelected: boolean;
  label: string;
  speaker: string;
  word: string;
  onSelect: () => void;
};

function VoiceButton({
  disabled,
  isSelected,
  label,
  speaker,
  word,
  onSelect,
}: VoiceButtonProps) {
  const handleClick = async () => {
    if (disabled) {
      return;
    }

    onSelect();

    try {
      await playAudio(word, speaker);
    } catch (error) {
      console.error("Voice preview playback failed:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="flex flex-col items-center gap-2 group disabled:opacity-50"
    >
      <div
        className={`
          w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative
          ${
            isSelected
              ? "bg-button text-white-soft scale-110 drop-shadow-white-glow"
              : "bg-white-soft text-gray-soft opacity-90"
          }
        `}
      >
        <GraphicIcon className={`${isSelected ? "animate-pulse" : ""}`} />
      </div>

      <span
        className={`text-[14px] font-bold drop-shadow-md text-white-soft ${
          isSelected ? "opacity-100" : "opacity-80"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default function VoiceOptionPicker({
  selectedVoiceId,
  disabled = false,
  onSelect,
}: VoiceOptionPickerProps) {
  const rows = [VOICES.slice(0, 2), VOICES.slice(2)];

  return (
    <div className="mt-10 w-full px-6 max-w-[420px] z-10 flex flex-col items-center gap-y-6">
      {rows.map((voices, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex justify-center ${rowIndex === 0 ? "gap-x-12" : "gap-x-6"}`}
        >
          {voices.map((voice) => (
            <VoiceButton
              key={voice.id}
              disabled={disabled}
              label={voice.label}
              speaker={voice.speaker}
              word={voice.word}
              isSelected={selectedVoiceId === voice.id}
              onSelect={() => onSelect(voice.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
