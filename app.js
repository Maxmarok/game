window.onload = function(){

    class Player {
        constructor() {
            this.state = {
                name: 'Манашторм',
                level: 2,

                MP: 200,
                maxMP: 200,

                HP: 100,
                maxHP: 100,
                MP5: 10,
            };
        }

        name() {
            return this.state.name;
        }

        title() {
            return this.state.name  + ' ' + this.state.level + ' ур.';
        }

        currMP() {
            return this.state.MP;
        }

        maxMP() {
            return this.state.maxMP;
        }

        HP() {
            return this.state.hp;
        }

        maxHP() {
            return this.state.maxHP;
        }

        regenMP() {
            return this.state.MP5;
        }
    }

    class Dragon {
        constructor() {
            this.state = {
                name: 'Дракон',
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
                    {
                        name: 'healUnits',
                        title: 'Лечение',
                        level: 1,
                        value: '20-50',
                        castOn: 'player',
                        manaCost: 10,
                        castTime: 2000,
                        coolDown: 5000,
                    },

                    {
                        name: 'curseUnits',
                        title: 'Заморозка.',
                        level: 2,
                        value: '5-10',
                        castOn: 'enemy',
                        manaCost: 20,
                        castTime: 1000,
                        coolDown: 10000,
                        duration: 5000,
                    },

                    {
                        name: 'damageUnits',
                        title: 'Метеор',
                        level: 1,
                        value: '10-30',
                        castOn: 'enemy',
                        manaCost: 10,
                        castTime: 2000,
                        coolDown: 5000,
                    },
                ]
            }
        }

        spells() {
            return this.state.list;
        }
    }

    let playerSpells = new SpellBook;
    let dragon = new Dragon;
    let player = new Player;

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

    getUserInfo(player);

    let playerCurrMP = document.querySelector('.hero_mana span');

    setTimeout(() => {
        mainBanner.classList.remove('ready')
        mainBanner.classList.add('go');
        mainBannerText.innerText = 'Сражение началось!';

        document.getElementById('main').classList.add('fight');

        initiateAutoAttack('player', 'enemy');
        initiateAutoAttack('enemy', 'player');
    }, 1000);

    function regenMP() {
        setTimeout(() => {
            let newMP = player.currMP() + player.regenMP();
            let maxMP = player.maxMP();

            newMP = newMP > maxMP ? maxMP : newMP;
            playerCurrMP.innerText = newMP > maxMP ? maxMP : newMP;
            player.state.MP = newMP;

            if(player.currMP() < player.maxMP()) {
                setTimeout(() => { regenMP()}, 5000);
            }
        }, 5000);
    }


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
                    getHPState(enemyUnit, enemyHP, maxHP);

                    if (attackValue > 0) getStatus['damaging'](enemyUnit);
                    getStatus['attacking'](armyUnit);

                    //console.log(armyUnit.getAttribute('name') + ' is attack for '+attackValue+ ' damage');
                    let notification = document.createElement('p');
                    notification.className = unitSide === 'player' ? 'text_warn' : 'text_danger';
                    notification.classList.add('notification');
                    notification.innerHTML = enemyHP === 'died' ? 'Cмерть' :  '-'+attackValue;

                    enemyUnit.append(notification);
                    setNotification(notification);
                }
            }, speed);
        }
    }

    function setNotification(block) {
        let randomEnd = getRandomArbitrary(-30,60)+'px';
        let randomStart = getRandomArbitrary(0,60)+'px';

        block.animate([
            { transform: 'translate('+randomStart+', -10px) scale(2)', opacity: '1' },
            { transform: 'translate('+randomEnd+', -50px) scale(1)', opacity: '.5' }
        ], {
            duration: 2000
        });

        setTimeout(() => {
            block.remove();
        }, 2000);
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

    function getSpellTitle(title, level) {
        return title + ' ' + level + ' ур.';
    }

    function panelItems(items, block) {

        items.map(data => {

            let spellInfo = data;

            let item = document.createElement('div');
            item.className = 'panel_item active ' + spellInfo.name;
            item.addEventListener('click', () => applySpell(spellInfo, item));

            let title = document.createElement('div');
            title.className = 'panel_title';
            title.innerHTML = '<p>' + getSpellTitle(spellInfo.title, spellInfo.level) + '</p>';

            let desc = document.createElement('div');
            desc.className = 'panel_description';

            let cost = document.createElement('div');
            cost.className = 'panel_hint cost';
            cost.innerHTML = '<p class="text_mana">' + spellInfo.manaCost + ' М</p>';

            let time = document.createElement('div');
            time.className = 'panel_hint time';
            time.innerHTML = '<p>' + spellInfo.castTime / 1000 + 's</p>';

            let coolDown = document.createElement('div');
            coolDown.className = 'panel_hint cooldown';
            coolDown.innerHTML = '<p>' + spellInfo.coolDown / 1000 + 's</p>';

            desc.append(cost);
            desc.append(time);
            desc.append(coolDown);

            item.append(title);
            item.append(desc);
            block.append(item);
        });
    }


    function applySpell(spell, block, type) {
        let spellName = spell.name;
        let castBar = document.querySelector('.panel_cast_bar');

        if(block.classList.contains('active')) {
            if(castBar.classList.contains('active')) {
                console.log('cd');
            } else {
                startPlayerCast(spell, block);
            }
        } else {
            alert('Spell ' +spell.title+ ' isn\'t ready yet');
        }
    }

    function startPlayerCast(spell, panel) {
        let castBar = document.querySelector('.panel_cast_bar');
        castBar.classList.add('active');

        setTimeout(() => {
            panel.classList.remove('active'); //set coolDown
            castBar.classList.remove('active');
            spellBook[spell.name](spell, panel); //apply spell
        }, spell.castTime);
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
            unitSpells(data, panel, type);
        }
    }

    function refreshPlayerMP(mp, cost) {
        let newMP = parseInt(mp) - parseInt(cost);
        playerCurrMP.innerText = newMP;
        player.state.MP = newMP;
        if(player.currMP() < player.maxMP()) regenMP();
    }

    function removeCoolDown(panel, cooldown) {
        setTimeout(() => {
            panel.classList.add('splash');
            setTimeout(() => {
                panel.classList.remove('splash');
            }, 500);
            panel.classList.add('active');
        }, cooldown)
    }

    function checkCurseResist(block) {
        let attr = parseInt(block.getAttribute('resist'));
        return attr !== undefined ? Math.random() < attr / 100 : false;
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
        let spellName = data.name;
        let spellValue = data.value;
        let spellCoolDown = data.coolDown;
        let type = data.castOn;
        let army = document.querySelector('.main_block.'+type).querySelector('.block_line.army');
        let lines = army.querySelectorAll('.block_unit');
        let deadUnits = army.querySelectorAll('.block_unit.death');
        let fullHPUnits = army.querySelectorAll('.block_unit.fine');
        let spellCost = data.manaCost;
        let playerMP = player.currMP();

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

            let notification = document.createElement('p');
            notification.className = type === 'player' ? 'text_success' : 'text_special';
            notification.classList.add('notification');


            if (spellName === 'healUnits' && unitText !== 'died') {
                newHP = parseInt(unitText) + value;
                if(!line.classList.contains('fine')) {
                    unitHP = getHPValue(newHP, maxHP);
                    getStatus['healed'](line);

                    notification.innerHTML = '+'+value;

                }
            }

            if (spellName === 'damageUnits' && unitText !== 'died') {
                newHP = parseInt(unitText) - value;
                unitHP = getHPValue(newHP, maxHP);
                getStatus['magic'](line);

                notification.innerHTML = '-'+value;
            }

            if (spellName === 'resurrectUnits' && unitText === 'died') {
                unitHP = getHPValue(value, maxHP);
                //startAutoAttack();

                notification.innerHTML = 'Воскрешен!';
            }

            if (spellName === 'curseUnits' && unitText !== 'died') {

                if (checkCurseResist(line)) {
                    getStatus['resisted'](line);

                } else {

                    let maxHP = line.getAttribute('side') === 'player' ? player.maxHP() : dragon.maxHP();

                    // Dot
                    setTimeout(function run() {
                        newHP = parseInt(unit.innerText) - value;
                        let buffTime = getCurseBuff(line);

                        line.classList.add('cursed');

                        if (buffTime > 1 && unit.innerText !== 'died') {
                            line.setAttribute('curse_time', buffTime - 1);
                            setTimeout(run, 1000);
                            getStatus['ticking'](line);

                            let notification = document.createElement('p');
                            notification.className = 'text_mana';
                            notification.classList.add('notification');
                            notification.innerHTML = unitHP === 'died' ? 'Cмерть' :  '-'+value;

                            line.append(notification);
                            setNotification(notification);
                        } else {
                            line.classList.remove('cursed');
                            line.removeAttribute('curse_time');
                        }
                    });

                    let notification = document.createElement('p');
                    notification.className = 'text_mana';
                    notification.classList.add('notification');
                    notification.innerHTML = 'Заморожен!';

                    line.append(notification);
                    setNotification(notification);

                    line.setAttribute('curse_time', 5);

                }
            }

            unit.innerText = unitHP;

            if (unitText !== 'died')  {
                getHPState(line, newHP, maxHP);

                line.append(notification);
                setNotification(notification);
            }
        }

        removeCoolDown(panel, spellCoolDown);
        refreshPlayerMP(playerMP, spellCost);

        //panel.className = 'panel_item';
        //startPlayerCast(data, panel);
    }

    function getPlayerInfo(block) {
        let playerPanel = document.createElement('div');
        playerPanel.className = 'main_panel player';

        let playerPanelSpells = document.createElement('div');
        playerPanelSpells.className = 'panel_skills';
        playerPanel.append(playerPanelSpells);

        // console.log(playerSpells.spells()[0]);

        panelItems(playerSpells.spells(), playerPanelSpells);

        block.append(playerPanel);

        let playerCastBar = document.createElement('div');
        playerCastBar.className = 'panel_cast_bar';

        let playerCastBarContainer =  document.createElement('div');
        playerCastBarContainer.className = 'panel_cast_container';
        playerCastBarContainer.innerHTML = '<p><span>0.3</span> / 2.0</p>';

        let playerCastBarProgress =  document.createElement('div');
        playerCastBarProgress.className = 'panel_cast_transparent';

        playerCastBarContainer.prepend(playerCastBarProgress);
        playerCastBar.append(playerCastBarContainer);
        playerPanel.append(playerCastBar);
    }

    function getUserInfo(player) {
        let playerInfo = document.createElement('div');
        playerInfo.className = 'main_hero';

        let heroName = document.createElement('div');
        heroName.className = 'hero_name';
        heroName.innerHTML = '<p>' + player.title() + '</p>';
        playerInfo.append(heroName);

        let heroMana = document.createElement('div');
        heroMana.className = 'hero_mana';
        heroMana.innerHTML = '<p>Мана: <span>' + player.currMP() + '</span>/' + player.maxMP() + '</p>';
        playerInfo.append(heroMana);

        document.getElementById('content').append(playerInfo);

        getPlayerInfo(playerInfo);
    }

    function getPercentage(num, max) {
        return 100 * num / max;
    }


    function getHPState (block, num, max) {
        num = parseInt(num);
        let newState = 'death';

        if (num >= max) {
            newState =  'fine';
        } else if (num < max && getPercentage(num, max) > 50) {
            newState = 'hurt';
        } else if(getPercentage(num, max) <= 50 && getPercentage(num, max) > 20) {
            newState = 'caution';
        } else if(getPercentage(num, max) <= 20  && getPercentage(num, max) > 0) {
            newState = 'danger';
        }

        block.classList.remove('fine', 'hurt', 'caution', 'danger', 'death');
        block.classList.add(newState);
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