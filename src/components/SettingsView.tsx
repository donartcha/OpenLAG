import React from 'react';
import { useStore } from '../store';
import { Settings, Save, AlertCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useStore();

  const handleGraphFocusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ graphFocusDepth: parseInt(e.target.value) });
  };

  const handleDocsFocusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ docsFocusDepth: parseInt(e.target.value) });
  };

  return (
    <div className="h-full w-full bg-[#0a0a0a] text-white p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
            <Settings className="text-indigo-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-serif">Settings</h1>
            <p className="text-white/40 text-sm mt-1">Configure workspace preferences and focus behaviors.</p>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-[#111] border border-white/10 p-6 rounded-md">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              Global Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-start border-t border-white/5 pt-4">
                <div>
                  <h3 className="font-medium text-sm">Language</h3>
                  <p className="text-xs text-white/50 mt-1 max-w-sm">
                    Set the preferred language for guides and documentation interfaces where supported.
                  </p>
                </div>
                <select 
                  value={settings.language || 'EN'} 
                  onChange={(e) => updateSettings({ language: e.target.value as 'EN' | 'ES' })}
                  className="bg-black border border-white/20 rounded px-3 py-1.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="EN">English</option>
                  <option value="ES">Español</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-[#111] border border-white/10 p-6 rounded-md">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              Graph View Configuration
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-start border-t border-white/5 pt-4">
                <div>
                  <h3 className="font-medium text-sm">Selection Focus Depth</h3>
                  <p className="text-xs text-white/50 mt-1 max-w-sm">
                    How many levels of relationships to highlight when an artifact is selected in the Graph.
                  </p>
                </div>
                <select 
                  value={settings.graphFocusDepth} 
                  onChange={handleGraphFocusChange}
                  className="bg-black border border-white/20 rounded px-3 py-1.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value={1}>1 Level (Direct)</option>
                  <option value={2}>2 Levels</option>
                  <option value={3}>3 Levels</option>
                  <option value={0}>Infinite (All Connected)</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-[#111] border border-white/10 p-6 rounded-md">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              Documentation View Configuration
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-start border-t border-white/5 pt-4">
                <div>
                  <h3 className="font-medium text-sm">Default Focus Mode</h3>
                  <p className="text-xs text-white/50 mt-1 max-w-sm">
                    Whether the impact focus filter should be ON or OFF by default when opening Documentation view.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    value="" 
                    className="sr-only peer" 
                    checked={settings.defaultDocsFocusMode}
                    onChange={(e) => updateSettings({ defaultDocsFocusMode: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500/50"></div>
                </label>
              </div>

              <div className="flex justify-between items-start border-t border-white/5 pt-4">
                <div>
                  <h3 className="font-medium text-sm">Documentation Focus Depth</h3>
                  <p className="text-xs text-white/50 mt-1 max-w-sm">
                    How many levels of relationships to include in the documentation when Focus Mode is ON.
                  </p>
                </div>
                <select 
                  value={settings.docsFocusDepth} 
                  onChange={handleDocsFocusChange}
                  className="bg-black border border-white/20 rounded px-3 py-1.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value={1}>1 Level (Direct Dependencies)</option>
                  <option value={2}>2 Levels</option>
                  <option value={3}>3 Levels</option>
                  <option value={0}>Infinite (Full Impact Graph)</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
