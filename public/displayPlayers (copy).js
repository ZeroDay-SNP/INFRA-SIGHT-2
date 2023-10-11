let loadPercent = 0;
let totalPlayers = 0;
let loadedPlayers = 0;


window.addEventListener("load", event => {		//run when all the files finish loading
	console.log("page is fully loaded");

	getPlayers("/tags.txt");

});

document.body.addEventListener("click", function(e) {
	var elm = e.target;
	//if (elm === document.body) {
	console.log(elm.parentNode.id);
		if(elm.parentNode.id !== "profileContainer" && elm.parentNode.class !== "playerDiv" && elm.parentNode.class !== "playerProfile") {
			closeAllDialogs();
		}		
	//}
});

function closeAllDialogs() {
	allDivs.forEach(d => {
		d.getElementsByTagName("dialog")[0].open = false;
	});
}

var allPlayers = [];
var allDivs = [];

function getPlayers(filename){
	fetch(filename)
	.then(response => {
		return response.text();
	})
	.then(data => {
		let tags = data.split("\n");
		tags.forEach(getStats);
		//console.log(allPlayers);
		//console.log(allDivs);
	}).then(tags => {
		//calculate average
	});
}



function getStats(tag) {
	//var tag = "ThatGuy-15264";
	console.log(tag);
	totalPlayers ++;
	console.log(totalPlayers);
	// Send data to the backend
	fetch(`/getStats?tag=${tag}`)
		.then(response => {
			//console.log(response);
			loadedPlayers ++;
			loadPercent = Math.round((loadedPlayers/totalPlayers)*100);
			console.log(loadPercent);
			if(loadPercent < 100) {
				document.getElementById("playersHeading").innerHTML = "PLAYERS (" + loadPercent + "%)";
			} else {
				document.getElementById("playersHeading").innerHTML = "PLAYERS";
			}
			document.getElementById("orangeLine").style.width = "" + loadPercent + "%";
			document.getElementById("orangeLine").style.maxWidth = "100%";
			document.getElementById("orangeLine").style.boxSizing = "border-box%";
			document.getElementById("orangeLine").style.backgroundColor = "#ed6516";
			document.getElementById("orangeLine").style.height = "5px";
			//document.getElementById("orangeLine").style.border = "thick solid #ed6516";
			
			return response.json();
		})
		.then(data => {
			allPlayers.push(data);
			addElement(data, tag);
		})
		.catch(error => {
			console.error('ERROR ALERT: ', error);
		});
}	



function addElement(data, tag) {
	console.log("CREATING ELEMENTS FOR: " + tag);

	//main div
	let playerDiv = document.createElement("div");
	allDivs.push(playerDiv);

	//rank
	/*const rank = document.createElement("h6");
	const rankNode = document.createTextNode(parseRank(data.props.pageProps.player.skillDivisionIdCombined).toUpperCase());
	rank.appendChild(rankNode);
	playerDiv.appendChild(rank);*/
	
	//player img
	const icon = document.createElement("img");
	icon.src = data.props.pageProps.player.portrait;
	playerDiv.appendChild(icon);
	playerDiv.class = "playerDiv";

	//player name
	const name = document.createElement("h5");
	const nameNode = document.createTextNode(data.props.pageProps.player.name.toUpperCase());
	name.appendChild(nameNode);
	playerDiv.appendChild(name);

	//player title
	const title = document.createElement("h6");
	const titleNode = document.createTextNode(data.props.pageProps.player.title.toUpperCase());
	title.appendChild(titleNode);
	playerDiv.appendChild(title);

	//dialog
	let dialog = createDialog(data, playerDiv);
	playerDiv.appendChild(dialog);

	//add button
	playerDiv.addEventListener("click", () => {
		for(let i = 0; i < allDivs.length; i++) {
			if(allDivs[i] === playerDiv) {
				console.log(allPlayers[i]);
				closeAllDialogs();
				displayDialog(dialog);
				break;
			}
	}
		
		//let tag = document.getElementById("tag").value;
		//getStats(tag);
	});
	
	//append playerDiv to empty div in html
	const element = document.getElementById("profileContainer");
	element.appendChild(playerDiv);	
}

function displayDialog(dialog) {
	dialog.open = true;
}

function createDialog(data, playerDiv){
	let dialog = document.createElement("dialog");
	dialog.class = "playerProfile";

	dialog.appendChild(addElementNode("h5", data.props.pageProps.player.name.toUpperCase()));

	try {
		let dialogNodes = [];
		
		//RANKS vvv
		dialogNodes.push(addElementNode("p", "TANK: " + parseRank(data.props.pageProps.player.skillDivisionIdTank).toUpperCase()));
		dialogNodes.push(addElementNode("p", "DAMAGE: " + parseRank(data.props.pageProps.player.skillDivisionIdDamage).toUpperCase()));
		dialogNodes.push(addElementNode("p", "SUPPORT: " + parseRank(data.props.pageProps.player.skillDivisionIdSupport).toUpperCase()));
		//WIN PERCENTAGE vvv
		dialogNodes.push(addElementNode("p", "WIN % TANK: " + Math.round(data.props.pageProps.roleStatsList[1].kpiValues[1].value/data.props.pageProps.roleStatsList[1].kpiValues[0].value*100)+"%"));
		dialogNodes.push(addElementNode("p", "TANK SCORE: " + getTankScore(data)));
		dialogNodes.push(addElementNode("p", "WIN % DAMAGE: " + Math.round(data.props.pageProps.roleStatsList[0].kpiValues[1].value/data.props.pageProps.roleStatsList[0].kpiValues[0].value*100)+"%"));
		dialogNodes.push(addElementNode("p", "DAMAGE SCORE: " + getDamageScore(data)));
		dialogNodes.push(addElementNode("p", "WIN % SUPPORT: " + Math.round(data.props.pageProps.roleStatsList[2].kpiValues[1].value/data.props.pageProps.roleStatsList[2].kpiValues[0].value*100)+"%"));
		dialogNodes.push(addElementNode("p", "SUPPORT SCORE: " + getSupportScore(data)));
		//console.log(data.props.pageProps.roleStatsList[0].kpiValues[1]);
	dialogNodes.forEach(node => dialog.appendChild(node));
		//increment active players
	}
	catch(err) {
		console.log("error pushing stats");
		dialog.appendChild(addElementNode("p", "THIS PROFILE IS PRIVATE"));
		playerDiv.classList.add("privateProfile");
	}

	
	return dialog;
}

function addElementNode(type, data){
	let x = document.createElement(type);
	let xNode = document.createTextNode(data);
	x.appendChild(xNode);
	return x;
}

function parseRank(rank){
	let division = (rank-(rank%10))/10;
	rank = rank%10-5;
	rank = map(rank, 4, 0, 1, 5);
	
	switch (division){
		case 1:
			division = "bronze ";
			break;
		case 2:
			division = "silver ";
			break;
		case 3:
			division = "gold ";
			break;
		case 4:
			division = "platinum ";
			break;
		case 5:
			division = "diamond ";
			break;
		case 6:
			division = "master ";
			break;
		case 7:
			division = "grandmaster ";
			break;
		default:
			return "unranked";
	}
	return division + rank;
}

function map(s, low1, high1, low2, high2){
  return (s-low1)*(high2-low2)/(high1-low1) + low2;
}

function findById(data, id){//data should be any role .kpiValues
	let value = 0;
	for(let i = 0; i < data.length; i++){
		if(data[i].id == id){
			value = data[i].value;
			//console.log(value);
			return value;
		}
	}
	return "value not found";
}

function getSupportScore(data){
	try{
		//console.log(data.props.pageProps.roleStatsList[2].kpiValues);
		let heal = 0.9*findById(data.props.pageProps.roleStatsList[2].kpiValues, 25);
		let elim = 0.1*1000*findById(data.props.pageProps.roleStatsList[2].kpiValues, 17);
		let death = findById(data.props.pageProps.roleStatsList[2].kpiValues, 14);
		console.log("heal: "+heal+" elim: "+elim+" death: "+death);
		let score = (heal + elim) / death;
		//console.log(score);

		return score;
	} catch(e){
		console.log("error with support: " + e);
		return 0;
	}
}

function getTankScore(data){
	try{
		//console.log(data.props.pageProps.roleStatsList[2].kpiValues);
		let dmg = 0.3 * findById(data.props.pageProps.roleStatsList[1].kpiValues, 27);
		let fblow = 0.2 * 1100 * findById(data.props.pageProps.roleStatsList[1].kpiValues, 21);
		let skills = 0.2 * 700 * findById(data.props.pageProps.roleStatsList[1].kpiValues, 40);
		let elim = 0.3 * 500 * findById(data.props.pageProps.roleStatsList[1].kpiValues, 17);
		let death = findById(data.props.pageProps.roleStatsList[1].kpiValues, 14);
		//console.log("heal: "+heal+"elim: "+elim+"death: "+death);
		let score = (dmg + fblow + skills + elim) / death;
		//console.log(score);

		return score;
	} catch(e){
		console.log("error with support: " + e);
		return 0;
	}//unless we change weighting or find damage mit
}

function getDamageScore(data){
	try{
		//console.log(data.props.pageProps.roleStatsList[2].kpiValues);
		let dmg = 0.3 * findById(data.props.pageProps.roleStatsList[0].kpiValues, 27);
		let fblow = 0.2 * 1100 * findById(data.props.pageProps.roleStatsList[0].kpiValues, 21);
		let skills = 0.2 * 700 * findById(data.props.pageProps.roleStatsList[0].kpiValues, 40);
		let elim = 0.3 * 500 * findById(data.props.pageProps.roleStatsList[0].kpiValues, 17);
		let death = findById(data.props.pageProps.roleStatsList[0].kpiValues, 14);
		//console.log("heal: "+heal+"elim: "+elim+"death: "+death);
		let score = (dmg + fblow + skills + elim) / death;
		//console.log(score);

		return score;
	} catch(e){
		console.log("error with support: " + e);
		return 0;
	}
}