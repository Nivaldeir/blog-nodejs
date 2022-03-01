const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const session = require('express-session')
const connection = require('./database/database')

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const UserController = require('./user/UserController');

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./user/User')
//View engine
app.set('view engine', 'ejs')


// Sessions

// Redis
app.use(session({
    secret: 'qualquercoisa',
    cookie: {maxAge: 30000}
}))

//Static
app.use(express.static('public'))

//body parse
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

//Data base
connection.authenticate()
            .then(()=>{
                console.log("banco de dados rodando")
            })
            .catch((error)=>{
                console.log(erro)
            })



app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', UserController)

app.get('/session', (req, res)=>{
    
})

app.get('/leitura', (req, res)=>{

})
app.get("/", (req, res)=>{

    Article.findAll({
        order:[
            ['id', 'DESC']
        ], 
        limit: 4,
    }).then(articles =>{
        Category.findAll().then(categories =>{
            res.render("index", {articles: articles, categories: categories})
        })
    })
})

app.get('/artigo/:slug', (req, res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug: slug
        }
    }).then(article=>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("article", {article: article, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch( (erro) =>{res.redirect("/")})
})

app.get('/category/:slug', (req, res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug: slug,
        }, 
        include: [{model: Article}]
    }).then( category =>{
        if(category != undefined){
            Category.findAll().then(categories=>{
                res.render("index", {articles: category.articles, categories: categories})
            })
        }else{
            console.log('else')
            res.redirect("/")
        }
    }).catch(erro=>{console.log(erro)})
})

app.listen(3000, ()=>{console.log("Rodando")})