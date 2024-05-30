//test
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

class Player
{
	constructor(x,y,width,height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.vx = 2;
		this.vy = 2;
		this.current = 0;
		this.keyPress = 'ArrowRight';
		this.attack = ' ';
		this.tempD = 'ArrowRight';
		this.moveCount = 0;
		this.attackCount = 0;
		this.imgs = [];
		this.health = 100;
		this.maxHealth = 100;
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

let attackData = {};

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
		
		let tempX = socketData[socket.id].x;
		let tempY = socketData[socket.id].y;
		
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
			socketData[socket.id].tempD =  moveData.keyPress;
			
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
			socketData[socket.id].tempD =  moveData.keyPress;
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
			socketData[socket.id].tempD =  moveData.keyPress;
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
			socketData[socket.id].tempD =  moveData.keyPress;
		}
		
		if(true)
		{
			let x ;
			let y ;
			
			if(socketData[socket.id].tempD=='ArrowRight')
			{
				x = socketData[socket.id].x+socketData[socket.id].width;
				y = socketData[socket.id].y+socketData[socket.id].height/2;
			}
			
			if(socketData[socket.id].tempD=='ArrowLeft')
			{
				x = socketData[socket.id].x;
				y = socketData[socket.id].y+socketData[socket.id].height/2;
			}
			
			if(socketData[socket.id].tempD=='ArrowDown')
			{
				x = socketData[socket.id].x+(socketData[socket.id].width/2)-5;
				y = socketData[socket.id].y+socketData[socket.id].height;
			}
			
			if(socketData[socket.id].tempD=='ArrowUp')
			{
				x = socketData[socket.id].x+(socketData[socket.id].width/2)-5;
				y = socketData[socket.id].y;
			}
			
			
			if(socketData[socket.id].attackCount==0)
			{
				io.emit('attack', {id:socket.id,data:{x:x,y:y,tempD:socketData[socket.id].tempD,vx:4,vy:4}});
			}
			
			socketData[socket.id].attackCount++;
			if(socketData[socket.id].attackCount >=15){
				socketData[socket.id].attackCount =0;
			}
				

		}
		
		for (let [key, value] of Object.entries(socketData)) 
		{
			
			if(key==socket.id)
			{
				continue;
			}
			
			if 
			(
				socketData[socket.id].x < socketData[key].x + socketData[key].width &&
				socketData[socket.id].x + socketData[socket.id].width > socketData[key].x &&
				socketData[socket.id].y+15 < socketData[key].y + socketData[key].height &&
				socketData[socket.id].y + socketData[socket.id].height-15 > socketData[key].y
			){
				socketData[socket.id].x =tempX;
				socketData[socket.id].y =tempY;
			}
		}
			
		io.emit('playersMove', {id:socket.id,data:socketData[socket.id]});
	
    });
	
	socket.on('attackMove', (attackMove) => {
		
		for (let [key, value] of Object.entries(socketData)) 
		{
			if(key==socket.id)
			{
				continue;
			}
			
			if 
			(
				attackMove.x < socketData[key].x + socketData[key].width &&
				attackMove.x + attackMove.width > socketData[key].x &&
				attackMove.y < socketData[key].y + socketData[key].height &&
				attackMove.y + attackMove.height > socketData[key].y
			){
				//console.log(1);
				socketData[key].health -=1;
				if(socketData[key].health<=0)
				{
					socketData[key].health =0;
				}
				io.emit('closePlayer', {id:key,data:socketData[key]});
			}
		}
		
    });
	
	socket.on('disconnect', () => {
        delete socketData[socket.id];
		io.emit('delete', socket.id);
    });
	
});

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});

