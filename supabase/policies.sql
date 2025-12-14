
create policy "Anyone can view posts" on posts for SELECT using (true);

create policy "Anyone can view comments" on comments for SELECT using (true);

create policy "Anyone can view market items" on market\items for SELECT using (true);

create policy "Users can insert comments" on comments for INSERT using (true) with check ((( SELECT auth.uid() AS uid) = user\id));

create policy "Users can insert their own market items" on market\items for INSERT using (true) with check ((( SELECT auth.uid() AS uid) = user\id));

create policy "select likes" on post\likes for SELECT using (true);

create policy "delete own like" on post\likes for DELETE using ((( SELECT auth.uid() AS uid) = user\id));

create policy "broadcasts are public" on broadcasts for SELECT using (true);

create policy "Profiles are public" on profiles for SELECT using (true);

create policy "Users can update their profile" on profiles for UPDATE using ((( SELECT auth.uid() AS uid) = id)) with check ((( SELECT auth.uid() AS uid) = id));

create policy "Users can delete their comments" on comments for DELETE using ((( SELECT auth.uid() AS uid) = user\id));

create policy "insert own like" on post\likes for INSERT using (true) with check ((( SELECT auth.uid() AS uid) = user\id));

create policy "Users can update their comments" on comments for UPDATE using ((( SELECT auth.uid() AS uid) = user\id)) with check ((( SELECT auth.uid() AS uid) = user\id));

create policy "Users can delete their own items" on market\items for DELETE using ((( SELECT auth.uid() AS uid) = user\id));

create policy "Users can update their own items" on market\items for UPDATE using ((( SELECT auth.uid() AS uid) = user\id));

create policy "Users can delete own posts" on posts for DELETE using ((( SELECT auth.uid() AS uid) = user\id));

create policy "Users can insert posts" on posts for INSERT using (true) with check ((( SELECT auth.uid() AS uid) = user\id));

create policy "Admin or representatives can insert broadcasts" on broadcasts for INSERT using (true) with check (((( SELECT auth.uid() AS uid) = author\id) OR (EXISTS ( SELECT 1

FROM profiles p

WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND ((p.role = 'admin'::text) OR (p.is\representative = true)))))));

create policy "Users can update own posts" on posts for UPDATE using ((( SELECT auth.uid() AS uid) = user\id)) with check ((( SELECT auth.uid() AS uid) = user\id));

create policy "Insert own profile" on profiles for INSERT using (true) with check ((( SELECT auth.uid() AS uid) = id));

create policy "Users can insert their own market books" on market\books for INSERT using (true) with check ((( SELECT auth.uid() AS uid) = user\id));

create policy "Users can delete their own market books" on market\books for DELETE using ((( SELECT auth.uid() AS uid) = user\id));

create policy "Users can update their own market books" on market\books for UPDATE using ((( SELECT auth.uid() AS uid) = user\id));

create policy "Market books are viewable by everyone" on market\books for SELECT using (true);

create policy "authorized\users\can\update\broadcasts" on broadcasts for UPDATE using (((author\id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1

FROM profiles

WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND ((profiles.role = 'admin'::text) OR (profiles.is\representative = true))))))) with check (((author\id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1

FROM profiles

WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND ((profiles.role = 'admin'::text) OR (profiles.is\representative = true)))))));

create policy "authorized\users\can\delete\broadcasts" on broadcasts for DELETE using (((author\id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1

FROM profiles

WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND ((profiles.role = 'admin'::text) OR (profiles.is\representative = true)))))));

create policy "Users can update their own profile" on profiles for UPDATE using ((id = ( SELECT auth.uid() AS uid))) with check ((id = ( SELECT auth.uid() AS uid)));