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

	tutNext();

	insertBlocks();

	toggleMusic();
	setMusic();
	setMusicStorage();

	bgAnimate();

	FastClick.attach(document.body);

	$('.loading').hide();
});

/*---------------
VARIABLE DECLERATIONS
---------------*/

var blockWidth;
var blockWidthTop;

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
var tutTimeout;
var tutClassTimeout;

var tutStep=0;
var backCount=0;

var admobid={};

var musicState=localStorage.getItem('music');
var audio=new Audio('music/danger-storm.mp3');
var tapAudio=new Audio('music/tap/the-almighty-sound-snap.wav');
var winAudio=new Audio('music/winner/liorcali-electricity.mp3');
var loseAudio=new Audio('music/loser/jeremysykes-electricity00.wav');
var warnAudio=new Audio('music/warning/bekir-virtualdj-electric.mp3');
audio.loop=true;

/*---------------
SET HEIGHT
---------------*/

function setHeight(){
	if($('.play').css('display')=='block'){
		blockWidth=$('.block-group div').width();
		blockWidthTop=$('.play .number-area').width();
		numCol=4;
		numRow=4;
	}

	if($('.tutorial').css('display')=='block'){
		blockWidth=$('.tutorial .block-group div').width();
		numCol=2;
		numRow=2;
	}

	$('.block-group').height(blockWidth);

	$('.block-area').height(blockWidth*numRow);

	$('.play .number').height(blockWidthTop);

	$('.tutorial .number').height(blockWidth);

	$('.play .number').css('top',((($('.play').height())-($('body').height()*0.02)-(blockWidth*numRow))/2));
	$('.instructions').css('top',(blockWidth+($('.tutorial').height()-(blockWidth*3))/2));
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

		backCount=0;

		clearTutorial();

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

		backCount=0;

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
		instructions();
		replay();
		clearInterval(bgInterval);
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
		
		if($('.play').css('display')=='block'){
			clearTimeout(warnTimeout);
			clearTimeout(warnClassTimeout);
			$grid[warnRow][warnCol].removeClass('warning');
		}

		clearTutorial();

		replay();
		clearInterval(bgInterval);
		bgAnimate();
	});
}

function toPopUp(){
	$('.back').click(function(){
		$('.game-over').show();
		$('.overlay').show();

		warnAudio.pause();
		warnAudio.currentTime=0;

		if($('.play').css('display')=='block'){
			playPopUp();
		}

		if($('.tutorial').css('display')=='block'){
			tutPopUp();
		}
	});
}

function playPopUp(){
	backCount=1;

	$('.replay-b').show();
	$('.game-over .play-b').hide();

	$('.game-over h2').html('P<span>A</span>U<span>S</span>E');
	gameOver();

	clearTimeout(warnTimeout);
	clearTimeout(warnClassTimeout);
	$grid[warnRow][warnCol].removeClass('warning');
	interstitialAdShow();
}

function tutPopUp(){
	$('.replay-b').hide();
	$('.game-over .play-b').show();
	$('.game-over h2').html('Fo<span>u</span>r Fac<span>t</span>ors');
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
			backCount=0;
			timeOut();
		}
	});
}

function clearTutorial(){
	if(tutStep==8){
		clearTimeout(tutInsertTimeout);
    }else if(tutStep==14){
        clearTimeout(tutTimeout);
        clearTimeout(tutClassTimeout);
        $grid[0][0].removeClass('warning');
    }

    tutStep=0;
    $('.winner').removeClass('winner');
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

		setMusicStorage();
	});
}

function setMusicStorage(){
	if($('.fa-volume-up').css('display')=='none'){
			localStorage.setItem('music','off');
			musicState=localStorage.getItem('music');
			audio.pause();
			warnAudio.pause();
			warnAudio.currentTime=0;
		}else{
			localStorage.setItem('music','on');
			musicState=localStorage.getItem('music');
			audio.play();
		}
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
			randomArray=[1,2,3,4,5,6,7,8,9,10,11,12,13];

			myNumberIndex=Math.floor(Math.random()*randomArray.length);

			myNumber=randomArray[myNumberIndex];

			$('.number-area p').html(myNumber);
			
			if(i==20){
				clearInterval(numInterval);
				numInterval=null;

				setTutNumber();

				if($('.tutorial').css('display')=='none' || (tutStep!=0 && tutStep!=14 && tutStep!=15)){
					$('.block-group div').removeClass('no-clicky');
				}
			}
			
			i++;
		},30);
	}
}

/*---------------
SET TUTORIAL NUMBER
---------------*/

function setTutNumber(){
	if($('.tutorial').css('display')=='block'){
		if(tutStep==0){
			myNumber=3;
		}else if(tutStep==4){
			myNumber=2;
		}else if(tutStep==5){
			myNumber=4;
		}else if(tutStep==6){
			myNumber=12;
		}else if(tutStep==9){
			myNumber=7;
		}else if(tutStep==10){
			myNumber=7;
		}else if(tutStep==11){
			myNumber=1;
		}else if(tutStep==12){
			myNumber=7;
		}

		$('.number-area p').html(myNumber);
	}
}

/*---------------
HIGHLIGHT BLOCKS
---------------*/

function startBlocks(){
	$('.block-area .block-group div').addClass('highlight');
}

function newBlocks(){
	$('.highlight').removeClass('highlight');

	for(y=0; y<numRow; y++){
		for(x=0; x<numCol; x++){
			if(!$grid[y][x].hasClass('selection')){
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

	if(musicState=='on'){
		warnAudio.pause();
		warnAudio.currentTime=0;
		tapAudio.play();
	}

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
	if(tutStep!=7 && tutStep!=13){
		$winner.addClass('gagnant');
	}

	if($winner.hasClass('gagnant') && tutStep!=7 && tutStep!=13){
		if(musicState=='on'){
			winAudio.play();
		}

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
TUTORIAL INSERT
---------------*/

function tutInsert(){
	var $winner=$('.winner');
	$winner.addClass('gagnant');

	if($winner.hasClass('gagnant')){
		if(musicState=='on'){
			winAudio.play();
		}

		setTimeout(function(){
			$winner.removeClass('selection');
			$winner.empty();
			$winner.removeClass('gagnant');
			$winner.removeClass('winner');
			newBlocks();
			
			$('.score p').html(score);
			setHighscore();
			timeOut();
		},500);
	}
}

/*---------------
TUTORIAL INSTRUCTIONS
---------------*/

function instructions(){
	if(tutStep==0){
		$('.instructions p').html('The game is played by placing numbers on a grid.');
		$('.tut-next-container').show();
	}else if(tutStep==1){
		$('.instructions p').html('The object of the game is to make the numbers disappear.');
	}else if(tutStep==2){
		$('.instructions p').html('A group of 4 numbers will disappear if the largest is a multiple of the smaller ones.');
	}else if(tutStep==3){
		$('.instructions p').html('Tap the grid to place 4 numbers down.');
		
		$('.block-group div').removeClass('no-clicky');
		$('.tut-next-container').hide();
	}else if(tutStep==7){
		$('.instructions p').html('This group will disappear because 12 is a multiple of 3, 2, and 4.');
		
		$('.block-group div').addClass('no-clicky');
		$('.tut-next-container').show();
	}else if(tutStep==8){
		$('.tut-next-container').hide();
		tutInsert();

		tutInsertTimeout=setTimeout(function(){
			$grid[0][0].html('<p>12</p>').addClass('selection').removeClass('highlight');
			$grid[0][1].html('<p>3</p>').addClass('selection').removeClass('highlight');
			$grid[1][0].html('<p>9</p>').addClass('selection').removeClass('highlight');
			$grid[1][1].html('<p>2</p>').addClass('selection').removeClass('highlight');
			$('.instructions p').html('This group will not disappear because 12 is not a multiple of 9.');
			$('.tut-next-container').show();
		},500);
	}else if(tutStep==9){
		replay();
		$('.tut-next-container').hide();

		$('.instructions p').html('Duplicates are allowed. Place 4 numbers on the grid.');
	}else if(tutStep==13){
		$('.instructions p').html('This group will disappear because 7 is a multiple of 7 and 1.');

		$('.tut-next-container').show();
	}else if(tutStep==14){
		tutInsert();
		setRandNum();

		$('.instructions p').html('If you wait 8 seconds, the number will be automatically placed down.');
		$('.tut-next-container').hide();

		tutClassTimeout=setTimeout(function(){
			if(musicState=='on'){
				warnAudio.play();
			}

			$grid[0][0].addClass('warning');
		},6000);
							
		tutTimeout=setTimeout(function(){
			generalInsert($grid[0][0]);
		},9000);
	}else if(tutStep==15){
		$('.instructions p').html('Good luck!');
		$('.tut-next-container').show();
	}else if(tutStep==16){
		$('.tutorial-overlay').show();
		$('.game-over').show();
		tutPopUp();
	}
}

/*---------------
TUTORIAL NEXT
---------------*/

function tutNext(){
	$('.tut-next-container').click(function(){
		tutStep++;
		if(musicState=='on'){
			tapAudio.play();
		}
		instructions();
	});
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
	if(!$('.block-group div').hasClass('highlight') && $('.tutorial').css('display')=='none'){
		if(musicState=='on'){
			loseAudio.play();
		}

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

		n1=parseInt($grid[dataRow-1][dataCol-1].html().match(/\d{1,2}/));
		n2=parseInt($grid[dataRow+y1-1][dataCol+x1-1].html().match(/\d{1,2}/));
		n3=parseInt($grid[dataRow+y2-1][dataCol+x2-1].html().match(/\d{1,2}/));
		n4=parseInt($grid[dataRow+y3-1][dataCol+x3-1].html().match(/\d{1,2}/));

		madMax=Math.max(n1,n2,n3,n4);

		if(madMax%n1==0 && madMax%n2==0 && madMax%n3==0 && madMax%n4==0){
			$grid[dataRow-1][dataCol-1].addClass('winner');
			$grid[dataRow+y1-1][dataCol+x1-1].addClass('winner');
			$grid[dataRow+y2-1][dataCol+x2-1].addClass('winner');
			$grid[dataRow+y3-1][dataCol+x3-1].addClass('winner');
			
			if(madMax==12){
				score=score+10;
			}else if(madMax==10 || madMax==8 || madMax==6){
				score=score+20;
			}else if(madMax==9 || madMax==4){
				score=score+40;
			}else if(madMax==13 || madMax==11 || madMax==7 || madMax==5 || madMax==3 || madMax==2){
				score=score+80;
			}else{
				score=score+160;
			}
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
		
		for(y=0;y<numRow;y++){
			for(x=0;x<numCol;x++){
				if(!$grid[y][x].hasClass('selection')){
					
					warnRow=y;
					warnCol=x;
					
					warnClassTimeout=setTimeout(function(){
							if(musicState=='on'){
								warnAudio.play();
							}

						$grid[warnRow][warnCol].addClass('warning');
					},5000);
							
					warnTimeout=setTimeout(function(){
								generalInsert($grid[warnRow][warnCol]);
							},8000);
						
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
}

function bannerAdHideTut(){
	AdMob.removeBanner();
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
	navigator.splashscreen.hide();

	advertisement();
	bannerAdShow();
	interstitialAdPrep();

	document.addEventListener("resume", onResume, false);
    document.addEventListener("pause", onPause, false);

    function onPause(){
	    audio.pause();
	}

	function onResume(){
   		if(musicState=='on'){
			audio.play();
		}
	}

	document.addEventListener('backbutton',function(event){
		if($('.main').css('display')=='block' && $('.highscore-container').css('display')=='none'){
			event.preventDefault();
			navigator.app.exitApp();
		}else if($('.play').css('display')=='block'){
			event.preventDefault();

			if(backCount==0){
				$('.game-over').show();
				$('.overlay').show();

				warnAudio.pause();
				warnAudio.currentTime=0;

				playPopUp();
			}else if(backCount==1){
				$('.game-over').hide();
				$('.overlay').hide();

				timeOut();
				backCount=0;
			}
		}else if($('.info').css('display')=='block' || $('.tutorial').css('display')=='block' || $('.highscore-container').css('display')=='block'){
			event.preventDefault();

			if($('.tutorial').css('display')=='block'){
				bgAnimate();
			}

			$('.game-over').hide();
			$('.overlay').hide();
			$('.info').hide();
			$('.tutorial').hide();
			$('.tutorial-overlay').hide();
			$('.pp-text').hide();
			$('.tou-text').hide();
			$('.highscore-container').hide();
			$('.main').show();

			clearTutorial();
		}
	},false);
}
