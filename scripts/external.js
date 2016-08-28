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
	$('.block-area').height(blockWidth*9);

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
		},35);
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

	for(y=1;y<10;y++){
		for(x=1;x<10;x++){
			if($('div[data-row='+y+'][data-column='+x+']').hasClass('selection')){
				if(!$('div[data-row='+(y+1)+'][data-column='+x+']').hasClass('selection')){
					$('div[data-row='+(y+1)+'][data-column='+x+']').addClass('highlight');
				}
			}else if(y==1 && !$('div[data-row='+y+'][data-column='+x+']').hasClass('selection')){
				$('div[data-row='+y+'][data-column='+x+']').addClass('highlight');
			}
		}
	}
}

/*---------------
INSERT BLOCKS
---------------*/

function insertBlocks(){
	$('.block-group div').click(function(){
		if($(this).hasClass('highlight')){
			$(this).removeClass('highlight');
			$(this).addClass('selection');
			$(this).html('<p>'+myNumber+'</p>');

			dataCol=parseInt($(this).attr('data-column'));
			dataRow=parseInt($(this).attr('data-row'));

			newBlocks();
			setRandNum();
		}
	});
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