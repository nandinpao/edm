/**
 * 
 */

var userName;
var socket;

var dashsocket = {
	socket : undefined,
	build : function() {
		
		userName = 'user' + Math.floor((Math.random() * 1000) + 1)
		dashsocket.socket = io.connect('http://127.0.0.1:9095?mac=2');
		
		dashsocket.socket.on('connect',
			function() {
				dashsocket.output('<span class="connect-msg">Client has connected to the server!</span>');
		});
		
		dashsocket.socket.on('disconnect',
				function() {
					dashsocket.output('<span class="disconnect-msg">The client has disconnected!</span>');
		});
		
		dashsocket.socket.on('message', function(data, ackServerCallback) {
			
			console.log("message: " +JSON.stringify(data));
			
			dashsocket.output('<span class="username-msg">' + data.userName + ':</span> '
					+ data.message);
			
			if (ackServerCallback) {
				ackServerCallback('server message was delivered to client!');
			}
			
		});

		dashsocket.socket.on('publish', function(data, ackServerCallback, arg1) {
			
			dashsocket.output('<span class="username-msg">' + data.userName + ':</span> '
					+ data.message);
			
			if (ackServerCallback) {
				ackServerCallback('server message was delivered to client!');
			}
			
		});

//		dashsocket.socket.on('ackevent3', function(data, ackServerCallback) {
//			
//			console.log("ackevent3: " + JSON.stringify(data));
//			console.log("ackevent3: " + JSON.stringify(ackServerCallback));
//			
//			dashsocket.output('<span class="username-msg">' + data.userName + ':</span>'
//					+ data.message);
//			if (ackServerCallback) {
//				ackServerCallback();
//			}
//		});

	},
	sendMessage : function () {
		var $message = $('#msg').val();
		
//		var jsonObject = {
//			'@class' : 'com.corundumstudio.socketio.demo.ChatObject',
//			userName : userName,
//			message : $message
//		};
		
		dashsocket.socket.emit('message', $message, function(arg1, arg2) {
//			alert("ack from server! arg1: " + arg1 + ", arg2: " + arg2);
		});
		
		$('#msg').val('');
	},
	output : function (message) {
		
		var currentTime = "<span class='time'>" + moment().format('HH:mm:ss.SSS')
				+ "</span>";
		var element = $("<div>" + currentTime + " " + message + "</div>");
		$('#console').prepend(element);
		
	},
	disconnect : function(){
		dashsocket.socket.disconnect();
	}

}

 

