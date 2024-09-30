/**
 * 
 */
var agitg = {

	subscriber : function(data) {

		var xhr = new XMLHttpRequest();
		xhr.open("POST", "https://agitg.com/subscribe/email/v1/send", true);
		xhr.responseType = 'json';
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onload = function() {
			if (this.status == 200) {
				
				if (xhr.getResponseHeader('content-type') === 'application/json') {

					var result = xhr.response;

					if (data.callback && typeof (data.callback) === "function") {

						if(result.status != 0){
							data.error(result.message);
						}
						else {
							data.callback(result);
						}
						
					}
				}
			} else {
				if (data.error && typeof (data.error) === "function") {
					data.error(this.status + ": " + this.statusText);
				}
			}
		}

		xhr.onerror = function() {
			if (data.error && typeof (data.error) === "function") {
				data.error("Agitg Request failed");
			}
		};

		var $json = {}
		$json['key'] = data.key;
		$json['email'] = data.email;
		$json['name'] = data.name;
		$json['gender'] = data.gender;
		$json['mobile'] = data.mobile;

		xhr.send(JSON.stringify($json));

	}
}