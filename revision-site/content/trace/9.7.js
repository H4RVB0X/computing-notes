CS.registerTrace({
  id: "9.7-1", topic: "9.7", title: "REST requests against a Book table", lang: "text",
  code: "Book table at start:\n  BookID 1  Dune  Stock 4\n  BookID 2  Emma  Stock 2\n\n1  GET    /api/books/2\n2  POST   /api/books      body {\"title\": \"Kim\", \"stock\": 5}\n3  PUT    /api/books/1    body {\"stock\": 0}\n4  DELETE /api/books/2\n5  GET    /api/books/2",
  intro: "A client sends these five REST requests, in order, to an API backed by a `Book` table. For each, give the SQL command the server runs and the state of the table afterwards.",
  columns: ["#", "SQL command", "Rows in Book afterwards", "Stock of book 1 afterwards"],
  prefill: [["1", "", "", ""], ["2", "", "", ""], ["3", "", "", ""], ["4", "", "", ""], ["5", "", "", ""]],
  rows: [["1", "SELECT", "2", "4"], ["2", "INSERT", "3", "4"], ["3", "UPDATE", "3", "0"], ["4", "DELETE", "2", "0"], ["5", "SELECT", "2", "0"]],
  instructions: "Write the SQL keyword (SELECT, INSERT, UPDATE or DELETE), the number of rows left in the table, and book 1's stock.",
  hint: "GET → SELECT, POST → INSERT, PUT → UPDATE, DELETE → DELETE. Only INSERT and DELETE change the number of rows.",
  note: "Request 5 returns an empty result ([] in JSON, or a 404 Not Found status) because book 2 was deleted by request 4.",
});
