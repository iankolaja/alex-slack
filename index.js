const { WebClient } = require('@slack/web-api');
const { RTMClient } = require('@slack/rtm-api');
Alex = require('alex');
var http = require('http');
var bot_name = "alexbot";
 
// Read a token from the environment variables
const token = process.env.ALEX_TOKEN;

var alex_config = {"allow": ["her-him",
			    "he-she",
			    "herself-himself",
			    "boy-girl",
			    "gals-men",
			    "gal-guy",
			    "aunt-uncle",
			    "dad-mom"]
}

// Initialize
const web = new WebClient(token);
const rtm = new RTMClient(token);

rtm.on('message', (event) => {
  var channel, user, text, slack_message;
  channel = event.channel;
  user = event.user;
  text = event.text;
  var response = "";


	
  var a_messages = Alex({value:text,config:alex_config}).messages;

  if(a_messages.length) {
    if (!channel.is_im) {
	console.log("User " + user + " said: " + text);
	response += "You said: \"" + text + '\"\n';
    }

  for (var i = 0; i < a_messages.length; i++) {
  response += Alex({value:text,config:alex_config}).messages[i].reason + '\n';
}}
  if (response.length) {
  slack_message = {
	  "token": token,
	  "attachment": [],
	  "channel": channel,
	  "text": response,
	  "user": user,
	  "as_user": false,
	  "username": bot_name
  }  
    web.chat.postEphemeral(slack_message);
    console.log("@"+bot_name+" responded with \"" + response + "\"");
  }	
});

(async () => {
  // Connect to Slack
  console.log("@"+bot_name+" connected to Slack!");
  const { self, team } = await rtm.start();
})();

// Heroku requires the process to bind to this port within 60 seconds or it is killed
http.createServer(function(req, res) {
  res.end('ALEX_SLACK_BOT');
}).listen(process.env.PORT || 5000);
