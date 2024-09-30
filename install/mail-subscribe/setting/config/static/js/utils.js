var utils = {
	urlString : function(sParam) {
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				return sParameterName[1];
			}
		}
	},
	normalRequest : function(request) {
		var $target = (request.target == undefined) ? 'BODY' : request.target;

		$.ajax({
			type : request.method,
			url : request.url,
			data : request.data,
			contentType : request.contentType,
			beforeSend : function() {

				if (request.loading != undefined
						&& request.loading.action != undefined
						&& typeof (request.loading.action) === "function") {
					request.loading.action();
				} else if (request.loading != undefined
						&& request.loading.target != undefined) {
					$("#" + request.loading.target).LoadingOverlay("show", {
						image : "./img/loading/preloader.gif"
					});
				}
				// else {
				// $.LoadingOverlay("show", {
				// image : "./img/loading/preloader.gif"
				// });
				// }

			},
			timeout : request.timeout,
			success : function(response) {

				if (request.loading != undefined
						&& request.loading.target != undefined) {
					$("#" + request.loading.target).LoadingOverlay("hide");
				} else {
					$.LoadingOverlay("hide");
				}

				var $status = response.status;

				if ($status != 0) {

					if ($status == 100) {
						window.location.href = "./login";
						return;
					}

					if ($status == 101) {
						window.location.href = "./mysmtp";
						return;
					}

				}

				if (request.reload && typeof (request.reload) === "function") {
					request.reload();
				}

				if (request.handle && typeof (request.handle) === "function") {
					request.handle(response);
				}

			},
			error : function(e) {

				console.log(JSON.stringify(e));

				if (request.error && typeof (request.error) === "function") {
					request.error(e);
				}

				if (request.loading != undefined
						&& request.loading.target != undefined) {
					$("#" + request.loading.target).LoadingOverlay("hide");
				} else {
					$.LoadingOverlay("hide");
				}

			},
			done : function(e) {

			}
		});
	},
	getProperty : function(o, s) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to
		// properties
		s = s.replace(/^\./, ''); // strip leading dot
		var a = s.split('.');
		while (a.length) {
			var n = a.shift();
			if (n in o) {
				o = o[n];
			} else {
				return;
			}
		}
		return o;
	},
	menuSelected : function() {
		var $pageList = document.location.pathname.match(/[^\/]+$/);
		if ($pageList == null) {
			return;
		}

		var $pageURL = "./" + ($pageList[0]);

		$(".sidebar-nav li").each(function(index) {
			$(this).removeClass('active')
			$(this).parent().removeClass('show');
		});

		$(".sidebar-link").each(function(index) {
			var $page = $(this).attr("href");

			if ($pageURL == $page) {
				$(this).parent().addClass("active");
				var $parent_tag = $(this).parent().parent().get(0).tagName;

				if ($parent_tag == 'UL') {
					$(this).parent().parent().addClass('show');
					$(this).parent().parent().parent().addClass('active');
				}
			}
		});
	},
	parseHumpReg : function(str) {
		if (typeof str !== 'string') {
			return str;
		}

		var $strLowercase = str.toLowerCase();

		return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
	},
	formatCurrency : function(num) {
		num = num.toString().replace(/\$|\,/g, '');
		if (isNaN(num))
			num = "0";
		sign = (num == (num = Math.abs(num)));
		num = Math.floor(num * 100 + 0.50000000001);
		cents = num % 100;

		num = Math.floor(num / 100).toString();

		if (cents < 10)
			cents = "0" + cents;

		for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
			num = num.substring(0, num.length - (4 * i + 3)) + ','
					+ num.substring(num.length - (4 * i + 3));

		return (((sign) ? '' : '-') + '$ ' + num + '.' + cents);
	},
	formatNumber : function(num) {
		num = num.toString().replace(/\$|\,/g, '');
		if (isNaN(num))
			num = "0";
		sign = (num == (num = Math.abs(num)));
		num = Math.floor(num * 100 + 0.50000000001);
		cents = num % 100;

		num = Math.floor(num / 100).toString();

		if (cents < 10)
			cents = "0" + cents;

		for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
			num = num.substring(0, num.length - (4 * i + 3)) + ','
					+ num.substring(num.length - (4 * i + 3));

		return (((sign) ? '' : '-') + num);
	},
	showMonthFirstDay : function(year, month) {
		var MonthFirstDay = new Date(year, month, 1);
		return MonthFirstDay;
	},
	dayOfWeeek : function(day) {
		var week_day = '';
		switch (day) {
			case 0 :
				week_day = data.common.week.sunday;
				break;
			case 1 :
				week_day = data.common.week.monday;
				break;
			case 2 :
				week_day = data.common.week.tuesday;
				break;
			case 3 :
				week_day = data.common.week.wednesday;
				break;
			case 4 :
				week_day = data.common.week.thursday;
				break;
			case 5 :
				week_day = data.common.week.friday;
				break;
			case 6 :
				week_day = data.common.week.saturday;
				break;
		}
		return week_day;

	},
	dayOfFullWeeek : function(day) {
		var week_day = '';
		switch (day) {
			case 0 :
				week_day = lang.common.fullweek.sunday;
				break;
			case 1 :
				week_day = lang.common.fullweek.monday;
				break;
			case 2 :
				week_day = lang.common.fullweek.tuesday;
				break;
			case 3 :
				week_day = lang.common.fullweek.wednesday;
				break;
			case 4 :
				week_day = lang.common.fullweek.thursday;
				break;
			case 5 :
				week_day = lang.common.fullweek.friday;
				break;
			case 6 :
				week_day = lang.common.fullweek.saturday;
				break;
		}
		return week_day;

	},
	copy : function(obj) {
		var copyTest = document.queryCommandSupported('copy');
		var $elOriginalText = obj.target.attr('data-bs-original-title');

		if (copyTest === true) {
			var copyTextArea = document.createElement("textarea");
			copyTextArea.value = obj.text;
			document.body.appendChild(copyTextArea);
			copyTextArea.select();
			var successful = undefined;
			
			try {
				successful = document.execCommand('copy');
			} catch (err) {
				console.log('Oops, unable to copy');
				return false;
			}
			
			document.body.removeChild(copyTextArea);
			obj.target.attr('data-bs-original-title', '點我複製');
			
			try{
				var msg = successful ? '已複製' : 'Whoops, not copied!';
				obj.target.attr('data-bs-original-title', msg).tooltip('show');
			} catch (err) {
				console.log('Oops, unable to copy');
			}
			
			return true;
			

		} else {
			window.prompt("Copy to clipboard: Ctrl+C or Command+C, Enter",
					obj.text);
		}
	},
	randomColor : function randomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

}

var dateUtils = {
	happendTimerDisplay : function($seconds) {

		var $hours = $seconds / (60 * 60);

		var $result = "";

		if (Math.floor($hours) > 0) {
			$result += Math.floor($hours) + " 小時";
			$seconds -= ($hours * 60 * 60)
			return $result + "前";
		}

		var $mins = $seconds / 60;
		if (Math.floor($hours) <= 0 && Math.ceil($mins) >= 0) {
			$result += Math.floor($mins) + " 分鐘";
			$seconds -= ($mins * 60);

			return $result + "前";
		}

	},
	paserDate : function(tmpDate) {
		var stringOrdertime = (tmpDate).split(" ");
		var stringDate = (stringOrdertime[0]).split("-");

		return new Date(stringDate[0], stringDate[1] - 1, stringDate[2]);
	},
	paserDatetime : function(tmpDate) {
		var stringOrdertime = (tmpDate).split(" ");
		var stringDate = (stringOrdertime[0]).split("-");
		var stringTime = (stringOrdertime[1]).split(":");

		return new Date(stringDate[0], stringDate[1] - 1, stringDate[2],
				stringTime[0], stringTime[1], stringTime[2]);
	},
	paserTime : function(tmpDate) {
		var stringTime = tmpDate.split(":");

		var flag = 0;
		var hour = 0;
		if (stringTime[0] != 12 && stringTime[2].indexOf("PM") > 0) {
			flag = 12;
		}

		if (stringTime[2].indexOf("AM") > 0 && stringTime[0] == 12) {
			hour = 0;
		} else {
			hour = stringTime[0];
		}

		var date = new Date(0, 0, 1);

		date.setUTCHours(parseInt(hour) + flag
				+ (date.getTimezoneOffset() / 60), parseInt(stringTime[1]), 0);

		return date;
	}
}