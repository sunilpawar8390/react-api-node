const bookdetails = require("../models/Bookdetails");
const categorydetails = require("../models/Categorydetailslkp");
const publsisherdetails = require("../models/Publisherdetailslkp");

module.exports = (app) => {
  //All Book Record GET API

  app.get("/api/BooksDetails", (req, res) => {
    bookdetails
      .find({ IsActive: "true" })
      .populate("Category")
      .populate("Publisher")
      .exec((err, bookdetails) => {
        return res.send(bookdetails);
        //arr
      });
  });

  //get Book Data by ID API

  app.get("/api/BooksDetails/:bookId", (req, res) => {
    bookdetails
      .findOne({ BDID: req.params.bookId })
      .populate("Category")
      .populate("Publisher")
      .exec((err, result) => {
        return res.send(result);
      });
  });

  //Edit Book API

  app.post("/api/BooksDetails/edit", (req, res) => {
    categorydetails.findOne(
      { Name: req.body.data.Category.Name },
      (err, found1) => {
        publsisherdetails.findOne(
          { Name: req.body.data.Publisher.Name },
          (err, found2) => {
            bookdetails.findOne({ BDID: req.body.id }, (err, found3) => {
              if (found3) {
                found3.Bookname = req.body.data.Bookname;
                found3.Category = found1._id;
                found3.Publisher = found2._id;
                found3.quantity = req.body.data.quantity;
                return found3.save((err) => {
                  return res.send({ status: "Edit Book Succesfully" });
                });
              }
            });
          }
        );
      }
    );
  });

  //Add New Book API

  app.post("/api/BooksDetails/add", (req, res) => {
    categorydetails.findOne(
      { Name: req.body.data.Category.Name },
      (err, found1) => {
        publsisherdetails.findOne(
          { Name: req.body.data.Publisher.Name },
          (err, found2) => {
            bookdetails.findOne({ BDID: req.body.data.BDID }, (err, found3) => {
              if (!found3) {
                const newData = new bookdetails();
                newData.BDID = req.body.data.BDID;
                newData.Bookname = req.body.data.Bookname;
                newData.Category = found1._id;
                newData.Publisher = found2._id;
                newData.quantity = req.body.data.quantity;
                return newData.save((err) => {
                  return res.send({ status: "New Book add Succesfully" });
                });
              } else {
                return res.send({
                  exist: `the Id is Already Exist ${req.body.data.BDID}`,
                });
              }
            });
          }
        );
      }
    );
  });

  //Delete Book API

  app.get("/api/BooksDetails/delete/:BookId", (req, res) => {
    bookdetails.findOne(
      { BDID: req.params.BookId },
      (err, foundBookdetails) => {
        if (foundBookdetails) {
          foundBookdetails.IsActive = !foundBookdetails.IsActive;

          foundBookdetails.save((err) => {
            res.send({
              status: "OK",
              message: "Deleted succesfully",
              bookd: foundBookdetails,
            });
          });
        }
      }
    );
  });

  //filter function for search combine records
const recordFiltering =(req, result)=>{
return result.filter((item)=>{
  let returnvalue = false;
  // if(req.body.Book && req.body.Book.toString() !=== item.Bookname ) {
    if(req.body.Book &&   req.body.Book.toString() === { $regex: item.Bookname, $options: "i" }) {
    
    returnvalue = true;

  }
  if(req.body.Cat && req.body.Cat.toString() === item.Category.Name ) returnvalue = true;
  if(req.body.Pub && req.body.Pub.toString() === item.Publisher.Name ) returnvalue = true;
    return returnvalue;

});

};


  //Combine all record Search API
  app.post("/api/BooksDetails/allCombineData/", (req, res) => {
    //console.log(req.body);
  bookdetails.find({ IsActive: "true"})
  .populate("Category")
  .populate("Publisher")
  .exec((err, result)=>{
    let filteredData = recordFiltering(req, result);
    return res.send(filteredData);

  });
  });

  //Search Book API
  app.get("/api/BooksDetails/Search/:inputData", (req, res) => {
    bookdetails
      .find({ Bookname: { $regex: req.params.inputData, $options: "i" } })
      .populate("Category")
      .populate("Publisher")
      .exec((err, result) => {
        //console.log(result);
        return res.send(result);
      });
  });

  //Search Category API
  app.get("/api/BooksDetails/Search1/:inputDataCategory", (req, res) => {
    categorydetails
      .find({ Name: { $regex: req.params.inputDataCategory } })
      .exec((err, result) => {
        const data = result.map((bk) => {
          bookdetails
            .find({ Category: bk._id })
            .populate("Category")
            .populate("Publisher")
            .exec((err, result1) => {
              console.log(result1);
              return res.send(result1);
            });
        });
      });
  });

  //Search Publisher API
  app.get("/api/BooksDetails/Search2/:inputDataPublisher", (req, res) => {
    publsisherdetails
      .find({ Name: { $regex: req.params.inputDataPublisher } })
      .exec((err, result) => {
        const data = result.map((bk) => {
          bookdetails
            .find({ Publisher: bk._id })
            .populate("Category")
            .populate("Publisher")
            .exec((err, result1) => {
              console.log(result1);
              return res.send(result1);
            });
        });
      });
  });

  //GET Catagory Details API

  app.get("/api/categorydetails", (req, res) => {
    categorydetails.find().exec((err, categorydetails) => {
      return res.send(categorydetails);
    });
  });

  //Get Publsher Deatisl API

  app.get("/api/publisherdetails", (req, res) => {
    publsisherdetails.find().exec((err, publsisherdetails) => {
      return res.send(publsisherdetails);
    });
  });

  return app;
};
