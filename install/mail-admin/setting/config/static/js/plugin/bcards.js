/**
 * 
 */

var bcards = {
	
	column : 4,
	row : undefined,
	group : undefined,
	create : undefined,
	build : function(obj) {
		
		if(bcards.row == undefined){
			bcards.row = $("<DIV>").addClass("row");
		}
		
		if(obj.column != undefined){
			bcards.column = obj.column;
		}
		
		if(bcards.group == undefined || bcards.group.children().length > bcards.column){
			bcards.group = $("<DIV>").addClass("card-group").appendTo(bcards.row);
		}
		
		bcards.addIcon(obj).appendTo(bcards.group);
		
		$.each(obj, function(index, value){
			
			if(bcards.group == undefined || bcards.group.children().length > bcards.column){
				bcards.group = $("<DIV>").addClass("card-group").appendTo(bcards.row);
			}
			
			bcards.card(value).appendTo(bcards.group);
			
		});
		
		bcards.fillEmptyGroup();
		
		return bcards.row; 
		
	},
	card : function(obj) {
		
		var $card = $("<DIV>").addClass("bcard card mx-1").attr("data-card", obj.id);
		
		if(obj.img != undefined){
			$("<IMG>").attr("src", obj.img.src).addClass("card-img-top").attr("alt", obj.img.title).appendTo($card);
		}
		
		var $card_body = $("<DIV>").addClass("card-body").appendTo($card);
		
		$card_title = $("<H5>").addClass("card-title text-center fw-bold").appendTo($card_body);
		
		$card_title.append(obj.title);
		
		$("<P>").addClass("card-text").text(obj.text).appendTo($card_body);
		
		var $card_footer = $("<DIV>").addClass("card-footer text-end").appendTo($card);
		$("<small>").addClass("text-muted").appendTo($card_footer);
		
		if(obj.footer != undefined){
			obj.footer.appendTo($card_footer);
		}
		
		return $card;
	},
	addIcon : function(obj) {
		
		var $card = $("<DIV>").addClass("card mx-1  ");
		var $card_body = $("<DIV>").addClass("card-body  d-flex align-items-center align-self-center").appendTo($card);
		$("<I>").addClass("fas fa-plus fa-5x").appendTo($card_body);
		
		$card.bind("click", function(){
			if (bcards.create && typeof (bcards.create) === "function") {
				bcards.create();
			}
		})
		
		return $card;
	},
	clear : function(){
		
		bcards.row.empty();
		bcards.row = undefined;
		bcards.group = undefined;
		bcards.create = undefined;
		
	},
	remove : function(key) {
		
		$( ".bcard" ).each(function(index) {
			  if(key == $(this).attr("data-card")){
				  $(this).remove();
				  
				  bcards.resort();
			  }
		});
		
		
	},
	resort : function(){
		
		bcards.group == undefined;
		
		$( ".bcard" ).each(function(index, value) {
			
			if(bcards.group == undefined || bcards.group.children().length > bcards.column){
				bcards.group = $("<DIV>").addClass("card-group").appendTo(bcards.row);
			}
			
			bcards.group.append($(this));
			
		});
		
		bcards.fillEmptyGroup();
		
	},
	fillEmptyGroup : function() {
		
		if(bcards.group != undefined && bcards.group.children().length < bcards.column){
			
			var $size = bcards.column - bcards.group.children().length ;
			
			for(var $i=0; $i<$size; $i++){
				
				var $json = {};
				$json['title'] = '';
				
				var $img = {};
				$json['img'] = $img;
				
				bcards.card($json).appendTo(bcards.group);
				
			}
			
		}
	}
	
}