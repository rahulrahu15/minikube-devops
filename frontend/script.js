// script.js

// Use Ingress hostname for frontend-backend communication
const API_URL = "http://weather.local/weather";

let chart;

// Retry-enabled function to fetch weather
async function getWeather(retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            // Update HTML elements
            document.getElementById("temp").innerText = data.temperature + " °C";
            document.getElementById("humidity").innerText = data.humidity + " %";
            document.getElementById("wind").innerText = data.wind_speed + " m/s";

            // Update chart
            updateChart(data);
            return; // success, exit the function
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            // Wait 2 seconds before retrying
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    // If all retries fail, show placeholders
    document.getElementById("temp").innerText = "-- °C";
    document.getElementById("humidity").innerText = "-- %";
    document.getElementById("wind").innerText = "-- m/s";
}

// Function to update chart
function updateChart(data) {
    const ctx = document.getElementById('weatherChart');
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Temperature", "Humidity", "Wind Speed"],
            datasets: [{
                label: "Weather Stats",
                data: [data.temperature, data.humidity, data.wind_speed],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Auto-load weather when page opens and refresh every 1 min
window.onload = () => {
    getWeather();
    setInterval(getWeather, 60000); // refresh every 60 seconds
};
