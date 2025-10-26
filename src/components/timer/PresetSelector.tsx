// src/components/dashboard/PresetSelector.tsx
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface PresetSelectorProps {
  onPresetChange: (preset: 'workout' | 'study' | { name: string; tasks: any[]; totalTime: number }) => void;
  currentTasks: any[];
  currentTotalTime: number;
  setTasks: (tasks: any[]) => void; 
  setTotalTime: (time: number) => void; 
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  onPresetChange,
  currentTasks,
  currentTotalTime,
  setTasks, 
  setTotalTime, 
}) => {
  const { data: session } = useSession();
  const [customPresets, setCustomPresets] = useState<any[]>([]);
  const [showSave, setShowSave] = useState(false);
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    if (session?.user.id) {
      fetch('/api/v1/timer-presets')
        .then(res => res.json())
        .then(setCustomPresets);
    }
  }, [session]);

  const handleSavePreset = async () => {
    if (!presetName.trim()) return;
    const res = await fetch('/api/v1/timer-presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: presetName, tasks: currentTasks, totalTime: currentTotalTime }),
    });
    if (res.ok) {
      const newPreset = await res.json();
      setCustomPresets([...customPresets, newPreset]);
      setPresetName('');
      setShowSave(false);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="preset" className="text-white">Preset:</label>
      <select
        id="preset"
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'custom') {
            setShowSave(true);
          } else if (value.startsWith('custom-')) {
            const preset = customPresets.find(p => p.id === value.replace('custom-', ''));
            if (preset) onPresetChange(preset);
          } else {
            onPresetChange(value as 'workout' | 'study');
          }
        }}
        className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
      >
        <option value="workout">Workout</option>
        <option value="study">Study</option>
        {customPresets.map(preset => (
          <option key={preset.id} value={`custom-${preset.id}`}>{preset.name}</option>
        ))}
        <option value="custom">Save Current as Preset</option>
      </select>

      {showSave && (
        <div className="mt-2">
          <input
            type="text"
            placeholder="Preset name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="p-2 bg-gray-700 text-white rounded mr-2"
          />
          <button onClick={handleSavePreset} className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button onClick={() => setShowSave(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};