// Select the canvas element
const canvas = document.getElementById('myCanvas');
// Set canvas dimensions to match the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create a 2D drawing context
const ctx = canvas.getContext('2d');

time = 0;

function clear() {
ctx.fillStyle = "skyblue";
ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Redraw the canvas content if necessary
});
clear(ctx)

player = {pos: [10,50], vel: [0, 0], size: [5,5]}

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
  ctx.fillRect(player_coords[0]-player_size[0]/2, player_coords[1]-player_size[1]/2, player_size[0], player_size[1])
  ctx.fillStyle = "green";
  console.log(pipes[0][0])

  let upper_l = convert_to_screen([0,10])
  ctx.fillStyle = "green";
  ctx.fillRect(upper_l[0], upper_l[1], canvas.width, canvas.height)
  for (p =0; p< pipes.length; p++) {
    let pipe_middle = convert_to_screen(pipes[p]);
    ctx.fillRect(pipe_middle[0] - player_size[0]*1, pipe_middle[1]+player_size[1]*2, player_size[0]*2, canvas.height - (pipe_middle[1]+player_size[1]*2));
    ctx.fillRect(pipe_middle[0] - player_size[0]*1, 0, player_size[0]*2, pipe_middle[1]-player_size[1]*2)
  }
  ctx.fillText(String(Math.floor(time/10)) +"."+ String(time %10), 15,15)
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
    pipes[p][0] -= 50*dt;
    if (pipes[p][0] < -100.) {
      pipes.splice(p,1);
    }
  }
}

function death() {
  
    alert("you died, time: " + String(Math.floor(time/10)) +"."+ String(time %10))
    timertimertime = Date.now();
    player.pos=[10,50]
    player.vel=[0,0]
    pipes = []
}

timertimertime = Date.now();
function check_collision() {
  if (player.pos[1] < 10 + player.size[1]/2){
    death()
  }
  for (p = 0; p < pipes.length; p++) {
    let pos = pipes[p];
    if (Math.abs(pos[0] - player.pos[0]) < player.size[0]*1.5 && (player.pos[1] > pos[1] + player.size[1]*1.5 || player.pos[1] < pos[1]-player.size[1]*1.5)) {
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
