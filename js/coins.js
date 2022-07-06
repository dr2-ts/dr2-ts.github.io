import * as Player from "../js/player.js";

export const list = [
    {
        id:"REF01",
        amount:70
    },
    {
        id:"REF02",
        amount:20
    },
    {
        id:"GIVEAWAY01",
        amount:1000
    },
    {
        id:"INSTALLBONUS01",
        amount:100
    }
]


export function GiveExtraCoins(coin_id){

    let special_coins = list.find(x => x.id == coin_id);
    let found = Player.player.purchases.find(x => x == coin_id);

    if(!found){
        alert("not found")
        alert(JSON.stringify(Player))
        Player.AddToPurchases(coin_id);
        Player.AddCoins(special_coins.amount);
    }

    return Player.GetWallet();
}