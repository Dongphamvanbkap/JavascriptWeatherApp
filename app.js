window.addEventListener('load', () =>{
	let long;
	let lat;
	let temperatureDescription = document.querySelector('.temperature-description');
	let temperatureDegree = document.querySelector('.temperature-degree');
	let locationTimezone = document.querySelector('.location-timezone');

	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(position => {
			long = position.coords.longitude;
			lat = position.coords.latitude;
			// console.log(position);

			const froxy = 'https://cors-anywhere.herokuapp.com/'
			const api = froxy + 'https://api.darksky.net/forecast/bbcfd43d4d675a386e198a5c65affa3e/' + lat + ',' + long;

			fetch(api).then(response => {
				return response.json()
			}).then(data => {
				
				const {temperature, summary, icon, time} = data.currently;
				const currentDay = getDate(time);
				console.log(data);
				temperatureDegree.textContent = ((temperature -32)/1.8).toFixed(2);
				temperatureDescription.textContent = summary;
				locationTimezone.textContent = data.timezone;
				setIcons(icon, document.querySelector('.icon'));

				const nextDays = data.daily.data;
				console.log(nextDays);
				const forecast = document.querySelector('.forecast');

				nextDays.forEach(function(nextDay) {
					const day = getDate(nextDay.time);
					const icon = nextDay.icon;
					const temperatureLow = ((nextDay.temperatureLow -32)/1.8).toFixed(0);
					const temperatureHigh = ((nextDay.temperatureHigh -32)/1.8).toFixed(0);

					const forecastSection = document.createElement('div');
					forecastSection.classList.add('forecast-section');

					const forecastIcon = document.createElement('canvas');
					forecastIcon.classList.add('forecast-icon');
					setIcons(icon, forecastIcon);

					const forecastTemperature = document.createElement('h3');
					forecastTemperature.classList.add('forecast-temperature');
					forecastTemperature.textContent = temperatureLow + ' ~ ' + temperatureHigh + ' C';

					const forecastDay = document.createElement('h5');
					forecastDay.classList.add('forecast-day');
					forecastDay.textContent = day;

					forecastSection.appendChild(forecastIcon);
					forecastSection.appendChild(forecastTemperature);
					forecastSection.appendChild(forecastDay);

					forecast.appendChild(forecastSection);
				})				
			})
		});
	}

	function setIcons(icon, iconID) {
		const skycons = new Skycons({color: 'white'});
		const currentIcon = icon.replace(/-/g, '_').toUpperCase();
		skycons.play();
		return skycons.set(iconID, Skycons[currentIcon])
	}

	function getDate(time) {
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const day = new Date(time * 1000);
		const month = day.getMonth() + 1;
		return days[day.getDay()] + ', ' + day.getDate() + '/' + month + '/' + day.getFullYear();
	}
});