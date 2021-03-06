var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var readline = require('readline');

/**

Getting the links from Genius
Array.from(document.getElementsByClassName("mini_song_card--small")).forEach(function(item) {
   console.log(item.getAttribute('ng-href'));
});

*/

raw_output_file = './crawler/data/raw_results.txt'
output_file = './crawler/data/results.txt'

// Cleaning existing files
if (fs.existsSync(raw_output_file)) {
  fs.unlink(raw_output_file)
}
if (fs.existsSync(output_file)) {
  fs.unlink(output_file)
}

var rl = readline.createInterface({
  input: fs.createReadStream('./crawler/data/sources_all.txt')
});

rl.on('line', function(url) {
  var url = url.trim();
  setTimeout(function(){
    request(url, function(error, response, html){
      if(error){
        console.log('!!!Error in request for ' + url)
        return
      }

      var $ = cheerio.load(html);
      var content = $('.lyrics').text();
      console.log("HTML received for " + url + "data length:" + content.length);


      fs.appendFile(raw_output_file, content, function(err) {
        if (err) {
          console.log('ERROR outputing raw data:', err);
          return
        }
        content = content.replace(/^\s+|\s+$/gi, '');
        content = content.replace(/.*Genius.*|.*googletag.*/gi, '');
        content = content.replace(/\[.*\]/gi, '');

        fs.appendFile(output_file, content, function(err) {
          if (err) {
            console.log('ERROR outputing cleaned data:', err);
          }
        });
      });
    })
  }, Math.random() * 120000)

});

rl.on('close', function() {
  // res.send('FINISHED');
})