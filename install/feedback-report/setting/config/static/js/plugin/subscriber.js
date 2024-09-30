/**
 * 
 */
$(document).ready(function() {

	$("#send").bind("click", function() {

		var $pathname = window.location.pathname;
		
		const myArray = $pathname.split("/");
		
		var $json = {
			id : myArray[4],
			reason : $("#reason option:selected").text()
		};

		subscriber.action.revoke($json);

	});

});

var subscriber = {
	condition : {
		list : {}
	},

	action : {

		revoke : function(obj) {
			var request = {
				method : "POST",
				url : "../email/revoke",
				dataType : "json",
				contentType : "application/json",
				data : JSON.stringify(obj),
				timeout : 60000,
				loading : {
					target : 'pageInfo'
				},
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