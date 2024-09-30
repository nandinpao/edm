/**
 * 
 */

var order = {
	condition : {
		list : {}
	},
	action : {
		list : function(obj) {

			var $page, $limit;
			if(obj == undefined || obj.page == undefined ){
				$page = 1;
				$limit = 20;
			} else {
				$page = obj.page;
				$limit = obj.limit;
			}
			var $json = {
				'type' : obj.type,
				status : obj.status,
				page : $page,
				limit : $limit
			}
			
			var request = {
				method : "POST",
				url : "./order/listAll",
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
					console.log(response)
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}
					
					if(response.status == 0){
						$(".modal").modal('hide');
						$(".modal").remove();
					}
					
					order.condition.list = $json;
					
					response.data['page'] = $page;
					response.data['limit'] = $limit;
					order.panel.orderList(response.data);
					
					if(response.data.total > 0){
						module.pagging({
							target : "pagging",
							anchor : "pageInfo",
							records : response.data.total,
							link : function(param){
								
								var $_param = order.condition.list;
								var $data = {
									'type' : $_param.type,
									status : $_param.status,
									page : param.page,
									limit : param.limit
								}
								
								order.action.list($data);
							},
							current : $page,
							limit : $limit
						});
					}
					
				}
			};

			utils.normalRequest(request);

		},
		pass : function(obj) {

			var request = {
				method : "POST",
				url : "./order/confirmIncomeOrder",
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
					
					order.action.list(order.condition.list);

				}
			};

			utils.normalRequest(request);

		},
		failure : function(obj) {

			var request = {
				method : "POST",
				url : "./order/failIncomeOrder",
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
					
					if(response.status == 0){
						$(".modal").modal('hide');
						$(".modal").remove();
					}
					
					order.action.list(order.condition.list);

				}
			};

			utils.normalRequest(request);

		},
	},
	panel : {
		
		orderList : function(data) {
			var $target = $("#pageInfo");
			$target.html("");
			
			var $wrapper =$("<DIV>").addClass("table-responsive py-5").appendTo($target);
			var $table = $("<TABLE>").addClass("table table-striped my-0").appendTo($wrapper);
			var $footer = $("<NAV>").attr("ID", "pagging").attr("aria-label", "Page navigation example");
			
			var $pager = {
				id : 'myOrder',
				body : $wrapper,
				linkBackText : 'Query',
				linkBackAction : function(){
					order.panel.query();
				},
				subject : '審核訂單',
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
					$span_status.addClass("badge bg-success").text('已通過');
				}
				else if($status == 3){
					$span_status.addClass("badge bg-secondary").text('已取消');
				}
				else if($status == 4){
					$span_status.addClass("badge bg-danger").text('未通過');
				}
				else if($status == 0){
					$enableCancel = true;
					$span_status.addClass("badge bg-primary").text('待審核');
				}
				
				var $span_type = $("<SPAN>");
				if($type == 1){
					$span_type.addClass("badge bg-primary").text('購買');
				}
				else if($type == 99){
					$span_type.addClass("badge bg-primary").text('系統');
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
				
				var $failure = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-edit'> 失敗 </i>").appendTo($button_menu);
				$("<DIV>").addClass("dropdown-divider").appendTo($button_menu);
				var $pass = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-edit'> 通過 </i>").appendTo($button_menu);
				
				if($enableCancel){
					$failure.bind("click", function(){
						order.panel.failure({ id : $id});
					});
					
					$pass.bind("click", function(){
						order.action.pass({ orderId : $id});
					});
					
				} else {
					$failure.addClass("disabled").attr("aria-disabled", "true");
					$pass.addClass("disabled").attr("aria-disabled", "true");
				}
				
				
			});
			
			$('[data-toggle="tooltip"]').tooltip();
		},
		failure : function(data){
			
			var $content_input = $("<DIV>");
			var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
					.attr("role", "alert").appendTo($content_input);
			$("<BUTTON>").attr("type", "button").addClass("btn-close").attr("data-bs-dismiss", "alert")
					.attr("aria-label", "Close").appendTo($alert_message);
			var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
			$alert_message.hide();
			
			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("請輸入原因").appendTo($form_group);
			var $input_name = $("<INPUT>").attr("type", "text")
					.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
							"placeholder", "例如： Agitg").appendTo($form_group);
			
			var $fun = {
					title : "未通過原因",
					content : $content_input,
					save : function(){
						
						var $json = {
							    "orderId" : data.id,
							    "memo" : $input_name.val()
						};
						
						order.action.failure($json);
						
					},
					saveButton : "送出"
				}
				
				module.pupopboot($fun);
			
			return $content_input;
		},
		query : function(data){
			
			var $content_input = $("<DIV>");

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("選擇類型").appendTo($form_group);
			var $select_type = $("<SELECT>").addClass("form-select form-select-lg").attr("aria-label", ".form-select-lg").appendTo($form_group);
			$("<OPTION>").attr("value", -1).text("全部").appendTo($select_type);
			$("<OPTION>").attr("value", 1).text("購買").appendTo($select_type);
			$("<OPTION>").attr("value", 99).text("系統").appendTo($select_type);
			
			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("狀態").appendTo($form_group);
			var $select_status = $("<SELECT>").addClass("form-select form-select-lg").attr("aria-label", ".form-select-lg").appendTo($form_group);
			$("<OPTION>").attr("value", -1).text("全部").appendTo($select_status);
			$("<OPTION>").attr("value", 0).attr('selected', true).text("待審核").appendTo($select_status);
			$("<OPTION>").attr("value", 1).text("通過").appendTo($select_status);
			$("<OPTION>").attr("value", 3).text("用戶取消").appendTo($select_status);
			$("<OPTION>").attr("value", 4).text("未通過").appendTo($select_status);
			
			var $fun = {
					title : "訂單查詢",
					content : $content_input,
					save : function(){
						
						var $json = {
							'type' : $select_type.val(),
							'status' : $select_status.val()
						}
						console.log($json);
						order.action.list($json);
					},
					saveButton : "訂單"
				}
				
			module.pupopboot($fun);
			
		},
	}
}