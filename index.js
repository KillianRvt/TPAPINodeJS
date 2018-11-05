// Module Express
var express = require('express'); 
// Module File System
var fs = require('fs');
// Paramètres du serveur
var hostname = 'localhost'; 
var port = 3000; 
 
var app = express(); 

var bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
 

var myRouter = express.Router(); 

//Middlewares
app.use((err, res, next) => {
    fs.appendFileSync('./logError.log', `[${new Date().toJSON().slice(0,10)} ${new Date().toJSON().slice(11,19)}] Error on : [${err.method}] ${err.originalUrl}\r\n`)
    next()
    });
    app.use((req, res, next) => {
    fs.appendFileSync('./logReq.log', `[${new Date().toJSON().slice(0,10)} ${new Date().toJSON().slice(11,19)}] [${req.method}] ${req.originalUrl}\r\n`)
    next()
    });

// Route de base
myRouter.route('/')
// all permet de prendre en charge toutes les méthodes. 
.all(function(req,res){ 
      res.json({message : "API TP", methode : req.method});
});


var bdd = require('./bdd')

// Route utilisateurs global
myRouter.route('/users')
// GET
.get(function(req,res){ 
    res.json(bdd.users);
    res.json({message : "Liste tous les utilisateurs", methode : req.method});
          
})
//POST
.post(function(req,res){
    res.json({message : "Ajouter un nouveau user à la liste", 
    id : req.body.id, 
    name : req.body.name, 
    password : req.body.password,
    methode : req.method});
    user = {
        id : req.body.id, 
        name : req.body.name, 
        password : req.body.password
    }
    bdd.users.push(user);
    console.log(bdd);
    fs.writeFileSync('bdd.json', JSON.stringify(bdd, null, 4));
})

// Route utilisateurs avec ID
myRouter.route('/users/:user_id')
.get(function(req,res){ 
    res.json(bdd.users[req.params.user_id-1]);
	res.json({message : "Informations du user n°" + req.params.user_id});
})
.put(function(req,res){  
    user = bdd.users.find(user => user.id == req.params.user_id);
    user.name = req.body.name;
    user.password = req.body.password;
    res.json(user);
    fs.writeFileSync('bdd.json', JSON.stringify(bdd, null, 4));
})
.delete(function(req,res){ 
    res.json({message : "Suppression du user n°" + req.params.user_id});
    bdd.users.splice(req.params.user_id-1, 1);
    fs.writeFileSync('bdd.json', JSON.stringify(bdd, null, 4));
});


// Route items global
myRouter.route('/items')
// GET
.get(function(req,res){ 
    res.json(bdd.items);          
})
//POST
.post(function(req,res){
    res.json({message : "Ajouter un nouveau items à la liste", 
    id : req.body.id, 
    label : req.body.label, 
    image : req.body.image,
    description : req.body.description,
    methode : req.method});
    item = {
        id : req.body.id, 
        label : req.body.label, 
        image : req.body.image,
        description : req.body.description
    }
    bdd.items.push(item);
    console.log(bdd);
    fs.writeFileSync('bdd.json', JSON.stringify(bdd, null, 4));
})

// Route items avec ID
myRouter.route('/items/:item_id')
.get(function(req,res){ 
    res.json(bdd.items[req.params.item_id-1]);
	res.json({message : "Informations du item n°" + req.params.item_id});
})
.put(function(req,res){  
    item = bdd.items.find(item => item.id == req.params.item_id);
    item.label = req.body.label;
    item.image = req.body.image;
    item.description = req.body.description;
    res.json(item);
    fs.writeFileSync('bdd.json', JSON.stringify(bdd, null, 4));
})
.delete(function(req,res){ 
    res.json({message : "Suppression du item n°" + req.params.item_id});
    bdd.items.splice(req.params.item_id-1, 1);
    fs.writeFileSync('bdd.json', JSON.stringify(bdd, null, 4));
});
 



// Utilisation du routeur
app.use(myRouter);  
 
// Démarrage du serveur  
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port); 
});