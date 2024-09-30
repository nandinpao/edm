/**
 * 
 */

var module = {

	pupopboot : function(obj) {

		if(obj.isOnly == undefined || obj.isOnly){
			$(".modal").modal('hide');
		}
		
		var $wrapper = $("<DIV>").addClass("modal fade")
				.attr("data-bs-backdrop", "static").attr("data-bs-keyboard", "false")
				.attr("data-keyboard", "false").attr("role", "dialog")
				.attr("aria-labelledby", "staticBackdropLabel");
		
		if(obj.id != undefined){
			$wrapper.attr("id", obj.id);
		}

		var $dialog = $("<DIV>").addClass("modal-dialog").attr("role", "document").appendTo($wrapper);
		var $content = $("<DIV>").addClass("modal-content").appendTo($dialog);

		var $header = $("<DIV>").addClass("modal-header").appendTo($content);
		var $header_title = $("<H5>").addClass("modal-title").attr("id", "staticBackdropLabel").text(obj.title)
				.appendTo($header);
		var $button = $("<I>").addClass("close fas fa-times mx-1").css({"font-size" : "1.0rem"})
				.attr("data-bs-dismiss", "modal").attr("aria-label", "Close")
				.appendTo($header);
		
		$button.hover( function (e) {
		    $(this).css("color", e.type === "mouseenter" ? "#CDCDCD":"#495057" );
		    $(this).css("cursor", e.type === "mouseenter" ? "pointer":"hand" )
		});

		var $body = $("<DIV>").addClass("modal-body").html(obj.content)
				.appendTo($content);

		var $footer = $("<DIV>").addClass("modal-footer").appendTo($content);

		if (obj.remove != undefined) {
			var $button = $("<BUTTON>").attr("type", "button").addClass(
					"btn btn-danger").text(data.common.remove)
					.appendTo($footer);

			$button.bind("click", function() {
				if (obj.remove && typeof (obj.remove) === "function") {
					obj.remove();
				}
			});
		}

		if (obj.save != undefined) {
			var $button = $("<BUTTON>").attr("type", "button").addClass(
					"btn btn-primary").text(obj.saveButton).appendTo($footer);

			$button.bind("click", function() {
				if (obj.save && typeof (obj.save) === "function") {
					obj.save();
				}
			});
		}

		$wrapper.on('shown.bs.modal', function() {
			if (obj.displayCallback
					&& typeof (obj.displayCallback) === "function") {
				obj.displayCallback();
			}
		});

		$wrapper.modal('show');

	},
	confirm : function(title, content_input, callback, displayCallback) {

		if(obj.isOnly == undefined || obj.isOnly){
			$(".modal").modal('hide');
		}

		var $wrapper = $("<DIV>").addClass("modal").attr("tabindex", -1).attr(
				"role", "dialog").attr("aria-labelledby", "myModalLabel").attr(
				"aria-hidden", "true");

		var $dialog = $("<DIV>").addClass("modal-dialog").appendTo($wrapper);
		var $content = $("<DIV>").addClass("modal-content").appendTo($dialog);

		var $header = $("<DIV>").addClass("modal-header").appendTo($content);
		var $header_title = $("<H5>").addClass("modal-title").text(obj.title)
				.appendTo($header);
		var $button = $("<BUTTON>").attr("type", "button").addClass("btn-close")
				.attr("data-bs-dismiss", "modal").attr("aria-label", "Close")
				.appendTo($header);

		var $body = $("<DIV>").addClass("modal-body").html(content_input)
				.appendTo($content);

		var $footer = $("<DIV>").addClass("modal-footer").appendTo($content);

		var $button = $("<BUTTON>").attr("type", "button").addClass(
				"btn btn-primary").text("確認").appendTo($footer);

		$button.bind("click", function() {
			if (callback && typeof (callback) === "function") {
				callback();

				$(".modal").modal('hide');
//				$(".modal-backdrop").remove();
				$(".modal").remove();
			}
		});

		var $button = $("<BUTTON>").attr("type", "button").addClass(
				"btn btn-default").attr("data-dismiss", "modal").text("取消")
				.appendTo($footer);

		$wrapper.on('shown.bs.modal', function() {
			if (displayCallback && typeof (displayCallback) === "function") {
				displayCallback();
			}
		});

		$wrapper.modal('show');

	},
	pagging : function(obj){
		
		var $total = (obj.records % obj.limit == 0) ? (obj.records / obj.limit) : Math.ceil(obj.records/obj.limit);
		
		$("#" + obj.target).empty(); 
		$("#" + obj.target).removeData("twbs-pagination"); 
		$("#" + obj.target).unbind("page"); 
		 
		$("#" + obj.target).twbsPagination({
	        totalPages: $total,
	        visiblePages: 5,
	        itemOnPage: obj.limit,
	        startPage: obj.current,
	        initiateStartPageClick: false,
	        hideOnlyOnePage: true,
	        first: '<< ',
	        prev : "<",
	        last: ' >>',
	        next : "> ",
	        onPageClick: function (event, page) {
	        	
	        	if (obj.link && typeof (obj.link) === "function") {
	        		
					var $param = {
						page : page,
						limit: obj.limit
					}
					
					obj.link($param);
					
					$('body').scrollTo('#' + obj.anchor);
				}
	        	
	        }
	    });
	},
	autoComplete : function(obj){
		
		var $select_template = $("<INPUT>").attr("type", "text")
			.attr("autocomplete", "off").addClass("form-control").attr(
				"placeholder", obj.placeholder);
	
		$select_template.autoComplete({
			minLength: obj.minLength,
			resolver: 'custom',
			formatResult: function (item) {
				
				$select_template.attr("key", item.id);
				$select_template.attr("type", item.type);
				
				if(item.type == 1){
					return {
						value: item.id,
						text: item.text,
						html: [ 
								$('<I>').addClass("fas fa-solid fa-folder").css("height", 18), ' ',
								item.text 
							] 
					};
				} else if(item.type == 2){
					return {
						value: item.id,
						text: item.text,
						html: [ 
								$('<I>').addClass("fas fa-solid fa-image").css("height", 18), ' ',
								item.text 
							] 
					};
				}
			},
			events: {
		        search: function (qry, callback) {
		        	
		        	var $param = $.extend(true, {}, obj.param);
		        	
		        	$param[obj.param.key] = $select_template.val();
		        	
		            $.ajax(obj.url,
		                {
							data: $param
						}
		            ).done(function (res) {
		                callback(utils.getProperty(res, obj.result))
		            });
		        }
		    }
		});
		return $select_template;
	}
}