//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;


const homeStartingContent = "The artist is the creator of the art but it's the spectators that live something magical through it.Blogger provides the opportunities to read/ write and live stories of people and experience their thoughts. Stories about travel, romance humour, psychology, philosophy, horror, music, history and much more.Blogger welcomes you for a lovely and heartfelt experience  about life's wonderful, adventurous and sacred moments.";
const aboutContent = "Here at Blogger it's a game of quidditch and our lovely users are the Seekers.We made sure to design Blogger as an easy to use platform for individuals to connect with people around the globe and be able to seek the content that interests them the most. We sincerely want our users to be able to share and relate with genuine and authentic content present over the vast hub of social media.As the creators, we hope you have a good time using Blogger and that it becomes special to you.For any questions, suggestions and feedbacks please feel free to reach out to us.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const server = express();

server.set('view engine', 'ejs');

server.use(bodyParser.urlencoded({extended: true}));
server.use(express.static("public"));
server.use(express.static("views"));

// let posts = [];
//
// app.get("/",function(req,res){
//   res.render("home",{startingContent:homeStartingContent,
//   posts:posts
// });
// })

server.get("/about",function(req,res){
  res.render("about",{AboutContent:aboutContent});
})

server.get("/contact",function(req,res){
  res.render("contact",{ContactContent:contactContent});
})

 //mongoose.connect("mongodb://0.0.0.0:27017/blogDB");
 mongoose.connect(process.env.MONGO_URI);

 const postSchema = {
 title: String,
 content: String
};

server.get("/compose",function(req,res){
  res.render("compose");
})

const Post = mongoose.model("Post", postSchema);

server.get("/",function(req,res){
Post.find({}).then(function(posts){
   res.render("home", {
     startingContent: homeStartingContent,
     posts: posts
     });
 });
});

server.post("/compose",function(req,res){
  const post = new Post({
    title: req.body.postTitle,
    content:req.body.postBody
  });
  post.save().then(function(err){
  if (!err){
    res.redirect("/");
  }
});
});

server.get("/posts/:postId", function(req,res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}).then(function(post){
      res.render("post", {
     title: post.title,
     content: post.content
   });
 });
});





server.listen(port, function() {
  console.log("Server started on port "+port);
});
