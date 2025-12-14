insert into storage.buckets (id, name, public)
values ('market_items', 'market_items', true);

insert into storage.buckets (id, name, public)
values ('market_books', 'market_books', true);

insert into storage.buckets (id, name, public)
values ('broadcasts', 'broadcasts', true);

insert into storage.buckets (id, name, public)
values ('posts', 'posts', true);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);


create policy "Public read storage objects"
on storage.objects
for select
using (
  bucket_id in (
    'market_items',
    'market_books',
    'posts',
    'broadcasts',
    'avatars'
  )
);

create policy "Authenticated users can upload images"
on storage.objects
for insert
with check (
  auth.uid() = owner
);

create policy "Users can delete own images"
on storage.objects
for delete
using (
  auth.uid() = owner
);

create policy "Users can update own images"
on storage.objects
for update
using (
  auth.uid() = owner
);
