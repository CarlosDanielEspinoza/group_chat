const express = require("express");
const SocketIO = require("socket.io");
const path = require("path");
const dotenv = require("dotenv");
const app = express();
const fs = require("fs");

const port = process.env.PORT || 3000;

//Server
app.use(express.static(path.join(__dirname, "public")));

const Server = app.listen(port, () => {
	console.log("Servidor en el puerto:",port);

	let startUs = JSON.stringify({users:0})
	fs.writeFile("./public/files/users.json", startUs, (e) => {
		if(e) console.log(e);
	});

});

//WebSockets
const io = SocketIO(Server);

io.on("connection", (socket) => {
	
	socket.on("oneConnect", data => {

		const readUsers = fs.readFile("./public/files/users.json","utf-8", (err, datos) => {
			let json = JSON.parse(datos);

			let actuallyUsers = {users: json.users+1}
			let DataUsers = JSON.stringify(actuallyUsers);

			fs.writeFile("./public/files/users.json", DataUsers, (e) => {
				if(e) console.log(e);
			});

			io.sockets.emit("userConnect", actuallyUsers.users);
		});
	})

	socket.on("disconnect", (reason) => {
		const readUsers = fs.readFile("./public/files/users.json","utf-8", (err, datos) => {
			let json = JSON.parse(datos);

			let actuallyUsers = {users: json.users-1}
			let DataUsers = JSON.stringify(actuallyUsers);

			fs.writeFile("./public/files/users.json", DataUsers, (e) => {
				if(e) console.log(e);
			});

			io.sockets.emit("userConnect", actuallyUsers.users);
		});
	});

	socket.on("messageSend", data => {

		io.sockets.emit("messagePack", data);
	});
		
})

