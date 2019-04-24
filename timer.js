// Timer
let min = 0;
let sec = '00';
let tsec = '00';
let timer;
const target = document.getElementById('timer');
function timerStart(){
	sec = '00';
	timer = setInterval(x=()=>{
		tsec++;
		if(tsec>99){
			sec++;
			tsec = '0' + 0;
			if(sec>59){
				min++;
				sec=0;
			};
			if(sec<10){
				sec = '0'+sec;
			}
		} else if(tsec<10){
			tsec = '0' + tsec;
		} else {
			tsec = tsec;
		};
		target.innerHTML = min+':'+sec+':'+tsec;
	}, 10);
};

// Counter
let counter;
function counterStart(num){
	let startSec = num;
	target.innerHTML = startSec;
	counter = setInterval(y=()=>{
		startSec--;
		target.innerHTML = '';
		target.innerHTML = startSec;
		console.log('COUNTER');
		if(startSec == 0){
			clearInterval(counter);
		}
	}, 1000)
}


let counterGame;
function counterX(num){
	let startS = num;
	let startTs = '00';
	target.innerHTML = startS+' : '+ startTs;
	counterGame = setInterval(x=()=>{
		--startTs;
		if(startTs < 0){
			startTs = 99;
			--startS;
			if(startS < 10){
				startS = '0'+startS;
			}
		};
		if(startTs < 10){
			startTs = '0'+0;
		}
		if(startS == 0 && startTs == 0 ){
			clearInterval(counterGame);
			clearInterval(timer);
			tsec = '00';
			sec = '00';
			min = 0;
			if(isStarted){
				window.removeEventListener('keypress', handler);
				isStarted = false;	
			};
				app.sendMsg('Game over!');
		}
		target.innerHTML = '00'+':'+startS+':'+startTs;
	},10);
	return
}
