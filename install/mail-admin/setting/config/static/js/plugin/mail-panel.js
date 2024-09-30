/**
 * 
 */

var mail = {
	
	layout : {
		
		cargo : function(obj){
			
			var $action = obj.action; // html
			
			$(".mailPanel").hide();
			var $wrapper = $("<DIV>").addClass("mailPanel").attr("ID", obj.id).appendTo(obj.target);
			var $dashboard = $("<DIV>").attr("ID", obj.id + 'Dashboard').appendTo($wrapper);
			
			var $col12 = $("<DIV>").addClass("col-12 col-lg-12 col-xxl-12 d-flex").appendTo($wrapper);
			var $wrapper = $("<DIV>").addClass("card flex-fill").appendTo($col12);
			var $card_header = $("<DIV>").addClass("card-header").appendTo($wrapper);
			var $header_row = $("<DIV>").addClass("row").appendTo($card_header);
			
			var $card_left_col = $("<DIV>").addClass("col-lg-6 text-left").appendTo($header_row);
			var $h4 = $("<H4>").text(obj.subject).appendTo($card_left_col);
			
			var $card_right_col = $("<DIV>").addClass("col-lg-6 text-end").appendTo($header_row);
			
//			var $header_div = $("<H4>").addClass("card-title mb-0").appendTo($header_row);
//			var $header_row = $("<DIV>").addClass("d-flex justify-content-between").appendTo($header_div);
			
			if (obj.linkBackText != undefined){
				var $span = $("<SPAN>").appendTo($card_right_col);
				var $back = $("<A>").addClass("btn btn-primary btn-sm").text(obj.linkBackText).appendTo($span);
				$back.bind("click", function(){
					
					if (obj.linkBackAction && typeof (obj.linkBackAction) === "function") {
						obj.linkBackAction();
					}
					
				});
			}
			
			$.each($action, function(index, value) {
				$card_right_col.append(value);
			});
			
			var $card_body = $("<DIV>").addClass("card-body text-left").appendTo($wrapper);
			var $body_row = $("<DIV>").addClass("row").appendTo($card_body);
			var $col12 = $("<DIV>").addClass("col-12 col-lg-12 col-xxl-12x").appendTo($body_row);
			
			obj.body.appendTo($col12);
			
			var $card_footer = $("<DIV>").addClass("card-footer").appendTo($wrapper);
			
			if(obj.footer != undefined){
				obj.footer.appendTo($card_footer);
			}
		},
		mailcard : function(obj){
			
			var $target = obj.target;
			var $title = obj.title; // 標題
			var $status = obj.status; // 郵件狀態
			var $footer_text = obj.footer.text;
			var $footer_action = obj.footer.action;
			var $tags = obj.tags;
			
			var $att2left = obj.att2left; // html
			var $att2right = obj.att2right; // html
			
			var $att3 = obj.att3; // html
			var $att4 = obj.att4; // html
			
			var $card = $("<DIV>").addClass("card aos-item").attr("aos", "zoom-out-down");
			
			var $card_body = $("<DIV>").addClass("card-body").appendTo($card);
			
	        var $card_tag = $("<P>").addClass("card-text").appendTo($card_body);
			$.each($tags, function(index, value) {
				value.appendTo($card_tag);
			});
			
			var $card_title = $("<H5>").addClass("card-title").appendTo($card_body);
			$card_title.prepend($status);
			$card_title.append($title);
	
			var $card_2_row = $("<DIV>").addClass("row").appendTo($card_body);
			
			var $card_left_col = $("<DIV>").addClass("col-lg-6 text-left").appendTo($card_2_row);
			
			$.each($att2left, function(index, value) {
				$card_left_col.append(value);
			});
			
			var $card_right_col = $("<DIV>").addClass("col-lg-6 text-end").appendTo($card_2_row);
			
			$.each($att2right, function(index, value) {
				$card_right_col.append(value);
			});
			
			var $card_3_row = $("<DIV>").addClass("row").appendTo($card_body);
			var $card_right_col = $("<DIV>").addClass("col-lg-12 text-end").appendTo($card_3_row);
			
			$.each($att3, function(index, value) {
				$card_right_col.append(value);
			});
			
			var $card_4_row = $("<DIV>").addClass("row").appendTo($card_body);
			var $card_right_col = $("<DIV>").addClass("col-lg-12 text-end").appendTo($card_4_row);
			
			$.each($att4, function(index, value) {
				$card_right_col.append(value);
			});
			
			var $card_footer = $("<DIV>").addClass("card-footer text-end").appendTo($card);
			$("<SMALL>").addClass("text-muted").text($footer_text).appendTo($card_footer);
			$card_footer.append($footer_action);
			
			return $card;
		}
		
	}
		
}