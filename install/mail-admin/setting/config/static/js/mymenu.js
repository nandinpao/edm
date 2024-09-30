/**
 * 
 */
var mymenu = {
	
	action : {
		
		list : function(obj){
			
			var request = {
					method : "POST",
					url : "./useremail/listUserWebMenu",
					contentType : "application/json",
					dataType : "json",
					timeout : 5000,
					loading : {
						target : "menu"
					},
					error : function(e){
						console.log(e);
						$.LoadingOverlay("hide");
					},
					handle : function(response) {

						if(response.status != 0){
							$("#error").show();
							$("#error").text(response.message);
							return ;
						}
						
						mymenu.panel.myMenu(response.data);
						
						utils.menuSelected();
						
					}
				};

				utils.normalRequest(request);
		}
		
	},
	panel : {
		myMenu : function (data){
			
			var $ul = $("#menu").addClass("sidebar-nav");
			$("<LI>").addClass("sidebar-header").text("Management").appendTo($ul);
			
			var $arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right align-middle mr-2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
			
			$.each(data, function(index, value) {
				var	$li;
				
				if(value.children == null || value.children == undefined){
					
					var	$li = $("<LI>").addClass("sidebar-item").appendTo($ul);
					var $href = $("<A>").attr("href", value.link).addClass("sidebar-link").appendTo($li);
//					$("<i>").addClass("align-middle").attr("data-feather", value.icon).appendTo($href);
					
					$href.append($.parseHTML(value.icon));
					
					$("<SPAN>").addClass("align-middle").text(value.name).appendTo($href);;
				}
				else if(value.children.length > 0){
					
					var	$li = $("<LI>").addClass("sidebar-item").appendTo($ul);
					var $href = $("<A>").attr("href", "#" + value.link).attr("data-bs-toggle", "collapse").addClass("sidebar-link collapsed").appendTo($li);
//					$("<i>").addClass("align-middle").attr("data-feather", value.icon).appendTo($href);
					
					$href.append($.parseHTML(value.icon));
					
					$("<SPAN>").addClass("align-middle").text(value.name).appendTo($href);
					
					var $ul_submenu = $("<UL>").attr("id", value.link).addClass("sidebar-dropdown list-unstyled collapse")
						.attr("data-bs-parent", "#sidebar").appendTo($li);
					
					$.each(value.children, function(index, value) {
						
						var	$li = $("<LI>").addClass("sidebar-item").appendTo($ul_submenu);
						var $href = $("<A>").attr("href", value.link).addClass("sidebar-link").text(value.name).appendTo($li);
					});
					
				}
				
				if(value.icon == 'sliders'){
					$li.addClass("active");
				}
			})
			
		}
		
	}
		
}