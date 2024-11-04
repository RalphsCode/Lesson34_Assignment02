// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");

let testBook;

beforeEach(async function() {
    const result = await db.query(
        `INSERT INTO books (isbn,
        amazon_url,
        author,
        language,
        pages,
        publisher,
        title,
        year) VALUES (
        '1234567890',
        'http://a.co/eobPtX2',
        'RalphsCode',
        'english',
        255,
        'My Printer',
        'Que Bueno - This works great!',
        2024)
        RETURNING 
        isbn,
        amazon_url,
        author,
        language,
        pages,
        publisher,
        title,
        year`
    )
    testBook = result.rows[0];
});

afterEach(async function() {
    // delete any data created by test
    await db.query("DELETE FROM books");
  });
  
afterAll(async function() {
    // close db connection
    await db.end();		// If this is not done the test will hang.
  });
  
  /** GET /cats - returns `{cats: [cat, ...]}` */

describe("GET /books", function() {

    test("Gets a list of books", async function() {
      const response = await request(app).get(`/books`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        books: [testBook] });
    });
  });
  