const express = require('express');
const router = express.Router();

const People = require('../../models/people');
const Images = require('../../models/images');


// GETS

router.get("/", (req,res) => {
    // People.find()
    //     .then(people=>res.json(people));
    let arr = [];
    let count = 1;
    People.find()
        .then(people=>{
            let peopleData = people[0].data;
            // console.log(peopleData);
            peopleData.map((person, index)=>{
                Images.find().then((images)=>{
                    let currImg = images[0].images.find((image)=>{
                        return image.name === person.name;
                    })
                    imageUrl  = currImg ? currImg.image : "";
                    // images[0].name == person.name;
                    let currPerson = [{img:imageUrl, name:person.name, desc:person.desc, latest:person.latest}]
                    arr.push(currPerson);
                    // console.log(count, " ", peopleData.length);
                    if(count>=peopleData.length){
                        res.send(arr);
                    }
                    count++;
                    // console.log(currPerson);
                })
                
            })
            
            
        });
    
    
});

router.get("/one", (req,res) => {
    Users.find({email: req.query.email})
        .then(users=>res.json(users));
});



// POSTS

router.post("/", (req,res) => {
    const newUser = new Users({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        customWords: req.body.customWords,
        email: req.body.email
    });

    newUser.save().then(user=>res.json(user));
});

router.post("/addword", (req,res) => {
    Users.update( 
        {email: req.body.email},
        { $addToSet: { customWords: {value:req.body.value, color: req.body.color, count: 0} } }
    ).then(()=>res.send('New Word Added'))
    
});

router.post("/removeword", (req,res) => {
    Users.update( 
        {email: req.body.email},
        { $pull: { customWords: {value:req.body.value} } }
    ).then(()=>res.send('Word Deleted'))
    
});

router.post("/increment", (req,res) => {
    Users.update( 
        {email: req.body.email, 'customWords.value': req.body.word},
        {$inc:{"customWords.$.count":1}}
    ).then(()=>res.send('Count Incremented'))
    
});

router.post("/usage", (req,res) => {
    Users.update( 
        {email: req.body.email},
        { $addToSet: { usage: {date:req.body.date, usageVal: 0} } },
        {upsert:true}
    ).then(()=>res.send('Usage Updated'))
    
});

router.post("/usageInc", (req,res) => {
    Users.update( 
        {email: req.body.email, 'usage.date': req.body.date},
        {$inc:{'usage.$.usageVal':req.body.usage}},
        {upsert:true}
    ).then(()=>res.send('Usage Updated'))
    
});

router.post("/addProfilePic", (req,res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        
        return res.status(200).send(req.file.location);
    })
});

router.post("/addProfilePicToDb", (req,res) => {
    Users.update( 
        {email: req.body.email},
        {$set: {
            profileImgLink: req.body.fileName
          }
        }
    ).then(()=>res.send('pic added to db'))
    
});

module.exports = router;