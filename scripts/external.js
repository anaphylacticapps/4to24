$(document).ready(function(){
	window.addEventListener('resize',setHeight);
	setHeight();

	toPlay();
	toMain();
	toInfo();
	toInfoText();
	toPopUp();
	toReplay();
	hideOverlay();

	startBlocks();
	insertBlocks();

	toggleMusic();
	setMusic();

	bgAnimate();

	$('.loading').hide();
});

/*---------------
VARIABLE DECLERATIONS
---------------*/

var blockWidth;

var myNumber;
var dataCol;
var dataRow;

var bgInterval;

var musicState=localStorage.getItem('music');
var audio=new Audio('music/danger-storm.mp3');
audio.loop=true;

/*---------------
SET HEIGHT
---------------*/

function setHeight(){
	blockWidth=$('.block-group div').width();

	$('.block-group').height(blockWidth);
	$('.block-area').height(blockWidth*8);

	$('.number').height(blockWidth);

	$('.number').css('top',((($('.play').height())-($('body').height()*0.02)-(blockWidth*9))/2));
}

/*---------------
NAVIGATION
---------------*/

function toPlay(){
	$('.play-b').click(function(){
		$('.main').hide();
		$('.play').show();

		clearInterval(bgInterval);
		setHeight();
		setRandNum();
	})
}

function toReplay(){
	$('.replay-b').click(function(){
		replay();

		$('.game-over').hide();
		$('.overlay').hide();
	});
}

function toMain(){
	$('.main-b').click(function(){
		replay();

		$('.play').hide();
		$('.game-over').hide();
		$('.overlay').hide();
		$('.info').hide();

		$('.main').show();
		
		bgAnimate();
	})
}

function toPopUp(){
	$('.back').click(function(){
		$('.game-over').show();
		$('.overlay').show();
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

function hideOverlay(){
	$('.overlay').click(function(){
		$('.pp-text').hide();
		$('.tou-text').hide();

		$('.game-over').hide();

		$('.overlay').hide();
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
	var gameBlocks=document.querySelectorAll('.block-group div');
	
	for(var i=0; i<gameBlocks.length;i++){
		gameBlocks[i].classList.add('no-clicky');
	}

	if(document.querySelector('.number-area p').innerHTML==''){
		myNumber=Math.floor((Math.random()*9)+1);
		document.querySelector('.number-area p').innerHTML=myNumber;
		for(var i=0; i<gameBlocks.length;i++){
			gameBlocks[i].classList.remove('no-clicky');
		}
	}else{
		var i=1;
		numInterval=setInterval(function(){
			myNumber=Math.floor((Math.random()*9)+1);
			document.querySelector('.number-area p').innerHTML=myNumber;
			
			if(i==20){
				clearInterval(numInterval);
				for(var j=0; j<gameBlocks.length;j++){
					gameBlocks[j].classList.remove('no-clicky');
				}
			}
			
			i++;
		},35);
	}
}

/*---------------
HIGHLIGHT BLOCKS
---------------*/

function startBlocks(){
	var firstRow=document.querySelectorAll('.block-area .block-group:last-child div');

	for(var i=0; i<firstRow.length;i++){
		firstRow[i].classList.add('highlight');
	}
}

function newBlocks(){
	var currBlock;
	var aboveBlock;
	var hlBlocks=document.querySelectorAll('.highlight');
	
	for(var i=0; i<hlBlocks.length;i++){
		hlBlocks[i].classList.remove('highlight');
	}

	for(var y=1;y<9;y++){
		for(var x=1;x<9;x++){
			currBlock=document.querySelector('div[data-row="'+y+'"][data-column="'+x+'"]');
			aboveBlock=document.querySelector('div[data-row="'+(y+1)+'"][data-column="'+x+'"]');
			check=(currBlock!=null && aboveBlock!=null);
 
			if(check && document.querySelector('div[data-row="'+y+'"][data-column="'+x+'"]').classList.contains('selection')){
				if(!document.querySelector('div[data-row="'+(y+1)+'"][data-column="'+x+'"]').classList.contains('selection')){
					document.querySelector('div[data-row="'+(y+1)+'"][data-column="'+x+'"]').classList.add('highlight');
				}
			}else if(y==1 && !document.querySelector('div[data-row="'+y+'"][data-column="'+x+'"]').classList.contains('selection')){
				document.querySelector('div[data-row="'+y+'"][data-column="'+x+'"]').classList.add('highlight');
			}
		}
	}

	gameOver();
}

/*---------------
INSERT BLOCKS
---------------*/

function insertBlocks(){
	var gameBlocks=document.querySelectorAll('.block-group div');

	for(var i=0; i<gameBlocks.length; i++){
		gameBlocks[i].addEventListener('click', function(event){
			var currentBlock = this;
			if (this.classList.contains('highlight')){
				this.classList.remove('highlight');	
				this.classList.add('selection');
				this.innerHTML='<p>'+myNumber+'</p>';

				dataCol=parseInt(this.getAttribute('data-column'));
				dataRow=parseInt(this.getAttribute('data-row'));

				shapeL();
				shapeSquare();
				shapeLine();
				shapeT();
				shapeZ();

				winnerBlocks=document.querySelectorAll('.winner');

				if(winnerBlocks.length>0){
					for(var j=0; j<winnerBlocks.length;j++){
						winnerBlocks[j].classList.add('gagnant');
					}

					setTimeout(function(){
						   for(var j=0; j<winnerBlocks.length;j++){
							winnerBlocks[j].classList.remove('selection');
							winnerBlocks[j].innerHTML='';
							winnerBlocks[j].classList.remove('gagnant');
							winnerBlocks[j].classList.remove('winner');
						   }

						  newBlocks();
					 	  setRandNum();
					}, 500);
				}else{
					newBlocks();
					setRandNum();
				}	
			}
		});
	}
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
	var currBlock=document.querySelector('div[data-row="'+dataRow+'"][data-column="'+dataCol+'"]');
	var adjBlock1=document.querySelector('div[data-row="'+(dataRow+y1)+'"][data-column="'+(dataCol+x1)+'"]');
	var adjBlock2=document.querySelector('div[data-row="'+(dataRow+y2)+'"][data-column="'+(dataCol+x2)+'"]');
	var adjBlock3=document.querySelector('div[data-row="'+(dataRow+y3)+'"][data-column="'+(dataCol+x3)+'"]');

	check=(adjBlock1!=null && adjBlock2!=null && adjBlock3!=null);

	if(check && adjBlock1.classList.contains('selection') && adjBlock2.classList.contains('selection') && adjBlock3.classList.contains('selection')){

		n1=parseInt(document.querySelector('div[data-row="'+dataRow+'"][data-column="'+dataCol+'"] p').innerHTML);
		n2=parseInt(document.querySelector('div[data-row="'+(dataRow+y1)+'"][data-column="'+(dataCol+x1)+'"] p').innerHTML);
		n3=parseInt(document.querySelector('div[data-row="'+(dataRow+y2)+'"][data-column="'+(dataCol+x2)+'"] p').innerHTML);
		n4=parseInt(document.querySelector('div[data-row="'+(dataRow+y3)+'"][data-column="'+(dataCol+x3)+'"] p').innerHTML);

		if(n1+n2+n3+n4==24){
			currBlock.classList.add('winner');
			adjBlock1.classList.add('winner');
			adjBlock2.classList.add('winner');
			adjBlock3.classList.add('winner');
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
