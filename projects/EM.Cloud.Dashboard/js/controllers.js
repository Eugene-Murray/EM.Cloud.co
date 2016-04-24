


angular
    .module('em.cloud.dashboard')
    .filter('object2Array', function() {
	return function(input) {
		var out = [];
		for (i in input) {
			out.push(input[i]);
		}
		return out;
	}
	})
    .controller('MainCtrl', ['$scope', '$timeout', function($scope, $timeout){

    	var vm = this;

    	//vm.userName = 'Example user';
    	//vm.helloText = 'Gridster';
    	//vm.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

    	vm.gridsterOptions = {
			margins: [20, 20],
			columns: 4,
			draggable: {
				handle: 'h3'
			}
		};

	vm.dashboards = {
			'1': {
				id: '1',
				name: 'Home',
				widgets: [{
					col: 0,
					row: 0,
					sizeY: 1,
					sizeX: 1,
					name: "Widget 1"
				}, {
					col: 2,
					row: 1,
					sizeY: 1,
					sizeX: 1,
					name: "Widget 2"
				}]
			},
			'2': {
				id: '2',
				name: 'Other',
				widgets: [{
					col: 1,
					row: 1,
					sizeY: 1,
					sizeX: 2,
					name: "Other Widget 1"
				}, {
					col: 1,
					row: 3,
					sizeY: 1,
					sizeX: 1,
					name: "Other Widget 2"
				}]
			}
		};

		vm.clear = function() {
			vm.dashboard.widgets = [];
		};

		vm.addWidget = function() {
			vm.dashboard.widgets.push({
				name: "New Widget",
				sizeX: 1,
				sizeY: 1
			});
		};

		vm.changeDashboard = function(){
			console.warn(vm.selectedDashboardId);
		}

		// https://toddmotto.com/digging-into-angulars-controller-as-syntax/
		$scope.$watch(angular.bind(this, function () {
			return this.selectedDashboardId; // `this` IS the `this` above!!
		}), function (newVal, oldVal) {
			if (newVal !== oldVal) {
				vm.dashboard = vm.dashboards[newVal];
			} else {
				vm.dashboard = vm.dashboards[1];
			}
		});


		// init dashboard
		vm.selectedDashboardId = '1';

		console.warn(vm.selectedDashboardId);

		// D3



		var bardata = [];

		for (var i = 0; i < 30; i++) {
			bardata.push(Math.round(Math.random() * 30) + 20)
		}

		var height = 200,
			width = 300,
			barWidth = 50,
			barOffset = 5;

		var tempColor;

		var colors = d3.scale.linear()
			.domain([0, bardata.length * .33, bardata.length * .66, bardata.length])
			.range(['#B58929', '#C61C6F', '#268BD2', '#85992C'])

		var yScale = d3.scale.linear()
			.domain([0, d3.max(bardata)])
			.range([0, height]);

		var xScale = d3.scale.ordinal()
			.domain(d3.range(0, bardata.length))
			.rangeBands([0, width])

		var tooltip = d3.select('body').append('div')
			.style('position', 'absolute')
			.style('padding', '0 10px')
			.style('background', 'white')
			.style('opacity', 0)


		console.warn(d3.select('.chart'));

		var myChart = d3.select('.chart').append('svg')
			.attr('width', width)
			.attr('height', height)
			.selectAll('rect').data(bardata)
			.enter().append('rect')
			.style('fill', function (d, i) {
				return colors(i);
			})
			.attr('width', xScale.rangeBand())
			.attr('x', function (d, i) {
				return xScale(i);
			})
			.attr('height', 0)
			.attr('y', height)

			.on('mouseover', function (d) {

				tooltip.transition()
					.style('opacity', .9)

				tooltip.html(d)
					.style('left', (d3.event.pageX - 35) + 'px')
					.style('top', (d3.event.pageY - 30) + 'px')


				tempColor = this.style.fill;
				d3.select(this)
					.style('opacity', .5)
					.style('fill', 'yellow')
			})

			.on('mouseout', function (d) {
				d3.select(this)
					.style('opacity', 1)
					.style('fill', tempColor)
			})

		myChart.transition()
			.attr('height', function (d) {
				return yScale(d);
			})
			.attr('y', function (d) {
				return height - yScale(d);
			})
			.delay(function (d, i) {
				return i * 20;
			})
			.duration(1000)
			.ease('elastic');



    }])
	//.controller('CustomWidgetCtrl', ['$scope', '$modal',
		//function($scope, $modal) {
	.controller('CustomWidgetCtrl', ['$scope',
		function($scope) {

			$scope.remove = function(widget) {
				console.warn($scope.vm);

				$scope.vm.dashboard.widgets.splice($scope.vm.dashboard.widgets.indexOf(widget), 1);
			};

			$scope.openSettings = function(widget) {
				//$modal.open({
				//	scope: $scope,
				//	templateUrl: 'widget_settings.html',
				//	controller: 'WidgetSettingsCtrl',
				//	resolve: {
				//		widget: function() {
				//			return widget;
				//		}
				//	}
				//});
			};
			$scope.IsLoading = true;

		}
	])
	.controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget',
		function($scope, $timeout, $rootScope, $modalInstance, widget) {
			$scope.widget = widget;

			$scope.form = {
				name: widget.name,
				sizeX: widget.sizeX,
				sizeY: widget.sizeY,
				col: widget.col,
				row: widget.row
			};

			$scope.sizeOptions = [{
				id: '1',
				name: '1'
			}, {
				id: '2',
				name: '2'
			}, {
				id: '3',
				name: '3'
			}, {
				id: '4',
				name: '4'
			}];

			$scope.dismiss = function() {
				$modalInstance.dismiss();
			};

			$scope.remove = function() {
				$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
				$modalInstance.close();
			};

			$scope.submit = function() {
				angular.extend(widget, $scope.form);

				$modalInstance.close(widget);
			};

		}
	]);
