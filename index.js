const { WebClient } = require('@slack/web-api');
const { RTMClient } = require('@slack/rtm-api');
Alex = require('alex');
 
// Read a token from the environment variables
const token = process.env.ALEX_TOKEN;
 
// Initialize
const web = new WebClient(token);
const rtm = new RTMClient(token);

rtm.on('message', (event) => {
  var channel, user, text;
  channel = event.channel;
  user = event.user;
  text = event.text;
  var response = ""
  var a_messages = Alex(text).messages;

  if(a_messages.length) {
    if (!channel.is_im) {
	response += "You said: \"" + text + '\n';
    }

  for (var i = 0; i < a_messages.length; i++) {
  response += Alex(text).messages[i].reason + '\n';
  };
  chat.postEphemeral(token,[],channel,response,user)
  return console.log("@" + slack.self.name + " responded with \"" + response + "\"");
	
});

// Heroku requires the process to bind to this port within 60 seconds or it is killed
http.createServer(function(req, res) {
  res.end('ALEX_SLACK_BOT');
}).listen(process.env.PORT || 5000)
