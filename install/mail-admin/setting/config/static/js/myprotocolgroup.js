/**
 * 
 */

var myprotocolgroup = {

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
					url : "./proto/listGroup",
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

						$.LoadingOverlay("hide");

						if(response.status != 0){
							$("#error").show();
							$("#error").text(response.message);
							return ;
						}
						
						myprotocolgroup.panel.mygroup(response.data);
						
						module.pagging({
							target : "pagging",
							records : response.data.total,
							link : function(param){
								myprotocolgroup.action.list(param);
							},
							current : $page,
							limit : $limit
						});
					}
				};

				utils.normalRequest(request);
		},
		remove : function(obj){
			
			var $json = {
				id : obj.id
			}
			var request = {
					method : "POST",
					url : "./proto/deleteProtocolConfig",
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
							
							myprotocolgroup.action.list();
						}
					}
				};

			utils.normalRequest(request);
		},
		listNonJoinGroup : function(obj){
			
			console.log(obj)
			
			var $page=1, $limit=20;
			if(obj == undefined ){
				$page = 1;
				$limit = 20;
			} else {
				$page = obj.page;
				$limit = obj.limit;
			}
			
			var $json = {
					groupId : obj.id, 
					page : $page,
					limit : $limit
			}
			
			var $url = (obj.type == 'join') ?   "./proto/listJoinProtocolGroup" : "./proto/listUnjoinProtocolGroup";
			var request = {
					method : "POST",
					url : $url ,
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
						
						var $data = {
							data : response.data,
							groupId : obj.id,
							type : obj.type
						};
						
						var $table = $("<DIV>")
						myprotocolgroup.panel.listUnjoinGroup($data).appendTo($table);
						var $pagging = $("<NAV>").attr("aria-label", "Page navigation example").attr("id", "group-pagging").appendTo($table);

						var $text = (obj.type == 'join') ? 'Already joined ' + obj.name + ' list' : 'Not joined ' + obj.name + ' list';
						
						var $fun = {
								title : $text,
								content : $table,
								displayCallback : function(){
									module.pagging({
										target : "group-pagging",
										records : response.data.total,
										link : function(param){
											
											var $data = {
												id : obj.id,
												type : obj.type,
												page : param.page,
												limit : param.limit
											}
											
											myprotocolgroup.action.listNonJoinGroup($data);
										},
										current : $page,
										limit : $limit
									});
								}
						}
						module.pupopboot($fun);
						
					}
				};
			utils.normalRequest(request);
		}
	},
	panel : {
		mygroup : function (data){
			var $table = $("#mytable");
			$table.html("");
			
			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("Name").appendTo($tr);
			$("<TH>").text("Sender Info").appendTo($tr);
			$("<TH>").html("Number").appendTo($tr);
			$("<TH>").text("Maximum Transactions").appendTo($tr);
			$("<TH>").html("Update Time").addClass("d-none d-xl-table-cell").appendTo($tr);
			$("<TH>").html("Functions").appendTo($tr);
			
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function(index, value) {
				
				var $id = value.id;
				var $sender = value.sender;
				var $email = value.email;
				
				var $modifyTime = $.format.date(value.modifyTime, 'yyyy-MM-dd HH:mm:ss');
				
				
				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").text(value.name).appendTo($tr);
				$("<TD>").append($("<SPAN>").attr("data-toggle", "tooltip").attr("title", $email).text($sender)).appendTo($tr);
				$("<TD>").text(utils.formatNumber(value.num)).appendTo($tr);
				$("<TD>").text(utils.formatNumber(value.maxTransaction)).appendTo($tr);
				$("<TD>").addClass("d-none d-xl-table-cell").text($modifyTime).appendTo($tr);
				var $info = $("<TD>").appendTo($tr);
				
				var $button = $("<DIV>").addClass("btn-group btn-group-sm m-1").appendTo($info);
				$("<BUTTON>").attr("type", "button").addClass("btn btn-info dropdown-toggle")
					.attr("data-bs-toggle", "dropdown").attr("aria-haspopup", "true")
					.attr("aria-expanded", "false").text("Info").appendTo($button);
				var $button_menu = $("<DIV>").attr("mark", $id).addClass("dropdown-menu").appendTo($button);
				var $editor = $("<A>").addClass("dropdown-item").html("Edit").appendTo($button_menu);
				var $delete = $("<A>").addClass("dropdown-item").html("Delete").appendTo($button_menu);
				
				if(value.oauthKey != undefined ){
					$("<DIV>").addClass("dropdown-divider").appendTo($button_menu);
					var $oauth = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-compass'> Sending API </i>").appendTo($button_menu);
				
					$oauth.bind("click", function(){
						myprotocolgroup.panel.oauthKey(value);
					});
				}
				
				var $joinSetting = $("<BUTTON>").addClass("btn btn-success btn-sm m-1").text("Joined").appendTo($info);
				var $unjoinSetting = $("<BUTTON>").addClass("btn btn-secondary btn-sm m-1").text("Unjoin").appendTo($info);
				
				$editor.bind("click", function(){
					myprotocolgroup.panel.createProtolGroup(value);
				});
				
				$delete.bind("click", function(){
					var $json = {
						id : value.id,
					}
					
					myprotocolgroup.action.remove($json);
				});
				
				$joinSetting.bind("click", function(){
					var $json = {
						type : 'join',
						id : value.id,
						name : value.name,
						page : 1,
						limit : 20
					}
					
					myprotocolgroup.action.listNonJoinGroup($json);
				});
				
				$unjoinSetting.bind("click", function(){
					var $json = {
						id : value.id,
						type : 'unjoin',
						name : value.name,
						page : 1,
						limit : 20
					}
					
					myprotocolgroup.action.listNonJoinGroup($json);
				});
				
			});
			
			var $tr = $("<TR>").appendTo($tbody);
			var $td =$("<TD>").attr("colspan", 6).attr("align", "center").appendTo($tr);
			
//			var $btn_group = $("<DIV>").addClass("btn-group mb-3").attr("role", "group").attr("aria-label", "Default button group").appendTo($td);
//			var $bt_email = $("<BUTTON>").attr("type", "button").addClass("btn btn-secondary").text("Add Group").appendTo($btn_group);
			
			$("#mysender").bind("click", function(){
				myprotocolgroup.panel.createProtolGroup();
			});
			
			$('[data-toggle="tooltip"]').tooltip();
			
		},
		listUnjoinGroup : function (obj){
			
			console.log(obj);
			
			var $table = $("<TABLE>").addClass("table table-striped my-0");
			
			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("Name").appendTo($tr);
			$("<TH>").text("Kind").addClass("d-none d-xl-table-cell").appendTo($tr);
			$("<TH>").text("Maximum Transactions").appendTo($tr);
			$("<TH>").html("Functions").appendTo($tr);
			
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(obj.data.list, function(index, value) {
				
				var $id = value.id;
				var $type = value.type;
				
				$image = '';
				if($type == 1){
					$image = '<i class="fas fa-1x fa-fw -square pull-right fa-at"></i>'
				} else if($type == 2){
					$image = '<i class="fab fa-1x fa-fw -square pull-right fa-telegram"></i>'
				}  else if($type == 3){
					$image = '<i class="fab fa-1x fa-fw -square pull-right fa-line"></i>'
				}
				
				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").text(value.sender).appendTo($tr);
				$("<TD>").html($image).appendTo($tr);
				$("<TD>").text(value.maxTransaction).appendTo($tr);
				var $info = $("<TD>").appendTo($tr);
				
				var $bt_text = (obj.type == 'join') ? 'Remove' : 'Join' ;
				var $unjoinSetting = $("<BUTTON>").addClass("btn btn-success btn-sm ").text($bt_text).appendTo($info);
				
				$unjoinSetting.bind("click", function(){
					
					var $json = {
							groupId : obj.groupId,
							userEmailConfigId : $id
					}
					console.log($json);
					
					var $url = (obj.type == 'join') ? "./proto/leaveProtocolGroup" : "./proto/addProtocolGroup";
					var request = {
							method : "POST",
							url : $url,
							contentType : "application/json",
							dataType : "json",
							timeout : 60000,
							data : JSON.stringify($json),
							loading : function() {
								$.LoadingOverlay("show", {
									image : "./img/loading/preloader.gif"
								});
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
								
								if(response.status == 0){
									$tr.remove();
									myprotocolgroup.action.list();
								}
								
							}
						};

					utils.normalRequest(request);
					
					
				});
				
			});
			
			return $table;
			
		},
		createProtolGroup : function(data){
			
			var $id, $name='', $sender='', $email='';
			if(data != undefined){
				$id = data.id;
				$name = data.name;
				$sender = data.sender;
				$email = data.email;
			}
			
			var $content_input = $("<DIV>");
			var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
					.attr("role", "alert").appendTo($content_input);
			$("<BUTTON>").attr("type", "button").addClass("btn-close").attr("data-bs-dismiss", "alert")
					.attr("aria-label", "Close").appendTo($alert_message);
			var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
			$alert_message.hide();
			
			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Gropu's name,").appendTo($form_group);
			var $input_groupName = $("<INPUT>").attr("type", "text")
					.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
							"placeholder", "Ex: My group of sender").attr("value", $name).appendTo($form_group);
			
			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Sender Name. Name of sender is see by receiver").appendTo($form_group);
			var $input_sendername = $("<INPUT>").attr("type", "text")
					.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
							"placeholder", "Agitg Service").attr("value", $sender).appendTo($form_group);
			
			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Custom sender email").appendTo($form_group);
			var $input_email = $("<INPUT>").attr("type", "text")
					.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
							"placeholder", "no-reply@agitg.com").attr("value", $email).appendTo($form_group);
			
			var $title = ($id == undefined) ? "Add Group" : "Edit Group";
			
			var $fun = {
					title : $title,
					content : $content_input,
					save : function(){
						
						if($input_sendername.val() == ''){
							$err.text("Name is required");
							$alert_message.show();
							return ;
						}
						
						$alert_message.hide();
						var $json = {
							"id" : $id,
							"name" : $input_groupName.val(),
							"sender" : $input_sendername.val(),
							"email" : $input_email.val()
						};
						
						console.log(JSON.stringify($json));
						
						var url = "./proto/createProtocolConfig";
						if($id != undefined && $id != ''){
							url = "./proto/updateProtocolConfig";
						}
						
						var request = {
								method : "POST",
								url : url,
								contentType : "application/json",
								dataType : "json",
								data : JSON.stringify($json),
								timeout : 60000,
								loading : function() {
									$.LoadingOverlay("show", {
										image : "./img/loading/preloader.gif"
									});
								},
								error : function(e){
									$.LoadingOverlay("hide");
								},
								handle : function(response) {
									$.LoadingOverlay("hide");
									
									if(response.status != 0){
										$("#error").show();
										$("#error").text(response.message);
										return ;
									}
									
									if(response.status == 0){
										$(".modal").modal('hide');
										$(".modal").remove();
										
										myprotocolgroup.action.list();
									}
									
								}
							};

						utils.normalRequest(request);
					},
					saveButton : "Save"
				}
				
				module.pupopboot($fun);
			
		},
		oauthKey : function(data){
			
			var $id = data.id;
			var $subject = data.name;
			var $authKey = data.oauthKey;
			
			var $content_input = $("<DIV>");
			var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
					.attr("role", "alert").appendTo($content_input);
			$("<I>").addClass("close fas fa-times mx-1").css({"font-size" : ".5rem"}).attr("data-bs-dismiss", "alert")
					.attr("aria-label", "Close").appendTo($alert_message);
			var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
			$alert_message.hide();
			
			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("My key").appendTo($form_group);
			var $input_subject = $("<TEXTAREA>").attr("rows", "20").attr("readonly", true)
					.addClass("form-control form-control-lg mb-3").appendTo($form_group);
			
			$input_subject.val($authKey);
			var $title =  $subject + " - API Key";
			
			var $fun = {
					title : $title,
					content : $content_input,
					save : function(){
						var $isCopy = utils.copy({
							text : $input_subject.val(),
							target : $err
						});
						
						if($isCopy){
							$err.text("Copied");
						}
						
						$alert_message.show();
					},
					saveButton : "Copy"
			}
				
			module.pupopboot($fun);
		},
	}
}