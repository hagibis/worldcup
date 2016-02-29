var football = (function () {
	var requestAnimFrame = (function (callback) {
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||			
		window.oRequestAnimationFrame ||			
		window.msRequestAnimationFrame ||	
		function (callback) {
			setTimeout(callback, 1000 / 60)
		}
	})()

	var canvas
	var context
	var image
	var ball

	Ball.prototype.draw = function(){
		this.context.save()
		this.rotate()
		this.context.drawImage(this.image, 
			0, 0, // 开始剪切的 x,y 坐标位置。
			100, 100, // 被剪切图像的宽度、高度。
			this.x, this.y, // 在画布上放置图像的 x,y 坐标位置。
			this.width, this.height // 要使用的图像的宽度、高度。（伸展或缩小图像）
		)
		this.context.restore()

		if (this.vx > 0) 
			this.degree += 1 * this.vx
	}

	Ball.prototype.move = function(){
		// y方向
		this.y += this.vy
		this.vy += this.gravity // 实现加速下降的效果

		// x方向
		if (this.vx > 0) {
			this.x += this.vx
		}

		// 判断是否发生碰撞
		if ((this.y + this.height) > this.canvas.height) {
			this.hit()
			this.vyAdjust *= this.factor // 调整校验参数
			this.vx -= this.vxAdjust
		}

		if (this.vx < -0.1) {
			this.end = true;
		}
	}

	Ball.prototype.hit = function(){
		this.vy = this.vyAdjust
	}

	Ball.prototype.rotate = function(){
		 this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
		 this.context.rotate(Math.PI / 180 * this.degree);
		 this.context.translate(-this.x - this.width / 2, -this.y - this.height / 2);
	}

	Ball.prototype.clearCanvas = function(){
		this.context && this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	Ball.prototype.update = function() {
		this.clearCanvas()
		this.move()
		this.draw()	  
	}

	function Ball (ballimage, argument) {
		this.width = argument.width
		this.height = argument.height
		this.x = argument.left
		this.y = argument.top
		this.image = ballimage
		this.context = argument.context
		this.canvas = argument.canvas

		// 自由落体相关系数
		this.gravity = 0.4  // 重力加速度
		this.vy = 0.8 // 垂直方向增量
		this.vx = 4 // 水平方向增量
		this.vyAdjust = -15 // 垂直方向阻尼系数（校验参数）
		this.vxAdjust = 0.25 // 水平方向阻尼系数
		this.factor = 0.65 // 衰减系数
		this.end = false
		this.degree = 0
	}

	function loop () {
		ball.update()

		if (!ball.end) {
			requestAnimFrame(loop) 
		}
	}

	function loadBall () {
		ball = new Ball(image, {
			width: 100,
			height: 100,
			left: 0,
			top: 0,
			context: context,
			canvas: canvas
		})

		//ball.draw();
		loop()
	}

	function init () {
		canvas = document.getElementById("football")
		context = canvas.getContext("2d")
		image = new Image()
		image.onload = loadBall
		image.src = "football.png"
	}

	var football = {
		play: function () {
			init()
		}
	}

	return football

})()
