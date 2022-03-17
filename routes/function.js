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
