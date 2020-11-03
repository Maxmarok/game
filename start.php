<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Epic Adventure</title>
    <link href="favicon.png?v=2" rel="icon" />
    <link rel="shortcut icon" href="favicon.png" type="image/png">
    <link href="app.css?v=<?=rand();?>323233" type="text/css" rel="stylesheet" />
    <script type="text/javascript" src="app.js?v=<?=rand();?>22m2332333323522"></script>
</head>
<body>
    <div class="main" id="main">
        <div class="main_content" id="content">
            <div class="main_blocks" id="main_blocks">
                <div class="main_block enemy">
                    <div class="main_army">
                        <div class="block_line army">
                            <div class="block_unit fine" name="Dragon" resist="50" attack="20-50" armor="100" speed="3000" side="enemy">
                                <div class="unit_description">
                                    <p>Dragon</p>
                                </div>

                                <div class="unit_avatar" style="background-image:url('img/dragon.svg'); background-position: center;"></div>

                                <div class="unit_hp">
                                    <div class="unit_hp_value">
                                        <p>1000/1000</p>
                                    </div>
                                    <div class="unit_hp_bar">
                                        <div class="unit_hp_bar_fill"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main_block player">
                    <div class="main_army player">
                        <div class="block_line army">
                            <div class="block_unit fine" name="Knight" resist="20" attack="10-20" armor="70" speed="1200" side="player">
                                <div class="unit_description">
                                    <p>Knight</p>
                                </div>

                                <div class="unit_avatar" style="background-image:url('img/knight.svg'); background-position: 20px;"></div>


                                <div class="unit_hp">
                                    <div class="unit_hp_value">
                                        <p>100/100</p>
                                    </div>
                                    <div class="unit_hp_bar">
                                        <div class="unit_hp_bar_fill"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="block_unit fine" name="Warrior" resist="20" attack="5-10" armor="70" speed="1600" side="player">
                                <div class="unit_description">
                                    <p>Warrior</p>
                                </div>

                                <div class="unit_avatar" style="background-image:url('img/warrior.svg'); background-position: 12px;"></div>

                                <div class="unit_hp">
                                    <div class="unit_hp_value">
                                        <p>100/100</p>
                                    </div>
                                    <div class="unit_hp_bar">
                                        <div class="unit_hp_bar_fill"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>