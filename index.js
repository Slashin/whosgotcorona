const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require("axios");
const cheerio = require("cheerio");
const People = require('./models/people');
const Images = require('./models/images');

var Scraper = require('images-scraper');

require('events').EventEmitter.defaultMaxListeners = 100;
 
const google = new Scraper({
  puppeteer: {
    headless: true,
  }
});

// var gis = require('g-i-s');

var app = express();

app.use(bodyParser.json());
app.use(cors());

const people = require('./routes/db/people');
const images = require('./routes/db/images');


var PORT = process.env.PORT || 5000;

// DB config

const db = require('./config/keys').mongoURI;

//Connect to MongoDB
app.use('/db/people', people);
app.use('/db/images', images);


mongoose.connect(db)
    .then(()=>{
        console.log("MongoDB Connected")
    }).catch(err=>{
        console.log(err);
    });

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));
  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client','build','index.html'))
  })
}

const siteUrl = "https://www.aljazeera.com/news/2020/03/coronavirus-pandemic-politicians-celebs-affected-200315165416470.html";
// let query = "barack obama"
// let imgSiteUrl = 'https://www.google.com/search?q=' + query + '&tbm=isch';

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  const $ = await cheerio.load(result.data);

  let arr = [];
  let i = 0, count = 0;
  let name, desc;
  let arr1 = [];
  let arr2 = [];
  let arr3 = [];

  $('strong').map((index,elem)=>{
    // arr.push($(elem));
    name = $(elem).text();
    let split = name.split(" ");
    let finalname = split[0] + " " + split[1];

    desc = $(elem).parent().text();

    arr1.push(finalname);
    arr2.push(desc);
  })

  let nameset = new Set(arr1);
  // let descset = new Set(arr2);

  let namearr = Array.from(nameset);

  namearr.map((name)=>{
    let match = arr2.find((desc)=>{
      return desc.includes(name);
    })
    if(match){
      let cleanmatch = match.replace(name, "");
      arr3.push({name, desc: cleanmatch});
     
    }

  })


  // const Person = new People({
  //   data:arr3
  // });
  // Person.save().then(user=>console.log(user));
  People.update(
    {data:arr3}
  ).then(()=>console.log('People Updated'))
  console.log(arr3.length);
  fetchImgs(arr3);
};

let imgarr = [];

const fetchImgs = (arr3) => {
  arr3.map((elem)=>{
    google.scrape(elem.name, 1).then((results)=>{
      console.log(results);
      imgarr.push({name: elem.name, image: results[0].url});
      Images.update( 
        {images: imgarr}
    ).then(()=>console.log('Images Updated'))
      // const Image = new Images({
      //   images: imgarr
      // });
      // Image.save().then(images=>console.log(images));
    })
  })
  // const Image = new Images({
  //   images: imgarr
  // });
  // Image.save().then(images=>console.log(images));
  
};


// fetchData();

app.listen(PORT, (err)=>{
    console.log(`Listening on port ${PORT}`);
})

