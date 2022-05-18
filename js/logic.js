import * as Player from '../js/player.js';
import * as Functions from '../js/functions.js';
import * as SpecialCoins from '../js/coins.js';
import * as Characters from './shop/characters.js';
import * as Backgrounds from './shop/backgrounds.js';
import * as DarpellaCharacters from './shop/darpella/characters.js';
import * as DarpellaBackgrounds from './shop/darpella/backgrounds.js';
import * as VirtualStore from './shop/virtualstore.js';

import * as Announcement from '../data/announcement.js';
import * as Placement from '../data/a-placement.js';
import * as HiT from '../data/ht.js';
import * as LoT from '../data/lt.js';
import * as Ref from '../data/ref/ref.js';
import * as RefT from '../data/ref/ref_t.js';
import * as GiveAway from '../data/giveaway.js';

// Constants
const OBSTACLES = 200;
const OBSTACLES_MAX_Y = 5000;
const TIME = 130;
const SPEED_INCREASE = 12;
const COIN_ABUNDANCE = 0.5;
const SHIELD_ABUNDANCE = 0.1;
const POUCH_ABUNDANCE = 0.1;
const HEART_PRICE = 30;
const SHIELD_DAMAGE = 20;

var DEMO = false;
var demo_coin_limit = 30;

// Variables
var PlayerCharacter = $(".player-character");
var Home = $(".home");
var CoinsText = $(".coins > .small-display-text");
var GameDetails = $(".game-details");
var SliderContainer = $(".slidercontainer");
var Obstacles = $(".obstacles");

var CharactersList = Characters.list.slice();
var BackgroundsList = Backgrounds.list.slice();
var CharactersListDarpella = DarpellaCharacters.list.slice();
var BackgroundsListDarpella = DarpellaBackgrounds.list.slice();

// var AllCharacters = $.merge( CharactersList, CharactersListDarpella );

// Initializations

var GameLoopInterval;
var CheckCollisionInterval;
var CounterCoinsInterval;
var ShieldCounterInterval;
var CheckMusicInterval;
var CheckSFXInterval;

var counterCheckSounds = 0;

var HighestVelocity = 0;
var SpeedIncrease = 0;

var WindowHeight = window.innerHeight;
var WindowWidth = window.innerWidth;

var Paused = false;
var shieldActive = false;
var shieldCounter = 10;

var coins_to_continue = 0;

var last_game_started = 0;

var sfx_on = false;
var music_first_time = true;
var sfx_first_time = true;

var shield_damaged = false;



$(document).ready(function(){

    var href = window.location.href;
    var url = href.split("?");
    if(url[1] == "mode=standalone"){
        DEMO = false;
    }else{
        DEMO = true;
        ActivateDemo();
    }

    $(".demo-message-header").click(function(){
        if( $(".demo-message-body").hasClass("demo-message-hide")){
            $(".demo-message-body").removeClass("demo-message-hide");
            $(".demo-message-header-icon").removeClass("rotate-close-icon");
        }else{
            $(".demo-message-body").addClass("demo-message-hide");
            $(".demo-message-header-icon").addClass("rotate-close-icon");
        }
    });

    HandleLocalStorage();
    ShowAnnouncement();
   
    CheckConnectivity();
    setInterval(CheckConnectivity,10000);

    FillShop();
    ActivateItems();
    FillHearts();

    AddPlacement();

    FillVirtualStore();

    let version_release = "droply 1.4.4";
    $(".version-release").text(version_release);

    $(".music").click(function(){
        HandleMusic($(this));
    });


    $(".sfx").click(function(){
        HandleSFX($(this));
    });





    $(".start").click(function(){
        StartGame();
    });

    $(".ga-continue-game").click(function(){
        Player.RemoveHearts(1);

        ContinueOrRestartGame();
    });

    $(".ga-restart-game").click(function(){
        Player.ResetWallet();
        Player.ResetHearts();

        ContinueOrRestartGame();
    });

    Home.click(function(){
        Paused = true;
        ClearObstacles();
        ClearLoop();
        SpeedIncrease = 0;

        Home.addClass("display-none");

        $(".settings").removeClass("display-none");

        GameDetails.removeClass("slide-down");
        SliderContainer.removeClass("slider-slide-up");
    
        document.getElementById("Slider").value = 50;

        PlayerCharacter.css({
            "left": "50%",
            "transform": "translateX(-50%)"
        });

    });


    $(".button-shop").click(function(){
        $(".shop-window").addClass("show-shop-window");
        let player_name = Player.GetName();
        $(".player-name").text(player_name);
        $(".shop-player-stats").removeClass("display-none");
        FillShop();
        ActivateItems();
        FillShopHearts();
        FillCoinsShop();
    });

    $(".shop-window-close").click(function(){
        $(".shop-window").removeClass("show-shop-window");
        $(".shop-player-stats").addClass("display-none");
    });




    $(".settings").click(function(){
        $(".settings-window").addClass("show-shop-window");
        let player_name = Player.GetName();
        $(".settings-name-change-input").val(player_name);
        $(".unique-id-number").text(Player.player["id"]);
    });

    $(".settings-close").click(function(){
        $(".settings-window").removeClass("show-shop-window");
    });

    $(".update-name").click(function(){
        let oldname = Player.GetName();
        let newname = $(".settings-name-change-input").val().trim();


        if (newname != "") {

            if (newname != oldname) {
                let player_name_health = Functions.CheckTextHealth(newname);
                if (player_name_health) {
                    Player.SetName(newname);
                    $(".settings-window").removeClass("show-shop-window");
                } else {

                }
            }
        }

    });



    $(".settings-clear-data").click(function(){
        $(".alert-modal").removeClass("display-none");
    });

    $(".alert-cta button").click(function(){
        localStorage.clear();
        // localStorage.removeItem("DroplyPlayer");
        $(".alert-modal").addClass("display-none");
        $(".settings-window").removeClass("show-shop-window");
        window.location.reload();
    });

    $(".alert-cta-secondary button").click(function(){
        $(".alert-modal").addClass("display-none");
    });


    $(".buy-hearts-box").click(function(){
        let player_wallet = Player.GetWallet();
        let player_hearts = Player.GetHearts();
        let heart_price = HEART_PRICE;

        if(player_wallet >= heart_price && player_hearts < 3){
            Player.AddHearts(1);
            Player.SubtractCoins(heart_price);
            let player_new_wallet = Player.GetWallet();

            CoinsText.text(player_new_wallet);
            FillHearts();
            FillShopHearts();
            FillCoinsShop();
            CheckSpecialHearts();
            FillShop();
            ActivateItems();
        }
    });

    $(".button-announcements").click(function(){
        $(".announcement-window").addClass("show-shop-window");
        RemoveNewAnnouncementDesign();
    });

    $(".announcement-close").click(function(){
        $(".announcement-window").removeClass("show-shop-window");
    });

    $(".export-my-data").click(function(){
        DownloadData();
    });

    $(document).on('change', '.file-upload-button', function(event) {
        var reader = new FileReader();
      
        reader.onload = function(event) {
            try{
                var jsonObj = JSON.parse(event.target.result);
                Player.player.background = jsonObj.background;
                Player.player.character = jsonObj.character;
                Player.player.wallet = jsonObj.wallet;
                Player.player.hearts = jsonObj.hearts;
                Player.player.purchases = jsonObj.purchases;
                Player.AddToLocalStorage();
                window.location.reload();
            }catch(ex){
                alert("Incorrect File Uploaded.");
            }
          
        }
      
        reader.readAsText(event.target.files[0]);
    });






    // Droply Universe
    $(".droply-universe-characters").on("click",".section-box",function(){
        PurchaseThis($(this), CharactersList, ".droply-universe-characters");
    });

    $(".droply-universe-backgrounds").on("click",".section-box",function(){
        PurchaseThis($(this), BackgroundsList, ".droply-universe-backgrounds");
    });


    //Darpella
    $(".darpella-characters").on("click",".section-box",function(){
        PurchaseThis($(this), CharactersListDarpella, ".darpella-characters");
    });
    $(".darpella-backgrounds").on("click",".section-box",function(){
        PurchaseThis($(this), BackgroundsListDarpella, ".darpella-backgrounds");
    });



});

function ContinueOrRestartGame(){
    SpeedIncrease = 0;
    HighestVelocity = 0;

    FillHearts();
    StartGame();

    let player_coins = Player.GetWallet();
    CoinsText.text(player_coins);
    $(".pause-module").removeClass("pause-module-slide-up");

    Player.NotPausedGame();

    $('.sfx-container audio')[1].pause();
    $('.sfx-container audio')[1].currentTime = 0;
}

function HandleLocalStorage(){

    var LocalStoragePlayer = JSON.parse(localStorage.getItem("DroplyPlayer"));
    if(LocalStoragePlayer == "" || LocalStoragePlayer == undefined || LocalStoragePlayer == null){


        Player.CreatePlayerID();
        localStorage.setItem("DroplyPlayer", JSON.stringify(Player.player));

        CoinsText.text(Player.player["wallet"]);

        AddNewAnnouncement();
        NewAnnouncementDesign();


    }else{

        Player.player["name"] = LocalStoragePlayer["name"];
        Player.player["id"] = LocalStoragePlayer["id"];
        Player.player["character"] = LocalStoragePlayer["character"];
        Player.player["hearts"] = LocalStoragePlayer["hearts"];
        Player.player["background"] = LocalStoragePlayer["background"];
        Player.player["purchases"] = LocalStoragePlayer["purchases"];
        Player.player["wallet"] = LocalStoragePlayer["wallet"];
        Player.player["notifications"] = LocalStoragePlayer["notifications"];
        Player.player["isPausedGame"] = LocalStoragePlayer["isPausedGame"];
        Player.player["isPro"] = LocalStoragePlayer["isPro"];
        Player.player["isHT"] = LocalStoragePlayer["isHT"];
        Player.player["isLT"] = LocalStoragePlayer["isLT"];
        Player.player["awards"] = LocalStoragePlayer["awards"];
        Player.player["level"] = LocalStoragePlayer["level"];

        if(LocalStoragePlayer["diamonds"] == undefined){
            Player.player["diamonds"] = 0;
            localStorage.setItem("DroplyPlayer", JSON.stringify(Player.player));
        } else{
            Player.player["diamonds"] = LocalStoragePlayer["diamonds"]; 
        }

        CoinsText.text(Player.player["wallet"]);
        $(".unique-id-number").text(Player.player["id"]);
        FillHearts();


        let announcements = Announcement.message;

            if (Player.player["notifications"] == undefined) {
                Player.player["notifications"] = [];


                AddNewAnnouncement();
                NewAnnouncementDesign();
                
            }else{

                if(announcements.length > Player.player["notifications"].length){

                    NewAnnouncementDesign();

                    let notificationslength = Player.player["notifications"].length;

                    for(let i=0; i<announcements.length;i++){
                        let found = false;

                        for(let j=0; j<notificationslength; j++){                            
                            if(announcements[i].id == Player.player["notifications"][j]){
                                found = true;
                            }
                        }

                        if(found == false){
                            Player.NotificationChecked(announcements[i].id);
                        }
                    }
                }else{
                    RemoveNewAnnouncementDesign();
                }
            }

        

        ApplyMemberships();
        HandleGiveAways();
        HandleReferrals();

        if(Player.player["isPausedGame"] == true){
            PauseGame();
        }
    }
}

function AddNewAnnouncement(){
    let announcements = Announcement.message;
    for(let i=0; i<announcements.length; i++){
        Player.NotificationChecked(announcements[i].id);
    }
}

function NewAnnouncementDesign(){    
    $(".button-announcements").addClass("make-it-ring");
    $(".button-announcements").addClass("new-announcement");
}

function RemoveNewAnnouncementDesign(){
    $(".button-announcements").removeClass("make-it-ring");
    $(".button-announcements").removeClass("new-announcement");
}

function StartGame(){
    Paused = false;
    GameDetails.addClass("slide-down");
    SliderContainer.addClass("slider-slide-up");

    document.getElementById("Slider").oninput = function() {
        PlayerCharacter.css({
            "left": this.value + "%",
            "transform": "translateX(-" + this.value + "%)"
        });
    }

    Home.removeClass("display-none");
    $(".settings").addClass("display-none");


    NewWave(); 
    GameLoopInterval = setTimeout(Loop, HighestVelocity);


    last_game_started = Date.now();
    CounterCoinsInterval = setTimeout(CounterCoins, 5000);

}

function NewWave(){
    ClearObstacles();
    CreateObstacles();
    FloatObstacles();
    PlayerCharacter.addClass("shield-active");
    CheckCollision();
}


function FillHearts(){
    ClearHearts();
    let player_hearts = Player.GetHearts();
    if(player_hearts == 0){
        $(".hearts").addClass("display-none");
    }else{
        $(".hearts").removeClass("display-none");

        for(let i = 0; i<player_hearts;i++){
            let $heart = $("<span class='small-display-icon'><img src='/assets/icons/heart.svg'></span>");
            $(".hearts").append($heart);
        }
    }
}

function ClearHearts(){
    $(".hearts").empty();
}



function CreateObstacles(){

    let coinchance = Functions.getRandomInteger(0, 3);
    let shieldchance = Functions.getRandomInteger(0, 99);
    let coinpouchchance = Functions.getRandomInteger(0, 99);
    let diamondchance = Functions.getRandomInteger(0, 99); 

    for(let i = 0; i < OBSTACLES; i++){
        let top = Functions.getRandomInteger(WindowHeight, OBSTACLES_MAX_Y);
        let left = Functions.getRandomInteger(40, WindowWidth - 40);

        let coinnumber = OBSTACLES*COIN_ABUNDANCE;
        let shieldnumber = OBSTACLES*SHIELD_ABUNDANCE;
        let pouchnumber = OBSTACLES*POUCH_ABUNDANCE;
        let diamondnumber = OBSTACLES*0.05;

        let total_special_obstacles_number = coinnumber + shieldnumber + pouchnumber + diamondnumber;
        let $obstacle;



        if(i < total_special_obstacles_number){
            if (i < coinnumber) {
                if (coinchance == 0 || coinchance == 1 || coinchance == 2) {
                    $obstacle = $("<div class='obstacle coin' style='top:" + top + "px;left:" + left + "px'></div>");
                }else{
                    $obstacle = $("<div class='obstacle obstacle-rock' style='top:" + top + "px;left:" + left + "px'></div>");
                }
            }else if(i >= coinnumber && i < coinnumber + shieldnumber){
                if(shieldchance <= 29){
                    $obstacle = $("<div class='obstacle shield' style='top:" + top + "px;left:" + left + "px'></div>");
                }else{
                    $obstacle = $("<div class='obstacle obstacle-bomb' style='top:" + top + "px;left:" + left + "px'></div>");
                }
            }else if(i >= coinnumber + shieldnumber && i < coinnumber + shieldnumber + pouchnumber){
                if(coinpouchchance <= 19){
                    $obstacle = $("<div class='obstacle pouch' style='top:" + top + "px;left:" + left + "px'></div>");
                }else{
                    $obstacle = $("<div class='obstacle obstacle-rock' style='top:" + top + "px;left:" + left + "px'></div>");
                }
            }else if(i >= coinnumber + shieldnumber + pouchnumber && i < coinnumber + shieldnumber + pouchnumber + diamondnumber){
                if(diamondchance <= 9){
                    $obstacle = $("<div class='obstacle diamond' style='top:" + top + "px;left:" + left + "px'></div>");
                }else{
                    $obstacle = $("<div class='obstacle obstacle-rock' style='top:" + top + "px;left:" + left + "px'></div>");
                }
            }else{
                $obstacle = $("<div class='obstacle obstacle-rock' style='top:" + top + "px;left:" + left + "px'></div>");
            }
            
        }else{
            let obstaclerandom = Functions.getRandomInteger(0, 2);
            if(obstaclerandom == 0){
                $obstacle = $("<div class='obstacle obstacle-bomb' style='top:" + top + "px;left:" + left + "px'></div>");
            }else{
                $obstacle = $("<div class='obstacle obstacle-rock' style='top:" + top + "px;left:" + left + "px'></div>");
            }
        }

        Obstacles.append($obstacle);
    }
}


function ClearObstacles(){
    Obstacles.empty();
}


function FloatObstacles(){

    let temphighvel = 0;
    let velocity = 0;

    $(".obstacles > .obstacle").each(function(index){
        let thistop = $(this).css("top");

        let thistopint = parseInt(thistop.replace('px',''));

        velocity = thistopint/(TIME+SpeedIncrease);

        let correctedvelocity = (velocity/2)+1;
        if(temphighvel < correctedvelocity){
           temphighvel = correctedvelocity;
        }

        $(this).css({
            '-webkit-transform' : 'translateY(-' + thistopint*2 + 'px)',
            '-moz-transform'    : 'translateY(-' + thistopint*2 + 'px)',
            '-ms-transform'     : 'translateY(-' + thistopint*2 + 'px)',
            '-o-transform'      : 'translateY(-' + thistopint*2 + 'px)',
            'transform'         : 'translateY(-' + thistopint*2 + 'px)'
          });

        $(this).css({"transition":"transform " + velocity + "s linear 0s"});

    });


    HighestVelocity = temphighvel*1000;
    SpeedIncrease += SPEED_INCREASE;


}




function Loop() {
        if(HighestVelocity != 0 && !Paused){
            NewWave();
            
            let velocity = HighestVelocity;

            GameLoopInterval = setTimeout(Loop, velocity);
        }
}

function ClearLoop() {
    clearTimeout(GameLoopInterval);
}



function CheckCollision(){

    var children = $(".obstacles").children();

    if(!Paused){
        CheckCollisionInterval = window.setInterval(function () {

            var PlayerCharacterWidth = PlayerCharacter.width();
            var PlayerCharacterHeight = PlayerCharacter.height();
            var PlayerCharacterX = PlayerCharacter.offset().left;
            var PlayerCharacterY = PlayerCharacter.offset().top;
    
            let PlayerCharacterObject = {
                "x": PlayerCharacterX,
                "y": PlayerCharacterY,
                "width": PlayerCharacterWidth,
                "height": PlayerCharacterHeight
            };
    
    
            for (var i = 0; i < children.length; i++) {
                var currentChild = children.eq(i);

                var ChildTopInt = currentChild.position().top;
                var ChildLeftInt = currentChild.position().left;
    
                var ChildObject = {"x":ChildLeftInt, "y":ChildTopInt, "width":25, "height":25};
    
                let CollisionStatus = Functions.isCollide(PlayerCharacterObject, ChildObject);
    
                if(ChildTopInt <= -10){
                    $(currentChild).remove();
                }

                if(CollisionStatus === true){
    
                    if(currentChild.hasClass("coin")){
                        AddCoin(currentChild);

                    }else if(currentChild.hasClass("pouch")){
                        AddPouch(currentChild);

                    }else if(currentChild.hasClass("shield") && !PlayerCharacter.hasClass("shield-active") && !shield_damaged){
                        AddShield();
                        
                    }else if(currentChild.hasClass("obstacle-bomb") && !PlayerCharacter.hasClass("shield-active") && !shield_damaged){
                        AddBomb(currentChild);

                    }else if(currentChild.hasClass("shield") && !PlayerCharacter.hasClass("shield-active") && shield_damaged){
                        
                    }else if(currentChild.hasClass("obstacle-rock") && !PlayerCharacter.hasClass("shield-active")){
                        PauseGame();
                    }

                    if(DEMO){
                        DemoBlock();
                    }
                }


            }

        }, 16);
    }

    

}

function DemoBlock(){
    let playerwallet = Player.GetWallet();
    if(playerwallet > demo_coin_limit){
        Player.ResetWallet();
        Player.AddCoins(demo_coin_limit);
        let playerwalletupdated = Player.GetWallet();
        $(".coins > .small-display-text").text(playerwalletupdated);
        $(".coins").addClass("demo-coin-limit");
    }else{
        $(".coins").removeClass("demo-coin-limit");
    }
}

function AddCoin(currentChild){
    Player.AddCoins(1);

    let player_coins = Player.GetWallet();

    $(".coins > .small-display-text").text(player_coins);
    currentChild.remove();

}

function AddPouch(currentChild){
    Player.AddCoins(20);

    let player_coins = Player.GetWallet();

    $(".coins > .small-display-text").text(player_coins);
    currentChild.remove();
}

function AddShield() {
    PlayerCharacter.addClass("shield-active");
    let tempshieldcounter = 0;
    if (Player.player.isPro == true) {
        tempshieldcounter = shieldCounter + 10;
    } else {
        tempshieldcounter = shieldCounter;
    }


    $(".shields").addClass("shield-display-show");

    $('.obstacles').find('.shield').remove();


    var ShieldCounterFunction = function () {

        if (tempshieldcounter > 0) {
            if (!$(".player-character").hasClass("shield-animation")) {
                $(".player-character").addClass("shield-animation");
            }
            $(".shields .small-display-text").text(tempshieldcounter);
            tempshieldcounter--;
            setTimeout(ShieldCounterFunction, 1000);
        } else {
            tempshieldcounter = shieldCounter;
            $(".shields .small-display-text").text("0");
            $(".shields").removeClass("shield-display-show");
            PlayerCharacter.removeClass("shield-active");
            $(".player-character").removeClass("shield-animation");

        }
    };

    setTimeout(ShieldCounterFunction, 1000);


}

function AddBomb(currentChild){
    currentChild.remove();
    $(".shields").addClass("shield-damaged");
    let tempshieldcounter = SHIELD_DAMAGE;
    var ShieldCounterFunction = function(){

        if(tempshieldcounter > 0){
            shield_damaged = true;
            $(".shields .small-display-text").text(tempshieldcounter);
            tempshieldcounter--;
            setTimeout(ShieldCounterFunction, 1000);
        }else{
            $(".shields .small-display-text").text("0");
            $(".shields").removeClass("shield-damaged");
            shield_damaged = false;
        }
    };

    setTimeout(ShieldCounterFunction, 1000);
}


function PauseGame(){

    Paused = true;
    ClearLoop();

    if(sfx_on){
        $('.sfx-container audio')[1].play();
    }

    $(".pause-module").addClass("pause-module-slide-up");
    $(".home").addClass("display-none");

    if(!$(".settings").hasClass("display-none")){
        $(".settings").addClass("display-none");
    }

    if(!GameDetails.hasClass("slide-down")){
        GameDetails.addClass("slide-down");
    }

    SliderContainer.removeClass("slider-slide-up");

    clearInterval(CheckCollisionInterval);
    CheckCollisionInterval = undefined;

    clearInterval(CounterCoinsInterval);
    CounterCoinsInterval = undefined;

    $(".obstacles > .obstacle").each(function(index){

        let thistopint = $(this).position().top;

        $(this).css({"transition":"transform 0s linear 0s"});
        $(this).css({
            '-webkit-transform' : 'translateY(' + 0 + 'px)',
            '-moz-transform'    : 'translateY(' + 0 + 'px)',
            '-ms-transform'     : 'translateY(' + 0 + 'px)',
            '-o-transform'      : 'translateY(' + 0 + 'px)',
            'transform'         : 'translateY(' + 0 + 'px)'
        });

        $(this).css({"top":thistopint+"px"});

    });

    let rules_result = RulestoContinue();

    if(rules_result){
        $(".continue-game").removeClass("display-none");
        $(".restart-game").addClass("display-none");
    }else{
        $(".continue-game").addClass("display-none");
        $(".restart-game").removeClass("display-none");
    }

    Player.PausedGame();


}


function RulestoContinue(){
    let player_hearts = Player.GetHearts();

    if(player_hearts >= 1){
        return true;
    }else{
        return false;
    }

}



function HandleMusic($this){

    if(music_first_time){
        $('.music-container audio')[0].play();
        CheckMusic($this);
        CheckMusicInterval = setInterval(function(){
            CheckMusic($this);
        }, 1000);
        $this.text("🎵 Loading Music...");
        $this.addClass("pulse-animation");
    }else{
        $this.removeClass("pulse-animation");
        if (!$this.hasClass("button-regular-off")) {
            $this.addClass("button-regular-off");
            $this.text("🎵 Music Off");
            $('.music-container audio')[0].pause();
        } else {
            $this.removeClass("button-regular-off");
            $this.text("🎵 Music On");
            $('.music-container audio')[0].play();
        }
    }

    

}

function HandleSFX($this) {
    
    if(sfx_first_time){
        $('.sfx-container audio')[0].play();
        $('.sfx-container audio')[1].play();

        CheckSFX($this);
        CheckSFXInterval = setInterval(function(){
            CheckSFX($this);
        }, 1000);
        $this.text("🔈 Loading SFX...");
        $this.addClass("pulse-animation");

    }else{
        if (!$this.hasClass("button-regular-off")) {
            $this.addClass("button-regular-off");
            $this.text("🔈 SFX Off");
    
            sfx_on = false;
            $('.sfx-container audio')[0].pause();
            $('.sfx-container audio')[1].pause();
            $('.sfx-container audio')[1].currenTime = 0;
        } else {
    
            $this.removeClass("button-regular-off");
            $this.text("🔈 SFX On");
            sfx_on = true;
    
            $('.sfx-container audio')[0].play();
        }
    }
    

}





// Shop

function FillShop(){
    FillRow(CharactersList, ".droply-universe-characters");
    FillRow(BackgroundsList, ".droply-universe-backgrounds");
    FillRow(CharactersListDarpella, ".darpella-characters");
    FillRow(BackgroundsListDarpella, ".darpella-backgrounds");
    CheckSpecialHearts();
}

function CheckSpecialHearts(){
    let player_wallet = Player.GetWallet();
    let player_hearts = Player.GetHearts();
    let heart_price = HEART_PRICE;

    if(player_wallet < heart_price && player_hearts < 3){
        $(".buy-hearts-box").addClass("locked");
        $(".buy-hearts-box .section-coins").text(heart_price);
        $(".buy-hearts-box .section-price-icon").removeClass("display-none");
    }else if(player_hearts == 3){
        $(".buy-hearts-box").removeClass("locked");
        $(".buy-hearts-box .section-coins").text("Full Hearts");
        $(".buy-hearts-box .section-price-icon").addClass("display-none");
    }else if(player_wallet >= heart_price && player_hearts < 3){
        $(".buy-hearts-box").removeClass("locked");
        $(".buy-hearts-box .section-coins").text(heart_price);
        $(".buy-hearts-box .section-price-icon").removeClass("display-none");
    }
}

function PurchaseThis($this, list, target){
    let player_wallet = Player.GetWallet();

    let found = list.find(e => {
        return e.id === $this.attr("id");
    });


    if(found.purchased){

        if(target == ".droply-universe-characters" || target == ".darpella-characters"){
            Player.SetCharacter(found.id);
        }else if(target == ".droply-universe-backgrounds" || target == ".darpella-backgrounds"){
            Player.SetBackground(found.id);
        }
        ActivateItems();
    }else{
        if(player_wallet >= found.coins){
            $(".successful-purchase-alert").addClass("show-successful-purchase-alert");
            setTimeout(function(){
                $(".successful-purchase-alert").removeClass("show-successful-purchase-alert");
            }, 3000);

            BuyItem(found);
            FillShop();
            let player_coins = Player.GetWallet();
            $(".coins > .small-display-text").text(player_coins);
            ActivateItems();
            FillCoinsShop();
        }else{
            
        }
    }

}



function FillRow(list, target){

    
    let $target = $(target);
    $target.empty();
    let player_wallet = Player.GetWallet();
    CheckPlayerPurchases(list);


    for(let i=0; i<list.length; i++){

        let $targetbox = $("<div id='" + list[i].id + "' class='section-box " + list[i].class + "'></div>");
        let $targetimg = $("<div class='section-placeholder " + list[i].class + " section-img' style='background: url(" + list[i].image + ") center center no-repeat;background-size:contain'></div>");
        let $targetdetails = $("<div class='section-details'></div>");
        let $targetname = $("<div class='section-name " + list[i].class + "'>" + list[i].name + "</div>");;
        let $targetcoins;


        if(list[i].purchased){
            $targetcoins = $("<div class='section-coins " + list[i].class + "'>" + list[i].coins + "</div>");
        }else{
            if(list[i].diamonds){
                $targetcoins = $("<span class='small-display-icon section-price-icon'><img src='/assets/icons/coin.svg'></span><span class='section-coins " + list[i].class + "'>" + list[i].coins + "</span><div class='diamonds-display'><span class='small-display-icon section-price-icon'><img src='/assets/icons/diamond.svg'></span><span class='section-diamonds " + list[i].class + "'>" + list[i].diamonds + "</span></div>");
            }else{
                $targetcoins = $("<span class='small-display-icon section-price-icon'><img src='/assets/icons/coin.svg'></span><span class='section-coins " + list[i].class + "'>" + list[i].coins + "</span>");
            }
        }

        if(!list[i].purchased && player_wallet<list[i].coins){
            $targetbox.addClass("locked");
        }else{
            $targetbox.removeClass("locked");
        }


        $targetdetails.append($targetname);
        $targetdetails.append($targetcoins);

        $targetbox.append($targetimg);
        $targetbox.append($targetdetails);

        $target.append($targetbox);
        
    }

}


function CheckPlayerPurchases(list){
    let player_purchases = Player.GetPurchases();

    var found = false;
    for(let i=0; i<list.length; i++){
        found = player_purchases.find(x =>{
            return x == list[i].id;
        });

        if(found){
            list[i].purchased = true;
            list[i].coins = "Unlocked";
        }else{
            list[i].purchased = false;
        }
    }

    
}

function BuyItem(found){
    Player.AddToPurchases(found.id);
    Player.SubtractCoins(found.coins);
}




function ActivateItems(){
    ActivateCharacter(CharactersList);
    ActivateBackground(BackgroundsList);
    ActivateCharacter(CharactersListDarpella);
    ActivateBackground(BackgroundsListDarpella);
}

function ActivateCharacter(list){
    let player_character = Player.GetCharacter();

    let found = list.find(x => {
        return x.id == player_character;
    });


    if(found != undefined){
        FillRow(CharactersList, ".droply-universe-characters");
        FillRow(CharactersListDarpella, ".darpella-characters");
        $("#"+found.id).addClass("selected").siblings().removeClass("selected");
        $("#"+found.id+" .section-coins").text("Selected");
        $(".player-character img").attr("src", found.image);
    }

}

function ActivateBackground(list){
    let player_background = Player.GetBackground();

    let found = list.find(x => {
        return x.id == player_background;
    });


    if (found != undefined) {
        FillRow(BackgroundsList, ".droply-universe-backgrounds");
        FillRow(BackgroundsListDarpella, ".darpella-backgrounds");
        $("#"+found.id).addClass("selected").siblings().removeClass("selected");
        $("#"+found.id+" .section-coins").text("Selected");
        $(".game-container").css("background", "url(" + found.image + ") center bottom no-repeat");
        $(".game-container").css("background-size", "cover");
    }
}


function FillShopHearts(){
    ClearShopHearts();
    let player_hearts = Player.GetHearts();
    if(player_hearts == 0){
        $(".shop-player-stats-hearts").text("No hearts");
    }else{
        for(let i = 0; i<player_hearts;i++){
            let $heart = $("<span class='small-display-icon'><img src='/assets/icons/heart.svg'></span>");
            $(".shop-player-stats-hearts").append($heart);
        }
    }
}

function ClearShopHearts(){
    $(".shop-player-stats-hearts").empty();
}

function FillCoinsShop(){
    let player_wallet = Player.GetWallet();
    $(".shop-player-stats-coins .section-coins").text(player_wallet);
}


function ShowAnnouncement(){
    let a = Announcement.message;

    let announcements_container = $(".announcements-container");

    for(let i=a.length-1; i>=0; i--){

        let $announcement_box = $("<div class='announcement-box'></div>");
        let $announcement_header = $("<div class='announcement-header'>" + a[i].title + "</div>");
        let $announcement_image = $("<img src='"+ a[i].imageCover +"'>");
        let $announcement_content = $("<div class='announcement-content'><p>" + a[i].description + "</p></div>");
        let $announcement_cta;
        let $announcement_date = $("<div class='announcement-date'>" + GetFormattedDate(a[i].date * 1000) + "</div>");
        
        $announcement_box.append($announcement_header);
        $announcement_box.append($announcement_date);
        $announcement_box.append($announcement_image);
        $announcement_box.append($announcement_content);

        if(a[i].isLinked){
            $announcement_cta = $("<a href='" + a[i].link + "' target='_blank'><div class='announcement-cta'>Read More →</div></a>");
            $announcement_box.append($announcement_cta);
        }
        announcements_container.append($announcement_box);
        


    } 

}


function GetFormattedDate(time){
    let monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
        let dateObj = new Date(time);
        let month = monthNames[dateObj.getMonth()];
        let day = String(dateObj.getDate()).padStart(2, '0');
        let year = dateObj.getFullYear();
        let output = day + " " + month + ', ' + year;

        return output;
}

function AddPlacement(){
    let a = Placement.current;
    $(".a-placement").addClass(a.class);
    $(".a-placement a").attr("href", a.link);
    $(".a-placement-image").css({"background":"url(" + a.image + ") center center no-repeat", "background-size":"cover"});
    $(".a-placement-title").text(a.title);
}

function ApplyMemberships(){
    let h_t = HiT.list;
    let l_t = LoT.list;

    if(h_t.length>0){
        for(let i=0; i<h_t.length;i++){
            if(Player.player["id"] == h_t[i].id){
                $(".pro-user").removeClass("display-none");
                $(".a-placement").addClass("display-none");
                $(".my-data").removeClass("display-none");
                Player.player.isPro = true;
                Player.player.isHT = true;
                Player.player.isLT = false;
            }
        }
    }

    if(l_t.length>0){
        for(let i=0; i<l_t.length;i++){
            if(Player.player["id"] == l_t[i].id){
                $(".pro-user").removeClass("display-none");
                $(".a-placement").addClass("display-none");
                $(".my-data").removeClass("display-none");
                Player.player.isPro = true;
                Player.player.isHT = false;
                Player.player.isLT = true;
            }
        }
    }
    
}


function DownloadData() {
    var element = document.createElement('a');
    var saved = {
        "character": Player.player["character"],
        "background":Player.player["background"],
        "wallet": Player.player["wallet"],
        "hearts": Player.player["hearts"],
        "purchases": Player.player["purchases"]
    };
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(saved));
    element.setAttribute('download', "Droply-"+Date.now()+".json");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}


function CheckConnectivity(){
    var check_connectivity = {
        is_internet_connected: function(){
            return $.get({
                url:"https://droplythegame.com",
                dataType:'text',
                cache:false
            });
        }
    }

    check_connectivity.is_internet_connected().done(function(){
        $(".connectivity-alert").addClass("display-none");
    }).fail(function(jqXHR,textStatus,errorThrown){
        $(".connectivity-alert").removeClass("display-none");
    });
}



function CounterCoins() {
    
    if(!Paused){
        let difference = Date.now() - last_game_started;
        let time = 0;
        let coins_won = 0;
        if(Player.player.isPro == true){
            time = 60000;
            coins_won = 10;
        }else{
            time = 120000;
            coins_won = 2;
        }
        if(difference > time){
            Player.AddCoins(coins_won);
            last_game_started = Date.now();
            let player_coins = Player.GetWallet();
            $(".coins > .small-display-text").text(player_coins);
            $(".reward-announncement-number").text(coins_won);
            $(".reward-announncement").addClass("reward-announncement-appear");
            setTimeout(function(){
                $(".reward-announncement").removeClass("reward-announncement-appear");
            },5000);
            
        }else{

        }

        CounterCoinsInterval = setTimeout(CounterCoins, 5000);
    }
}

function FillVirtualStore(){

    let $target = $(".virtualstore");
    let list = VirtualStore.list;

    for(let i=0; i<list.length; i++){

        let priceShow;

        if(Player.player.isHT){
            priceShow = list[i].priceHT;
        }else if(Player.player.isLT){
            priceShow = list[i].priceLT;
        }else{
            priceShow = list[i].price;
        }

        let $a = $("<a href='" + list[i].link + "' target='_blank'></a>");
        let $targetbox = $("<div id='" + list[i].id + "' class='section-box " + list[i].class + "'></div>");
        let $targetimg = $("<div class='section-placeholder " + list[i].class + " section-img' style='background: url(" + list[i].image + ") center center no-repeat;background-size:cover'></div>");
        let $targetdetails = $("<div class='section-details'></div>");
        let $targetname = $("<div class='section-name " + list[i].class + "'>" + list[i].title + "</div>");;
        let $targetprice = $("<span class='small-display-icon section-price-icon'>💵</span><span class='section-coins " + list[i].class + "'>" + priceShow + "</span>");;

        $targetdetails.append($targetname);
        $targetdetails.append($targetprice);

        $targetbox.append($targetimg);
        $targetbox.append($targetdetails);

        $a.append($targetbox);
        $target.append($a);
        
    }
}



function CheckMusic($this){



    if($(".music-container audio")[0].readyState == 4){

        music_first_time = false;
        clearInterval(CheckMusicInterval);
        $this.removeClass("button-regular-off");
        $this.text("🎵 Music On");
        $('.music-container audio')[0].play();
        $this.removeClass("pulse-animation");
    }

}

function CheckSFX($this){
    if($(".sfx-container audio")[0].readyState == 4 &&
    $(".sfx-container audio")[1].readyState == 4){

        sfx_first_time = false;
        clearInterval(CheckSFXInterval);
        $this.removeClass("button-regular-off");
        $this.text("🔈 SFX On");
        $('.sfx-container audio')[0].play();
        $this.removeClass("pulse-animation");
    }
}

function HandleReferrals(){
    let reflist = Ref.list;
    let reflist_t = RefT.list;

    let foundref = reflist.find(x => x.id === Player.player.id);
    let foundref_t = reflist_t.find(x => x.id === Player.player.id);

    if(foundref){
        let special_added_coins = SpecialCoins.GiveExtraCoins("REF01");
        CoinsText.text(special_added_coins);
        $(".can-refer").addClass("display-none");
        $(".refer-used").removeClass("display-none");
    }
    if(foundref_t){
        let special_added_coins = SpecialCoins.GiveExtraCoins("REF02");
        CoinsText.text(special_added_coins);
        $(".not-referred").addClass("display-none");
        $(".referred").removeClass("display-none");
    }
}


function HandleGiveAways(){

    let giveawaylist = GiveAway.list;

    let found = giveawaylist.find(x => x.id == Player.player.id);

    if(found){
        if(found.items.length != 0){
            for(let i=0; i<found.items.length; i++){
                let exists = Player.player.purchases.find(y => y == found.items[i]);
                if(!exists){
                    Player.AddToPurchases(found.items[i]);
                } 
            }
        }

        if(found.extracoins.length != 0){
            for(let i=0; i<found.extracoins.length; i++){
                let exists = Player.player.purchases.find(y => y == found.extracoins[i]);
                if(!exists){
                    SpecialCoins.GiveExtraCoins(found.extracoins[i]);
                } 
            }
        }

        let player_wallet = Player.GetWallet();
        CoinsText.text(player_wallet);
        
    }



}

function ActivateDemo(){
    $(".demo-message").removeClass("display-none");
}