// Select the canvas element
const canvas = document.getElementById('myCanvas');
// Set canvas dimensions to match the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const image = document.getElementById("source");
const background_image = document.getElementById("source_background");
var audio = new Audio('happy_birthday.mp3');
canvas.addEventListener("click", () => {
  if (audio.paused){
  audio.currentTime = 0;
  audio.play();}
})

var dead = false;
var result_time = 0;

// Create a 2D drawing context
const ctx = canvas.getContext('2d');

time = 0;

function clear() {
  ctx.drawImage(background_image, 0,0, canvas.width, canvas.height)
}

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Redraw the canvas content if necessary
});
clear(ctx)

player = {pos: [10,50], vel: [0, 0], size: [17,17]}

window.addEventListener('keydown', (event) => {
  if (event.code === "Space") {
    player.vel[1] = 100;
  }
})

window.addEventListener("touchstart", () => {
  player.vel[1] = 100;
})



function convert_to_screen(coords) {
  return [(coords[0] /100)* canvas.width, (1-coords[1]/100)*canvas.height]
}

function scale_to_min_dim(coords) {
  let min = Math.min(canvas.height, canvas.width);
  return [(coords[0]/100)*min, (coords[1]/100)*min]
}
pipes = [];

function draw() {
  ctx.fillStyle = "red";
  let player_coords = convert_to_screen(player.pos);
  let player_size = scale_to_min_dim(player.size);
  ctx.drawImage(image, player_coords[0]-player_size[0]/2, player_coords[1]-player_size[1]/2, player_size[0], player_size[1])
  ctx.fillStyle = "green";
  console.log(pipes[0][0])

  ctx.fillStyle = "pink";
  for (p =0; p< pipes.length; p++) {
    let pipe_middle = convert_to_screen(pipes[p]);
    ctx.fillRect(pipe_middle[0] - player_size[0]*0.5, pipe_middle[1]+player_size[1]*1.25, player_size[0], canvas.height - (pipe_middle[1]+player_size[1]*1.25));
    ctx.fillRect(pipe_middle[0] - player_size[0]*0.5, 0, player_size[0], pipe_middle[1]-player_size[1]*1.25)
  }
  ctx.font = "30px Arial";

  ctx.fillText(String(Math.floor(time/10)) +"."+ String(time %10), 30,30)
}

dt = 0.02;

gravity = 500;


function spawn_pipe() {
  pipes.push([100,30+Math.random()*60])
  setTimeout(spawn_pipe, (Math.random()*0.25 + 1.5)*1000)
}

function update() {
  player.vel[1] -= gravity * dt;
  player.pos[1] += player.vel[1] * dt;
  for (p = 0; p< pipes.length; p++) {
    pipes[p][0] -= 70*dt;
    if (pipes[p][0] < -100.) {
      pipes.splice(p,1);
    }
  }
}

function death() {
  if (!dead){ 
  canvas.style.display = "none"
  document.getElementById("gameOver").style.display = "flex";
  document.getElementById("timeText").innerHTML = "time: " +  String(Math.floor(time/10)) +"."+ String(time %10)
  dead = true;
  }
}

function play_again() {
  player = {pos: [10,50], vel: [0, 0], size: [17,17]}
  timertimertime=Date.now()
  pipes = []
  dead = false
  canvas.style.display = "block"
  document.getElementById("gameOver").style.display = "none";

}

timertimertime = Date.now();
function check_collision() {
  if (player.pos[1] < - player.size[1]){
    death()
  }
  for (p = 0; p < pipes.length; p++) {
    let pos = pipes[p];
    if (Math.abs(pos[0] - player.pos[0]) < player.size[0]/2 && (player.pos[1] > pos[1] + player.size[1]*0.75 || player.pos[1] < pos[1]-player.size[1]*0.75)) {
      death()
    }
  }
}

setInterval(()=> {
  delta = Date.now()-timertimertime;

  time = Math.floor(delta / 100);
  
}, 100);
setInterval(main, 1000*dt);
spawn_pipe()
function main() {
  check_collision()
  update()

  // update screen
  clear()
  draw()
  
}
