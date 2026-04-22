// On enlève la clé API car Open-Meteo est gratuit et n'en a pas besoin [cite: 23]

// Récupération des éléments 
let txtTemp = document.querySelector('#temp'); 
let txtHumide = document.querySelector('#humide');
let txtVent = document.querySelector('#vent');
let txtVille = document.querySelector('#ville'); // Pour afficher "Rennes"

// Variables pour stocker la config
let LAT, LON;

// 1. Faire configuration
var configRequest = new XMLHttpRequest();
configRequest.open('GET', './config.json');
configRequest.responseType = 'json';
configRequest.send();

configRequest.onload = function () {
    let config = configRequest.response;
    LAT = config.lat;
    LON = config.lon;
    if (txtVille) txtVille.textContent = config.ville;

    // Afficher la méteo
    afficherMeteo();

    // 2. RAFRAÎCHISSEMENT TOUTES LES HEURES [cite: 40, 53]
    setInterval(afficherMeteo, 3600000);
};

// Ta fonction 'afficherMeteo' adaptée
function afficherMeteo() {

    // Récuperer les valeurs via Open-Meteo 
    var resquest = new XMLHttpRequest();
    // On utilise LAT et LON du JSON dans l'URL [cite: 51]
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

    resquest.open('GET', url);
    resquest.responseType = 'json'; // On demande directement du JSON

    resquest.onload = function () {
        let meteo = resquest.response;

        // On extrait les informations selon le format Open-Meteo [cite: 35, 36]
        let temperature = meteo.current.temperature_2m;
        let humidite = meteo.current.relative_humidity_2m;
        let vent = meteo.current.wind_speed_10m;
        let codeMeteo = meteo.current.weather_code;

        // On écrit les valeurs sur la page [cite: 52]
        txtTemp.textContent = temperature + "°C";
        txtHumide.textContent = humidite + "%";
        txtVent.textContent = vent + " km/h";

        // Icône
        document.getElementById("weather-icon").innerHTML = getIcon(codeMeteo);
    }

    // Afficher les icones par rapport au temps
    function getIcon(weather) {
        // 0 = Clear, 1-3 = Clouds, 61+ = Rain, 71+ = Snow
        if (weather === 0) {
            return "<i class='fas fa-sun'></i>";
        } else if (weather >= 1 && weather <= 3) {
            return "<i class='fas fa-cloud'></i>";
        } else if (weather >= 61 && weather <= 67) {
            return "<i class='fas fa-cloud-rain'></i>";
        } else if (weather >= 71 && weather <= 77) {
            let imgsnow = document.querySelector('.containerimg');
            if (imgsnow) imgsnow.classList.add('imgsnow');
            return "<i class='fas fa-snowflake'></i>";
        } else {
            return "<i class='fas fa-question'></i>";
        }
    }

    resquest.send();
}