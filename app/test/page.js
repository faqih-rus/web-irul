'use client';
import { useEffect, useState } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, set } from 'firebase/database';

export default function TestPage() {
  const [testData, setTestData] = useState({
    ekg: 'Loading...',
    sp02: 'Loading...',
    suhu: 'Loading...'
  });

  useEffect(() => {
    // Test reading data
    const ekgRef = ref(database, 'ekg');
    const sp02Ref = ref(database, 'sp02');
    const suhuRef = ref(database, 'suhu');

    onValue(ekgRef, (snapshot) => {
      const data = snapshot.val();
      setTestData(prev => ({ ...prev, ekg: data !== null ? data : 'No data' }));
    });

    onValue(sp02Ref, (snapshot) => {
      const data = snapshot.val();
      setTestData(prev => ({ ...prev, sp02: data !== null ? data : 'No data' }));
    });

    onValue(suhuRef, (snapshot) => {
      const data = snapshot.val();
      setTestData(prev => ({ ...prev, suhu: data !== null ? data : 'No data' }));
    });
  }, []);

  const writeTestData = () => {
    // Write test data to Firebase
    set(ref(database, 'ekg'), Math.floor(Math.random() * 40) + 60); // 60-100 BPM
    set(ref(database, 'sp02'), Math.floor(Math.random() * 6) + 95); // 95-100%
    set(ref(database, 'suhu'), (Math.random() * 2 + 36).toFixed(1)); // 36-38°C
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Firebase Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Data from Firebase:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-semibold">EKG</h3>
              <p className="text-2xl font-bold">{testData.ekg}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold">SpO2</h3>
              <p className="text-2xl font-bold">{testData.sp02}</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg">
              <h3 className="font-semibold">Suhu</h3>
              <p className="text-2xl font-bold">{testData.suhu}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls:</h2>
          <button 
            onClick={writeTestData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg mr-4"
          >
            Generate Random Test Data
          </button>
          <a 
            href="/"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg inline-block"
          >
            Go to Main App
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Firebase Configuration:</h2>
          <div className="text-sm text-gray-600">
            <p><strong>Database URL:</strong> https://tugas-akhir-85d6a-default-rtdb.firebaseio.com/</p>
            <p><strong>Variables being monitored:</strong> ekg, sp02, suhu</p>
            <p><strong>Status:</strong> {typeof testData.ekg === 'string' && testData.ekg.includes('Loading') ? 'Connecting...' : 'Connected ✅'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
