const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");

const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
  port: 3306,
};

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected to MySQL Server!");

  connection.query(`SHOW TABLES LIKE 'people'`, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }

    if (result.length === 0) {
      const createTable = `
        CREATE TABLE people (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        )
      `;
      connection.query(createTable, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('Table "people" created successfully');
        insertRandomName();
      });
    } else {
      insertRandomName();
    }
  });
});

function insertRandomName() {
  const sql = `INSERT INTO people(name) values('${generateRandomName()}')`;
  connection.query(sql, (err, result) => {
    if (err) console.log(err);
    else console.log("Random name inserted successfully.");
  });
}

function generateRandomName() {
  const firstNames = [
    "John",
    "Jane",
    "Mike",
    "Emily",
    "David",
    "Sarah",
    "Chris",
    "Anna",
    "James",
    "Laura",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Wilson",
  ];

  const firstNameIndex = Math.floor(Math.random() * firstNames.length);
  const lastNameIndex = Math.floor(Math.random() * lastNames.length);

  return `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`;
}

function findAllPeople() {
  return new Promise((resolve, reject) => {
    const sqlFindAll = "SELECT * FROM people";
    connection.query(sqlFindAll, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

app.get("/", (req, res) => {
  let htmlListItem = "";

  findAllPeople()
    .then((result) => {
      result.forEach((item) => {
        htmlListItem += `<li>${item.id} - ${item.name}</li>`;
      });

      const htmlResponse = `<h1>Full Cycle Rocks!</h1><ul>${htmlListItem}</ul>`;
      res.send(htmlResponse);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving data");
    });
});

app.listen(port, () => {
  console.log(`Server is running on the port: ${port}`);
});
