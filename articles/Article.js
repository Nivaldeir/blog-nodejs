const Sequelize = require('sequelize')
const connection = require('../database/database')
const Category = require('../categories/Category')

const Article = connection.define('articles', {
    title: { type: Sequelize.STRING, allowNull: false },
    slug: {type: Sequelize.STRING, allowNull:false},
    body: {type: Sequelize.TEXT, allowNull: false},
    
})

// Category.hasMany(Article)// Uma categoria tem muitos artigos
Category.hasMany(Article); // UMA Categoria tem muitos artigos
Article.belongsTo(Category); // UM Artigo pertence a uma categoria

// Um artigo pertence a uma categoria
//1 para 1 => usar o metodo - belongsTo()
//1 para muitos => usar o metodo - hasMany()
// Article.sync({force:true})
module.exports = Article;