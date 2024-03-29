// Generated by CoffeeScript 1.3.3
var FeedParser, channel, client, feed, forumFeed, forumFeedItems, fs, http, irc, options, server;

irc = require('irc');

server = 'chat.freenode.net';

channel = '#pimcore';

client = new irc.Client(server, 'pimcore', {
  channels: [channel]
});

http = require('http');

FeedParser = require('feedparser');

fs = require('fs');

feed = 'http://www.pimcore.org/board/feed.php';

options = {
  hostname: 'www.pimcore.org',
  path: '/board/feed.php',
  method: 'GET'
};

forumFeedItems = {};

forumFeed = function() {
  console.log("poll pimcore rss feed");
  return http.get(feed, function(res) {
    res.pipe(new FeedParser()).on('error', (function(error) {
      console.log("----------------------error---------------------");
      return console.error(error);
    })).on('meta', (function(meta) {})).on('readable', function() {
      var i, item, stream, _results;
      stream = this;
      item = null;
      i = 0;
      _results = [];
      while (item = stream.read()) {
        if (forumFeedItems[item.guid]) {
          continue;
        }
        forumFeedItems[item.guid] = true;
        if (i !== 0) {
          continue;
        }
        client.say(channel, '[FORUM] - - - - - - - - - - - - - - - - - - - - - - - - - - - ' + "\n" + '| ' + item.author + ': ' + item.title + "\n" + '| ' + item.link + "\n" + '+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ' + "\n");
        _results.push(i++);
      }
      return _results;
    });
    return true;
  });
};

client.addListener('join', function(channel, topic, user, message) {
  if (user.nick !== "pimcore") {
    return;
  }
  if (channel !== "#pimcore") {
    return;
  }
  console.log("selfjoin");
  return setInterval(forumFeed, 60000);
});

client.addListener('message', function(from, to, message) {
  console.log(from + ' => ' + to + ': ' + message);
  if (/pimcore/.test(message)) {
    return client.say('#pimcore', 'mhmmmmm, jemand ne idee was nen bot hier tun könnte :) ?');
  }
});
