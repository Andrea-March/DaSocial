-- POSTS
alter table posts enable row level security;

create policy "Public read posts"
on posts
for select
using (true);

create policy "Users can insert posts"
on posts
for insert
with check (auth.uid() = user_id);

create policy "Users can update own posts"
on posts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own posts"
on posts
for delete
using (auth.uid() = user_id);


-- COMMENTS

alter table comments enable row level security;

create policy "Public read comments"
on comments
for select
using (true);

create policy "Users can insert comments"
on comments
for insert
with check (auth.uid() = user_id);

create policy "Users can update own comments"
on comments
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own comments"
on comments
for delete
using (auth.uid() = user_id);


-- LIKES 
alter table post_likes enable row level security;

create policy "Public read likes"
on post_likes
for select
using (true);

create policy "Insert own like"
on post_likes
for insert
with check (auth.uid() = user_id);

create policy "Delete own like"
on post_likes
for delete
using (auth.uid() = user_id);


-- MARKET ITEMS
alter table market_items enable row level security;

create policy "Public read market items"
on market_items
for select
using (true);

create policy "Insert own market items"
on market_items
for insert
with check (auth.uid() = user_id);

create policy "Update own market items"
on market_items
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Delete own market items"
on market_items
for delete
using (auth.uid() = user_id);


-- MARKET_BOOKS

alter table market_books enable row level security;

create policy "Public read market books"
on market_books
for select
using (true);

create policy "Insert own market books"
on market_books
for insert
with check (auth.uid() = user_id);

create policy "Update own market books"
on market_books
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Delete own market books"
on market_books
for delete
using (auth.uid() = user_id);


-- BROADCASTS

alter table broadcasts enable row level security;

create policy "Public read broadcasts"
on broadcasts
for select
using (true);

create policy "Authorized users can insert broadcasts"
on broadcasts
for insert
with check (
  author_id = auth.uid()
  or exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and (p.role = 'admin' or p.is_representative = true)
  )
);

create policy "Authorized users can update broadcasts"
on broadcasts
for update
using (
  author_id = auth.uid()
  or exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and (p.role = 'admin' or p.is_representative = true)
  )
);

create policy "Authorized users can delete broadcasts"
on broadcasts
for delete
using (
  author_id = auth.uid()
  or exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and (p.role = 'admin' or p.is_representative = true)
  )
);


-- PROFILES 

alter table profiles enable row level security;

create policy "Public read profiles"
on profiles
for select
using (true);

create policy "Insert own profile"
on profiles
for insert
with check (id = auth.uid());

create policy "Update own profile"
on profiles
for update
using (id = auth.uid())
with check (id = auth.uid());
