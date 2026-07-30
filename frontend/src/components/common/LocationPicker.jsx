import React, { useState } from 'react';
import { MapPin, Navigation, Check } from 'lucide-react';
import { useToast } from './Toast';

const LocationPicker = ({ location, setLocation, setLatitude, setLongitude }) => {
  const [loadingGeo, setLoadingGeo] = useState(false);
  const { showSuccess, showError } = useToast();

  const presets = [
    { name: 'City Central Station, MG Road', lat: 12.971598, lng: 77.594562 },
    { name: 'Sector 4 Community Park & Hall', lat: 12.972210, lng: 77.593100 },
    { name: 'West End Market Gate 1', lat: 12.975000, lng: 77.591000 },
    { name: 'Riverview Residential Colony', lat: 12.980000, lng: 77.589000 },
    { name: 'Oakwood Street Block B', lat: 12.968000, lng: 77.598000 }
  ];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showError("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        const geoText = `GPS: (${lat.toFixed(4)}, ${lng.toFixed(4)}) - Near Current Position`;
        setLocation(geoText);
        setLoadingGeo(false);
        showSuccess("Current GPS location acquired!");
      },
      (error) => {
        console.error("GPS location error", error);
        setLoadingGeo(false);
        // Fallback to preset
        const defaultLoc = presets[0];
        setLocation(defaultLoc.name);
        setLatitude(defaultLoc.lat);
        setLongitude(defaultLoc.lng);
        showSuccess("Set to Central Metro landmark location.");
      }
    );
  };

  const selectPreset = (preset) => {
    setLocation(preset.name);
    setLatitude(preset.lat);
    setLongitude(preset.lng);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={location || ''}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter landmark or street location..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loadingGeo}
          className="px-3.5 py-2.5 bg-brand-50 dark:bg-brand-950/50 hover:bg-brand-100 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors flex-shrink-0"
        >
          <Navigation className={`w-4 h-4 ${loadingGeo ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Use GPS</span>
        </button>
      </div>

      <div className="bg-slate-100/70 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Popular Municipal Landmarks:</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectPreset(item)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                location === item.name
                  ? 'bg-brand-600 text-white border-brand-600 font-medium'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400'
              }`}
            >
              {location === item.name && <Check className="w-3 h-3" />}
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
