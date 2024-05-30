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
		this.health = 100;
		this.maxHealth = 100;
		this.imgs = [];
	}
	
	draw(offsetX=0,offsetY=0)
	{
		ctx.drawImage(this.imgs[this.current], this.x-offsetX, this.y-offsetY, this.width, this.height);
		
		// 血条属性
		let healthBarWidth = this.width; // 血条的总宽度
		let healthBarHeight = 5; // 血条的高度
		let healthBarX = this.x - offsetX + (this.width - healthBarWidth) / 2; // 血条的X坐标
		let healthBarY = this.y - offsetY - healthBarHeight - 5; // 血条的Y坐标，放在角色上方
		
		// 计算当前血量比例
		let healthPercentage = this.health / this.maxHealth;
		let currentHealthBarWidth = healthBarWidth * healthPercentage;
		
		// 绘制背景血条
		ctx.fillStyle = 'gray';
		ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
		
		// 绘制当前血量
		ctx.fillStyle = 'red';
		ctx.fillRect(healthBarX, healthBarY, currentHealthBarWidth, healthBarHeight);
		
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