// Creat a singel maze preview
const mazePreview = (src, diff)=>{
	// Create the elements
	const contEl = document.createElement('div');
	const mazeEl = document.createElement('img');
	const diffEl = document.createElement('p');
	const maskEl = document.createElement('div');

	// Add classes
	contEl.classList.add('maze-block');
	mazeEl.classList.add('maze-img');
	diffEl.classList.add('maze-diff');
	maskEl.classList.add('maze-mask');

	// Load in the given maze
	contEl.setAttribute('id', src);
	mazeEl.src = './mazes/'+src;
	diffEl.textContent = diff;
	maskEl.textContent = diff;

	// Connect the elements
	contEl.appendChild(mazeEl);
	contEl.appendChild(diffEl);
	contEl.appendChild(maskEl);

	return contEl;
};

const mazeList = ['img9.PNG','img10.PNG', 'img11.PNG', 'img18.png', 'img17.png', 'img16.png', 'img15.png'];
for(let i=0;i<mazeList.length;i++){
	document.getElementById('container-mazes').appendChild(mazePreview(mazeList[i], `Maze#${i+1}`));
};

let startIndex = 0;
function showMazes(n){
	let mazes = document.getElementsByClassName('maze-block');
	startIndex  = startIndex + n < mazes.length && startIndex + n >= 0 ? startIndex+=n : 0;
	for(i = 0; i < mazes.length; i++){
		mazes[i].style.display = 'none';
	};
	
	if(startIndex + 2 >= mazes.length){
		startIndex = 0;
	}
		mazes[startIndex].style.display = 'block';
		mazes[startIndex+1].style.display = 'block';
		mazes[startIndex+2].style.display = 'block';
}

showMazes(0);



