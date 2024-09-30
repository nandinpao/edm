/**
 * 
 */
var setting = {

	action : {

		list : function(obj) {

			var request = {
				method : "POST",
				url : "./useremail/userOauthKey",
				dataType : "json",
				contentType : "application/json",
				timeout : 60000,
				loading : {
					target : 'pageInfo'
				},
				error : function(e) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {
					console.log(response);
					$.LoadingOverlay("hide");

					setting.panel.authPage(response.data);

				}
			};

			utils.normalRequest(request);

		}
	},
	panel : {
		authPage : function(obj) {

			var $target = $("#pageInfo")
			var $wrapper = $("<DIV>").addClass("input-group").appendTo($target);

			var $input = $("<INPUT>").attr("type", "text").attr("readonly", true).attr("ID", "oauthkey").addClass(
					"form-control").val(obj.key).appendTo($wrapper);
			var $span = $("<SPAN>").addClass("input-group-btn").appendTo(
					$wrapper);
			var $copy = $("<button>").attr("type", "button").text("Copy").attr(
					"data-toggle", "tooltip").attr("data-bs-original-title", "點我複製").addClass(
							"btn btn-secondary").appendTo($span);

			$("<small>").addClass("card-text").html("開發使用網站 Mail 訂閱者，可參考相關API的使用方式").appendTo($target);
			
			$copy.tooltip();
			$copy.bind('click', function() {

				utils.copy({
					text : $input.val(),
					target : $(this)
				});

			});

		}
	}
}