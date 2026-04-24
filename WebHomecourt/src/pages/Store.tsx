import { useEffect, useState } from 'react'
import { supabase } from "../lib/supabase"
import Nav from '../components/Nav'
import StoreRow from '../components/LakerStore/StoreRow.tsx'

//import DisplayUserCards from "../components/CollectedCard"

/* 
Page flow
* Get user credits when loading the screen and store in variable to help show the available packs
* Get for the types of player pakcs (pack_type) just a list of them and how many they are like id and name
* Pack listing component (name of pack) and pass as param; that component calls API to get specific listing of all of the (pack) table WHERE pack.pack_type_id = pack_type.pack_type_id. I will probs have to map over the obtained json cause rn there's only 4 hardcoded pack types but a future pack_type might mean rendering the pack type component five times. 
- Don't know if it might be better if instead i just do a function call that gets all packs and pack_types ordered by id and then from front end map over the full list of obtained packs and divide it into more sublists and then a for loop to render the cards themselves... 
- However I get the individual pack renders, I think I should send as a parameter how much "credits" the user has and I can make the postgre logic such that there is an "additional" calculated column that checks if the pack cost > user_credits AS is_affordable so that I can make the logic to render buttons as yellow clickable-can buy, or gray unclickable can't buy. 
* If the user then clicks on a pack, it calls a function in postgre including the user_credits and pack_id so that it can first recheck that the user does have enough credits when opening the pop-up to open the card. 
* Okay now interesting design time. I want it to show the pack, and then I don't know if I should make the pack a static image, or a button so that the user can press the card directly and have a counter that counts how many times the user presses the pack. Right now I can make it take only 3 taps to open the card (first closed pack to slight tear, second slight tear to most open image, three open and add animation so that the card then "slides down" and instead the three unlocked cards are overlayed in z axis so that they appear on top of the pack as it slides down). Alternatively, I can just have abutton below that says like click here to open, but maybe pressing on the pack directly might be more interactivel lol. For now, I think it's best if I leave animations and such for the end so that I can actually focus on functionality and leave that as an extra. On that third tap is when the API to calculate the cards actually gets called, so that the user can "cancel" the purchase even if they already clicked that they wanted to buy the card. 
  * That third tap calls api and well I'll have to think of the logic later where I'll pass as parameter the user_id, pack_id. Basically I'll need to check the num_cards that pack has, and make a for loop where i = 0; i < num_cards; i++ that does the following: generates a random number from 1 to 100, checks the pack_rarity weight to see that random number which weight range it falls within, then does a join with that pack_cards to see which cards can be unlocked from that pack WHERE card.rarity_id = pack_rarity.rarity_id based on the random number that fell within that specific weight range. Then, among those filtered cards, it should randomize their order and select only the LIMIT 1. Once that card is won (won_card_id), I'll need to check user_cards where if the user already has the won_card_id in their collection then it just increments the user_cards.times_unlocked for that card_id by 1; if there are no matching records for that card, then I'll add as a row the user_id, won_card_id, first_pack_id (the pack_id where it was obtained), times_unlocked set to 1, and first_unlock is set to the current time so that it could be used to monitor the card collection. 
  * So in total, the player can get up to a total of 3, 5, 7, or 3 cards (player, team, legendary or limited edition packs respectively). If they're repeated, I guess I'll have to return the cards as "sepearate" entities like if they get card_id 2 in the same pack opening, it'll render both of them and show them as exactlhy the same. 
  * Once the for loop is done, I'll have to update the user_laker table, search for user_id, and use pack_id cost to subtract the user credits. In short, once the cards are obtained, then I'll have to register the cost of buying that pack in the database. 
* Now the cards are added to the user collection, they can close the pop-up and yeah that's over. Dang that was long.  
*/

// Types of data 
export type StorePacks = {
  pack_id: number | null, // Pack data empty if no cards are present for that category
  pack_type_id: number,
  name: string,
  closed_URL: string,
  pack_name: string | null, // Pack data empty if no cards are present for that category
  cost: number | null, // Pack data empty if no cards are present for that category
  num_cards: number | null, // Pack data empty if no cards are present for that category
  is_active: boolean | null // Pack data empty if no cards are present for that category
};

// API calls
// Gets the listing of all packs to display on website
async function getPacksStore() {
  // Call supabase funct
  const { data, error } = await supabase.rpc("get_packs_store");

  // Smth died
  if (error) {
    console.error("Supabase error:", error.message)
    throw new Error("Failed to get packs")
  }

  console.log("raw rpc data:", data);
  console.log("is array?", Array.isArray(data));

  // Data is not formatted as array, entcs hace un array vacío and sends that will show no user colls
  if (!Array.isArray(data)) return []

  console.log("raw data:", JSON.stringify(data, null, 2)) // A ver como se ve lo q fue fetched

  // Takes results del data and turns into the CollectedCard obj
  const packs: StorePacks[] = data.map(row => {
    // Creates the game items 
    return {
      pack_id: row.pack_id, // Pack data empty if no cards are present for that category
      pack_type_id: row.pack_type_id,
      name: row.name,
      closed_URL: row.closed_URL,
      pack_name: row.pack_name,
      cost: row.cost, // Pack data empty if no cards are present for that category
      num_cards: row.num_cards, // Pack data empty if no cards are present for that category
      is_active: row.is_active
    }
  });

  return packs;
}

// <DisplayUserCards userId="ac3a5447-1b6f-4324-8830-5ddc2d7b2c47"></DisplayUserCards>
function Store() {
  const [packs, setPacks] = useState<StorePacks[]>([]); // Array w packs


  // Initial function to render
  useEffect(() => {
    async function loadPacks() {
      try {
        const result = await getPacksStore();
        setPacks(result);
      } catch (err) {
        console.error(err);
      }
    }

    loadPacks();
  }, []);

  //const packTypeIds = [...new Set(packs.map((pack) => pack.pack_type_id))]; // Checks the established packs to extract the ids 

  return (
    <div className="flex flex-col items-center justify-center">
      <Nav current="Store" />
      <div className="px-4 py-5 md:px-14 md:py-5 bg-zinc-100 w-full">
        {/* Title comp */}
        <div className="w-full px-3 py-4 md:px-5 md:py-7 bg-violet-950 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black/25 flex flex-col justify-left items-left overflow-hidden">
          <h1 className="justify-start text-white title1">Lakers Store</h1>
          <p className="justify-start text-white mt-2 text-xl text-zinc-300">The virtual home of your collection</p>
        </div>

        {/* Load the packs by giving id of each section */}
        <StoreRow packTypeId={1} packs={packs} />
        <StoreRow packTypeId={2} packs={packs} />
        <StoreRow packTypeId={3} packs={packs} />
        <StoreRow packTypeId={4} packs={packs} />
      </div>


    </div>


  )
}

export default Store
