const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require("axios");
const cheerio = require("cheerio");
const People = require('./models/people');
const Images = require('./models/images');

process.setMaxListeners(0);

const puppeteer = require('puppeteer');
const fs = require('fs');

async function getImage(pageQuery) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1200 });
    await page.setDefaultNavigationTimeout(0); 
    await page.goto(pageQuery);

    const IMAGE_SELECTOR = '#islmp img:nth-child(1)';
    let imageHref = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('src');
    }, IMAGE_SELECTOR);

    browser.close();
    return(imageHref);
}

async function getImages(arr) {
  const browser = await puppeteer.launch({
      headless: false
  });
 

  let imgarr = [];

  arr.map(async (elem)=>{
      let imgSiteUrl = 'https://www.google.com/search?q=' + elem.name + '&tbm=isch';
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 1200 });
      await page.setDefaultNavigationTimeout(0); 
      await page.goto(imgSiteUrl);

      const IMAGE_SELECTOR = '#islmp img:nth-child(1)';
      let imageHref = await page.evaluate((sel) => {
          return document.querySelector(sel).getAttribute('src');
      }, IMAGE_SELECTOR);
      console.log(elem.name);
      // console.log("image found " + imageHref.substring(0,10));

      imgarr.push({name: elem.name, image: imageHref});
      Images.update( 
          {images: imgarr}
      ).then(()=>console.log('Images Updated'))
  })

}

var Scraper = require('images-scraper');

require('events').EventEmitter.defaultMaxListeners = 100;
 
// const google = new Scraper({
//   puppeteer: {  
//     headless: true,
//   },
//   timeout: 50000
// });

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
const siteUrl2 = "https://www.nytimes.com/article/coronavirus-celebrities-actors-politicians.html";

const fetchData = async () => {
  let result = await axios.get(siteUrl);
  let $ = await cheerio.load(result.data);

  let arr = [];
  let i = 0, count = 0;
  let name, desc;
  let arr1 = [];
  let arr2 = [];
  let arr3 = [];
  let twoNameArr = [];

  $('strong').map((index,elem)=>{
    name = $(elem).text();
    cleanName = name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g,"")

    desc = $(elem).parent().text();

    arr1.push(cleanName);
    twoNameArr.push({name, cleanName});
    arr2.push(desc);
  })

  result = await axios.get(siteUrl2);
  $ = await cheerio.load(result.data);

  $('strong').map((index,elem)=>{
    name = $(elem).text();
    cleanName = name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g,"")

    desc = $(elem).parent().text();

    arr1.push(cleanName);
    twoNameArr.push({name, cleanName});
    arr2.push(desc);
  })

  // console.log(arr1);

  let nameset = new Set(arr1);

  let namearr = Array.from(nameset);

  let finalNameArr = []

  namearr.map((elem)=>{
    let match = twoNameArr.find((elem2)=>{return elem === elem2.cleanName});
    finalNameArr.push(match.name);
  })

  finalNameArr = finalNameArr.filter( (name) => {
    return name != "Prince Albert:" &&
           name != "What should I do if I feel sick?" &&
           name != "What makes this outbreak so different?" &&
           name != "Should I stock up on groceries?" &&
           name != "How do I get tested?" &&
           name != "Sophie Gregoire Trudeau:" &&
           name != "Can I go to the park?" &&
           name != "Should I pull my money from the markets?" &&
           name != "How does coronavirus spread?" &&
           name != "What if somebody in my family gets sick?" &&
           name != "What should I do with my 401(k)?" &&
           name != "Is there a vaccine yet?" &&
           name != "Should I wear a mask?"
  })

  // console.log(finalNameArr);
  // console.log(finalNameArr.length);

  finalNameArr.map((name)=>{ 
    let match = arr2.find((desc)=>{
      return desc.includes(name);
    })
    if(match){
      let cleanmatch = match.replace(name, "");
      let latest = false;
      if(cleanmatch.includes("April 1") || cleanmatch.includes("April 2")){
        latest = true;
      }
      arr3.push({name, desc: cleanmatch, latest});
     
    }

  })


  // const Person = new People({
  //   data:arr3
  // });
  // Person.save().then(user=>console.log(user));

  People.update( 
    {data:arr3}
  ).then(()=>{
    // let imgarr = [];
    // arr3.map((elem, index)=>{
    //   let imgSiteUrl = 'https://www.google.com/search?q=' + elem.name + '&tbm=isch';


    //   getImage(imgSiteUrl).then((value)=>{
    //     // console.log()
    //     console.log("image found " + value.substring(0,10));
    //     imgarr.push({name: elem.name, image: value});
    //         Images.update( 
    //           {images: imgarr}
    //       ).then(()=>console.log('Images Updated'))

    //   })
  
    // })

    
    getImages(arr3);
    
  })
  

  
};



// fetchData();


app.listen(PORT, (err)=>{
    console.log(`Listening on port ${PORT}`);
})

