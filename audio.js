var vid = document.getElementById("video"); 
var n_duplas, t_duplas, cont, time_beha_base = 8, interval
var d = new Date();

function playVid() { 
    vid.play(); 
    $('#video')[0].webkitEnterFullScreen();
} 

function stopVid() { 
  vid.currentTime=0;
  vid.pause(); 
}

function start_all() {
  if (document.getElementById("main_button").innerHTML == "Empezar") {
    playVid()
    document.getElementById("main_button").innerHTML = "Detener";
    document.getElementById("dupla_n").disabled = true;
    document.getElementById("dupla_t").disabled = true;
    n_duplas = document.getElementById("dupla_n").value;
    t_duplas = document.getElementById("dupla_t").value;
    socket.emit('start_main', {flag: true, n: n_duplas, t: t_duplas});
    cont = 0
    action()
    console.log('empezó')
    console.log('Escuchaaandooo dupla:', cont)
    setTimeout(function(){ action(); }, time_beha_base*1000);
    interval = setInterval(function(){
      console.log('Escuchaaandooo dupla:', cont+1)
        action();
        setTimeout(function(){ 
          action(); 
      }, time_beha_base*1000); 
      if (cont==n_duplas-2) {
        clearInterval(interval)
        console.log('se detuvooo')
        document.getElementById("main_button").innerHTML = "Empezar";
      }
      cont=cont+1;
    },t_duplas*1000);
  }
  else{
    stopVid()
    document.getElementById("main_button").innerHTML = "Empezar";
    document.getElementById("dupla_n").disabled = false;
    document.getElementById("dupla_t").disabled = false;
    socket.emit('start_main', {flag: false, n: 0, t: 0});
    clearInterval(interval)
    console.log('se detuvooo 2')

  }
}