const bookdetails = require("../models/Bookdetails");
const categorydetails = require("../models/Categorydetailslkp");
const publsisherdetails = require("../models/Publisherdetailslkp");

module.exports = (app) => {
  app.get("/api/BooksDetails", (req, res) => {
    bookdetails
      .find({IsActive: 'true'})
      .populate("Category")
      .populate("Publisher")
      .exec((err, bookdetails) => {
        return res.send(bookdetails);
      });
  });

  app.get('/api/BooksDetails/:bookId', (req, res) => {
    bookdetails.findOne({ BDID: req.params.bookId })
    .populate('Category')
    .populate('Publisher')
    .exec((err, result) => {
        return res.send(result);
    });
  });

  app.post('/api/BooksDetails/edit', (req, res)=>{
    categorydetails.findOne({Name: req.body.data.Category.Name}, (err, found1) => {
      publsisherdetails.findOne({Name: req.body.data.Publisher.Name}, (err, found2) => {
        bookdetails.findOne({ BDID: req.body.id }, (err, found3) => {
          if(found3) {
            found3.Bookname = req.body.data.Bookname;
            found3.Category = found1._id;
            found3.Publisher = found2._id;
            found3.quantity = req.body.data.quantity;
            return found3.save((err) => {
              return res.send({status: 'Edit Book Succesfully'});
            })
          }
        });
      });
    });
  });

  app.post('/api/BooksDetails/add', (req, res)=>{
    categorydetails.findOne({Name: req.body.data.Category.Name}, (err, found1) => {
      publsisherdetails.findOne({Name: req.body.data.Publisher.Name}, (err, found2) => {
        bookdetails.findOne({ BDID: req.body.data.BDID }, (err, found3) => {
          if(!found3) {
            const newData = new bookdetails();
            newData.BDID = req.body.data.BDID;
            newData.Bookname = req.body.data.Bookname;
            newData.Category = found1._id;
            newData.Publisher = found2._id;
            newData.quantity = req.body.data.quantity;
            return newData.save((err) => { 
              return res.send({status: 'New Book add Succesfully' })
                
               
            })
          }
          else
          { 
            return res.send({exist: `the Id is Already Exist ${ req.body.data.BDID }` })
          }
        });
      });
    });
  });

  app.get("/api/BooksDetails/delete/:BookId", (req, res) => {
    bookdetails.findOne({BDID:  req.params.BookId}, (err, foundBookdetails) => {
        if(foundBookdetails) {
            foundBookdetails.IsActive = !foundBookdetails.IsActive;

            foundBookdetails.save((err) => {
                res.send({ status: 'OK', message: 'Deleted succesfully', bookd:foundBookdetails });
            })
        }
    });
  });


  app.get("/api/categorydetails", (req, res) => {
    categorydetails.find().exec((err, categorydetails) => {
      return res.send(categorydetails);
    });
  });

  app.get("/api/publisherdetails", (req, res) => {
    publsisherdetails.find().exec((err, publsisherdetails) => {
      return res.send(publsisherdetails);
    });
  });

  return app;
};
