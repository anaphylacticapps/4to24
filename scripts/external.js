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
	toTut();
	hideOverlay();

	insertBlocks();

	toggleMusic();
	setMusic();

	bgAnimate();

	//FastClick.attach(document.body);

	//advertisement();
	//bannerAdShow();
	//interstitialAdPrep();

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
var numCol;
var numRow;
var $grid=[];
var warnRow;
var warnCol;
var numGoal=10;

var bgInterval;
var toInterval;
var numInterval=null;
var warnTimeout;
var warnClassTimeout;

var tutStep=0;
var backCount=0;

var musicState=localStorage.getItem('music');
var audio=new Audio('music/danger-storm.mp3');
var tapAudio=new Audio('');
var winAudio=new Audio('');
var loseAudio=new Audio('');
audio.loop=true;

/*---------------
SET HEIGHT
---------------*/

function setHeight(){
	if($('.play').css('display')=='block'){
		blockWidth=$('.block-group div').width();
		numCol=4;
		numRow=4;
	}

	if($('.tutorial').css('display')=='block'){
		blockWidth=$('.tutorial .block-group div').width();
		numCol=2;
		numRow=3;
	}

	$('.block-group').height(blockWidth);

	$('.block-area').height(blockWidth*numRow);

	$('.number').height(blockWidth);

	$('.play .number').css('top',((($('.play').height())-($('body').height()*0.02)-(blockWidth*numRow))/2));
}

/*---------------
NAVIGATION
---------------*/

function toPlay(){
	$('.play-b').click(function(){
		$('.main').hide();
		$('.play').show();
		$('.tutorial').hide();
		$('.game-over').hide();
		$('.overlay').hide();
		$('.tutorial-overlay').hide();

		clearInterval(bgInterval);
		setHeight();
		cacheGrid('.play');
		setRandNum();
		resetScore();
		timeOut();
		startBlocks();
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

function toTut(){
	$('.tut-b').click(function(){
		$('.main').hide();
		$('.tutorial').show();
		tutStep=0;

		setHeight();
		cacheGrid('.tutorial');
		resetScore();
		setRandNum();
		instructions();
		startBlocks();
	});
}

function toMain(){
	$('.main-b').click(function(){
		$('.play').hide();
		$('.game-over').hide();
		$('.overlay').hide();
		$('.info').hide();
		$('.main').show();
		$('.tutorial').hide();
		$('.tutorial-overlay').hide();

		replay();
		bgAnimate();
		
		if($('.play').css('display')=='block'){
			clearTimeout(warnTimeout);
			clearTimeout(warnClassTimeout);
			$grid[warnRow][warnCol].removeClass('warning');
		}
	})
}

function toPopUp(){
	$('.back').click(function(){
		$('.game-over').show();
		$('.overlay').show();

		if($('.play').css('display')=='block'){
			playPopUp();
		}

		if($('.tutorial').css('display')=='block'){
			tutPopUp();
		}
	});
}

function playPopUp(){
	$('.replay-b').show();
	$('.game-over .play-b').hide();

	$('.game-over h2').html('P<span>A</span>U<span>S</span>E');
	gameOver();

	clearTimeout(warnTimeout);
	clearTimeout(warnClassTimeout);
	$grid[warnRow][warnCol].removeClass('warning');

	//interstitialAdShow();
}

function tutPopUp(){
	$('.replay-b').hide();
	$('.game-over .play-b').show();
	$('.game-over h2').html('4 <span>t</span>o <span>2</span>4');
}

function toInfo(){
	$('.fa-info').click(function(){
		$('.main').hide();
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
	
	if (numInterval==null){
		var i=1;
		numInterval=setInterval(function(){
			myNumber=Math.floor((Math.random()*6)-0);

			$('.number-area p').html(myNumber);
			
			if(i==20){
				clearInterval(numInterval);
				numInterval=null;

				if($('.tutorial').css('display')=='block'){
					if(tutStep==0){
						myNumber=4;
					}else if(tutStep==1){
						myNumber=1;
					}else if(tutStep==2){
						myNumber=8;
					}else if(tutStep==3){
						myNumber=2;
					}else if(tutStep==4){
						myNumber=3;
					}

					$('.number-area p').html(myNumber);
				}

				if(tutStep!=2){
					$('.block-group div').removeClass('no-clicky');
				}
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
			if($('.play').css('display')=='block'){
				clearTimeout(warnTimeout);
				clearTimeout(warnClassTimeout);
				$grid[warnRow][warnCol].removeClass('warning');
			}

			generalInsert($this);
		}
	});
}

function generalInsert(target){
	$('.block-group div').addClass('no-clicky');
	target.removeClass('highlight');
	target.removeClass('warning');
	target.addClass('selection');
	target.html('<p>'+myNumber+'</p>');

	dataCol=parseInt(target.attr('data-column'));
	dataRow=parseInt(target.attr('data-row'));

	if($('.tutorial').css('display')=='block'){
		tutStep++;
		instructions();
	}

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
			
			$('.score p').html(score);
			setHighscore();
			timeOut();
		},500);
	}else{
		newBlocks();
		setRandNum();
		
		$('.score p').html(score);
		setHighscore();
		timeOut();
	}
}

/*---------------
TUTORIAL INSTRUCTIONS
---------------*/

function instructions(){
	if(tutStep==0){
		$('.instructions p').html('Touch a shaded block to place a piece down.');
	}else if(tutStep==1){
		$('.instructions p').html('You need exactly four adjacent blocks that add up to 10.');
	}else if(tutStep==2){
		$('.instructions p').html('If you wait 20 seconds, the block will be automatically placed down.');

		var tutTimeout=setTimeout(function(){
			$grid[2][1].addClass('warning');
		},4000);
							
		warnTimeout=setTimeout(function(){
			generalInsert($grid[2][1]);
		},9000);
	}else if(tutStep==3){
		$('.instructions p').html('You lose when you run out of empty spaces.');
	}else if(tutStep==4){
		$('.instructions p').html('Place your last piece down and good luck!');
	}else if(tutStep==5){
		setTimeout(function(){
			$('.tutorial-overlay').show();
			$('.game-over').show();
			$('.replay-b').hide();
			$('.game-over .play-b').show();
			$('.game-over h2').html('4 <span>t</span>o <span>4</span>');
		},500);
	}
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
		
		clearTimeout(warnTimeout);
		clearTimeout(warnClassTimeout);

		$('.replay-b').show();
		$('.game-over .play-b').hide();
	}
}

/*---------------
REPLAY
---------------*/

function replay(){
	$('.block-group div').removeClass('highlight');
	$('.block-group div').removeClass('selection');
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

		n1=parseInt($grid[dataRow-1][dataCol-1].html().match(/-?\d/));
		n2=parseInt($grid[dataRow+y1-1][dataCol+x1-1].html().match(/-?\d/));
		n3=parseInt($grid[dataRow+y2-1][dataCol+x2-1].html().match(/-?\d/));
		n4=parseInt($grid[dataRow+y3-1][dataCol+x3-1].html().match(/-?\d/));

		if(n1+n2+n3+n4==numGoal){
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

function cacheGrid(page){
	for(y=0; y<numRow; y++){
		$grid[y]=[];	
		for(x=0; x<numCol; x++){
			$grid[y][x]=$(page+' div[data-row='+(y+1)+'][data-column='+(x+1)+']');
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
	if($('.play').css('display')=='block'){
		var greg=true;
		
		for(y=numRow-1;y>=0;y--){
			for(x=numCol-1;x>=0;x--){
				if(!$grid[y][x].hasClass('selection')){
					
					warnRow=y;
					warnCol=x;
					
					warnClassTimeout=setTimeout(function(){
								$grid[warnRow][warnCol].addClass('warning');
							},15000);
							
					warnTimeout=setTimeout(function(){
								generalInsert($grid[warnRow][warnCol]);
							},20000);
						
					greg=false;
					break;
				}
			}

			if(!greg){
				break;
			}
		}
	}
}

/*---------------
ADVERTISEMENT
---------------*/

function advertisement(){
	if(/(android)/i.test(navigator.userAgent)){ // for android & amazon-fireos
    	admobid={
    		banner: 'ca-app-pub-4721144554459045/9645148012', // or DFP format "/6253334/dfp_example_ad"
    		interstitial: 'ca-app-pub-4721144554459045/2121881216'
    	};
    }else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)){ // for ios
    	admobid={
    		banner: 'ca-app-pub-4721144554459045/5075347613', // or DFP format "/6253334/dfp_example_ad"   
    		interstitial: 'ca-app-pub-4721144554459045/6552080812'
    	};
    }
}

function bannerAdShow(){
	if(AdMob) AdMob.createBanner({
        adId:admobid.banner,
        position:AdMob.AD_POSITION.BOTTOM_CENTER,
        autoShow:true
    });
}

function bannerAdHideStart(){
	AdMob.removeBanner();
	location.replace('start.html');
}

function bannerAdHideTut(){
	AdMob.removeBanner();
	location.replace('tutorial.html');
}

function interstitialAdPrep(){
	if(AdMob) AdMob.prepareInterstitial({
		adId:admobid.interstitial,
		autoShow:false
	});
}

function interstitialAdShow(){
	AdMob.showInterstitial();
}

/*---------------
HANDLE BACK BUTTON
---------------*/

document.addEventListener('deviceready',onDeviceReady,false);

function onDeviceReady(){
	//navigator.splashscreen.hide();

	document.addEventListener("resume", onResume, false);
    document.addEventListener("pause", onPause, false);

    function onPause(){
	    audio.pause();
	}

	function onResume(){
   		if($('.fa-volume-up').css('display')!='none'){
			audio.play();
		}
	}

	document.addEventListener('backbutton',function(event){
		if($('.main').css('display')=='block'){
			event.preventDefault();
			navigator.app.exitApp();
		}else if($('.play').css('display')=='block'){
			event.preventDefault();

			playPopUp();
			backCount++;
			if(backCount==2){
				$('.game-over').hide();
				$('.overlay').hide();
				backCount=0;
			}
		}else if($('.info').css('display')=='block' || $('.tutorial').css('display')=='block'){
			event.preventDefault();

			$('.game-over').hide();
			$('.overlay').hide();
			$('.info').hide();
			$('.main').show();
			$('.tutorial').hide();
			$('.tutorial-overlay').hide();
			$('.pp-text').hide();
			$('.tou-text').hide();
		}
	},false);
}