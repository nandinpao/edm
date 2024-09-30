/**
 * 
 */
const $mainPage = $("#pageInfo");
var mytemplate = {
	condition : {
		query : {},
		list : {}
	},
	action : {

		listCatalogue : function(obj) {

			var $page, $limit;
			if (obj == undefined || obj.page == undefined) {
				$page = 1;
				$limit = 20;
			} else {
				$page = obj.page;
				$limit = obj.limit;
			}

			var $json = {
				page : $page,
				limit : $limit,
			}

			var request = {
				method : "POST",
				url : "./userTemplate/listUserCatalogue",
				dataType : "json",
				contentType : "application/json",
				data : JSON.stringify($json),
				timeout : 60000,
				loading : {
					target : "pageInfo"
				},
				error : function(ex) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {
					$.LoadingOverlay("hide");

					$mainPage.empty();

					var $reulst = mytemplate.panel.myCatalogue(response.data);
					var $wrapper = $("<DIV>").addClass("row").append($reulst);
					var $footer = $("<NAV>").attr("ID", "pagging").attr(
							"aria-label", "Page navigation example");

					var $action = [];

					var $pager = {
						id : 'mainPage',
						action : $action,
						body : $wrapper,
						subject : '我的版型分類',
						target : $mainPage
					}

					mail.layout.cargo($pager);
					mytemplate.condition.list = $reulst.clone();

				}
			};

			utils.normalRequest(request);
		},
		listTemplate : function(obj) {

			var $page, $limit, $status, $statusText;
			if (obj == undefined || obj.page == undefined) {
				$page = 1;
				$limit = 20;
			} else {
				$page = obj.page;
				$limit = obj.limit;
			}

			var $json = {
				page : $page,
				limit : $limit,
				catId : obj.catId
			}

			var request = {
				method : "POST",
				url : "./userTemplate/listUserTemplateByCatalogue",
				dataType : "json",
				contentType : "application/json",
				data : JSON.stringify($json),
				timeout : 60000,
				loading : {
					target : "pageInfo"
				},
				error : function(ex) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {

					$.LoadingOverlay("hide");
					$mainPage.empty();

					var $reulst = mytemplate.panel.myTemplate(response.data);

					var $wrapper = $("<DIV>").addClass("row").append($reulst);
					var $footer = $("<NAV>").attr("ID", "pagging").attr(
							"aria-label", "Page navigation example");

					var $action = [];
					var $link = $("<A>")
							.addClass("btn btn-primary btn-sm mx-1").attr(
									"role", "button").text("Previous");
					$link.bind("click", function() {
						bcards.clear();
						mytemplate.action.listCatalogue();
					});

					$action.push($link);

					var $pager = {
						id : 'mainPage',
						body : $wrapper,
						action : $action,
						subject : 'My Template',
						footer : $footer,
						target : $mainPage
					}

					mail.layout.cargo($pager);
					mytemplate.condition.query = $reulst;

				}
			};

			utils.normalRequest(request);
		},
		createCatalogue : function(obj) {

			var request = {
				method : "POST",
				url : "./userTemplate/createUserCatalogue",
				dataType : "json",
				contentType : "application/json",
				data : JSON.stringify(obj),
				timeout : 60000,
				loading : {
					target : "pageInfo"
				},
				error : function(ex) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {

					$.LoadingOverlay("hide");

					if (response.status == 0) {
						$(".modal").modal('hide');
						$(".modal").remove();
						bcards.clear();
					}

					mytemplate.action.listCatalogue(mytemplate.condition.list);

				}
			};

			utils.normalRequest(request);
		},
		createTemplate : function(obj) {

			var request = {
				method : "POST",
				url : "./userTemplate/createUserTemplate",
				dataType : "json",
				contentType : "application/json",
				data : JSON.stringify(obj),
				timeout : 60000,
				loading : {
					target : "pageInfo"
				},
				error : function(ex) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {

					$.LoadingOverlay("hide");

					if (response.status == 0) {
						$(".modal").modal('hide');
						$(".modal").remove();
						bcards.clear();
					}

					mytemplate.action.listTemplate(mytemplate.condition.list);

				}
			};

			utils.normalRequest(request);
		},
		removeCatalogue : function(obj) {

			var request = {
				method : "POST",
				url : "./userTemplate/removeUserTemplateCatalogue",
				dataType : "json",
				contentType : "application/json",
				data : JSON.stringify(obj),
				timeout : 60000,
				loading : {
					target : "pageInfo"
				},
				error : function(ex) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {

					$.LoadingOverlay("hide");

				}
			};

			utils.normalRequest(request);
		},
		removeTemplate : function(obj) {

			var request = {
				method : "POST",
				url : "./userTemplate/removeUserTemplate",
				dataType : "json",
				contentType : "application/json",
				data : JSON.stringify(obj),
				timeout : 60000,
				loading : {
					target : "pageInfo"
				},
				error : function(ex) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {

					$.LoadingOverlay("hide");

				}
			};

			utils.normalRequest(request);
		},
		updateTemplateTitle : function(obj) {

			var request = {
				method : "POST",
				url : "./userTemplate/updateTemplateTitle",
				dataType : "json",
				contentType : "application/json",
				data : JSON.stringify(obj),
				timeout : 60000,
				loading : {
					target : "pageInfo"
				},
				error : function(ex) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {

					$.LoadingOverlay("hide");

				}
			};

			utils.normalRequest(request);
		},
		updateTemplateContent : function(obj) {

			var request = {
				method : "POST",
				url : "./userTemplate/updateTemplateContent",
				dataType : "json",
				contentType : "application/json",
				data : JSON.stringify(obj),
				timeout : 60000,
				loading : {
					target : "pageInfo"
				},
				error : function(ex) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {

					$.LoadingOverlay("hide");

				}
			};

			utils.normalRequest(request);
		},
		findTemplate : function(obj) {

			var request = {
				method : "POST",
				url : "./userTemplate/findTemplate",
				dataType : "json",
				contentType : "application/json",
				data : JSON.stringify(obj),
				timeout : 60000,
				loading : {
					target : "pageInfo"
				},
				error : function(ex) {
					$.LoadingOverlay("hide");
				},
				handle : function(response) {

					$.LoadingOverlay("hide");

					$mainPage.html(response.data.content);
					
					knothin.editor();
				}
			};

			utils.normalRequest(request);
		},
	},
	panel : {

		myCatalogue : function(data) {

			var obj = [];
			bcards.create = function () {
				mytemplate.panel.createCatalogue();
			}
			
			$.each(data.list,function(index, value) {

								var $id = value.id;
								var $name = value.name;

								var $json = {};
								var $link = $("<A>").addClass("btn btn-primary").attr(
												"role", "button").text(value.name);

								$link.bind("click", function() {
									bcards.clear();
									mytemplate.action.listTemplate({
										catId : $id
									});
								});
								$json['id'] = $id;
								$json['title'] = $link;

								var $img = {};

								$img['src'] = 'https://mdbcdn.b-cdn.net/img/new/standard/city/041.webp';
								$img['title'] = value.name;

								$json['img'] = ($img);

								var $buttonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu align-middle mr-2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';

								var $button = $("<DIV>").addClass(
										"btn-group btn-group-sm");
								$("<BUTTON>").attr("type", "button").addClass(
										"btn dropdown-toggle").attr(
										"data-bs-toggle", "dropdown").attr(
										"aria-haspopup", "true").attr(
										"aria-expanded", "false").append(
										$buttonIcon).appendTo($button);
								var $button_menu = $("<DIV>").addClass(
										"dropdown-menu").appendTo($button);

								var $edit = $("<A>")
										.addClass("dropdown-item")
										.html(
												"<i class='fas fa-1x fa-fw -square pull-right fa-vial'></i> Edit")
										.appendTo($button_menu);
								$("<DIV>").addClass("dropdown-divider")
										.appendTo($button_menu);
								var $delete = $("<A>")
										.addClass("dropdown-item")
										.html(
												"<i class='fas fa-1x fa-fw -square pull-right fa-trash'>  Delete </i>")
										.appendTo($button_menu);

								$edit.bind("click", function() {
									var $json = {
										id : $id,
										name : $name
									}
									mytemplate.panel.createCatalogue($json);
								});

								$delete.bind("click", function() {
									var $json = {
										id : $id
									}

									mytemplate.action.removeCatalogue($json);

									bcards.remove($id);
								});

								$json['footer'] = $button;

								obj.push($json);

							});

			return bcards.build(obj);

		},
		myTemplate : function(data) {

			var obj = [];
			bcards.create = function () {
				mytemplate.panel.createTemplate();
			}
			$.each( data.list, function(index, value) {

								var $id = value.id;
								var $json = {};

								var $link = $("<BUTTON>").addClass("button-35")
										.attr("role", "button").text(
												value.title);
								$link.bind("click", function() {
									window.location.href = "./editorTemplate?id="+$id;
								});
								$json['id'] = $id;
								$json['title'] = $link;

								var $img = {};
								$img['src'] = value.image;
								$img['title'] = value.title;

								$json['img'] = ($img);

								var $buttonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu align-middle mr-2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';

								var $button = $("<DIV>").addClass(
										"btn-group btn-group-sm");
								 $("<BUTTON>").attr("type", "button").addClass(
										"btn dropdown-toggle").attr(
										"data-bs-toggle", "dropdown").attr(
										"aria-haspopup", "true").attr(
										"aria-expanded", "false").append(
										$buttonIcon).appendTo($button);
								
								var $button_menu = $("<DIV>").addClass(
										"dropdown-menu").appendTo($button);

								var $upload = $("<A>").addClass("dropdown-item")
									.html("<i class='fas fa-1x fa-fw -square pull-right fa-camera'></i> Upload Image")
									.appendTo($button_menu);
								
								$("<DIV>").addClass("dropdown-divider").appendTo($button_menu);
								
								var $delete = $("<A>").addClass("dropdown-item")
										.html("<i class='fas fa-1x fa-fw -square pull-right fa-trash'> Delete </i>")
										.appendTo($button_menu);

								$upload.bind("click", function() {
								});

								$delete.bind("click", function() {
									var $json = {
										id : $id
									}

									mytemplate.action.removeTemplate($json);

									bcards.remove($id);
								});

								$json['footer'] = $button;
								obj.push($json);

							});

			return bcards.build(obj);

		},
		createCatalogue : function(data) {

			var $id, $subject = '';
			$id = (data != undefined) ? data.id : undefined;
			$subject = (data != undefined) ? data.name : undefined;

			var $content_input = $("<DIV>");
			var $alert_message = $("<DIV>").addClass(
					"alert alert-danger alert-dismissible").attr("role",
					"alert").appendTo($content_input);
			$("<I>").addClass("close fas fa-times mx-1").css({
				"font-size" : ".5rem"
			}).attr("data-bs-dismiss", "alert").attr("aria-label", "Close")
					.appendTo($alert_message);
			var $err = $("<DIV>").addClass("alert-message").appendTo(
					$alert_message);
			$alert_message.hide();

			var $form_group = $("<DIV>").addClass("form-group").appendTo(
				$content_input);
		$("<SMALL>").addClass("form-text text-muted").text("Define Category Name")
				.appendTo($form_group);
		var $input_subject = $("<INPUT>").attr("type", "text").attr("size",
				15).addClass("form-control form-control-lg mb-3").attr(
				"placeholder", "Category Name").attr("value", $subject).appendTo(
				$form_group);

		var $title = ($id == undefined) ? "Add Category" : "Edit Category";
		var $bt = ($id == undefined) ? "Add" : "Edit";

			var $fun = {
				title : $title,
				content : $content_input,
				save : function() {

					if ($input_subject.val() == '') {
						$err.text("Name must not be empty");
						$alert_message.show();
						return;
					}

					$alert_message.hide();
					var $json = {
						id : $id,
						name : $input_subject.val()
					};

					mytemplate.action.createCatalogue($json);

				},
				saveButton : $bt
			}

			module.pupopboot($fun);
		},
		createTemplate : function(data) {

			var $id, $subject = '';
			$id = (data != undefined) ? data.id : undefined;
			$subject = (data != undefined) ? data.name : undefined;

			var $content_input = $("<DIV>");
            var $alert_message = $("<DIV>").addClass(
                    "alert alert-danger alert-dismissible").attr("role",
                    "alert").appendTo($content_input);
            $("<I>").addClass("close fas fa-times mx-1").css({
                "font-size" : ".5rem"
            }).attr("data-bs-dismiss", "alert").attr("aria-label", "Close")
                    .appendTo($alert_message);
            var $err = $("<DIV>").addClass("alert-message").appendTo(
                    $alert_message);
            $alert_message.hide();

            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("Define Template Theme Name")
                    .appendTo($form_group);
            var $input_subject = $("<INPUT>").attr("type", "text").attr("size",
                    15).addClass("form-control form-control-lg mb-3").attr(
                    "placeholder", "Template Name").attr("value", $subject).appendTo(
                    $form_group);
            
            var $form_group = $("<DIV>").addClass("form-group").appendTo($content_input);
            $("<SMALL>").addClass("form-text text-muted").text("HTML Content").appendTo($form_group);
            var $input_context = $("<TEXTAREA>").attr("rows", "20").attr("cols", 30)
                    .attr("placeholder", "<p>Welcome to Agitg</p>")
                    .addClass("form-control form-control-lg mb-3").appendTo($form_group);

            var $title = ($id == undefined) ? "Add Template" : "Edit Template";
            var $bt = ($id == undefined) ? "Add" : "Edit";
            var $fun = {
                title : $title,
                content : $content_input,
                save : function() {

                    if ($input_subject.val() == '') {
                        $err.text("Category Name is required");
                        $alert_message.show();
                        return;
                    }

                    $alert_message.hide();
                    var $json = {
                        id : $id,
                        title : $input_subject.val(),
                        content : $input_context.val(),
                    };

                    mytemplate.action.createtTemplate($json);

                },
                saveButton : $bt
            }

			module.pupopboot($fun);
		},
	}
}