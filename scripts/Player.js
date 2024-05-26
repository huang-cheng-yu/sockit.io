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
	
	draw(offsetX=0,offsetY=0)
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