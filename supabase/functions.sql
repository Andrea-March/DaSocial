CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO public
AS $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data ->> 'username');
  on conflict (id) do nothing;
  return new;
end;
$$;


CREATE OR REPLACE FUNCTION public.increment_like(post_uuid uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  update posts
  set like_count = like_count + 1
  where id = post_uuid;
end;
$function$


CREATE OR REPLACE FUNCTION public.update_post_get_full(pid uuid, new_content text, new_image_url text)
 RETURNS json
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  result json;
begin
  with updated as (
    update posts
    set 
      content = new_content,
      image_url = new_image_url
    where id = pid
    returning *
  )
  select json_build_object(
    'id', u.id,
    'content', u.content,
    'image_url', u.image_url,
    'like_count', u.like_count,
    'created_at', u.created_at,
    'user_id', u.user_id,
    'profiles', json_build_object(
      'username', pr.username,
      'avatar_url', pr.avatar_url
    )
  )
  into result
  from updated u
  left join profiles pr on pr.id = u.user_id;

  return result;
end;
$function$


CREATE OR REPLACE FUNCTION public.update_broadcast_get_full(bid uuid, new_title text, new_content text, new_image_url text, new_event_date date, new_pinned boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO public
AS $function$
declare
  result jsonb;
begin

  -- 1) Aggiorna il broadcast
  update broadcasts
  set
    title = new_title,
    content = new_content,
    image_url = new_image_url,
    event_date = new_event_date,
    pinned = new_pinned
  where id = bid;

  -- 2) Ritorna broadcast + autore
  select jsonb_build_object(
    'id', b.id,
    'title', b.title,
    'content', b.content,
    'image_url', b.image_url,
    'author_id', b.author_id,
    'created_at', b.created_at,
    'pinned', b.pinned,
    'event_date', b.event_date,
    'author', jsonb_build_object(
        'username', p.username,
        'avatar_url', p.avatar_url
    )
  )
  into result
  from broadcasts b
  left join profiles p on p.id = b.author_id
  where b.id = bid;

  return result;
end;
$function$


CREATE OR REPLACE FUNCTION public.decrement_like(post_uuid uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  update posts
  set like_count = like_count - 1
  where id = post_uuid
    and like_count > 0;
end;
$function$


CREATE OR REPLACE FUNCTION public.create_market_book_get_full(
  p_title text,
  p_author text,
  p_edition text,
  p_publisher text,
  p_isbn text,
  p_subject text,
  p_school_year text,
  p_description text,
  p_price numeric,
  p_image_url text
)
    RETURNS SETOF market_books_with_profile
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path TO public
    AS $$
    declare
    uid uuid := auth.uid();
    begin
    insert into market_books (
        title, author, edition, publisher, isbn,
        subject, school_year, description, price,
        image_url, user_id
    ) values (
        p_title, p_author, p_edition, p_publisher, p_isbn,
        p_subject, p_school_year, p_description, p_price,
        p_image_url, uid
    );

    return query
    select *
    from market_books_with_profile
    where user_id = uid
    order by created_at desc
    limit 1;
    end;
    $$;

