/**
 * 
 */

var summernote = {
	data : undefined,
	mediaArray : [],
	trigger : function trigger(obj) {
		summernote.data = obj;
		
		obj.target
				.summernote({
					minHeight : 300,
					tabsize : 2,
					fontName : 'Roboto',
					lineHeight : 0,
					placeholder : '請輸入文字',
					spellCheck: true,
					toolbar : [
						 	['insert', ['picture', 'gallery', 'link', 'video', 'table', 'hr']],
			                ['font style', ['fontname', 'fontsize', 'color', 'bold', 'italic',
			                	'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
			                ['paragraph style', ['style', 'ol', 'ul', 'paragraph', 'height']],
			                ['agitg', ['html']]
					],
					summernoteGallery: {
			                source: {
			                    url: 'https://github.com/eissasoubhi/summernote-gallery/blob/master/server/example.json',
			                    responseDataKey: 'data',
			                    nextPageKey: 'links.next',
			                },
			                modal: {
			                    loadOnScroll: true,
			                    noImageSelected_msg: 'No image was selected, please select one by clicking it!',
			                },
			                buttonLabel: 'Gallery'
				     },		
					buttons : {
						html : summernote.button.html,
						gallery : summernote.button.gallery
					},
					callbacks: {
					    onImageUpload: function(files, editor, welEditable) {
					      summernote.upload(summernote.data, files[0], editor, welEditable);
					    }
					}

				});

		summernote.data.target.summernote('code', obj.content);
		
	},
	button : {
		html : function(context){
				
			var ui = $.summernote.ui;

			var button = ui.button( {
				contents : '<i class="fa fa-code"/>',
				tooltip : 'HTML 文字',
				click : function() {

					var $content_input = $("<DIV>");
					var $form_group = $("<DIV>").addClass("form-group")
							.appendTo($content_input);
					$("<SMALL>").addClass("form-text text-muted").text(
							"HTML格式內容 ").appendTo($form_group);
					var $input_link = $("<TEXTAREA>")
							.addClass(
									"form-control form-control-lg mb-3")
							.attr("placeholder",
									"例如： https://www.agitg.com/login")
							.attr("rows", 10)
							.appendTo($form_group);

					var $fun = {
						title : 'HTML內容',
						content : $content_input,
						id : "clickRId",
						isOnly : false,
						save : function() {

							summernote.data.target.summernote('editor.restoreRange');
							summernote.data.target.summernote('editor.focus');

							$("#clickRId").modal('hide');
							$("#clickRId").remove();
							context.invoke('editor.pasteHTML',
									$input_link.val());

						},
						saveButton : "加入",
						displayCallback : function() {
						}
					}

					module.pupopboot($fun);
				}
			});

			return button.render();
		},
		gallery : function(context) {
			
			var ui = $.summernote.ui;

			var button = ui.button( {
				contents : '<i class="fas fa-photo-video"></i>',
				tooltip : 'HTML 文字',
				click : function() {
					summernote.list(context);
				}
			});

			return button.render();
			
		},
		ctr : function(context) {
			
			var ui = $.summernote.ui;

			var button = ui.button({
				contents : '<i class="fa fa-link"/>',
				tooltip : '建立點擊率連結',
				id : "clickRId",
				click : function() {

					var $content_input = $("<DIV>");

					var $form_group = $("<DIV>").addClass("form-group")
							.appendTo($content_input);
					$("<SMALL>").addClass("form-text text-muted").text(
							"連結名稱").appendTo($form_group);
					var $input_subject = $("<INPUT>").attr("type",
							"text").attr("size", 15).addClass(
							"form-control form-control-lg mb-3").attr(
							"placeholder", "例如： 開始註冊").appendTo(
							$form_group);

					var $form_group = $("<DIV>").addClass("form-group")
							.appendTo($content_input);
					$("<SMALL>").addClass("form-text text-muted").text(
							"連結").appendTo($form_group);
					var $input_link = $("<INPUT>")
							.attr("type", "text")
							.attr("size", 15)
							.addClass(
									"form-control form-control-lg mb-3")
							.attr("placeholder",
									"例如： https://www.agitg.com/login")
							.appendTo($form_group);

					var $fun = {
						title : '建立點擊率連結',
						content : $content_input,
						id : "clickRId",
						isOnly : false,
						save : function() {

							summernote.data.target
									.summernote('editor.restoreRange');
							summernote.data.target.summernote('editor.focus');

							var $json = {
								emailMarketingId : summernote.data.id,
								title : $input_subject.val(),
								link : $input_link.val(),
								callback : function(o) {
									$("#clickRId").modal('hide');
									$("#clickRId").remove();
									var $button = '<a href="'
											+ o.link
											+ '" class="btn btn-success btn-lg active" role="button">'
											+ $input_subject.val()
											+ '</a>';
									context.invoke('editor.pasteHTML',
											$button);
								}
							}

							mymail.action
									.buildEmailMarketingLink($json);

						},
						saveButton : "加入",
						displayCallback : function() {
						}
					}

					module.pupopboot($fun);
				}
			});

			return button.render();
		}
	},
	upload : function(data, file, editor, welEditable){
		
		console.log(data);
		var $data = new FormData();
		$data.append("file", file);
		$data.append("id", data.id);
		$data.append("width", 800);
		$data.append("height", 600);
        
        $.ajax({
            data: $data,
            type: 'POST',
//            xhr: function() {
//                var myXhr = $.ajaxSettings.xhr();
//                if (myXhr.upload) myXhr.upload.addEventListener('progress', progressHandlingFunction, false);
//                return myXhr;
//            },
            url: './myimage/upload',
            cache: false,
            contentType: false,
            processData: false,
            mimeType: 'multipart/form-data',
            success: function(response) {
            	
            	var resp = jQuery.parseJSON( response );
            	data.target.summernote("insertImage", 'http://' + resp.data.host + resp.data.path + resp.data.filename , 'filename');
            	
            }
        });
		
	},
	progress : function(e){
		if(e.lengthComputable){
	        $('progress').attr({value:e.loaded, max:e.total});
	        if (e.loaded == e.total) {
	            $('progress').attr('value','0.0');
	        }
	    }
	},
	list : function(context) {
		
		var $json = {
				page : 1,
				limit : 20
		}
		
		var request = {
				method : "POST",
				url : "./myimage/list",
				dataType : "json",
				contentType : "application/json",
				data : JSON.stringify($json),
				timeout : 60000,
				loading : {
					target : "pageInfo"
				},
				error : function(ex){
					$.LoadingOverlay("hide");
				},
				handle : function(response) {
					$.LoadingOverlay("hide");
					
					var $wrapper = $("<DIV>").addClass("row");
					var $cols = $("<DIV>").addClass("col").appendTo($wrapper);
					var $col = $("<DIV>").addClass("mb-3 p-3").appendTo($cols);
					
					$.each(response.data.list, function(index, value) {
						var $src =  value.src;
						var $title =  value.title;
						
						var $label = $("<LABEL>").addClass("image-checkbox").css({"width" : "auto"}).appendTo($col);
						$("<IMG>").attr("src", $src).attr("title", $title).attr("alt", $title).appendTo($label);
						var $imageHeader = $("<SPAN>").addClass("image-header").appendTo($label);
						$("<I>").addClass("fa fa-check i-img").appendTo($imageHeader);
						
						var $imageFooter = $("<SPAN>").addClass("image-footer").appendTo($label);
						var $remove = $("<I>").addClass("fa fa-trash i-img").appendTo($imageFooter);
						
						$remove.bind("click", function(){
							var $json = {
								target : $label,
								id : value.id
							}
							summernote.remove($json);
						});
						
					});
                 
					var $fun = {
							title : '上傳圖庫',
							content : $wrapper,
							id : "clickRId",
							isOnly : false,
							save : function() {

								summernote.data.target.summernote('editor.restoreRange');
								summernote.data.target.summernote('editor.focus');

								$("#clickRId").modal('hide');
								$("#clickRId").remove();
								
								$.each(summernote.mediaArray, function(index, value) {
									summernote.data.target.summernote("insertImage", value.attr("src") , value.attr("title"));
								});

							},
							saveButton : "加入",
							displayCallback : function() {
								summernote.imageGallery();
							}
					}

					module.pupopboot($fun);
                 
				}
			};

			utils.normalRequest(request);
	},
	remove : function(obj) {
		var request = {
				method : "POST",
				url : "./myimage/remove",
				dataType : "json",
				contentType : "application/json",
				data : JSON.stringify(obj),
				timeout : 60000,
				loading : {
					target : "pageInfo"
				},
				error : function(ex){
					$.LoadingOverlay("hide");
				},
				handle : function(response) {
					$.LoadingOverlay("hide");
					
					obj.target.remove();
					
				}
			};

			utils.normalRequest(request);
	},
	imageGallery : function(){
		
	    var selectedMediasId;
	    var isMultipleAllowed = true;
	    var prevItem = null;
	    $(".image-checkbox").on("click", function (e) {
	        var selected = $(this).find('img');

	        if ($(this).hasClass('image-checkbox-checked')) {
	            $(this).removeClass('image-checkbox-checked');
	            // remove deselected item from array
	            summernote.mediaArray = $.grep(summernote.mediaArray, function (value) {
	                return value != selected;
	            });
	        }
	        else {
	            if (isMultipleAllowed == false) {
	                $('.image-checkbox-checked').each(function () {
	                    $(this).removeClass('image-checkbox-checked');
	                });
	                summernote.mediaArray = [];
	                summernote.mediaArray.push(selected);
	            } else {
	                if (e.shiftKey) { 
	                    var psort = $(prevItem).attr('jms-sort');
	                    var nsort = $(this).attr('jms-sort');
	                    var d = 0;
	                    console.log(psort);
	                    if (psort !== 'undefined') {
	                        d = nsort - psort;
	                    };
	                    if (d < 0) {
	                        $(prevItem).prevUntil(this).each(function () {
	                            $(this).addClass('image-checkbox-checked');
	                        });
	                    } else {
	                        $(prevItem).nextUntil(this).each(function () {
	                            $(this).addClass('image-checkbox-checked');
	                        });
	                    }
	                }
	            }
	            $(this).addClass('image-checkbox-checked');
	            prevItem = $(this);
	            summernote.mediaArray = [];
	            $('.image-checkbox-checked').each(function () {
	            	summernote.mediaArray.push(($(this).find('img')));
	            });
	        }

	        selectedMediasId = summernote.mediaArray.join(",");

	    });
	}
	
	
}