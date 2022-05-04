import * as Functions from '../js/functions.js';

export var player = {
    "id":"",
    "name": "Player",
    "character": "CH01",
    "background":"BA01",
    "wallet": 10,
    "hearts": 3,
    "purchases": ["CH01", "BA01"],
    "notifications": [],
    "isPausedGame":false,
    "isPro":false,
    "isHT":false,
    "isLT":false,
    "awards": [],
    "level":0
}


export function CreatePlayerID(){
    let alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let start_code = "DP";
    let second_code = new Date().getTime().toString();
    let third_code = Functions.getRandomInteger(100, 200);
    let fourth_code = Functions.getRandomInteger(300, 400);
    let fifth_code = Functions.getRandomInteger(500, 600);
    let seventh_code = alphabet[Functions.getRandomInteger(0, alphabet.length - 1)];
    let eighth_code = alphabet[Functions.getRandomInteger(0, alphabet.length - 1)];
    let nineth_code = alphabet[Functions.getRandomInteger(0, alphabet.length - 1)];
    let tenth_code = alphabet[Functions.getRandomInteger(0, alphabet.length - 1)];

    let myid = start_code + second_code + third_code.toString() + fourth_code.toString() + fifth_code.toString() + seventh_code + eighth_code + nineth_code + tenth_code;
    player["id"] = myid;
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
export function AddCoins(amount) {
    player["wallet"] += amount;
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
    localStorage.setItem("DroplyPlayer", JSON.stringify(player));
}