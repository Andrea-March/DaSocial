create table broadcasts (id uuid, title text, content text, image_url text, author_id uuid, pinned boolean, created_at timestamp with time zone, event_date date);
create table comments (post_id uuid, created_at timestamp with time zone, content text, parent_id uuid, user_id uuid, id uuid);
create table market_books (edition text, id uuid, user_id uuid, title text, author text, publisher text, isbn text, subject text, school_year text, description text, price numeric, image_url text, is_sold boolean, created_at timestamp with time zone, tsv tsvector);
create table market_items (tsv tsvector, id uuid, user_id uuid, title text, description text, price numeric, image_url text, is_sold boolean, created_at timestamp with time zone, category text);
create table post_likes (id bigint, user_id uuid, created_at timestamp with time zone, post_id uuid);
create table posts (id uuid, content text, image_url text, like_count integer, created_at timestamp with time zone, user_id uuid);
create table profiles (avatar_url text, id uuid, role text, is_representative boolean, avatar_updated_at timestamp with time zone, sezione text, classe text, bio text, created_at timestamp with time zone, username text);
