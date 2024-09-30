/**
 * 
 */

var message = {

	action : {

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
					url : "./user/sentHistory",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify($json),
					loading : {
						action : function() {
							$.LoadingOverlay("show", {
								image : "./img/loading/preloader.gif"
							});
						}
					},
					error : function(e){
						$.LoadingOverlay("hide");
					},
					handle : function(response) {
						console.log(response);
						$.LoadingOverlay("hide");

						if(response.status != 0){
							$("#error").show();
							$("#error").text(response.message);
							return ;
						}
						
						message.panel.mymessage(response.data);
						
						module.pagging({
							target : "pagging",
							anchor : "mytable",
							records : response.data.total,
							link : function(param){
								message.action.list(param);
							},
							current : $page,
							limit : $limit
						});
					}
				};

				utils.normalRequest(request);
		},
		
		
	},
	panel : {
		mymessage : function (data){
			var $table = $("#mytable");
			$table.html("");
			
			var $thead = $("<THEAD>").appendTo($table);
            var $tr = $("<TR>").appendTo($thead);
            $("<TH>").text("Type").appendTo($tr);
            $("<TH>").text("Sender").appendTo($tr);
            $("<TH>").text("Recipient").appendTo($tr);
            $("<TH>").html("Message").appendTo($tr);
            $("<TH>").html("Status").appendTo($tr);
            $("<TH>").html("Duration (seconds)").appendTo($tr);
            $("<TH>").html("Sent Time").addClass("d-none d-xl-table-cell").appendTo($tr);
			
			var now = new Date();
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function(index, value) {
				
				var $id = value.id;
				
				var $type = value.protocolType;
				var $status = value.status;
				
				var $image = '' ;
				if($type == 1){
					$image = '<i class="fas fa-1x fa-fw -square pull-right fa-at"></i>'
				} else if($type == 2){
					$image = '<i class="fab fa-1x fa-fw -square pull-right fa-telegram"></i>'
				}  else if($type == 3){
					$image = '<i class="fab fa-1x fa-fw -square pull-right fa-line"></i>'
				}
				
				var $icon = "";
				if($status == 0){
					$icon = "<SPAN class='badge bg-info'>Initial</SPAN>";
				}
				else if($status == 200){
					$icon = "<SPAN class='badge bg-success'>Success</SPAN>";
				} else {
					$icon = "<SPAN class='badge bg-danger'>Failure</SPAN>";
				}
				
				var $modifyTime = Date.parse(value.createTime.replace(' ', 'T'));
				$modifyTime = $modifyTime - (now.getTimezoneOffset() * 60000);
				
				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").html($image).appendTo($tr);
				$("<TD>").text(value.sender).appendTo($tr);
				$("<TD>").text(value.receiver).appendTo($tr);
				$("<TD>").html("<p style='text-overflow: ellipsis; white-space: nowrap; overflow:hidden; max-width : 250px; max-height : 30px;'> " + value.subject + "</p>").appendTo($tr);
				$("<TD>").html($icon).appendTo($tr);
				$("<TD>").text(value.expense/1000).appendTo($tr);
				$("<TD>").addClass("d-none d-xl-table-cell").text($.format.date(new Date($modifyTime), 'yyyy-MM-dd HH:mm:ss')).appendTo($tr);
				
				
			});
			
			
		}
		
	}
}