const express=require("express");
const Router=express.Router();
const fs = require('fs');
const path = require('path');



// Predefined list of image names
let first =  [
     {
      username: 'dhana03',
      profile_name: 'image-1715157645701.jpeg'
    },
     { username: 'Musha_4', profile_name:null},
     { username: 'pradeeptest', profile_name:null },
     { username: 'jebasharon', profile_name: null },
     { username: 'krishna580', profile_name: null }
  ];

// Route to send multiple images as base64 strings
Router.get('/images',async  (req, res) => {
    let imageNames=first.map((e)=>e.profile_name);
    const imagesDir = path.join(__dirname, '../uploads');
    const images = imageNames.map( imageName => {
        if(imageName){
            let temp=imageName;
            const imagePath = path.join(imagesDir, temp);
            const imageData = fs.readFileSync(imagePath).toString('base64');
            const ext = path.extname(imageName).toLowerCase().slice(1); // Get the extension without the dot
            return {"profile_name": `data:image/${ext};base64,${imageData}` };
            }
        else{
            return {"profile_name":null};
        }

    });
    for(let i=0;i<first.length;i++){
        first[i].profile_name=images[i].profile_name;
    }
    console.log("entered");
    console.log((images[0]).profile_name);
    res.json(first);
});

module.exports=Router
