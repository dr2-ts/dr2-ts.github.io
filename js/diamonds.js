import * as Player from "../js/player.js";

export const list = [
    {
        id:"DIAMOND5",
        amount:5
    }
]

export function GiveExtraDiamonds(diamond_id){
    let special_diamonds = list.find(x => x.id == diamond_id);
    let found = Player.player.purchases.find(x => x == diamond_id);

    if(!found){
        Player.AddToPurchases(diamond_id);
        Player.AddDiamonds(special_diamonds.amount);
    }

    return Player.GetDiamonds();
}