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
  const [historyData, setHistoryData] = useState({
    ekg: Array(20).fill(0),
    sp02: Array(20).fill(0),
    suhu: Array(20).fill(0),
    timestamps: Array(20).fill('')
  });

  useEffect(() => {
    // Listen to real-time data from Firebase
    const ekgRef = ref(database, 'ekg');
    const sp02Ref = ref(database, 'sp02');
    const suhuRef = ref(database, 'suhu');

    const unsubscribeEkg = onValue(ekgRef, (snapshot) => {
      const data = snapshot.val();
      setHealthData(prev => ({ ...prev, ekg: data || 0 }));
      updateHistory('ekg', data || 0);
      setLastUpdate(new Date());
      setConnectionStatus('Connected');
    });

    const unsubscribeSp02 = onValue(sp02Ref, (snapshot) => {
      const data = snapshot.val();
      setHealthData(prev => ({ ...prev, sp02: data || 0 }));
      updateHistory('sp02', data || 0);
      setLastUpdate(new Date());
      setConnectionStatus('Connected');
    });

    const unsubscribeSuhu = onValue(suhuRef, (snapshot) => {
      const data = snapshot.val();
      setHealthData(prev => ({ ...prev, suhu: data || 0 }));
      updateHistory('suhu', data || 0);
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

  const updateHistory = (type, value) => {
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    setHistoryData(prev => ({
      ...prev,
      [type]: [...prev[type].slice(1), value],
      timestamps: [...prev.timestamps.slice(1), currentTime]
    }));
  };

  const getHealthStatus = (type, value) => {
    switch (type) {
      case 'ekg':
        if (value >= 60 && value <= 100) return { status: 'Normal', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
        return { status: 'Abnormal', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
      case 'sp02':
        if (value >= 95) return { status: 'Normal', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
        return { status: 'Low', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
      case 'suhu':
        if (value >= 36 && value <= 37.5) return { status: 'Normal', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
        return { status: 'Abnormal', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
      default:
        return { status: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  const generateEKGPath = () => {
    const baseY = 50;
    const amplitude = 30;
    const frequency = 0.1;
    const heartRate = healthData.ekg || 75;
    
    let path = `M 0 ${baseY}`;
    for (let x = 0; x <= 400; x += 2) {
      const normalWave = Math.sin(x * frequency) * 5;
      const heartBeat = x % (400 / (heartRate / 60 * 2)) < 10 ? 
        Math.sin(x * 0.5) * amplitude : 0;
      const y = baseY + normalWave + heartBeat;
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Patient Monitoring System</h1>
                <p className="text-sm text-gray-600">Real-time Vital Signs Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                <div className={`w-2 h-2 rounded-full ${connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">{connectionStatus}</span>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Patient Info Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Patient ID: P001</h2>
              <p className="text-sm text-gray-600">Monitoring Session Active</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Session Started</p>
              <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Vital Signs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Heart Rate Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Heart Rate</h3>
                  <p className="text-sm text-gray-500">ECG Monitor</p>
                </div>
              </div>
            </div>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-gray-900 mb-1">{healthData.ekg}</p>
              <p className="text-sm text-gray-600 mb-3">beats per minute</p>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getHealthStatus('ekg', healthData.ekg).bg} ${getHealthStatus('ekg', healthData.ekg).color} ${getHealthStatus('ekg', healthData.ekg).border}`}>
                {getHealthStatus('ekg', healthData.ekg).status}
              </div>
            </div>
            {/* ECG Waveform */}
            <div className="h-16 bg-gray-50 rounded border flex items-center justify-center">
              <svg className="w-full h-10" viewBox="0 0 200 40" fill="none">
                <path 
                  d="M0 20 L60 20 L65 8 L70 32 L75 20 L200 20" 
                  stroke="#dc2626" 
                  strokeWidth="2" 
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Oxygen Saturation Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Oxygen Saturation</h3>
                  <p className="text-sm text-gray-500">SpO₂ Level</p>
                </div>
              </div>
            </div>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-gray-900 mb-1">{healthData.sp02}</p>
              <p className="text-sm text-gray-600 mb-3">percent</p>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getHealthStatus('sp02', healthData.sp02).bg} ${getHealthStatus('sp02', healthData.sp02).color} ${getHealthStatus('sp02', healthData.sp02).border}`}>
                {getHealthStatus('sp02', healthData.sp02).status}
              </div>
            </div>
            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${healthData.sp02}%` }}
              ></div>
            </div>
          </div>

          {/* Temperature Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Body Temperature</h3>
                  <p className="text-sm text-gray-500">Core Temperature</p>
                </div>
              </div>
            </div>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-gray-900 mb-1">{healthData.suhu}</p>
              <p className="text-sm text-gray-600 mb-3">degrees celsius</p>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getHealthStatus('suhu', healthData.suhu).bg} ${getHealthStatus('suhu', healthData.suhu).color} ${getHealthStatus('suhu', healthData.suhu).border}`}>
                {getHealthStatus('suhu', healthData.suhu).status}
              </div>
            </div>
            {/* Temperature Scale */}
            <div className="flex justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-orange-500" 
                     style={{ 
                       clipPath: `inset(0 ${100 - ((healthData.suhu - 35) / 5) * 100}% 0 0)`,
                       transform: 'rotate(-90deg)'
                     }}>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart and EKG Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend History Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs Trend (Last 20 Readings)</h3>
            
            {/* Chart Legend */}
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Heart Rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">SpO₂</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Temperature</span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-64 bg-gray-50 rounded-lg border p-4">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Grid Lines */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Y-axis labels */}
                <text x="5" y="20" className="text-xs fill-gray-500">100</text>
                <text x="5" y="60" className="text-xs fill-gray-500">50</text>
                <text x="5" y="100" className="text-xs fill-gray-500">25</text>
                <text x="5" y="140" className="text-xs fill-gray-500">10</text>
                <text x="5" y="180" className="text-xs fill-gray-500">0</text>

                {/* Heart Rate Line (scaled 0-200 -> 0-200) */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  points={historyData.ekg.map((value, index) => 
                    `${20 + (index * 18)},${180 - (value * 0.9)}`
                  ).join(' ')}
                />

                {/* SpO2 Line (scaled 0-100 -> 0-200) */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points={historyData.sp02.map((value, index) => 
                    `${20 + (index * 18)},${180 - (value * 1.8)}`
                  ).join(' ')}
                />

                {/* Temperature Line (scaled 35-40 -> 0-200) */}
                <polyline
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  points={historyData.suhu.map((value, index) => 
                    `${20 + (index * 18)},${180 - ((value - 35) * 40)}`
                  ).join(' ')}
                />

                {/* Data Points */}
                {historyData.ekg.map((value, index) => (
                  <circle
                    key={`ekg-${index}`}
                    cx={20 + (index * 18)}
                    cy={180 - (value * 0.9)}
                    r="2"
                    fill="#ef4444"
                  />
                ))}
              </svg>
              
              {/* Time Labels */}
              <div className="absolute bottom-1 left-4 right-4 flex justify-between text-xs text-gray-500">
                <span>{historyData.timestamps[0]}</span>
                <span>{historyData.timestamps[10]}</span>
                <span>{historyData.timestamps[19]}</span>
              </div>
            </div>

            {/* Current Values Summary */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Current HR</p>
                <p className="text-lg font-bold text-red-600">{healthData.ekg} BPM</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Current SpO₂</p>
                <p className="text-lg font-bold text-blue-600">{healthData.sp02}%</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Current Temp</p>
                <p className="text-lg font-bold text-orange-600">{healthData.suhu}°C</p>
              </div>
            </div>
          </div>

          {/* Real-time EKG Display */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Real-time ECG Waveform</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>

            {/* EKG Monitor Display */}
            <div className="bg-black rounded-lg p-4 mb-4">
              <svg className="w-full h-48" viewBox="0 0 400 100">
                {/* Grid pattern for EKG monitor */}
                <defs>
                  <pattern id="ekgGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#166534" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ekgGrid)" />
                
                {/* EKG Waveform */}
                <path
                  d={generateEKGPath()}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="animate-pulse"
                />
                
                {/* Sweep line animation */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100"
                  stroke="#22c55e"
                  strokeWidth="1"
                  opacity="0.7"
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="translate"
                    values="0,0;400,0;0,0"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </line>
              </svg>
            </div>

            {/* EKG Parameters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Heart Rate</span>
                  <span className="text-xl font-bold text-gray-900">{healthData.ekg}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">BPM</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    healthData.ekg >= 60 && healthData.ekg <= 100 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {healthData.ekg >= 60 && healthData.ekg <= 100 ? 'Normal' : 'Alert'}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rhythm</span>
                  <span className="text-xl font-bold text-gray-900">SR</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Sinus Rhythm</span>
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                    Regular
                  </span>
                </div>
              </div>
            </div>

            {/* EKG Analysis */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">ECG Analysis</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <p>• Rhythm: {healthData.ekg >= 60 && healthData.ekg <= 100 ? 'Normal sinus rhythm' : 'Abnormal rhythm detected'}</p>
                <p>• Rate: {healthData.ekg} beats per minute</p>
                <p>• Status: {healthData.ekg >= 60 && healthData.ekg <= 100 ? 'Within normal limits' : 'Requires clinical attention'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              <p className="text-sm text-gray-600">Data connection and monitoring information</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Firebase Realtime Database</span>
              <span>•</span>
              <span>Auto-refresh: Active</span>
              <span>•</span>
              <span>Last sync: {lastUpdate.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
