$(document).ready(function(){
	window.addEventListener('resize',setHeight);
	setHeight();
	setHighscore();

	toPlay();
	toMain();
	toInfo();
	toInfoText();
	toPopUp();
	toReplay();
	toHighscore();
	hideOverlay();

	startBlocks();
	insertBlocks();

	toggleMusic();
	setMusic();

	bgAnimate();
	
	cacheGrid();

	$('.loading').hide();
});

/*---------------
VARIABLE DECLERATIONS
---------------*/

var blockWidth;

var myNumber;
var score=0;
var highscore;

var dataCol;
var dataRow;
var numCol=8;
var numRow=8;
var $grid=[];
var $gridNums=[];

var bgInterval;
var toInterval;

var musicState=localStorage.getItem('music');
var audio=new Audio('music/danger-storm.mp3');
audio.loop=true;

var greg=true;

/*---------------
SET HEIGHT
---------------*/

function setHeight(){
	blockWidth=$('.block-group div').width();

	$('.block-group').height(blockWidth);
	$('.block-area').height(blockWidth*numCol);

	$('.number').height(blockWidth);

	$('.number').css('top',((($('.play').height())-($('body').height()*0.02)-(blockWidth*numCol))/2));
}

/*---------------
NAVIGATION
---------------*/

function toPlay(){
	$('.play-b').click(function(){
		$('.main').hide();
		$('.play').show();

		clearInterval(bgInterval);
		timeOut();
		setHeight();
		setRandNum();
		resetScore();
	});
}

function toReplay(){
	$('.replay-b').click(function(){
		$('.game-over').hide();
		$('.overlay').hide();

		replay();
		resetScore();
		timeOut();
	});
}

function toMain(){
	$('.main-b').click(function(){
		$('.play').hide();
		$('.game-over').hide();
		$('.overlay').hide();
		$('.info').hide();
		$('.main').show();

		replay();
		bgAnimate();
	})
}

function toPopUp(){
	$('.back').click(function(){
		$('.game-over').show();
		$('.overlay').show();

		clearInterval(toInterval);
	});
}

function toInfo(){
	$('.fa-info').click(function(){
		$('.main').hide();
		$('.main-bg').show();
		$('.info').show();
	});
}

function toInfoText(){
	$('.pp-b').click(function(){
		$('.pp-text').show();
		$('.overlay').show();
	});

	$('.tou-b').click(function(){
		$('.tou-text').show();
		$('.overlay').show();
	})
}

function toHighscore(){
	$('.highscore-b').click(function(){
		$('.highscore-container').show();
		$('.overlay').show();
	});
}

function hideOverlay(){
	$('.overlay').click(function(){
		$('.pp-text').hide();
		$('.tou-text').hide();
		$('.highscore-container').hide();
		$('.game-over').hide();
		$('.overlay').hide();

		if($('.play').css('display')=='block'){
			timeOut();
		}
	});
}

/*---------------
CHANGE MENU BACKGROUND
---------------*/

function bgAnimate(){
	bgInterval = setInterval(function(){
		var numArray=[1,2,3,4,5,6,7,8,9];
		var index=Math.floor(Math.random()*numArray.length);
	
		for(var i=0;i<9;i++){
			$('.num'+(i+1)).html(numArray[index]);
			numArray.splice(index,1);
			index=Math.floor(Math.random()*numArray.length);	
		}	
	},2000)
}

/*---------------
TOGGLE MUSIC
---------------*/

function toggleMusic(){
	$('.music-state').click(function(){
		$('.fa-volume-up').toggle();
		$('.fa-volume-off').toggle();

		if($('.fa-volume-up').css('display')=='none'){
			localStorage.setItem('music','off');
			audio.pause();
		}else{
			localStorage.setItem('music','on');
			audio.play();
		}
	});
}

function setMusic(){
	if(musicState=='on'){
		$('.fa-volume-up').show();
		$('.fa-volume-off').hide();

		audio.play();
	}else if(musicState=='off'){
		$('.fa-volume-up').hide();
		$('.fa-volume-off').show();

		audio.pause();
	}else{
		audio.play();
	}
}

/*---------------
SET RANDOM NUMBER
---------------*/

function setRandNum(){
	$('.block-group div').addClass('no-clicky');	

	if($('.number-area p').html()==''){
		myNumber=Math.floor((Math.random()*9)+1);
		$('.number-area p').html(myNumber);
		$('.block-group div').removeClass('no-clicky');
	}else{
		var i=1;
		numInterval=setInterval(function(){
			myNumber=Math.floor((Math.random()*9)+1);
			$('.number-area p').html(myNumber);
			
			if(i==20){
				clearInterval(numInterval);
				$('.block-group div').removeClass('no-clicky');	
			}
			
			i++;
		},30);
	}
}

/*---------------
HIGHLIGHT BLOCKS
---------------*/

function startBlocks(){
	$('.block-area .block-group:last-child div').addClass('highlight');
}

function newBlocks(){
	$('.highlight').removeClass('highlight');

	for(y=0; y<numRow-1; y++){
		for(x=0; x<numCol; x++){
			if($grid[y][x].hasClass('selection')){
				if(!$grid[y+1][x].hasClass('selection')){
					$grid[y+1][x].addClass('highlight');
				}
			}else if(y==0 && !$grid[y][x].hasClass('selection')){
				$grid[y][x].addClass('highlight');
			}
		}
	}

	gameOver();
}

/*---------------
INSERT BLOCKS
---------------*/

function insertBlocks(){
	$('.block-group div').click(function(){
		var $this=$(this);
			
		if($this.hasClass('highlight')){
			clearInterval(toInterval);
			timeOut();

			generalInsert($this);
		}
	});
}

function generalInsert(target){
	target.removeClass('highlight');
	target.addClass('selection');
	target.html('<p>'+myNumber+'</p>');

	dataCol=parseInt(target.attr('data-column'));
	dataRow=parseInt(target.attr('data-row'));

	shapeL();
	shapeSquare();
	shapeLine();
	shapeT();
	shapeZ();

	var $winner=$('.winner');
	$winner.addClass('gagnant');

	if($winner.hasClass('gagnant')){
		setTimeout(function(){
			$winner.removeClass('selection');
			$winner.empty();
			$winner.removeClass('gagnant');
			$winner.removeClass('winner');

			newBlocks();
			setRandNum();
		},500);
	}else{
		newBlocks();
		setRandNum();
	}

	$('.score p').html(score);
	setHighscore();
}

/*---------------
HIGHSCORE
---------------*/

function setHighscore(){
	highscore=localStorage.getItem('highscore');

	if(highscore<score || highscore==null){
		localStorage.setItem('highscore',score);
		highscore=localStorage.getItem('highscore');
	}

	$('.highscore p').html(highscore);
}

/*---------------
GAME OVER
---------------*/

function gameOver(){
	if(!$('.block-group div').hasClass('highlight')){
		$('.game-over h2').html('GA<span>M</span>E OV<span>E</span>R');

		$('.game-over').show();
		$('.overlay').show();
	}
}

/*---------------
REPLAY
---------------*/

function replay(){
	$('.block-group div').removeClass('highlight');
	$('.block-group div').removeClass('selection');
	$('.game-over h2').html('P<span>A</span>U<span>S</span>E');
	$('.block-group div p').empty();

	startBlocks();
	setRandNum();
}

/*---------------
SHAPES
---------------*/

function myShape(x1,y1,x2,y2,x3,y3){
	check=false;
	
	if(0<=(dataCol+x1-1) && 0<=(dataRow+y1-1) && (numCol-1)>=(dataCol+x1-1) && (numRow-1)>=(dataRow+y1-1)){
		if(0<=(dataCol+x2-1) && 0<=(dataRow+y2-1) && (numCol-1)>=(dataCol+x2-1) && (numRow-1)>=(dataRow+y2-1)){
			if(0<=(dataCol+x3-1) && 0<=(dataRow+y3-1) && (numCol-1)>=(dataCol+x3-1) && (numRow-1)>=(dataRow+y3-1)){
				check=true;
			}
		}
	}
	
	if(check && $grid[dataRow+y1-1][dataCol+x1-1].hasClass('selection') && $grid[dataRow+y2-1][dataCol+x2-1].hasClass('selection') && $grid[dataRow+y3-1][dataCol+x3-1].hasClass('selection')){

		n1=parseInt($grid[dataRow-1][dataCol-1].html().match(/\d/));
		n2=parseInt($grid[dataRow+y1-1][dataCol+x1-1].html().match(/\d/));
		n3=parseInt($grid[dataRow+y2-1][dataCol+x2-1].html().match(/\d/));
		n4=parseInt($grid[dataRow+y3-1][dataCol+x3-1].html().match(/\d/));

		if(n1+n2+n3+n4==24){
			$grid[dataRow-1][dataCol-1].addClass('winner');
			$grid[dataRow+y1-1][dataCol+x1-1].addClass('winner');
			$grid[dataRow+y2-1][dataCol+x2-1].addClass('winner');
			$grid[dataRow+y3-1][dataCol+x3-1].addClass('winner');

			score=(score+n1+n2+n3+n4);
		}
	}
}

function shapeL(){
	// Regular L
	myShape(-1,0,-1,1,-1,2);
	myShape(1,0,0,1,0,2);
	myShape(1,-1,0,-1,0,1);
	myShape(1,-2,0,-2,0,-1);
	// L flipped across y-axis
	myShape(1,0,1,1,1,2);
	myShape(-1,0,0,1,0,2);
	myShape(-1,-1,0,-1,0,1);
	myShape(-1,-2,0,-2,0,-1);
	// L flipped across x-axis
	myShape(-1,0,-1,-1,-1,-2);
	myShape(1,0,0,-1,0,-2);
	myShape(1,1,0,1,0,-1);
	myShape(1,2,0,2,0,1);
	// L flipped across x-axis and y-axis
	myShape(1,0,1,-1,1,-2);
	myShape(-1,0,0,-1,0,-2);
	myShape(-1,1,0,1,0,-1);
	myShape(-1,2,0,2,0,1);
	// L rotated 90 degrees counter-clockwise
	myShape(0,-1,-1,-1,-2,-1);
	myShape(0,1,-1,0,-2,0);
	myShape(-1,0,1,0,1,1);
	myShape(1,0,2,0,2,1);
	// L rotated 90 degrees counter-clockwise and flipped across y-axis
	myShape(0,-1,1,-1,2,-1);
	myShape(0,1,1,0,2,0);
	myShape(-1,0,1,0,-1,1);
	myShape(-1,0,-2,0,-2,1);
	// L rotated 90 degrees counter-clockwise and flipped across x-axis
	myShape(0,1,-1,1,-2,1);
	myShape(0,-1,-1,0,-2,0);
	myShape(-1,0,1,0,1,-1);
	myShape(1,0,2,0,2,-1);
	// L rotated 90 degrees counter-clockwise and flipped across y-axis and y-axis
	myShape(0,1,1,1,2,1);
	myShape(0,-1,1,0,2,0);
	myShape(-1,0,1,0,-1,-1);
	myShape(-1,0,-2,0,-2,-1);
}

function shapeSquare(){
	myShape(1,0,1,-1,0,-1);
	myShape(-1,0,-1,-1,0,-1);
	myShape(-1,0,-1,1,0,1);
	myShape(1,0,1,1,0,1);
}

function shapeLine(){
	// Vertical line
	myShape(0,1,0,2,0,3);
	myShape(0,-1,0,1,0,2);
	myShape(0,-2,0,-1,0,1);
	myShape(0,-3,0,-2,0,-1);
	// Horizontal line
	myShape(1,0,2,0,3,0);
	myShape(-1,0,1,0,2,0);
	myShape(-2,0,-1,0,1,0);
	myShape(-3,0,-2,0,-1,0);
}

function shapeT(){
	// Regular T
	myShape(0,1,-1,1,1,1);
	myShape(-1,0,1,0,0,-1);
	myShape(1,0,2,0,1,-1);
	myShape(-1,0,-2,0,-1,-1);
	// Upside down T
	myShape(0,-1,-1,-1,1,-1);
	myShape(-1,0,1,0,0,1);
	myShape(1,0,2,0,1,1);
	myShape(-1,0,-2,0,-1,1);
	// T rotated 90 degrees counter-clockwise
	myShape(-1,0,-1,1,-1,-1);
	myShape(1,0,0,1,0,-1);
	myShape(0,-1,0,-2,1,-1);
	myShape(0,1,0,2,1,1);
	// T rotated 90 degrees clockwise
	myShape(1,0,1,1,1,-1);
	myShape(-1,0,0,1,0,-1);
	myShape(0,1,0,2,-1,1);
	myShape(0,-1,0,-2,-1,-1);
}

function shapeZ(){
	// Regular Z
	myShape(1,0,1,-1,2,-1);
	myShape(-1,0,0,-1,1,-1);
	myShape(1,0,0,1,-1,1);
	myShape(-1,0,-1,1,-2,1);
	// Z flipped along y-axis
	myShape(-1,0,-1,-1,-2,-1);
	myShape(1,0,0,-1,-1,-1);
	myShape(0,1,-1,0,1,1);
	myShape(1,0,1,1,2,1);
	//Z rotated 90 degrees clockwise
	myShape(0,1,1,1,1,2);
	myShape(0,-1,1,0,1,1);
	myShape(-1,0,-1,-1,0,1);
	myShape(0,-1,-1,-1,-1,-2);
	// Z rotated 90 degrees clockwise then flipped along x-axis
	myShape(0,1,-1,1,-1,2);
	myShape(0,-1,-1,0,-1,1);
	myShape(1,0,1,-1,0,1);
	myShape(0,-1,1,-1,1,-2);
}

/*---------------
CACHE GRID
---------------*/

function cacheGrid(){
	for(y=0; y<numRow; y++){
		$grid[y]=[];	
		for(x=0; x<numCol; x++){
			$grid[y][x]=$('div[data-row='+(y+1)+'][data-column='+(x+1)+']');
		}
	}
	
}

/*---------------
RESET SCORE
---------------*/

function resetScore(){
	score=0;
	$('.score p').html(score);
}

/*---------------
TIME OUT
---------------*/

function timeOut(){
	toInterval=setInterval(function(){
		for(y=numRow-1;y>=0;y--){
			greg=true;
			for(x=numCol-1;x>=0;x--){
				if(!$grid[y][x].hasClass('selection')){
					generalInsert($grid[y][x]);

					greg=false;
					break;
				}
			}

			if(!greg){
				break;
			}
		}
	},10000);
}