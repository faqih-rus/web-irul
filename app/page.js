'use client';
import { useState, useEffect } from 'react';
import { database } from './config/firebase';
import { ref, onValue } from 'firebase/database';

export default function Home() {
  const [healthData, setHealthData] = useState({
    ekg: 0,
    sp02: 0,
    suhu: 0
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    // Listen to real-time data from Firebase
    const ekgRef = ref(database, 'ekg');
    const sp02Ref = ref(database, 'sp02');
    const suhuRef = ref(database, 'suhu');

    const unsubscribeEkg = onValue(ekgRef, (snapshot) => {
      const data = snapshot.val();
      setHealthData(prev => ({ ...prev, ekg: data || 0 }));
      setLastUpdate(new Date());
      setConnectionStatus('Connected');
    });

    const unsubscribeSp02 = onValue(sp02Ref, (snapshot) => {
      const data = snapshot.val();
      setHealthData(prev => ({ ...prev, sp02: data || 0 }));
      setLastUpdate(new Date());
      setConnectionStatus('Connected');
    });

    const unsubscribeSuhu = onValue(suhuRef, (snapshot) => {
      const data = snapshot.val();
      setHealthData(prev => ({ ...prev, suhu: data || 0 }));
      setLastUpdate(new Date());
      setConnectionStatus('Connected');
    });

    // Cleanup function
    return () => {
      unsubscribeEkg();
      unsubscribeSp02();
      unsubscribeSuhu();
    };
  }, []);

  const getHealthStatus = (type, value) => {
    switch (type) {
      case 'ekg':
        if (value >= 60 && value <= 100) return { status: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
        return { status: 'Perlu Perhatian', color: 'text-red-600', bg: 'bg-red-100' };
      case 'sp02':
        if (value >= 95) return { status: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
        return { status: 'Rendah', color: 'text-red-600', bg: 'bg-red-100' };
      case 'suhu':
        if (value >= 36 && value <= 37.5) return { status: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
        return { status: 'Abnormal', color: 'text-red-600', bg: 'bg-red-100' };
      default:
        return { status: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">❤️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Health Monitor</h1>
                <p className="text-blue-200 text-sm">Real-time Patient Monitoring System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${connectionStatus === 'Connected' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              <span className="text-white text-sm">{connectionStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* EKG Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Heart Rate</h3>
                  <p className="text-sm text-gray-500">EKG Monitoring</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-800 mb-2">{healthData.ekg}</p>
              <p className="text-gray-600 mb-3">BPM</p>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getHealthStatus('ekg', healthData.ekg).bg} ${getHealthStatus('ekg', healthData.ekg).color}`}>
                {getHealthStatus('ekg', healthData.ekg).status}
              </div>
            </div>
            {/* EKG Wave Animation */}
            <div className="mt-4 h-16 flex items-center justify-center">
              <svg className="w-full h-8" viewBox="0 0 200 40" fill="none">
                <path 
                  d="M0 20 L40 20 L45 10 L50 30 L55 20 L200 20" 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                  fill="none"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>

          {/* SpO2 Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🫁</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Oxygen Level</h3>
                  <p className="text-sm text-gray-500">SpO2 Saturation</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-800 mb-2">{healthData.sp02}</p>
              <p className="text-gray-600 mb-3">%</p>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getHealthStatus('sp02', healthData.sp02).bg} ${getHealthStatus('sp02', healthData.sp02).color}`}>
                {getHealthStatus('sp02', healthData.sp02).status}
              </div>
            </div>
            {/* Oxygen Level Indicator */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${healthData.sp02}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Temperature Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌡️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Temperature</h3>
                  <p className="text-sm text-gray-500">Body Heat</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-800 mb-2">{healthData.suhu}</p>
              <p className="text-gray-600 mb-3">°C</p>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getHealthStatus('suhu', healthData.suhu).bg} ${getHealthStatus('suhu', healthData.suhu).color}`}>
                {getHealthStatus('suhu', healthData.suhu).status}
              </div>
            </div>
            {/* Temperature Gauge */}
            <div className="mt-4 flex justify-center">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
                <div className={`absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-orange-500 transform transition-transform duration-500`}
                     style={{ transform: `rotate(${((healthData.suhu - 35) / 5) * 180}deg)` }}>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Panel */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Monitoring Details</h2>
            <div className="text-sm text-gray-500">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Chart Area */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Real-time Data Stream</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">EKG Reading</span>
                  <span className="text-xl font-bold text-red-600">{healthData.ekg} BPM</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">SpO2 Level</span>
                  <span className="text-xl font-bold text-blue-600">{healthData.sp02}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">Temperature</span>
                  <span className="text-xl font-bold text-orange-600">{healthData.suhu}°C</span>
                </div>
              </div>
            </div>

            {/* Health Alerts */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Status</h3>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg border-l-4 ${healthData.ekg >= 60 && healthData.ekg <= 100 ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                  <p className="font-medium text-gray-800">Heart Rate</p>
                  <p className="text-sm text-gray-600">Normal range: 60-100 BPM</p>
                </div>
                <div className={`p-3 rounded-lg border-l-4 ${healthData.sp02 >= 95 ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                  <p className="font-medium text-gray-800">Oxygen Saturation</p>
                  <p className="text-sm text-gray-600">Normal range: ≥95%</p>
                </div>
                <div className={`p-3 rounded-lg border-l-4 ${healthData.suhu >= 36 && healthData.suhu <= 37.5 ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                  <p className="font-medium text-gray-800">Body Temperature</p>
                  <p className="text-sm text-gray-600">Normal range: 36-37.5°C</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-white/70 text-sm">
            🔄 Data updates automatically from Firebase Realtime Database
          </p>
          <p className="text-white/50 text-xs mt-1">
            Monitoring variables: ekg, sp02, suhu
          </p>
        </div>
      </div>
    </div>
  );
}
