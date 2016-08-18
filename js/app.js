var app = angular.module('app', []);

app.controller('weatherCtrl', function($scope, $http) {



	$scope.forecast =[];

//scope.finalLocation = 'New York';


	$scope.search = function(input) {
		showIcon();
		$scope.finalLocation = input;

		getWeather();


	};



	function getWeather() {





		var query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + $scope.finalLocation + "')";
		var format = '&format=json';


		$http({
			method: 'GET',
			url: 'https://query.yahooapis.com/v1/public/yql?q=' + query + format
		}).then(function(response) {

			if (response.data.query.count === 0) {
				alert('location not Found');
			} else {


				var temp = response.data.query.results.channel.item.condition.temp;
				var desc = response.data.query.results.channel.item.condition.text;
				var locationCity = response.data.query.results.channel.location.city;
				var locationRegion = response.data.query.results.channel.location.region;
				var locationCountry = response.data.query.results.channel.location.country;


				$scope.forecast = [];

				for (var i = 0; i < response.data.query.results.channel.item.forecast.length; i++) {
					var forecast = {
						day: response.data.query.results.channel.item.forecast[i].day,
						high: response.data.query.results.channel.item.forecast[i].high,
						low: response.data.query.results.channel.item.forecast[i].low,
						desc: response.data.query.results.channel.item.forecast[i].text,
						code: response.data.query.results.channel.item.forecast[i].code,
						icon: "" 

					};

					$scope.forecast.push(forecast);


				}

				$scope.currTemp = temp;
				$scope.currDesc = desc;
				$scope.currCity = locationCity;
				$scope.currRegion = locationRegion;
				$scope.currCountry = locationCountry;
				$scope.sunrise = response.data.query.results.channel.astronomy.sunrise;
				$scope.sunset = response.data.query.results.channel.astronomy.sunset;
				$scope.humidity = response.data.query.results.channel.atmosphere.humidity;
				$scope.currCondition = response.data.query.results.channel.item.condition.code;
			
			}
			
			console.log(response.data.query);
			
			setIcons();

			hideIcon();
			
		});


	};

	function getConditions() {
		$http.get('json/condition.json').success(function(response) {
			$scope.condition = response.data;
			console.log($scope.condition);
		});
	};

	function setIcons() {
		if ($scope.currCondition != 48) {
				$scope.currIcon = $scope.condition[$scope.currCondition].icons;
				
		}

		for (var i = 0; i < $scope.forecast.length; i++) {
			$scope.forecast[i].icon = $scope.condition[$scope.forecast[i].code].icons;
		}

		console.log($scope.forecast);
	};

	function hideIcon() {
		document.getElementById('load').style.display  = 'none';
		document.getElementById('weatherApp').style.display = 'inline';
		
	};

	function showIcon() {
		document.getElementById('load').style.display  = 'inline';
		document.getElementById('weatherApp').style.display = 'none';
	};

	function getLocation() {
		$http({
			method: 'GET',
			url: 'https://freegeoip.net/json/?q'
		}).then(function(response) {
			var city = "";
			var region = "";
			if (!(response.data.city === undefined)) {
				city = response.data.city;
			}

			if (!(response.data.region_code === undefined)) {
				region = response.data.region_code;
			}

			$scope.finalLocation = city + ', ' + region;
			getWeather();
		});
	};

	
	getConditions();
	getLocation();
	
	

});











