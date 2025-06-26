var SUPABASE_URL = 'https://mthmrtgksktvriyqlizt.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10aG1ydGdrc2t0dnJpeXFsaXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjY5NDQsImV4cCI6MjA2NjQ0Mjk0NH0.Pyq82ew0NhEnO2KcZeob0bpP9BYeZdEBTGPCoIjCH50';
var TABLE = 'notes';

var id = location.pathname.split('/').pop() || generateId();
var textarea = document.getElementById('note');

function generateId(length) {
  length = typeof length === 'number' ? length : 6;
  var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function fetchNote(id, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', SUPABASE_URL + '/rest/v1/' + TABLE + '?id=eq.' + id);
  xhr.setRequestHeader('apikey', SUPABASE_KEY);
  xhr.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_KEY);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      callback(null, data[0]);
    } else {
      callback(new Error('Failed to fetch note'));
    }
  };
  xhr.onerror = function () {
    callback(new Error('Request error'));
  };
  xhr.send();
}

function saveNote(id, content) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', SUPABASE_URL + '/rest/v1/' + TABLE);
  xhr.setRequestHeader('apikey', SUPABASE_KEY);
  xhr.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_KEY);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Prefer', 'resolution=merge-duplicates');
  xhr.send(JSON.stringify({ id: id, content: content }));
}

if (!location.pathname.endsWith(id)) {
  history.replaceState(null, '', location.pathname + id);
}

fetchNote(id, function (err, note) {
  if (!err && note && note.content) {
    textarea.value = note.content;
  }
});

var timeout;
textarea.addEventListener('input', function () {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    saveNote(id, textarea.value);
  }, 500);
});
