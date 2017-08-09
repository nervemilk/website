var Word, ctx, curr, draw, menuHeight, mouseClicked, setup, windowResized, words;

ctx = null;

curr = null;

words = [];

menuHeight = 40;

Word = (function() {
  function Word(ctx1, id, text1, link1, x, y) {
    this.ctx = ctx1;
    this.id = id;
    this.text = text1;
    this.link = link1;
    this.x = x;
    this.y = y;
    this.animateStartIndex = 0;
    this.animateSpeed = 1;
    this.width = this.ctx.measureText(this.text).width * 1.2;
    this.displayText = this.text;
    this.colorStop = 1;
    this.state = 0;
  }

  Word.prototype.update = function() {
    var r;
    if (curr && curr.id === this.id) {
      this.state = 1;
    } else {
      if (this.state === 1) {
        this.state = 0;
      }
      if (this.state === 0) {
        r = random(0, 1111);
        if (r < 1) {
          this.state = 2;
          this.animateStartIndex = 0;
          this.animateSpeed = random(0.11, 0.66);
        } else if (r < 2) {
          this.state = 3;
          this.animateStartIndex = 0;
          this.animateSpeed = random(0.11, 0.66);
        }
      }
    }
    if (this.state === -1) {
      return this.displayText = "";
    } else if (this.state === 0) {
      return this.displayText = this.text;
    } else if (this.state === 1) {
      this.colorStop = max(min((mouseX - curr.x) / curr.width, 1), 0);
      return this.displayText = this.text;
    } else if (this.state === 2) {
      if (this.animateStartIndex < this.text.length) {
        this.animateStartIndex += this.animateSpeed;
        this.displayText = "";
        if (this.animateStartIndex > 0) {
          return this.displayText = this.text.substring(0, int(this.animateStartIndex));
        }
      } else {
        return this.state = 0;
      }
    } else if (this.state === 3) {
      this.colorStop = cos(this.animateStartIndex * 0.11 * this.animateSpeed) * 0.5 + 0.5;
      this.displayText = this.text;
      this.animateStartIndex++;
      if (this.animateStartIndex > 111) {
        return this.state = 0;
      }
    }
  };

  Word.prototype.draw = function() {
    this.color = this.ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
    this.color.addColorStop("0", "#111");
    this.color.addColorStop(this.colorStop, "#fff");
    this.color.addColorStop("1.0", "#111");
    this.ctx.fillStyle = this.color;
    return this.ctx.fillText(this.displayText, this.x, this.y);
  };

  return Word;

})();

setup = function() {
  var canvas, i, index, len, link, results, spacing, startX, startY, stories, story, text, word;
  stories = selectAll('.story-item');
  if (stories.length === 0) {
    return;
  }
  canvas = createCanvas(windowWidth, windowHeight - menuHeight);
  canvas.id('canvas').position(0, menuHeight).style('position', 'absolute');
  ctx = canvas.drawingContext;
  ctx.font = "27px San Francisco";
  frameRate(60);
  startX = 0;
  startY = 50;
  index = 0;
  while (startY < windowHeight) {
    story = stories[index];
    link = story.elt.href;
    text = story.elt.innerHTML;
    word = new Word(ctx, index, text, link, startX, startY);
    words.push(word);
    spacing = random(10, 40);
    startX += word.width + spacing;
    if (startX > windowWidth) {
      startX = startX - spacing - windowWidth - word.width;
      startY += 50;
    } else {
      index = (index + 1) % stories.length;
    }
  }
  results = [];
  for (i = 0, len = words.length; i < len; i++) {
    word = words[i];
    word.animateStartIndex = random(-50, 0);
    results.push(word.state = 2);
  }
  return results;
};

draw = function() {
  var i, j, len, len1, results, word;
  background(0);
  curr = null;
  for (i = 0, len = words.length; i < len; i++) {
    word = words[i];
    if (mouseX > word.x && mouseX < word.x + word.width && mouseY < (word.y + 10) && mouseY > (word.y - 30)) {
      curr = word;
      break;
    }
  }
  results = [];
  for (j = 0, len1 = words.length; j < len1; j++) {
    word = words[j];
    word.update();
    results.push(word.draw());
  }
  return results;
};

windowResized = function() {
  return resizeCanvas(windowWidth, windowHeight);
};

mouseClicked = function() {
  if (curr !== null) {
    return window.location = curr.link;
  }
};
