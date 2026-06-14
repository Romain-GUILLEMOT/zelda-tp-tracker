export interface Collectible {
  id: string;
  index: number;
  location: string;
  conditions: string[][];
  description: string;
  image: string | null;
  name?: string;
}

export const heartPieces: Collectible[] = [
  {
    id: "hp-1",
    index: 1,
    location: "Faron Woods",
    conditions: [["lantern"]],
    description: "In the deeper part of Faron Woods, you'll find a cave to the northeast where you initially find a Small Key. If you fail to get it your first time through, you'll have to use the Lantern to get through the fog and make your way to the cave. Inside, light the two torches to make a large chest appear on the platform containing your first heart piece.",
    image: "/img/hearth/400px-Tp_heart_01.jpg"
  },
  {
    id: "hp-2",
    index: 2,
    location: "Forest Temple",
    conditions: [["boomerang"], ["clawshot"]],
    description: "In the room with the Bomblings and Deku Likes, one of the Deku Likes is blocking an alcove with a large chest. To defeat it, you can climb up to the platform above it, hit the nearby Bombling and drop it over the edge so it swallows it. Alternatively, you can return later when you have Bombs. NOTE: If you complete the Forest Temple without getting this piece, you'll need the Clawshot to return to this room.",
    image: "/img/hearth/400px-Tp_heart_02.jpg"
  },
  {
    id: "hp-3",
    index: 3,
    location: "Forest Temple",
    conditions: [["boomerang"], ["clawshot"]],
    description: "In the room with the Tile Worms, blow out all the torches using the Gale Boomerang to reveal a hidden alcove with a large chest, open it to obtain the third heart piece. NOTE: If you complete the Forest Temple without getting this piece, you'll need the Clawshot to return to this room.",
    image: "/img/hearth/400px-Tp_heart_03.jpg"
  },
  {
    id: "hp-4",
    index: 4,
    location: "Hyrule Field (North of Faron Woods)",
    conditions: [["boomerang"]],
    description: "In the portion of Hyrule Field just north of Faron Woods, go straight forward (from Faron Province) and you'll come to a rise with two Bulblin Warriors. After defeating them, look at the tree to the north (before the bridge) and you'll find a Piece of Heart in its branches. Use the Gale Boomerang to bring it over.",
    image: "/img/hearth/400px-Tp_heart_04.jpg"
  },
  {
    id: "hp-5",
    index: 5,
    location: "Kakariko Gorge",
    conditions: [["boomerang"]],
    description: "In the portion of Hyrule Field just south of Kakariko Village, there are two large rock formations in the distance towards the center of Hyrule. There's a Piece of Heart atop the larger one, so use the Gale Boomerang to bring it over.",
    image: "/img/hearth/400px-Tp_heart_05.jpg"
  },
  {
    id: "hp-6",
    index: 6,
    location: "Ordon Village",
    conditions: [["horse_call"]],
    description: "After restoring light to the Eldin Province and recovering Epona, you can return to Ordon Village and help Fado herd the goats during the day. If you can manage to herd all 20 goats in under three minutes, he'll gift you with this Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_06.jpg"
  },
  {
    id: "hp-7",
    index: 7,
    location: "Goron Mines",
    conditions: [["iron_boots"]],
    description: "In the room where you walk around on the ceiling due to the large magnetic field, you can walk to the far northeast corner and find a hidden platform with a large chest containing the Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_07.jpg"
  },
  {
    id: "hp-8",
    index: 8,
    location: "Goron Mines",
    conditions: [["iron_boots"]],
    description: "In the room just north of the large central chamber, the room is divided into two areas. On the north side of the room there are two Beamos in the center, while along the west wall there is a magnetic field. Walk up it using the Iron Boots and turn south to find a platform with a large chest containing the heart piece.",
    image: "/img/hearth/400px-Tp_heart_08.jpg"
  },
  {
    id: "hp-9",
    index: 9,
    location: "Kakariko Village",
    conditions: [["bow"]],
    description: "After completing the Goron Mines, Talo can be found atop the highest building in the village. To get up there, speak with the Goron at the building's base and climb up the ladder. Speak with Talo, who will ask you to teach him how to use the bow. You'll appear down near the Sanctuary along with Malo. After shooting two relatively easy targets, Talo will yell at you to shoot a pole at the corner of the high building. Just aim carefully at the corner of the building itself, pull the bowstring all the way back, raise your cross arrow a bit and release. Malo will gift you with a Piece of Heart if you can hit it.",
    image: "/img/hearth/400px-Tp_heart_09.jpg"
  },
  {
    id: "hp-10",
    index: 10,
    location: "Kakariko Village",
    conditions: [["bow", "bombs", "boomerang"]],
    description: "There are some boulders just above the Eldin Spring. Once you buy Bombs from Barnes Bombs, you can combine them with the Hero's Bow to create Bomb Arrows. Blast the boulders to reveal a Piece of Heart. Use the Gale Boomerang to bring it down.",
    image: "/img/hearth/400px-Tp_heart_10.jpg"
  },
  {
    id: "hp-11",
    index: 11,
    location: "Kakariko Village",
    conditions: [["bombs", "iron_boots"]],
    description: "Blow up the boulder near the Eldin Spring and follow the path to drop down into the spring itself. Put on the Iron Boots to sink down where you can find a large chest containing the heart piece.",
    image: "/img/hearth/400px-Tp_heart_11.jpg"
  },
  {
    id: "hp-12",
    index: 12,
    location: "Death Mountain",
    conditions: [["iron_boots"]],
    description: "Once you have completed the Goron Mines, there will be Gorons along the trail leading up to Death Mountain. These friendly dudes will allow you to get on their back and shoot you up the ledges. From Kakariko Village, speak with the second Goron you come to, get on his back and face off to the left instead. Hold forward on the analog stick and you'll be able to grab onto the ledge and pull yourself up. Follow this higher path to the north and you'll find an alcove off to the left. Enter and drop down to find a large chest containing a Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_12.jpg"
  },
  {
    id: "hp-13",
    index: 13,
    location: "Kakariko Gorge Cavern",
    conditions: [["bombs", "lantern"]],
    description: "In the southern area of Kakariko Gorge is a boulder blocking a cave. Blow it up, enter, and use your Lantern to navigate through this enemy-filled area. At the forks, go: right, right, left, right to find a dead end with a Skulltula. Defeat it, then light the torches to make a large chest appear containing a Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_13.jpg"
  },
  {
    id: "hp-14",
    index: 14,
    location: "Hyrule Field (North of Kakariko Village)",
    conditions: [["bow", "bombs"]],
    description: "When you exit Kakariko Village to the north, you'll arrive in a large portion of Hyrule Field to the east of Castle Town. You'll find some boulders in this rocky area. Blow them up with Bombs and follow the path to some vines and more boulders. Use Bomb Arrows to blow up the boulders on the ledge, then jump across the gap to grab the vines. Pull yourself up and continue on to find a large chest on a ledge containing the heart piece.",
    image: "/img/hearth/400px-Tp_heart_14.jpg"
  },
  {
    id: "hp-15",
    index: 15,
    location: "Castle Town",
    conditions: [],
    description: "In Castle Town, there's an old man by the name of Charlo hanging out near the west exit just north of Purlo's tent. When you speak with him, he'll ask you to donate. By giving him 1,000 Rupees, you'll be rewarded with a Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_15.jpg"
  },
  {
    id: "hp-16",
    index: 16,
    location: "Hena's Fishing Hole",
    conditions: [],
    description: "When in Hena's Fishing Hole, look towards the central pillars to see a Piece of Heart atop the rock formation. When in the boat, you can use the Fishing Rod to bring it over to you. Alternatively, you could use the Gale Boomerang and lock on from the shore.",
    image: "/img/hearth/400px-Tp_heart_16.jpg"
  },
  {
    id: "hp-17",
    index: 17,
    location: "Isle of Riches",
    conditions: [],
    description: "In Lake Hylia, speak with Fyer to get shot up to the top of Lake Hylia (Hyrule Field). From here, you can play Falbi's Flight-by-Fowl to glide with a Cucco to the Isle of Riches. The second to top tier (the highest and smallest one that isn't spinning) has a large chest that contains a Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_17.jpg"
  },
  {
    id: "hp-18",
    index: 18,
    location: "Lake Hylia Cavern",
    conditions: [["bombs", "lantern"]],
    description: "In the southern portion of Lake Hylia is a ladder. Climb up it and blow up the boulder to the south to reveal a cavern. Inside, you'll need your Lantern to see through the darkness, as well as bombs to clear boulders in the way. At the end of the lengthy cavern, you'll finally come to a large chest containing a Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_18.jpg"
  },
  {
    id: "hp-19",
    index: 19,
    location: "Lakebed Temple",
    conditions: [["clawshot"]],
    description: "Once you have restored the water flow from both the east and west sides, you can turn the stairs so that water flows into the lower east section. Return to the room with the rotating platforms and stalactites. By filling this area with water, it raises a bridge. Stand on the switch to open the gate up ahead, then use the Clawshot on the target to get on the other side before the gate closes. Open the large chest for a Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_19.jpg"
  },
  {
    id: "hp-20",
    index: 20,
    location: "Lakebed Temple",
    conditions: [["clawshot"]],
    description: "In the middle of the ceiling of the large central chamber (with the spinning staircase) is a giant chandelier. You can get up there by using the various targets in all of the compass directions. On top, you will find a large chest with the heart piece.",
    image: "/img/hearth/400px-Tp_heart_20.jpg"
  },
  {
    id: "hp-21",
    index: 21,
    location: "Sacred Grove",
    conditions: [["master_sword", "bombs"]],
    description: "Once you have acquired the Master Sword and Shadow Crystal, you can enter the small area to the side where we fought Skull Kid the first time. There is a large boulder here that you can blow up with Bombs to reveal a sparkly spot you can see in wolf form. Dig down into it to find a cavern filled with Baba Serpents. Defeat them all to make a large chest appear containing the heart piece.",
    image: "/img/hearth/400px-Tp_heart_21.jpg"
  },
  {
    id: "hp-22",
    index: 22,
    location: "West Castle Town Bridge",
    conditions: [["iron_boots"]],
    description: "The Goron at the bridge leading from Castle Town to the portion of Hyrule Field just north of Kakariko Village will leave this behind as thanks for energizing him with Hot Spring Water. (Requires progress in the Malo Mart side-quest, which unlocks after Goron Mines).",
    image: "/img/hearth/400px-Tp_heart_22.jpg"
  },
  {
    id: "hp-23",
    index: 23,
    location: "Lanayru Spring",
    conditions: [["clawshot", "lantern"]],
    description: "After you've acquired the Clawshot, you can enter Lanayru Spring in Lake Hylia, and to either the left or right, you'll find some vines. Use the Clawshot to get across and follow it to a hidden room in the back (far south). Inside, light the two torches with your Lantern to make a large chest appear containing the heart piece.",
    image: "/img/hearth/400px-Tp_heart_23.jpg"
  },
  {
    id: "hp-24",
    index: 24,
    location: "Lake Hylia",
    conditions: [["master_sword"]],
    description: "After you have restored light to the Lanayru Province and obtained the Master Sword, you can return to Lake Hylia and meet up with Plumm in wolf form. He has a mini-game available in which you ride a Kargarok up Zora's River popping balloons. Get only oranges or only strawberries to get over 10,000 points, and he'll give you a Piece of Heart in reward.",
    image: "/img/hearth/400px-Tp_heart_24.jpg"
  },
  {
    id: "hp-25",
    index: 25,
    location: "Bridge of Eldin Cavern",
    conditions: [["clawshot", "iron_boots"]],
    description: "Just north of the Bridge of Eldin is an upper platform that you can reach with the Clawshot (by latching onto the target against the wall). Follow this path to the east to find a cavern. Inside, follow the path, jumping down and using the Iron Boots to get sucked into the magnetic fields. At the bottom, you will find a large chest with your prize.",
    image: "/img/hearth/400px-Tp_heart_25.jpg"
  },
  {
    id: "hp-26",
    index: 26,
    location: "Bulblin Fortress",
    conditions: [["master_sword"]],
    description: "In the Gerudo Desert (accessed after obtaining the Master Sword), just before entering the Arbiter's Grounds is the Bulblin Fortress. In the northeast corner some Bulblins are roasting a Bullbo over a fire. Slash the Bullbo with your sword until it explodes, revealing a Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_26.jpg"
  },
  {
    id: "hp-27",
    index: 27,
    location: "Arbiter's Grounds",
    conditions: [["clawshot", "master_sword"]],
    description: "In the large, central room where the blue flames are stolen by the Poes, there's a chest to either side of the stairs. On the right side the chest contains a Piece of Heart. Use the Clawshot to get over and roll back along the platforms safely.",
    image: "/img/hearth/400px-Tp_heart_27.jpg"
  },
  {
    id: "hp-28",
    index: 28,
    location: "Arbiter's Grounds",
    conditions: [["spinner", "master_sword"]],
    description: "In the room with lots of Spinner rails, the mid level you can get to has a rotating spike, but to the far east side there's a chest on the upper platform along with a Stalfos. Defeat it, then open the chest for a Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_28.jpg"
  },
  {
    id: "hp-29",
    index: 29,
    location: "North of the Great Bridge of Hylia",
    conditions: [["spinner", "bombs"]],
    description: "Between the Great Bridge of Hylia and the area north of Castle Town, there's a back route that's blocked off by boulders. After you've blown them up, you can access this shortcut which has rails along the bottom. Repeatedly use the Spinner to jump back and forth and eventually you'll get to a platform with a large chest containing a heart piece.",
    image: "/img/hearth/400px-Tp_heart_29.jpg"
  },
  {
    id: "hp-30",
    index: 30,
    location: "North of the Bridge of Eldin",
    conditions: [["spinner"]],
    description: "Just north of the Bridge of Eldin is a small bridge across the black abyss (right next to the entrance to the Hidden Village). Use the rails along the north wall to get to a platform with grass. Transform into a wolf and dig down into the sparkly spot in the center. Inside, kill the three Stalfos to make a large chest appear containing the Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_30.jpg"
  },
  {
    id: "hp-31",
    index: 31,
    location: "Snowpeak Ruins",
    conditions: [["bombs", "master_sword"], ["ball_and_chain"]],
    description: "On the second floor, the room to the far southwest has some Freezards in cages and a cannon. At the top, there's a target against the wall in the corner. The floor here looks uneven, meaning you can use Bombs to blow it up. Alternatively, you can use the Ball and Chain to break it. Fall down into a mysterious room on the first floor where there's a large chest. Open it to get a Piece of Heart, then use the target to get back to the second floor.",
    image: "/img/hearth/400px-Tp_heart_31.jpg"
  },
  {
    id: "hp-32",
    index: 32,
    location: "Snowpeak Ruins",
    conditions: [["ball_and_chain"]],
    description: "Once you reach the entrance room on the second floor, use the Ball and Chain on the target that's next to the west door. This will unveil a target. Jump onto the chandelier, then turn to the south where you'll see two more in a row. Using the Ball and Chain to strike the chandeliers, you'll be able to work your way south, eventually jumping to the platform and opening the chest.",
    image: "/img/hearth/400px-Tp_heart_32.jpg"
  },
  {
    id: "hp-33",
    index: 33,
    location: "Ice Block Cavern",
    conditions: [["ball_and_chain", "bombs"]],
    description: "In the portion of Hyrule Field just north of Castle Town, head to the lower portion of the rocky area to the far north. Here, you'll find a boulder blocking a cave. Blow it up and head inside. Break through the ice with the Ball and Chain, then complete the three rooms of block puzzles. In the final room, you'll gain access to a large chest containing a Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_33.jpg"
  },
  {
    id: "hp-34",
    index: 34,
    location: "Snowpeak",
    conditions: [["ball_and_chain"]],
    description: "After completing the Snowpeak Ruins, you can warp to the top of Snowpeak and speak with Yeto and Yeta to race them. Defeat Yeto first, then race Yeta. She is much faster and takes a shortcut. You must take this shortcut too (visible on your map) to beat her. In reward, she'll give you a Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_34.jpg"
  },
  {
    id: "hp-35",
    index: 35,
    location: "Temple of Time",
    conditions: [["dominion_rod"]],
    description: "In the room with several Lizalfos, Dynalfos and walls that move back and forth, there's a chest in the corner behind an electric barrier. Use either the giant statue with the Dominion Rod or one of the nearby little statues to step on the switch on the other side of the barrier to deactivate it temporarily.",
    image: "/img/hearth/400px-Tp_heart_35.jpg"
  },
  {
    id: "hp-36",
    index: 36,
    location: "Temple of Time",
    conditions: [["dominion_rod"]],
    description: "In the room with the spinning mechanism to raise and lower the platform, go to the bottom and collect the small statue, then take it to the mid level and collect that small statue as well. Take them both to the south and place them on the floor switches (or use the giant statue). This allows you to access the far southern room. Defeat the enemies, then use the Dominion Rod to move the little statue on the upper platform to the far south. Walk it down onto the floor switch. Do the same with the other statue on the opposite side to spawn a large chest in the east alcove.",
    image: "/img/hearth/400px-Tp_heart_36.jpg"
  },
  {
    id: "hp-37",
    index: 37,
    location: "Temple of Time (Entrance)",
    conditions: [["dominion_rod"]],
    description: "In the entrance area of the Temple of Time, before entering the dungeon itself, there is an Owl Statue to either side of the exit. Use the Dominion Rod to move the one on the east side to reveal an alcove housing a large chest containing the Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_37.jpg"
  },
  {
    id: "hp-38",
    index: 38,
    location: "Hidden Village",
    conditions: [["ilias_memory"]],
    description: "After returning Ilia's Charm to her, you can return to the Hidden Village and you'll find a ton of cats everywhere. If you talk to the cats as a wolf, they'll say you should find the 'cucco leader'. Break through the glass of the large building on the east side to find the Cucco, who asks you to play with the cats by speaking to all 20 of them across the village. If successful, you'll be rewarded with a Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_38.jpg"
  },
  {
    id: "hp-39",
    index: 39,
    location: "Bridge of Eldin",
    conditions: [["dominion_rod"]],
    description: "On the north side of the Bridge of Eldin, you'll find an Owl Statue on an upper ledge. Use the Dominion Rod to pull it down and walk it to the south side of the bridge. Drop it down into the lower area at the end, and use it to jump across to a ladder. This takes you up on top of the wall next to the bridge, where a Bulblin Archer guards a chest with the Piece of Heart.",
    image: "/img/hearth/400px-Tp_heart_39.jpg"
  },
  {
    id: "hp-40",
    index: 40,
    location: "Ordon Woods",
    conditions: [["dominion_rod"]],
    description: "Once you have acquired the Dominion Rod, go to Ordon Woods (just north of Ordon Village, near Coro the Lantern Salesman). Move the Owl Statue into the circular hole in the ground on the other side of the tree. A short cinematic will show it moving across. Transform into a wolf, stand on the rock, and use Midna's jump to reach an upper area just above the Faron Woods containing a hidden chest.",
    image: "/img/hearth/400px-Tp_heart_40.jpg"
  },
  {
    id: "hp-41",
    index: 41,
    location: "City in the Sky",
    conditions: [["double_clawshots"]],
    description: "In the large cylinder-shaped room with the Big Baba at the bottom, reach the 2nd floor and work your way across the skinny platforms. Once at the far west side, shoot the two Keese hanging from the ceiling of the alcove, grab onto the wall on your left using the Clawshot, and crawl across. Drop down to find the chest.",
    image: "/img/hearth/400px-Tp_heart_41.jpg"
  },
  {
    id: "hp-42",
    index: 42,
    location: "City in the Sky",
    conditions: [["double_clawshots"]],
    description: "In the southern portion of the dungeon on the 3rd floor, there's an outdoors area where a ton of Peahats form a 'V' shape. Using the Double Clawshots, grapple along them to the south to reach an otherwise unreachable platform with a large chest.",
    image: "/img/hearth/400px-Tp_heart_42.jpg"
  },
  {
    id: "hp-43",
    index: 43,
    location: "Kakariko Gorge",
    conditions: [["double_clawshots"]],
    description: "In the far west side of Kakariko Gorge, there's a large rock formation out in the abyss with a target on it. Once you have the Double Clawshots, grapple back and forth to reach some lower vines. Climb around to the other side to find a platform with a large chest.",
    image: "/img/hearth/400px-Tp_heart_43.jpg"
  },
  {
    id: "hp-44",
    index: 44,
    location: "Palace of Twilight",
    conditions: [["sol", "master_sword"]],
    description: "In the east wing of the dungeon, there are four 'waterfalls' of black fog. In one of them is an alcove with a chest. Place the Sol near the fogfall to make it temporarily disappear, then Clawshot the target against the wall to get to the upper area containing the chest. Alternatively, return when the Master Sword is infused with Light.",
    image: "/img/hearth/400px-Tp_heart_44.jpg"
  },
  {
    id: "hp-45",
    index: 45,
    location: "Palace of Twilight",
    conditions: [["sol", "master_sword"]],
    description: "In the first room of the west wing of the dungeon, there's a dark orb to the far north on the lower level. Expose it to the light of the Sol to activate two platforms. The eastern platform takes you to an alcove with a large chest containing the final Piece of Heart. Alternatively, return when the Master Sword is infused with Light.",
    image: "/img/hearth/400px-Tp_heart_45.jpg"
  }
];

export const poeSouls: Collectible[] = [
  {
    id: "poe-1",
    index: 1,
    location: "Jovani's House",
    conditions: [],
    description: "Found on the way to the Castle Town Sewers, hovering above a mountain of gold. (This is the first Poe you encounter).",
    image: "/img/souls/PoeSoul_01.jpg"
  },
  {
    id: "poe-2",
    index: 2,
    location: "Sacred Grove",
    conditions: [["master_sword"]],
    description: "In the area where Link fought Skull Kid, there's a boulder. Blow it up with a Bomb and kill the Imp Poe.",
    image: "/img/souls/PoeSoul_02.jpg"
  },
  {
    id: "poe-3",
    index: 3,
    location: "Lake Hylia Cavern",
    conditions: [["master_sword"]],
    description: "In one of the rooms with a Lantern in the center, near the beginning.",
    image: "/img/souls/PoeSoul_03.jpg"
  },
  {
    id: "poe-4",
    index: 4,
    location: "Lake Hylia Cavern",
    conditions: [["master_sword"]],
    description: "In one of the rooms with a Lantern in the center, near the end.",
    image: "/img/souls/PoeSoul_04.jpg"
  },
  {
    id: "poe-5",
    index: 5,
    location: "Lake Hylia Cavern",
    conditions: [["master_sword"]],
    description: "In the final room, where there is a Piece of Heart and this Imp Poe.",
    image: "/img/souls/PoeSoul_05.jpg"
  },
  {
    id: "poe-6",
    index: 6,
    location: "Lake Hylia",
    conditions: [["master_sword"]],
    description: "At the bottom of the high tower to the east (Wii) or west (GCN/HD), only at night.",
    image: "/img/souls/PoeSoul_06.jpg"
  },
  {
    id: "poe-7",
    index: 7,
    location: "Lake Hylia",
    conditions: [["master_sword"]],
    description: "In the southernmost area there will be a Poe hovering around at night.",
    image: "/img/souls/PoeSoul_07.jpg"
  },
  {
    id: "poe-8",
    index: 8,
    location: "Lake Hylia",
    conditions: [["master_sword"]],
    description: "On the small island in the far west (Wii) or east (GCN/HD), and only at night.",
    image: "/img/souls/PoeSoul_08.jpg"
  },
  {
    id: "poe-9",
    index: 9,
    location: "Lake Hylia",
    conditions: [["master_sword"]],
    description: "Use Falbi's Flight-by-Fowl and immediately do a complete U-turn. There is a platform located under the game that has a Poe at night.",
    image: "/img/souls/PoeSoul_09.jpg"
  },
  {
    id: "poe-10",
    index: 10,
    location: "Isle of Riches",
    conditions: [["master_sword"]],
    description: "Use Falbi's Flight-by-Fowl and fly to the square island beside Fyer's Cannon, called the Isle of Riches. On the second platform from the bottom there is a Poe at night.",
    image: "/img/souls/PoeSoul_10.jpg"
  },
  {
    id: "poe-11",
    index: 11,
    location: "Upper Zora's River",
    conditions: [["master_sword"]],
    description: "Where the river forks is a chunk of land in between it. Swim over there at night to find an Imp Poe.",
    image: "/img/souls/PoeSoul_11.jpg"
  },
  {
    id: "poe-12",
    index: 12,
    location: "Zora's Domain",
    conditions: [["master_sword"]],
    description: "From the water, swim over to the chunk of land to the west (Wii) or east (GCN/HD) and follow it to the end to find a Poe at night.",
    image: "/img/souls/PoeSoul_12.jpg"
  },
  {
    id: "poe-13",
    index: 13,
    location: "Zora's Domain",
    conditions: [["master_sword"]],
    description: "On the east (Wii) or west (GCN/HD) side there is a ledge where Link can use Midna's Jump to reach a higher ledge. Follow the path to find a Poe in the way.",
    image: "/img/souls/PoeSoul_13.jpg"
  },
  {
    id: "poe-14",
    index: 14,
    location: "Graveyard",
    conditions: [["master_sword"]],
    description: "Push the first tombstone on the left (Wii) or right (GCN/HD) and the Poe will appear at night.",
    image: "/img/souls/PoeSoul_14.jpg"
  },
  {
    id: "poe-15",
    index: 15,
    location: "Graveyard",
    conditions: [["master_sword"]],
    description: "In the middle of the graveyard at night.",
    image: "/img/souls/PoeSoul_15.jpg"
  },
  {
    id: "poe-16",
    index: 16,
    location: "Kakariko Village",
    conditions: [["master_sword"]],
    description: "Hovering around the destroyed Storehouse above the Bomb Shop.",
    image: "/img/souls/PoeSoul_16.jpg"
  },
  {
    id: "poe-17",
    index: 17,
    location: "Kakariko Village",
    conditions: [["master_sword"]],
    description: "Follow the ramp up from the Storehouse and beside the Lookout Tower will be a Poe at night.",
    image: "/img/souls/PoeSoul_17.jpg"
  },
  {
    id: "poe-18",
    index: 18,
    location: "Death Mountain",
    conditions: [["master_sword"]],
    description: "On the way up the mountain there will be a Goron who will offer to give Link a ride up the cliff. Accept but instead of aiming up, aim to the right. Climb up and there will be a Poe floating around at night.",
    image: "/img/souls/PoeSoul_18.jpg"
  },
  {
    id: "poe-19",
    index: 19,
    location: "Kakariko Gorge Cavern",
    conditions: [["master_sword"]],
    description: "In the deepest room of the Cavern there is a Poe, at night or day. In the Wii version go left, left, right, right; in the GCN and HD versions, it is right, right, left, left.",
    image: "/img/souls/PoeSoul_19.jpg"
  },
  {
    id: "poe-20",
    index: 20,
    location: "Kakariko Gorge",
    conditions: [["master_sword"]],
    description: "Beside the tree on the raised platform in the middle of the area. Only around at night.",
    image: "/img/souls/PoeSoul_20.jpg"
  },
  {
    id: "poe-21",
    index: 21,
    location: "Hyrule Field",
    conditions: [["master_sword"]],
    description: "In the portion of Hyrule Field found in the Faron Province, right in the middle area at night.",
    image: "/img/souls/PoeSoul_21.jpg"
  },
  {
    id: "poe-22",
    index: 22,
    location: "South of the Great Bridge of Hylia",
    conditions: [["master_sword"]],
    description: "In the area north of the Great Bridge of Hylia, there are some boulders high above that can be destroyed with a Bomb Arrow. Behind them will be a series of Clawshot targets. Follow the path of them which will lead to a Poe at night.",
    image: "/img/souls/PoeSoul_22.jpg"
  },
  {
    id: "poe-23",
    index: 23,
    location: "Hyrule Field",
    conditions: [["master_sword"]],
    description: "In the east (Wii) or west (GCN/HD) area of Hyrule Field, at the southern section with all the ruins, there will be a Poe at night.",
    image: "/img/souls/PoeSoul_23.jpg"
  },
  {
    id: "poe-24",
    index: 24,
    location: "Hyrule Field",
    conditions: [["master_sword"]],
    description: "In the area south of Castle Town, there will be a Poe on the flight of stairs there at night.",
    image: "/img/souls/PoeSoul_24.jpg"
  },
  {
    id: "poe-25",
    index: 25,
    location: "Sacred Grove",
    conditions: [["master_sword"]],
    description: "Exit Castle Town on the west (Wii) or east (GCN/HD) side and there will be a Poe on the bridge at night.",
    image: "/img/souls/PoeSoul_25.jpg"
  },
  {
    id: "poe-26",
    index: 26,
    location: "Faron Woods",
    conditions: [["master_sword"]],
    description: "In the area with the purple fog, follow Midna as a Wolf with the special jump and continue until reaching a circular area. At night, there is a Poe hovering around.",
    image: "/img/souls/PoeSoul_26.jpg"
  },
  {
    id: "poe-27",
    index: 27,
    location: "Hyrule Field",
    conditions: [["master_sword"]],
    description: "After entering North Hyrule Field from East Hyrule Field (Wii) or West Hyrule Field (GCN/HD), keep going straight to find a circle of grass that is bare in the middle. Use Wolf Link's senses to find a spot to dig. Inside this grotto, defeat the Deku Babas and kill this Poe.",
    image: "/img/souls/PoeSoul_27.jpg"
  },
  {
    id: "poe-28",
    index: 28,
    location: "Hyrule Field",
    conditions: [["master_sword"]],
    description: "The second Poe Soul in the bare grass circle grotto described in Poe Soul #27.",
    image: "/img/souls/PoeSoul_28.jpg"
  },
  {
    id: "poe-29",
    index: 29,
    location: "Hyrule Field",
    conditions: [["master_sword"]],
    description: "In North Hyrule Field on the bridge in the center at night.",
    image: "/img/souls/PoeSoul_29.jpg"
  },
  {
    id: "poe-30",
    index: 30,
    location: "Gerudo Desert",
    conditions: [["master_sword"]],
    description: "As soon as Link enters the Desert, turn to the south and run over to the small rock platform. Around this area will be a Poe at night.",
    image: "/img/souls/PoeSoul_30.jpg"
  },
  {
    id: "poe-31",
    index: 31,
    location: "Gerudo Desert",
    conditions: [["master_sword"]],
    description: "In the far northwest (Wii) or northeast (GCN/HD) there will be a Peahat tree-thing that Link can Clawshot up to. Turn right and run to the area with three skulls in a circle on the floor. At night there will be a Poe floating about.",
    image: "/img/souls/PoeSoul_31.jpg"
  },
  {
    id: "poe-32",
    index: 32,
    location: "Gerudo Desert",
    conditions: [["master_sword"]],
    description: "In between the three skulls from the location of Poe Soul #31 is an underground cave. Inside there are two Imp Poes. This is the first one.",
    image: "/img/souls/PoeSoul_32.jpg"
  },
  {
    id: "poe-33",
    index: 33,
    location: "Gerudo Desert",
    conditions: [["master_sword"]],
    description: "The second Poe Soul in the three skulls grotto described in Poe Soul #32.",
    image: "/img/souls/PoeSoul_33.jpg"
  },
  {
    id: "poe-34",
    index: 34,
    location: "Gerudo Mesa",
    conditions: [["master_sword"]],
    description: "After warping to this area, there will be a Poe high above at night.",
    image: "/img/souls/PoeSoul_34.jpg"
  },
  {
    id: "poe-35",
    index: 35,
    location: "Gerudo Desert",
    conditions: [["master_sword"]],
    description: "Right before entering the next area of the Desert at the far north spot, turn right (Wii) or left (GCN/HD) and follow the path. At the end will be a Poe lingering at night.",
    image: "/img/souls/PoeSoul_35.jpg"
  },
  {
    id: "poe-36",
    index: 36,
    location: "Bulblin Fortress",
    conditions: [["master_sword"]],
    description: "After defeating King Bulblin and escaping from the flaming area, Link can find a Poe at night where he fought King Bulblin.",
    image: "/img/souls/PoeSoul_36.jpg"
  },
  {
    id: "poe-37",
    index: 37,
    location: "Outside Arbiter's Grounds",
    conditions: [["master_sword"]],
    description: "In the area just outside of the Arbiter's Grounds, there is a Poe on the side corridor beside the door.",
    image: "/img/souls/PoeSoul_37.jpg"
  },
  {
    id: "poe-38",
    index: 38,
    location: "Arbiter's Grounds",
    conditions: [["master_sword", "clawshot"]],
    description: "Poe #38 is one of four required Poe Souls in the game, and can be found inside of the Arbiter's Grounds. Sniff the Poe Scent in order to track down its location.",
    image: "/img/souls/PoeSoul_38.jpg"
  },
  {
    id: "poe-39",
    index: 39,
    location: "Arbiter's Grounds",
    conditions: [["master_sword", "clawshot"]],
    description: "Poe #39 is one of four required Poe Souls in the game, and can be found inside of the Arbiter's Grounds. Sniff the Poe Scent in order to track down its location.",
    image: "/img/souls/PoeSoul_39.jpg"
  },
  {
    id: "poe-40",
    index: 40,
    location: "Arbiter's Grounds",
    conditions: [["master_sword", "clawshot"]],
    description: "Poe #40 is one of four required Poe Souls in the game, and can be found inside of the Arbiter's Grounds. Sniff the Poe Scent in order to track down its location.",
    image: "/img/souls/PoeSoul_40.jpg"
  },
  {
    id: "poe-41",
    index: 41,
    location: "Arbiter's Grounds",
    conditions: [["master_sword", "clawshot"]],
    description: "Poe #41 is one of four required Poe Souls in the game, and can be found inside of the Arbiter's Grounds. Sniff the Poe Scent in order to track down its location.",
    image: "/img/souls/PoeSoul_41.jpg"
  },
  {
    id: "poe-42",
    index: 42,
    location: "Snowpeak",
    conditions: [["master_sword"]],
    description: "On the way up Snowpeak, Link will pass through two large rocks that are close together. Directly on the other side to the right is a Poe, only at night.",
    image: "/img/souls/PoeSoul_42.jpg"
  },
  {
    id: "poe-43",
    index: 43,
    location: "Snowpeak",
    conditions: [["master_sword"]],
    description: "While following the Reekfish Scent, the smell goes up a cliff. Turn right (Wii) or left (GCN/HD) and follow the ramp. At the top, turn right (Wii) or left (GCN/HD) to find a Poe hovering beside a lone tree, only at night.",
    image: "/img/souls/PoeSoul_43.jpg"
  },
  {
    id: "poe-44",
    index: 44,
    location: "Snowpeak",
    conditions: [["master_sword"]],
    description: "Following the Reekfish Scent will eventually lead to a fork in the road. Turn left (Wii) or right (GCN/HD) to find a Poe hanging out on the first tree in the area.",
    image: "/img/souls/PoeSoul_44.jpg"
  },
  {
    id: "poe-45",
    index: 45,
    location: "Outside Snowpeak Ruins",
    conditions: [["master_sword"]],
    description: "In the area just outside of the Snowpeak Ruins, there is a spiraling hill that Link can climb to the top of. At the top is a Poe at night.",
    image: "/img/souls/PoeSoul_45.jpg"
  },
  {
    id: "poe-46",
    index: 46,
    location: "Snowpeak Ruins",
    conditions: [["master_sword"]],
    description: "Floating in the center of the first room in the dungeon.",
    image: "/img/souls/PoeSoul_46.jpg"
  },
  {
    id: "poe-47",
    index: 47,
    location: "Snowpeak Ruins",
    conditions: [["ball_and_chain"]],
    description: "In the first room, there are armored statues that can be destroyed with the Ball and Chain. After one has been destroyed, an Imp Poe will appear.",
    image: "/img/souls/PoeSoul_47.jpg"
  },
  {
    id: "poe-48",
    index: 48,
    location: "Snowpeak Ruins",
    conditions: [["ball_and_chain"]],
    description: "In the room directly above the kitchen, there is a large wall of ice that when destroyed reveals a Poe hiding behind it.",
    image: "/img/souls/PoeSoul_48.jpg"
  },
  {
    id: "poe-49",
    index: 49,
    location: "Snowpeak Top",
    conditions: [["ball_and_chain"]],
    description: "After warping to the Snowpeak Top area, enter the cave to the north. Eventually Link will enter an area with ice chunks on both sides. The one on the right (Wii) or left (GCN/HD) hides an Imp Poe.",
    image: "/img/souls/PoeSoul_49.jpg"
  },
  {
    id: "poe-50",
    index: 50,
    location: "Sacred Grove",
    conditions: [["master_sword"]],
    description: "In the area that Link chases Skull Kid around, swim through a waterfall and climb a ledge which leads to an Imp Poe.",
    image: "/img/souls/PoeSoul_50.jpg"
  },
  {
    id: "poe-51",
    index: 51,
    location: "Sacred Grove",
    conditions: [["master_sword"]],
    description: "In the area with the Pedestal of Time, only at night.",
    image: "/img/souls/PoeSoul_51.jpg"
  },
  {
    id: "poe-52",
    index: 52,
    location: "Temple of Time",
    conditions: [["dominion_rod"]],
    description: "On the seventh floor, put a ton of weight on one side to lift Link higher than the pivot. Clawshot to the target in the center of the ceiling, walk to the rails, and use the Spinner to slide over to the high southern platform. Kill the Imp Poe.",
    image: "/img/souls/PoeSoul_52.jpg"
  },
  {
    id: "poe-53",
    index: 53,
    location: "Temple of Time",
    conditions: [["dominion_rod"]],
    description: "Go to the large round room on the third floor, where there is a Poe behind a gate to the east (Wii) or west (GCN/HD). Use the Dominion Rod to move the little metal jars onto the switch behind the gate, or smash it with the giant statue's hammer.",
    image: "/img/souls/PoeSoul_53.jpg"
  },
  {
    id: "poe-54",
    index: 54,
    location: "Sacred Grove (Past)",
    conditions: [["dominion_rod"]],
    description: "In the past area of the Sacred Grove, there are two Owl Statues on either side of the staircase. One hides a Piece of Heart, and the other an Imp Poe.",
    image: "/img/souls/PoeSoul_54.jpg"
  },
  {
    id: "poe-55",
    index: 55,
    location: "Hidden Village",
    conditions: [["bow"]],
    description: "In the Hidden Village on top of one of the balconies at night.",
    image: "/img/souls/PoeSoul_55.jpg"
  },
  {
    id: "poe-56",
    index: 56,
    location: "City in the Sky",
    conditions: [["double_clawshots"]],
    description: "In the room with all the moving Peahats, there is a small island to the west (Wii) or east (GCN/HD) that houses an Imp Poe.",
    image: "/img/souls/PoeSoul_56.jpg"
  },
  {
    id: "poe-57",
    index: 57,
    location: "City in the Sky",
    conditions: [["double_clawshots"]],
    description: "In the outdoor room above the main room of the dungeon, there is a platform on the west (Wii) or east (GCN/HD) side that has a chest and an Imp Poe floating around.",
    image: "/img/souls/PoeSoul_57.jpg"
  },
  {
    id: "poe-58",
    index: 58,
    location: "Cave of Ordeals",
    conditions: [["spinner"]],
    description: "On the 17th floor of the Cave of Ordeals.",
    image: "/img/souls/PoeSoul_58.jpg"
  },
  {
    id: "poe-59",
    index: 59,
    location: "Cave of Ordeals",
    conditions: [["dominion_rod"]],
    description: "On the 33rd floor of the Cave of Ordeals.",
    image: "/img/souls/PoeSoul_59.jpg"
  },
  {
    id: "poe-60",
    index: 60,
    location: "Cave of Ordeals",
    conditions: [["double_clawshots"]],
    description: "On the 44th floor of the Cave of Ordeals.",
    image: "/img/souls/PoeSoul_60.jpg"
  }
];

export const goldenBugs: Collectible[] = [
  {
    id: "bug-male-beetle",
    index: 1,
    name: "Scarabée (Mâle)",
    location: "Hyrule Field (Faron Province)",
    conditions: [],
    description: "Found on a tree in the Faron Province Hyrule Field, just near the transition to the woods.",
    image: null
  },
  {
    id: "bug-female-beetle",
    index: 2,
    name: "Scarabée (Femelle)",
    location: "Hyrule Field (Faron Province)",
    conditions: [["boomerang"]],
    description: "Found on a high ledge in the Faron Province Hyrule Field. Use the Gale Boomerang to pull it to you.",
    image: null
  },
  {
    id: "bug-male-pillbug",
    index: 3,
    name: "Cloporte (Mâle)",
    location: "Kakariko Gorge",
    conditions: [],
    description: "Near the bridge in Kakariko Gorge, crawling around on the ground near some trees.",
    image: null
  },
  {
    id: "bug-female-pillbug",
    index: 4,
    name: "Cloporte (Femelle)",
    location: "Kakariko Gorge",
    conditions: [["boomerang"]],
    description: "In an opening in the flowers/grass to the south of the gorge. Use the Gale Boomerang.",
    image: null
  },
  {
    id: "bug-male-ant",
    index: 5,
    name: "Fourmi (Mâle)",
    location: "Kakariko Village",
    conditions: [],
    description: "Found in the graveyard, crawling around on one of the tombstones on the right.",
    image: null
  },
  {
    id: "bug-female-ant",
    index: 6,
    name: "Fourmi (Femelle)",
    location: "Kakariko Village",
    conditions: [],
    description: "Inside one of the empty houses in the village, crawling around on the floor.",
    image: null
  },
  {
    id: "bug-male-grasshopper",
    index: 7,
    name: "Criquet (Mâle)",
    location: "Hyrule Field (Eldin Province)",
    conditions: [],
    description: "Near the center of the Eldin Province Hyrule Field, jumping around in the grass.",
    image: null
  },
  {
    id: "bug-female-grasshopper",
    index: 8,
    name: "Criquet (Femelle)",
    location: "Hyrule Field (Eldin Province)",
    conditions: [["boomerang"]],
    description: "Located on a high ledge in the northeastern section of the Eldin field. Use the Gale Boomerang.",
    image: null
  },
  {
    id: "bug-male-phasmid",
    index: 9,
    name: "Phasme (Mâle)",
    location: "Bridge of Eldin",
    conditions: [["boomerang"], ["clawshot"]],
    description: "On the southern arch of the Bridge of Eldin. Use the Gale Boomerang or Clawshot to pull it.",
    image: null
  },
  {
    id: "bug-female-phasmid",
    index: 10,
    name: "Phasme (Femelle)",
    location: "Bridge of Eldin",
    conditions: [["boomerang"], ["clawshot"]],
    description: "On the northern wall cliff-face near the Bridge of Eldin. Use the Gale Boomerang or Clawshot.",
    image: null
  },
  {
    id: "bug-male-mantis",
    index: 11,
    name: "Mante Religieuse (Mâle)",
    location: "Great Bridge of Hylia",
    conditions: [["boomerang"]],
    description: "Flying around the northern arch of the Great Bridge of Hylia. Use the Gale Boomerang.",
    image: null
  },
  {
    id: "bug-female-mantis",
    index: 12,
    name: "Mante Religieuse (Femelle)",
    location: "Great Bridge of Hylia",
    conditions: [["boomerang"]],
    description: "On the cliff walls just south of the Great Bridge of Hylia. Use the Gale Boomerang.",
    image: null
  },
  {
    id: "bug-male-dragonfly",
    index: 13,
    name: "Libellule (Mâle)",
    location: "Zora's River/Zora's Domain",
    conditions: [],
    description: "Near the waterfall basin in Zora's Domain, flying over the water near the shore.",
    image: null
  },
  {
    id: "bug-female-dragonfly",
    index: 14,
    name: "Libellule (Femelle)",
    location: "Zora's River/Zora's Domain",
    conditions: [["boomerang"], ["clawshot"]],
    description: "Flying above the river path in Upper Zora's River. Use the Gale Boomerang or Clawshot.",
    image: null
  },
  {
    id: "bug-male-butterfly",
    index: 15,
    name: "Papillon (Mâle)",
    location: "East (Wii) Hyrule Field",
    conditions: [],
    description: "Found in the flower patch near the eastern exit of Castle Town.",
    image: null
  },
  {
    id: "bug-female-butterfly",
    index: 16,
    name: "Papillon (Femelle)",
    location: "East (Wii) Hyrule Field",
    conditions: [["boomerang"], ["clawshot"]],
    description: "Located high on a ledge in the eastern field. Use the Gale Boomerang or Clawshot.",
    image: null
  },
  {
    id: "bug-male-stagbeetle",
    index: 17,
    name: "Lucane (Mâle)",
    location: "North Hyrule Field",
    conditions: [["bombs"], ["boomerang"]],
    description: "On a tree in the northern rocky area of Hyrule Field. Blow up the blocking rocks to access.",
    image: null
  },
  {
    id: "bug-female-stagbeetle",
    index: 18,
    name: "Lucane (Femelle)",
    location: "North Hyrule Field",
    conditions: [["boomerang"]],
    description: "Inside a rocky cleft in the north field. Use the Gale Boomerang.",
    image: null
  },
  {
    id: "bug-male-ladybug",
    index: 19,
    name: "Coccinelle (Mâle)",
    location: "South Hyrule Field",
    conditions: [],
    description: "Found flying around the flower beds just outside the southern exit of Castle Town.",
    image: null
  },
  {
    id: "bug-female-ladybug",
    index: 20,
    name: "Coccinelle (Femelle)",
    location: "South Hyrule Field",
    conditions: [],
    description: "On the ground near the stone pillars in the southern field.",
    image: null
  },
  {
    id: "bug-male-dayfly",
    index: 21,
    name: "Éphémère (Mâle)",
    location: "Gerudo Desert",
    conditions: [["master_sword"]],
    description: "Flying around in the southern area of the Gerudo Desert sand dunes.",
    image: null
  },
  {
    id: "bug-female-dayfly",
    index: 22,
    name: "Éphémère (Femelle)",
    location: "Gerudo Desert",
    conditions: [["master_sword"]],
    description: "Inside one of the trenches in the southern part of the Gerudo Desert dunes.",
    image: null
  },
  {
    id: "bug-male-snail",
    index: 23,
    name: "Escargot (Mâle)",
    location: "Sacred Grove",
    conditions: [["master_sword"]],
    description: "On the alcove wall near the entrance where you search for the Master Sword.",
    image: null
  },
  {
    id: "bug-female-snail",
    index: 24,
    name: "Escargot (Femelle)",
    location: "Sacred Grove",
    conditions: [["master_sword"]],
    description: "On the ceiling of the small cave area in the Sacred Grove. Use the Gale Boomerang.",
    image: null
  }
];
