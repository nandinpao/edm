/**
 * 
 */

$(document).ready(function() {

	$("#range").on("input", function() {
		$("#number").val($(this).val());
		pay.form.number();
	});
	
	$("#number").on("input", function() {

		pay.form.number();

	});
	
	$("#price").on("input", function() {
		
		var $payment = [{
			number : 10000,
			price : 0.08,
			amount : 1500
		}, {
			number : 25000,
			price : 0.07,
			amount : 13000
		}, {
			number : 100000,
			price : 0.06,
			amount : 30000
		}];
		
		
		var $amount =$(this).val();
		var $number = 1000;
		
		$.each($payment, function(index, value) {
			
			var $_number = value.number;
			var $_price = value.price;
			var $_amount = value.amount;
			
			var $isFind = false;
			if ($amount < $_amount) {
				$number = Math.round($amount / $_price);
				$isFind = true;
			} 

			if($isFind){
				return false;
			} else {
				return true;
			}
			
		});
		
		$("#number").val($number);
		
	});
	
	$("#send").bind("click", function() {

		pay.panel.order();
		
	});
	
	$("#orderBack").bind("click", function() {
		window.location.replace("./myorder");
	});
});

var pay = {
	condition : {
		list : {}
	},
	form : {
		number : function(){
			var $number = $("#number").val();
			
			if($number < 1000){
				$(this).val(1000);
				return false;
			}
			
			var $payment = [{
				number : 10000,
				price : 0.15
			}, {
				number : 100000,
				price : 0.13
			}, {
				number : 300000,
				price : 0.1
			}];

			var $price = -1;
			
			var $isFind = false;
			$.each($payment, function(index, value) {

				var $_number = value.number;
				var $_price = value.price;
				
				if ($number < $_number) {
					$price = $_price;
					$isFind = true;
				} 

				if($isFind){
					return false;
				} else {
					return true;
				}
			});
			
			if($price == -1){
				$price = 0.01;
			}
			
			var $amount = $number * $price;
			if($amount <= 100){
				$amount = 100;
			}
			
			$("#price").val(Math.round($amount));
		}
	},
	action : {

		order : function(obj) {

			var request = {
				method : "POST",
				url : "./order/create",
				dataType : "json",
				contentType : "application/json",
				timeout : 60000,
				loading : {
					target : 'pageInfo'
				},
				data : JSON.stringify(obj),
				error : function(e) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					$("#pageInfo").addClass("visually-hidden");
					$("#bankInfo").removeClass("visually-hidden");
				}
			};

			utils.normalRequest(request);

		},
		cancel : function(obj) {

			var request = {
				method : "POST",
				url : "./order/cancel",
				dataType : "json",
				contentType : "application/json",
				timeout : 60000,
				loading : {
					target : 'pageInfo'
				},
				data : JSON.stringify(obj),
				error : function(e) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}
					
					pay.action.list(pay.condition.list);

				}
			};

			utils.normalRequest(request);

		},
		list : function(obj) {

			var $page, $limit;
			if(obj == undefined ){
				$page = 1;
				$limit = 20;
			} else {
				$page = obj.page;
				$limit = obj.limit;
			}
			var $json = {
					page : $page,
					limit : $limit
			}
			
			var request = {
				method : "POST",
				url : "./order/list",
				dataType : "json",
				contentType : "application/json",
				timeout : 60000,
				loading : {
					target : 'pageInfo'
				},
				data : JSON.stringify($json),
				error : function(e) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}
					
					pay.condition.list = $json;
					
					response.data['page'] = $page;
					response.data['limit'] = $limit;
					pay.panel.orderList(response.data);
					
					if(response.data.total > 0){
						module.pagging({
							target : "pagging",
							anchor : "pageInfo",
							records : response.data.total,
							link : function(param){
								
								var $data = {
									page : param.page,
									limit : param.limit
								}
								pay.action.list($data);
							},
							current : $page,
							limit : $limit
						});
					}
					
				}
			};

			utils.normalRequest(request);

		},
	},
	panel : {

		order : function(obj) {

			var $lastName = $("#lastName").val();
			var $firstName = $("#firstName").val();
			var $mobile = $("#mobile").val(); 
			var $bankNo = $("#bankNo").val();
			var $branchNo = $("#branchNo").val();
			var $card5No = $("#card5No").val();
			var $companyNo = $("#companyNo").val();
			var $address = $("#address").val();

			var $number = $("#number").val();
			var $price = $("#price").val();

			var $json = {
				lastName : $lastName,
				firstName : $firstName,
				mobile : $mobile,
				bankNo : $bankNo,
				branchNo : $branchNo,
				card5No : $card5No,
				number : $number,
				price : $price,
				companyNo : $companyNo,
				address : $address
			}

			pay.action.order($json);
		},
		orderList : function(data) {
			var $target = $("#pageInfo");
			$target.html("");
			
			var $wrapper =$("<DIV>").addClass("table-responsive py-5").appendTo($target);
			var $table = $("<TABLE>").addClass("table").appendTo($wrapper);
			var $footer = $("<NAV>").attr("ID", "pagging").attr("aria-label", "Page navigation example");
			
			var $pager = {
				id : 'myOrder',
				body : $wrapper,
				linkBackText : '購買',
				linkBackAction : function(){
					window.location.replace("./purchase");
				},
				subject : '我的訂單 ',
				footer : $footer,
				target : $("#pageInfo")
			}
			mail.layout.cargo($pager);
			
			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("訂單編號").appendTo($tr);
			$("<TH>").text("持卡人").appendTo($tr);
			$("<TH>").text("卡號").appendTo($tr);
			$("<TH>").text("金額").appendTo($tr);
			$("<TH>").text("數量").appendTo($tr);
			$("<TH>").text("類型").appendTo($tr);
			$("<TH>").text("狀態").appendTo($tr);
			$("<TH>").text("說明").appendTo($tr);
			$("<TH>").text("更新時間").appendTo($tr);
			$("<TH>").text(" ").appendTo($tr);
			
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function(index, value) {
				
				var $id = value.id;
				var $status = value.status;
				var $type = value.type;
				var $memo = value.memo;
				
				var $span_status = $("<SPAN>");
				var $enableCancel = false;
				if($status == 1){
					$span_status.addClass("badge bg-success").text('Passed');
                }
                else if($status == 3){
                    $span_status.addClass("badge bg-secondary").text('Canceled');
                }
                else if($status == 4){
                    $span_status.addClass("badge bg-danger").text('Failed');
                }
                else if($status == 0){
                    $enableCancel = true;
                    $span_status.addClass("badge bg-primary").text('Pending');
                }
                
                var $span_type = $("<SPAN>");
                if($type == 1){
                    $span_type.addClass("badge bg-primary").text('Purchase');
                }
                else if($type == 99){
                    $span_type.addClass("badge bg-primary").text('System');
				}
				
				if($memo == undefined){
					$memo = '-';
				}
				
				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").text(value.orderNo).appendTo($tr);
				$("<TD>").text(value.lastname + " " + value.firstname).appendTo($tr);
				$("<TD>").text(value.card5No).appendTo($tr);
				$("<TD>").text('$ ' + utils.formatNumber(value.price)).appendTo($tr);
				$("<TD>").text(utils.formatNumber(value.number)).appendTo($tr);
				$("<TD>").html($span_type).appendTo($tr);
				$("<TD>").html($span_status).appendTo($tr);
				$("<TD>").text($memo).appendTo($tr);
				$("<TD>").text(value.createdTime).appendTo($tr);
				
				var $info = $("<TD>").appendTo($tr);
				
				var $button = $("<DIV>").addClass("btn-group btn-group-sm").appendTo($info);
				$("<BUTTON>").attr("type", "button").addClass("btn btn-info dropdown-toggle")
					.attr("data-bs-toggle", "dropdown").attr("aria-haspopup", "true")
					.attr("aria-expanded", "false").text("Info").appendTo($button);
				var $button_menu = $("<DIV>").attr("mark", $id).addClass("dropdown-menu").appendTo($button);
				
				var $atm = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-edit'> Input </i>").appendTo($button_menu);
                $("<DIV>").addClass("dropdown-divider").appendTo($button_menu);
                var $cancel = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-edit'> Cancel </i>").appendTo($button_menu);
				if($enableCancel){
					$cancel.bind("click", function(){
						pay.action.cancel({ orderId : $id});
					});
					
					$atm.bind("click", function(){
						pay.panel.bankInfo();
					});
					
				} else {
					$cancel.addClass("disabled").attr("aria-disabled", "true");
					$atm.addClass("disabled").attr("aria-disabled", "true");
				}
				
				
			});
			
			$('[data-toggle="tooltip"]').tooltip();
		},
		bankInfo : function(){
			
			var $table = $("<TABLE>").addClass("table table-striped my-0");

			var $tbody = $("<TBODY>").appendTo($table);
			var $tr = $("<TR>").appendTo($tbody);
			$("<TH>").text("戶名").appendTo($tr);
			$("<TD>").text("富梁有限公司").appendTo($tr);
			$tr = $("<TR>").appendTo($tbody);
			$("<TH>").text("銀行").appendTo($tr);
			$("<TD>").text("聯邦銀行 803").appendTo($tr);
			$tr = $("<TR>").appendTo($tbody);
			$("<TH>").text("分行").appendTo($tr);
			$("<TD>").text("南京東 0054").appendTo($tr);
			$tr = $("<TR>").appendTo($tbody);
			$("<TH>").text("帳號").appendTo($tr);
			$("<TD>").text("005-10800-3917").appendTo($tr);
			
			var $fun = {
					title : "ATM 轉出帳號",
					content : $table,
				}
				
				module.pupopboot($fun);
			
			return $table;
		}
	}
}
