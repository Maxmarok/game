<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Epic Adventure</title>
    <link href="favicon.png?v=2" rel="icon" />
    <link rel="shortcut icon" href="favicon.png" type="image/png">
    <link href="style.css?v=<?=rand();?>12222231222123" type="text/css" rel="stylesheet" />
    <script type="text/javascript" src="script.js?v=<?=rand();?>22m333323522"></script>
</head>
<body>
    <div class="main" id="main">

        <div class="main_block player">
            <div class="main_army player">
                <div class="block_line army">
                    <div class="block_unit fine" resist="100" attack="10-50" armor="50">
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

                    <div class="block_unit fine" resist="20" attack="10-50" armor="50">
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
                </div>
            </div>
        </div>

        <div class="main_block enemy">


            <div class="main_army">
                <div class="block_line army">
                    <div class="block_unit fine" resist="20" attack="10-50" armor="50">
                        <div class="unit_description">
                            <p>Warrior</p>
                        </div>

                        <div class="unit_avatar" style="background-image:url('img/warrior.svg'); background-position: 13px;"></div>

                        <div class="unit_hp">
                            <div class="unit_hp_value">
                                <p>100/100</p>
                            </div>
                            <div class="unit_hp_bar">
                                <div class="unit_hp_bar_fill"></div>
                            </div>
                        </div>
                    </div>

                    <div class="block_unit fine" resist="20" attack="10-50" armor="50">
                        <div class="unit_description">
                            <p>Warrior</p>
                        </div>

                        <div class="unit_avatar" style="background-image:url('img/warrior.svg'); background-position: 13px;"></div>


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
</body>
</html>