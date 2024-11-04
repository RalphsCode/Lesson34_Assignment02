// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");

let testBook;

beforeAll(async function() {
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
  
afterAll(async function() {
    // delete any data created by test
    await db.query("DELETE FROM books");
    // close db connection
    await db.end();		// If this is not done the test will hang.
  });
  
  /** GET /cats - returns `{cats: [cat, ...]}` */

describe("GET /books", function() {

    test("Get list of books", async function() {
      const response = await request(app).get(`/books`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        books: [testBook] });
    });

    test("Insert a book", async function() {
        const newBook = {
            isbn: "9876543210",
            amazon_url: "http://testing.com",
            author: "RalphsCode",
            language: "english",
            pages: 300,
            publisher: "Xerox",
            title: "Test a new book",
            year: 2024
          };

          const result = await request(app)
          .post("/books")
          .send(newBook);

        expect(result.statusCode).toEqual(201);
        expect(result.body).toEqual({
          book: newBook });
      });

  });
  