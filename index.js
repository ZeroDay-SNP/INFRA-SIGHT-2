/*Utility functions*/
const DEBUG = true;

function log(msg){
  if (DEBUG){
    console.log(msg);
  }
}
/*END Utility functions*/

const PORT = 8000;
const { writeFile } = require('fs');
const writePath = 'public/stats.json';
const path = require('path');		//provides utilities for working with file and directory paths

//define library references
const EXPRESS = require('express');
const AXIOS = require('axios');
const CHEERIO = require('cheerio');

//initialize library instances
const APP = EXPRESS();



APP.get('/', (req, res)=>{
	res.sendFile('index.html', {root: "public/"});			//send index initially
	//res.sendFile('indexOld.html', {root: "public/"});		//send indexOld initially (for testing)
	var publicPath = path.join(__dirname, 'public');		//store "public" directory
	APP.use(EXPRESS.static(publicPath));								//send "public" directory
});



APP.get('/getStats', (req, res)=>{
	const tag = req.query.tag;
	//console.log(tag);
	
  const url = 'https://www.overbuff.com/players/' + tag;
	//console.log(url);
  AXIOS.get(url).then(response => {
    const html_response = response.data;
    //log (html_response);

    const $ = CHEERIO.load(html_response);
		var stats;
    
    const a = $('#__NEXT_DATA__', html_response).each(function(){
      stats = $(this)[0].children[0].data;
      //log(stats);
      /*writeFile(writePath, stats, (error) => {
				if (error) {
					console.log('An error has occurred ', error);
					return;
				}
				console.log('Data written successfully to disk');
			});*/
		});
		//console.log("sending");
    res.send(stats);

  })
  .catch((err) => {
    console.error('error happened '+err);
  });
});

/*
APP.post('/getStats', (req, res)=>{
	
	console.log(req.tag);
  const url = 'https://www.overbuff.com/players/' + req.tag;
	console.log(url);
  AXIOS.get(url).then(response => {
    const html_response = response.data;
    //log (html_response);

    const $ = CHEERIO.load(html_response);
    
    const a = $('#__NEXT_DATA__', html_response).each(function(){
      const stats = $(this)[0].children[0].data;
      
      log(stats.props);
      writeFile(writePath, stats,(error) => {
				if (error) {
					console.log('An error has occurred ', error);
					return;
				}
				console.log('Data written successfully to disk');
			});
		});
    res.send(stats);

  })
  .catch((err) => {
    console.error('error happened'+err);
  });
});
*/

/*
APP.post('/', (req, res)=>{
	
	var user = req.body.user;
  const url = 'https://www.overbuff.com/players/' + user;
	
  AXIOS.get(url).then(response => {
    const html_response = response.data;
    //log (html_response);

    const $ = CHEERIO.load(html_response);
    
    const a = $('#__NEXT_DATA__', html_response).each(function(){
      const stats = $(this)[0].children[0].data;
      
      log(stats.props);
      writeFile(writePath, stats,(error) => {
  if (error) {
    console.log('An error has occurred ', error);
    return;
  }
  console.log('Data written successfully to disk');
});
      /*JSON.stringify(stats, null, 2), (error) => {
  if (error) {
    console.log('An error has occurred ', error);
    return;
  }
  console.log('Data written successfully to disk');
});
    });
    res.send(stats);

  })
  .catch((err) => {
    console.error('error happened'+err);
  });
});

*/


APP.listen(PORT, ()=>{log('server running on PORT '+PORT)})

