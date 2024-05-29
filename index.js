const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

class Player
{
	constructor(x,y,width,height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.vx = 4;
		this.vy = 4;
		this.current = 0;
		this.keyPress = '';
		this.moveCount = 0;
		this.imgs = [];
	}
	
	draw(offsetX,offsetY)
	{
		ctx.drawImage(this.imgs[this.current], this.x-offsetX, this.y-offsetY, this.width, this.height);
	}
	
	move()
	{
		if(this.keyPress=='ArrowDown')
		{	
	
			this.moveCount++;
			
			if(this.moveCount >=5)
			{
				this.current = (this.current+1) % 4;
				this.moveCount =0;
			}
			
			this.y += this.vy;
			this.y = Math.min(mapHeight-this.height,this.y );
			
			
		}else if(this.keyPress=='ArrowUp')
		{	
			this.moveCount++;
			if(this.moveCount >=5)
			{
				this.current = (this.current+1) % 4;
				this.moveCount =0;
				
			}
			this.y = Math.max(0, this.y - this.vy);
			
		}else if(this.keyPress=='ArrowLeft')
		{	
			this.moveCount++;
			if(this.moveCount >=5)
			{
				this.current = (this.current+1) % 4;
				this.moveCount =0;
				
			}
			this.x = Math.max(0, this.x - this.vx);
			
		}else if(this.keyPress=='ArrowRight')
		{	
			this.moveCount++;
			if(this.moveCount >=5)
			{
				this.current = (this.current+1) % 4;
				this.moveCount =0;
				
			}
			this.x = Math.min(mapWidth-this.width, this.x + this.vx);
			
		}else if(this.keyPress=='')
		{
			
			this.current =0;
		}
	}
}

let socketData = {};
let tempData = {};
let map = 
[
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/images', express.static(__dirname + '/public/images'));

io.on('connection', (socket) => {
	
	
	socketData[socket.id] =  new Player(Math.floor(Math.random() * 401),Math.floor(Math.random() * 401),30,40);
	//tempData[socket.id] = socketData[socket.id];
	if (!tempData[socket.id]) {
		tempData[socket.id] = {}; // 初始化為一個空對象
	}
	
	
	io.emit('currentPlayer', socketData);
	io.emit('currentMap', JSON.stringify(map));
	
	socket.on('playersMove', (moveData) => {

		socketData[socket.id].keyPress = moveData.keyPress;
		
		if(moveData.keyPress == '')
		{
			
			socketData[socket.id].moveCount =0;
			socketData[socket.id].current =0;
		}

		if(moveData.keyPress == 'ArrowRight')
		{
			socketData[socket.id].x = Math.min(600-socketData[socket.id].width, socketData[socket.id].x + socketData[socket.id].vx);
			socketData[socket.id].y = moveData.y;
			socketData[socket.id].moveCount++;
			if(socketData[socket.id].moveCount >=5)
			{
				socketData[socket.id].current =(socketData[socket.id].current+1) % 4;
				socketData[socket.id].moveCount = 0;
			}
			
		}
		
		if(moveData.keyPress == 'ArrowLeft')
		{
			socketData[socket.id].x = Math.max(0, socketData[socket.id].x - socketData[socket.id].vx);
			socketData[socket.id].y = moveData.y;
			socketData[socket.id].moveCount++;
			if(socketData[socket.id].moveCount >=5)
			{
				socketData[socket.id].current =(socketData[socket.id].current+1) % 4;
				socketData[socket.id].moveCount = 0;
			}
			
		}
		
		if(moveData.keyPress == 'ArrowUp')
		{
			socketData[socket.id].x =  moveData.x;
			socketData[socket.id].y = Math.max(0, socketData[socket.id].y - socketData[socket.id].vy);
			socketData[socket.id].moveCount++;
			if(socketData[socket.id].moveCount >=5)
			{
				socketData[socket.id].current =(socketData[socket.id].current+1) % 4;
				socketData[socket.id].moveCount = 0;
			}
			
		}

		if(moveData.keyPress == 'ArrowDown')
		{
			socketData[socket.id].x =  moveData.x;
			socketData[socket.id].y =Math.min(600-socketData[socket.id].height,socketData[socket.id].y+socketData[socket.id].vy );
			socketData[socket.id].moveCount++;
			if(socketData[socket.id].moveCount >=5)
			{
				socketData[socket.id].current =(socketData[socket.id].current+1) % 4;
				socketData[socket.id].moveCount = 0;
			}
		}

		io.emit('playersMove', {id:socket.id,data:socketData[socket.id]});

    });
	
	socket.on('checkPlayer', (checkPlayer) => {
		
		
		
    });
	
	socket.on('disconnect', () => {
        delete socketData[socket.id];
		io.emit('delete', socket.id);
    });
	
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

