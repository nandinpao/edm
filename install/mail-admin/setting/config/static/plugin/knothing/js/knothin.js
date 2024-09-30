$(document).ready(function() {
    editor();
});

var knothin = {
	varialbe :{
		editor : undefined,
		textarea : undefined,
		myKothin : undefined, 
		contents: undefined, 
		isSaved : false, 
		old : undefined, 
	},
	editor : function(){
		$("p").bind('click', function(e) {

	        if (!jQuery.isEmptyObject(knothin.variable.editor)) {
	        	knothin.variable.myKothin.empty();
	        	knothin.variable.myKothin.html(knothin.variable.contents);
	        	knothin.variable.editor.destroy();
	        	knothin.editor();
	        }

	        if (knothin.variable.isSaved) {
	        	knothin.variable.isSaved = false;
	            return;
	        }

	        if(knothin.variable.old == e){
	            return ;
	        }

	        knothin.variable.old = e;

	        var $wrapper = $("<DIV>");

	        var $text = $(this).html().replace( /[\r\n]+/gm, "" );
	        knothin.variable.textarea = $("<TEXTAREA>").attr("id", "sample").text($text).appendTo($wrapper);

	        knothin.variable.contents = $(this).html();
	        knothin.variable.myKothin = $(this);
	        knothin.variable.myKothin.empty();
	        knothin.variable.myKothin.append($wrapper);

	        knothin.variable.editor = KothingEditor.create("sample", {
	            mode: "inline",
	            display: "block",
	            codeMirror: CodeMirror,
	            width: "100%",
	            height: "auto",
	            popupDisplay: "full",
	            katex: katex,
	            toolbarItem: [
	                ["undo", "redo"],
	                ["font", "fontSize", "formatBlock"],
	                [
	                    "bold",
	                    "underline",
	                    "italic",
	                    "strike",
	                    "subscript",
	                    "superscript",
	                    "fontColor",
	                    "hiliteColor"
	                ],
	                ["outdent", "indent", "align", "list", "horizontalRule"],
	                ["link", "table", "image", "audio", "video"],
	                ["lineHeight", "textStyle"],
	                ["showBlocks", "codeView"],
	                ["math"],
	                ["preview", "fullScreen"],
	                ["removeFormat"],
	                ["save"]
	            ],
	            charCounter: true,
	            callBackSave: function(contents) {

	            	knothin.variable.myKothin.empty();
	            	knothin.variable.myKothin.html(contents);

	            	knothin.variable.editor.destroy();
	            	knothin.variable.isSaved = true;
	            	knothin.editor();

	            }


	        });

	        $(this).unbind('click');



	    });

	    if (knothin.variable.editor == undefined) {
	        return;
	    }
	}
}

