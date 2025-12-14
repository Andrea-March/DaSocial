create table broadcasts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id),
  title text not null,
  content text not null,
  image_url text,
  pinned boolean default false,
  event_date date,
  created_at timestamp with time zone default now()
);


create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);



create table market_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  title text not null,
  author text,
  edition text,
  publisher text,
  isbn text,
  subject text,
  school_year text,
  description text,
  price numeric not null,
  image_url text,
  is_sold boolean default false,
  created_at timestamp with time zone default now(),
  tsv tsvector
);

create index market_books_tsv_idx
on market_books
using gin(tsv);

-- TSV trigger function for market_books
create function market_books_tsv_trigger()
returns trigger as $$
begin
  new.tsv :=
    to_tsvector(
      'italian',
      coalesce(new.title, '') || ' ' ||
      coalesce(new.author, '') || ' ' ||
      coalesce(new.publisher, '') || ' ' ||
      coalesce(new.subject, '') || ' ' ||
      coalesce(new.description, '')
    );
  return new;
end;
$$ language plpgsql;

-- Trigger
create trigger market_books_tsv_update
before insert or update
on market_books
for each row
execute function market_books_tsv_trigger();

create table market_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  title text not null,
  description text,
  category text,
  price numeric not null,
  image_url text,
  is_sold boolean default false,
  created_at timestamp with time zone default now(),
  tsv tsvector
);

create index market_items_tsv_idx
on market_items
using gin(tsv);

-- TSV trigger function for market_items
create function market_items_tsv_trigger()
returns trigger as $$
begin
  new.tsv :=
    to_tsvector(
      'italian',
      coalesce(new.title, '') || ' ' ||
      coalesce(new.category, '') || ' ' ||
      coalesce(new.description, '')
    );
  return new;
end;
$$ language plpgsql;

-- Trigger
create trigger market_items_tsv_update
before insert or update
on market_items
for each row
execute function market_items_tsv_trigger();


create table post_likes (
  id bigint generated always as identity primary key,
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (post_id, user_id)
);


create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  image_url text,
  like_count integer default 0,
  created_at timestamp with time zone default now()
);

create table profiles (
  id uuid primary key,
  username text not null,
  avatar_url text,
  bio text,
  classe text,
  sezione text,
  role text default 'student',
  is_representative boolean default false,
  avatar_updated_at timestamp with time zone,
  created_at timestamp with time zone default now()
);