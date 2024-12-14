// Replace with your own access token and ad account ID
const ACCESS_TOKEN = 'your-access-token'; // WARNING: Exposing this in production is unsafe
const AD_ACCOUNT_ID = 'act_<your-ad-account-id>'; // Your Ad Account ID
const API_URL = `https://graph.facebook.com/v16.0/${AD_ACCOUNT_ID}/insights`;

// Fetch data from Meta API
function fetchMetaData() {
  const params = new URLSearchParams({
    fields: 'spend,impressions,clicks',
    date_preset: 'last_30d',
    access_token: ACCESS_TOKEN,
  });

  fetch(`${API_URL}?${params.toString()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data from Meta API');
      }
      return response.json();
    })
    .then(data => {
      const metrics = data.data[0]; // Assuming single result for simplicity
      if (metrics) {
        document.getElementById('adSpend').textContent = `$${parseFloat(metrics.spend).toFixed(2)}`;
        document.getElementById('clicks').textContent = metrics.clicks;
        document.getElementById('impressions').textContent = metrics.impressions.toLocaleString();
      } else {
        console.error('No metrics available');
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Initial Fetch
fetchMetaData();
