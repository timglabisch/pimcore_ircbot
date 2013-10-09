irc = require('irc');
server = 'chat.freenode.net'
#server = '192.168.214.144'
channel = '#pimcore'
client = new irc.Client(server, 'pimcore', {
  channels: [channel],
});


http = require('http')
FeedParser = require('feedparser')
fs = require('fs')
feed = 'http://www.pimcore.org/board/feed.php';

options =
  hostname: 'www.pimcore.org',
  path: '/board/feed.php'
  method: 'GET'

forumFeedItems = {};

forumFeed = ->
  console.log "poll pimcore rss feed"
  http.get feed, (res)->
    res.pipe(new FeedParser()).on('error', ((error) ->
      console.log "----------------------error---------------------"
      console.error(error);
    )).on('meta', ((meta) ->
    )).on 'readable', ->
      stream = this
      item = null
      i = 0;
      while item = stream.read()
        continue if forumFeedItems[item.guid]
        forumFeedItems[item.guid] = true
        continue if i != 0
        client.say channel,
                    '[FORUM] - - - - - - - - - - - - - - - - - - - - - - - - - - - ' + "\n" +
                    '| ' + item.author + ': ' + item.title + "\n" +
                    '| ' + item.link + "\n" +
                    '+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ' + "\n";
        i++

    true

client.addListener('join', (channel, topic, user, message) ->

  return if user.nick != "pimcore"
  return if channel != "#pimcore"
  console.log "selfjoin"

  setInterval(forumFeed, 60000);
);

client.addListener('message', (from, to, message) ->
  console.log(from + ' => ' + to + ': ' + message);

  if  /pimcore/.test message
    client.say('#pimcore', 'mhmmmmm, jemand ne idee was nen bot hier tun könnte :) ?')

);





