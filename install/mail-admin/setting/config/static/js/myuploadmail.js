/**
 * 
 */

var myuploadmail = {
	condition: {
		query: {}
	},
	action: {

		list: function (obj) {

			var $page, $limit;
			if (obj == undefined) {
				$page = 1;
				$limit = 20;
			} else {
				$page = obj.page;
				$limit = obj.limit;
			}

			var $json = {
				page: $page,
				limit: $limit
			}

			var $gn = (obj == undefined || obj.gn == undefined) ? "" : obj.gn;
			var $name = (obj == undefined || obj.name == undefined) ? "" : obj.name;
			var $email = (obj == undefined || obj.email == undefined) ? "" : obj.email;

			var request = {
				method: "GET",
				url: "./useremail/listUserEmail?gn=" + $gn + "&name=" + $name + "&email=" + $email + "&page=" + $page + "&limit=" + $limit,
				contentType: "application/json",
				dataType: "json",
				timeout: 60000,
				loading: {
					action: function () {
						$.LoadingOverlay("show", {
							image: "./img/loading/preloader.gif"
						});
					}
				},
				error: function (e) {
					$.LoadingOverlay("hide");
				},
				handle: function (response) {

					console.log(response)
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					if (response.status == 0) {
						$(".modal").modal('hide');
						$(".modal").remove();
					}

					myuploadmail.panel.mymessage(response.data);

					var $param = {
						gn: $gn, name: $name, email: $email, page: $page,
						limit: $limit
					};

					myuploadmail.condition.query = $param;

					module.pagging({
						target: "pagging",
						anchor: "mytable",
						records: response.data.total,
						para: myuploadmail.condition.query,
						link: function (param) {
							//								Object.assign(param, myuploadmail.condition.query);
							myuploadmail.action.list(param);
						},
						current: $page,
						limit: $limit
					});
				}
			};

			utils.normalRequest(request);
		},
		updateUserInfo: function (obj) {

			var request = {
				method: "POST",
				url: "./useremail/updateUserInfo",
				contentType: "application/json",
				dataType: "json",
				timeout: 60000,
				data: JSON.stringify(obj),
				loading: {
					action: function () {
						$.LoadingOverlay("show", {
							image: "./img/loading/preloader.gif"
						});
					}
				},
				error: function (e) {
					$.LoadingOverlay("hide");
				},
				handle: function (response) {
					console.log(response);
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					if (response.status == 0) {
						$(".modal").modal('hide');
						$(".modal").remove();
					}

					myuploadmail.action.list(myuploadmail.condition.query);
				}
			};

			utils.normalRequest(request);
		},
		updateUserStatus: function (obj) {

			var request = {
				method: "POST",
				url: "./useremail/updateUserStatus",
				contentType: "application/json",
				dataType: "json",
				timeout: 60000,
				data: JSON.stringify(obj),
				loading: {
					action: function () {
						$.LoadingOverlay("show", {
							image: "./img/loading/preloader.gif"
						});
					}
				},
				error: function (e) {
					$.LoadingOverlay("hide");
				},
				handle: function (response) {
					console.log(response);
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					if (response.status == 0) {
						$(".modal").modal('hide');
						$(".modal").remove();
					}

					myuploadmail.action.list(myuploadmail.condition.query);
				}
			};

			utils.normalRequest(request);
		},
		addTag: function (obj) {

			var request = {
				method: "POST",
				url: "./userTag/create",
				contentType: "application/json",
				dataType: "json",
				timeout: 60000,
				data: JSON.stringify(obj),
				loading: {
					action: function () {
						$.LoadingOverlay("show", {
							image: "./img/loading/preloader.gif"
						});
					}
				},
				error: function (e) {
					$.LoadingOverlay("hide");
				},
				handle: function (response) {
					console.log(response);
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					if (response.status == 0) {
						$(".modal").modal('hide');
						$(".modal").remove();
					}

					myuploadmail.action.list(myuploadmail.condition.query);
				}
			};

			utils.normalRequest(request);
		},
		removeTag: function (obj) {

			var request = {
				method: "POST",
				url: "./userTag/remove",
				contentType: "application/json",
				dataType: "json",
				timeout: 60000,
				data: JSON.stringify(obj),
				loading: {
					action: function () {
						$.LoadingOverlay("show", {
							image: "./img/loading/preloader.gif"
						});
					}
				},
				error: function (e) {
					$.LoadingOverlay("hide");
				},
				handle: function (response) {
					console.log(response);
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					if (response.status == 0) {
						$(".modal").modal('hide');
						$(".modal").remove();
					}

					myuploadmail.action.list(myuploadmail.condition.query);
				}
			};

			utils.normalRequest(request);
		},
	},
	panel: {
		mymessage: function (data) {

			var $table = $("#mytable");
			$table.html("");

			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("Name").appendTo($tr);
			$("<TH>").text("Group").appendTo($tr);
			$("<TH>").text("Tag").appendTo($tr);
			$("<TH>").text("Gender").appendTo($tr);
			$("<TH>").text("Status").appendTo($tr);
			//			$("<TH>").text("更新時間").addClass("d-none d-xl-table-cell").appendTo($tr);
			$("<TH>").text("").appendTo($tr)

			var now = new Date();
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function (index, value) {

				var $id = value.emailInfoId;
				var $_status = value.emailStatus;
				var $_gender = value.gender;
				var $_tags = value.tags;

				//				var $modifyTime = Date.parse(value.modifyTime.replace(' ', 'T'));
				//				$modifyTime = $modifyTime - (now.getTimezoneOffset() * 60000);

				var $gender = 'Unknown';
				switch ($_gender) {
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
				var $status = $("<SPAN>").css({ "cursor": "pointer" });
				switch ($_status) {
					case 0:
						$status.addClass("badge bg-secondary").text("Close");
						$_val_status = 1;
						break;
					case 1:
						$status.addClass("badge bg-success").text("Normal");
						$_val_status = 0;
						break;
					default:
						$status.addClass("badge bg-warning").text("Unknow");
						break;
				}

				$status.bind("click", function () {
					var $json = {
						id: $id,
						status: $_val_status
					}

					myuploadmail.action.updateUserStatus($json);
				});

				var $email = value.email.toLowerCase();

				var $tags = $("<DIV>");
				$.each($_tags, function (index, tag) {

					var $id = tag.id;
					var $name = tag.name;
					var $value = tag.valuable;

					var $tag_button = $("<span>").text($name).addClass("badge rounded-pill bg-secondary position-relative ps-2 mx-1").appendTo($tags);
					var $tag_num = $("<SPAN>").addClass("position-absolute top-0 start-100 translate-middle badge rounded-pill  ")
						.text($value).appendTo($tag_button);

					var $close = $("<I>").addClass("close fas fa-times mx-1").css({ "font-size": ".6rem" }).appendTo($tag_button);
					$close.hover(function (e) {
						$(this).css("color", e.type === "mouseenter" ? "#CDCDCD" : "#495057");
						$(this).css("cursor", e.type === "mouseenter" ? "pointer" : "hand")
					});
					$close.bind("click", function () {
						var $json = {
							id: $id,
						}

						myuploadmail.action.removeTag($json);
					});

					if ($value < 0) {
						$tag_num.addClass("bg-danger");
					} else if ($value == 0) {
						$tag_num.addClass("bg-primary");
					} else {
						$tag_num.addClass("bg-success");
					}
					$("<SPAN>").addClass("visually-hidden").text("unread messages").appendTo($tag_num);
				})

				var $newTag = $("<span>").attr("role", "button").addClass("badge rounded-pill bg-primary mx-1").text("+").appendTo($tags);
				$newTag.bind("click", function () {
					var $json = {
						id: $id
					}

					myuploadmail.panel.tag($json);
				});

				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").text(value.name).attr("data-toggle", "tooltip").attr("title", value.email).appendTo($tr);
				$("<TD>").text(value.groupName).appendTo($tr);
				//				$("<TD>").html("<A href='mailto:" + $email + "'>" + $email + "</A>").appendTo($tr);
				$("<TD>").append($tags).appendTo($tr);
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

				$edit.bind("click", function () {
					var $json = {
						id: $id,
						name: value.name,
						gender: value.gender,
						status: $_status
					}

					myuploadmail.panel.edit($json);
				});

			});
			$('[data-toggle="tooltip"]').tooltip();
		},
		edit: function (data) {

			var $content_input = $("<DIV>");
			var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible").attr("role", "alert").appendTo($content_input);
			$("<I>").addClass("close fas fa-times mx-1").css({ "font-size": "1.0rem" }).attr("data-bs-dismiss", "alert").attr("aria-label", "Close").appendTo($alert_message);
			var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
			$alert_message.hide();

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Name").appendTo($form_group);
			var $input_name = $("<INPUT>").attr("type", "text").attr("size", 20).addClass("form-control form-control-lg mb-3").attr("placeholder", "e.g.: John Doe").attr("value", data.name).appendTo($form_group);

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Gender").appendTo($form_group);
			var $select_gender = $("<SELECT>").addClass("form-select form-select-lg").attr("aria-label", ".form-select-lg").appendTo($form_group);
			$("<OPTION>").attr("value", 0).text("Please select").appendTo($select_gender);
			$("<OPTION>").attr("value", 1).text("Male").appendTo($select_gender);
			$("<OPTION>").attr("value", 2).text("Female").appendTo($select_gender);

			$select_gender.children().each(function () {
				if ($(this).val() == data.gender) {
					$(this).attr("selected", true);
				}
			});

			var $fun = {
				title: "Edit Email Information",
				content: $content_input,
				save: function () {

					var $json = {
						"id": data.id,
						"name": $input_name.val(),
						"gender": $select_gender.val(),
					};

					myuploadmail.action.updateUserInfo($json);
				},
				saveButton: "Update"
			}

			module.pupopboot($fun);

			return $content_input;
		},
		tag: function (data) {



			var $content_input = $("<DIV>");
			var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible").attr("role", "alert").appendTo($content_input);
			$("<I>").addClass("close fas fa-times mx-1").css({ "font-size": "1.0rem" }).attr("data-bs-dismiss", "alert").attr("aria-label", "Close").appendTo($alert_message);
			var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
			$alert_message.hide();

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Label").appendTo($form_group);
			var $input_name = $("<INPUT>").attr("type", "text")
				.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "e.g.: Great person").attr("value", data.name).appendTo($form_group);

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Rating").appendTo($form_group);
			var $score = $("<SMALL>").addClass("form-text text-muted").text("0").appendTo($form_group);
			var $input_value = $("<INPUT>").attr("type", "range")
				.attr("min", -5).attr("max", 5).attr("step", 1).addClass("form-range")
				.attr("value", 0).appendTo($form_group);

			$input_value.on("input", function () {
				$score.text(' ' + $(this).val());
			});

			if (data.value != undefined || data.value != '') {
				$input_value.attr("value", data.value);
				$score.text(' ' + data.value);
			}

			var $url = (data.value != undefined && data.value != '') ? "./userTag/updateValuable" : "./userTag/create";

			var $fun = {
				title: "New Label",
				content: $content_input,
				save: function () {

					var $json = {
						"userEmailId": data.id,
						"name": $input_name.val(),
						"value": $input_value.val(),
						"url": $url
					};

					myuploadmail.action.addTag($json);
				},
				saveButton: "Create"
			}

			module.pupopboot($fun);

			return $content_input;
		},
		query: function (data) {

			var $content_input = $("<DIV>");
			var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible").attr("role", "alert").appendTo($content_input);
			$("<I>").addClass("close fas fa-times mx-1").css({ "font-size": "1.0rem" }).attr("data-bs-dismiss", "alert").attr("aria-label", "Close").appendTo($alert_message);
			var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
			$alert_message.hide();

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Recipient Group").appendTo($form_group);
			var $input_group = $("<INPUT>").attr("type", "text")
				.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "e.g.: My Friend Group").appendTo($form_group);

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Recipient Name").appendTo($form_group);
			var $input_name = $("<INPUT>").attr("type", "text")
				.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "e.g.: Name").appendTo($form_group); // Changed placeholder text

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Email Address").appendTo($form_group);
			var $input_email = $("<INPUT>").attr("type", "text")
				.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "e.g.: john@gmail.com").appendTo($form_group);


			var $fun = {
				title: "Query Receiver",
				content: $content_input,
				save: function () {

					var $json = {
						"gn": $input_group.val(),
						"name": $input_name.val(),
						"email": $input_email.val(),
						"page": 1,
						"limit": 20
					};

					myuploadmail.action.list($json);
				},
				saveButton: "Query"
			}

			module.pupopboot($fun);

			return $content_input;
		},

	}
}