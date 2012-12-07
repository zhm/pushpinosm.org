window.onload = function() {
  var url = "http://s3.amazonaws.com/pushpinapp/stats.json"

  $.get(url, function(json) {
    if (json) {
      $('#total-edits').html('Total Edits: ' + json.total_edits);

      recent_html = '';
      _.each(json.recent_edits, function(edit) {
        recent_html += '<div class="item"><a href="http://www.openstreetmap.org/browse/changeset/' + edit.id + '" class="recent-edit">' + edit.name + ' (' + edit.tags.comment + ')</a> ' + moment(edit.date).fromNow() + '</div>';
      });

      $('#recent-edits').html(recent_html);

      top_users = '';
      _.each(json.top_users, function(user, index) {
        top_users += '<div class="item">' + (index + 1) + '.) <a href="http://www.openstreetmap.org/user/' + user.name + '" class="top-user">' + user.name + '</a> (' + user.edits + ' edits)</div>';
      });

      $('#top-users').html(top_users);

      // $('.page-title').html('Pushpin OSM - ' + json.elements.length + ' points');
    }
  });
}
