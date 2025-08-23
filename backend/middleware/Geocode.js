// utils/geocoding.js
const axios = require('axios');

async function geocoding(address) {
  if (!address) return null;
  console.log(address);
  try {
    const url = 'https://nominatim.openstreetmap.org/search';
    const res = await axios.get(url, {
      params: {
        q: address,
        format: 'json',
        limit: 1
      },
      headers: {
        // Obligatoire selon la politique de Nominatim : identifie ton app
        'User-Agent': 'NdakoApp/1.0 (contact@tondomaine.com)'
      },
    
    });

    const data = res.data;
    if (Array.isArray(data) && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        return { lat, lon };
      }
    }
    return null;
  } catch (err) {
    console.error('Erreur geocoding:', err.message || err);
    return null;
  }
}

module.exports = geocoding;
