/**
 * 
 */

var dashboard = {
	action : {
		list : function() {
			var request = {
					method : "POST",
					url : "./user/dashboard",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					loading : {
						target : "mydashboard"
					},
					error : function(e){
						$.LoadingOverlay("hide");
					},
					handle : function(response) {
						
						var $setting = 0;
						var $total = 0;
						var $fail = 0;
						
						$.each(response.data.types, function(index, value) {
							$setting +=  1;
							$total += value.times;
							$fail += value.fail;
						});
						
//						$("#dashboard_setting").text(utils.formatNumber($setting));
						$("#dashboard_total").text(utils.formatNumber($total + $fail));
						$("#dashboard_success").text(utils.formatNumber($total));
						$("#dashboard_fail").text(utils.formatNumber($fail));
						
						dashboard.panel.mysetting(response.data);
						dashboard.panel.monthly(response.data.monthly);
//						dashboard.panel.mailStatusPie(response.data);
					}
				};

				utils.normalRequest(request);
		},
		openRate : function() {
			var request = {
					method : "POST",
					url : "./user/userMailOpenRate",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					loading : {
						target : "dashboard_setting"
					},
					error : function(e){
						$.LoadingOverlay("hide");
					},
					handle : function(response) {
						
						var $number = 0;
						$.each(response.data, function(index, value) {
							var $weekday = value.key;
							$number = $number + value.number;
						});
						
						$("#dashboard_setting").text(utils.formatNumber($number));
						
						dashboard.panel.mailOpenRate(response.data);
						
					}
				};

				utils.normalRequest(request);
		},
		openDateRate : function() {
			var request = {
					method : "POST",
					url : "./user/userMailOpenDateRate",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					loading : {
						target : "dashboard_setting"
					},
					error : function(e){
						$.LoadingOverlay("hide");
					},
					handle : function(response) {
						
						response.data['target']  = $('#chartjs-dashboard-open-bar');
						dashboard.panel.mailEventBar(response.data);
						
					}
				};

				utils.normalRequest(request);
		},
		tagOpenRate : function() {
			var request = {
					method : "POST",
					url : "./user/emailMarketingTagOpenStatistics",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					loading : {
						target : "dashboard_setting"
					},
					error : function(e){
						$.LoadingOverlay("hide");
					},
					handle : function(response) {
						
						console.log(response);
						
						dashboard.panel.tagOpenRate(response.data);
					}
				};

				utils.normalRequest(request);
		},
		tagClickRate : function() {
			var request = {
					method : "POST",
					url : "./user/emailMarketingTagClickStatistics",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					loading : {
						target : "dashboard_setting"
					},
					error : function(e){
						$.LoadingOverlay("hide");
					},
					handle : function(response) {
						
						console.log(response);
						
						dashboard.panel.tagClickRate(response.data);
						
					}
				};

				utils.normalRequest(request);
		}
	}, 
	panel : {
		
		mysetting : function (data){
			var $table = $("#mySettings");
			
			$table.html("");
			
			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("Name").appendTo($tr);
            $("<TH>").text("Type").addClass("d-none d-xl-table-cell").appendTo($tr);
            $("<TH>").text("Processing").appendTo($tr);
            $("<TH>").text("Total").appendTo($tr);
            $("<TH>").text("Success Rate").appendTo($tr);
			
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.types, function(index, value) {
				
				var $type = value.type;
				var $time = (value.times == undefined) ? 0 : value.times;
				var $fail = (value.fail == undefined) ? 0 : value.fail;
				var $queue = (value.queue == undefined) ? 0 : value.queue;
				
				if($type == 1){
					$type = '<i class="fas fa-1x fa-fw -square pull-right fa-at"></i>';
				} else if($type == 2){
					$type = '<i class="fab fa-1x fa-fw -square pull-right fa-telegram"></i>';
				}  else if($type == 3){
					$type = '<i class="fab fa-1x fa-fw -square pull-right fa-line"></i>';
				}
				
				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").html(value.sender).appendTo($tr);
				$("<TD>").addClass("d-none d-xl-table-cell").html($type).appendTo($tr);
				$("<TD>").html("<SPAN class='badge bg-warning'>" + utils.formatNumber($queue) + " </SPAN>").appendTo($tr);
				$("<TD>").html("<SPAN class='badge bg-info'>" + utils.formatNumber($time + $fail) + " </SPAN>").appendTo($tr);
				$total = ($time + $fail == 0) ? 1: $time + $fail;
				$("<TD>").html("<SPAN class='badge bg-success'>" + ($time / ($total) * 100).toFixed(0) + "% </SPAN>").appendTo($tr);
				
			});
			
		},
		monthly : function(obj){
			
			var $result = [];
			
			for(var $i=1; $i<13; $i++){
				var $exist = false;
				$.each(obj, function(index, value) {
					if($i == value.month ){
						$result.push(value.times);
						$exist = true;
					}
				});
				if(!$exist){
					$result.push(0);
				}
			}
			
			var $ctx = document.getElementById("chartjs-dashboard-line").getContext("2d");
			
			var gradient = $ctx.createLinearGradient(0, 0, 0, 225);
			gradient.addColorStop(0, "rgba(215, 227, 244, 1)");
			gradient.addColorStop(1, "rgba(215, 227, 244, 0)");
			// Line chart
			new Chart(document.getElementById("chartjs-dashboard-line"), {
				type : "line",
				data : {
					labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
						"Aug", "Sep", "Oct", "Nov", "Dec"],
				datasets: [{
					label: "Sent",
						fill : true,
						backgroundColor : gradient,
						borderColor : window.theme.primary,
						data : $result
					}]
				},
				options : {
					maintainAspectRatio : false,
					legend : {
						display : false
					},
					tooltips : {
						intersect : false
					},
					hover : {
						intersect : true
					},
					plugins : {
						filler : {
							propagate : false
						}
					},
					scales : {
						xAxes : [{
							reverse : true,
							gridLines : {
								color : "rgba(0,0,0,0.0)"
							}
						}],
						yAxes : [{
							ticks : {
								stepSize : 1000
							},
							display : true,
							borderDash : [3, 3],
							gridLines : {
								color : "rgba(0,0,0,0.0)"
							}
						}]
					}
				}
			});
		},
		mailStatusPie : function(obj){
			var $result = [];
			
			var $total = 0
			var $times = 0;
			var $total_fail = 0;
			var $total_queue = 0;
			$.each(obj.types, function(index, value) {
				
				var $_times = (value.times == undefined) ? 0 : value.times;
				var $fail = (value.fail == undefined) ? 0 : value.fail;
				var $queue = (value.queue == undefined) ? 0 : value.queue;
				
				$times += $_times;
				$total_fail += $fail;
				$total_queue += $queue;
				
			});
			
			$total = $times + $total_fail + $total_queue;
			
			$result.push($times);
			$result.push($total_queue);
			$result.push($total_fail);
			
			if($total == 0){
				$("#chartjs-dashboard-pie").parent().html("<div class='text-center'>No Data!</div>");
				return ;
			}
			new Chart(document.getElementById("chartjs-dashboard-pie"), {
				type: "pie",
				data: {
					labels: ["成功", "處理中", "失敗"],
					datasets: [{
						data: $result,
						backgroundColor: [
							window.theme.primary,
							window.theme.warning,
							window.theme.danger
						],
						borderWidth: 5
					}]
				},
				options: {
					responsive: !window.MSInputMethodContext,
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					cutoutPercentage: 75
				}
			});
		},
		mailOpenRate : function(obj){
			
			if(obj.length == 0){
				$("#chartjs-dashboard-bar").parent().html("<div class='text-center'>No Data!</div>");
				return ;
			}
			
			var $result = [];
			for(var $i=0; $i < 7; $i++){
				var $isFound = false;
				$.each(obj, function(index, value) {
					var $weekday = value.key;
					if($i == $weekday){
						$isFound = true;
						$result.push(value.number);
					}
					
				});
			
				if(!$isFound){
					$result.push(0);
				}
			}
			
			if(obj.length == 0){
				for(var $i=0; $i < 7; $i++){
					$result.push(0);
				}
			}
			
			new Chart(document.getElementById("chartjs-dashboard-bar"), {
				type: "bar",
				data: {
					labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    datasets: [{
                        label: "Email Open Count",
						backgroundColor: window.theme.primary,
						borderColor: window.theme.primary,
						hoverBackgroundColor: window.theme.primary,
						hoverBorderColor: window.theme.primary,
						data: $result,
						barPercentage: .75,
						categoryPercentage: .5
					}]
				},
				options: {
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					scales: {
						yAxes: [{
							gridLines: {
								display: false
							},
							stacked: false,
							ticks: {
								stepSize: 20
							}
						}],
						xAxes: [{
							stacked: false,
							gridLines: {
								color: "transparent"
							}
						}]
					}
				}
			});
		},
		tagOpenRate : function(obj){

			if(obj.data.length == 0){
				$("#bubble-open").html("<div class='text-center'>No Data!</div>");
				return ;
			}
			
			var $json = {
					target : 'bubble-open',
					data : obj
				}
				
			d3m.module.circle($json);

		},
		tagClickRate : function(obj){
			
			if( obj.data.length == 0){
				$("#bubble-click").html("<div class='text-center'>No Data!</div>");
				return ;
			}
			
			var $json = {
				target : 'bubble-click',
				data : obj
			}
			
			d3m.module.circle($json);
			
		},
		mailEventBar : function(obj) {
			
			var $date = [];
			var $click = [];
			var $open = [];
			
			if(obj.length == 0){
				obj.target.html("<div class='text-center'>No Data!</div>");
				return ;
			}
			
			$.each(obj, function(index, value) {
				
				var $isDup = false;
				$.each($date, function(index, v1) {
					
					if(v1 == value.key){
						$isDup = true;
						return;
					}
				});
				
				if(!$isDup){
					$date.push(value.key);
				}
				
			});
			
			$.each($date, function(index, v1) {
				var $foundDate = false;
				$.each(obj, function(index, value) {
					if(v1 == value.key && value.type == 'click'){
						$foundDate = true;
						$click.push(value.number);
						return ;
					}
				});
				
				if(!$foundDate){
					$click.push(0);
				}
			});
			
			$.each($date, function(index, v1) {
				var $foundDate = false;
				$.each(obj, function(index, value) {
					if(v1 == value.key && value.type == 'open'){
						$foundDate = true;
						$open.push(value.number);
						return ;
					}
				});
				
				if(!$foundDate){
					$open.push(0);
				}
			});
			
			var $canvas = $("<CANVAS>").appendTo(obj.target);
			
			new Chart($canvas, {
				type: "bar",
				data: {
					labels: $date,
					datasets: [{
						label: "開信事件",
						backgroundColor: "#dee2e6",
						borderColor: "#dee2e6",
						hoverBackgroundColor: "#dee2e6",
						hoverBorderColor: "#ffc107",
						data: $open,
						barPercentage: .75,
						categoryPercentage: .5
					}, {
						label: "點擊事件",
						backgroundColor: window.theme.primary,
						borderColor: window.theme.primary,
						hoverBackgroundColor: window.theme.primary,
						hoverBorderColor: "#ffc107",
						data: $click,
						barPercentage: .75,
						categoryPercentage: .5
					}]
				},
				options: {
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					scales: {
						yAxes: [{
							gridLines: {
								display: false
							},
							stacked: false,
							ticks: {
								stepSize: 20
							}
						}],
						xAxes: [{
							stacked: false,
							gridLines: {
								color: "transparent"
							}
						}]
					}
				}
			});
			
		},
		
	}
		
}