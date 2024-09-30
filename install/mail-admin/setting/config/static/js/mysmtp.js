/**
 * 
 */
var mysmtp = {

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

			var request = {
				method: "POST",
				url: "./config/listConfig",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify({
					page: $page,
					limit: $limit
				}),
				timeout: 60000,
				loading: {
					action: function () {
						$.LoadingOverlay("show", {
							image: "./img/loading/preloader.gif"
						});
					}
				},
				error: function (e) {
					console.log(e);
					$.LoadingOverlay("hide");
				},
				handle: function (response) {
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					mysmtp.panel.myconfig(response.data);

					module.pagging({
						target: "pagging",
						records: response.data.total,
						link: function (param) {
							mysmtp.action.list(param);
						},
						current: $page,
						limit: $limit
					});
				}
			};

			utils.normalRequest(request);
		},
		remove: function (obj) {

			var $json = {
				id: obj.id
			}
			var request = {
				method: "POST",
				url: "./config/deleteProtocolConfig",
				contentType: "application/json",
				dataType: "json",
				timeout: 60000,
				data: JSON.stringify($json),
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

						mysmtp.action.list();
					}
				}
			};

			utils.normalRequest(request);
		}

	},
	panel: {
		myconfig: function (data) {
			var $table = $("#mytable");

			$table.html("");

			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("Name").appendTo($tr);
            $("<TH>").html("Type").appendTo($tr);
            $("<TH>").html("Setting").appendTo($tr);
            $("<TH>").text("Status").addClass("d-none d-xl-table-cell").appendTo($tr);
            $("<TH>").text("Max Send Count").addClass("d-none d-xl-table-cell").appendTo($tr);
            $("<TH>").html("Function").appendTo($tr);

			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function (index, value) {

				var $type = value.type;
				var $id = value.id;
				var $setting = value.setting;

				var $info = '';
				$image = '';
				if ($type == 1) {
					$image = '<i class="fas fa-1x fa-fw -square pull-right fa-at"></i>'
					$info = "<DIV> HOST : " + value.setting.host + "  </DIV><DIV> PORT : " + value.setting.port + "  </DIV>";
				} else if ($type == 2) {
					$image = '<i class="fab fa-1x fa-fw -square pull-right fa-telegram"></i>'
					$info = "<p style='text-overflow: ellipsis; white-space: nowrap; overflow:hidden; max-width : 200px; max-height : 30px;'> " + value.setting.token + "  </p>";
				} else if ($type == 3) {
					$image = '<i class="fab fa-1x fa-fw -square pull-right fa-line"></i>'
					$info = "<p style='text-overflow: ellipsis; white-space: nowrap; overflow:hidden; max-width : 200px; max-height : 30px;'> " + value.setting.token + "  </p>";
				}

				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").html(value.name).appendTo($tr);
				$("<TD>").addClass("d-none d-xl-table-cell").html($image).appendTo($tr);
				$("<TD>").addClass("d-none d-xl-table-cell").html($info).appendTo($tr);

				var $span_status = $("<SPAN>");
				if (value.status == 0) {
					$span_status.addClass("badge bg-secondary").text("-");
				} else if (value.status == 1) {
					$span_status.addClass("badge bg-success").text("Normal");
				} else if (value.status == 4) {
					$span_status.addClass("badge bg-danger").text("Error");
				}

				$td_status = $("<TD>").appendTo($tr);
				$span_status.attr("data-toggle", "tooltip").appendTo($td_status);
				if (value.memo != '') {
					$span_status.attr("title", value.memo);
				}

				$("<TD>").addClass("d-none d-xl-table-cell").text(value.maxTransaction).appendTo($tr);
				var $info = $("<TD>").appendTo($tr);

				var $button = $("<DIV>").addClass("btn-group btn-group-sm").appendTo($info);
				$("<BUTTON>").attr("type", "button").addClass("btn btn-info dropdown-toggle")
					.attr("data-bs-toggle", "dropdown").attr("aria-haspopup", "true")
					.attr("aria-expanded", "false").text("Info").appendTo($button);
				var $button_menu = $("<DIV>").attr("mark", $id).addClass("dropdown-menu").appendTo($button);
				var $editor = $("<A>").addClass("dropdown-item").html("Edit").appendTo($button_menu);
				var $delete = $("<A>").addClass("dropdown-item").html("Delete").appendTo($button_menu);

				$editor.bind("click", function () {
					if ($type == 1) {
						mysmtp.panel.createEmailConfig(value);
					}
				});

				$delete.bind("click", function () {
					var $json = {
						id: $(this).parent().attr("mark")
					}

					mysmtp.action.remove($json);
				});

				//				var $testMail = $("<BUTTON>").addClass("btn btn-success btn-sm ").text("測試").appendTo($info);

			});

			var $tr = $("<TR>").appendTo($tbody);
			var $td = $("<TD>").attr("colspan", 6).attr("align", "center").appendTo($tr);

			//			var $btn_group = $("<DIV>").addClass("btn-group mb-3").attr("role", "group").attr("aria-label", "Default button group").appendTo($td);
			//			var $bt_email = $("<BUTTON>").attr("type", "button").addClass("btn btn-secondary").text("新增SMTP設定").appendTo($btn_group);

			$("#mysender").bind("click", function () {
				mysmtp.panel.createEmailConfig();
			});

			$('[data-toggle="tooltip"]').tooltip();

		},
		createEmailConfig: function (data) {

			var $id, $sender = '', $sender_name = '', $user, $host = '', $port = '587', $max_transaction = '100', $auth = '', $startTls = '';
			if (data != undefined) {
				$id = data.id;
				$user = data.setting.username + '*****';
				$sender = data.setting.sender;
				$sender_name = data.setting.senderName;
				$host = data.setting.host;
				$port = data.setting.port;
				$max_transaction = data.maxTransaction;
				$auth = data.setting.auth;
				$startTls = data.setting.startTls;
			}

			var $content_input = $("<DIV>");
			var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
				.attr("role", "alert").appendTo($content_input);
			$("<BUTTON>").attr("type", "button").addClass("btn-close").attr("data-bs-dismiss", "alert")
				.attr("aria-label", "Close").appendTo($alert_message);
			var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
			$alert_message.hide();

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("").appendTo($form_group);
			var $input_sendername = $("<INPUT>").attr("type", "text")
				.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "create a name").attr("value", $sender_name).appendTo($form_group);
			//			
			//			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			//			$("<SMALL>").addClass("form-text text-muted").text("郵件看到寄件地址，但有些郵箱設定無效，例如：Gmail").appendTo($form_group);
			//			var $input_email = $("<INPUT>").attr("type", "text")
			//					.attr("size", 20).addClass("form-control form-control-lg mb-3")
			//					.attr("aria-describedby", "emailHelp").attr("value", $sender)
			//					.attr("placeholder", "寄件者地址，例如：no-reply@agitg.com").appendTo($form_group);

			//			$input_email.on("input", function (e) {
			//				if (/@yahoo.com/i.test(this.value)){
			//					$input_user.val($input_email.val());
			//				}
			//			});				

			var $form_user_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			var $input_user = $("<INPUT>").attr("type", "text")
				.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "Email Address Ex: agitg@gmail.com")
				.appendTo($form_group);


			var $info_message = $("<DIV>").addClass("alert alert-primary alert-dismissible")
				.attr("role", "alert").appendTo($form_user_group);
			var $icon = $("<DIV>").addClass("alert-icon").appendTo($info_message);
			$("<I>").addClass("far fa-fw fa-bell").appendTo($icon);
			$info_message.hide();

			if ($id != undefined && $id != '') {
				$input_user.val($user)
				$input_user.attr("disabled", true);
			}

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("").appendTo($form_group);
			var $input_password = $("<INPUT>").attr("type", "password")
				.attr("aria-describedby", "passwordHelpInline")
				.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "Password of Email's account ")
				.appendTo($form_group);

			if ($id != undefined && $id != '') {
				$input_password.val('********');
			}

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("SMTP Host is required").appendTo($form_group);
			var $input_host = $("<INPUT>").attr("type", "text").attr("value", $host)
				.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "SMTP Host, ex: smtp.agitg.com")
				.appendTo($form_group);

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Port of SMTP is required, ex 25, 587").appendTo($form_group);
			var $input_port = $("<INPUT>").attr("type", "number")
				.attr("size", 20).attr("data-bind", "value:replyNumber")
				.attr("min", 0)
				.attr("value", $port)
				.addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "Port of SMTP, ex: 587")
				.appendTo($form_group);

			var $form_group = $("<DIV>").addClass("form-check form-switch").appendTo($content_input);
			var $input_auth = $("<INPUT>").attr("type", "checkbox").addClass("form-check-input").attr("checked", true)
				.appendTo($form_group);
			if ($auth != undefined) {
				$input_auth.attr("checked", $auth)
			} else {
				$input_auth.attr("checked", true)
			}

			$("<LABEL>").attr("type", "checkbox")
				.attr("for", "flexSwitchCheckChecked").addClass("form-check-label").text("Auth")
				.appendTo($form_group);

			var $form_group = $("<DIV>").addClass("form-check form-switch").appendTo($content_input);
			var $input_tls = $("<INPUT>").attr("type", "checkbox").addClass("form-check-input").attr("checked", true)
				.appendTo($form_group);
			$("<LABEL>").attr("type", "checkbox")
				.attr("for", "flexSwitchCheckChecked").addClass("form-check-label").text("TLS")
				.appendTo($form_group);
			if ($startTls != undefined) {
				$input_tls.attr("checked", $startTls)
			} else {
				$input_tls.attr("checked", true)
			}

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Required. Free Gmail accounts are limited to sending 1000 emails per day.").appendTo($form_group);
			var $input_max = $("<INPUT>").attr("type", "number")
				.attr("size", 20).attr("data-bind", "value:replyNumber")
				.attr("min", 0)
				.attr("value", "100")
				.addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "Maximum Daily Transactions: For example: 1000 (Gmail free users limit)")
				.appendTo($form_group);
			if ($max_transaction != undefined) {
				$input_max.val($max_transaction);
			}

			$input_user.on("input", function (e) {

				$info_message.html('');
				if (/@gmail.com/i.test(this.value)) {

					$input_port.val(587);
					$input_host.val("smtp.gmail.com");

					var $info = $("<DIV>").addClass("alert-message").appendTo($info_message);

					var $description = $("<SPAN>").html("To successfully send emails, please authorize the following 2 settings in your Gmail account.").appendTo($info);
					var $ul = $("<UL>").appendTo($description);
					var $li = $("<LI>").html("<a href='https://accounts.google.com/DisplayUnlockCaptcha'>Limiting authorization to different IP addresses</a>").appendTo($ul);
					var $li = $("<LI>").html("Enable <a href='https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4Nkdmb300kju1IB1JHrlc7m3G43u1hssOn1QyOFDJAF7_W8-X_62QRY7muGQVRTssVBtbfhu1sXRP23crLHk2BErp9INQ'>Allowing less secure apps</a>").appendTo($ul);
					$info_message.show();
				}
				else if (/@yahoo.com/i.test(this.value)) {
					//					$input_email.val($input_user.val());
					$input_port.val(587);
					$input_host.val("smtp.mail.yahoo.com");

					var $info = $("<DIV>").addClass("alert-message").appendTo($info_message);

					var $description = $("<SPAN>").html(" This setup requires a separate app password for your Yahoo email. This password is different from your regular Yahoo login password. To set it up, please follow these steps: ").appendTo($info);
					var $ul = $("<UL>").appendTo($description);
					var $li = $("<LI>").html("<a target='_blank' href='https://login.yahoo.com/myaccount/security/'>Go to Yahoo【Account Security】-> Other ways to sign in --> App passwords【Generate and manage app passwords】 </a>").appendTo($ul);$("<SPAN>").html("After successfully generating the Yahoo app password, please save this 'app password' in this 【email password】 setting.").appendTo($description);
					$info_message.show();
				}
				else {
					$info_message.hide();
				}

			});

			var $title = ($id == undefined) ? "New Setting" : "Edit Setting";

			var $fun = {
				title: $title,
				content: $content_input,
				save: function () {

					if ($input_sendername.val() == '') {
						$err.text("名稱為必填");
						$alert_message.show();
						return;
					}

					if ($input_host.val() == '') {
						$err.text("郵箱SMTP主機為必填");
						$alert_message.show();
						return;
					}

					$alert_message.hide();
					var $json = {
						email: {
							"id": $id,
							//									"sender" : $input_email.val(),
							"senderName": $input_sendername.val(),
							"username": $input_user.val(),
							"password": $input_password.val(),
							"host": $input_host.val(),
							"port": $input_port.val(),
							"maxTransaction": $input_max.val(),
							"isAuth": $input_auth.is(":checked"),
							"isStartTls": $input_tls.is(":checked"),
						}
					};

					var url = "./config/createProtocolConfig";
					if ($id != undefined && $id != '') {
						url = "./config/updateProtocolConfig";
					}

					var request = {
						method: "POST",
						url: url,
						contentType: "application/json",
						dataType: "json",
						data: JSON.stringify($json),
						timeout: 60000,
						loading: function () {
							$.LoadingOverlay("show", {
								image: "./img/loading/preloader.gif"
							});
						},
						error: function (e) {
							$.LoadingOverlay("hide");
						},
						handle: function (response) {
							$.LoadingOverlay("hide");

							if (response.status != 0) {
								$err.text(response.message);
								$alert_message.show();
								return;
							}

							if (response.status == 0) {
								$(".modal").modal('hide');
								$(".modal").remove();

								mysmtp.action.list();
							}

						}
					};

					utils.normalRequest(request);
				},
				saveButton: "Save"
			}

			module.pupopboot($fun);

		}

	}

}