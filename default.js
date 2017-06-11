(function() {
  'use strict';

  const DRAW_RATE = 1;
  const BLOCK_SIZE_PX = 5;
  const COLUMNS = 100;

  let evolve_rate_per_draw = 1;

  function $() {
      return document.querySelector.apply(document, arguments);
  }

  let canvas = $('canvas');
  canvas.width = COLUMNS * BLOCK_SIZE_PX;
  canvas.height = COLUMNS * BLOCK_SIZE_PX;
  let ctx = canvas.getContext('2d');
  let map = new Array(COLUMNS).fill(0).map(row => new Array(COLUMNS).fill(0));


  function draw() {
    for (let i = 0; i < COLUMNS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        if (map[i][j] === 0) {
          ctx.fillStyle = 'white';
        } else {
          ctx.fillStyle = 'black';
        }
        ctx.fillRect(i * BLOCK_SIZE_PX, j * BLOCK_SIZE_PX, BLOCK_SIZE_PX, BLOCK_SIZE_PX);
      }
    }
  }

  function neighbours(x, y) {
    let count = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i < 0 || i >= COLUMNS) continue;
        if (j < 0 || j >= COLUMNS) continue;
        if (i === j) continue;
        count += map[i][j];
      }
    }
    return count;
  }

  function evolve() {
    for (let i = 0; i < COLUMNS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        let k = neighbours(i, j);
        if (map[i][j] === 0) {
          // was dead
          if (k === 3) {
            map[i][j] = 1;
          }
        } else {
          // was alive
          if (k < 2 || k > 3) {
            map[i][j] = 0;
          }
        }
      }
    }
  }

  [0, 1, 10, 100].forEach(function(times) {
    $(`#x${times}`).addEventListener('click', function() {
      evolve_rate_per_draw = times;
    });
  })

  $('#save').addEventListener('click', function() {
    localStorage.setItem('life_save', JSON.stringify(map));
    console.log('data saved');
  });
  $('#load').addEventListener('click', function() {
    let data = JSON.parse(localStorage.getItem('life_save'));
    if (Array.isArray(data) && data.length === COLUMNS && Array.isArray(data[0]) && data[0].length === COLUMNS) {
      map = data;
      console.log('data loaded');
    } else {
      console.error('data corrupted, skip loading');
    }
  })

  canvas.addEventListener('click', function(event) {
    let x = event.offsetX, y = event.offsetY;
    map[Math.floor(x / BLOCK_SIZE_PX)][Math.floor(y / BLOCK_SIZE_PX)] ^= 1;
    draw();
  }, false);

  setInterval(function() {
    for (let i = 0; i < evolve_rate_per_draw; i++) {
      evolve();
    }
    draw();
  }, 1000 / DRAW_RATE);
})();
