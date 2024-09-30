/**
 * 
 */
$(document).ready(function() {

	$("#send").bind("click", function() {

		var $json = {
			id : $("#group").val(),
			name : $("#name").val(),
			email : $("#email").val(),
			mobile : $("#mobile").val(),
			gender : $("#gender").val()
		};

		subscriber.action.order($json);

	});

});

var subscriber = {
	condition : {
		list : {}
	},

	action : {

		order : function(obj) {
			var request = {
				method : "POST",
				url : "../emailgroup/subscribe",
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

					$("#subscriberInfo").addClass("visually-hidden");
					$("#welcomeInfo").removeClass("visually-hidden");

				}
			};

			utils.normalRequest(request);
		}
	}
}