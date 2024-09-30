  /**
 * 
 */

var mymailgroup = {
	condition : {
		query : {},
		list : {},
		query2 : {}
	},
	action : {

		list : function(obj) {
			
			var $page, $limit;
			if(obj == undefined || obj.page == undefined){
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
					url : "./emailgroup/listEmailGroup",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify($json),
					loading : {
						target : 'mytable'
					},
					error : function(e){
						$.LoadingOverlay("hide");
					},
					handle : function(response) {
						$.LoadingOverlay("hide");
						console.log(response);

						if(response.status != 0){
							$("#error").show();
							$("#error").text(response.message);
							return ;
						}
						
						var $junk = $("#junk");
						$junk.html('');
						$("#mytable").html("");
						
						var $new = $("<DIV>").addClass("btn btn-primary btn-sm ms-1").html("&nbsp;New Group").appendTo($junk);
						var $icon = '<svg mlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-square align-middle mr-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect> <line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>';
						$new.prepend($.parseHTML($icon));
						
						var $query = $("<DIV>").addClass("btn btn-primary btn-sm ms-1").html("&nbsp;Query").appendTo($junk);
						var $icon = '<svg mlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-square align-middle mr-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect> <line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>';
						$query.prepend($.parseHTML($icon));
						
						$query.bind("click", function(){
							mymailgroup.panel.query();
						});
						
						$new.bind("click", function(){
							var $json = {
									url : "./emailgroup/saveEmailGroup"
								}
								
							mymailgroup.panel.createClass($json);
						});
						
						mymailgroup.condition.list = $json;
						
						$("#mytable").append(mymailgroup.panel.mymessage(response.data));
						
						module.pagging({
							target : "pagging",
							anchor : "mytable",
							records : response.data.total,
							link : function(param){
								mymailgroup.action.list(param);
							},
							current : $page,
							limit : $limit
						});
						
						$("#dashboard_total").text(utils.formatNumber(response.data.total));
						$("#dashboard_setting").text(utils.formatNumber(response.data.emails));
						$("#dashboard_success").text(utils.formatNumber(response.data.enableGroup));
						var $unsubscriber = $("#dashboard_fail").text(utils.formatNumber(response.data.unsubscriber));
						
						$unsubscriber.hover(function (e) {
							$(this).css("color", e.type === "mouseenter" ? "#CDCDCD":"#495057" );
						    $(this).css("cursor", e.type === "mouseenter" ? "pointer":"hand" )
						});
						
						$unsubscriber.bind("click", function(){
							mymailgroup.action.listUnsubscriber();
						});
						
						mymailgroup.action.listUserEmailRadio();
						
						$('[data-toggle="tooltip"]').tooltip();
					}
				};

				utils.normalRequest(request);
		},
		listUserEmailRadio : function(obj) {
			
			var groupId = '';
			if(obj != undefined && obj.groupId != undefined){
				groupId = obj.groupId;
			}
			
			var request = {
					method : "GET",
					url : "./useremail/listUserEmailRadio?groupId=" + groupId,
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					loading : {
						target : 'chartjs-dashboard-pie'
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
						}
						
						mymailgroup.panel.mailPie(response.data);
						
					}
				};

				utils.normalRequest(request);
		},
		createClass : function(data) {
			
			var request = {
					method : "POST",
					url : data.url,
					contentType : "application/json",
					dataType : "json",
					data : JSON.stringify(data),
					timeout : 60000,
					loading : {
						action :function() {
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
						
						if(response.status == 0){
							
							mymailgroup.action.list();
							
							$(".modal").modal('hide');
							$(".modal").remove();
							
						}
						
					}
				};

			utils.normalRequest(request);
			
		},
		remove : function(obj){
			
			var $json = {
				id : obj.id,
				status : obj.status
			}
			var request = {
					method : "POST",
					url : "./emailgroup/enableUserEmailGroup",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify($json),
					loading : {
						action :function() {
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
							
							mymailgroup.action.list();
						}
					}
				};

			utils.normalRequest(request);
		},
		unjoin : function(obj){
			
			var $json = {
				id : obj.id,
			}
			var request = {
					method : "POST",
					url : "./emailgroup/removeEmailReceiverLeaveGroup",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify($json),
					loading : {
						action :function() {
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
							
							mymailgroup.action.search(mymailgroup.condition.query);
						}
					}
				};

			utils.normalRequest(request);
		},
		search : function(obj) {
			
			var $page, $limit;
			if(obj == undefined || obj.page == undefined || obj.limit == undefined ){
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
			
			
			var $gn = (obj == undefined || obj.gn == undefined ) ? "" : obj.gn;
			var $email = (obj == undefined || obj.email == undefined ) ? "" : obj.email;
			var $name = (obj == undefined || obj.name == undefined ) ? "" : obj.name;
			
			var request = {
					method : "GET",
					url : "./useremail/listUserEmail?gn="+$gn+"&name="+$name+"&email="+$email+"&page="+$page+"&limit="+$limit,
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					loading : {
						target : 'mytable'
					},
					error : function(e){
						$.LoadingOverlay("hide");
					},
					handle : function(response) {
						$.LoadingOverlay("hide");

						$("#myTitle").text("收件群-" +$gn );
						if(response.status != 0){
							$("#error").show();
							$("#error").text(response.message);
							return ;
						}
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
						}
						
						var $junk = $("#junk");
						$junk.empty();
						var $back = $("<A>").addClass("btn btn-primary btn-sm ms-1").text("Previous");
						$junk.append($back);
						
						var $query = $("<A>").addClass("btn btn-primary btn-sm ms-1").text("Query");
						$junk.append($query);
						$query.bind("click", function(){
							var $json = {
								gn : $gn
							}
							mymailgroup.panel.query($json);
						});
						
						$back.bind("click", function(){
							mymailgroup.action.list(mymailgroup.condition.list);
							$("#mygraph").empty();
						});
						
						$("#mytable").empty();
						$("#mytable").append(mymailgroup.panel.searchResult(response.data));
						
						$('[data-toggle="tooltip"]').tooltip();
						
						var $param = { gn : $gn, name : $name, email: $email, page : $page, limit : $limit};
						
						mymailgroup.condition.query = $param;
						
						module.pagging({
							target : "pagging",
							anchor : "mytable",
							records : response.data.total,
							para : mymailgroup.condition.query,
							link : function(param){
								
								param['gn'] = mymailgroup.condition.query.gn;
								param['name'] = mymailgroup.condition.query.name;
								param['email'] = mymailgroup.condition.query.email;
								
								mymailgroup.action.search(param);
							},
							current : $page,
							limit : $limit
						});
					}
				};

				utils.normalRequest(request);
		},
		updateUserInfo : function(obj) {
			
			var request = {
					method : "POST",
					url : "./emailgroup/changeUserEmailByGroup",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify(obj),
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
						}
						
						mymailgroup.action.search(mymailgroup.condition.query);
						
					}
				};

				utils.normalRequest(request);
		},
		removeGroup : function(obj) {
			
			var request = {
					method : "POST",
					url : "./emailgroup/removeEmailGroup",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify(obj),
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
						}
						
						mymailgroup.action.list(mymailgroup.condition.list);
						
					}
				};

				utils.normalRequest(request);
		},
		shareGroup : function(obj) {
			
			var request = {
					method : "POST",
					url : "./emailgroup/updateShare",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify(obj),
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
						}
						
						mymailgroup.action.list(mymailgroup.condition.list);
						
					}
				};

				utils.normalRequest(request);
		},
		eventStatistics : function(obj) {
			
			var request = {
					method : "POST",
					url : "./emailgroup/eventStatistics",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify(obj),
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
						}
						
						$("#mygraph").empty();
						
						var $wrapper = $("<DIV>").addClass("row").appendTo($("#mygraph"));
						
						var $target = $("<DIV>").addClass("chart");
                        var $json = {
                            title : 'Mail Events',
                            subtitle : 'Occurrence Count',
                            target : $target
                        }
                        
                        mymailgroup.panel.graph($json).appendTo($wrapper);
                        response.data.eventTotal['target'] = $target
                        mymailgroup.panel.groupEventPie(response.data.eventTotal);
                        
                        var $target = $("<DIV>").addClass("chart");
                        var $json = {
                            title : 'Mail Events in the Last 30 Days',
                            subtitle : 'Daily Count',
                            target : $target
                        }
						
						mymailgroup.panel.graph($json).appendTo($wrapper);
						response.data.event['target'] = $target
						mymailgroup.panel.groupEventBar(response.data.event);
					}
				};

				utils.normalRequest(request);
		},
		copyToGroup : function(obj) {
			
			var request = {
					method : "POST",
					url : "./emailgroup/copyToNewGroup",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify(obj),
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
						}
						
						mymailgroup.action.search(mymailgroup.condition.query);
						
					}
				};

				utils.normalRequest(request);
		},
		updateGropupDescription : function(obj) {
			
			var request = {
					method : "POST",
					url : "./emailgroup/updateEmailGroupDescription",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify(obj),
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
						}
						
						mymailgroup.action.list(mymailgroup.condition.list);
						
					}
				};

				utils.normalRequest(request);
		},
		listUnsubscriber : function(obj) {
			
			var $page, $limit;
			if(obj == undefined || obj.page == undefined){
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
					url : "./emailgroup/listUnsubscriber",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify($json),
					loading : {
						target : 'mytable'
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
						}
						
						$("#junk").html("");
						$("#mygraph").empty();
						$("#mytable").html("");
						
						mymailgroup.condition.query = $json;
						
						var $junk = $("#junk");
						var $back = $("<A>").addClass("btn btn-primary btn-sm ms-1").text("Previous");
						$junk.html($back);
						
						$back.bind("click", function(){
							mymailgroup.action.list(mymailgroup.condition.list);
						});
						
						mymailgroup.condition.query = $json;
						
						$("#mytable").prepend(mymailgroup.panel.unsubscriber(response.data));
						
						$('[data-toggle="tooltip"]').tooltip();
						
						module.pagging({
							target : "pagging",
							anchor : "mytable",
							records : response.data.total,
							para : mymailgroup.condition.query,
							link : function(param){
								Object.assign(param, mymailgroup.condition.query);
								mymailgroup.action.listUnsubscriber(param);
							},
							current : $page,
							limit : $limit
						});
					}
				};

				utils.normalRequest(request);
		},
		listMailGroup : function(data) {
			
			var $page = 1, $limit = 20;
			
			if(data == undefined || data.page == undefined){
				$page = 1;
				$limit = 20;
			} else {
				$page = data.page;
				$limit = data.limit;
			}
			
			var request = {
					method : "POST",
					url : "./emailgroup/listEmailGroupShrot",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify({
						page : $page,
						limit : $limit
					}),
					loading : {
						action :function() {
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
						
						
						var $json = {
							info : response.data,
							emailInfoId : data.id,
							page: $page,
							limit: $limit
						}
						
						var $fun = {
							title : "我的收件群",
							content : mymailgroup.panel.myEmailgroup($json),
						}
							
						module.pupopboot($fun);
						
					}
				};

				utils.normalRequest(request);
		},
		listUserActivity : function(obj) {
			
			var $page, $limit;
			if(obj == undefined || obj.page == undefined){
				$page = 1;
				$limit = 20;
			} else {
				$page = obj.page;
				$limit = obj.limit;
			}
			
			var $json = {
				page : $page,
				limit : $limit,
				emailInfoId : obj.id,
				name : obj.name
			}
			
			var request = {
					method : "POST",
					url : "./activity/listUserEmailActivity",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify($json),
					loading : {
						target : 'mytable'
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
						}
						
						$("#myTitle").text("收件人的信-" + obj.name );
						$("#junk").html("");
						$("#mytable").html("");
						
						var $junk = $("#junk");
						var $back = $("<A>").addClass("btn btn-primary btn-sm ms-1").text("Previous");
						$junk.html($back);
						
						$back.bind("click", function(){
							mymailgroup.action.search(mymailgroup.condition.query);
						});
						
						mymailgroup.condition.query2 = $json;
						
						$("#mytable").prepend(mymailgroup.panel.userActivity(response.data));
						
						$('[data-toggle="tooltip"]').tooltip();
						
						module.pagging({
							target : "pagging",
							anchor : "mytable",
							records : response.data.total,
							para : mymailgroup.condition.query,
							link : function(param){
								
								param['id'] = mymailgroup.condition.query2.emailInfoId;
								param['name'] = mymailgroup.condition.query2.name;
								
								mymailgroup.action.listUserActivity(param);
							},
							current : $page,
							limit : $limit
						});
					}
				};

				utils.normalRequest(request);
		},
		updateSubscriberStatus : function(obj) {
			
			var request = {
					method : "POST",
					url : "./emailgroup/updateSubscriberStatus",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify(obj),
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
						}
						
						mymailgroup.action.listUnsubscriber(mymailgroup.query);
						
					}
				};

				utils.normalRequest(request);
		},
		addTag : function(obj) {
			
			var request = {
					method : "POST",
					url : obj.url,
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify(obj),
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
						}
						
						mymailgroup.action.search(mymailgroup.condition.query);
					}
				};

				utils.normalRequest(request);
		},
		removeTag : function(obj) {
			
			var request = {
					method : "POST",
					url : "./userTag/remove",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify(obj),
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
						}
						
						mymailgroup.action.search(mymailgroup.condition.query);
					}
				};

				utils.normalRequest(request);
		},
		removeEvent : function(obj) {
			
			var request = {
					method : "POST",
					url : "./event/deleteReceiverEvent",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify(obj),
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
						}
						
						obj.success();
						
					}
				};

				utils.normalRequest(request);
		},
		listGroupMail : function(obj) {
			
			var $page, $limit;
			if(obj == undefined || obj.page == undefined){
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
					url : "./email/mymailByGroup",
					dataType : "json",
					contentType : "application/json",
					data : JSON.stringify($json),
					timeout : 60000,
					loading : {
						target : "pageInfo"
					},
					error : function(ex){
						$.LoadingOverlay("hide");
					},
					handle : function(response) {
						$.LoadingOverlay("hide");
						
						$("#mymail_total").text(utils.formatNumber(response.data.total));
						
						$.each(mymail.condition.interval, function(key, value){
							  clearInterval(value);
						});
						mymail.condition.interval = [];
						
						response.data['page'] = $page;
						response.data['limit'] = $limit;
//						mymail.panel.mymail(response.data);
						
						mymail.condition.list = $json;
						
						var $_json = {};
						$_json['total'] = response.data.total;
						
						AOS.init({
			                easing: 'ease-in-out-sine'
						});
					}
				};

				utils.normalRequest(request);
		},
		listProtocolGroup : function(obj){
			
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
					data : JSON.stringify($json),
					timeout : 60000,
					loading : {
						action : function() {
							$("<OPTION>").text("Loading...").appendTo(obj.target);
						}
					},
					error : function(e){
						$.LoadingOverlay("hide");
					},
					handle : function(response) {
						$.LoadingOverlay("hide");

						if(response.status != 0){
							$("<OPTION>").text("Loaded Fail").appendTo($select_status_way);
							return ;
						}
						obj.target.empty();
						$.each(response.data.list, function(index, value){
							$("<OPTION>").attr("value", value.id).text(value.name + " - " + value.sender).appendTo(obj.target);
						});
						
						
						obj.target.children().filter(function() {
							  return $(this).text()  == obj.selected + " - ";
						}).attr('selected', true);
					}
				};

				utils.normalRequest(request);
		},
		updateUserStatus : function(obj) {
			
			var request = {
					method : "POST",
					url : "./useremail/updateUserStatus",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify(obj),
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
						
						if(response.status == 0){
							$(".modal").modal('hide');
							$(".modal").remove();
						}
						
						mymailgroup.action.search(mymailgroup.condition.query);
					}
				};

				utils.normalRequest(request);
		},
		searchTemplate : function(obj) {
			
			var request = {
					method : "GET",
					url : "./userTemplate/searchTemplate",
					dataType : "json",
					contentType : "application/json",
					data : JSON.stringify($json),
					timeout : 60000,
					loading : {
					},
					error : function(ex){
						$.LoadingOverlay("hide");
					},
					handle : function(response) {
//						$.LoadingOverlay("hide");
						
						var $data = [];
						$.each(response.data.list, function(index, value){
					        $data.push({
					            "label": value.title,
					            "value": value.id
					        });
						});
						
						obj.target.setData($data);
					}
				};

				utils.normalRequest(request);
		},
		searchEvent : function(obj) {
			
			var request = {
					method : "GET",
					url : "./event/searchEvent",
					dataType : "json",
					contentType : "application/json",
					data : JSON.stringify($json),
					timeout : 60000,
					loading : {
					},
					error : function(ex){
						$.LoadingOverlay("hide");
					},
					handle : function(response) {
//						$.LoadingOverlay("hide");
						
						var $data = [];
						$.each(response.data, function(index, value){
					        $data.push({
					            "label": value.title,
					            "value": value.id
					        });
						});
						
						obj.target.setData($data);
					}
				};

				utils.normalRequest(request);
		},
		createEvent : function(obj) {
			
			var request = {
					method : "POST",
					url : "./event/createReceiverEvent",
					contentType : "application/json",
					dataType : "json",
					timeout : 60000,
					data : JSON.stringify(obj),
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
							obj.error(response.message);
							return ;
						}
						
						$(".modal").modal('hide');
						$(".modal").remove();
						
					}
				};

				utils.normalRequest(request);
		}
	},
	panel : {
		mymessage : function (data){
			
			var $wrapper = $("<DIV>");
			$wrapper.html("");

			var $cols = $("<DIV>").addClass("col-12").appendTo($wrapper);
			var $table_res = $("<DIV>").addClass("table-responsive").appendTo($cols);
			var $table = $("<TABLE>").addClass("table table-striped my-0").appendTo($table_res);
			
			$table.html("");
			
			var $thead = $("<THEAD>").appendTo($table);
            var $tr = $("<TR>").appendTo($thead);
            $("<TH>").text("Name").appendTo($tr);
            $("<TH>").text("").appendTo($tr);
            $("<TH>").html("Enable/Disable").appendTo($tr);
            $("<TH>").html("Public").appendTo($tr);
            $("<TH>").html("Status").appendTo($tr);
            $("<TH>").html("Event").appendTo($tr);
            $("<TH>").html("Recipients").appendTo($tr);
            $("<TH>").html("Updated Time").addClass("d-none d-xl-table-cell").appendTo($tr);
            $("<TH>").html("Action").appendTo($tr);
			
			var $edit_icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit align-middle mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
			var now = new Date();
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function(index, value) {
				
				var $id = value.id;
				var $groupName = value.name;
				var $description = value.description;
				
				var $modifyTime = Date.parse(value.modifyTime.replace(' ', 'T'));
				$modifyTime = $modifyTime - (now.getTimezoneOffset() * 60000);
				
				var $isdelete = 'Enable';
				var $enable_value = 0;
				switch(value.isdelete){
					case 0: 
						$isdelete = "<SPAN class='badge bg-secondary'>Close</SPAN>";
						$enable_value = 1;
						break;
					case 1: 
						$isdelete = "<SPAN class='badge bg-success'>Enable</SPAN>";
						$enable_value = 0;
						break;
					default:
						$isdelete = 'Unknow'
						break;
				}
				
				var $subscriber = undefined;
				var $isshare = '公開';
				var $share_value = 0;
				switch(value.share){
					case 0: 
						$isshare = "<SPAN class='badge bg-secondary'>Private</SPAN>";
						$share_value = 1;
						break;
					case 1: 
						$isshare = "<SPAN class='badge bg-success'>Public</SPAN>";
						$subscriber = '&nbsp; <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link align-middle mr-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
						$share_value = 0;
						$subscriber =$("<SPAN>").append($.parseHTML($subscriber));
						
						break;
					default:
						$isshare = '未知'
						break;
				}
				
				var $status = '';
				switch(value.status){
					case 0:
						$status = 'Initialized';
						break;
					case 1:
						$status = 'Finished';
						break;
					case 2:
						$status = 'Data Processing';
						break;
					case 4:
						$status = 'Error';
						break;
					default:
						$status = '';
						break;
					
				}

				var $tr = $("<TR>").appendTo($tbody);
				var $title = $("<TD>").html($groupName).appendTo($tr);
				
				var $edit_description = $("<TD>").appendTo($tr);
                $("<SPAN>").attr("data-toggle", "tooltip").attr("title", "Add Description").append($.parseHTML($edit_icon)).appendTo($edit_description);
                var $delete = $("<SPAN>").append($.parseHTML($isdelete));
                var $share = $("<SPAN>").append($.parseHTML($isshare));
                $("<TD>").html($delete).appendTo($tr);
                $("<TD>").append($share).append($subscriber).appendTo($tr);
                $("<TD>").text($status).appendTo($tr);
                
                var $tag_events = mymailgroup.panel.events(value.events);
                $("<TD>").append($tag_events).appendTo($tr);
                
                var $receivers =$("<TD>").html("<SPAN class='badge bg-info'>" + utils.formatNumber(value.receivers) + "</SPAN>").appendTo($tr);
                $("<TD>").addClass("d-none d-xl-table-cell").text($.format.date(new Date($modifyTime), 'yyyy-MM-dd HH:mm:ss')).appendTo($tr);
                var $info = $("<TD>").appendTo($tr);
                
                var $button = $("<DIV>").addClass("btn-group btn-group-sm").appendTo($info);
                $("<BUTTON>").attr("type", "button").addClass("btn btn-info dropdown-toggle")
                    .attr("data-bs-toggle", "dropdown").attr("aria-haspopup", "true")
                    .attr("aria-expanded", "false").text("Info").appendTo($button);
                var $button_menu = $("<DIV>").attr("mark", $id).addClass("dropdown-menu").appendTo($button);
                
                var $editor = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-edit'> Edit Name </i>").appendTo($button_menu);
                var $groupDelete = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-edit'> Delete Group </i>").appendTo($button_menu);
                
                var $bt_event = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-file-upload'></i> Add Event").appendTo($button_menu);
                
                if(value.authKey != undefined ){
                    $("<DIV>").addClass("dropdown-divider").appendTo($button_menu);
//                  var $subscriber = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-compass'> Subscriber Page </i>").appendTo($button_menu);
                    var $oauth = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-compass'> Subscriber Join API </i>").appendTo($button_menu);
                    
                }
                
                $("<DIV>").addClass("dropdown-divider").appendTo($button_menu);
                var $bt_upload = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-file-upload'></i> Upload Recipients").appendTo($button_menu);
				if(value.authKey != undefined ){
					$oauth.bind("click", function(){
						mymailgroup.panel.oauthKey(value);
					});
				}
				
				$editor.bind("click", function(){
					mymailgroup.panel.createClass(value);
				});
				
				$groupDelete.bind("click", function(){
					var $json ={
						id : $id
					}
					mymailgroup.action.removeGroup(value);
				});
				
				$bt_event.bind("click", function(){
					mymailgroup.panel.createEvent(value);
				});
				
				
				$receivers.hover( function (e) {
				    $(this).css("cursor", e.type === "mouseenter" ? "pointer":"hand" )
				});
				
				$receivers.bind("click", function(){
					$json ={
						gn : $groupName,
						groupId : $id
					}
					mymailgroup.action.search($json);
					
					$json ={
						groupId : $id
					}
					
					mymailgroup.action.listUserEmailRadio($json);
					
					if($id != undefined){
						mymailgroup.action.eventStatistics($json);
					}
				});
				
				
				
				$edit_description.hover( function (e) {
				    $(this).css("color", e.type === "mouseenter" ? "#CDCDCD":"#495057" );
				    $(this).css("cursor", e.type === "mouseenter" ? "pointer":"hand" )
				});
				$edit_description.bind("click", function(){
					var $json = {
							id : value.id,
							description : $description
						}
						mymailgroup.panel.editDescription($json);
				});
				
				if(value.status == 2){
					$delete.addClass("disabled").attr("aria-disabled", "true");
					$bt_upload.addClass("disabled").attr("aria-disabled", "true");
				}
				else {
					
					$delete.css({"cursor" : "pointer"});
					$delete.bind("click", function(){
						var $json = {
							id : value.id,
							status : $enable_value
						}
						
						mymailgroup.action.remove($json);
						
						if($enable_value == 0){
							var $json = {
								id : value.id,
								status : 0
							}
							
							mymailgroup.action.shareGroup($json);
						}
					});
				}
				
				$share.css({"cursor" : "pointer"});
				$share.bind("click", function(){
					
						if($share_value == 1 ){
							var $json = {
									id : value.id,
									status : 1
								}
								
								mymailgroup.action.remove($json);
						}
						
						var $json = {
							id : value.id,
							status : $share_value
						}
						
						mymailgroup.action.shareGroup($json);
				});
				
				if(value.share == 1){
					$subscriber.css({"cursor" : "pointer"});
					$subscriber.bind("click", function(){
						window.open('./subscribe/' + $groupName, '_blank');
					});
				}
				
				$bt_upload.bind("click", function () {
					var $json = {
							id : $id
					}
					mymailgroup.panel.uploadReceiver( $json );
				 });
			});
			
			var $tr = $("<TR>").appendTo($tbody);
			var $td =$("<TD>").attr("colspan", 9).attr("align", "center").appendTo($tr);
			
//			var $btn_group = $("<DIV>").addClass("btn-group mb-3").attr("role", "group").attr("aria-label", "Default button group").appendTo($td);
//			var $bt_class = $("<BUTTON>").attr("type", "button").addClass("btn btn-secondary").text("新增分類").appendTo($btn_group);
			
			return $wrapper;
			
		},
		searchResult : function (data){
			console.log(data)
			var $table = $("<TABLE>").addClass("table table-striped my-0");
			$table.html("");
			
			var $thead = $("<THEAD>").appendTo($table);
            var $tr = $("<TR>").appendTo($thead);
            $("<TH>").text("Name").appendTo($tr);
            $("<TH>").text("Phone").appendTo($tr);
            $("<TH>").text("Group").appendTo($tr);
            $("<TH>").text("Custom Tag").css({"width" : "30%"}).appendTo($tr);
            $("<TH>").text("Score").appendTo($tr);
            $("<TH>").text("Gender").appendTo($tr);
            $("<TH>").text("Status").appendTo($tr);
//          $("<TH>").text("Updated Time").addClass("d-none d-xl-table-cell").appendTo($tr);
            $("<TH>").text("").appendTo($tr)
            
            var now = new Date();
            var $tbody = $("<TBODY>").appendTo($table);
            $.each(data.list, function(index, value) {
                
                var $id = value.emailInfoId;
                var $_status = value.emailStatus;
                var $_gender = value.gender;
                var $_tags = value.tags;
                var $_subscriberStatus = value.subscriberStatus
                var $birth = value.birth;
                var $mobile = (value.mobile == undefined ) ? '-' : value.mobile;
                
//              var $modifyTime = Date.parse(value.modifyTime.replace(' ', 'T'));
//              $modifyTime = $modifyTime - (now.getTimezoneOffset() * 60000);
                
                var $gender = 'Unknown';
                switch($_gender){
                    case 0: 
                        $gender = 'Unknown';
                        break;
                    case 1: 
                        $gender = 'Male';
                        break;
                    case 2:
                        $gender = 'Female';
                        break;
                    default:
                        $gender = 'Unknown'
                        break;
                }
                
                var $_val_status = 0;
                var $status = $("<SPAN>").css({"cursor" : "pointer"});
                switch($_status){
                    case 0: 
                        $status.addClass("badge bg-secondary").text("Closed");
                        $_val_status = 1;
                        break;
                    case 1: 
                        $status.addClass("badge bg-success").text("Normal");
                        $_val_status = 0;
                        break;
                    default:
                        $status.addClass("badge bg-warning").text("Unknown");
                        break;
                }
				
				$status.bind("click", function () {
					var $json = {
							id : $id,
							status : $_val_status
						}
						
					mymailgroup.action.updateUserStatus($json);
				});
				
				var $email = value.email.toLowerCase();
				
				var $tags = $("<DIV>");
				$.each($_tags, function(index, tag) {
					
					var $id = tag.id;
					var $name = tag.name;
					var $value = tag.valuable;
					
					var $tag_button = $("<span>").addClass("badge rounded-pill bg-secondary position-relative ps-2 mx-1 mt-2").appendTo($tags);
					var $tag_text = $("<span>").text($name).appendTo($tag_button);
					var $tag_num = $("<SPAN>").addClass("position-absolute top-0 start-100 translate-middle badge rounded-pill  ")
						.text($value).appendTo($tag_button);
					
					var $close = $("<A>").appendTo($tag_button);
					 $("<I>").addClass("close fas fa-times mx-1").css({"font-size" : ".5rem"}).appendTo($close);
					
					 $close.hover( function (e) {
						    $(this).css("color", e.type === "mouseenter" ? "#CDCDCD":"#495057" );
						    $(this).css("cursor", e.type === "mouseenter" ? "pointer":"hand" )
						});
					 
					 $tag_text.hover( function (e) {
						    $(this).css("color", e.type === "mouseenter" ? "#CDCDCD":"#ffffff" );
						    $(this).css("cursor", e.type === "mouseenter" ? "pointer":"hand" )
						});
					 
					$close.bind("click", function () {
						var $json = {
								id : $id,
						}
							
						mymailgroup.action.removeTag($json);
					});
					
					$tag_text.bind("click", function () {
						var $json = {
							tagId : $id,
							name : $name,
							value : $value
						}
						
						mymailgroup.panel.tag($json);
					});
					
					if($value < 0){
						$tag_num.addClass("bg-danger");
					} else if($value == 0) {
						$tag_num.addClass("bg-primary");
					} else{
						$tag_num.addClass("bg-success");
					}
					$("<SPAN>").addClass("visually-hidden").text("unread messages").appendTo($tag_num);
				});
				
				var $newTag = $("<span>").attr("role", "button").addClass("badge rounded-pill bg-primary mx-1").text("+").appendTo($tags);
				$newTag.bind("click", function () {
					var $json = {
						id : $id
					}
					
					mymailgroup.panel.tag($json);
				});

				var span_unscriber;
				if($_subscriberStatus == 0){
					span_unscriber = $("<SPAN>").addClass("badge rounded-pill bg-danger mx-1").text("Unsubscribed");
				}
				
				var $tr = $("<TR>").appendTo($tbody);
				
				var $td_name = $("<TD>").text(value.name).append(span_unscriber).attr("data-toggle", "tooltip").attr("title", value.email).appendTo($tr);
				$("<TD>").text($mobile).appendTo($tr);
				$("<TD>").text(value.groupName).appendTo($tr);
//				$("<TD>").html("<A href='mailto:" + $email + "'>" + $email + "</A>").appendTo($tr);
				$("<TD>").append($tags).appendTo($tr);
				$("<TD>").append(value.valuable).appendTo($tr);
				$("<TD>").text($gender).appendTo($tr);
				$("<TD>").html($status).appendTo($tr);
//				$("<TD>").addClass("d-none d-xl-table-cell").text($.format.date(new Date($modifyTime), 'yyyy-MM-dd HH:mm:ss')).appendTo($tr);
				var $info = $("<TD>").attr("mark", $id).appendTo($tr);
				
				var $button = $("<DIV>").addClass("btn-group btn-group-sm").appendTo($info);
                $("<BUTTON>").attr("type", "button").addClass("btn btn-info dropdown-toggle")
                    .attr("data-bs-toggle", "dropdown").attr("aria-haspopup", "true")
                    .attr("aria-expanded", "false").text("Info").appendTo($button);
                var $button_menu = $("<DIV>").addClass("dropdown-menu").appendTo($button);
                var $edit = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-edit'> Edit </i>").appendTo($button_menu);
                var $copy = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-edit'> Copy to Other Group </i>").appendTo($button_menu);
                var $unjoin = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-edit'> Remove from Group </i>").appendTo($button_menu);
				$edit.bind("click", function () {
					var $json = {
						id : $id,
						groupUploadId : value.groupUploadId,
						name : value.name,
						gender : value.gender,
						email : $email,
						status : $_status,
						mobile : $mobile,
						birth : $birth
					}
					
					mymailgroup.panel.editReceiver($json);
				});
				
				$unjoin.bind("click", function () {
					var $json = {
						id : value.groupUploadId,
					}
					
					mymailgroup.action.unjoin($json);
				});
				
				$copy.bind("click", function () {
					var $json = {
						id : $id
					}
					mymailgroup.action.listMailGroup($json);
				});
				
				$td_name.hover( function (e) {
				    $(this).css("color", e.type === "mouseenter" ? "#CDCDCD":"#495057" );
				    $(this).css("cursor", e.type === "mouseenter" ? "pointer":"hand" )
				});
				$td_name.bind("click", function () {
					var $json = {
							id : $id,
							name : value.name
						}
						
						mymailgroup.action.listUserActivity($json);
					});
			});
			
			return $table;
		},
		unsubscriber : function (data){
			
			if(data.total == 0){
                return $("<SPAN>").text("Great, no one has unsubscribed.");
            }
            
            var $table = $("<TABLE>").addClass("table table-striped my-0");
            $table.html("");
            
            var $thead = $("<THEAD>").appendTo($table);
            var $tr = $("<TR>").appendTo($thead);
            $("<TH>").text("Name").appendTo($tr);
            $("<TH>").text("Gender").appendTo($tr);
            $("<TH>").text("Reason").appendTo($tr);
            $("<TH>").text("Updated Time").addClass("d-none d-xl-table-cell").appendTo($tr);
            $("<TH>").text("").appendTo($tr);
			
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function(index, value) {
				var $id = value.id;
				var $_gender = value.gender;
				
				var $gender = 'Unknown';
				switch($_gender){
					case 0: 
						$gender = 'Unknown';
						break;
					case 1: 
						$gender = 'Male';
						break;
					case 2:
						$gender = 'Female';
						break;
					default:
						$gender = 'Unknown'
						break;
				}
				
				var $email = value.email.toLowerCase();

				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").text(value.name).attr("data-toggle", "tooltip").css({"cursor" : "pointer"}).attr("title", $email).appendTo($tr);
				$("<TD>").text($gender).appendTo($tr);
				$("<TD>").text(value.reason).appendTo($tr);
				$("<TD>").html(value.createdTime).appendTo($tr);
				
				var $info = $("<TD>").attr("mark", $id).appendTo($tr);
				
				var $button = $("<DIV>").addClass("btn-group btn-group-sm").appendTo($info);
				$("<BUTTON>").attr("type", "button").addClass("btn btn-info dropdown-toggle")
					.attr("data-bs-toggle", "dropdown").attr("aria-haspopup", "true")
					.attr("aria-expanded", "false").text("Info").appendTo($button);
				var $button_menu = $("<DIV>").addClass("dropdown-menu").appendTo($button);
				var $edit = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-edit'> Remove </i>").appendTo($button_menu);
				
				$edit.bind("click", function(){
					
					var $json = {
						id : $id,
						status : 0
					}
					
					mymailgroup.action.updateSubscriberStatus($json);
				});
			});
			
			return $table;
		},
		userActivity : function (data){
			
			if(data.total == 0){
                return $("<SPAN>").text("Maybe send them an email to check in?");
            }
            
            var $table = $("<TABLE>").addClass("table table-striped my-0");
            $table.html("");
            
            var $thead = $("<THEAD>").appendTo($table);
            var $tr = $("<TR>").appendTo($thead);
            $("<TH>").text("Subject").appendTo($tr);
            $("<TH>").text("Opens").appendTo($tr);
            $("<TH>").text("Clicks").appendTo($tr);
			
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function(index, value) {
				var $subject = value.subject;
				var $_open = value.open;
				var $_click = value.click;
				
				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").text($subject).appendTo($tr);
				$("<TD>").text($_open).appendTo($tr);
				$("<TD>").text($_click).appendTo($tr);
				
			});
			
			return $table;
		},
		createClass : function(data){
			
			var $id, $subject='';
			$id = data.id;
			$subject = data.name;
			
			var $content_input = $("<DIV>");
            var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
                    .attr("role", "alert").appendTo($content_input);
            $("<I>").addClass("close fas fa-times mx-1").css({"font-size" : ".5rem"}).attr("data-bs-dismiss", "alert")
                    .attr("aria-label", "Close").appendTo($alert_message);
            var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
            $alert_message.hide();
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Define group name").appendTo($form_group);
            var $input_subject = $("<INPUT>").attr("type", "text")
                    .attr("size", 15).addClass("form-control form-control-lg mb-3").attr(
                            "placeholder", "My Group").attr("value", $subject).appendTo($form_group);
            
            
            var $title = ($id == undefined) ? "Add Group" : "Edit Group";
			
			var $upload_json = {
				id : $id
			}
			
			var $url = ($id == undefined ) ? data.url :  "./emailgroup/updateEmailGroup";
			
			var $fun = {
					title : $title,
					content : $content_input,
					save : function(){
						
						if($input_subject.val() == ''){
							$err.text("Group name is required");
							$alert_message.show();
							return ;
						}
						
						$alert_message.hide();
						var $json = {
							id : $id,
							name : $input_subject.val(),
							url : $url
						};
						
						mymailgroup.action.createClass($json);
						
					},
					saveButton : "Save"
			}
				
			module.pupopboot($fun);
		},
		editDescription : function(data){
			
			var $id, $subject='';
			$id = data.id;
			$subject = data.description;
			
			var $content_input = $("<DIV>");
            var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
                    .attr("role", "alert").appendTo($content_input);
            $("<I>").addClass("close fas fa-times mx-1").css({"font-size" : ".5rem"}).attr("data-bs-dismiss", "alert")
                    .attr("aria-label", "Close").appendTo($alert_message);
            var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
            $alert_message.hide();
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Add group description").appendTo($form_group);
            var $input_subject = $("<TEXTAREA>")
                    .attr("rows", 15).addClass("form-control form-control-lg mb-3").val($subject).appendTo($form_group);
            
            
            var $title = ($id == undefined) ? "Add Category" : "Group Description";
			var $fun = {
					title : $title,
					content : $content_input,
					save : function(){
						
						var $json = {
							id : $id,
							description : $input_subject.val()
						};
						
						mymailgroup.action.updateGropupDescription($json);
						
					},
					saveButton : "儲存"
			}
				
			module.pupopboot($fun);
		},
		oauthKey : function(data){
			
			var $id = data.id;
			var $subject = data.name;
			var $authKey = data.authKey;
			
			var $content_input = $("<DIV>");
			var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
					.attr("role", "alert").appendTo($content_input);
			$("<I>").addClass("close fas fa-times mx-1").css({"font-size" : ".5rem"}).attr("data-bs-dismiss", "alert")
					.attr("aria-label", "Close").appendTo($alert_message);
			var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
			$alert_message.hide();
			
			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("My Key").appendTo($form_group);
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
		uploadReceiver : function(obj) {
			
			var $content_input = $("<DIV>");
			
			$("<DIV>").text("Attention:").appendTo($content_input);
            var $ul = $("<UL>").appendTo($content_input);
            $("<LI>").html("Please enter recipient information according to the system format. It must be an Excel file. <a href='./example/agitg-receriver.xlsx'>Please refer to the format example for download</a>").appendTo($ul);
            $("<LI>").html("If the file is uploaded repeatedly, the system will re-record the email").appendTo($ul);
            $("<LI>").text("The system will remove incorrect email addresses and will not provide sending").appendTo($ul);
            $("<LI>").text("Large files require time to process. During this period, uploading and sending a large number of emails are not supported").appendTo($ul);
            
            var $form_group = $("<DIV>").addClass("col-xl-12 form-group h-25 d-inline-block").appendTo($content_input);
            var $fileloading = $("<DIV>").addClass("file-loading").appendTo($form_group);
            var $file = $("<INPUT>").attr("type", "file").attr("name", "file")
                .attr("id", "file").attr("multiple", '').appendTo($fileloading);
            
            $("<SMALL>").addClass("form-text text-muted").html("Please upload the email addresses of the recipients you want to send to").appendTo($form_group);
			
			
			var $link = './emailgroup/uploadEmailGroupReceiver' ;
			
			var $json = {
					id : obj.id 
			}
			var $fun = {
				title : "Upload Email Receiver",
				content : $content_input,
				displayCallback : function(){
					$file.fileinput({
					    	browseClass: "btn btn-primary btn-block",
					    	maxFilePreviewSize: 10240,
					        uploadUrl:  $link,
					        maxFileCount: 1,
					        uploadExtraData: $json,
					        hideThumbnailContent: true, 
					    	maxFilePreviewSize: 10240,
					    	showCaption:false,
					        dropZoneEnabled: false,
					        showUpload: false,
					        showRemove: false,
					        showPreview :true,
					        showBrowse:true,
					        showCaption:false,
					        showUpload: true,
					        uploadAsync: false,
					        showClose : false,
					        layoutTemplates:{
					        	actions: '<div class="file-actions">\n' +
					            '    <div class="file-footer-buttons">\n' +
					            '        {upload} {delete}' +
					            '    </div>\n' +
					            '    {drag}\n' +
					            '    <div class="clearfix"></div>\n' +
					            '</div>',
					        	actionZoom : '',
					            actionDelete: '<button type="button" class="kv-file-remove {removeClass}" title="{removeTitle}"{dataUrl}{dataKey}><i class="fas fa-trash-alt"></i></button>\n',
					            actionUpload: ''
					        },
					        allowedFileExtensions: ['xls', 'xlsx'],
					        removeFromPreviewOnError: true,
					  }).on('fileuploaded', function(event, previewId, index, fileId) {
					  }).on('fileuploaderror', function(event, data, msg) {
					  }).on('filebatchuploadcomplete', function(event, preview, config, tags, extraData) {
					        $(".modal").modal('hide');
							$(".modal").remove();
							
							mymailgroup.action.list();
					  });
				}
			}
			
			module.pupopboot($fun);
		},
		mailPie : function(obj) {
			
			var $mailType = [];
			var $radio = [];
			
			$.each(obj, function(index, value) {
				$mailType.push(value.emailType);
				$radio.push(value.num)
			});
			
			$("#emailTypePie").html("");
			var $canvas = $("<CANVAS>").appendTo($("#emailTypePie"));
			
			new Chart($canvas, {
				type: "pie",
				data: {
					labels: $mailType,
					datasets: [{
						data: $radio,
						backgroundColor: [
							window.theme.primary,
							window.theme.warning,
							window.theme.danger,
							window.theme.info,
							window.theme.success,
							window.theme.secondary,
							"#FF8C00",
							"#8B0000",
							"#00BFFF",
							"#DCDCDC"
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
		groupEventPie : function(obj) {
			
			var $mailType = [];
			var $radio = [];
			
			var $hasValue = false;  
			$.each(obj, function(index, value) {
				$mailType.push(value.type);
				$radio.push(value.num);
				
				if(value.num > 0) {
					$hasValue = true;
				} 
			});
			
			if(!$hasValue){
				obj.target.html("<div class='text-center'>No Data!</div>");
				return ;
			}
			
			var $canvas = $("<CANVAS>").appendTo(obj.target);
			
			new Chart($canvas, {
				type: "pie",
				data: {
					labels: $mailType,
					datasets: [{
						data: $radio,
						backgroundColor: [
							window.theme.primary,
							window.theme.warning,
							window.theme.danger,
							window.theme.info,
							window.theme.success,
							window.theme.secondary,
							"#FF8C00",
							"#8B0000",
							"#00BFFF",
							"#DCDCDC"
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
		groupEventBar : function(obj) {
			
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
					
					if(v1 == value.date){
						$isDup = true;
						return;
					}
				});
				
				if(!$isDup){
					$date.push(value.date);
				}
				
			});
			
			$.each($date, function(index, v1) {
				var $foundDate = false;
				$.each(obj, function(index, value) {
					if(v1 == value.date && value.type == 'click'){
						$foundDate = true;
						$click.push(value.num);
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
					if(v1 == value.date && value.type == 'open'){
						$foundDate = true;
						$open.push(value.num);
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
                        label: "Open Events",
                        backgroundColor: window.theme.primary,
                        borderColor: window.theme.primary,
                        hoverBackgroundColor: window.theme.primary,
                        hoverBorderColor: "#dee2e6",
                        data: $open,
                        barPercentage: .75,
                        categoryPercentage: .5
                    }, {
                        label: "Click Events",
                        backgroundColor: "#ffc107",
                        borderColor: "#ffc107",
                        hoverBackgroundColor: "#ffc107",
                        hoverBorderColor: "#dee2e6",
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
		editReceiver : function(data){
			
			var $content_input = $("<DIV>");
            var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
                    .attr("role", "alert").appendTo($content_input);
            $("<I>").addClass("close fas fa-times mx-1").css({"font-size" : ".5rem"}).attr("data-bs-dismiss", "alert")
                    .attr("aria-label", "Close").appendTo($alert_message);
            var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
            $alert_message.hide();
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Name").appendTo($form_group);
            var $input_name = $("<INPUT>").attr("type", "text")
                    .attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
                            "placeholder", "e.g., John Smith").attr("value", data.name).appendTo($form_group);
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Email Address").appendTo($form_group);
            var $input_email = $("<INPUT>").attr("type", "email")
                    .attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
                            "placeholder", "user@agitg.com").attr("value", data.email).appendTo($form_group);
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Mobile Number").appendTo($form_group);
            var $input_mobile = $("<INPUT>").attr("type", "number") 
                    .attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
                            "placeholder", "0978110221").attr("value", data.mobile).appendTo($form_group);
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Gender").appendTo($form_group);
            var $select_gender = $("<SELECT>").addClass("form-select form-select-lg").attr("aria-label", ".form-select-lg").appendTo($form_group);
            $("<OPTION>").attr("value", 0).text("Please Select").appendTo($select_gender);
            $("<OPTION>").attr("value", 1).text("Male").appendTo($select_gender);
            $("<OPTION>").attr("value", 2).text("Female").appendTo($select_gender);
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Birthday").appendTo($form_group);
            var $input_group = $("<DIV>").addClass("input-group mb-3").appendTo($form_group);
            var $select_birth_year = $("<SELECT>")
                .addClass("form-control form-select form-select-lg")
                .attr("aria-label", ".form-select-lg").appendTo($input_group);
			
			var $now = new Date();
			for(var $year = 1940; $year < $now.getFullYear(); $year++ ){
				$("<OPTION>").attr("value", $year).text($year + " ").appendTo($select_birth_year);
			}
			
			$select_birth_year.children().each(function(){
				if(data.birth == undefined){
					if ($(this).val() == 1980){
						 $(this).attr("selected", true);
					}
				} else {
					if ($(this).val() == data.birth.split("-")[0]){
				        $(this).attr("selected", true);
				    }
				}
			});
			
			var $select_birth_month = $("<SELECT>").addClass("form-control form-select form-select-lg")
				.attr("aria-label", ".form-select-lg").appendTo($input_group);
			for(var $month = 0; $month < 12; $month++ ){
				$("<OPTION>").attr("value", $month + 1).text(($month+1) + " ").appendTo($select_birth_month);
			}
			$select_birth_month.children().each(function(){
				if(data.birth == undefined){
					if ($(this).val() == 7){
						 $(this).attr("selected", true);
					}
				} else {
					if ($(this).val() == parseInt(data.birth.split("-")[1], 10)){
				        $(this).attr("selected", true);
				    }
				}
			});
			
			var $select_birth_date = $("<SELECT>").addClass("form-control form-select form-select-lg")
				.attr("aria-label", ".form-select-lg").appendTo($input_group);
			for(var $date = 1; $date < 31; $date++ ){
				$("<OPTION>").attr("value", $date).text($date + " ").appendTo($select_birth_date);
			}
			$select_birth_date.children().each(function(){
				if(data.birth == undefined){
					if ($(this).val() == 15){
						 $(this).attr("selected", true);
					}
				} else {
					if ($(this).val() == data.birth.split("-")[2]){
				        $(this).attr("selected", true);
				    }
				}
			});
			
			$select_gender.children().each(function(){
			    if ($(this).val() == data.gender){
			        $(this).attr("selected", true);
			    }
			});
			
			var $fun = {
					title : "Edit Receiver",
					content : $content_input,
					save : function(){
						
						var $birth = $select_birth_year.val()
										+ '-' + $select_birth_month.val()
										+ '-' + $select_birth_date.val();
						var $json = {
							    "id" : data.groupUploadId,
							    "name" :  $input_name.val(),
							    "gender" :  $select_gender.val(),
							    "email" : $input_email.val(),
							    "mobile" :  $input_mobile.val(),
							    "birth" : $birth
						};
						
						mymailgroup.action.updateUserInfo($json);
					},
					saveButton : "Update"
				}
				
				module.pupopboot($fun);
			
			return $content_input;
		},
		tag : function(data){
			
			var $content_input = $("<DIV>");
            var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
                    .attr("role", "alert").appendTo($content_input);
            $("<I>").addClass("close fas fa-times mx-1").css({"font-size" : ".5rem"}).attr("data-bs-dismiss", "alert")
                    .attr("aria-label", "Close").appendTo($alert_message);
            var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
            $alert_message.hide();
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Tag").appendTo($form_group);
            var $input_name = $("<INPUT>").attr("type", "text")
                    .attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
                            "placeholder", "e.g., Great Person").attr("value", data.name).appendTo($form_group);

            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Positive/Negative Rating").appendTo($form_group);
            var $score = $("<SMALL>").addClass("form-text text-muted").text(" 0").appendTo($form_group);
            var $input_value = $("<INPUT>").attr("type", "range")
                    .attr("min", -5).attr("max", 5).attr("step", 1).addClass("form-range")
                            .attr("value", 0).appendTo($form_group);
            
            $input_value.on("input", function() {
                $score.text( ' ' + $(this).val());
            });
            
            
            var $url = './userTag/create';
            var $title = 'Add New Tag';
            var $button = 'Add';
            if(data.value != undefined && data.value != '') {
                $input_value.attr("value", data.value);
                $score.text( ' ' + data.value);
                $url = "./userTag/updateValuable"   ;
                $title = 'Edit Tag';
                var $button = 'Update';
            }
			var $fun = {
					title : $title,
					content : $content_input,
					save : function(){
						
						var $json = {
						    "userEmailId" : data.id,
						    "id" : data.tagId,
						    "name" :  $input_name.val(),
						    "value" :  $input_value.val(),
						    "url" : $url
						};
						
						mymailgroup.action.addTag($json);
					},
					saveButton : $button
				}
				
				module.pupopboot($fun);
			
			return $content_input;
		},
		query : function(data){
			
			var $content_input = $("<DIV>");
            var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
                    .attr("role", "alert").appendTo($content_input);
            $("<I>").addClass("close fas fa-times mx-1").css({"font-size" : ".5rem"}).attr("data-bs-dismiss", "alert")
                    .attr("aria-label", "Close").appendTo($alert_message);
            var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
            $alert_message.hide();
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Recipient Group").appendTo($form_group);
            var $input_group = $("<INPUT>").attr("type", "text")
                    .attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
                            "placeholder", "e.g., My Friends Group").appendTo($form_group);
            
            if(data != undefined && data.gn != undefined){
                $input_group.val(data.gn);
            }
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Recipient Name").appendTo($form_group);
            var $input_name = $("<INPUT>").attr("type", "text")
                    .attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
                            "placeholder", "e.g., Name").appendTo($form_group);
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Email Address").appendTo($form_group);
            var $input_email = $("<INPUT>").attr("type", "text")
                    .attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
                            "placeholder", "e.g., john@gmail.com").appendTo($form_group);
            
            
            var $fun = {
                    title : "Search My Recipients",
                    content : $content_input,
                    save : function(){
                        
                        var $json = {
                                "gn" :  $input_group.val(),
                                "name" :  $input_name.val(),
                                "email" :  $input_email.val(),
                                "page" : 1,
                                "limit" : 20
                        };
                        
                        mymailgroup.action.search($json);
                    },
                    saveButton : "Search"
                }
				
				module.pupopboot($fun);
			
			return $content_input;
		},
		graph : function(obj){
			
			var $cols = $("<DIV>").addClass("col-12 col-lg-6");
			var $card = $("<DIV>").addClass("card").appendTo($cols);
			var $card_header = $("<DIV>").addClass("card-header").appendTo($card);
			var $card_title = $("<H5>").addClass("card-title").text(obj.title).appendTo($card_header);
			var $card_desc = $("<H5>").addClass("card-subtitle text-muted").text(obj.subtitle).appendTo($card_header);
			
			var $card_body = $("<DIV>").addClass("card-body").appendTo($card);
			obj.target.appendTo($card_body);
			
			return $cols;
		},
		myEmailgroup : function (data){
			
			var $content = $("<DIV>");
			
			var $table = $("<TABLE>").addClass("table table-striped my-0").appendTo($content);
			
			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("Name of group").appendTo($tr);
			$("<TH>").attr("align", "right").appendTo($tr);
			
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.info.list, function(index, value) {
				
				var $id = value.id;
				
				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").text(value.name).appendTo($tr);
				var $info = $("<TD>").attr("align", "right").appendTo($tr);
				
				var $copy = $("<BUTTON>").addClass("btn btn-success btn-sm ").text("Copy").appendTo($info);
				
				$copy.bind("click", function(){
					
					var $json = {
						groupId: $id,
						emailInfoId : data.emailInfoId
					}
		
					mymailgroup.action.copyToGroup($json);
					
				});
				
			});
			
			$("<NAV>").attr("aria-label", "Page navigation").attr("id", "pagging-mailgroup").appendTo($content);
			
			module.pagging({
				target : "pagging-mailgroup",
				records : data.info.total,
				link : function(param){
					mymail.action.listEnableMailGroup(param);
				},
				current : data.page,
				limit : data.limit
			});
			
			
			return $content;
			
		},
		createEvent : function(data){
			
			var $id;
			$id = data.id;
			
			var $content_input = $("<DIV>");
			
			var $alert_message = $("<DIV>").addClass("alert alert-danger d-flex align-items-center d-none ")
                    .attr("role", "alert").appendTo($content_input);
            $("<I>").addClass("fas fa-exclamation-triangle p-2 mx-2").appendTo($alert_message);
            var $err = $("<DIV>").addClass("").appendTo($alert_message);
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Sending Event").appendTo($form_group);
            var $icon = $("<ICON>").addClass("fas fa-calendar");
            var $select_event = module.autoComplete({minLength : 1,  placeholder : 'Search Event', url : "./event/searchEvent", result : "data"
                , param : { 'key': 'key', locale : 'zh_TW'} }).appendTo($form_group);
            
            var $input_group = $("<DIV>").addClass("input-group mb-3").appendTo($form_group);
            $("<SPAN>").addClass("input-group-text").append($icon).appendTo($input_group);
            $select_event.appendTo($input_group);
            
            if(data.event != undefined){
                $select_event.val(data.event);
                $select_event.attr("disabled", true).attr("readonly", true);
            }
            
            $("<DIV>").addClass("dropdown-divider").appendTo($form_group);
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Subject").appendTo($form_group);
            var $input_subject = $("<INPUT>").attr("type", "text")
                    .attr("size", 15).addClass("form-control form-control-lg mb-3").attr(
                            "placeholder", "Add a New Subject").appendTo($form_group);
            
            if(data.title != undefined){
                $input_subject.val(data.title);
                $input_subject.attr("disabled", true).attr("readonly", true);
            }
            
            var $form_group = $("<DIV>").addClass("form-group mb-3").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Sender").appendTo($form_group);
            var $select_sender = $("<SELECT>").addClass("form-select form-select-lg")
                    .attr("aria-label", ".form-select-lg").appendTo($form_group);
            
            if(data.protocol != undefined){
                $select_sender.val(data.protocol);
                $select_sender.attr("disabled", true).attr("readonly", true);
            }
            
            mymailgroup.action.listProtocolGroup({target : $select_sender, selected : data.protocol});
            
            var $form_group = $("<DIV>").addClass("form-group mb-3").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Choose a Template").appendTo($form_group);
            
            var $icon = (data.catalog != undefined) ? $('<I>').addClass("fas fa-solid fa-folder") : $('<I>').addClass("fas fa-solid fa-image");
            
            var $select_template = module.autoComplete({minLength : 2, url : "./userTemplate/searchTemplate", 
                placeholder : 'Search Template', result : "data.list",
                 param : { key: 'key' } }).appendTo($form_group);
            
            var $input_group = $("<DIV>").addClass("input-group mb-3").appendTo($form_group);
            $("<SPAN>").addClass("input-group-text").append($icon).appendTo($input_group);
            $select_template.appendTo($input_group);
            
            if(data.catalog != undefined){
                $select_template.val(data.catalog);
                $select_template.attr("disabled", true).attr("readonly", true);
            } else if(data.template != undefined){
                $select_template.val(data.template);
                $select_template.attr("disabled", true).attr("readonly", true);
            }

            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Choose a Send Time").appendTo($form_group);
            $("<DIV>").addClass("form-group").appendTo($form_group);
            $datetimepicker = $("<INPUT>").attr("TYPE", "text").addClass("form-control").appendTo($form_group);
			
			$datetimepicker.datetimepicker({
			     format:'H:i',
			     minDate:'-1970/01/01',
				 maxDate:'-1970/01/01',
			     inline:true
			});
			
			var $fun = {
					title : "New Event",
					content : $content_input,
					save : function(){
						
						if(data.event != undefined){
							$(".modal").modal('hide');
							return ;
						}
						
						$alert_message.addClass("d-none");
						var $catalogueId = '', $templateId = '' ; 
						
						if($select_template.attr("type") == 1){
							$catalogueId = $select_template.attr("key");
						} else if($select_template.attr("type") == 2) {
							$templateId = $select_template.attr("key");
						}
						
						var $startDate = '';
						if($datetimepicker.val() != '' ){
							$startDate = $datetimepicker.val() + ":00.000";
						}
						
						var date = new Date();
						var $json = {
							title : $input_subject.val(),
							emailGroupId : $id,
							protocolGroupId : $select_sender.val(),
							eventId : $select_event.attr("key"),
							catalogueId : $catalogueId,
							templateId : $templateId,
							timer : $startDate,
							offset : date.getTimezoneOffset(),
							error : function(msg){
								$err.text(msg);
								$alert_message.removeClass("d-none");
								return ;
							}
						};
//						console.log($json);
						mymailgroup.action.createEvent($json);
						
					},
			}
			
			if(data.event == undefined){
				$fun['saveButton'] = "Create"
			} else {
				$fun['saveButton'] = "Close"
			}
				
			module.pupopboot($fun);
		},
		events : function(obj){
			
			var $tags = $("<DIV>");
			$.each(obj, function(index, tag) {
				
				var $id = tag.id;
				var $name = tag.name;
				
				var $tag_button = $("<span>").addClass("badge rounded-pill bg-primary position-relative ps-2 mx-1 mt-2").appendTo($tags);
				var $tag_text = $("<span>").text($name).appendTo($tag_button);
				
				var $close = $("<A>").appendTo($tag_button);
				 $("<I>").addClass("close fas fa-times mx-1").css({"font-size" : ".5rem"}).appendTo($close);
				
				 $close.hover( function (e) {
					    $(this).css("color", e.type === "mouseenter" ? "#CDCDCD":"#495057" );
					    $(this).css("cursor", e.type === "mouseenter" ? "pointer":"hand" )
					});
				 
				 $tag_text.hover( function (e) {
					    $(this).css("color", e.type === "mouseenter" ? "#CDCDCD":"#ffffff" );
					    $(this).css("cursor", e.type === "mouseenter" ? "pointer":"hand" )
					});
				 
				$close.bind("click", function () {
					var $json = {
						id : $id,
						success : function(){
							$tag_button.remove();
						}
					}
						
					mymailgroup.action.removeEvent($json);
				});
				
				$tag_text.bind("click", function () {
					var $json = {
						id : $id,
						title : tag.title,
						name : $name,
						protocol : tag.protocol,
						event : tag.name,
						catalog : tag.catalog,
						template : tag.template
					}
					
					mymailgroup.panel.createEvent($json);
				});
				
			});
			
			return $tags;
		}
		
	}
}