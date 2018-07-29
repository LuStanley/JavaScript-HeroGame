class BaseCharacter {
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }
  attack(character, damage) {
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }

  getHurt(damage) {
    //前置作業：設定 _this 與輪播圖片所用的編號
    var _this = this;
    var i =1;

    _this.id = setInterval(function() {

      if (i == 1) {
          _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
          _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
          _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
        }

        _this.element.getElementsByClassName("effect-image")[0].src = "images/effect/blade/"+ i + ".png";
        i++;
      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    }, 50);
    //
    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }
  }
  die() {
    this.alive = false;
  }
  updateHtml(hpElement, hurtElement) {
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp / this.maxHp * 100) + "%";
  }
}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("召喚英雄 " + this.name + " ! ");
  }
  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("遇到怪獸了 " + this.name + " ! ");
  }
  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

function addSkillEvent() {
  var skill = document.getElementById("skill");
  skill.onclick = function() {
    heroAttack();
  }
}

function addHealEvent() {
  var heal = document.getElementById("heal");
  heal.onclick = function() {
    heroHeal();
  }
}

var rounds = 10;
function endTurn() {
  rounds --;
  document.getElementById("round-num").textContent = rounds;
  if(rounds < 1) {
    // 「遊戲結束」空白區
    finish();
  }
}

function heroAttack() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  setTimeout(function() {
    hero.element.classList.add("attacking");
    setTimeout(function() {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500);
  }, 100);

  setTimeout(function() {
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          // 「遊戲結束」空白區
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      // Monster die「遊戲結束」空白區
      finish();
    }
  }, 1100);
}

function heroHeal() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  if (hero.hp > (hero.maxHp - 30)) {
    hero.hp = hero.maxHp;
  } else {
    hero.hp = hero.hp + 30;
  }
  hero.updateHtml(hero.hpElement, hero.hurtElement);

  setTimeout(function() {
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          // 「遊戲結束」空白區
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      // Monster die「遊戲結束」空白區
      finish();
    }
  }, 100);

}


function finish() {
  var dialog = document.getElementById("dialog")
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}
var hero = new Hero("Stanley", 130, 30);
var monster = new Monster("Skeleton", 130, 10);
addSkillEvent();
addHealEvent();
