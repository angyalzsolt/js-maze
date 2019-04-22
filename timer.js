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
				sec='0'+0;
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
	}, 1000)
}
