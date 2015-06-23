$("#canvas").after($("#canvas").clone().attr("id", "canvas-2")).remove();
(function(self, log) {
  function init() {
    ma = true;
    run();
    setInterval(run, 18E4);
    canvas = img1canvas = document.getElementById("canvas-2");
    ctx = canvas.getContext("2d");
    canvas.onmousedown = function(e) {
      if (options) {
        var z0 = e.clientX - (5 + width / 5 / 2);
        var z1 = e.clientY - (5 + width / 5 / 2);
        if (Math.sqrt(z0 * z0 + z1 * z1) <= width / 5 / 2) {
          writeTagValue();
          emit(17);
          return;
        }
      }
      mx = e.clientX;
      y = e.clientY;
      triggerObjectAt();
      writeTagValue();
    };
    canvas.onmousemove = function(e) {
      mx = e.clientX;
      y = e.clientY;
      triggerObjectAt();
    };
    canvas.onmouseup = function() {
    };
    if (/firefox/i.test(navigator.userAgent)) {
      document.addEventListener("DOMMouseScroll", onDocumentMouseScroll, false);
    } else {
      document.body.onmousewheel = onDocumentMouseScroll;
    }
    var b = false;
    var a = false;
    var all = false;
    self.onkeydown = function(e) {
      if (!(32 != e.keyCode)) {
        if (!b) {
          writeTagValue();
          emit(17);
          b = true;
        }
      }
      if (!(81 != e.keyCode)) {
        if (!a) {
          emit(18);
          a = true;
        }
      }
      if (!(87 != e.keyCode)) {
        if (!all) {
          writeTagValue();
          emit(21);
          all = true;
        }
      }
      if (27 == e.keyCode) {
        focus(true);
      }
    };
    self.onkeyup = function(event) {
      if (32 == event.keyCode) {
        b = false;
      }
      if (87 == event.keyCode) {
        all = false;
      }
      if (81 == event.keyCode) {
        if (a) {
          emit(19);
          a = false;
        }
      }
    };
    self.onblur = function() {
      emit(19);
      all = a = b = false;
    };
    self.onresize = resize;
    if (self.requestAnimationFrame) {
      self.requestAnimationFrame(anim);
    } else {
      setInterval(draw, 1E3 / 60);
    }
    if (saved) {
      log("#region").val(saved);
    }
    save();
    reset(log("#region").val());
    if (null == ws) {
      if (saved) {
        connect();
      }
    }
    log("#overlays").show();
    resize();
  }
  function onDocumentMouseScroll(event) {
    len *= Math.pow(.9, event.wheelDelta / -120 || (event.detail || 0));
    if (1 > len) {
      len = 1;
    }
    if (len > 4 / ratio) {
      len = 4 / ratio;
    }
  }
  function createObjects() {
    if (.4 > ratio) {
      child = null;
    } else {
      var n = Number.POSITIVE_INFINITY;
      var left = Number.POSITIVE_INFINITY;
      var maxY = Number.NEGATIVE_INFINITY;
      var bottom = Number.NEGATIVE_INFINITY;
      var newDuration = 0;
      var j = 0;
      for (;j < list.length;j++) {
        var data = list[j];
        if (!!data.I()) {
          if (!data.M) {
            if (!(20 >= data.size * ratio)) {
              newDuration = Math.max(data.size, newDuration);
              n = Math.min(data.x, n);
              left = Math.min(data.y, left);
              maxY = Math.max(data.x, maxY);
              bottom = Math.max(data.y, bottom);
            }
          }
        }
      }
      child = path.ca({X:n - (newDuration + 100), Y:left - (newDuration + 100), fa:maxY + (newDuration + 100), ga:bottom + (newDuration + 100), da:2, ea:4});
      j = 0;
      for (;j < list.length;j++) {
        if (data = list[j], data.I() && !(20 >= data.size * ratio)) {
          n = 0;
          for (;n < data.a.length;++n) {
            left = data.a[n].x;
            maxY = data.a[n].y;
            if (!(left < px - width / 2 / ratio)) {
              if (!(maxY < size - height / 2 / ratio)) {
                if (!(left > px + width / 2 / ratio)) {
                  if (!(maxY > size + height / 2 / ratio)) {
                    child.i(data.a[n]);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  function triggerObjectAt() {
    l = (mx - width / 2) / ratio + px;
    index = (y - height / 2) / ratio + size;
  }
  function run() {
    if (null == $) {
      $ = {};
      log("#region").children().each(function() {
        var output = log(this);
        var namespace = output.val();
        if (namespace) {
          $[namespace] = output.text();
        }
      });
    }
    log.get(string + "//m.agar.io/info", function(b) {
      var testSource = {};
      var name;
      for (name in b.regions) {
        var sourceName = name.split(":")[0];
        testSource[sourceName] = testSource[sourceName] || 0;
        testSource[sourceName] += b.regions[name].numPlayers;
      }
      for (name in testSource) {
        log('#region option[value="' + name + '"]').text($[name] + " (" + testSource[name] + " players)");
      }
    }, "json");
  }
  function _init() {
    log("#adsBottom").hide();
    log("#overlays").hide();
    save();
  }
  function reset(hash) {
    if (hash) {
      if (hash != saved) {
        if (log("#region").val() != hash) {
          log("#region").val(hash);
        }
        saved = self.localStorage.location = hash;
        log(".region-message").hide();
        log(".region-message." + hash).show();
        log(".btn-needs-server").prop("disabled", false);
        if (ma) {
          connect();
        }
      }
    }
  }
  function focus(recurring) {
    n = null;
    log("#overlays").fadeIn(recurring ? 200 : 3E3);
    if (!recurring) {
      log("#adsBottom").fadeIn(3E3);
    }
  }
  function save() {
    if (log("#region").val()) {
      self.localStorage.location = log("#region").val();
    } else {
      if (self.localStorage.location) {
        log("#region").val(self.localStorage.location);
      }
    }
    if (log("#region").val()) {
      log("#locationKnown").append(log("#region"));
    } else {
      log("#locationUnknown").append(log("#region"));
    }
  }
  function next() {
    console.log("Find " + saved + dest);
    log.ajax(string + "//m.agar.io/", {error:function() {
      setTimeout(next, 1E3);
    }, success:function(status) {
      status = status.split("\n");
      open("ws://" + status[0], status[1]);
    }, dataType:"text", method:"POST", cache:false, crossDomain:true, data:saved + dest || "?"});
  }
  function connect() {
    if (ma) {
      if (saved) {
        log("#connecting").show();
        next();
      }
    }
  }
  function open(url, a) {
    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onclose = null;
      try {
        ws.close();
      } catch (c) {
      }
      ws = null;
    }
    if (methodInvoked) {
      var attrList = url.split(":");
      url = attrList[0] + "s://ip-" + attrList[1].replace(/\./g, "-").replace(/\//g, "") + ".tech.agar.io:" + (+attrList[2] + 2E3);
    }
    result = [];
    items = [];
    args = {};
    list = [];
    innerItems = [];
    results = [];
    img = angles = null;
    closingAnimationTime = 0;
    console.log("Connecting to " + url);
    ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";
    ws.onopen = function() {
      var buf;
      backoff = 500;
      log("#connecting").hide();
      console.log("socket open");
      buf = encode(5);
      buf.setUint8(0, 254);
      buf.setUint32(1, 4, true);
      cb(buf);
      buf = encode(5);
      buf.setUint8(0, 255);
      buf.setUint32(1, 154669859, true);
      cb(buf);
      buf = encode(1 + a.length);
      buf.setUint8(0, 80);
      var i = 0;
      for (;i < a.length;++i) {
        buf.setUint8(i + 1, a.charCodeAt(i));
      }
      cb(buf);
      stringify();
    };
    ws.onmessage = onmessage;
    ws.onclose = listener;
    ws.onerror = function() {
      console.log("socket error");
    };
  }
  function encode(expectedNumberOfNonCommentArgs) {
    return new DataView(new ArrayBuffer(expectedNumberOfNonCommentArgs));
  }
  function cb(s) {
    ws.send(s.buffer);
  }
  function listener() {
    console.log("socket close");
    setTimeout(connect, backoff);
    backoff *= 1.5;
  }
  function onmessage(a) {
    parse(new DataView(a.data));
  }
  function parse(data) {
    function encode() {
      var str = "";
      for (;;) {
        var b = data.getUint16(offset, true);
        offset += 2;
        if (0 == b) {
          break;
        }
        str += String.fromCharCode(b);
      }
      return str;
    }
    var offset = 0;
    if (240 == data.getUint8(offset)) {
      offset += 5;
    }
    switch(data.getUint8(offset++)) {
      case 16:
        update(data, offset);
        break;
      case 17:
        fragment = data.getFloat32(offset, true);
        offset += 4;
        x = data.getFloat32(offset, true);
        offset += 4;
        chunk = data.getFloat32(offset, true);
        offset += 4;
        break;
      case 20:
        items = [];
        result = [];
        break;
      case 21:
        cur = data.getInt16(offset, true);
        offset += 2;
        b = data.getInt16(offset, true);
        offset += 2;
        if (!sa) {
          sa = true;
          tmp = cur;
          t = b;
        }
        break;
      case 32:
        result.push(data.getUint32(offset, true));
        offset += 4;
        break;
      case 49:
        if (null != angles) {
          break;
        }
        var len = data.getUint32(offset, true);
        offset = offset + 4;
        results = [];
        var i = 0;
        for (;i < len;++i) {
          var token = data.getUint32(offset, true);
          offset = offset + 4;
          results.push({id:token, name:encode()});
        }
        render();
        break;
      case 50:
        angles = [];
        len = data.getUint32(offset, true);
        offset += 4;
        i = 0;
        for (;i < len;++i) {
          angles.push(data.getFloat32(offset, true));
          offset += 4;
        }
        render();
        break;
      case 64:
        max = data.getFloat64(offset, true);
        offset += 8;
        length = data.getFloat64(offset, true);
        offset += 8;
        min = data.getFloat64(offset, true);
        offset += 8;
        from = data.getFloat64(offset, true);
        offset += 8;
        fragment = (min + max) / 2;
        x = (from + length) / 2;
        chunk = 1;
        if (0 == items.length) {
          px = fragment;
          size = x;
          ratio = chunk;
        }
      ;
    }
  }
  function update(view, offset) {
    left = +new Date;
    var len = Math.random();
    ta = false;
    var c = view.getUint16(offset, true);
    offset += 2;
    var i = 0;
    for (;i < c;++i) {
      var opts = args[view.getUint32(offset, true)];
      var data = args[view.getUint32(offset + 4, true)];
      offset += 8;
      if (opts) {
        if (data) {
          data.S();
          data.p = data.x;
          data.q = data.y;
          data.o = data.size;
          data.D = opts.x;
          data.F = opts.y;
          data.n = data.size;
          data.L = left;
        }
      }
    }
    i = 0;
    for (;;) {
      c = view.getUint32(offset, true);
      offset += 4;
      if (0 == c) {
        break;
      }
      ++i;
      var n;
      opts = view.getInt16(offset, true);
      offset += 2;
      data = view.getInt16(offset, true);
      offset += 2;
      n = view.getInt16(offset, true);
      offset += 2;
      var m = view.getUint8(offset++);
      var POST = view.getUint8(offset++);
      var direction = view.getUint8(offset++);
      m = (m << 16 | POST << 8 | direction).toString(16);
      for (;6 > m.length;) {
        m = "0" + m;
      }
      m = "#" + m;
      POST = view.getUint8(offset++);
      direction = !!(POST & 1);
      var uri = !!(POST & 16);
      if (POST & 2) {
        offset += 4;
      }
      if (POST & 4) {
        offset += 8;
      }
      if (POST & 8) {
        offset += 16;
      }
      var start;
      var options = "";
      for (;;) {
        start = view.getUint16(offset, true);
        offset += 2;
        if (0 == start) {
          break;
        }
        options += String.fromCharCode(start);
      }
      start = options;
      options = null;
      if (args.hasOwnProperty(c)) {
        options = args[c];
        options.K();
        options.p = options.x;
        options.q = options.y;
        options.o = options.size;
        options.color = m;
      } else {
        options = new fn(c, opts, data, n, m, start);
        list.push(options);
        args[c] = options;
        options.ka = opts;
        options.la = data;
      }
      options.d = direction;
      options.j = uri;
      options.D = opts;
      options.F = data;
      options.n = n;
      options.ja = len;
      options.L = left;
      options.W = POST;
      if (start) {
        options.Z(start);
      }
      if (-1 != result.indexOf(c)) {
        if (-1 == items.indexOf(options)) {
          document.getElementById("overlays").style.display = "none";
          items.push(options);
          if (1 == items.length) {
            px = options.x;
            size = options.y;
          }
        }
      }
    }
    len = view.getUint32(offset, true);
    offset += 4;
    i = 0;
    for (;i < len;i++) {
      c = view.getUint32(offset, true);
      offset += 4;
      options = args[c];
      if (null != options) {
        options.S();
      }
    }
    if (ta) {
      if (0 == items.length) {
        focus(false);
      }
    }
  }
  function writeTagValue() {
    var x0;
    if (isArray()) {
      x0 = mx - width / 2;
      var x1 = y - height / 2;
      if (!(64 > x0 * x0 + x1 * x1)) {
        if (!(.01 > Math.abs(r - l) && .01 > Math.abs(idx - index))) {
          r = l;
          idx = index;
          x0 = encode(21);
          x0.setUint8(0, 16);
          x0.setFloat64(1, l, true);
          x0.setFloat64(9, index, true);
          x0.setUint32(17, 0, true);
          cb(x0);
        }
      }
    }
  }
  function stringify() {
    if (isArray() && null != n) {
      var buf = encode(1 + 2 * n.length);
      buf.setUint8(0, 0);
      var i = 0;
      for (;i < n.length;++i) {
        buf.setUint16(1 + 2 * i, n.charCodeAt(i), true);
      }
      cb(buf);
    }
  }
  function isArray() {
    return null != ws && ws.readyState == ws.OPEN;
  }
  function emit(expectedNumberOfNonCommentArgs) {
    if (isArray()) {
      var buf = encode(1);
      buf.setUint8(0, expectedNumberOfNonCommentArgs);
      cb(buf);
    }
  }
  function anim() {
    draw();
    self.requestAnimationFrame(anim);
  }
  function resize() {
    width = self.innerWidth;
    height = self.innerHeight;
    img1canvas.width = canvas.width = width;
    img1canvas.height = canvas.height = height;
    var parent = log("#helloDialog");
    parent.css("transform", "none");
    var b = parent.height();
    var a = self.innerHeight;
    if (b > a / 1.1) {
      parent.css("transform", "translate(-50%, -50%) scale(" + a / b / 1.1 + ")");
    } else {
      parent.css("transform", "translate(-50%, -50%)");
    }
    draw();
  }
  function requestAnimationFrame() {
    var x0;
    x0 = 1 * Math.max(height / 1080, width / 1920);
    return x0 *= len;
  }
  function tick() {
    if (0 != items.length) {
      var offset = 0;
      var i = 0;
      for (;i < items.length;i++) {
        offset += items[i].size;
      }
      offset = Math.pow(Math.min(64 / offset, 1), .4) * requestAnimationFrame();
      ratio = (9 * ratio + offset) / 10;
    }
  }
  function draw() {
    var first;
    var offsetx = Date.now();
    ++bb;
    left = offsetx;
    if (0 < items.length) {
      tick();
      var options = first = 0;
      var i = 0;
      for (;i < items.length;i++) {
        items[i].K();
        first += items[i].x / items.length;
        options += items[i].y / items.length;
      }
      fragment = first;
      x = options;
      chunk = ratio;
      px = (px + first) / 2;
      size = (size + options) / 2;
    } else {
      px = (29 * px + fragment) / 30;
      size = (29 * size + x) / 30;
      ratio = (9 * ratio + chunk * requestAnimationFrame()) / 10;
    }
    createObjects();
    triggerObjectAt();
    if (!$timeout) {
      ctx.clearRect(0, 0, width, height);
    }
    if ($timeout) {
      ctx.fillStyle = color ? "#111111" : "#F2FBFF";
      ctx.globalAlpha = .05;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
    } else {
      redraw();
    }
    list.sort(function(a, b) {
      return a.size == b.size ? a.id - b.id : a.size - b.size;
    });
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(ratio, ratio);
    ctx.translate(-px, -size);
    i = 0;
    for (;i < innerItems.length;i++) {
      innerItems[i].T(ctx);
    }
    i = 0;
    for (;i < list.length;i++) {
      list[i].T(ctx);
    }
    that.draw(ctx);
    if (sa) {
      tmp = (3 * tmp + cur) / 4;
      t = (3 * t + b) / 4;
      ctx.save();
      ctx.strokeStyle = "#FFAAAA";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = .5;
      ctx.beginPath();
      i = 0;
      for (;i < items.length;i++) {
        ctx.moveTo(items[i].x, items[i].y);
        ctx.lineTo(tmp, t);
      }
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    if (img) {
      if (img.width) {
        ctx.drawImage(img, width - img.width - 10, 10);
      }
    }
    closingAnimationTime = Math.max(closingAnimationTime, getHeight());
    clear();
    offsetx = Date.now() - offsetx;
    if (offsetx > 1E3 / 60) {
      WEEK_LENGTH -= .01;
    } else {
      if (offsetx < 1E3 / 65) {
        WEEK_LENGTH += .01;
      }
    }
    if (.4 > WEEK_LENGTH) {
      WEEK_LENGTH = .4;
    }
    if (1 < WEEK_LENGTH) {
      WEEK_LENGTH = 1;
    }
  }
  function redraw() {
    ctx.fillStyle = color ? "#111111" : "#F2FBFF";
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.strokeStyle = color ? "#AAAAAA" : "#000000";
    ctx.globalAlpha = .2;
    ctx.scale(ratio, ratio);
    var halfWidth = width / ratio;
    var hh = height / ratio;
    var y = -.5 + (-px + halfWidth / 2) % 50;
    for (;y < halfWidth;y += 50) {
      ctx.beginPath();
      ctx.moveTo(y, 0);
      ctx.lineTo(y, hh);
      ctx.stroke();
    }
    y = -.5 + (-size + hh / 2) % 50;
    for (;y < hh;y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(halfWidth, y);
      ctx.stroke();
    }
    ctx.restore();
  }
  function clear() {
    if (options && copy.width) {
      var dim = width / 5;
      ctx.drawImage(copy, 5, 5, dim, dim);
    }
  }
  function getHeight() {
    var value = 0;
    var i = 0;
    for (;i < items.length;i++) {
      value += items[i].n * items[i].n;
    }
    return value;
  }
  function render() {
    img = null;
    if (null != angles || 0 != results.length) {
      if (null != angles || error) {
        img = document.createElement("canvas");
        var ctx = img.getContext("2d");
        var i = 60;
        i = null == angles ? i + 24 * results.length : i + 180;
        var t = Math.min(200, .3 * width) / 200;
        img.width = 200 * t;
        img.height = i * t;
        ctx.scale(t, t);
        ctx.globalAlpha = .4;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 200, i);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#FFFFFF";
        t = null;
        t = "Leaderboard";
        ctx.font = "30px Ubuntu";
        ctx.fillText(t, 100 - ctx.measureText(t).width / 2, 40);
        if (null == angles) {
          ctx.font = "20px Ubuntu";
          i = 0;
          for (;i < results.length;++i) {
            t = results[i].name || "An unnamed cell";
            if (!error) {
              t = "An unnamed cell";
            }
            if (-1 != result.indexOf(results[i].id)) {
              if (items[0].name) {
                t = items[0].name;
              }
              ctx.fillStyle = "#FFAAAA";
            } else {
              ctx.fillStyle = "#FFFFFF";
            }
            t = i + 1 + ". " + t;
            ctx.fillText(t, 100 - ctx.measureText(t).width / 2, 70 + 24 * i);
          }
        } else {
          i = t = 0;
          for (;i < angles.length;++i) {
            var t1 = t + angles[i] * Math.PI * 2;
            ctx.fillStyle = cs[i + 1];
            ctx.beginPath();
            ctx.moveTo(100, 140);
            ctx.arc(100, 140, 80, t, t1, false);
            ctx.fill();
            t = t1;
          }
        }
      }
    }
  }
  function fn(key, arg, y, s, value, range) {
    this.id = key;
    this.p = this.x = arg;
    this.q = this.y = y;
    this.o = this.size = s;
    this.color = value;
    this.a = [];
    this.l = [];
    this.R();
    this.Z(range);
  }
  function clone(events, dataAndEvents, deepDataAndEvents, s) {
    if (events) {
      this.r = events;
    }
    if (dataAndEvents) {
      this.N = dataAndEvents;
    }
    this.P = !!deepDataAndEvents;
    if (s) {
      this.s = s;
    }
  }
  var string = self.location.protocol;
  var methodInvoked = "https:" == string;
  if (self.location.ancestorOrigins && (self.location.ancestorOrigins.length && "https://apps.facebook.com" != self.location.ancestorOrigins[0])) {
    self.top.location = "http://agar.io/";
  } else {
    var img1canvas;
    var ctx;
    var canvas;
    var width;
    var height;
    var child = null;
    var ws = null;
    var px = 0;
    var size = 0;
    var result = [];
    var items = [];
    var args = {};
    var list = [];
    var innerItems = [];
    var results = [];
    var mx = 0;
    var y = 0;
    var l = -1;
    var index = -1;
    var bb = 0;
    var left = 0;
    var n = null;
    var max = 0;
    var length = 0;
    var min = 1E4;
    var from = 1E4;
    var ratio = 1;
    var saved = null;
    var j = true;
    var error = true;
    var doneResults = false;
    var ta = false;
    var closingAnimationTime = 0;
    var color = false;
    var text = false;
    var fragment = px = ~~((max + min) / 2);
    var x = size = ~~((length + from) / 2);
    var chunk = 1;
    var dest = "";
    var angles = null;
    var ma = false;
    var sa = false;
    var cur = 0;
    var b = 0;
    var tmp = 0;
    var t = 0;
    var compassResult = 0;
    var cs = ["#333333", "#FF3333", "#33FF33", "#3333FF"];
    var $timeout = false;
    var len = 1;
    var options = "ontouchstart" in self && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var copy = new Image;
    copy.src = "img/split.png";
    var test_canvas = document.createElement("canvas");
    if ("undefined" == typeof console || ("undefined" == typeof DataView || ("undefined" == typeof WebSocket || (null == test_canvas || (null == test_canvas.getContext || null == self.localStorage))))) {
      alert("You browser does not support this game, we recommend you to use Firefox to play this");
    } else {
      var $ = null;
      self.setNick = function(step) {
        _init();
        n = step;
        stringify();
        closingAnimationTime = 0;
      };
      self.setRegion = reset;
      self.setSkins = function(iStart) {
        j = iStart;
      };
      self.setNames = function(err) {
        error = err;
      };
      self.setDarkTheme = function(newColor) {
        color = newColor;
      };
      self.setColors = function(data) {
        doneResults = data;
      };
      self.setShowMass = function(textAlt) {
        text = textAlt;
      };
      self.spectate = function() {
        n = null;
        emit(1);
        _init();
      };
      self.setGameMode = function(mat) {
        if (mat != dest) {
          dest = mat;
          connect();
        }
      };
      self.setAcid = function(_$timeout_) {
        $timeout = _$timeout_;
      };
      if (null != self.localStorage) {
        if (null == self.localStorage.AB8) {
          self.localStorage.AB8 = 0 + ~~(100 * Math.random());
        }
        compassResult = +self.localStorage.AB8;
        self.ABGroup = compassResult;
      }
      log.get(string + "//gc.agar.io", function(prop) {
        var name = prop.split(" ");
        prop = name[0];
        name = name[1] || "";
        if (-1 == ["UA"].indexOf(prop)) {
          skip.push("ussr");
        }
        if (input.hasOwnProperty(prop)) {
          if ("string" == typeof input[prop]) {
            if (!saved) {
              reset(input[prop]);
            }
          } else {
            if (input[prop].hasOwnProperty(name)) {
              if (!saved) {
                reset(input[prop][name]);
              }
            }
          }
        }
      }, "text");
      setTimeout(function() {
      }, 3E5);
      var input = {AF:"JP-Tokyo", AX:"EU-London", AL:"EU-London", DZ:"EU-London", AS:"SG-Singapore", AD:"EU-London", AO:"EU-London", AI:"US-Atlanta", AG:"US-Atlanta", AR:"BR-Brazil", AM:"JP-Tokyo", AW:"US-Atlanta", AU:"SG-Singapore", AT:"EU-London", AZ:"JP-Tokyo", BS:"US-Atlanta", BH:"JP-Tokyo", BD:"JP-Tokyo", BB:"US-Atlanta", BY:"EU-London", BE:"EU-London", BZ:"US-Atlanta", BJ:"EU-London", BM:"US-Atlanta", BT:"JP-Tokyo", BO:"BR-Brazil", BQ:"US-Atlanta", BA:"EU-London", BW:"EU-London", BR:"BR-Brazil", 
      IO:"JP-Tokyo", VG:"US-Atlanta", BN:"JP-Tokyo", BG:"EU-London", BF:"EU-London", BI:"EU-London", KH:"JP-Tokyo", CM:"EU-London", CA:"US-Atlanta", CV:"EU-London", KY:"US-Atlanta", CF:"EU-London", TD:"EU-London", CL:"BR-Brazil", CN:"CN-China", CX:"JP-Tokyo", CC:"JP-Tokyo", CO:"BR-Brazil", KM:"EU-London", CD:"EU-London", CG:"EU-London", CK:"SG-Singapore", CR:"US-Atlanta", CI:"EU-London", HR:"EU-London", CU:"US-Atlanta", CW:"US-Atlanta", CY:"JP-Tokyo", CZ:"EU-London", DK:"EU-London", DJ:"EU-London", 
      DM:"US-Atlanta", DO:"US-Atlanta", EC:"BR-Brazil", EG:"EU-London", SV:"US-Atlanta", GQ:"EU-London", ER:"EU-London", EE:"EU-London", ET:"EU-London", FO:"EU-London", FK:"BR-Brazil", FJ:"SG-Singapore", FI:"EU-London", FR:"EU-London", GF:"BR-Brazil", PF:"SG-Singapore", GA:"EU-London", GM:"EU-London", GE:"JP-Tokyo", DE:"EU-London", GH:"EU-London", GI:"EU-London", GR:"EU-London", GL:"US-Atlanta", GD:"US-Atlanta", GP:"US-Atlanta", GU:"SG-Singapore", GT:"US-Atlanta", GG:"EU-London", GN:"EU-London", 
      GW:"EU-London", GY:"BR-Brazil", HT:"US-Atlanta", VA:"EU-London", HN:"US-Atlanta", HK:"JP-Tokyo", HU:"EU-London", IS:"EU-London", IN:"JP-Tokyo", ID:"JP-Tokyo", IR:"JP-Tokyo", IQ:"JP-Tokyo", IE:"EU-London", IM:"EU-London", IL:"JP-Tokyo", IT:"EU-London", JM:"US-Atlanta", JP:"JP-Tokyo", JE:"EU-London", JO:"JP-Tokyo", KZ:"JP-Tokyo", KE:"EU-London", KI:"SG-Singapore", KP:"JP-Tokyo", KR:"JP-Tokyo", KW:"JP-Tokyo", KG:"JP-Tokyo", LA:"JP-Tokyo", LV:"EU-London", LB:"JP-Tokyo", LS:"EU-London", LR:"EU-London", 
      LY:"EU-London", LI:"EU-London", LT:"EU-London", LU:"EU-London", MO:"JP-Tokyo", MK:"EU-London", MG:"EU-London", MW:"EU-London", MY:"JP-Tokyo", MV:"JP-Tokyo", ML:"EU-London", MT:"EU-London", MH:"SG-Singapore", MQ:"US-Atlanta", MR:"EU-London", MU:"EU-London", YT:"EU-London", MX:"US-Atlanta", FM:"SG-Singapore", MD:"EU-London", MC:"EU-London", MN:"JP-Tokyo", ME:"EU-London", MS:"US-Atlanta", MA:"EU-London", MZ:"EU-London", MM:"JP-Tokyo", NA:"EU-London", NR:"SG-Singapore", NP:"JP-Tokyo", NL:"EU-London", 
      NC:"SG-Singapore", NZ:"SG-Singapore", NI:"US-Atlanta", NE:"EU-London", NG:"EU-London", NU:"SG-Singapore", NF:"SG-Singapore", MP:"SG-Singapore", NO:"EU-London", OM:"JP-Tokyo", PK:"JP-Tokyo", PW:"SG-Singapore", PS:"JP-Tokyo", PA:"US-Atlanta", PG:"SG-Singapore", PY:"BR-Brazil", PE:"BR-Brazil", PH:"JP-Tokyo", PN:"SG-Singapore", PL:"EU-London", PT:"EU-London", PR:"US-Atlanta", QA:"JP-Tokyo", RE:"EU-London", RO:"EU-London", RU:"RU-Russia", RW:"EU-London", BL:"US-Atlanta", SH:"EU-London", KN:"US-Atlanta", 
      LC:"US-Atlanta", MF:"US-Atlanta", PM:"US-Atlanta", VC:"US-Atlanta", WS:"SG-Singapore", SM:"EU-London", ST:"EU-London", SA:"EU-London", SN:"EU-London", RS:"EU-London", SC:"EU-London", SL:"EU-London", SG:"JP-Tokyo", SX:"US-Atlanta", SK:"EU-London", SI:"EU-London", SB:"SG-Singapore", SO:"EU-London", ZA:"EU-London", SS:"EU-London", ES:"EU-London", LK:"JP-Tokyo", SD:"EU-London", SR:"BR-Brazil", SJ:"EU-London", SZ:"EU-London", SE:"EU-London", CH:"EU-London", SY:"EU-London", TW:"JP-Tokyo", TJ:"JP-Tokyo", 
      TZ:"EU-London", TH:"JP-Tokyo", TL:"JP-Tokyo", TG:"EU-London", TK:"SG-Singapore", TO:"SG-Singapore", TT:"US-Atlanta", TN:"EU-London", TR:"TK-Turkey", TM:"JP-Tokyo", TC:"US-Atlanta", TV:"SG-Singapore", UG:"EU-London", UA:"EU-London", AE:"EU-London", GB:"EU-London", US:{AL:"US-Atlanta", AK:"US-Fremont", AZ:"US-Fremont", AR:"US-Atlanta", CA:"US-Fremont", CO:"US-Fremont", CT:"US-Atlanta", DE:"US-Atlanta", FL:"US-Atlanta", GA:"US-Atlanta", HI:"US-Fremont", ID:"US-Fremont", IL:"US-Atlanta", IN:"US-Atlanta", 
      IA:"US-Atlanta", KS:"US-Atlanta", KY:"US-Atlanta", LA:"US-Atlanta", ME:"US-Atlanta", MD:"US-Atlanta", MA:"US-Atlanta", MI:"US-Atlanta", MN:"US-Fremont", MS:"US-Atlanta", MO:"US-Atlanta", MT:"US-Fremont", NE:"US-Fremont", NV:"US-Fremont", NH:"US-Atlanta", NJ:"US-Atlanta", NM:"US-Fremont", NY:"US-Atlanta", NC:"US-Atlanta", ND:"US-Fremont", OH:"US-Atlanta", OK:"US-Atlanta", OR:"US-Fremont", PA:"US-Atlanta", RI:"US-Atlanta", SC:"US-Atlanta", SD:"US-Fremont", TN:"US-Atlanta", TX:"US-Atlanta", UT:"US-Fremont", 
      VT:"US-Atlanta", VA:"US-Atlanta", WA:"US-Fremont", WV:"US-Atlanta", WI:"US-Atlanta", WY:"US-Fremont", DC:"US-Atlanta", AS:"US-Atlanta", GU:"US-Atlanta", MP:"US-Atlanta", PR:"US-Atlanta", UM:"US-Atlanta", VI:"US-Atlanta"}, UM:"SG-Singapore", VI:"US-Atlanta", UY:"BR-Brazil", UZ:"JP-Tokyo", VU:"SG-Singapore", VE:"BR-Brazil", VN:"JP-Tokyo", WF:"SG-Singapore", EH:"EU-London", YE:"JP-Tokyo", ZM:"EU-London", ZW:"EU-London"};
      self.connect = open;
      var backoff = 500;
      var r = -1;
      var idx = -1;
      var img = null;
      var WEEK_LENGTH = 1;
      var ja = null;
      var imgs = {};
      var skip = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;chaplin;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal;facebook".split(";");
      var reserved = ["8", "nasa"];
      var numbers = ["m'blob"];
      fn.prototype = {id:0, a:null, l:null, name:null, k:null, J:null, x:0, y:0, size:0, p:0, q:0, o:0, D:0, F:0, n:0, W:0, L:0, ja:0, ba:0, A:false, d:false, j:false, M:true, S:function() {
        var i;
        i = 0;
        for (;i < list.length;i++) {
          if (list[i] == this) {
            list.splice(i, 1);
            break;
          }
        }
        delete args[this.id];
        i = items.indexOf(this);
        if (-1 != i) {
          ta = true;
          items.splice(i, 1);
        }
        i = result.indexOf(this.id);
        if (-1 != i) {
          result.splice(i, 1);
        }
        this.A = true;
        innerItems.push(this);
      }, h:function() {
        return Math.max(~~(.3 * this.size), 24);
      }, Z:function(n) {
        if (this.name = n) {
          if (null == this.k) {
            this.k = new clone(this.h(), "#FFFFFF", true, "#000000");
          } else {
            this.k.H(this.h());
          }
          this.k.u(this.name);
        }
      }, R:function() {
        var a = this.C();
        for (;this.a.length > a;) {
          var i = ~~(Math.random() * this.a.length);
          this.a.splice(i, 1);
          this.l.splice(i, 1);
        }
        if (0 == this.a.length) {
          if (0 < a) {
            this.a.push({Q:this, e:this.size, x:this.x, y:this.y});
            this.l.push(Math.random() - .5);
          }
        }
        for (;this.a.length < a;) {
          i = ~~(Math.random() * this.a.length);
          var e = this.a[i];
          this.a.splice(i, 0, {Q:this, e:e.e, x:e.x, y:e.y});
          this.l.splice(i, 0, this.l[i]);
        }
      }, C:function() {
        if (0 == this.id) {
          return 16;
        }
        var rh = 10;
        if (20 > this.size) {
          rh = 0;
        }
        if (this.d) {
          rh = 30;
        }
        var w = this.size;
        if (!this.d) {
          w *= ratio;
        }
        w *= WEEK_LENGTH;
        if (this.W & 32) {
          w *= .25;
        }
        return ~~Math.max(w, rh);
      }, ha:function() {
        this.R();
        var points = this.a;
        var comparisons = this.l;
        var n = points.length;
        var i = 0;
        for (;i < n;++i) {
          var s = comparisons[(i - 1 + n) % n];
          var t = comparisons[(i + 1) % n];
          comparisons[i] += (Math.random() - .5) * (this.j ? 3 : 1);
          comparisons[i] *= .7;
          if (10 < comparisons[i]) {
            comparisons[i] = 10;
          }
          if (-10 > comparisons[i]) {
            comparisons[i] = -10;
          }
          comparisons[i] = (s + t + 8 * comparisons[i]) / 10;
        }
        var ELEMENT_NODE = this;
        var sa = this.d ? 0 : (this.id / 1E3 + left / 1E4) % (2 * Math.PI);
        i = 0;
        for (;i < n;++i) {
          var ret = points[i].e;
          s = points[(i - 1 + n) % n].e;
          t = points[(i + 1) % n].e;
          if (15 < this.size && (null != child && (20 < this.size * ratio && 0 != this.id))) {
            var l = false;
            var x = points[i].x;
            var y = points[i].y;
            child.ia(x - 5, y - 5, 10, 10, function(node) {
              if (node.Q != ELEMENT_NODE) {
                if (25 > (x - node.x) * (x - node.x) + (y - node.y) * (y - node.y)) {
                  l = true;
                }
              }
            });
            if (!l) {
              if (points[i].x < max || (points[i].y < length || (points[i].x > min || points[i].y > from))) {
                l = true;
              }
            }
            if (l) {
              if (0 < comparisons[i]) {
                comparisons[i] = 0;
              }
              comparisons[i] -= 1;
            }
          }
          ret += comparisons[i];
          if (0 > ret) {
            ret = 0;
          }
          ret = this.j ? (19 * ret + this.size) / 20 : (12 * ret + this.size) / 13;
          points[i].e = (s + t + 8 * ret) / 10;
          s = 2 * Math.PI / n;
          t = this.a[i].e;
          if (this.d) {
            if (0 == i % 2) {
              t += 5;
            }
          }
          points[i].x = this.x + Math.cos(s * i + sa) * t;
          points[i].y = this.y + Math.sin(s * i + sa) * t;
        }
      }, K:function() {
        if (0 == this.id) {
          return 1;
        }
        var p;
        p = (left - this.L) / 120;
        p = 0 > p ? 0 : 1 < p ? 1 : p;
        var o = 0 > p ? 0 : 1 < p ? 1 : p;
        this.h();
        if (this.A && 1 <= o) {
          var domIndex = innerItems.indexOf(this);
          if (-1 != domIndex) {
            innerItems.splice(domIndex, 1);
          }
        }
        this.x = p * (this.D - this.p) + this.p;
        this.y = p * (this.F - this.q) + this.q;
        this.size = o * (this.n - this.o) + this.o;
        return o;
      }, I:function() {
        return 0 == this.id ? true : this.x + this.size + 40 < px - width / 2 / ratio || (this.y + this.size + 40 < size - height / 2 / ratio || (this.x - this.size - 40 > px + width / 2 / ratio || this.y - this.size - 40 > size + height / 2 / ratio)) ? false : true;
      }, T:function(ctx) {
        if (this.I()) {
          var y_position = 0 != this.id && (!this.d && (!this.j && .4 > ratio));
          if (5 > this.C()) {
            y_position = true;
          }
          if (this.M && !y_position) {
            var val = 0;
            for (;val < this.a.length;val++) {
              this.a[val].e = this.size;
            }
          }
          this.M = y_position;
          ctx.save();
          this.ba = left;
          val = this.K();
          if (this.A) {
            ctx.globalAlpha *= 1 - val;
          }
          ctx.lineWidth = 10;
          ctx.lineCap = "round";
          ctx.lineJoin = this.d ? "miter" : "round";
          if (doneResults) {
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#AAAAAA";
          } else {
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
          }
          if (y_position) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 5, 0, 2 * Math.PI, false);
          } else {
            this.ha();
            ctx.beginPath();
            var i = this.C();
            ctx.moveTo(this.a[0].x, this.a[0].y);
            val = 1;
            for (;val <= i;++val) {
              var obj = val % i;
              ctx.lineTo(this.a[obj].x, this.a[obj].y);
            }
          }
          ctx.closePath();
          i = this.name.toLowerCase();
          if (!this.j && (j && ":teams" != dest)) {
            if (-1 != skip.indexOf(i)) {
              if (!imgs.hasOwnProperty(i)) {
                imgs[i] = new Image;
                imgs[i].src = "skins/" + i + ".png";
              }
              val = 0 != imgs[i].width && imgs[i].complete ? imgs[i] : null;
            } else {
              val = null;
            }
          } else {
            val = null;
          }
          val = (obj = val) ? -1 != numbers.indexOf(i) : false;
          if (!y_position) {
            ctx.stroke();
          }
          ctx.fill();
          if (!(null == obj)) {
            if (!val) {
              ctx.save();
              ctx.clip();
              ctx.drawImage(obj, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
              ctx.restore();
            }
          }
          if (doneResults || 15 < this.size) {
            if (!y_position) {
              ctx.strokeStyle = "#000000";
              ctx.globalAlpha *= .1;
              ctx.stroke();
            }
          }
          ctx.globalAlpha = 1;
          if (null != obj) {
            if (val) {
              ctx.drawImage(obj, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
            }
          }
          val = -1 != items.indexOf(this);
          if (0 != this.id) {
            y_position = ~~this.y;
            if ((error || val) && (this.name && (this.k && (null == obj || -1 == reserved.indexOf(i))))) {
              obj = this.k;
              obj.u(this.name);
              obj.H(this.h());
              i = Math.ceil(10 * ratio) / 10;
              obj.$(i);
              obj = obj.G();
              var glockBottomWidth = ~~(obj.width / i);
              var sh = ~~(obj.height / i);
              ctx.drawImage(obj, ~~this.x - ~~(glockBottomWidth / 2), y_position - ~~(sh / 2), glockBottomWidth, sh);
              y_position += obj.height / 2 / i + 4;
            }
            if (text) {
              if (val || 0 == items.length && ((!this.d || this.j) && 20 < this.size)) {
                if (null == this.J) {
                  this.J = new clone(this.h() / 2, "#FFFFFF", true, "#000000");
                }
                val = this.J;
                val.H(this.h() / 2);
                val.u(~~(this.size * this.size / 100));
                i = Math.ceil(10 * ratio) / 10;
                val.$(i);
                obj = val.G();
                glockBottomWidth = ~~(obj.width / i);
                sh = ~~(obj.height / i);
                ctx.drawImage(obj, ~~this.x - ~~(glockBottomWidth / 2), y_position - ~~(sh / 2), glockBottomWidth, sh);
              }
            }
          }
          ctx.restore();
        }
      }};
      clone.prototype = {w:"", N:"#000000", P:false, s:"#000000", r:16, m:null, O:null, g:false, v:1, H:function(r) {
        if (this.r != r) {
          this.r = r;
          this.g = true;
        }
      }, $:function(x) {
        if (this.v != x) {
          this.v = x;
          this.g = true;
        }
      }, setStrokeColor:function(s) {
        if (this.s != s) {
          this.s = s;
          this.g = true;
        }
      }, u:function(n) {
        if (n != this.w) {
          this.w = n;
          this.g = true;
        }
      }, G:function() {
        if (null == this.m) {
          this.m = document.createElement("canvas");
          this.O = this.m.getContext("2d");
        }
        if (this.g) {
          this.g = false;
          var m = this.m;
          var canvas = this.O;
          var caracter = this.w;
          var quality = this.v;
          var y = this.r;
          var s = y + "px Ubuntu";
          canvas.font = s;
          var height = ~~(.2 * y);
          m.width = (canvas.measureText(caracter).width + 6) * quality;
          m.height = (y + height) * quality;
          canvas.font = s;
          canvas.scale(quality, quality);
          canvas.globalAlpha = 1;
          canvas.lineWidth = 3;
          canvas.strokeStyle = this.s;
          canvas.fillStyle = this.N;
          if (this.P) {
            canvas.strokeText(caracter, 3, y - height / 2);
          }
          canvas.fillText(caracter, 3, y - height / 2);
        }
        return this.m;
      }};
      if (!Date.now) {
        Date.now = function() {
          return (new Date).getTime();
        };
      }
      var path = {ca:function(start) {
        function Node(xp, yp, f, children, depth) {
          this.x = xp;
          this.y = yp;
          this.f = f;
          this.c = children;
          this.depth = depth;
          this.items = [];
          this.b = [];
        }
        var params = start.da || 2;
        var header_depth = start.ea || 4;
        Node.prototype = {x:0, y:0, f:0, c:0, depth:0, items:null, b:null, B:function(b) {
          var i = 0;
          for (;i < this.items.length;++i) {
            var item = this.items[i];
            if (item.x >= b.x && (item.y >= b.y && (item.x < b.x + b.f && item.y < b.y + b.c))) {
              return true;
            }
          }
          if (0 != this.b.length) {
            var proto = this;
            return this.V(b, function(i) {
              return proto.b[i].B(b);
            });
          }
          return false;
        }, t:function(deepDataAndEvents, b) {
          var i = 0;
          for (;i < this.items.length;++i) {
            b(this.items[i]);
          }
          if (0 != this.b.length) {
            var proto = this;
            this.V(deepDataAndEvents, function(i) {
              proto.b[i].t(deepDataAndEvents, b);
            });
          }
        }, i:function(deepDataAndEvents) {
          if (0 != this.b.length) {
            this.b[this.U(deepDataAndEvents)].i(deepDataAndEvents);
          } else {
            if (this.items.length >= params && this.depth < header_depth) {
              this.aa();
              this.b[this.U(deepDataAndEvents)].i(deepDataAndEvents);
            } else {
              this.items.push(deepDataAndEvents);
            }
          }
        }, U:function(_pt) {
          return _pt.x < this.x + this.f / 2 ? _pt.y < this.y + this.c / 2 ? 0 : 2 : _pt.y < this.y + this.c / 2 ? 1 : 3;
        }, V:function(e, d) {
          return e.x < this.x + this.f / 2 && (e.y < this.y + this.c / 2 && d(0) || e.y >= this.y + this.c / 2 && d(2)) || e.x >= this.x + this.f / 2 && (e.y < this.y + this.c / 2 && d(1) || e.y >= this.y + this.c / 2 && d(3)) ? true : false;
        }, aa:function() {
          var codeSegments = this.depth + 1;
          var i = this.f / 2;
          var y = this.c / 2;
          this.b.push(new Node(this.x, this.y, i, y, codeSegments));
          this.b.push(new Node(this.x + i, this.y, i, y, codeSegments));
          this.b.push(new Node(this.x, this.y + y, i, y, codeSegments));
          this.b.push(new Node(this.x + i, this.y + y, i, y, codeSegments));
          codeSegments = this.items;
          this.items = [];
          i = 0;
          for (;i < codeSegments.length;i++) {
            this.i(codeSegments[i]);
          }
        }, clear:function() {
          var i = 0;
          for (;i < this.b.length;i++) {
            this.b[i].clear();
          }
          this.items.length = 0;
          this.b.length = 0;
        }};
        var obj = {x:0, y:0, f:0, c:0};
        return {root:new Node(start.X, start.Y, start.fa - start.X, start.ga - start.Y, 0), i:function(deepDataAndEvents) {
          this.root.i(deepDataAndEvents);
        }, t:function(deepDataAndEvents, args) {
          this.root.t(deepDataAndEvents, args);
        }, ia:function(x, rotation, s, source, params) {
          obj.x = x;
          obj.y = rotation;
          obj.f = s;
          obj.c = source;
          this.root.t(obj, params);
        }, B:function(x) {
          return this.root.B(x);
        }, clear:function() {
          this.root.clear();
        }};
      }};
      self.onload = init;
    }
  }
  var that = self.ai = new Ai(function(sl, restore) {
    l = sl;
    index = restore;
    writeTagValue();
  }, function() {
    emit(17);
  }, function() {
    emit(21);
  });
  that.nicks = skip;
  var equals = update;
  update = function(value, position) {
    equals(value, position);
    that.tick(list, items, closingAnimationTime);
  };
  var focusEvent = focus;
  focus = function(recurring) {
    n = null;
  };
  render = function() {
    that.updateLeaderboard(results, result);
  };
  redraw = function() {
  };
})(window, window.jQuery);
