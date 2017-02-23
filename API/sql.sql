DROP TABLE comments;
DROP TABLE ingredients;
DROP TABLE recettes;
DROP TABLE category;

CREATE TABLE category (
  id              serial primary key,
  name            VARCHAR(25)
);

CREATE TABLE recettes (
  id              serial primary key,
  name            VARCHAR(30),
  nbrPersonnes    int,
  perparationTime int,
  instruction     TEXT,
  picture         VARCHAR(50),
  category        int REFERENCES category(id),
  creation_date  timestamp without time zone default (now())
);

CREATE TABLE instructions (
  id              serial primary key,
  content         VARCHAR(500),
  recetteId       int REFERENCES recettes(id)
);

CREATE TABLE ingredients (
  id              serial primary key,
  name            VARCHAR(75),
  amount          int,
  unit            VARCHAR(20),
  ingredientId    int REFERENCES recettes(id),
  creation_date  timestamp without time zone default (now())
);

CREATE TABLE comments (
  id              serial primary key,
  author          VARCHAR(75),
  comment         TEXT,
  rate            FLOAT,
  recetteId       int REFERENCES recettes(id),
  creation_date  timestamp without time zone default (now())
);
