import { useId, useState } from 'react';
import * as api from '../../api';
import { useApp } from '../../contexts/AppContext';

const AdminSettings = () => {
  const { statsAnimationEnabled, setStatsAnimationEnabled, statsSessions, statsSatisfaction, statsClients, statsTemp, setStatsSessions, setStatsSatisfaction, setStatsClients, setStatsTemp } = useApp();

  // Generate unique IDs for accessibility
  const sessionsId = useId();
  const satisfactionId = useId();
  const clientsId = useId();
  const tempId = useId();

  // Local state for editing
  const [editMode, setEditMode] = useState(false);
  const [tempStats, setTempStats] = useState({
    sessions: statsSessions,
    satisfaction: statsSatisfaction,
    clients: statsClients,
    temp: statsTemp,
  });

  const handleAnimationToggle = (enabled) => {
    setStatsAnimationEnabled(enabled);
  };

  const handleEditStats = () => {
    setTempStats({
      sessions: statsSessions,
      satisfaction: statsSatisfaction,
      clients: statsClients,
      temp: statsTemp,
    });
    setEditMode(true);
  };

  const handleSaveStats = async () => {
    // Validate inputs
    if (tempStats.sessions < 0 || tempStats.satisfaction < 0 || tempStats.satisfaction > 100 || tempStats.clients < 0 || tempStats.temp < -50 || tempStats.temp > 50) {
      alert('Please enter valid values (Sessions/Clients ≥ 0, Satisfaction 0-100%, Temperature -50°C to 50°C)');
      return;
    }

    try {
      await api.updateSiteStats({
        totalSessions: tempStats.sessions,
        satisfactionRate: tempStats.satisfaction,
        totalClients: tempStats.clients,
        averageTemp: tempStats.temp,
      });

      // Update the stats in context
      setStatsSessions(tempStats.sessions);
      setStatsSatisfaction(tempStats.satisfaction);
      setStatsClients(tempStats.clients);
      setStatsTemp(tempStats.temp);

      // Save to localStorage as backup
      localStorage.setItem('manualStats', JSON.stringify(tempStats));

      setEditMode(false);
      alert('✅ Statistics updated successfully!');
    } catch (error) {
      console.error('Failed to update site stats:', error);
      alert(error.message || 'Failed to update statistics. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setTempStats({
      sessions: statsSessions,
      satisfaction: statsSatisfaction,
      clients: statsClients,
      temp: statsTemp,
    });
    setEditMode(false);
  };

  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    setTempStats(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h4 className="text-2xl font-bold text-white mb-2">Site Settings</h4>
        <p className="text-blue-200">Configure site-wide options and preferences</p>
      </div>

      {/* Stats Animation Setting */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="text-xl font-semibold text-white mb-2">Stats Counter Animation</h5>
            <p className="text-blue-200 text-sm">
              Enable smooth rising animation from 0 to final values for the statistics counters
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${statsAnimationEnabled ? 'text-cyan-400' : 'text-blue-300'}`}>
              {statsAnimationEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              type="button"
              onClick={() => handleAnimationToggle(!statsAnimationEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                statsAnimationEnabled ? 'bg-cyan-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  statsAnimationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-black/20 p-4 rounded-xl border border-cyan-400/20">
          <p className="text-blue-200 text-sm mb-3">Preview:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="text-cyan-400 font-bold text-lg">
              {statsAnimationEnabled ? `${tempStats.sessions}+` : `${statsSessions}+`}
            </div>
            <div className="text-cyan-400 font-bold text-lg">
              {statsAnimationEnabled ? `${tempStats.satisfaction}%` : `${statsSatisfaction}%`}
            </div>
            <div className="text-cyan-400 font-bold text-lg">
              {statsAnimationEnabled ? `${tempStats.clients}+` : `${statsClients}+`}
            </div>
            <div className="text-cyan-400 font-bold text-lg">
              {statsAnimationEnabled ? `${tempStats.temp.toFixed(1)}°C` : `${statsTemp.toFixed(1)}°C`}
            </div>
          </div>
          <p className="text-cyan-300 text-xs mt-2">
            {statsAnimationEnabled
              ? 'Numbers will animate smoothly from 0 to final values'
              : 'Numbers will display final values immediately'
            }
          </p>
        </div>
      </div>

      {/* Stats Values Setting */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="text-xl font-semibold text-white mb-2">Statistics Values</h5>
            <p className="text-blue-200 text-sm">
              Manually set the values displayed in the statistics counters
            </p>
          </div>
          {!editMode && (
            <button
              type="button"
              onClick={handleEditStats}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full hover:bg-cyan-500/30 transition-colors duration-300"
            >
              ✏️ Edit Values
            </button>
          )}
        </div>

        {editMode ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={sessionsId} className="block text-white text-sm font-medium mb-2">
                  Sessions Completed
                </label>
                <input
                  id={sessionsId}
                  type="number"
                  min="0"
                  value={tempStats.sessions}
                  onChange={(e) => handleInputChange('sessions', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label htmlFor={satisfactionId} className="block text-white text-sm font-medium mb-2">
                  Satisfaction Rate (%)
                </label>
                <input
                  id={satisfactionId}
                  type="number"
                  min="0"
                  max="100"
                  value={tempStats.satisfaction}
                  onChange={(e) => handleInputChange('satisfaction', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label htmlFor={clientsId} className="block text-white text-sm font-medium mb-2">
                  Happy Clients
                </label>
                <input
                  id={clientsId}
                  type="number"
                  min="0"
                  value={tempStats.clients}
                  onChange={(e) => handleInputChange('clients', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label htmlFor={tempId} className="block text-white text-sm font-medium mb-2">
                  Average Temperature (°C)
                </label>
                <input
                  id={tempId}
                  type="number"
                  step="0.1"
                  min="-50"
                  max="50"
                  value={tempStats.temp}
                  onChange={(e) => handleInputChange('temp', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveStats}
                className="flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
              >
                💾 Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-black/20 p-3 rounded-lg border border-cyan-400/20">
              <div className="text-cyan-400 font-bold text-lg">{statsSessions}+</div>
              <div className="text-blue-200 text-sm">Sessions</div>
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-cyan-400/20">
              <div className="text-cyan-400 font-bold text-lg">{statsSatisfaction}%</div>
              <div className="text-blue-200 text-sm">Satisfaction</div>
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-cyan-400/20">
              <div className="text-cyan-400 font-bold text-lg">{statsClients}+</div>
              <div className="text-blue-200 text-sm">Clients</div>
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-cyan-400/20">
              <div className="text-cyan-400 font-bold text-lg">{statsTemp.toFixed(1)}°C</div>
              <div className="text-blue-200 text-sm">Temperature</div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Settings Placeholder */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/20">
        <h5 className="text-lg font-semibold text-white mb-2">Additional Settings</h5>
        <p className="text-blue-200 text-sm">More site settings will be available here in future updates.</p>
      </div>
    </div>
  );
};

export default AdminSettings;
