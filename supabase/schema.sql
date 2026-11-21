create table if not exists public.auctions (
  id text primary key,
  year integer not null check (year between 1900 and 2100),
  make text not null check (char_length(make) between 2 and 60),
  model text not null check (char_length(model) between 1 and 80),
  trim_level text not null default '—',
  mileage integer not null check (mileage between 0 and 1000000),
  transmission text not null,
  drivetrain text not null,
  location text not null,
  reserve boolean not null default true,
  current_bid integer not null check (current_bid >= 250),
  bid_count integer not null default 0,
  seller text not null check (char_length(seller) >= 2),
  seller_type text not null,
  ends_at timestamptz not null,
  image text not null check (image ~* '^https?://'),
  description text not null check (char_length(description) between 1 and 2000),
  highlights text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  auction_id text not null references public.auctions (id) on delete cascade,
  amount integer not null,
  bidder text not null check (char_length(bidder) >= 2),
  at timestamptz not null default now()
);

create index if not exists bids_auction_id_at_idx on public.bids (auction_id, at desc);

alter table public.auctions enable row level security;
alter table public.bids enable row level security;

drop policy if exists "Auctions are public" on public.auctions;
create policy "Auctions are public" on public.auctions
  for select using (true);

drop policy if exists "Anyone can list an auction" on public.auctions;
create policy "Anyone can list an auction" on public.auctions
  for insert with check (current_bid >= 250 and bid_count = 0 and ends_at > now());

drop policy if exists "Bids are public" on public.bids;
create policy "Bids are public" on public.bids
  for select using (true);

create or replace function public.place_bid(
  p_auction_id text,
  p_amount integer,
  p_bidder text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_auction public.auctions%rowtype;
  v_minimum integer;
begin
  select * into v_auction from public.auctions where id = p_auction_id for update;

  if not found then
    raise exception 'Auction not found';
  end if;

  if v_auction.ends_at <= now() then
    raise exception 'This auction has ended';
  end if;

  v_minimum := v_auction.current_bid + 250;

  if p_amount is null or p_amount < v_minimum then
    raise exception 'Bid must be at least £%', to_char(v_minimum, 'FM999,999,999');
  end if;

  if char_length(trim(coalesce(p_bidder, ''))) < 2 then
    raise exception 'Bidder name must be at least 2 characters';
  end if;

  insert into public.bids (auction_id, amount, bidder)
  values (p_auction_id, p_amount, trim(p_bidder));

  update public.auctions
  set current_bid = p_amount, bid_count = bid_count + 1
  where id = p_auction_id;
end;
$$;

grant execute on function public.place_bid(text, integer, text) to anon, authenticated;

-- Written to every 4 hours by .github/workflows/keep-supabase-alive.yml so the
-- free-plan project doesn't get paused for inactivity.
create table if not exists public.keep_alive (
  id bigint generated always as identity primary key,
  pinged_at timestamptz not null default now()
);

alter table public.keep_alive enable row level security;

drop policy if exists "anon insert pings" on public.keep_alive;
create policy "anon insert pings" on public.keep_alive
  for insert to anon with check (true);

-- Keeps the demo listings live: once a seed auction ends it gets a new end date
-- a few days out, and its bids move forward so the latest one was a few hours ago.
-- Runs hourly with pg_cron.
create extension if not exists pg_cron;

create or replace function public.roll_over_demo_auctions()
returns void
language plpgsql
set search_path = public
as $$
declare
  r record;
  n integer := 0;
  last_bid timestamptz;
begin
  for r in
    select id from public.auctions
    where id in ('golf-r-2020','m3-competition-2021','911-gt3-2022',
                 'defender-110-2023','mustang-gt-1967','c63-s-2019')
      and ends_at <= now()
    order by ends_at
  loop
    n := n + 1;
    select max(at) into last_bid from public.bids where auction_id = r.id;
    if last_bid is not null then
      update public.bids
      set at = at + ((now() - make_interval(hours => n + 1)) - last_bid)
      where auction_id = r.id;
    end if;
    update public.auctions
    set ends_at = now() + make_interval(days => n, hours => (n * 5) % 12)
    where id = r.id;
  end loop;
end;
$$;

revoke execute on function public.roll_over_demo_auctions() from public, anon, authenticated;

select cron.schedule('roll-over-demo-auctions', '0 * * * *', 'select public.roll_over_demo_auctions()');
