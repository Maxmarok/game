window.onload = function(){
    let playerPanel = document.createElement('div');
    playerPanel.className = 'main_panel player';

    getUserInfo(playerPanel, 'Player lvl 9', 100);

    panelItems([
        ['healUnits', 'Heal', '20-50', 'player'],
        ['curseUnits', 'Curse', '5-10', 'enemy'],
        ['damageUnits', 'Damage', '10-50', 'enemy'],
        ['resurrectUnits', 'Resurrection', 50, 'player'],
    ], playerPanel);

    document.getElementById('main').prepend(playerPanel);

    let enemyPanel = document.createElement('div');
    enemyPanel.className = 'main_panel enemy';

    getUserInfo(enemyPanel, 'Enemy lvl 10', 20);

    panelItems([
        ['healUnits', 'Heal', '20-50', 'enemy'],
        ['curseUnits', 'Curse', '5-10', 'player'],
        ['damageUnits', 'Damage', '10-50', 'player'],
        ['resurrectUnits', 'Resurrection', 50, 'enemy'],
    ], enemyPanel);

    document.getElementById('main').append(enemyPanel);

    startAutoAttack();

    function startAutoAttack() {
        let armyUnits = getUnits('player');
        let enemyUnits = getUnits('enemy');

        for(let [unitPos, armyUnit] of armyUnits.entries()) {
            let attack = armyUnit.getAttribute('attack');
            let enemyUnit = enemyUnits[unitPos];
            let enemy = enemyUnit.querySelector('.unit_hp p');
            let deadEnemyUnits = document.querySelector('.main_block.enemy').querySelector('.block_line.army').getElementsByClassName('death');
            let enemyArmor = enemyUnit.getAttribute('armor');

            let start = setTimeout(function autoAttack() {
                if(deadEnemyUnits.length === enemyUnits.length) {
                    clearTimeout(start);
                } else {
                    setTimeout(autoAttack, 3000);
                }

                if (enemy.innerText !== 'died' && armyUnit.querySelector('.unit_hp p').innerText !== 'died' && getCurseBuff(armyUnit) === 0) {

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
                        enemyUnits[unitPos].setAttribute('armor', enemyArmor);
                    }

                    let enemyHP = getHPValue(parseInt(enemy.innerText) - attackValue);

                    if (parseInt(enemy.innerText) - attackValue <= 0 )  {
                        clearTimeout(start);
                    }

                    enemy.innerText = enemyHP;
                    enemyUnits[unitPos].className = 'block_unit '+ getHPState(enemyHP) + getEnemyCursedState(enemyUnits[unitPos]);

                    if (attackValue > 0) getStatus['damaging'](enemyUnit);

                    getStatus['attacking'](armyUnit);
                }
            }, 1000);
        }
    }

    function getUnits(type) {
        return document.querySelector('.main_block.'+type).querySelector('.block_line.army').querySelectorAll('.block_unit');
    }

    let getStatus = {
        attacking: function(block) {
            block = block.querySelector('.unit_avatar');
            block.style.transform = "rotate(45deg)";
            setTimeout(() => {
                block.style.transform = "";
            }, 500);
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

                    // Dot
                    setTimeout(function run() {
                        let buffTime = getCurseBuff(line);

                        unitHP = getHPValue(parseInt(unit.innerText) - value);
                        unit.innerText = unitHP;
                        line.className = 'block_unit ' + getHPState(unitHP) + getPlayerCursedState(line);

                        if (buffTime > 1 && unit.innerText !== 'died') {
                            line.setAttribute('curse_time', buffTime - 1);
                            setTimeout(run, 1000);
                            getStatus['ticking'](line);
                        } else {
                            line.classList.remove('cursed');
                            line.removeAttribute('curse_time');
                            removeCoolDown(panel);
                        }
                    }, 1000);

                    line.setAttribute('curse_time', 5);
                    line.className = 'block_unit ' + getHPState(unitHP) + getPlayerCursedState(line);
                }
            }
        }

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

            let unit = line.querySelector('.unit_hp p');
            let unitText = unit.innerText;

            let unitHP = unitText;

            if (data[0] === 'healUnits' && unitText !== 'died') {
                unitHP = getHPValue(parseInt(unitText) + value);
            }

            if (data[0] === 'damageUnits' && unitText !== 'died') {
                unitHP = getHPValue(parseInt(unitText) - value);
            }

            if (data[0] === 'resurrectUnits' && unitText === 'died') {
                unitHP = getHPValue(value);
                //startAutoAttack();
            }

            unit.innerText = unitHP;
            line.className = 'block_unit '+ getHPState(unitHP) + getPlayerCursedState(line);

            if ((data[0] === 'resurrectUnits' && unitText === 'died') || (data[0] === 'healUnits' && unitText !== 'died'))
                getStatus['healed'](line);

            if (data[0] === 'damageUnits' && unitText !== 'died') getStatus['damaging'](line);
        }

        panel.className = 'panel_item';

        setTimeout(() => {
            panel.classList.add('active');
        }, 5000);
    }

    function getUserInfo(panel, name, mana) {
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

        panel.prepend(playerInfo);
    }


    function getHPState (num) {
        num = parseInt(num);

        if (num === 100) {
            return 'fine';
        } else if (num < 100 && num > 50) {
            return 'hurt';
        } else if(num <= 50 && num > 20) {
            return 'caution';
        } else if(num <= 20 && num > 0) {
            return 'danger';
        } else {
            return 'death';
        }
    }

    function getHPValue (num) {
        num = parseInt(num);

        if (num >= 100) {
            return 100 + '/100';
        } else if(num < 100 && num > 0) {
            return num + '/100';
        } else {
            return 'died';
        }
    }

    function getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
};