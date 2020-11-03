window.onload = function(){

    class Player {
        constructor() {
            this.state = {
                name: 'Manastorm',
                level: 5,
                mana: 100,
                hp: 100
            };
        }

        name() {
            return this.state.name;
        }

        title() {
            return this.state.name + ' lvl ' + this.state.level;
        }

        mana() {
            return this.state.mana;
        }

        maxHP() {
            return this.state.hp;
        }
    }

    class Dragon {
        constructor() {
            this.state = {
                name: 'Dragon',
                level: 5,
                mana: 100,
                hp: 1000,
            };
        }

        maxHP() {
            return this.state.hp;
        }
    }

    class SpellBook {
        constructor() {
            this.state = {
                list: [
                    ['healUnits', 'Heal 20-50', '20-50', 'player'],
                    ['curseUnits', 'Curse 5-10', '5-10', 'enemy'],
                    ['damageUnits', 'Damage 10-50', '10-50', 'enemy'],
                    //['resurrectUnits', 'Resurrection', 50, 'player'],
                ]
            }
        }

        spells() {
            return this.state.list;
        }
    }

    let spellBookList = new SpellBook;
    let dragon = new Dragon;
    let player = new Player;
    player.state.level = 1;

    setCookie('user_level', player.state.level);

    let mainLogs = document.createElement('div');
    mainLogs.className = 'main_logs';
    document.getElementById('main').append(mainLogs);

    let mainLogsContent = document.createElement('div');
    mainLogsContent.className = 'main_logs_content';
    mainLogs.append(mainLogsContent);

    let mainBanner = document.createElement('div');
    mainBanner.className = 'main_banner ready';

    let mainBannerText = document.createElement('p');
    mainBannerText.innerText = 'Ready to Battle!';
    mainBanner.append(mainBannerText);

    document.getElementById('main').prepend(mainBanner);

    getUserInfo(player.title(), player.mana());
    getEnemyInfo();

    setTimeout(() => {
        mainBanner.classList.remove('ready')
        mainBanner.classList.add('go');
        mainBannerText.innerText = 'Fight!';

        document.getElementById('main').classList.add('fight');

        initiateAutoAttack('player', 'enemy');
        initiateAutoAttack('enemy', 'player');
    }, 1000);


    function initiateAutoAttack(attacker, defender) {
        startAutoAttack(getUnits(attacker), getUnits(defender));
    }

    function startAutoAttack(armyUnits, enemyUnits) {
        for(let [unitPos, armyUnit] of armyUnits.entries()) {
            let attack = armyUnit.getAttribute('attack');
            let speed = armyUnit.getAttribute('speed');
            let unitName = armyUnit.getAttribute('name');
            let unitSide = armyUnit.getAttribute('side');


            let enemyUnit = enemyUnits[unitPos];
            if (enemyUnits.length === 1) enemyUnit = enemyUnits[0];

            let deadEnemyUnits = document.querySelector('.main_block.enemy').querySelector('.block_line.army').getElementsByClassName('death');

            let start = setTimeout(function autoAttack() {

                if (armyUnit.querySelector('.unit_hp p').innerText === 'died' || deadEnemyUnits === enemyUnits.length) {
                    clearTimeout(start);
                } else {
                    setTimeout(autoAttack, speed);
                }

                if (enemyUnit.classList.contains('death') && unitPos === 0 && enemyUnits.length > 0) enemyUnit = enemyUnits[1];
                if (enemyUnit.classList.contains('death') && unitPos === 1 && enemyUnits.length > 0) enemyUnit = enemyUnits[0];

                let enemy = enemyUnit.querySelector('.unit_hp p');
                let enemyArmor = enemyUnit.getAttribute('armor');
                let enemySide = enemyUnit.getAttribute('side');
                let enemyName = enemyUnit.getAttribute('name');

                if (enemy.innerText !== 'died' && armyUnit.querySelector('.unit_hp p').innerText !== 'died' && getCurseBuff(armyUnit) === 0 && deadEnemyUnits.length !== enemyUnits.length) {

                    let arr = attack.split('-');
                    let value = getRandomArbitrary(parseInt(arr[0]), parseInt(arr[1]));

                    let attackValue = value;

                    if (enemyArmor > 0) {
                        attackValue = Math.floor(value - enemyArmor / 100);
                        let difference = enemyArmor - attackValue ;
                        if (difference <= 0) {
                            enemyArmor = 0
                        } else {
                            enemyArmor = difference;
                        }
                        enemyUnit.setAttribute('armor', enemyArmor);
                    }

                    let maxHP = enemySide === 'player' ? player.maxHP() : dragon.maxHP();

                    let lossHP = parseInt(enemy.innerText) - attackValue;

                    let enemyHP = getHPValue(lossHP, maxHP);

                    if (lossHP > 0) {
                        //clearTimeout(repeat);
                    }

                    enemy.innerText = enemyHP;
                    enemyUnit.className = 'block_unit ' + getHPState(enemyHP, maxHP) + getEnemyCursedState(enemyUnit);

                    if (attackValue > 0) getStatus['damaging'](enemyUnit);

                    getStatus['attacking'](armyUnit);

                    //console.log(armyUnit.getAttribute('name') + ' is attack for '+attackValue+ ' damage');
                    let attackLog = document.createElement('p');
                    attackLog.className = unitSide === 'player' ? 'text_warn' : 'text_danger';
                    attackLog.innerHTML = unitName + ' is attack for '+attackValue+ ' damage';

                    mainLogsContent.append(attackLog);

                    scrollToBottom(mainLogs);


                    if( enemyHP === 'died') {
                        let deathLog = document.createElement('p');
                        deathLog.innerHTML = enemyName + ' is defeated!';
                        mainLogsContent.append(deathLog);
                        scrollToBottom(mainLogs);
                    }
                }
            }, speed);


        }
    }

    function scrollToBottom(el) {

            el.scrollTop = el.scrollHeight;

    }

    function getUnits(type) {
        return document.querySelector('.main_block.'+type).querySelector('.block_line.army').querySelectorAll('.block_unit');
    }

    let getStatus = {
        attacking: function(block) {
            //block = block.querySelector('.unit_avatar');
            //block.style.transform = "rotate(45deg)";
            block.classList.add('attacking');
            setTimeout(() => {
                //block.style.transform = "";
                block.classList.remove('attacking');
            }, 1000);
        },

        healed: function(block) {
            block.classList.add('healed');
            setTimeout(() => {
                block.classList.remove('healed');
            }, 500);
        },

        ticking: function(block) {
            block.classList.add('ticking');
            setTimeout(() => {
                block.classList.remove('ticking');
            }, 500);
        },

        damaging: function(block) {
            block.classList.add('damaging');
            setTimeout(() => {
                block.classList.remove('damaging');
            }, 500);
        },

        magic: function(block) {
            block.classList.add('magic');
            setTimeout(() => {
                block.classList.remove('magic');
            }, 500);
        },



        resisted: function(block) {
            block.classList.add('resisted');
            setTimeout(() => {
                block.classList.remove('resisted');
            }, 500);
        },
    }

    function panelItems(items, block) {
        items.map(data => {
            let item = document.createElement('div');
            item.className = 'panel_item active';
            item.addEventListener('click', () => applySpell(data, item));

            let title = document.createElement('div');
            title.className = 'panel_title';
            title.innerHTML = '<p>' + data[1] + '</p>';

            item.append(title);
            block.append(item);
        });
    }


    function applySpell(spell, block, type) {
        let spellName = spell[1];

        if(block.classList.contains('active')) {
            //alert('Casting spell: ' + spellName);
            spellBook[spell[0]](spell, block);
        } else {
            alert('Spell ' +spellName+ ' isn\'t ready yet');
        }
    }

    let spellBook = {
        healUnits: function(data, panel, type) {
            unitSpells(data, panel, type);
        },
        damageUnits: function(data, panel, type) {
            unitSpells(data, panel, type);
        },
        resurrectUnits: function(data, panel, type) {
            unitSpells(data, panel, type);
        },
        curseUnits: function(data, panel, type) {
            curseUnits(data, panel, type);
        }
    }

    function curseUnits(data, panel) {
        let spellName = data[1];
        let spellValue = data[2];
        let type = data[3];
        let army = document.querySelector('.main_block.'+type).querySelector('.block_line.army');
        let lines = army.querySelectorAll('.block_unit');
        let deadUnits = army.querySelectorAll('.block_unit.death');

        if(data[0] === 'curseUnits' && deadUnits.length === lines.length) return alert('All units are already dead');

        for(let line of lines) {
            let value = parseInt(spellValue);

            if (typeof spellValue === 'string') {
                let arr = spellValue.split('-');
                value = getRandomArbitrary(parseInt(arr[0]), parseInt(arr[1]));
            }

            let unit = line.querySelector('.unit_hp p');
            let unitText = unit.innerText;

            let unitHP = unitText;

            if (data[0] === 'curseUnits' && unitText !== 'died') {

                if (checkCurseResist(line)) {
                    getStatus['resisted'](line);

                } else {

                    let maxHP = line.getAttribute('side') === 'player' ? player.maxHP() : dragon.maxHP();
                    let lossHP = parseInt(unit.innerText) - value;

                    // Dot
                    setTimeout(function run() {
                        let buffTime = getCurseBuff(line);

                        unitHP = getHPValue(lossHP, maxHP);
                        unit.innerText = unitHP;
                        line.className = 'block_unit ' + getHPState(lossHP, maxHP) + getPlayerCursedState(line);

                        if (buffTime > 1 && unit.innerText !== 'died') {
                            line.setAttribute('curse_time', buffTime - 1);
                            setTimeout(run, 1000);
                            getStatus['ticking'](line);
                        } else {
                            line.classList.remove('cursed');
                            line.removeAttribute('curse_time');
                        }
                    }, 1000);

                    line.setAttribute('curse_time', 5);
                    line.className = 'block_unit ' + getHPState(lossHP, maxHP) + getPlayerCursedState(line);
                }
            }
        }

        setTimeout(() => {
            removeCoolDown(panel);
        }, 10000);

        panel.className = 'panel_item';
    }

    function removeCoolDown(panel) {
        panel.classList.add('active');
    }

    function checkCurseResist(block) {
        let attr = parseInt(block.getAttribute('resist'));
        return attr !== undefined ? Math.random() < attr / 100 : false;
    }

    function getEnemyCursedState(block) {
        return getCurseBuff(block) > 0 && block.querySelector('p').innerText !== 'died' ? ' cursed' : '';
    }

    function getPlayerCursedState(block) {
        return getCurseBuff(block) > 0 && block.querySelector('p').innerText !== 'died' ? ' cursed' : '';
    }

    function getCurseBuff(block) {
        let attr = block.getAttribute('curse_time');

        if (attr !== undefined && attr !== null) {
            return parseInt(block.getAttribute('curse_time'));
        } else {
            return 0;
        }
    }

    function unitSpells(data, panel) {
        let spellName = data[1];
        let spellValue = data[2];
        let type = data[3];
        let army = document.querySelector('.main_block.'+type).querySelector('.block_line.army');
        let lines = army.querySelectorAll('.block_unit');
        let deadUnits = army.querySelectorAll('.block_unit.death');
        let fullHPUnits = army.querySelectorAll('.block_unit.fine');

        if((data[0] === 'resurrectUnits') && deadUnits.length === 0) return alert('No one to resurrect');
        if(data[0] === 'healUnits' && (fullHPUnits.length === lines.length || deadUnits.length === lines.length)) return alert('No one to heal');
        if(data[0] === 'damageUnits' && deadUnits.length === lines.length) return alert('All units are already dead');

        for(let line of lines) {
            let value = parseInt(spellValue);

            if (typeof spellValue === 'string') {
                let arr = spellValue.split('-');
                value = getRandomArbitrary(parseInt(arr[0]), parseInt(arr[1]));
            }

            let unit = line.querySelector('.unit_hp_value p');
            let unitText = unit.innerText;
            let unitName = line.getAttribute('name');

            let unitHP = unitText;

            let maxHP = line.getAttribute('side') === 'player' ? player.maxHP() : dragon.maxHP();
            let newHP = value;
            let currHP = parseInt(unitText);

            let spellLog = document.createElement('p');

            if (data[0] === 'healUnits' && unitText !== 'died') {
                newHP = parseInt(unitText) + value;
                unitHP = getHPValue(newHP, maxHP);

                spellLog.className = 'text_success';
                spellLog.innerHTML = unitName + ' is healed by '+value;
            }

            if (data[0] === 'damageUnits' && unitText !== 'died') {
                newHP = parseInt(unitText) - value;
                unitHP = getHPValue(newHP, maxHP);

                spellLog.className = 'text_special';
                spellLog.innerHTML = 'You are deal '+value + ' damage';
            }

            if (data[0] === 'resurrectUnits' && unitText === 'died') {
                unitHP = getHPValue(value, maxHP);
                //startAutoAttack();

                spellLog.className = 'text_success';
                spellLog.innerHTML = unitName + ' was resurrected!';
            }

            unit.innerText = unitHP;

            if ((data[0] === 'resurrectUnits' && unitText === 'died') || (data[0] === 'healUnits' && unitText !== 'died') && currHP < maxHP) {
                line.className = 'block_unit '+ getHPState(newHP, maxHP) + getPlayerCursedState(line);
                getStatus['healed'](line);
                mainLogsContent.append(spellLog);
                scrollToBottom(mainLogs);
            }


            if (data[0] === 'damageUnits' && unitText !== 'died')  {
                line.className = 'block_unit '+ getHPState(newHP, maxHP) + getPlayerCursedState(line);
                getStatus['magic'](line);
                mainLogsContent.append(spellLog);
                scrollToBottom(mainLogs);
            }
        }

        panel.className = 'panel_item';

        setTimeout(() => {
            removeCoolDown(panel);
        }, 10000);
    }

    function getEnemyInfo() {
        let enemyPanel = document.createElement('div');
        enemyPanel.className = 'main_panel enemy';

        //getUserInfo(enemyPanel, 'Enemy lvl 10', 20);

        let enemySpells = document.createElement('div');
        enemySpells.className = 'panel_skills';
        enemyPanel.append(enemySpells);

        panelItems([
            ['healUnits', 'Heal', '20-50', 'enemy'],
            ['curseUnits', 'Curse', '5-10', 'player'],
            ['damageUnits', 'Damage', '10-50', 'player'],
            ['resurrectUnits', 'Resurrection', 50, 'enemy'],
        ], enemySpells);

        //document.getElementById('main').prepend(enemyPanel);
    }

    function getPlayerInfo(block) {
        let playerPanel = document.createElement('div');
        playerPanel.className = 'main_panel player';

        let playerSpells = document.createElement('div');
        playerSpells.className = 'panel_skills';
        playerPanel.append(playerSpells);

        panelItems(spellBookList.spells(), playerSpells);

        block.append(playerPanel);
    }

    function getUserInfo(name, mana) {
        let playerInfo = document.createElement('div');
        playerInfo.className = 'main_hero';

        let heroName = document.createElement('div');
        heroName.className = 'hero_name';
        heroName.innerHTML = '<p>' + name + '</p>';
        playerInfo.append(heroName);

        let heroMana = document.createElement('div');
        heroMana.className = 'hero_mana';
        heroMana.innerHTML = '<p>Mana: <span>' + mana + '</span>/' + mana + '</p>';
        playerInfo.append(heroMana);

        document.getElementById('content').append(playerInfo);

        getPlayerInfo(playerInfo);
    }

    function getPercentage(num, max) {
        return 100 * num / max;
    }


    function getHPState (num, max) {
        num = parseInt(num);

        if (num >= max) {
            return 'fine';
        } else if (num < max && getPercentage(num, max) > 50) {
            return 'hurt';
        } else if(getPercentage(num, max) <= 50 && getPercentage(num, max) > 20) {
            return 'caution';
        } else if(getPercentage(num, max) <= 20  && getPercentage(num, max) > 0) {
            return 'danger';
        } else {
            return 'death';
        }
    }

    function getHPValue (num, max) {
        num = parseInt(num);

        if(num > max) {
            return max + '/' + max;
        }

        return num > 0 ? num + '/' + max : 'died';
    }

    function getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }


    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function setCookie(name, value, options = {}) {

        options = {
            path: '/',
            ...options
        };

        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }

        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    }
};