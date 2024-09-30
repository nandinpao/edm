var mymail = {
	condition: {
		query: {},
		list: {},
		interval: []
	},
	action: {

		list: function (obj) {

			var $page, $limit, $status, $statusText;
			if (obj == undefined || obj.page == undefined) {
				$page = 1;
				$limit = 20;
			} else {
				$page = obj.page;
				$limit = obj.limit;
			}

			if (obj != undefined && obj.status != undefined) {
				$status = obj.status;
				$statusText = obj.statusText;
			}

			var $json = {
				page: $page,
				limit: $limit,
				status: $status,
				statusText: $statusText
			}

			var request = {
				method: "POST",
				url: "./email/mymail",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify($json),
				timeout: 60000,
				loading: {
					target: "pageInfo"
				},
				error: function (ex) {
					$.LoadingOverlay("hide");
				},
				handle: function (response) {
					$.LoadingOverlay("hide");

					$("#mymail_total").text(utils.formatNumber(response.data.total));

					//						mymail.condition.interval.map((a) => {
					//						    clearInterval(a);
					//						    mymail.condition.interval = [];
					//						});

					$.each(mymail.condition.interval, function (key, value) {
						clearInterval(value);
					});
					mymail.condition.interval = [];

					response.data['statusText'] = $statusText;
					response.data['page'] = $page;
					response.data['limit'] = $limit;
					//						mymail.panel.mymail(response.data);
					mymail.panel.mymailCard(response.data);

					mymail.condition.list = $json;

					var $_json = {};
					$_json['total'] = response.data.total;

					mymail.action.statistics($_json);

					AOS.init({
						easing: 'ease-in-out-sine'
					});
				}
			};

			utils.normalRequest(request);
		},
		statistics: function (obj) {
			var request = {
				method: "POST",
				url: "./email/statMail",
				dataType: "json",
				contentType: "application/json",
				timeout: 60000,
				loading: {
					target: "statPage"
				},
				error: function (e) {
					$.LoadingOverlay("hide");
				},
				handle: function (response) {

					$.LoadingOverlay("hide");

					var $data = [
						{ id: 'mymail_total', title: "Total", number: obj.total },
						{ id: 'mymail_ready', title: "Pending", number: response.data.readySendableTotal },
						// {id: 'mymail_sendable', title : "Sendable Mail", number : response.data.myLastSendableTotal},
						{ id: 'mymail_todaysent', title: "Sent This Month", number: response.data.mySentableTotal }
					];

					var $json = {}
					$json['data'] = $data;
					$json['target'] = 'mainPageDashboard';

					var $wrapper = mymail.panel.mailDashboard($json);

					var $col = $("<DIV>").addClass("col-12 col-lg-12 col-xxl-12 d-flex").appendTo($wrapper);
					var $card = $("<DIV>").addClass("card flex-fill").appendTo($col);
					var $progress = $("<DIV>").addClass("progress").appendTo($card);

					var $precent = utils.formatNumber((response.data.myLastSendableTotal / (response.data.myLastSendableTotal + response.data.mySentableTotal)) * 100);
					$("<DIV>").addClass("progress-bar").css({ "width": $precent + '%' })
						.attr("role", "progressbar")
						.attr("aria-valuemax", response.data.mySendableTotal)
						.attr("aria-valuemin", 0)
						.attr("aria-valuenow", response.data.myLastSendableTotal)
						.text($precent + '%').appendTo($progress);

				}
			}

			utils.normalRequest(request);
		},
		findMail: function (obj) {

			var request = {
				"method": "POST",
				"url": "./email/findMail",
				"dataType": "json",
				"contentType": "application/json",
				"data": JSON.stringify({
					id: obj.id
				}),
				"timeout": 60000,
				error: function (e) {
					$.LoadingOverlay("hide");
				},
				handle: function (response) {
					$.LoadingOverlay("hide");

					var $json = response.data;
					$json['target'] = obj.target;
					$json['interval'] = obj.interval;

					obj.action(obj.target);

					mymail.panel.mailCard($json);


				}
			};

			utils.normalRequest(request);
		},
		finder: function (obj) {

			var request = {
				"method": "POST",
				"url": "./marketing/findEmailMarketing",
				"dataType": "json",
				"contentType": "application/json",
				"data": JSON.stringify({
					emailMarketingId: obj.id
				}),
				"timeout": 60000,
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
					$.LoadingOverlay("hide");

					mymail.panel.createMail(response.data);

					$(".mailPanel").hide();
					$("#editPage").show("slow");

				}
			};

			utils.normalRequest(request);
		},
		attachment: function (obj) {

			var request = {
				"method": "POST",
				"url": "./marketing/listEmailMarketingAttachment",
				"dataType": "json",
				"contentType": "application/json",
				data: JSON.stringify({
					emailMarketingId: obj.id
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
					$.LoadingOverlay("hide");
				},
				handle: function (response) {
					$.LoadingOverlay("hide");

					var $content_input = $("<DIV>");

					var $form_group = $("<DIV>").addClass("col-xl-12 form-group h-25 d-inline-block").appendTo($content_input);
					var $fileloading = $("<DIV>").addClass("file-loading").appendTo($form_group);
					var $file = $("<INPUT>").attr("type", "file").attr("name", "file")
						.attr("id", "file").attr("multiple", '').appendTo($fileloading);

					$("<SMALL>").addClass("form-text text-muted").html("Maximum <strong>5 files</strong>, maximum <strong>10MB</strong> total (2MB per file).").appendTo($form_group);
					$upload_json = {
						id: obj.id
					}
					var filesConfig = [];
					var files = [];
					$.each(response.data.list, function (index, value) {
						files.push(value.fileName);

						var $json = {
							previewAsData: false,
							filetype: value.mimeType,
							key: value.id,
							size: value.fileSize,
							caption: value.fileName,
							width: "30px"
						}

						filesConfig.push($json);
					});

					var $fun = {
						title: "Upload Files",
						content: $content_input,
						displayCallback: function () {
							var $uploadLink = './email/uploadAttachment';
							$file.fileinput({
								hideThumbnailContent: true,
								maxFilePreviewSize: 10240,
								uploadUrl: $uploadLink,
								multiple: true,
								deleteUrl: "./email/removeEmailMarketingAttachment",
								showRemove: false,
								showPreview: true,
								showBrowse: true,
								showCaption: false,
								dropZoneEnabled: false,
								showUpload: true,
								uploadAsync: false,
								showClose: false,
								removeFromPreviewOnError: true,
								minFileCount: 1,
								maxFileCount: 5,
								msgFilesTooMany: "You have selected {n} files, exceeding the maximum allowed number of {m}!",
								overwriteInitial: false,
								uploadExtraData: $upload_json,
								layoutTemplates: {
									actions: '<div class="file-actions">\n' +
										'    <div class="file-footer-buttons">\n' +
										'        {upload} {delete}' +
										'    </div>\n' +
										'    {drag}\n' +
										'    <div class="clearfix"></div>\n' +
										'</div>',
									actionZoom: '',
									actionDelete: '<button type="button" class="kv-file-remove {removeClass}" title="{removeTitle}"{dataUrl}{dataKey}><i class="fas fa-trash-alt"></i></button>\n',
									actionUpload: '<button type="button" class="kv-file-upload {uploadClass}" title="{uploadTitle}"><i class="fas fa-cloud-upload-alt"></i></button>\n'
								},
								preferIconicPreview: true,
								initialPreviewAsData: false,
								initialPreview: files,
								initialPreviewConfig: filesConfig,
								preferIconicPreview: true,
								previewFileIconSettings: {
									'doc': '<i class="fas fa-file-word text-primary"></i>',
									'xls': '<i class="fas fa-file-excel text-success"></i>',
									'ppt': '<i class="fas fa-file-powerpoint text-danger"></i>',
									'pdf': '<i class="fas fa-file-pdf text-danger"></i>',
									'zip': '<i class="fas fa-file-archive text-muted"></i>',
									'htm': '<i class="fas fa-file-code text-info"></i>',
									'txt': '<i class="fas fa-file-alt text-info"></i>',
									'mov': '<i class="fas fa-file-video text-warning"></i>',
									'mp3': '<i class="fas fa-file-audio text-warning"></i>',
									'jpg': '<i class="fas fa-file-image text-danger"></i>',
									'gif': '<i class="fas fa-file-image text-muted"></i>',
									'png': '<i class="fas fa-file-image text-primary"></i>'
								},
								previewFileExtSettings: {
									'doc': function (ext) {
										return ext.match(/(doc|docx)$/i);
									},
									'xls': function (ext) {
										return ext.match(/(xls|xlsx)$/i);
									},
									'ppt': function (ext) {
										return ext.match(/(ppt|pptx)$/i);
									},
									'zip': function (ext) {
										return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
									},
									'htm': function (ext) {
										return ext.match(/(htm|html)$/i);
									},
									'txt': function (ext) {
										return ext.match(/(txt|ini|csv|java|php|js|css)$/i);
									},
									'mov': function (ext) {
										return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
									},
									'mp3': function (ext) {
										return ext.match(/(mp3|wav)$/i);
									}
								}
							}).on('filesorted', function (e, params) {
								console.log('File sorted params', params);
							}).on('fileuploaded', function (event, previewId, index, fileId) {
								console.log('File fileuploaded = ' + index);
								mymail.action.list(mymail.condition.list);
							}).on('fileuploaderror', function (event, data, msg) {
							}).on('filebatchuploadcomplete', function (event, preview, config, tags, extraData) {
								mymail.action.list(mymail.condition.list);
							}).on('filedeleted', function (event, key, jqXHR, data) {
								console.log('File Delete Key = ' + key);
								mymail.action.list(mymail.condition.list);
							}).on("filebatchuploadsuccess", function (event, data) {

								console.log('File batch Upload Key = ' + data);

								if (data.response) {
									mymail.action.list(mymail.condition.list);
								}
							});
						}
					}

					module.pupopboot($fun);
				}
			};

			utils.normalRequest(request);
		},
		mailDetail: function (obj) {

			var $page, $limit;
			if (obj == undefined) {
				$page = 1;
				$limit = 20
			} else {
				$page = obj.page;
				$limit = obj.limit;
			}

			var $json = {
				emailMarketingId: obj.id,
				page: $page,
				limit: $limit
			}

			$("#subject").text(obj.title);

			var request = {
				"method": "POST",
				"url": "./email/mailDetail",
				"contentType": "application/json",
				"dataType": "json",
				"timeout": 60000,
				"data": JSON.stringify($json),
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
					$.LoadingOverlay("hide");

					response.data['page'] = $page;
					response.data['limit'] = $limit;
					response.data['id'] = obj.id;
					response.data['title'] = obj.title;
					response.data['isAdd'] = obj.isAdd;

					mymail.panel.mailDetail(response.data);

					obj['total'] = response.data.total;
					mymail.action.mailStatistics(obj);

				}
			};

			utils.normalRequest(request);
		},
		mailStatistics: function (obj) {

			$("#subject").text(obj.title);

			var $json = {
				emailMarketingId: obj.id
			}

			var request = {
				"method": "POST",
				"url": "./email/emailMarketingStatistics",
				"contentType": "application/json",
				"dataType": "json",
				"timeout": 60000,
				"data": JSON.stringify($json),
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
					$.LoadingOverlay("hide");

					var $data = [
						{ id: 'mymail_number', title: 'Total', number: obj.total },
						{ id: 'mymail_click', title: 'Clicks', number: response.data.serp[0].number },
						{ id: 'mymail_open', title: 'Opens', number: response.data.serp[1].number },
					];

					var $json = {}
					$json['data'] = $data;
					$json['target'] = 'detailPageDashboard';

					mymail.panel.mailDashboard($json);

				}
			};

			utils.normalRequest(request);
		},
		openMail: function (obj) {

			var $page, $limit;
			if (obj == undefined) {
				$page = 1;
				$limit = 20
			} else {
				$page = obj.page;
				$limit = obj.limit;
			}

			var $json = {
				emailMarketingId: obj.id,
				page: $page,
				limit: $limit
			}

			$(".mailPanel").hide();
			$("#openPage").show("slow");

			$("#open_subject").text(obj.title);

			var request = {
				"method": "POST",
				"url": "./open/listMarketingReceiverOpenByEmailMarketingId",
				"contentType": "application/json",
				"dataType": "json",
				"timeout": 60000,
				"data": JSON.stringify($json),
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
					$.LoadingOverlay("hide");

					response.data['id'] = obj.id;
					response.data['page'] = $page;
					response.data['limit'] = $limit;
					mymail.panel.openMail(response.data);

				}
			};

			utils.normalRequest(request);
		},
		clickMail: function (obj) {

			var $page, $limit;
			if (obj == undefined) {
				$page = 1;
				$limit = 20
			} else {
				$page = obj.page;
				$limit = obj.limit;
			}

			var $json = {
				emailMarketingId: obj.emailMarketingId,
				linkId: obj.id,
				page: $page,
				limit: $limit
			}

			$(".mailPanel").hide();
			$("#clickPage").show("slow");

			$("#click_subject").text(obj.title);

			var request = {
				"method": "POST",
				"url": "./click/listMarketingReceiverClickByEmailMarketingId",
				"contentType": "application/json",
				"dataType": "json",
				"timeout": 60000,
				"data": JSON.stringify($json),
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
					$.LoadingOverlay("hide");


					response.data['emailMarketingId'] = obj.emailMarketingId;
					response.data['id'] = obj.id;
					response.data['subject'] = obj.subject;
					response.data['title'] = obj.title;
					response.data['page'] = $page;
					response.data['limit'] = $limit;
					mymail.panel.clickMail(response.data);

				}
			};

			utils.normalRequest(request);
		},
		listLink: function (obj) {

			var $page, $limit;
			if (obj == undefined) {
				$page = 1;
				$limit = 20
			} else {
				$page = obj.page;
				$limit = obj.limit;
			}

			var $json = {
				emailMarketingId: obj.id,
				page: $page,
				limit: $limit
			}

			$(".mailPanel").hide();
			$("#clickPage").show("slow");

			$("#open_subject").text(obj.title);

			var request = {
				"method": "POST",
				"url": "./link/listLinkClick",
				"contentType": "application/json",
				"dataType": "json",
				"timeout": 60000,
				"data": JSON.stringify($json),
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
					$.LoadingOverlay("hide");

					response.data['id'] = obj.id;
					response.data['subject'] = obj.subject;
					mymail.panel.listLink(response.data);

				}
			};

			utils.normalRequest(request);
		},
		myProtocolGroup: function (data) {

			var $json = {
				page: 1,
				limit: 20
			}

			var request = {
				method: "POST",
				url: "./proto/listGroup",
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
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}


					var $json = {
						groupId: data.groupId,
						id: data.id,
						list: response.data.list,
						total: response.data.total
					}

					var $fun = {
						title: "Send Group",
						content: mymail.panel.mygroup($json)
					}

					module.pupopboot($fun);

				}
			};

			utils.normalRequest(request);
		},
		listEnableMailGroup: function (data) {

			var $page = 1, $limit = 20;
			if (data == undefined) {
				$page = 1;
				$limit = 20
			} else {
				$page = data.page;
				$limit = data.limit;
			}

			var request = {
				method: "POST",
				url: "./emailgroup/listEnableEmailGroup",
				contentType: "application/json",
				dataType: "json",
				timeout: 60000,
				data: JSON.stringify({
					emailMarketingId: data.id,
					page: $page,
					limit: $limit
				}),
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

					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					var $json = {
						id: data.id,
						info: response.data.info,
						choose: response.data.choose,
						page: $page,
						limit: $limit
					}

					var $fun = {
						title: "Recipient Group",
						content: mymail.panel.myEmailgroup($json),
						save: function () {

							//								var $json = {
							//									id : data.id 
							//								}
							//								mymail.action.convertEmailReceiver($json);

							$(".modal").modal('hide');
							$(".modal").remove();
						},
						saveButton: "關閉"
					}

					module.pupopboot($fun);

				}
			};

			utils.normalRequest(request);
		},
		joinEmailMarketingGroup: function (data) {

			var request = {
				"method": "POST",
				"url": "./marketing/saveEmailMarketingGroup",
				"contentType": "application/json",
				"dataType": "json",
				"timeout": 60000,
				"data": JSON.stringify(data),
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
					$.LoadingOverlay("hide");

					if (response.status == 0) {
						$(".modal").modal('hide');
						$(".modal").remove();

						mymail.action.list(mymail.condition.list);
					} else if (response.status == 239) {
						alert("Sender information is not filled out yet. Please fill in the sender information before sending.");
						window.location.replace("./mysmtpgroup");
					} else if (response.status == 102) {
						alert("No sender added yet. Please fill in the sender information first.");
						window.location.replace("./mysmtp");
					}
				}
			};

			utils.normalRequest(request);
		},
		createMail: function (data) {

			data['type'] = 1;

			var request = {
				method: "POST",
				url: data.url,
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(data),
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
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						data.error(response.message);
						return;
					}

					if (response.status == 0) {

						mymail.action.list(mymail.condition.list);

						if (data.url == "./email/createEmailMarketing") {
							mymail.panel.createMail(response.data);
							$(".mailPanel").hide();
							$("#editPage").show("slow");
						} else {
							$(".modal").modal('hide');
							$(".modal").remove();
						}

					}

				}
			};

			utils.normalRequest(request);

		},
		removeEmail: function (data) {

			var request = {
				"method": "POST",
				"url": "./email/removeEmailMarketing",
				"contentType": "application/json",
				"dataType": "json",
				"timeout": 60000,
				"data": JSON.stringify(data),
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
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					if (response.status == 0) {

						mymail.action.list(mymail.condition.list);

					}
				}
			};

			utils.normalRequest(request);
		},
		revokeScheduleMails: function (data) {

			$json = {
				emailMarketingId: data.id
			}

			var request = {
				"method": "POST",
				"url": "./schedule/revoke",
				"contentType": "application/json",
				"dataType": "json",
				"timeout": 60000,
				"data": JSON.stringify($json),
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
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					if (response.status == 0) {
						mymail.action.list(mymail.condition.list);
					}
				}
			};

			utils.normalRequest(request);
		},
		joinEmailGroupToEmailMarketing: function (data) {

			$json = {
				emailMarketingId: data.id,
				userUploadGroupEmailId: data.groupId
			}

			var request = {
				"method": "POST",
				"url": "./emailgroup/joinEmailGroupToEmailMarketing",
				"contentType": "application/json",
				"dataType": "json",
				"timeout": 60000,
				"data": JSON.stringify($json),
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
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					if (response.status == 0) {

						var $json = {
							id: data.id,
							page: 1,
							limit: 20
						}

						mymail.action.listEnableMailGroup($json);
					}
				}
			};

			utils.normalRequest(request);
		},
		removeEailGroupToEmailMarketing: function (data) {

			var $json = {
				id: data.tagId
			}

			var request = {
				"method": "POST",
				"url": "./emailgroup/removeEmailGroupFromEmailMarketing",
				"contentType": "application/json",
				"dataType": "json",
				"timeout": 60000,
				"data": JSON.stringify($json),
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
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					if (response.status == 0) {

						var $json = {
							id: data.id,
							page: 1,
							limit: 20
						}

						mymail.action.listEnableMailGroup($json);
					}
				}
			};

			utils.normalRequest(request);
		},
		convertEmailReceiver: function (data) {

			var $json = {
				emailMarketingId: data.id
			}

			var request = {
				"method": "POST",
				"url": "./marketing/convertEmailReceiver",
				"contentType": "application/json",
				"dataType": "json",
				"timeout": 60000,
				"data": JSON.stringify($json),
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
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						$("#error").show();
						$("#error").text(response.message);
						return;
					}

					if (response.status == 0) {
						mymail.action.list(mymail.condition.list);
					}
				}
			};

			utils.normalRequest(request);
		},
		buildEmailMarketingTag: function (data) {

			var request = {
				method: "POST",
				url: "./tag/buildEmailMarketingTag",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(data),
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
						data.error(response.message);
						return;
					}

					if (response.status == 0) {
						if (data.callback
							&& typeof (data.callback) === "function") {
							data.callback(response.data.id);
						}
					}

				}
			};

			utils.normalRequest(request);

		},

		removeEmailMarketingTag: function (data) {

			var request = {
				method: "POST",
				url: "./tag/removeEmailMarketingTag",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(data),
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
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						data.error(response.message);
						return;
					}

					if (data.callback
						&& typeof (data.callback) === "function") {
						data.callback();
					}

				}
			};

			utils.normalRequest(request);

		},
		buildEmailMarketingLink: function (data) {

			var request = {
				method: "POST",
				url: "./link/buildEmailMarketingLink",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(data),
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
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						data.error(response.message);
						return;
					}

					if (response.status == 0) {
						if (data.callback
							&& typeof (data.callback) === "function") {
							data.callback(response.data);
						}
					}

				}
			};

			utils.normalRequest(request);

		},
		removeEmailMarketingLink: function (data) {

			var request = {
				method: "POST",
				url: "./link/removeEmailMarketingLink",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(data),
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
					$.LoadingOverlay("hide");

					if (response.status != 0) {
						data.error(response.message);
						return;
					}

					if (data.callback
						&& typeof (data.callback) === "function") {
						data.callback();
					}

				}
			};

			utils.normalRequest(request);

		}
	},
	panel: {
		mymail: function (data) {



			jQuery.timeago.settings.strings = {
				prefixAgo: "",
				prefixFromNow: "dentro de",
				suffixAgo: "ago",
				suffixFromNow: "",
				seconds: "%d seconds",
				minute: "1 minute",
				minutes: "%d minutes",
				hour: "1 hour",
				hours: "%d hours",
				day: "1 day",
				days: "%d days",
				month: "1 month",
				months: "%d months",
				year: "1 year",
				years: "%d years"
			};

			$("#mainPage").remove();
			var $table = $("<TABLE>").addClass("table table-striped my-0");
			var $footer = $("<NAV>").attr("ID", "pagging").attr("aria-label", "Page navigation example");

			var $pager = {
				id: 'mainPage',
				body: $table,
				linkBackText: 'Add New Email',
				linkBackAction: function () {
					var $json = {
						url: "./email/createEmailMarketing"
					}

					mymail.action.createMail($json);
				},
				subject: 'Email List',
				footer: $footer,
				target: $("#pageInfo")
			}

			mail.layout.cargo($pager);

			if (data.total > 0) {
				module.pagging({
					target: "pagging",
					records: data.total,
					link: function (param) {
						mymail.action.list(param);
					},
					current: data.page,
					limit: data.limit
				});
			}

			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("Subject").appendTo($tr);
			$("<TH>").text("Attachment Count").addClass("d-none d-xl-table-cell").appendTo($tr);
			$("<TH>").text("Recipient Count").addClass("d-none d-xl-table-cell").appendTo($tr);
			$("<TH>").text("Open Rate").appendTo($tr);
			$("<TH>").text("Mailing Group").appendTo($tr);
			$("<TH>").text("Scheduled Time").addClass("d-none d-xl-table-cell").appendTo($tr);
			$("<TH>").text("Status").appendTo($tr);
			$("<TH>").text("Time Spent (Minutes)").addClass("d-none d-xl-table-cell").appendTo($tr);
			$("<TH>").text("Updated Time").addClass("d-none d-xl-table-cell").appendTo($tr);
			$("<TH>").html("Actions").appendTo($tr);

			var $now = new Date();

			var $default_sender = '<svg data-toggle="tooltip" title="Default Sender" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-navigation align-middle mr-2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>';
			var $open_icon = '<svg data-toggle="tooltip" title="Waiting for Open" xmlns="http://www.w3.org/200/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-package align-middle mr-2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
			var $default_attachment = '<svg data-toggle="tooltip" title="No Attachment" xmlns="http://www.w3.org/200/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-book align-middle mr-2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>';
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function (index, value) {

				var $id = value.emailMarketingId;
				var $subject = value.subject;
				var $groupId = value.groupId;
				var $scheduleStatus = value.scheduleStatus;
				var $scheduleTime = value.scheduleTime;
				var $scheduleType = value.scheduleType;
				var $open = value.open;
				var $memo = value.memo;


				var $groupName = (value.groupName == undefined) ? $default_sender : value.groupName;

				var $fileSize = (value.attachmentTotalSize / 1000 == 0) ? '' : ' (' + (Math.ceil(value.attachmentTotalSize / 1000)) + " KB) ";
				var $attachmentNum = (value.attachmentNum == 0) ? $.parseHTML($default_attachment) : "<SPAN class='badge bg-secondary'>" + value.attachmentNum + $fileSize + "</SPAN>";

				var $status = '-';
				var $default_subject = ($subject == ' ') ? '(無主旨)' : $subject;
				var $receiverConvertingNum = value.receiverConvertingNum;

				var $tr = $("<TR>").appendTo($tbody);

				var $td_subject = $("<TD>").appendTo($tr);
				var $detail = $("<SPAN>").html("<p style='text-overflow: ellipsis; white-space: nowrap; overflow:hidden; max-width : 100px; '>" + $default_subject + "</p>")
					.attr("data-toggle", "tooltip").css({ "cursor": "pointer" }).attr("title", $default_subject).appendTo($td_subject);

				var $bt_uploadAttachment = $("<TD>").addClass("d-none d-xl-table-cell").html($attachmentNum).css({ "cursor": "pointer" }).appendTo($tr);

				var $open_rate = ($open == 0) ? $open_icon : "<button class='btn btn-warning btn-sm'>" + utils.formatNumber(($open / value.receiverNum) * 100) + '%' + "</button>";
				var $edit = $("<TD>").addClass("d-none d-xl-table-cell").text(utils.formatNumber(value.receiverNum)).appendTo($tr);
				var $open_rate_td = $("<TD>").html($open_rate).appendTo($tr);
				$("<TD>").html($groupName).appendTo($tr);

				if ($scheduleTime != undefined) {
					if ($scheduleType == 1) {
						$scheduleTime = Date.parse($scheduleTime.replace(' ', 'T'));
						$scheduleTime = $scheduleTime - ($now.getTimezoneOffset() * 60000);
						$scheduleTime = new Date($scheduleTime);
					} else {
						$scheduleTime = '每日 ' + $scheduleTime.replace(":00.000", " 執行");
					}
				} else {
					$scheduleTime = '-';
				}
				$scheduleTimeTd = $("<TD>").addClass("d-none d-xl-table-cell").appendTo($tr);

				if ($scheduleTime > $now && value.status == 6) {
					$scheduleTimeTd.timeTo({
						timeTo: new Date($scheduleTime),
						displayDays: 2,
						theme: "white",
						fontSize: 14,
						displayCaptions: false,
						callback: function () {
							mymail.action.list(mymail.condition.list);
						}

					});
				} else {

					if ($scheduleTime != '-') {
						var $date_scheduleTime = $scheduleTime;
						$scheduleTime = $.format.date($scheduleTime, 'yyyy-MM-dd HH:mm:ss')

						var $span_modifyTime = $("<SPAN>").attr("data-toggle", "tooltip")
							.attr("title", $scheduleTime)
							.text(jQuery.timeago($date_scheduleTime)).appendTo($scheduleTimeTd);
					} else {
						var $span_modifyTime = $("<SPAN>")
							.text($scheduleTime).appendTo($scheduleTimeTd);
					}

				}

				var $expense = '';

				var $startTime = (value.startTime == undefined) ? 0 : value.startTime

				if (value.endTime - $startTime > 0) {
					if ($startTime == 0) {
						$expense = 0;
					} else {
						$expense = Math.round((value.endTime - $startTime) / 60 * 100) / 100;
					}

				} else if (value.endTime - value.startTime < 0) {
					$expense = '處理中';
				} else {
					$expense = '-';
				}

				$td_status = $("<TD>").appendTo($tr);


				$("<TD>").addClass("d-none d-xl-table-cell").text($expense).appendTo($tr);

				var $modifyTime = Date.parse(value.modifyTime.replace(' ', 'T'));
				$modifyTime = $modifyTime - ($now.getTimezoneOffset() * 60000);

				var $span_modifyTime = $("<SPAN>").attr("data-toggle", "tooltip")
					.attr("title", $.format.date(new Date($modifyTime), 'yyyy-MM-dd HH:mm:ss'))
					.text(jQuery.timeago(new Date($modifyTime)));
				var $td_modifyTime = $("<TD>").addClass("d-none d-xl-table-cell").appendTo($tr);
				$span_modifyTime.appendTo($td_modifyTime);

				var $info = $("<TD>").attr("mark", $id).appendTo($tr);

				var $button = $("<DIV>").addClass("btn-group btn-group-sm").appendTo($info);
				$("<BUTTON>").attr("type", "button").addClass("btn btn-info dropdown-toggle")
					.attr("data-bs-toggle", "dropdown").attr("aria-haspopup", "true")
					.attr("aria-expanded", "false").text("Info").appendTo($button);
				var $button_menu = $("<DIV>").addClass("dropdown-menu").appendTo($button);
				//				var $edit = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-edit'> Edit </i>").appendTo($button_menu);
				var $delete = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-trash'>  Delete </i>").appendTo($button_menu);
				//				var $bt_uploadAttachment = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-file-upload'></i> Upload Files").appendTo($button_menu);

				$("<DIV>").addClass("dropdown-divider").appendTo($button_menu);
				var $groups = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-at'></i> Set Mailing Groups").appendTo($button_menu);
				var $testMail = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-vial'></i> Test Send").appendTo($button_menu);
				var $bt_receiver_parser = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-file-upload'></i> Add to Recipient Group").appendTo($button_menu);
				$("<DIV>").addClass("dropdown-divider").appendTo($button_menu);

				if ($scheduleStatus == -1 || $scheduleStatus == 1 || $scheduleStatus == 5 || $scheduleStatus == 4) {
					var $startScheduleMails = $("<A>").addClass("dropdown-item")
						.html("<i class='fas fa-1x fa-fw -square pull-right fa-mail-bulk'></i> Send").appendTo($button_menu);
					$startScheduleMails.bind("click", function () {
						mymail.panel.startScheduleMails({ id: $id });
					});
				} else if ($scheduleStatus == 0 || $scheduleStatus == 2 || $scheduleStatus == 3) {
					var $revokeScheduleMails = $("<A>").addClass("dropdown-item")
						.html("<i class='fas fa-1x fa-fw -square pull-right fa-mail-bulk'></i> Cancel Sending").appendTo($button_menu);

					if ($scheduleStatus == 2) {
						$revokeScheduleMails.text("Cancel Sending - Schedule Running...");
					}
					else {
						$revokeScheduleMails.bind("click", function () {
							mymail.action.revokeScheduleMails({ id: $id });
						});
					}

				}

				//				$("<DIV>").addClass("dropdown-divider").appendTo($button_menu);
				//				var $detail = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-columns'></i> 發信結果").appendTo($button_menu);

				$bt_uploadAttachment.bind("click", function () {
					var $json = {
						id: $id
					}
					mymail.action.attachment($json);
				});

				$delete.bind("click", function () {
					var $json = {
						emailMarketingId: $id
					}
					mymail.action.removeEmail($json);
				});

				if (value.receiverNum > 0) {
					$edit.css({ "cursor": "pointer" });
					$edit.bind("click", function () {
						var $json = {
							id: $id,
							title: $subject,
							page: 1,
							limit: 20
						}

						mymail.action.mailDetail($json);

					});
				}

				$detail.bind("click", function () {

					$status = true;
					if (value.status == 1) {
						$status = false;
					}

					var $json = {
						id: $id,
						status: $status
					}
					mymail.action.finder($json);

				});

				if ($open > 0) {
					$open_rate_td.bind("click", function () {

						var $json = {
							id: $id,
							title: $subject,
							page: 1,
							limit: 20
						}

						mymail.action.openMail($json);
					});
				}

				$testMail.bind("click", function () {
					mymail.panel.testing({ id: $id });
				});

				//				if(value.receiverNum > 0){
				//					$startScheduleMails.removeClass("disabled");
				//				}

				var $step = '-';

				if (value.status == 0) {
					$step = "請加入收件群";
					//					$$bt_receiver_parser.addClass("disabled").attr("aria-disabled", "true");
					$startScheduleMails.addClass("disabled").text($step).attr("aria-disabled", "true");
					//					$groups.addClass("disabled").attr("aria-disabled", "true");

				}
				else if (value.status == 1) {
					$delete.addClass("disabled").attr("aria-disabled", "true");
				}
				else if (value.status == 2) {
					$step = "Sending email";
					$bt_receiver_parser.addClass("disabled").attr("aria-disabled", "true");
					if ($startScheduleMails != undefined) {
						$startScheduleMails.addClass("disabled").text($step).attr("aria-disabled", "true");
					}
					$groups.addClass("disabled").attr("aria-disabled", "true");
					$edit.addClass("disabled").attr("aria-disabled", "true");
					$delete.addClass("disabled").attr("aria-disabled", "true");
					$bt_uploadAttachment.addClass("disabled").attr("aria-disabled", "true");
				}
				else if (value.status == 3) {
					$bt_receiver_parser.addClass("disabled").text("Email - Recipient processing").attr("aria-disabled", "true");
					$startScheduleMails.addClass("disabled").attr("aria-disabled", "true");
				}
				else if (value.status == 6) {
					$edit.addClass("disabled").attr("aria-disabled", "true");
					$bt_uploadAttachment.addClass("disabled").attr("aria-disabled", "true");
					$delete.addClass("disabled").attr("aria-disabled", "true");
					$bt_receiver_parser.addClass("disabled").attr("aria-disabled", "true");
					$groups.addClass("disabled").attr("aria-disabled", "true");
				}
				else if (value.status == 8) {
					$step = "Preparing system data";
					$edit.addClass("disabled").attr("aria-disabled", "true");
					$bt_uploadAttachment.addClass("disabled").attr("aria-disabled", "true");
					$delete.addClass("disabled").attr("aria-disabled", "true");
					$bt_receiver_parser.addClass("disabled").attr("aria-disabled", "true");
					$groups.addClass("disabled").attr("aria-disabled", "true");
					$startScheduleMails.addClass("disabled").text($step).attr("aria-disabled", "true");
				}

				var $span_status = $("<SPAN>");

				if (value.status == 0) {
					$span_status.addClass("badge bg-secondary").text($step);
				} else if (value.status == 1) {
					var $success_icon = $("<I>").addClass("fas fa-check");
					$success_icon.appendTo($span_status.addClass("badge bg-success"));
				} else if (value.status == 2) {
					var $sending_icon = $("<I>").addClass("fas fa-star");
					$sending_icon.appendTo($span_status.addClass("badge bg-warning"));
				} else if (value.status == 3) {
					$span_status.addClass("badge bg-warning").text("Recipient processing");
				} else if (value.status == 4) {
					var $error_icon = $("<I>").addClass("fas fa-times");
					$error_icon.appendTo($span_status.addClass("badge bg-danger"));
				} else if (value.status == 5) {
					var $receivers_uploaded_icon = $("<I>").addClass("fas fa-upload");
					$receivers_uploaded_icon.appendTo($span_status.addClass("badge bg-info"));
					$memo = 'Recipient data has been processed.';
				} else if (value.status == 6) {
					var $scheduling_icon = $("<I>").addClass("fas fa-info");
					$scheduling_icon.appendTo($span_status.addClass("badge bg-warning"));
				} else if (value.status == 7) {
					var $pasue_icon = $("<I>").addClass("fas fa-pause");
					$pasue_icon.appendTo($span_status.addClass("badge bg-secondary"));
				} else if (value.status == 8) {
					$span_status.addClass("badge bg-warning").text("Data processing");
				}

				$span_status.attr("title", $memo).attr("data-toggle", "tooltip").appendTo($td_status);

				if ($receiverConvertingNum > 0) {
					$bt_receiver_parser.addClass("disabled").text("Email - Recipient processing").attr("aria-disabled", "true");
				}

				$bt_receiver_parser.bind("click", function () {
					var $json = {
						id: $id,
						page: 1,
						limit: 20
					}
					mymail.action.listEnableMailGroup($json);
				});

				$groups.bind("click", function () {

					var $json = {
						id: $id,
						groupId: $groupId,
						page: 1,
						limit: 20
					}

					mymail.action.myProtocolGroup($json)
				});

			});

			//			var $tr = $("<TR>").appendTo($tbody);
			//			var $td =$("<TD>").attr("colspan", 9).attr("align", "center").appendTo($tr);
			//			
			//			var $btn_mail = $("<DIV>").addClass("btn-group mb-3").attr("role", "group").attr("aria-label", "Default button group").appendTo($td);
			//			var $bt_email = $("<BUTTON>").attr("type", "button").addClass("btn btn-secondary").text("新增郵件").appendTo($btn_mail);

			$('[data-toggle="tooltip"]').tooltip();
		},
		mymailCard: function (data) {

			jQuery.timeago.settings.strings = {
				prefixAgo: "",
				prefixFromNow: "in",
				suffixAgo: "ago",
				suffixFromNow: "",
				seconds: "%d seconds",
				minute: "1 minute",
				minutes: "%d minutes",
				hour: "1 hour",
				hours: "%d hours",
				day: "1 day",
				days: "%d days",
				month: "1 month",
				months: "%d months",
				year: "1 year",
				years: "%d years"
			};

			var $action = [];

			var $group = $("<DIV>").addClass("row mb-3 g-3");
			var $status = $("<DIV>").addClass("col").appendTo($group);
			var $select_status_way = $("<SELECT>").attr("id", "status").addClass("form-select form-select-sm").attr("aria-label", ".form-select-lg").appendTo($status);
			$("<OPTION>").attr("value", "").text("All Mails").appendTo($select_status_way);
			$("<OPTION>").attr("value", "0,5,7").text("Pending Mails").appendTo($select_status_way);
			$("<OPTION>").attr("value", "6").text("Scheduled").appendTo($select_status_way);
			$("<OPTION>").attr("value", "2,3,8").text("Processing").appendTo($select_status_way);
			$("<OPTION>").attr("value", "1").text("Sent").appendTo($select_status_way);
			$("<OPTION>").attr("value", "4").text("Failed").appendTo($select_status_way);
			$select_status_way.children().filter(function () {
				return $(this).text() == data.statusText;
			}).attr('selected', true);

			$select_status_way.change(function () {

				var $_status = ($(this).val() == '') ? undefined : $(this).val().split(",");

				var $json = {
					status: $_status,
					statusText: $('#status :selected').text()
				}

				mymail.action.list($json);
			});

			var $newMailGroup = $("<DIV>").addClass("col-auto").appendTo($group);
			var $newMail = $("<SPAN>").addClass("me-1").prepend($("<A>")).addClass("btn btn-primary btn-sm").text("Add New Email").appendTo($newMailGroup);
			$newMail.bind("click", function () {
				var $json = {
					url: "./email/createEmailMarketing"
				}

				mymail.action.createMail($json);
			});

			$action.push($group);

			$("#mainPage").remove();
			var $wrapper = $("<DIV>").addClass("row");
			var $footer = $("<NAV>").attr("ID", "pagging").attr("aria-label", "Page navigation example");

			var $pager = {
				id: 'mainPage',
				body: $wrapper,
				action: $action,
				subject: 'Email List',
				footer: $footer,
				target: $("#pageInfo")
			}

			mail.layout.cargo($pager);

			if (data.total > 0) {
				module.pagging({
					target: "pagging",
					anchor: "mainPage",
					records: data.total,
					link: function (param) {
						mymail.action.list(param);
					},
					current: data.page,
					limit: data.limit
				});
			}


			for (var $i = 0; $i < mymail.condition.interval.length; $i++) {
				clearInterval(mymail.condition.interval[$i.interval]);
			}

			var $card_group = $("<DIV>").addClass("card-group").appendTo($wrapper);
			var $rows = 0;
			$.each(data.list, function (index, value) {

				if ($rows % 4 == 0) {
					$card_group = $("<DIV>").addClass("card-group").appendTo($wrapper);
					$rows = 0;
				}

				value['target'] = $card_group;
				mymail.panel.mailCard(value);

				++$rows;
			});

			$('[data-toggle="tooltip"]').tooltip();

		},
		mailDetail: function (data) {

			$("#detailPage").remove();
			var $table = $("<TABLE>").addClass("table table-striped my-0");
			var $footer = $("<NAV>").attr("ID", "detailPagging").attr("aria-label", "Page navigation example");

			var $back = $("<SPAN>").addClass("me-1").prepend($("<A>")).addClass("btn btn-primary btn-sm").text("Previous");
			$back.bind("click", function () {
				$(".mailPanel").hide();
				$("#mainPage").show("slow");
			});

			var $receiver = $("<SPAN>").addClass("me-1").prepend($("<A>")).addClass("btn btn-primary btn-sm").text("Join Group");
			if (data.isAdd) {
				$receiver.bind("click", function () {
					var $json = {
						id: data.id,
						page: 1,
						limit: 20
					}
					mymail.action.listEnableMailGroup($json);
				});
			} else {
				$receiver.text("Processing recipient groups");
			}


			var $action = [];
			$action.push($back);
			$action.push($receiver);

			var $pager = {
				id: 'detailPage',
				body: $table,
				action: $action,
				subject: 'Recipient Information : ' + data.title,
				footer: $footer,
				target: $("#pageInfo")
			}

			mail.layout.cargo($pager);

			if (data.total > 0) {
				module.pagging({
					target: "detailPagging",
					anchor: "detailtable",
					records: data.total,
					link: function (param) {

						var $data = {
							id: data.id,
							page: param.page,
							limit: param.limit
						}

						mymail.action.mailDetail($data);
					},
					current: data.page,
					limit: data.limit
				});
			}

			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("Recipient").appendTo($tr);
			$("<TH>").text("Sender").addClass("d-none d-xl-table-cell").appendTo($tr);
			$("<TH>").text("Delivery Result").appendTo($tr);
			$("<TH>").addClass("d-none d-xl-table-cell").text("Send Count").appendTo($tr);
			$("<TH>").addClass("d-none d-xl-table-cell").text("Failed").appendTo($tr);
			$("<TH>").addClass("d-none d-xl-table-cell").text("Time Spent (seconds)").appendTo($tr);
			$("<TH>").addClass("d-none d-xl-table-cell").text("Sent Time").appendTo($tr);
			//			$("<TH>").text("功能").appendTo($tr);

			var $now = new Date();
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function (index, value) {
				var $id = value.id;
				var $accType = (value.type == 100) ? "(Email Testing)" : "";
				var $message = (value.message == undefined) ? '-' : value.message;

				var $span_status = $("<SPAN>");
				if (value.status == 200) {
					var $success_icon = $("<I>").addClass("fas fa-check");
					$span_status = $success_icon.appendTo($span_status.addClass("badge bg-success"));
				} else if (value.status == 0) {
					$span_status = $span_status.addClass("badge bg-info").text($message);
				} else {
					var $error_icon = $("<I>").addClass("fas fa-times");
					$span_status = $error_icon.appendTo($span_status.addClass("badge bg-danger"));
				}

				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").text(value.name + $accType)
					.attr("data-toggle", "tooltip").css({ "cursor": "pointer" }).attr("title", value.email).appendTo($tr);
				$("<TD>").addClass("d-none d-xl-table-cell").text(value.sender).appendTo($tr);

				$td_status = $("<TD>").appendTo($tr);
				$span_status.attr("title", $message).attr("data-toggle", "tooltip").appendTo($td_status);

				$("<TD>").addClass("d-none d-xl-table-cell").text(value.times).appendTo($tr);
				$("<TD>").addClass("d-none d-xl-table-cell").text(value.failTimes).appendTo($tr);
				$("<TD>").addClass("d-none d-xl-table-cell").text(value.expense).appendTo($tr);

				var $modifyTime = Date.parse(value.modifyTime.replace(' ', 'T'));
				$modifyTime = $modifyTime - ($now.getTimezoneOffset() * 60000);
				$("<TD>").addClass("d-none d-xl-table-cell").text($.format.date(new Date($modifyTime), 'yyyy-MM-dd HH:mm:ss')).appendTo($tr);

				//				var $info = $("<TD>").appendTo($tr);
				//				var $button = $("<DIV>").addClass("btn-group btn-group-sm").appendTo($info);
				//				$("<BUTTON>").attr("type", "button").addClass("btn btn-info dropdown-toggle")
				//					.attr("data-bs-toggle", "dropdown").attr("aria-haspopup", "true")
				//					.attr("aria-expanded", "false").text("Info").appendTo($button);
				//				var $button_menu = $("<DIV>").addClass("dropdown-menu").appendTo($button);
				//				var $resend = $("<A>").addClass("dropdown-item disabled").attr("aria-disabled", "true").html("<i class='fas fa-1x fa-fw -square pull-right fa-at'> 重送 </i>").appendTo($button_menu);

				//				if(value.status == 999 || value.status == 100){
				//					$resend.removeClass("disabled").attr("aria-disabled", "false");
				//				}
				//				var $json = {
				//					id : $id 
				//				}
				//				$resend.bind("click", function(){
				//					mymail.action.resend($json)
				//				});
			});
			$('[data-toggle="tooltip"]').tooltip();
		},
		openMail: function (data) {

			$("#openPage").remove();
			var $wrapper = $("<DIV>").addClass("row");
			var $cols = $("<DIV>").addClass("col-12").appendTo($wrapper);
			var $table_res = $("<DIV>").addClass("table-responsive").appendTo($cols);
			var $table = $("<TABLE>").addClass("table table-striped my-0").appendTo($table_res);
			var $footer = $("<NAV>").attr("ID", "openPagging").attr("aria-label", "Page navigation example");

			var $pager = {
				id: 'openPage',
				body: $wrapper,
				linkBackText: 'Previous',
				linkBackAction: function () {
					$(".mailPanel").hide();
					$("#mainPage").show("slow");
				},
				subject: 'Open Rate',
				footer: $footer,
				target: $("#pageInfo")
			}

			mail.layout.cargo($pager);

			if (data.total > 0) {
				module.pagging({
					target: "openPagging",
					records: data.total,
					link: function (param) {

						var $data = {
							id: data.id,
							page: param.page,
							limit: param.limit
						}

						mymail.action.openMail($data);
					},
					current: data.page,
					limit: data.limit
				});
			}


			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("Recipient").appendTo($tr);
			$("<TH>").text("OS").appendTo($tr);
			$("<TH>").text("IP").appendTo($tr);
			$("<TH>").text("Device").appendTo($tr);
			$("<TH>").text("Browser").appendTo($tr);
			$("<TH>").text("Created Time").appendTo($tr);

			var $now = new Date();
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function (index, value) {
				var $browser = value.browser;
				var $os = value.os;
				var $clientIp = value.clientIp;
				var $device = value.device;
				var $email = value.email;
				var $name = value.name;

				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").html($name)
					.attr("data-toggle", "tooltip").attr("title", $email).appendTo($tr);

				$td_status = $("<TD>").attr("data-toggle", "tooltip").attr("title", value.osVer).text($os).appendTo($tr);

				$("<TD>").text($clientIp).appendTo($tr);
				$("<TD>").text($device).appendTo($tr);
				$("<TD>").attr("data-toggle", "tooltip").attr("title", value.browserVer).text($browser).appendTo($tr);

				var $modifyTime = Date.parse(value.createdTime.replace(' ', 'T'));
				$modifyTime = $modifyTime - ($now.getTimezoneOffset() * 60000);
				$("<TD>").text(jQuery.timeago($.format.date(new Date($modifyTime), 'yyyy-MM-dd HH:mm:ss'))).appendTo($tr);

			});
			$('[data-toggle="tooltip"]').tooltip();
		},
		clickMail: function (data) {

			$("#clickPage").remove();
			var $wrapper = $("<DIV>").addClass("row");
			var $cols = $("<DIV>").addClass("col-12").appendTo($wrapper);
			var $table_res = $("<DIV>").addClass("table-responsive").appendTo($cols);
			var $table = $("<TABLE>").addClass("table table-striped my-0").appendTo($table_res);
			var $footer = $("<NAV>").attr("ID", "clickPagging").attr("aria-label", "Page navigation example");

			var $pager = {
				id: 'clickPage',
				body: $wrapper,
				linkBackText: 'Previous',
				linkBackAction: function () {
					$(".mailPanel").hide();
					$("#mainPage").show("slow");

					var $json = {
						id: data.emailMarketingId,
						subject: data.subject,
						page: 1,
						limit: 20
					}

					mymail.action.listLink($json);

				},
				subject: 'Click Link:' + data.title,
				footer: $footer,
				target: $("#pageInfo")
			}

			mail.layout.cargo($pager);

			if (data.total > 0) {
				module.pagging({
					target: "clickPagging",
					records: data.total,
					link: function (param) {

						var $data = {
							id: data.id,
							page: param.page,
							limit: param.limit
						}

						mymail.action.clickMail($data);
					},
					current: data.page,
					limit: data.limit
				});
			}


			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("Name").appendTo($tr);
			$("<TH>").text("OS").appendTo($tr);
			$("<TH>").addClass("d-none d-xl-table-cell").text("IP").appendTo($tr);
			$("<TH>").addClass("d-none d-xl-table-cell").text("Device").appendTo($tr);
			$("<TH>").addClass("d-none d-xl-table-cell").text("Browser").appendTo($tr);
			$("<TH>").addClass("d-none d-xl-table-cell").text("Created Time").appendTo($tr);

			var $now = new Date();
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function (index, value) {
				var $browser = value.browser;
				var $os = value.os;
				var $clientIp = value.clientIp;
				var $device = value.device;
				var $email = value.email;
				var $name = value.name;
				var $title = value.title;
				var $link = value.link;


				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").text($name).attr("data-toggle", "tooltip").attr("title", $email).appendTo($tr);

				$td_status = $("<TD>").attr("data-toggle", "tooltip").attr("title", value.osVer).text($os).appendTo($tr);

				$("<TD>").addClass("d-none d-xl-table-cell").text($clientIp).appendTo($tr);
				$("<TD>").addClass("d-none d-xl-table-cell").text($device).appendTo($tr);
				$("<TD>").addClass("d-none d-xl-table-cell").attr("data-toggle", "tooltip").attr("title", value.browserVer).text($browser).appendTo($tr);

				var $modifyTime = Date.parse(value.createdTime.replace(' ', 'T'));
				$modifyTime = $modifyTime - ($now.getTimezoneOffset() * 60000);
				$("<TD>").addClass("d-none d-xl-table-cell").text(jQuery.timeago($.format.date(new Date($modifyTime), 'yyyy-MM-dd HH:mm:ss'))).appendTo($tr);

			});
			$('[data-toggle="tooltip"]').tooltip();
		},
		listLink: function (data) {

			$("#clickPage").remove();

			var $wrapper = $("<DIV>").addClass("row");
			var $cols = $("<DIV>").addClass("col-8").appendTo($wrapper);
			var $table_res = $("<DIV>").addClass("table-responsive").appendTo($cols);
			var $table = $("<TABLE>").addClass("table table-striped my-0").appendTo($table_res);
			var $footer = $("<NAV>").attr("ID", "clickPagging").attr("aria-label", "Page navigation example");

			var $pager = {
				id: 'linkPage',
				body: $wrapper,
				linkBackText: 'Previous',
				linkBackAction: function () {
					$(".mailPanel").hide();
					$("#mainPage").show("slow");
				},
				subject: 'Result of Click' + data.subject,
				footer: $footer,
				target: $("#pageInfo")
			}

			mail.layout.cargo($pager);

			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("連結").attr("width", "30%").appendTo($tr);
			$("<TH>").text("收件人").appendTo($tr);
			$("<TH>").text("點擊次數").appendTo($tr);

			var $now = new Date();
			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data, function (index, value) {
				var $id = value.id;
				var $num = value.num;
				var $total = value.total;
				var $title = value.title;
				var $link = value.link;

				var $mylink = $("<A>").attr("href", $link).attr("target", "_blank").text($title);

				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").attr("width", "70%").append($mylink).appendTo($tr);
				$("<TD>").text($total).appendTo($tr);

				var $click = $("<TD>").css({ "cursor": "pointer" }).appendTo($tr);
				$("<A>").attr("href", "#").text($num).appendTo($click);

				$click.bind("click", function () {

					var $json = {
						id: $id,
						emailMarketingId: data.id,
						subject: data.subject,
						title: $title,
						page: 1,
						limit: 20
					}

					mymail.action.clickMail($json);
				})


			});

			var $cols = $("<DIV>").attr("id", "chartjs-dashboard-pie").addClass("col-4").appendTo($wrapper);
			var $canvas = $("<canvas>").attr("id", "chartjs-dashboard-pie").appendTo($cols);

			var $result = [];
			var $result_title = [];
			$.each(data, function (index, value) {
				var $num = value.num;
				var $title = value.title;

				$result_title.push($title);
				$result.push($num);
			});
			new Chart($canvas, {
				type: "pie",
				data: {
					labels: $result_title,
					datasets: [{
						data: $result,
						backgroundColor: [
							window.theme.primary,
							window.theme.warning,
							window.theme.danger
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

			$('[data-toggle="tooltip"]').tooltip();
		},
		testing: function (data) {

			var $content_input = $("<DIV>");
			var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
				.attr("role", "alert").appendTo($content_input);
			$("<BUTTON>").attr("type", "button").addClass("btn-close").attr("data-bs-dismiss", "alert")
				.attr("aria-label", "Close").appendTo($alert_message);
			var $err = $("<DIV>").addClass("alert-message").appendTo($alert_message);
			$alert_message.hide();

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Please enter the test email address").appendTo($form_group);
			var $input_email = $("<INPUT>").attr("type", "text")
				.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "For example: admin@agitg.com").appendTo($form_group);

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Please enter your name").appendTo($form_group);
			var $input_name = $("<INPUT>").attr("type", "text")
				.attr("size", 20).addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "For example: Agitg").appendTo($form_group);

			var $fun = {
				title: "Email Testing",
				content: $content_input,
				save: function () {

					var $json = {
						"emailMarketingId": data.id,
						"email": $input_email.val(),
						"name": $input_name.val()
					};

					var request = {
						"method": "POST",
						"url": "./email/trymail",
						"contentType": "application/json",
						"dataType": "json",
						"data": JSON.stringify($json),
						"timeout": 60000,
						"loading": function () {
							$.LoadingOverlay("show", {
								image: "./img/loading/preloader.gif"
							});
						},
						error: function (e) {
							$.LoadingOverlay("hide");
						},
						"handle": function (response) {
							$.LoadingOverlay("hide");

							if (response.status == 0) {
								$(".modal").modal('hide');
								$(".modal").remove();
							}

						}
					};

					utils.normalRequest(request);
				},
				saveButton: "開始測試"
			}

			module.pupopboot($fun);

			return $content_input;
		},
		startScheduleMails: function (data) {

			var $content_input = $("<DIV>");

			var $wrapper = $("<DIV>").appendTo($content_input);
			$("<SPAN>").text("注意：").appendTo($wrapper);
			var $ul = $("<UL>").appendTo($wrapper);
			$("<LI>").html("Please <font color='#FF5733'<strong>test sending emails</strong></font> first, including sender settings, email content, etc., to ensure successful email delivery").appendTo($ul);
			$("<LI>").text("If there are any failed emails, they will be resent the next time you send emails").appendTo($ul);
			$("<LI>").text("Emails that have been successfully sent will not be sent again").appendTo($ul);
			$("<LI>").text("If no mailing group is set, the system will automatically send emails using the configured sender").appendTo($ul);
			$("<DIV>").text("Once you click 'Start Sending', the system cannot be stopped if the status is 'Sending'. ").appendTo($wrapper);

			var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
				.attr("role", "alert").appendTo($content_input);

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Please select the sending method").appendTo($form_group);
			var $select_schedule_way = $("<SELECT>").addClass("form-select form-select-lg").attr("aria-label", ".form-select-lg").appendTo($form_group);
			$("<OPTION>").attr("value", -1).text("Please select").appendTo($select_schedule_way);
			$("<OPTION>").attr("value", 0).text("Send immediately").appendTo($select_schedule_way);
			$("<OPTION>").attr("value", 1).text("Schedule by date").appendTo($select_schedule_way);
			$("<OPTION>").attr("value", 2).text("Daily schedule").appendTo($select_schedule_way);

			var $datetimepicker, $max_quantity;

			$select_form_group = $("<DIV>").addClass("form-group").appendTo($content_input);

			$select_schedule_way.change(function () {
				$select_form_group.html('');
				if ($(this).val() == 0) {

					$form_group = $("<DIV>").addClass("form-group").appendTo($select_form_group);
					$("<SMALL>").addClass("form-text text-muted").text("The system will start sending emails automatically in about 5 minutes. You can cancel the sending within 5 minutes").appendTo($form_group);

				}
				else if ($(this).val() == 1) {

					$form_group = $("<DIV>").addClass("form-group").appendTo($select_form_group);
					$("<SMALL>").addClass("form-text text-muted").text("Select the target date to send emails (up to 6 months)").appendTo($form_group);
					$("<DIV>").addClass("form-group").appendTo($form_group);
					$datetimepicker = $("<INPUT>").attr("TYPE", "text").addClass("form-control").appendTo($form_group);

					$datetimepicker.datetimepicker({
						inline: true,
						format: 'Y-m-d H:i',
						step: 5,
						minDate: '-1970/01/01',
						maxDate: '+1970/06/01',
					});

				} else if ($(this).val() == 2) {
					var $form_group = $("<DIV>").addClass("form-group").appendTo($select_form_group);
					$("<SMALL>").addClass("form-text text-muted").text("Select daily sending time").appendTo($form_group);
					$("<DIV>").addClass("form-group").appendTo($form_group);
					$datetimepicker = $("<INPUT>").attr("TYPE", "text").addClass("form-control").appendTo($form_group);

					$datetimepicker.datetimepicker({
						format: 'H:i',
						minDate: '-1970/01/01',
						maxDate: '-1970/01/01',
						inline: true
					});

					var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
					$("<SMALL>").addClass("form-text text-muted").text("Daily sending quantity, until all emails are sent").appendTo($form_group);
					$("<DIV>").addClass("form-group").appendTo($form_group);
					$max_quantity = $("<INPUT>").attr("TYPE", "text").attr("value", 100).addClass("form-control").appendTo($form_group);
				}

			});

			var $fun = {
				title: "Scheduled Email Sending",
				content: $content_input,
				save: function () {

					var $type = $select_schedule_way.val();
					var $startDate = '';
					if ($type == -1) {
						$alert_message.text("Please select a sending method");
						return;
					}

					if ($type == 1 || $type == 2) {
						if ($datetimepicker.val() == '') {
							$alert_message.text("Please select a date/time");
							return;
						}

						$startDate = $datetimepicker.val() + ":00.000";
					}

					var timezoneOffset = new Date().getTimezoneOffset();

					var $json = {
						emailMarketingId: data.id,
						startDate: $startDate,
						quantity: ($max_quantity != undefined) ? $max_quantity.val() : 0,
						type: $type,
						timezoneOffset: timezoneOffset
					};


					var request = {
						"method": "POST",
						"url": "./schedule/register",
						"contentType": "application/json",
						"dataType": "json",
						"data": JSON.stringify($json),
						"timeout": 60000,
						"loading": function () {
							$.LoadingOverlay("show", {
								image: "./img/loading/preloader.gif"
							});
						},
						error: function (e) {
							$.LoadingOverlay("hide");
						},
						handle: function (response) {
							$.LoadingOverlay("hide");

							if (response.status == 0) {
								$(".modal").modal('hide');
								$(".modal").remove();
							} else if (response.status == 239) {
								alert("Please fill in the sender information before sending.");
								window.location.replace("./mysmtpgroup");
							}

							mymail.action.list(mymail.condition.list);

						}
					};

					utils.normalRequest(request);
				},
				saveButton: "Add to Schedule",

			}

			module.pupopboot($fun);

			return $content_input;
		},
		uploadReceiver: function (obj) {

			var $content_input = $("<DIV>");

			$("<DIV>").text("Note:").appendTo($content_input);
			var $ul = $("<UL>").appendTo($content_input);
			$("<LI>").html("Please enter the recipient information in the system format. It must be an Excel file. <a href='./example/agitg-receriver.xlsx'>Click here for a sample format</a>").appendTo($ul);
			$("<LI>").html("If the file is uploaded repeatedly, the system will record the email again").appendTo($ul);
			$("<LI>").text("The system will remove incorrect email addresses and will not send emails").appendTo($ul);
			$("<LI>").text("Large files require waiting time for processing, and uploading and sending a large number of emails are not supported during this period").appendTo($ul);

			var $form_group = $("<DIV>").addClass("col-xl-12 form-group h-25 d-inline-block").appendTo($content_input);
			var $fileloading = $("<DIV>").addClass("file-loading").appendTo($form_group);
			var $file = $("<INPUT>").attr("type", "file").attr("name", "file")
				.attr("id", "file").attr("multiple", '').appendTo($fileloading);

			$("<SMALL>").addClass("form-text text-muted").html("Please upload the email addresses of the recipients").appendTo($form_group);

			var $link = './email/buildReceiver';
			var $json = {
				id: obj.id
			}
			var $fun = {
				title: "Upload Receivers",
				content: $content_input,
				displayCallback: function () {
					$file.fileinput({
						browseClass: "btn btn-primary btn-block",
						maxFilePreviewSize: 10240,
						uploadUrl: $link,
						maxFileCount: 1,
						uploadExtraData: $json,
						hideThumbnailContent: true,
						maxFilePreviewSize: 10240,
						showCaption: false,
						dropZoneEnabled: false,
						showUpload: false,
						showRemove: false,
						showPreview: true,
						showBrowse: true,
						showCaption: false,
						showUpload: true,
						uploadAsync: false,
						showClose: false,
						layoutTemplates: {
							actions: '<div class="file-actions">\n' +
								'    <div class="file-footer-buttons">\n' +
								'        {upload} {delete}' +
								'    </div>\n' +
								'    {drag}\n' +
								'    <div class="clearfix"></div>\n' +
								'</div>',
							actionZoom: '',
							actionDelete: '<button type="button" class="kv-file-remove {removeClass}" title="{removeTitle}"{dataUrl}{dataKey}><i class="fas fa-trash-alt"></i></button>\n',
							actionUpload: ''
						},
						allowedFileExtensions: ['xls', 'xlsx'],
						removeFromPreviewOnError: true,
					}).on('fileuploaded', function (event, previewId, index, fileId) {
					}).on('fileuploaderror', function (event, data, msg) {
					}).on('filebatchuploadcomplete', function (event, preview, config, tags, extraData) {
						$(".modal").modal('hide');
						$(".modal").remove();

						mymail.action.list(mymail.condition.list);
					});
				}
			}

			module.pupopboot($fun);
		},
		mygroup: function (data) {
			var $table = $("<TABLE>").addClass("table table-striped my-0");

			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("Name").appendTo($tr);
			$("<TH>").html("Group Count").appendTo($tr);
			$("<TH>").text("Maximum Send Count").appendTo($tr);
			$("<TH>").html("Function").appendTo($tr);

			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.list, function (index, value) {

				var $id = value.id;

				var $mark = (data.groupId == $id) ? '*' : '';

				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").text(value.name + ' ' + $mark).appendTo($tr);
				$("<TD>").text(value.num).appendTo($tr);
				$("<TD>").text(value.maxTransaction).appendTo($tr);
				var $info = $("<TD>").appendTo($tr);

				if (data.groupId != $id) {
					var $joinSetting = $("<BUTTON>").addClass("btn btn-success btn-sm ").text("Join").appendTo($info);

					$joinSetting.bind("click", function () {

						var $json = {
							groupId: $id,
							emailMarketingId: data.id
						}
						mymail.action.joinEmailMarketingGroup($json);

					});
				} else {
					var $joinSetting = $("<BUTTON>").addClass("btn btn-secondary btn-sm disabled ").text("Joined").appendTo($info);
				}



			});


			return $table;

		},
		myEmailgroup: function (data) {

			var $content = $("<DIV>");

			$.each(data.choose, function (index, value) {
				var $bage = $("<SPAN>").addClass("ms-2").appendTo($content);

				var tag_1 = $("<SPAN>").addClass("badge bg-info ").text(value.name)
					.css({ "margin-left": "2px", "margin-bottom": "10px" }).appendTo($content);
				var close_tag = $("<I>").addClass("close fas fa-times").css({ "font-size": "12px", "padding-left": "5px" }).appendTo(tag_1);

				close_tag.bind("click", function () {

					var $json = {
						id: value.id
					}

					var $json = {
						tagId: value.id,
						id: data.id
					}

					mymail.action.removeEailGroupToEmailMarketing($json);

				});
			})


			var $table = $("<TABLE>").addClass("table table-striped my-0").appendTo($content);

			var $thead = $("<THEAD>").appendTo($table);
			var $tr = $("<TR>").appendTo($thead);
			$("<TH>").text("群組名稱").appendTo($tr);
			$("<TH>").attr("align", "right").appendTo($tr);

			var $tbody = $("<TBODY>").appendTo($table);
			$.each(data.info.list, function (index, value) {

				var $id = value.id;

				var $tr = $("<TR>").appendTo($tbody);
				$("<TD>").text(value.name).appendTo($tr);
				var $info = $("<TD>").attr("align", "right").appendTo($tr);

				var $joinSetting = $("<BUTTON>").addClass("btn btn-secondary btn-sm ").text("Join").appendTo($info);

				$joinSetting.bind("click", function () {

					var $json = {
						groupId: $id,
						id: data.id
					}

					mymail.action.joinEmailGroupToEmailMarketing($json);

				});

			});

			$("<NAV>").attr("aria-label", "Page navigation").attr("id", "pagging-mailgroup").appendTo($content);

			if (data.info.total <= 0) {
				return $content;
			}

			module.pagging({
				target: "pagging-mailgroup",
				records: data.info.total,
				link: function (param) {
					mymail.action.listEnableMailGroup(param);
				},
				current: data.page,
				limit: data.limit
			});

			return $content;

		},
		createMail: function (data) {

			var $id, $subject = '', $content = '';
			$id = data.id;
			$subject = data.subject;
			$content = data.content;

			$status = (data.status == 1) ? true : false;

			var $content_input = $("<DIV>");
			var $alert_message = $("<DIV>").addClass("alert alert-danger alert-dismissible")
				.attr("role", "alert").appendTo($content_input);
			$("<BUTTON>").attr("type", "button").addClass("btn-close").attr("data-bs-dismiss", "alert")
				.attr("aria-label", "Close").appendTo($alert_message);
			var $err = $("<DIV>").attr("id", "err_message").addClass("alert-message").appendTo($alert_message);
			$alert_message.hide();

			var $new_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-square align-middle mr-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>';
			var $form_group_tag = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Tag").appendTo($form_group_tag);

			var $form = $("<DIV>").addClass("row row-cols-md-auto align-items-center").appendTo($form_group_tag);
			var $form_group = $("<DIV>").addClass("form-group").appendTo($form);
			var $form_label = $("<LABEL>").addClass("sr-only").attr("for", "newTag").text("Tags").appendTo($form_group);
			var $input_group = $("<DIV>").addClass("input-group mb-2 mr-sm-2").appendTo($form_group);
			var $form_group_addon = $("<DIV>").addClass("input-group-text").text("@").appendTo($input_group);
			var $input_tag = $("<INPUT>").attr("type", "text").addClass("form-control").attr("id", "tags-input").appendTo($input_group);

			var tags = '', tagsarr = [];
			$.each(data.tags, function (index, value) {

				tags += value.title + ',';
				tagsarr.push({
					id: value.id,
					name: value.title
				});

			});
			$input_tag.val(tags).attr("data", JSON.stringify(tagsarr));

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Subject").appendTo($form_group);
			var $input_subject = $("<INPUT>").attr("type", "text")
				.attr("size", 15).addClass("form-control form-control-lg mb-3").attr(
					"placeholder", "Name, e.g., My first email").attr("disabled", $status).attr("value", $subject).appendTo($form_group);

			var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
			$("<SMALL>").addClass("form-text text-muted").text("Email Content").appendTo($form_group);

			var $summernote = $("<textarea>").appendTo($form_group);

			var summer = {
				target: $summernote,
				id: $id,
				content: $content
			}

			summernote.trigger(summer);

			if ($status) {
				$summernote.summernote('disable');
			}

			var $form_group = $("<DIV>").addClass("form-group d-flex justify-content-center").appendTo($content_input);
			var $submit = $("<BUTTON>").addClass("btn btn-primary my-3 ").attr("disabled", $status).text("Save").appendTo($form_group);

			$submit.bind("click", function () {
				var $content_html = $summernote.summernote('code');

				if ($input_subject.val() == '') {
					$err.text("Subject is required");
					$alert_message.show();
					return;
				}
				if ($content_html.length > 65535) {
					$err.text("Text exceeds " + $summernote.val().length + " / 60000 characters");
					$alert_message.show();
					return;
				}

				var $tag_count = $form_group_tag.children().length;
				if ($tag_count <= 0) {
					$err.text("At least 1 tag is required");
					$alert_message.show();
					return;
				}

				$alert_message.hide();
				var $json = {
					id: $id,
					subject: $input_subject.val(),
					content: $content_html,
					url: "./email/updateEmailMarketing",
					error: function (msg) {
						$err.text(msg);
						$alert_message.show();
					}
				};

				mymail.action.createMail($json);
			});

			$("#editPage").remove();

			var $pager = {
				id: 'editPage',
				body: $content_input,
				linkBackText: 'Previous',
				linkBackAction: function () {
					$(".mailPanel").hide();
					$("#mainPage").show("slow");
				},
				subject: 'Edit Mail',
				target: $("#pageInfo")
			}

			mail.layout.cargo($pager);

			$input_tag.tagsInput({
				placeholder: 'Name, Ex: News',
				delimiter: [','],
				unique: true,
				interactive: true,
				removeWithBackspace: true,
				onAddTag: function (input, value) {
					var $json = {
						emailMarketingId: $id,
						name: value,
						callback: function (obj) {
							//			            		var $result = {
							//			            			id : obj
							//			            		}
							//			            		console.log(obj)
							//			            		$(input).attr("data", JSON.stringify($result));

							var $tags = jQuery.parseJSON($(input).attr("data"));

							$tags.push({
								id: obj,
								name: value
							});

							$(input).attr("data", JSON.stringify($tags));
						}
					};

					mymail.action.buildEmailMarketingTag($json);


				},
				onRemoveTag: function (input, value) {
					var $obj = jQuery.parseJSON($(input).attr("data"));

					$.each($obj, function (index, tagValue) {

						if (tagValue.name == value) {

							var $json = {
								id: tagValue.id,
								callback: function () {
									$obj = $obj.filter(function (emp) {
										if (emp.id == tagValue.id) {
											return false;
										}
										return true;
									});
									$(input).attr("data", JSON.stringify($obj));
								}
							}

							mymail.action.removeEmailMarketingTag($json);

							return;
						}
					})


				}
			});
		},
		mailDashboard: function (obj) {

			var $wrapper = $("<DIV>").appendTo($("#" + obj.target));
			var $col = $("<DIV>").addClass("col-12 col-lg-12 col-xxl-12 d-flex").appendTo($wrapper);

			var $w100 = $("<DIV>").addClass("w-100").appendTo($col);
			var $row = $("<DIV>").addClass("row").appendTo($w100);

			var $size = 12 / obj.data.length;

			$.each(obj.data, function (index, value) {

				var $colsm3 = $("<DIV>").addClass("col-sm-" + $size).appendTo($row);
				var $card = $("<DIV>").addClass("card").appendTo($colsm3);
				var $card_body = $("<DIV>").addClass("card-body").appendTo($card);

				var $h5 = $("<H5>").addClass("card-title mb-4").text(value.title).appendTo($card_body);
				var $h1 = $("<H1>").attr("id", value.id).addClass("mt-1 mb-3").text(utils.formatNumber(value.number)).appendTo($card_body);
				var $mb1 = $("<DIV>").addClass("mb1").appendTo($card_body);

			});

			return $wrapper;

		},
		mailCard: function (value) {

			var $now = new Date();
			var $default_sender = '<svg data-toggle="tooltip" title="預設寄件人" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-navigation align-middle mr-2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>';
			var $open_icon = '<svg data-toggle="tooltip" title="等待開信" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-package align-middle mr-2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
			var $default_attachment = '<svg data-toggle="tooltip" title="無附件" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-book align-middle mr-2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>';
			var $buttonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu align-middle mr-2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';

			var $id = value.emailMarketingId;
			var $subject = value.subject;
			var $groupId = value.groupId;
			var $scheduleStatus = value.scheduleStatus;
			var $scheduleTime = value.scheduleTime;
			var $scheduleType = value.scheduleType;
			var $open = value.open;
			var $click = value.click;
			var $tags = value.tags;
			var $memo = value.memo;
			var $emailstatus = value.status;
			var $receiverNum = value.receiverNum;
			var $expectNum = value.expectNum;
			var $modifyTime = Date.parse(value.modifyTime);
			$modifyTime = $modifyTime - ($now.getTimezoneOffset() * 60000);

			var $group = $("<SPAN>").addClass("badge bg-primary me-1").attr("data-toggle", "tooltip").attr("data-bs-original-title", "Sender Group")
                .attr("aria-label", "Sender Group").text(value.groupName);

			var $groupName = (value.groupName == undefined) ? $("<SPAN>").addClass("badge bg-secondary me-1").text("Add Sender") : $group;
			var $fileSize = (value.attachmentTotalSize / 1000 == 0) ? '' : + (Math.ceil(value.attachmentTotalSize / 1000)) + " KB ";
			var $attachmentNum = (value.attachmentNum == 0) ? $default_attachment : "<SPAN class='badge bg-secondary'>" + value.attachmentNum + $fileSize + "</SPAN>";

			var $status = '-';
			var $default_subject = ($subject == ' ') ? '(No Subject)' : $subject;
			var $receiverConvertingNum = value.receiverConvertingNum;

			var $openrate = ($receiverNum == 0) ? 0 : ($open / $receiverNum) * 100;
			var $openIcon = $("<SPAN>").addClass("badge bg-primary me-1").attr("data-toggle", "tooltip").attr("data-bs-original-title", "Open Rate")
				.attr("aria-label", "Open Rate").text(utils.formatNumber($openrate) + '%');
			var $clickrate = ($receiverNum == 0) ? 0 : ($click / $receiverNum) * 100;
			var $clickIcon = $("<SPAN>").addClass("badge bg-primary me-1").attr("data-toggle", "tooltip").attr("data-bs-original-title", "Click Rate")
				.attr("aria-label", "Click Rate").text(utils.formatNumber($clickrate) + '%');

			var $tag_array = [];
			$.each($tags, function (tagIndex, tagValue) {
				$tag_array.push($("<SPAN>").addClass("badge bg-info me-1 ").text(tagValue.title));
			});

			var $att2left = [];
			var $uploadAttachment = $("<DIV>")
			var $bt_uploadAttachment = $("<SPAN>").append($.parseHTML($attachmentNum)).appendTo($uploadAttachment);
			$("<SPAN>").attr("data-toggle", "tooltip").attr("data-bs-original-title", "Attachment")
				.attr("aria-label", "Attachment").appendTo($uploadAttachment);
			$att2left.push($uploadAttachment);

			var $att2right = [];
			$att2right.push($openIcon);
			$att2right.push($clickIcon);

			var $receiver = $("<SPAN>").addClass("badge me-1 ").attr("data-toggle", "tooltip").attr("data-bs-original-title", "Recipient")
				.attr("aria-label", "Recipient").text("Add Recipient");
			var $startScheduleMails = $("<SPAN>").addClass("badge me-1 ").attr("data-toggle", "tooltip")
				.attr("data-bs-original-title", "Schedule Sending")
				.attr("aria-label", "Schedule Sending").text("Schedule Sending");

			if ($scheduleTime != undefined) {
				if ($scheduleType == 1) {
					$scheduleTime = Date.parse($scheduleTime.replace(' ', 'T'));
					$scheduleTime = $scheduleTime - ($now.getTimezoneOffset() * 60000);
					$scheduleTime = new Date($scheduleTime);
				} else {
					$scheduleTime = 'Every ' + $scheduleTime.replace(":00.000", " Executive");
				}
			} else {
				$scheduleTime = '-';
			}
			$scheduleTimeTd = $("<SPAN>");

			if ($scheduleTime > $now && value.status == 6) {
				$scheduleTimeTd.timeTo({
					timeTo: new Date($scheduleTime),
					displayDays: 2,
					theme: "white",
					fontSize: 14,
					displayCaptions: false,
					callback: function () {
						mymail.action.list(mymail.condition.list);
					}

				});
			} else {

				if ($scheduleTime != '-') {
					var $date_scheduleTime = $scheduleTime;
					$scheduleTime = $.format.date($scheduleTime, 'yyyy-MM-dd HH:mm:ss')

					var $span_modifyTime = $("<SPAN>").attr("data-toggle", "tooltip")
						.attr("title", $scheduleTime)
						.text(jQuery.timeago($date_scheduleTime)).appendTo($scheduleTimeTd);
				} else {
					var $span_modifyTime = $("<SPAN>").text($scheduleTime).appendTo($scheduleTimeTd);
				}

			}

			var $att3 = [];

			$att3.push($groupName);
			$att3.push($receiver);
			$att3.push($startScheduleMails);

			var $att4 = [];
			$att4.push($scheduleTimeTd);

			var $button = $("<DIV>").addClass("btn-group btn-group-sm");
			$("<BUTTON>").attr("type", "button").addClass("btn dropdown-toggle")
				.attr("data-bs-toggle", "dropdown").attr("aria-haspopup", "true")
				.attr("aria-expanded", "false").append($buttonIcon).appendTo($button);
			var $button_menu = $("<DIV>").addClass("dropdown-menu").appendTo($button);

			//			var $bt_receiver_parser = $("<A>").addClass("dropdown-item").html("<i class='fas fa-1x fa-fw -square pull-right fa-file-upload'></i> 加入收件群").appendTo($button_menu);

			var $testMail = $("<A>").addClass("dropdown-item")
				.html("<i class='fas fa-1x fa-fw -square pull-right fa-vial'></i> Test Mail").appendTo($button_menu);
			$("<DIV>").addClass("dropdown-divider").appendTo($button_menu);
			var $delete = $("<A>").addClass("dropdown-item")
				.html("<i class='fas fa-1x fa-fw -square pull-right fa-trash'>  Delete </i>").appendTo($button_menu);

			if ($scheduleStatus == -1 || $scheduleStatus == 1 || $scheduleStatus == 5 || $scheduleStatus == 4) {
				//				var $startScheduleMails = $("<A>").addClass("dropdown-item")
				//					.html("<i class='fas fa-1x fa-fw -square pull-right fa-mail-bulk'></i> 發信").appendTo($button_menu);
				//				$startScheduleMails.bind("click", function () {
				//					mymail.panel.startScheduleMails({id : $id});
				//				});
			} else if ($scheduleStatus == 0 || $scheduleStatus == 2 || $scheduleStatus == 3) {
				var $revokeScheduleMails = $("<A>").addClass("dropdown-item")
					.html("<i class='fas fa-1x fa-fw -square pull-right fa-mail-bulk'></i> Cance Sending").appendTo($button_menu);

					if ($scheduleStatus == 2) {
						$revokeScheduleMails.text("Cancel Sending - Scheduled Task Running...");
				}
				else {
					$revokeScheduleMails.bind("click", function () {
						mymail.action.revokeScheduleMails({ id: $id });
					});
				}
			}

			$bt_uploadAttachment.css({ "cursor": "pointer" });
			$bt_uploadAttachment.bind("click", function () {
				var $json = {
					id: $id
				}
				mymail.action.attachment($json);
			});

			$delete.bind("click", function () {
				var $json = {
					emailMarketingId: $id
				}
				mymail.action.removeEmail($json);
			});

			var $step = 'Preparing to Send';
            var $span_status = $("<SPAN>").addClass("me-1");
            var $is_receiver = false;
            var $is_schedule = true;
            if ($emailstatus == 0) {
                $span_status.addClass("badge bg-secondary").text("Please add recipients");
            }
            else if ($emailstatus == 1) {
                $delete.addClass("disabled").attr("aria-disabled", "true");
                var $success_icon = $("<I>").addClass("fas fa-check");
                $success_icon.appendTo($span_status.addClass("badge bg-success"));
                $is_receiver = true;
            }
            else if ($emailstatus == 2) {
                $step = "Sending - Sending...";
                $is_schedule = false;
                $groupName.addClass("disabled").attr("aria-disabled", "true");
                $delete.addClass("disabled").attr("aria-disabled", "true");
                $bt_uploadAttachment.addClass("disabled").attr("aria-disabled", "true");
                var $sending_icon = $("<I>").addClass("fas fa-star");
                $sending_icon.appendTo($span_status.addClass("badge bg-warning"));
            }
            else if ($emailstatus == 3) {
                $step = "Processing Recipients";
                $is_schedule = false;
                $span_status.addClass("badge bg-warning").text("Processing Recipients");

            }
            else if ($emailstatus == 4) {
                var $error_icon = $("<I>").addClass("fas fa-times");
                $error_icon.appendTo($span_status.addClass("badge bg-danger"));
                $is_receiver = true;
            }
            else if ($emailstatus == 5) {
                $is_schedule = false;
                var $receivers_uploaded_icon = $("<I>").addClass("fas fa-upload");
                $receivers_uploaded_icon.appendTo($span_status.addClass("badge bg-info"));
                $memo = 'Recipient data processing completed';
                $is_receiver = true;
			}
			else if ($emailstatus == 6) {
				$step = "Entering Schedule";
                $bt_uploadAttachment.addClass("disabled").attr("aria-disabled", "true");
                $delete.addClass("disabled").attr("aria-disabled", "true");
                $groupName.addClass("disabled").attr("aria-disabled", "true");
                var $scheduling_icon = $("<I>").addClass("fas fa-info");
                $scheduling_icon.appendTo($span_status.addClass("badge bg-warning"));
                $is_schedule = false;
            }
            else if ($emailstatus == 7) {
                var $pasue_icon = $("<I>").addClass("fas fa-pause");
                $pasue_icon.appendTo($span_status.addClass("badge bg-secondary"));
                $is_receiver = true;
            }
            else if ($emailstatus == 8) {
                $step = "Initializing Email";
                $bt_uploadAttachment.addClass("disabled").attr("aria-disabled", "true");
                $delete.addClass("disabled").attr("aria-disabled", "true");
                $groupName.addClass("disabled").attr("aria-disabled", "true");
                $is_schedule = false;
                $span_status.addClass("badge bg-warning").text("Preparing Data");
			}


			$span_status.attr("title", $memo).attr("data-toggle", "tooltip");

			var $detail = $("<SPAN>").addClass("fs-4").text($default_subject);
			$detail.css({ "cursor": "pointer" });
			$detail.bind("click", function () {

				$status = true;
				if (value.status == 1) {
					$status = false;
				}

				var $json = {
					id: $id,
					status: $status
				}
				mymail.action.finder($json);

			});

			if ($receiverConvertingNum > 0) {
				$receiver.addClass("disabled").text("Sending - Processing Recipients").attr("aria-disabled", "true");
			}

			if ($open > 0) {
				$openIcon.css({ "cursor": "pointer" });
				$openIcon.bind("click", function () {

					var $json = {
						id: $id,
						title: $subject,
						page: 1,
						limit: 20
					}

					mymail.action.openMail($json);
				});
			}

			if ($click > 0) {
				$clickIcon.css({ "cursor": "pointer" });
				$clickIcon.bind("click", function () {

					var $json = {
						id: $id,
						subject: $subject,
						page: 1,
						limit: 20
					}

					mymail.action.listLink($json);
				});
			}

			$testMail.bind("click", function () {
				mymail.panel.testing({ id: $id });
			});

			$receiver.css({ "cursor": "pointer" });
			if ($receiverNum > 0) {
				if ($is_receiver) {
					$receiver.text($receiverNum ).addClass("btn-primary");
				}
				else {
					$receiver.text($receiverNum ).addClass("btn-warning");
				}

				$receiver.bind("click", function () {
					var $json = {
						isAdd: $is_receiver,
						id: $id,
						title: $subject,
						page: 1,
						limit: 20
					}

					mymail.action.mailDetail($json);

				});

			} else {

				if ($expectNum <= 0) {
					$is_schedule = false;
					$receiver.addClass("btn-secondary");
				} else {
					$receiver.text('Exp ' + $expectNum ).addClass("btn-warning");
				}

				$receiver.bind("click", function () {
					var $json = {
						id: $id,
						page: 1,
						limit: 20
					}
					mymail.action.listEnableMailGroup($json);
				});
			}

			$groupName.css({ "cursor": "pointer" });
			$groupName.bind("click", function () {

				var $json = {
					id: $id,
					groupId: $groupId,
					page: 1,
					limit: 20
				}

				mymail.action.myProtocolGroup($json)
			});

			if ($groupId == undefined || $groupId == '') {
				$is_schedule = false;
			}

			if ($is_schedule) {
				$startScheduleMails.addClass("btn-success");
				$startScheduleMails.css({ "cursor": "pointer" });
				$startScheduleMails.bind("click", function () {
					mymail.panel.startScheduleMails({ id: $id });
				});
			} else {
				$startScheduleMails.addClass("btn-secondary").text($step);
			}

			var $json = {
				target: value.target,
				title: $detail,
				tags: $tag_array,
				status: $span_status,
				att2right: $att2right,
				att2left: $att2left,
				att3: $att3,
				att4: $att4,
				footer: {
					text: jQuery.timeago(new Date($modifyTime)),
					action: $button
				}
			}

			var $card = mail.layout.mailcard($json);

			var $target = value.target;
			if (value.target.hasClass('card-group')) {
				$card.appendTo($target);
				$target = $card;
			} else {
				$target = value.target;
				value.target.empty();
				$card.children().appendTo($target);
			}

			if ($emailstatus == 2 || $emailstatus == 3 || $emailstatus == 6 || $emailstatus == 8) {
				var $intval = setInterval(function () {

					mymail.action.findMail({
						id: value.emailMarketingId,
						target: $target,
						action: function (o) {
							clearInterval($intval);
						}
					});

				}, 5000);

				mymail.condition.interval.push($intval);
			}

		}

	}

}