create table if not exists users (
  id serial primary key,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  cpf text default null,
  telephone text default null,
  password text NOT NULL
);

create table if not exists clients (
  id serial primary key,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  cpf text NOT NULL UNIQUE,
  telephone text NOT NULL,
  cep text default NULL,
  street text default NULL,
  complement text default NULL,
  district text default NULL,
  city text default NULL,
  state text default NULL,
  );


create table if not exists billings (
  id serial primary key,
  client_id integer NOT NULL REFERENCES clients(id),
  text text NOT NULL,
  description text NOT NULL,
  status text NOT NULL,
  value text NOT NULL,
  due_date TIMESTAMP default NULL
  );