const over = document.querySelector("#over");
const btnJoin = document.querySelector("#join");
const username = document.querySelector("#username");
const btnSend = document.querySelector("#btnSend");
const boxMessage = document.querySelector("#boxMessage");
const Messages = document.querySelector("#messages");

const userIndex = document.querySelector("#users");

const socket = io();
var usernameId;

btnJoin.addEventListener("click", () => {
	if((username.value).match(/\w/)){
		usernameId = (username.value).trim();
		over.style.visibility = "hidden";

	} else{
		username.style.borderColor = "red";
		username.style.backgroundColor = "pink";
	}
});

btnSend.addEventListener("click", () => {
	if((boxMessage.value).match(/\w/)){
		let bodyMessage = {
			user: usernameId,
			message: boxMessage.value,
		}
		socket.emit("messageSend", bodyMessage);
		boxMessage.value = "";
	}
});


// Sockets//
socket.emit("oneConnect", 1);

socket.on("userConnect", data => {
	userIndex.textContent = data;
});

socket.on("messagePack",(data) => {
	let classUser = "otherUser";
	if(data.user == usernameId) classUser = "myUser";

	let printMessage = document.createElement("p");
	printMessage.innerHTML = `
		<span class="${classUser}">${data.user} ~ </span> ${data.message}
	`;
	Messages.appendChild(printMessage);
});