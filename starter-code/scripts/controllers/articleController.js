(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // This method takes an ID from the URL (probably when clicked on in the 'more' link at the end of each article), that path becomes the context object. The articleData function here uses our context object (our individular article) to define
  // Inside this method Article.findWhere will fire first, it will use our called up on article ID to find the appropriate record in our SQL table. After that it calls the articleData function as passes that record as the parameter. articleData will load that record into our context object. That context object (our requested record) will be what is used by our next function (articlesController.index).
  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // This method uses the name of an author to find and load all articles by a particular author into our current context object.
  // The execution path: this method is triggered when the user chooses an author name from our drop down menu on the home page. This method first fires the Article.findWhere function, which takes that author name (and replaces any spaces in it with a + as declared in the argument passed to the Article.findWhere). Article.findWhere locates and loads all of the matching author records and returns those as an array of objects. Article.findWhere then calls the authorData function which puts our current set of records (articlesByAuthor) into the current context object (ctx.articles), which is then used when our next function (articlesController.index) is called.
  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // This method uses the name of a category to find and load all articles in a particular category into our current context object.
  // The execution path: this method is triggered when the user chooses an category name from our drop down menu on the home page. This method first fires the Article.findWhere function, which takes that category name. Article.findWhere locates and loads all of the matching category records and returns those as an array of objects. Article.findWhere then calls the categoryData function which puts our current set of records (articlesInCategory) into the current context object (ctx.articles), which is then used when our next function (articlesController.index) is called.
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // This method returns all the articles and passes them into the context object for the controller to use.
  // The excution path: First the if/else statement will be run. If the Article.all array has anything in it (if it's already been loaded from our data), then we assign that array to our context object and move on to the articlesController.index function. If the Article.all array is empty we call the fetchAll function and pass it our articleData function as the callback.
  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };

  module.articlesController = articlesController;
})(window);
