-- This is an empty migration.
CREATE TABLE public."User" (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL,
  firstName TEXT,
  lastName TEXT,
  passwordHashed TEXT,
  salt TEXT,
  phone TEXT,
  
)