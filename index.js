const { WebClient } = require('@slack/web-api');
const { RTMClient } = require('@slack/rtm-api');
Alex = require('alex');
var http = require('http');
 
// Read a token from the environment variables
const token = process.env.ALEX_TOKEN;
 
// Initialize
const web = new WebClient(token);
const rtm = new RTMClient(token);

rtm.on('message', (event) => {
  var channel, user, text, slack_message;
  channel = event.channel;
  user = event.user;
  text = event.text;
  var response = "";
  var a_messages = Alex(text).messages;

  if(a_messages.length) {
    if (!channel.is_im) {
	response += "You said: \"" + text + '\"\n';
    }

  for (var i = 0; i < a_messages.length; i++) {
  response += Alex(text).messages[i].reason + '\n';
}}
  if (response.length) {
  slack_message = {
	  "token": token,
	  "attachment": [],
	  "channel": channel,
	  "text": response,
	  "user": user,
	  "as_user": false,
	  "username": "alexbot"
  }  
    web.chat.postEphemeral(slack_message);
    console.log("@alexbot responded with \"" + response + "\"");
  }	
});

(async () => {
  // Connect to Slack
  const { self, team } = await rtm.start();
})();

// Heroku requires the process to bind to this port within 60 seconds or it is killed
http.createServer(function(req, res) {
  res.end('ALEX_SLACK_BOT');
}).listen(process.env.PORT || 5000);
