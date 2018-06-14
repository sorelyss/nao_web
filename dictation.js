var socket = io.connect('http://localhost:'+port, { 'forceNew': true });
logger.info('SocketIO > listening on port2S ' + port);
socket.on('reset', function(){
  clearSlate();
  setTimeout(function(){
    action();
  },1000)
})

function clearSlate() {
  if (working) {
    speech.stop();
  }  
  document.getElementById("labnol").innerHTML = "";
  document.getElementById("notfinal").innerHTML = "";
  final_transcript = "";
  reset();
}

function reset() {
  working = false;
  document.getElementById("status").style.display = "none";
  document.getElementById("btn").innerHTML = "Empezar";
}

function action() {
  data = { message: document.getElementById("labnol").innerHTML + document.getElementById("notfinal").innerHTML } 
  if (working) {
    speech.stop();
    data["flag"] = true;
    console.log('Escuhe: ',format(data["message"]));
    socket.emit('audio',data)
    reset();
  } else {
    working = true;
    document.getElementById("status").style.display = "block";
    document.getElementById("warning").style.display = "none";
    document.getElementById("btn").innerHTML = "Detener";
    document.getElementById("labnol").innerHTML = "";
    document.getElementById("notfinal").innerHTML = "";
    final_transcript = "";
    speech.start();
  }
}

function toggleVisibility(selectedTab) {
  var content = document.getElementsByClassName('info');
  for (var i = 0; i < content.length; i++) {
    if (content[i].id == selectedTab) {
      content[i].style.display = 'block';
    } else {
      content[i].style.display = 'none';
    }
  }
}

function updateLang(sel) {
  var value = sel.options[sel.selectedIndex].value;
  speech.lang = value;
  localStorage['language'] = value;
}

function format(s) {
  return s.replace(/\n/g, '<br>');
}

function capitalize(s) {
  return s.replace(/\S/, function(m) {
    return m.toUpperCase();
  });
}

function initialize() {
  speech = new webkitSpeechRecognition();
  speech.continuous = true;
  speech.maxAlternatives = 5;
  speech.interimResults = true;
  speech.lang = localStorage['language'];
  speech.onend = reset;
}

var clear, working, speech, final_transcript, Nao = "";

if (!('webkitSpeechRecognition' in window)) {

  document.getElementById("labnol").innerHTML =
    "Dictation.io requires <a href='https://www.google.com/chrome/browser/' target='_blank'>Google Chrome</a>. You can however still use this app as a notepad. Just click anywhere, start writing and it will auto-save the text.<br><br>For support, tweet <a href='http://twitter.com/labnol' target='_blank'>@labnol</a> or email the <a href='https://ctrlq.org/' target='_blank'>developer</a> at amit@labnol.org";
  document.getElementById("messages").style.display = "none";
  document.getElementById("platformslang").style.display = "none";

} else {

  localStorage['language'] = localStorage['language'] || "en-US";
  localStorage['transcript'] = localStorage['transcript'] || "";
  document.getElementById("labnol").innerHTML = localStorage['transcript'];
  final_transcript = localStorage['transcript'];

  setInterval(function() {
    var text = document.getElementById("labnol").innerHTML;
    if (text !== localStorage['transcript']) {
      localStorage['transcript'] = text;
    }
  }, 5000);

  document.getElementById("lang").value = localStorage['language'];

  initialize();
  reset();

  speech.onerror = function(e) {
    var msg = e.error + " error";
    alert("Entre cuando hay error");
    if (e.error === 'no-speech') {
      alert("Entre cuando no speech");
      msg =
        "No speech was detected. Please turn on the microphone and try again.";
    } else if (e.error === 'audio-capture') {
      alert("Entre cuando audio capture");
      msg =
        "Please ensure that your microphone is connected to the computer and turned on.";
    } else if (e.error === 'not-allowed') {
      alert("Entre cuando not allowed");
      msg =
        "Dication.io cannot access your microphone. Please go to chrome://settings/contentExceptions#media-stream and allow Microphone access to this website.";
    }
    document.getElementById("warning").innerHTML = "<p>" + msg + "</p>";
    setTimeout(function() {
      document.getElementById("warning").innerHTML = "";
    }, 5000);
  };

  speech.onresult = function(e) {
    var interim_transcript = '';
    if (typeof(e.results) == 'undefined') {
      reset();
      return;
    }
    for (var i = e.resultIndex; i < e.results.length; ++i) {
      var val = e.results[i][0].transcript;
      if (e.results[i].isFinal) {
        final_transcript += " " + val;
      } else {
        interim_transcript += " " + val;
      }
      Nao; 
    }
    document.getElementById("labnol").innerHTML = format(capitalize(final_transcript));
    document.getElementById("notfinal").innerHTML = format(interim_transcript);
    //console.log('Escuhe: ',format(interim_transcript));
     /*$.ajax({
         type: "POST",
         data: data ,
         url: "http://127.0.0.1:5000/test",
         success: function(data){
           var d = JSON.parse(data);
           console.log(d)
           console.log(d['message'])
           if(d['delete'] == true){
            clearSlate()
            action()
           }
         },
         error: function(xhr, status, error) {
           console.log("Ocurrio un error en el servidor");
         }
       });*/
    
  };
}
