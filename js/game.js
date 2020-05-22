window.onload = function() {
  // ------------------------------获取DOM元素-------------------------------------------
  var game_page_play = document.querySelector('.game-page-play');
  var game_rules = document.querySelector('.game-rules');
  var rule_text = document.querySelector('.rule-text');
  var rule_header = document.querySelector('.rule-header');
  var rule_content = document.querySelector('.rule-content');
  var game_begin = document.querySelector('.game-begin');
  var audio_ele = document.querySelector('.music-audio');
  var audio_control = document.querySelector('.bg-music');
  var audio_stop = audio_control.querySelector('.music-stop');
  var audio_play = audio_control.querySelector('.music-play');
  var game_field = document.querySelector('.game-field');
  var time_count = document.querySelector('.tips-timer-count');
  var monster_number = document.querySelector('.tips-monster-number');
  // ------------------------------页面初始化工作-------------------------------------------
  // ------------------------------音频元素初始化-------------------------------------------
  audio_ele.isPlaying = true;
  audio_ele.loop = true;
  audio_control.classList.add('bg-music-rotate');
  var monster_killed_sum = 0;
  var time_count_num = 10;
  // ------------------------------获取屏幕尺寸-------------------------------------------
  var screen_width = window.screen.width;
  var screen_height = window.screen.height;
  // ------------------------------- 预定义一些变量 --------------------------------------
  var monster_noVanish_text = '纳尼!你竟然一个怪兽都消灭不了，太逊了!再给你一次机会~';
  var monster_vanish_text = '恭喜你，消灭了怪兽，保护了宇宙和平!';
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
        this['handler'] && this['handler'].call(this, e);
      }      
    }
    function Tap(el, fn) {
      el['handler'] = fn; // 将参数绑定在el上来进行参数传递;
      el.addEventListener('touchstart', tap_start);
      el.addEventListener('touchend', tap_end);
    }
    function removeEventFromTap(el, fn) {
      if(el['handler']) {
        delete el['handler'];
      }
      el.removeEventListener('touchstart', tap_start);
      el.removeEventListener('touchend', tap_end);
    }
  // ------------------------------游戏事件处理-------------------------------------------
  // ------------------------------开始游戏------------------------------
  // 游戏开始
  function gameStart() {
    game_rules.classList.add('game-rules-hide');
    setTimeout(function () {
      game_rules.style.zIndex = -1;
    }, 500);
    var monster_real = monsterStart();
    // 处理没有点中怪兽，屏幕抖动效果
    Tap(game_field, screenShake);
    var timer = setInterval(function() {
      time_count_num -= 1;
      time_count.innerHTML = time_count_num + ' 秒';
      if(time_count_num >= 0 && monster_real.isAlive === false) {
        time_count_num = 10;
        time_count.innerHTML = time_count_num + ' 秒';
        gameOver(monster_vanish_text, timer);
      }
      if(time_count_num < 0) {
        time_count_num = 10;
        time_count.innerHTML = time_count_num + ' 秒';
        gameOver(monster_noVanish_text, timer);
      }
    }, 1000); 
  }
  // 游戏结束
  function gameOver(text, timer) {
    clearInterval(timer);
    updateBoard(text);
    removeEventFromTap(game_field, screenShake);
  }
    // 更新游戏规则板的信息 
  function updateBoard(text) {
    game_rules.style.zIndex = 1;
    game_rules.classList.remove('game-rules-hide');
    if(rule_text.firstElementChild === rule_header) {
      rule_text.removeChild(rule_header);
    }
    rule_content.style.margin = '5vh 0';
    rule_content.textContent = text;
    game_begin.textContent = '再来一次';
  }
  // 屏幕抖动效果函数
  function screenShake() {
    game_page_play.classList.add('game-shake');
    setTimeout(function() {
      game_page_play.classList.remove('game-shake')
    }, 500);
  }
  // 游戏开始
  Tap(game_begin, gameStart);
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
  // ------------------------------ 游戏逻辑 -------------------------------------------
  // 怪兽
  //   创建：使用在屏幕外创建怪兽，然后开始快速运动到屏幕内
  //   运动轨迹：沿着屏幕四条边依次运动，在运动过程中，绕着运动路径做圆周运动；（实际上整个就是在做螺旋运动）
  //   消灭：当手指触点的坐标位于怪兽所占空间时，怪兽被消灭。（怪兽所占空间可以用getBoundingClientRect()方法计算得到）;
  
  // 怪兽类型的数组
  var monster_types = ['Halloween-', 'mankey', 'lvmo', 'guaishou', 'xiaoguaishou'];
  var vanish_type = 'baozha';
  // ------------------------------ 工具函数 -------------------------------------------
  // 生成一个位于min~max之间的随机正整数;其中，min最小为0, max最大为10000;
  function getRandomNum(min, max) {
    if(max <= min) return;
    if(min < 0 || max <= 0) return;
    var num = Math.floor((max - min) * Math.random() + min);
    return num;
  }
  // 生成创建坐标的函数, 坐标在屏幕外，但离屏幕最远不超过50px;
  function getLocation() {
    var x = getRandomNum(0, 50);
    var y = getRandomNum(0, 50);
    return {
      x: -(x + 60),
      y: y
    }
  }
  function linearMove(time) {
    return ((screen_width - 100) * 2 + (screen_height - 100) * 2) * time / 10000; 
  }
  // ------------------------------ 怪兽构建与方法 -------------------------------------------
  // 怪兽构造函数;
  function monster(options) {
    this.type = options.type; // 怪兽类型，用于指定怪兽名称，在<use>中指定属性;
    this.create_location = options.location; // 指定怪兽创建的坐标
    this.isAlive = true; // 指定怪兽的生命状态;
    this.isEscaped = false; // 指定怪兽是否逃离;
    this.node = null; // 保存monster对应的DOM节点;
  }
  // 初始化monster实例，构建DOM节点
  monster.prototype.init = function() {
    var monster_node = `
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-${this.type}"></use>
      </svg>`;
    var div_node = document.createElement('div');
    div_node.className = 'game-field-monster';
    div_node.innerHTML = monster_node;
    div_node.style.left = this.create_location.x + 'px';
    div_node.style.top = this.create_location.y + 'px';
    div_node.style.transition = 'opacity 0.5s ease-in';
    this.node = div_node;
    game_field.appendChild(this.node);
  }
  // 启动monster的运动
  monster.prototype.run = function() {
    var Radius = getRandomNum(150, 200);
    var angle = getRandomNum(90, 270);
    var rotateDir = angle % 2 === 1? true: false;
    var pos = this.node.getBoundingClientRect(); 
    this.start_time = new Date().getTime();
    this.duration = 10000; // 10秒 
    var cir_x = pos.left;
    var cir_y = pos.top;
    var _this = this;
    var direction = 'to right';
    var last_time = this.start_time;
    this.timer = setInterval(function() {
      var current_time = new Date().getTime();
      var delta_time = current_time - last_time;
      last_time = current_time;
      var delta = linearMove(delta_time);
      if(direction === 'to right') {
        direction = 'to right';
        cir_x = cir_x + delta;
        if(cir_x >= screen_width - 50) {
          direction = 'to down';
          Radius = getRandomNum(150, 200);
        }
      } else if(direction === 'to down') {
        cir_y = cir_y + delta;
        if(cir_y >= screen_height - 50) {
          direction = 'to left';
          Radius = getRandomNum(150, 200);
        }
      } else if(direction === 'to left') {
        cir_x = cir_x - delta;
        if(cir_x <= 50) {
          direction = 'to up';
          Radius = getRandomNum(150, 200);
        }
      } else if(direction === 'to up') {
        cir_y = cir_y - delta;
        if(cir_y <= 50) {
          clearInterval(_this.timer);
        }
      }
      if(rotateDir === true) {
        angle = angle + 4;
      } else {
        angle = angle - 4;
      }
      var x_pos = cir_x + Radius * Math.cos(angle * Math.PI / 180);
      var y_pos = cir_y + Radius * Math.sin(angle * Math.PI / 180);
      _this.update(x_pos, y_pos);
      if(current_time - _this.start_time >= _this.duration) {
        clearInterval(_this.timer);
        if(_this.isAlive) {
          _this.escape();
        }
      }
    }, 20);
  },
  // 更新位置
  monster.prototype.update = function(x_pos, y_pos) {
    this.node.style.left = x_pos + 'px';
    this.node.style.top = y_pos + 'px';
    return {
      x_pos: x_pos,
      y_pos: y_pos
    }
  }
  // monster被消灭
  monster.prototype.vanish = function() {
    // 停止运动
    clearInterval(this.timer);
    this.isAlive = false; // 更新怪兽生命状态;
    // 将怪兽更换为爆炸图标
    this.node.innerHTML = `
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-${vanish_type}"></use>
    </svg>`;
    this.node.style.opacity = '0';
    var _this = this;
    setTimeout(function() {
      game_field.removeChild(_this.node);
      _this.node = null;
      _this = null;
    }, 300);
  }
  // 怪兽逃离，没有被按准;
  monster.prototype.escape = function() {
    clearInterval(this.timer);
    this.isEscaped = true;
    this.node.style.opacity = '0';
    var _this = this;
    removeEventFromTap(this.node, )
    setTimeout(function() {
      game_field.removeChild(_this.node);
      _this.node = null;
      _this = null; 
    }, 300);
  }
  // ------------------------------ 怪兽创建，运动 -------------------------------------------
  function monsterStart() {
    var mon = new monster({
      type: monster_types[getRandomNum(0, 4)],
      location: getLocation()
    });
    mon.init();
    mon.run();
    Tap(mon.node, function(e) {
      if(mon.isEscaped) { return; }
      mon.vanish();
      monster_killed_sum += 1;
      monster_number.innerHTML = '' + monster_killed_sum;
      e.stopPropagation();
    })
    return mon;
  }
}