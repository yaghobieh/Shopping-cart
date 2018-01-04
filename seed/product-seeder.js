let mongoose = require('mongoose');
let Product = require('../models/product');

mongoose.connect('mongodb://localhost:27017/shopping', (err)=>{
    console.log('good');
    if(err) console.log(err);
});

let products = [
     new Product({
        imagePath: 'http://www.old-games.com/screenshot/t7602-1-final-doom.jpg',
        title: 'Final DOOM',
        description: 'inal Doom is a stand-alone Doom II clone that features two new 32-level episodes: Evilution and The Plutonia Experiment. Blast your way through the 3D environment in yet another attempt to save the galaxy.',
        price: 25
    }),

    new Product({
        imagePath: 'http://www.old-games.com/screenshot/t4485-1-vette-.jpg',
        title: 'Vette',
        description: 'Vette! puts players behind the wheel of one of four Corvettes as they race through the city of San Francisco, which features accurately mapped real world streets and landmarks',
        price: 15
    }),

    new Product({
        imagePath: 'http://www.old-games.com/screenshot/t7543-1-dungeon-keeper.jpg',
        title: 'Dungeon Keeper',
        description: 'If you are a gamer who enjoys an experience from a deliciously twisted point-of-view, then Dungeon Keeper from Bullfrog/EA was made just for you.',
        price: 7
    }),

    new Product({
        imagePath: 'http://www.old-games.com/screenshot/t2171-1-freespace-2.jpg',
        title: 'Freespace 2',
        description: 'In the fall of 1998, Interplay and Volition made their entry into a market that was largely dominated by Origin & Lucasarts. Descent: Freespace was perhaps a tad derivative, but it was most certainly a good time,',
        price: 20
    }),

    new Product({
        imagePath: 'http://www.old-games.com/screenshot/t7602-1-final-doom.jpg',
        title: 'XR 35: Fighter Mission',
        description: 'A very simple shoot-em-up this, so simple that if it wasnt for fear of the sack I could have just repeated the word very 150 times and ended the review there',
        price: 10
    })
];


let done = 0;
for(let i = 0; i < products.length; i++){
    products[i].save(function(err, result){
        done++;
        if(done === products.length){
            console.log('Finished!');
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}
