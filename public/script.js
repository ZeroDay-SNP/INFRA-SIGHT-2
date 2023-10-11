let b_submit = document.getElementById("b_submit");
		b_submit.addEventListener("click", () => {
			let tag = document.getElementById("tag").value;
			getStats(tag);
		});
		
		function getStats(tag) {
			//var tag = "ThatGuy-15264";
			console.log(tag);
			
	    // Send data to the backend
	    fetch(`/getStats?tag=${tag}`)
	    .then(response => {
				//console.log(response);
				return response.json();
			})
	    .then(data => {
				processJson(data);
	    })
	    .catch(error => {
	        console.error('THIS:', error);
	    });
		}	

		function processJson(data){
			// Handle the response from the backend
				console.log(data.props.pageProps);//a json
				document.getElementById("icon").src = data.props.pageProps.player.portrait;
				document.getElementById("name").innerText = data.props.pageProps.player.name;
				document.getElementById("title").innerText = data.props.pageProps.player.title;
				document.getElementById("rankTank").innerText = "Tank: " + 
					parseRank(data.props.pageProps.player.skillDivisionIdTank);
				document.getElementById("rankDamage").innerText = "Damage: " + 
					parseRank(data.props.pageProps.player.skillDivisionIdDamage);
				document.getElementById("rankSupport").innerText = "Support: " + 
					parseRank(data.props.pageProps.player.skillDivisionIdSupport);
				document.getElementById("rankCombined").innerText = "Combined: " + 
					parseRank(data.props.pageProps.player.skillDivisionIdCombined);
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

