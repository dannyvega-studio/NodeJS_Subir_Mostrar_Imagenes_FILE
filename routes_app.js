const express = require("express");
const Imagen = require("./models/imagenes");
var router = express.Router(); //objeto para crear las rutas de direccion
var image_finder_middleware = require("./middlewares/find_image");
const fs = require("fs");

router.get("/",function(req,res){
    /*Buscar el ususario*/
    Imagen.find({})
        .populate("creator")
        .exec(function(err,imagenes){
            if(err)console.log(err);
            res.render("app/home",{imagenes:imagenes});
        });
});

// REST //

router.get("/imagenes/new",function(req,res){
    res.render("app/imagenes/new");
});

//para todas las rutas que tienen en su url :id aplica lo siguiente
router.all("/imagenes/:id*",image_finder_middleware)

//editar imagenes
router.get("/imagenes/:id/edit",function(req,res){
        res.render("app/imagenes/edit");
});

//crear coleccion de imagenes
router.route("/imagenes/:id")
.get(function(req,res){
        res.render("app/imagenes/show");
}).put(function(req,res){
            res.locals.imagen.title = req.body.title;
            res.locals.imagen.save(function(err){
                if(!err){
                    res.render("app/imagenes/show");
                }else{
                    res.render("app/imagenes/"+req.params.id+"/edit");
                }
            });
            //res.render("app/imagenes/show");
}).delete(function(req,res){
    Imagen.findOneAndRemove({_id: req.params.id},function(err){
        if(!err){
            res.redirect("/app/imagenes");
        }else{
            console.log(err);
            res.redirect("/app/imagenes"+req.params.id);
        }
    });
});

//crear una nueva imagen
router.route("/imagenes")
.get(function(req,res){
    Imagen.find({creator: res.locals.user._id},function(err,imagenes){
        if(err){
            res.redirect("/app");
            return;}
        res.render("app/imagenes/index",{imagenes: imagenes});
    });
}).post(function(req,res){
    
    console.log(req.files.archivo + req.files.archivo.name);
    
    //arreglo para separar en string el nombre de la imagen y popo acomoda la extension
    var extension = req.files.archivo.name.split(".").pop();

    var imagen = new Imagen({title: req.body.title,creator: res.locals.user._id, extension});
    
    imagen.save(function(err){ 
        if(!err){
            fs.rename(req.files.archivo.path,"public/imagenes/"+imagen._id+"."+extension, function(){
                res.redirect("/app/imagenes/"+imagen._id);
            });
            
        }else{
            console.log(imagen);
            res.render(err);
        }
    });
});

module.exports = router; //permite exportar objetos
