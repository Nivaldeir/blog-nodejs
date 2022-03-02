const express = require('express')
const router = express.Router();
const Category = require('../categories/Category')
const Articles = require('./Article')
const slugify = require('slugify');

const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles', adminAuth , (req, res)=>{
    Articles.findAll({
        include: [{model: Category}]
    }).then(articles=>{
        res.render('admin/articles/index', {articles: articles})
    })
})

router.get('/admin/articles/new', adminAuth, (req,res)=>{
    Category.findAll().then(category =>{
        res.render("admin/articles/new", {category: category})
    })
})

router.post('/articles/save', adminAuth, (req, res)=>{
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Articles.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect('/admin/articles')
    })

})

router.post('/articles/delete', adminAuth, (req, res)=>{
    var id = req.body.id;
    if(id!== undefined){
        if(!isNaN(id)){ //Se for numero
            //Delete um item no banco de dados
            Articles.destroy({
                where:{
                    id: id
                }
            }).then(()=>{
                res.redirect('/admin/articles');
            })
        }else{//Se nao for um numero
            res.redirect('/admin/articles');
        }
    }else{//Null
        res.redirect('/admin/articles');
    }
})
router.get('/admin/articles/edit/:id', adminAuth, (req, res)=>{
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect('/admin/articles')
    }
    Articles.findByPk(id).then( article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render('admin/articles/edit', {article: article, categories: categories})
            })

        }else{res.redirect('/admin/article')}
    }).catch(erro =>{
        res.redirect('/admin/article')
    })
})

router.post('/article/update', adminAuth, (req, res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    console.log(id, title, body)
    Articles.update({
        title: title,
        slug: slugify(title),
        body: body,
        },{
        where:{
            id:id
        }
    }).then(()=>{res.redirect('/admin/articles')})
})

router.get('/articles/page/:num', (req, res)=>{
    var page = req.params.num;

    var offset= 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page)-1) * 4;
    }

    Articles.findAndCountAll({
        limit:4,
        offset: offset,
        order:[
            ['id', 'DESC']
        ]
    }).then( articles=>{
        var next;
        if(offset+ 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles : articles,
        }

        Category.findAll().then(categories=>{
            res.render('admin/articles/page', {categories: categories, result: result})
        })
        // res.json(result)
    })
})

module.exports = router;