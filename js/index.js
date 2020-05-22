window.onload = function() {
  // ------------------------------获取DOM元素-------------------------------------------
  var game_bg = document.querySelector('.game-bg');
  var indicator_arrow = document.querySelector('.slide-up-arrow');
  var audio_ele = document.querySelector('.music-audio');
  var audio_control = document.querySelector('.bg-music');
  var audio_stop = audio_control.querySelector('.music-stop');
  var audio_play = audio_control.querySelector('.music-play');
  var game_start = document.querySelector('.game-start');
  var game_start_btn = game_start.querySelector('.game-start-btn');
  // ------------------------------页面初始化工作-------------------------------------------
  // ------------------------------音频元素初始化-------------------------------------------
  audio_ele.isPlaying = true;
  audio_ele.loop = true;
  audio_control.classList.add('bg-music-rotate');
  // ------------------------------添加事件处理程序-------------------------------------------
    // 自定义tap事件
    function tap_start(e) {
      this.start_point = {
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY
      };
    }
    function tap_end(e) {
      this.end_point = {
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY
      };
      if(Math.abs(this.end_point.x - this.end_point.x) < 5) {
        this.fn.call(this, e);
      }      
    }
    function Tap(el, fn) {
      el.fn = fn; // 将参数绑定在el上来进行参数传递;
      el.addEventListener('touchstart', tap_start);
      el.addEventListener('touchend', tap_end);
    }
  // ------------------------------向上滑动箭头处理-------------------------------------------
  function arrow_start(e) {
    game_bg.start_point = {
      x: e.changedTouches[0].screenX,
      y: e.changedTouches[0].screenY
    }
  }
  function arrow_move(e) {
    game_bg.move_point = {
      x: e.changedTouches[0].screenX,
      y: e.changedTouches[0].screenY
    }
    if(game_bg.move_point.y - game_bg.start_point.y < -2) {
      game_bg.isMoving = true;
    } else {
      game_bg.isMoving = false;
    }
  }
  function arrow_end(e) {
    game_bg.end_point = {
      x: e.changedTouches[0].screenX,
      y: e.changedTouches[0].screenY
    }
    if(game_bg.end_point.y - game_bg.start_point.y < -20 
      && game_bg.isMoving) {
      setTimeout(function() {
        game_bg.classList.add('leave-from-screen');
        game_start.classList.add('game-start-show');
        indicator_arrow.style.display = 'none';
      }, 100);
      setTimeout(function() {
        game_bg.style.display= ' none';
      }, 4000);
    }
  }
  game_bg.addEventListener('touchstart', arrow_start);
  game_bg.addEventListener('touchmove', arrow_move);
  game_bg.addEventListener('touchend', arrow_end);
  setTimeout(function() {
    game_bg.classList.add('game-bg-show');
  }, 10)
  // ------------------------------点击音乐事件处理-------------------------------------------
  
  Tap(audio_control, function(e) {
    console.log('audio')
    if(audio_ele.isPlaying) {
      audio_stop.style.display = 'none';
      audio_play.style.display = 'inline';
      audio_ele.pause();
      audio_control.classList.remove('bg-music-rotate');
    } else {
      audio_stop.style.display = 'inline';
      audio_play.style.display = 'none';
      audio_ele.play();
      audio_control.classList.add('bg-music-rotate');
    }
    audio_ele.isPlaying = !audio_ele.isPlaying;
  })
  // ------------------------------点击开始游戏事件处理-------------------------------------------
  function startGame() {
    this.classList.add('game-start-btn-press');
    setTimeout(function() {
      game_start_btn.classList.remove('game-start-btn-press');
      window.history.pushState({
        page_1: 'index'
      }, '', 'index.html');
      window.location.href = './game.html';
    }, 10);

  }
  Tap(game_start_btn, startGame);
}