const express = require("express");
const db = require("./data/hubs-model.js");

const server = express();

server.listen(4000, () => {
  console.log("*** listening on port 4000");
});

//middleware
server.use(express.json());

server.get("/", (req, res) => {
  res.send("hello world!");
});

server.get("/now", (req, res) => {
  res.send(new Date().toISOString());
});

// CRUD
// C - create - POST
// R - read - GET
// U - update - PUT
// D - delete - DELETE

// retrieve info from the db
server.get("/hubs", (req, res) => {
  db.find()
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(err => {
      res(status(500).json({ success: false, err }));
    });
});

//add record to db
server.post("/hubs", (req, res) => {
  const hubInfo = req.body;

  db.add(hubInfo)
    .then(hub => {
      res.status(201).json({ success: true, hub });
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});

//delete records
server.delete("/hubs/:id", (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({ success: false, message: "id not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});

//modify record
server.put("/hubs/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({ success: false, message: "id not found" });
      }
    })
    .catch(err => {
      res.status(404).json({ success: false, err });
    });
});

server.get("/hubs/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(item => {
      if (item) {
        res.status(200).json({ success: true, item });
      } else {
        res.status(404).json({ success: false, message: "item not found" });
      }
    })
    .catch(err => {
      res.status(404).json({ success: false, err });
    });
});
