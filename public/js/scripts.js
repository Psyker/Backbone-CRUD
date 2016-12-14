// Backbone Model

var Book = Backbone.Model.extend({
  defaults : {
    author: "",
    title: "",
    release: 0000
  }
})

// Backbone Collection

var Books = Backbone.Collection.extend({
  url: 'http://localhost:3000/api/books'
})

// Instanciate Books

var books = new Books();

// Backbone View

var BookView = Backbone.View.extend({
    model: new Book(),
    tagName: 'tr',
    initialize: function() {
      this.template = _.template($(".books-list-template").html())
    },
    events: {
      'click .edit-book': 'edit',
      'click .update-book': 'update',
      'click .cancel-book': 'cancel',
      'click .delete-book': 'delete'
    },
    edit: function() {
      this.$('.edit-book').hide();
      this.$('.delete-book').hide();
      this.$('.update-book').show();
      this.$('.cancel-book').show();

      var author = this.$('.author').html()
      var title = this.$('.title').html()
      var release = this.$('.release').html()

      this.$('.author').html("<input type='text' class='form-control author-update' value='"+ author +"'>");
      this.$('.title').html("<input type='text' class='form-control title-update' value='"+ title +"'>");
      this.$('.release').html("<input type='number' class='form-control release-update' value='"+ release +"'>");
    },
    update: function() {
        this.model.set('author', this.$('.author-update').val());
        this.model.set('title', this.$('.title-update').val());
        this.model.set('release', this.$('.release-update').val());
    },
    cancel: function() {
        booksView.render()
    },
    delete: function() {
      this.model.destroy();
    },
    render: function() {
       this.$el.html(this.template(this.model.toJSON()));
       return this;
    }
});

var BooksView = Backbone.View.extend({
    model: books,
    el: $('.books-list'),
    initialize: function() {
      var self = this;
      this.model.on("add", this.render, this)
      this.model.on('change', function(){
          setTimeout(function() {
              self.render()
          }, 100)
      }, this)
      this.model.on('remove', this.render, this);

      this.model.fetch({
        success: function(response) {
          _.each(response.toJSON(), function(item) {
            console.log('Book _id: ' + item._id)
          });
        },
        error: function() {
          console.log('Book not found')
        }
      });
    },
    render: function() {
      var self = this;
      this.$el.html('');
      _.each(this.model.toArray(), function(book) {
        self.$el.append((new BookView({model: book})).render().$el)
      });
      return this;
    }
});

var booksView = new BooksView();

(function() {
  $('.add-book').on('click', function() {
    var book = new Book({
      author: $('.author-input').val(),
      title: $('.title-input').val(),
      release: $('.release-input').val()
    });
    $('.form-control').val('')
    console.log(book.toJSON());
    books.add(book);

    book.save(null, {
      success: function(response) {
        console.log('The Book has been SAVED with the _id: '+ response.toJSON()._id)
      },
      error: function() {
        console.log('Fail to save the book.')
      }
    });
  });

})();
