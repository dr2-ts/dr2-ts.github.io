import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import * as Functions from '../js/functions.js';

export var player = {
    "id":"DRPLYNOID",
    "name": "Player",
    "character": "CH01",
    "background":"BA01",
    "wallet": 10,
    "diamonds":0,
    "hearts": 3,
    "purchases": ["CH01", "BA01"],
    "notifications": [],
    "isPausedGame":false,
    "isPro":false,
    "isHT":false,
    "isLT":false,
    "awards": [],
    "level":0,
    "last_played":0,
    "last_in_game":0,
    "last_opened_chest":0,
    "daily_chest_opened":false,
    "time_played_total":0,
    "time_in_game_total":0,
    "highest_time_in_game":0,
    "highest_time_played_consecutive":0
}


export function CreatePlayerID(){
    player.id = 'drply-' + uuidv4()
}


export function GetCharacter(){
    return player["character"];
}

export function GetSoundtrack(){
    return player["soundtrack"];
}

export function GetBackground(){
    return player["background"];
}

export function SetCharacter(newvalue){
    player["character"] = newvalue;
    AddToLocalStorage();
}

export function SetSoundtrack(newvalue){
    player["soundtrack"] = newvalue;
    AddToLocalStorage();
}

export function SetBackground(newvalue){
    player["background"] = newvalue;
    AddToLocalStorage();
}



// Name
export function GetName(){
    return player["name"];
}

export function SetName(name){
    player["name"] = name;
    AddToLocalStorage();
}



// Wallet
export function AddCoins(amount, demo) {
    if(demo){
        if(player.wallet > 30){
            player.wallet = 30;
        }else if(player.wallet + amount > 30){
            player.wallet = 30;
        }else{
            player["wallet"] += amount;
        }
    }else{
        player["wallet"] += amount;
    }
    
    AddToLocalStorage();

}

export function SubtractCoins(amount) {
    if (amount > player["wallet"]) {
        return false;
    } else {
        player["wallet"] = player["wallet"] - amount;
        AddToLocalStorage();

    }
}

export function GetWallet() {
    return player["wallet"];
}

export function ResetWallet() {
    player["wallet"] = 0;
    AddToLocalStorage();
}


//Diamonds
export function AddDiamonds(amount){
    player["diamonds"] += amount;
    AddToLocalStorage();
}

export function SubtractDiamonds(amount){
    if (amount > player["diamonds"]) {
        return false;
    } else {
        player["diamonds"] = player["diamonds"] - amount;
        AddToLocalStorage();
    }
}

export function GetDiamonds(){
    return player.diamonds;
}



// Hearts
export function RemoveHearts(amount){
    player["hearts"] -= amount;
    AddToLocalStorage();
}

export function AddHearts(amount){
    player["hearts"] += amount;
    AddToLocalStorage();
}

export function GetHearts() {
    return player["hearts"];
}

export function ResetHearts() {
    player["hearts"] = 3;
    AddToLocalStorage();
}




// Purchases
export function GetPurchases(){
    return player["purchases"];
}

export function AddToPurchases(item) {
    player["purchases"].push(item);
    AddToLocalStorage();
}

export function RemoveFromPurchases(value) {
    var index = player["purchases"].indexOf(value);
    if (index > -1) {
        player["purchases"].splice(index, 1);
    }
    AddToLocalStorage();
}


// Time Stamps


export function UpdateLastPlayedTimestamp(time){
    player.last_played = time;
    AddToLocalStorage();
}

export function GetLastPlayedTimestamp(){
   return player.last_played;
}

export function UpdateHighestPlayedTimestamp(time){
    player.highest_time_played_consecutive = time;
    AddToLocalStorage();
}

export function GetHighestPlayedTimestamp(){
   return player.highest_time_played_consecutive;
}




export function UpdateHighestTimeInGame(time){
    if(time > player.highest_time_in_game){
        player.highest_time_in_game = time;
        AddToLocalStorage();
    }
}

export function GetHighestTimeInGame(){
    return player.highest_time_in_game;
}




export function UpdateLastInGameTimestamp(time){
    player.last_in_game = time;
    AddToLocalStorage();
}

export function GetLastInGameTimestamp(){
    return player.last_in_game;
}




export function UpdateTotalInGameTimestamp(){
    player.time_in_game_total += 5;
    AddToLocalStorage();
}

export function GetTotalInGameTime(){
    return player.time_in_game_total;
}





export function UpdateTotalPlayedTimestamp(){

}

export function GetTotalPlayedTime(){
    
}






// Daily Chest
export function DailyChestOpened(){
    player.daily_chest_opened = true;
    AddToLocalStorage();
}

export function ResetDailyChest(){
    player.daily_chest_opened = false;
    AddToLocalStorage();
}

export function UpdatetLastOpenedChest(time){
    player.last_opened_chest = time;
    AddToLocalStorage();
}

export function GetLastOpenedChest(){
    return player.last_opened_chest;
}


// Notifications
export function NotificationChecked(id){
    player["notifications"].push(id);
    AddToLocalStorage();
}

export function PausedGame(){
    player.isPausedGame = true;
    AddToLocalStorage();
}

export function NotPausedGame(){
    player.isPausedGame = false;
    AddToLocalStorage();
}


export function IsMember(){
    player.isPro = true;
    AddToLocalStorage();
}

export function AddToLocalStorage(){
    try {
        localStorage.setItem("DroplyPlayer", JSON.stringify(player));
      } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
          alert('Quota exceeded!');
        }
      }
    
}
