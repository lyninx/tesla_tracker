(function(){
	var app = angular.module('tesla',['ui.router', 'ngRoute']);

	app.config(function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
	  $routeProvider
      .when("/", {
        templateUrl: "main.html",
        controller: "MainCtrl"
      });

	  $locationProvider.html5Mode(true);
	});

//////////////////////////////////////////////////////////////////////////////////////
	app.controller('MainCtrl', function($rootScope, $scope, $routeParams, $http, $interval){

    var markers = [];
    update();
    $scope.lat = 43.7001100;
    $scope.long = -79.4163000;
    initMap();
    $interval(update, 500);
    if(localStorage.getItem("markers") != null){
      loadMarkers(localStorage.getItem("markers"));
    }

    function update(){
      $http({method: 'GET', isArray:true, url: '/api/'}).
        success(function(data, status, headers, config) {  
          $scope.speed = data.speed;
          $scope.lat = data.lat;
          $scope.long = data.long;
          $scope.state = data.state;
          if(data.state != null){
          $scope.addMarker($scope.lat, $scope.long);
          localStorage.setItem("markers", JSON.stringify(markers));
          }
      }).error(function(data, status, headers, config) {
        // page content not found
      });      
    }

    function loadMarkers(marks){
      JSON.parse(marks).forEach(function(marker){
        //console.log(marker);
        var location = {lat: marker.lat, lng: marker.lng };
        var marker = new google.maps.Marker({
          position: location,
          map: $scope.map
        });
      });
      markers = JSON.parse(marks);
    }
    $scope.addMarker = function(lat, long) {
      var location = {lat: lat, lng: long };
      var marker = new google.maps.Marker({
        position: location,
        map: $scope.map
      });
      markers.push(location);
    };

    $scope.honk = function() {
      $http({method: 'GET', isArray:true, url: '/api/honk'}).
        success(function(data, status, headers, config) {  
          console.log("honk!");
      }).error(function(data, status, headers, config) {
        // page content not found
      });  
    };
    $scope.blink = function(){
      $http({method: 'GET', isArray:true, url: '/api/blink'}).
        success(function(data, status, headers, config) {  
          console.log("blink!");
      }).error(function(data, status, headers, config) {
        // page content not found
      });  
    }

    $scope.clearMarkers = function(){
      console.log("cleared markers!");
      localStorage.clear();
      markers = [];
      location.reload();
    }
    function initMap() {
      var myLatLng = {lat: $scope.lat  , lng: $scope.long };

      // Create a map object and specify the DOM element for display.
      var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        scrollwheel: false,
        zoom: 12
      });

      $scope.map = map;
    }
  });
})()