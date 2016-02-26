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
		context.drawImage(this.image, 
			0, 0, 
			100, 100,
			this.x, this.y,
			this.width, this.height
			)
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
		if ((this.y + this.height) > canvas.height) {
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
	};

	function clearCanvas () {
		context && context.clearRect(0, 0, canvas.width, canvas.height)
	}

	function update () {
		clearCanvas()
		ball.move()
		ball.draw()	  
	}

	function loop () {
		update()

		if (!ball.end) {
			requestAnimFrame(loop) 
		}
	}

	function Ball (ballimage, argument) {
		this.width = argument.width
		this.height = argument.height
		this.x = argument.left
		this.y = argument.top
		this.image = ballimage

		// 自由落体相关系数
		this.gravity = 0.4  // 重力加速度
		this.vy = 0.8 // 垂直方向增量
		this.vx = 4 // 水平方向增量
		this.vyAdjust = -15 // 垂直方向阻尼系数（校验参数）
		this.vxAdjust = 0.25 // 水平方向阻尼系数
		this.factor = 0.65 // 衰减系数
		this.end = false
	}

	function loadBall () {
		ball = new Ball(image, {
			width: 100,
			height: 100,
			left: 0,
			top: 0
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
