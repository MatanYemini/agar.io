// ===============================
// ========== Drawing ============
// ===============================

player.locX = Math.floor(500 * Math.random() + 100);
player.locY = Math.floor(500 * Math.random() + 100);

function draw() {
  // reset transition to the default
  context.setTransform(1, 0, 0, 1, 0, 0);
  // clear the screen so old stuff is gone from the last frame
  context.clearRect(0, 0, canvas.width, canvas.height);

  // clamp the camera to the player
  const camX = -player.locX + canvas.width / 2;
  const camY = -player.locY + canvas.height / 2;
  // translate allows us to move the canvas around
  context.translate(camX, camY);

  // draw all the players
  players.forEach((p) => {
    context.beginPath();
    context.fillStyle = p.color;
    context.arc(p.locX, p.locY, 10, 0, Math.PI * 2); // X and Y of the position, 10 for radius, where to start the circle in radians, where to end the cercle in radians
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = 'rgb(0,255,0)';
    context.stroke();
  });
  // running on the orbs
  orbs.forEach((orb) => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(draw); // recursivly calls draw - safe 'while'
}

canvas.addEventListener('mousemove', (event) => {
  const mousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
  const angleDeg =
    (Math.atan2(
      mousePosition.y - canvas.height / 2,
      mousePosition.x - canvas.width / 2
    ) *
      180) /
    Math.PI;
  if (angleDeg >= 0 && angleDeg < 90) {
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  player.xVector = xVector;
  player.yVector = yVector;
});
