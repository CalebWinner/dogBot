console.log('the bot is starting');

var Twit = require('twit');
var keys = require('./keys');

var day = 23
var prev_tweets = [];
var picture_urls = [];
var tweetInterval = 1000 * 10;
var T = new Twit(keys);  // twit package object
var dogParams = {
  q: 'dog puppy puppies',
  count: 10,
  result_type: "popular",
  until: "2017-02-" + day
};
var userParams = {
  screen_name: 'D3Doge',
  count: 5
};

function getDogImage() {
  //    search for tweets, params object , callback function
  T.get('statuses/user_timeline',userParams,gotUserData); //request my account's tweets
} // of function

function gotUserData(err, data, response) {
  console.log("got USER data");
  for (var i = 0; i < data.length; i++) {
    //console.log(data[i].entities.media[0].display_url);
    prev_tweets = data[i].entities.media[0].display_url;
  }
  console.log(prev_tweets);
  T.get('search/tweets',dogParams,gotDogData);  //request JSON Data

}

function gotDogData(err, data, response) {          //dog data callback
  console.log("received data from twitter");
  var tweets = data.statuses;
  var validFound = false;
  var urls = [];
  var index = 0;
  var push1 = false;
  var current_url;
////////  END gotData VARS   ///////////////////
  for (var twt of tweets) {
    if (twt.entities) {
      if (twt.entities.media) {
        if (twt.entities.media[0].display_url && twt.entities.media[0].type == 'photo') {

          // if here, tweet has a media url and is a photo
          current_url = twt.entities.media[0].display_url;
          if (current_url == '') {
            continue;
          }
          if (!push1) {
            urls.push(current_url);
          //  console.log("1--logging urls after a push:" + urls + '\n');
            push1 = true;
            validFound = true;      // found 1 or more urls
          }
          else {
            for (var url of urls) {
              if (url == current_url) {
                continue;
              }

            }
            urls.push(current_url);
            //console.log("2--logging urls after a push:" + urls + '\n');
            current_url = '';
          }
        }
      }
    } // of if
  }// of for
  if (validFound) {
    console.log("about to pass this list: " + urls);
    for (var pot of urls) {                 // for each potential picture_url
      var dupe = false;
      for (var old of prev_tweets) {        // for each old picture_url
        if (pot == old) {
          var dupe = true;
          break;
        }
      }                                     // of inner for
      if (!dupe) {
        console.log(pot);
        makeTweet(pot);
      }
    }                                       //of outter for







/*
    while(checking) {
      console.log("cross-reffing with last tweet:  previous, potential");
      console.log(prev_tweets[i]);
      console.log(urls[index]);
      for (var i = 0; i < prev_tweets.length; i++ ) {
        if (urls[index] == prev_tweets[i]){
          priorTweet = true;
        }
      }

      else {
        console.log("found a dupelicate: " + urls[index]);
        index++;
      }
    }
    makeTweet(urls,index);
    */
  }
} // of api callback


// function posts a tweet with string being the plain text

function makeTweet(mytweet) {

    console.log('Atttempting Tweet...');
    // .post takes an object as input
    var tweet = {
        status: mytweet

    };
  //  if (tweet.status) {
      console.log("posting......");
      console.log("status to be posted: " + tweet.status);
      T.post('statuses/update', tweet, tweeted);
  //  }

    function tweeted(err, data, response) {
        if (err) {
          console.log('something went wrong');
          console.log(data);
          urls = [];
        }
        else {
          console.log('Tweet successful');
          //console.log(data);
          prev_tweet = data.text;
        }
    }
}

///////////////////////// end functions /////////////////////////////////

getDogImage();
setInterval(getDogImage, tweetInterval); // tweets every 20 seconds
