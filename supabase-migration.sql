-- TravelViet — Supabase migration script
-- Chạy TOÀN BỘ file này 1 lần trong Supabase Dashboard → SQL Editor → New query → Run

-- ============ 1. SCHEMA ============

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  phone text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.airlines (
  id bigint generated always as identity primary key,
  name text not null,
  code text not null,
  logo_url text not null
);

create table if not exists public.countries (
  id bigint generated always as identity primary key,
  name text not null unique
);

create table if not exists public.flights (
  id bigint generated always as identity primary key,
  airline_id bigint not null references public.airlines(id),
  origin text not null,
  destination text not null,
  departure_date date not null,
  departure_time text not null,
  arrival_time text not null,
  duration_minutes int not null,
  trip_type text not null,
  stop_type text not null,
  aircraft_type text not null,
  price_economy integer not null,
  price_business integer not null,
  services text,
  thumbnail_url text
);

create table if not exists public.tours (
  id bigint generated always as identity primary key,
  name text not null,
  operator text not null,
  thumbnail_url text not null,
  days int not null,
  nights int not null,
  price integer not null,
  origin text not null,
  destination text not null,
  departure_date date not null,
  departure_time text not null,
  duration_minutes int not null,
  airline_id bigint not null references public.airlines(id),
  aircraft_type text not null,
  country_id bigint not null references public.countries(id),
  services text,
  featured boolean not null default false
);

create table if not exists public.tour_itinerary (
  id bigint generated always as identity primary key,
  tour_id bigint not null references public.tours(id) on delete cascade,
  day_number int not null,
  title text not null,
  description text not null
);

create table if not exists public.cart_items (
  id bigint generated always as identity primary key,
  session_id text not null,
  item_type text not null,
  item_id bigint not null,
  fare_class text,
  price integer not null,
  added_at timestamptz not null default now()
);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) default auth.uid(),
  customer_name text not null,
  email text not null,
  phone text not null,
  total_price integer not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  item_type text not null,
  item_id bigint not null,
  fare_class text,
  price integer not null
);

-- ============ 2. HELPER: is_admin() ============

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ============ 3. AUTO-CREATE PROFILE ON SIGNUP ============

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    'user'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ 4. ROW LEVEL SECURITY ============

alter table public.profiles enable row level security;
alter table public.airlines enable row level security;
alter table public.countries enable row level security;
alter table public.flights enable row level security;
alter table public.tours enable row level security;
alter table public.tour_itinerary enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- public: đọc công khai catalog
create policy "public read airlines" on public.airlines for select using (true);
create policy "public read countries" on public.countries for select using (true);
create policy "public read flights" on public.flights for select using (true);
create policy "public read tours" on public.tours for select using (true);
create policy "public read tour_itinerary" on public.tour_itinerary for select using (true);

-- admin: ghi catalog
create policy "admin insert airlines" on public.airlines for insert with check (is_admin());
create policy "admin update airlines" on public.airlines for update using (is_admin()) with check (is_admin());
create policy "admin delete airlines" on public.airlines for delete using (is_admin());

create policy "admin insert countries" on public.countries for insert with check (is_admin());
create policy "admin update countries" on public.countries for update using (is_admin()) with check (is_admin());
create policy "admin delete countries" on public.countries for delete using (is_admin());

create policy "admin insert flights" on public.flights for insert with check (is_admin());
create policy "admin update flights" on public.flights for update using (is_admin()) with check (is_admin());
create policy "admin delete flights" on public.flights for delete using (is_admin());

create policy "admin insert tours" on public.tours for insert with check (is_admin());
create policy "admin update tours" on public.tours for update using (is_admin()) with check (is_admin());
create policy "admin delete tours" on public.tours for delete using (is_admin());

create policy "admin insert tour_itinerary" on public.tour_itinerary for insert with check (is_admin());
create policy "admin update tour_itinerary" on public.tour_itinerary for update using (is_admin()) with check (is_admin());
create policy "admin delete tour_itinerary" on public.tour_itinerary for delete using (is_admin());

-- profiles: mỗi user đọc/sửa hồ sơ của chính mình, admin đọc được tất cả
create policy "read own profile or admin" on public.profiles for select using (auth.uid() = id or is_admin());
create policy "update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- cart_items: giỏ hàng khách vãng lai dùng session_id ẩn danh (không có auth.uid()),
-- nên mở quyền đọc/ghi theo session_id phía client tự quản lý (dữ liệu không nhạy cảm: chỉ id sản phẩm + giá).
create policy "cart open access" on public.cart_items for all using (true) with check (true);

-- orders / order_items: chỉ user đã đăng nhập tạo đơn của chính mình; admin xem tất cả
create policy "user insert own orders" on public.orders for insert to authenticated with check (auth.uid() = user_id);
create policy "user read own orders" on public.orders for select to authenticated using (auth.uid() = user_id or is_admin());

create policy "insert order_items via own order" on public.order_items for insert to authenticated
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "read order_items via own order or admin" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or is_admin())));

-- ============ 5. SEED DATA ============

insert into public.airlines (name, code, logo_url) values
('Vietnam Airlines','VNA','https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Vietnam_Airlines_2015_wordmark.svg/250px-Vietnam_Airlines_2015_wordmark.svg.png'),
('VietJet Air','VJ','https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/VietJet_Air_logo.svg/250px-VietJet_Air_logo.svg.png'),
('Bamboo Airways','QH','https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Bamboo_Airways_Logo.svg/250px-Bamboo_Airways_Logo.svg.png'),
('Vietravel Airlines','VU','https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Vietravel_Airlines_Logo.png/250px-Vietravel_Airlines_Logo.png'),
('Singapore Airlines','SQ','https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Singapore_Airlines_Logo.svg/250px-Singapore_Airlines_Logo.svg.png'),
('AirAsia','AK','https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/AirAsia_New_Logo_%282020%29.svg/250px-AirAsia_New_Logo_%282020%29.svg.png'),
('Thai Airways','TG','https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Thai_Airways_logo.svg/250px-Thai_Airways_logo.svg.png'),
('Korean Air','KE','https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Korean_Air_logo_%28Hangul%29.svg/250px-Korean_Air_logo_%28Hangul%29.svg.png'),
('Japan Airlines','JL','https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Japan_Airlines_Wordmark_%282011%29.svg/250px-Japan_Airlines_Wordmark_%282011%29.svg.png'),
('Emirates','EK','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/250px-Emirates_logo.svg.png');

insert into public.countries (name) values
('Việt Nam'),('Singapore'),('Thái Lan'),('Hàn Quốc'),('Nhật Bản'),
('Malaysia'),('Indonesia'),('Campuchia'),('Trung Quốc'),('UAE');

insert into public.tours (name, operator, thumbnail_url, days, nights, price, origin, destination, departure_date, departure_time, duration_minutes, airline_id, aircraft_type, country_id, services, featured) values
('Đà Nẵng - Bà Nà Hills - Hội An','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg/330px-Golden_Bridge_at_Ba_Na_Hills_20250718.jpg',3,2,4990000,'TP.HCM','Đà Nẵng','2026-08-28','06:15',80,(select id from public.airlines where name='Vietnam Airlines'),'Airbus A321',(select id from public.countries where name='Việt Nam'),'Khách sạn 4 sao, ăn 3 bữa/ngày, hướng dẫn viên',true),
('Phú Quốc Đảo Ngọc','Saigontourist','https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Bai-sao-phu-quoc-tuonglamphotos.jpg/330px-Bai-sao-phu-quoc-tuonglamphotos.jpg',4,3,6490000,'TP.HCM','Phú Quốc','2026-09-12','09:40',55,(select id from public.airlines where name='VietJet Air'),'Airbus A320',(select id from public.countries where name='Việt Nam'),'Khách sạn 4 sao, vé cáp treo Hòn Thơm',true),
('Nha Trang Biển Xanh','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Nha_Trang%2C_Kh%C3%A1nh_H%C3%B2a.png/330px-Nha_Trang%2C_Kh%C3%A1nh_H%C3%B2a.png',3,2,3990000,'TP.HCM','Nha Trang','2026-09-19','14:20',60,(select id from public.airlines where name='Bamboo Airways'),'Airbus A320',(select id from public.countries where name='Việt Nam'),'Khách sạn 3 sao, tour 4 đảo',true),
('Đà Lạt Mộng Mơ','TST Tourist','https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Xuan_Huong_Lake_11.jpg/330px-Xuan_Huong_Lake_11.jpg',3,2,3490000,'TP.HCM','Đà Lạt','2026-08-30','07:30',50,(select id from public.airlines where name='VietJet Air'),'Airbus A321',(select id from public.countries where name='Việt Nam'),'Khách sạn 3 sao, tham quan Langbiang',true),
('Hạ Long Kỳ Quan','Fiditour','https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Ha_Long_Bay_in_2019.jpg/330px-Ha_Long_Bay_in_2019.jpg',2,1,2990000,'Hà Nội','Hạ Long','2026-09-15','10:00',45,(select id from public.airlines where name='Vietnam Airlines'),'Airbus A321',(select id from public.countries where name='Việt Nam'),'Du thuyền ngủ đêm trên vịnh',true),
('Sapa Mây Núi','Saigontourist','https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Thacbac3.jpg/330px-Thacbac3.jpg',3,2,3790000,'Hà Nội','Sapa','2026-09-22','08:00',50,(select id from public.airlines where name='Vietnam Airlines'),'Airbus A321',(select id from public.countries where name='Việt Nam'),'Khách sạn 3 sao, chinh phục Fansipan',true),
('Huế - Cố Đô Di Sản','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/%C4%90%E1%BA%A1i_n%E1%BB%99i.jpg/330px-%C4%90%E1%BA%A1i_n%E1%BB%99i.jpg',3,2,3590000,'TP.HCM','Huế','2026-09-10','16:45',75,(select id from public.airlines where name='Bamboo Airways'),'Airbus A320',(select id from public.countries where name='Việt Nam'),'Tham quan Đại Nội, lăng tẩm',true),
('Singapore Sắc Màu','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Marina_Bay_Sands_%28I%29.jpg/330px-Marina_Bay_Sands_%28I%29.jpg',4,3,12990000,'TP.HCM','Singapore','2026-09-25','11:20',135,(select id from public.airlines where name='Singapore Airlines'),'Airbus A350',(select id from public.countries where name='Singapore'),'Vé Universal Studios, khách sạn 4 sao',true),
('Bangkok - Pattaya Khám Phá','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/4Y1A1159_Bangkok_%2833536795515%29.jpg/330px-4Y1A1159_Bangkok_%2833536795515%29.jpg',4,3,8990000,'TP.HCM','Bangkok','2026-09-14','13:10',90,(select id from public.airlines where name='Thai Airways'),'Boeing 777',(select id from public.countries where name='Thái Lan'),'Khách sạn 4 sao, show Alcazar',false),
('Seoul Mùa Thu Lá Vàng','Saigontourist','https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg/330px-%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg',5,4,15990000,'Hà Nội','Seoul','2026-10-02','23:50',300,(select id from public.airlines where name='Korean Air'),'Boeing 787',(select id from public.countries where name='Hàn Quốc'),'Khách sạn 4 sao, tham quan Nami',false),
('Tokyo - Osaka Hoa Anh Đào','Fiditour','https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/330px-Skyscrapers_of_Shinjuku_2009_January.jpg',5,4,19990000,'TP.HCM','Tokyo','2026-10-05','01:15',330,(select id from public.airlines where name='Japan Airlines'),'Boeing 787',(select id from public.countries where name='Nhật Bản'),'Khách sạn 4 sao, vé Fuji-Q Highland',false),
('Kuala Lumpur Sôi Động','TST Tourist','https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Taman_KLCC%2C_Kuala_Lumpur_20260428_102802.jpg/330px-Taman_KLCC%2C_Kuala_Lumpur_20260428_102802.jpg',3,2,6990000,'TP.HCM','Kuala Lumpur','2026-09-18','12:00',105,(select id from public.airlines where name='AirAsia'),'Airbus A320',(select id from public.countries where name='Malaysia'),'Khách sạn 4 sao, tháp đôi Petronas',false),
('Bali Thiên Đường Nhiệt Đới','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/TanahLot_2014.JPG/330px-TanahLot_2014.JPG',4,3,10990000,'TP.HCM','Bali','2026-09-28','15:30',240,(select id from public.airlines where name='AirAsia'),'Airbus A320',(select id from public.countries where name='Indonesia'),'Resort 4 sao, tham quan đền Uluwatu',false),
('Angkor Wat Huyền Bí','Saigontourist','https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Angkor_Wat.jpg/330px-Angkor_Wat.jpg',3,2,5990000,'TP.HCM','Siem Reap','2026-09-11','09:00',60,(select id from public.airlines where name='Vietnam Airlines'),'Airbus A321',(select id from public.countries where name='Campuchia'),'Khách sạn 4 sao, vé tham quan Angkor',false),
('Bắc Kinh - Vạn Lý Trường Thành','Fiditour','https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/330px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg',5,4,17990000,'TP.HCM','Bắc Kinh','2026-10-08','07:45',300,(select id from public.airlines where name='Vietnam Airlines'),'Boeing 787',(select id from public.countries where name='Trung Quốc'),'Khách sạn 4 sao, tham quan Vạn Lý Trường Thành',false),
('Dubai Sa Mạc Vàng','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg/330px-Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg',5,4,24990000,'TP.HCM','Dubai','2026-10-10','22:30',480,(select id from public.airlines where name='Emirates'),'Boeing 777',(select id from public.countries where name='UAE'),'Khách sạn 5 sao, safari sa mạc',false);

-- itinerary tự sinh cho từng tour (mẫu 1 dòng/ngày, tương tự genItinerary() cũ)
insert into public.tour_itinerary (tour_id, day_number, title, description)
select t.id, gs.day,
  case
    when gs.day = 1 then 'Khởi hành - ' || t.destination
    when gs.day = t.days then t.destination || ' - Về lại điểm khởi hành'
    else 'Khám phá ' || t.destination || ' - Ngày ' || gs.day
  end,
  case
    when gs.day = 1 then 'Bay đến ' || t.destination || ', nhận phòng khách sạn, tham quan trung tâm, ăn tối tự do và nghỉ ngơi.'
    when gs.day = t.days then 'Tự do mua sắm quà lưu niệm, làm thủ tục ra sân bay, kết thúc hành trình và bay về lại điểm khởi hành.'
    else 'Tham quan các điểm nổi bật tại ' || t.destination || ', trải nghiệm văn hoá và ẩm thực địa phương cùng hướng dẫn viên.'
  end
from public.tours t
cross join lateral generate_series(1, t.days) as gs(day);

insert into public.flights (airline_id, origin, destination, departure_date, departure_time, arrival_time, duration_minutes, trip_type, stop_type, aircraft_type, price_economy, price_business, services) values
((select id from public.airlines where name='Vietnam Airlines'),'TP.HCM (SGN)','Đà Nẵng (DAD)','2026-09-01','06:15','07:35',80,'roundtrip','direct','Airbus A321',1590000,4200000,'Hành lý 23kg, suất ăn'),
((select id from public.airlines where name='VietJet Air'),'TP.HCM (SGN)','Đà Nẵng (DAD)','2026-09-01','09:40','11:00',80,'oneway','direct','Airbus A320',990000,2800000,'Hành lý xách tay 7kg'),
((select id from public.airlines where name='Bamboo Airways'),'TP.HCM (SGN)','Hà Nội (HAN)','2026-09-02','14:20','16:25',125,'roundtrip','direct','Boeing 787',1890000,5100000,'Hành lý 23kg, suất ăn nóng'),
((select id from public.airlines where name='Vietnam Airlines'),'Hà Nội (HAN)','TP.HCM (SGN)','2026-09-02','19:05','21:10',125,'oneway','direct','Airbus A321',1750000,4600000,'Hành lý 23kg'),
((select id from public.airlines where name='Singapore Airlines'),'TP.HCM (SGN)','Singapore (SIN)','2026-09-03','08:30','11:45',135,'roundtrip','direct','Airbus A350',3990000,9800000,'Hành lý 30kg, suất ăn cao cấp'),
((select id from public.airlines where name='Thai Airways'),'TP.HCM (SGN)','Bangkok (BKK)','2026-09-03','11:10','12:40',90,'oneway','multi_city','Boeing 777',2490000,6200000,'Hành lý 23kg, quá cảnh 1 điểm'),
((select id from public.airlines where name='Korean Air'),'TP.HCM (SGN)','Seoul (ICN)','2026-09-04','23:50','06:10',300,'roundtrip','direct','Boeing 787',5990000,13500000,'Hành lý 30kg, suất ăn 2 bữa'),
((select id from public.airlines where name='Japan Airlines'),'TP.HCM (SGN)','Tokyo (NRT)','2026-09-04','01:15','06:45',330,'roundtrip','multi_city','Boeing 787',7490000,16900000,'Hành lý 30kg, quá cảnh 1 điểm'),
((select id from public.airlines where name='VietJet Air'),'Hà Nội (HAN)','Đà Nẵng (DAD)','2026-09-05','05:30','06:50',80,'oneway','direct','Airbus A320',890000,2500000,'Hành lý xách tay 7kg'),
((select id from public.airlines where name='Vietnam Airlines'),'Đà Nẵng (DAD)','TP.HCM (SGN)','2026-09-05','20:15','21:35',80,'roundtrip','direct','Airbus A321',1650000,4300000,'Hành lý 23kg'),
((select id from public.airlines where name='Bamboo Airways'),'TP.HCM (SGN)','Huế (HUI)','2026-09-06','16:45','18:00',75,'oneway','direct','Airbus A320',1290000,3400000,'Hành lý 23kg'),
((select id from public.airlines where name='Vietravel Airlines'),'TP.HCM (SGN)','Nha Trang (CXR)','2026-09-06','07:00','08:00',60,'roundtrip','direct','Airbus A321',1090000,3000000,'Hành lý 20kg'),
((select id from public.airlines where name='AirAsia'),'TP.HCM (SGN)','Kuala Lumpur (KUL)','2026-09-07','12:00','13:45',105,'oneway','direct','Airbus A320',1990000,5200000,'Hành lý xách tay 7kg'),
((select id from public.airlines where name='AirAsia'),'TP.HCM (SGN)','Bali (DPS)','2026-09-07','15:30','19:30',240,'roundtrip','multi_city','Airbus A320',4490000,11000000,'Hành lý 20kg, quá cảnh 1 điểm'),
((select id from public.airlines where name='Vietnam Airlines'),'TP.HCM (SGN)','Siem Reap (REP)','2026-09-08','09:00','10:00',60,'oneway','direct','Airbus A321',1390000,3600000,'Hành lý 23kg'),
((select id from public.airlines where name='Vietnam Airlines'),'TP.HCM (SGN)','Bắc Kinh (PEK)','2026-09-09','07:45','12:45',300,'roundtrip','direct','Boeing 787',6990000,15800000,'Hành lý 30kg, suất ăn 2 bữa'),
((select id from public.airlines where name='Emirates'),'TP.HCM (SGN)','Dubai (DXB)','2026-09-10','22:30','04:30',480,'roundtrip','direct','Boeing 777',9990000,22000000,'Hành lý 30kg, giải trí cao cấp'),
((select id from public.airlines where name='VietJet Air'),'TP.HCM (SGN)','Phú Quốc (PQC)','2026-09-11','09:40','10:35',55,'roundtrip','direct','Airbus A320',890000,2400000,'Hành lý xách tay 7kg'),
((select id from public.airlines where name='Vietnam Airlines'),'TP.HCM (SGN)','Đà Lạt (DLI)','2026-09-12','07:30','08:20',50,'oneway','direct','Airbus A321',990000,2600000,'Hành lý 23kg'),
((select id from public.airlines where name='Bamboo Airways'),'Hà Nội (HAN)','Sapa - Lào Cai (SQH)','2026-09-13','08:00','08:50',50,'roundtrip','direct','Airbus A320',1190000,3100000,'Hành lý 23kg'),
((select id from public.airlines where name='Japan Airlines'),'Tokyo (NRT)','TP.HCM (SGN)','2026-09-14','09:20','14:50',330,'roundtrip','direct','Boeing 787',7690000,17200000,'Hành lý 30kg, suất ăn 2 bữa'),
((select id from public.airlines where name='Singapore Airlines'),'Singapore (SIN)','TP.HCM (SGN)','2026-09-15','13:45','15:00',135,'roundtrip','direct','Airbus A350',4090000,9900000,'Hành lý 30kg, suất ăn cao cấp'),
((select id from public.airlines where name='Korean Air'),'Seoul (ICN)','Hà Nội (HAN)','2026-09-16','19:10','22:30',300,'roundtrip','direct','Boeing 787',6090000,13700000,'Hành lý 30kg, suất ăn 2 bữa'),
((select id from public.airlines where name='Thai Airways'),'Bangkok (BKK)','TP.HCM (SGN)','2026-09-17','14:20','15:50',90,'oneway','multi_city','Boeing 777',2590000,6350000,'Hành lý 23kg, quá cảnh 1 điểm'),
((select id from public.airlines where name='Emirates'),'Dubai (DXB)','TP.HCM (SGN)','2026-09-18','02:15','13:15',480,'roundtrip','direct','Boeing 777',10190000,22400000,'Hành lý 30kg, giải trí cao cấp'),
((select id from public.airlines where name='VietJet Air'),'Hải Phòng (HPH)','TP.HCM (SGN)','2026-09-19','10:30','12:40',130,'oneway','direct','Airbus A321',1290000,3300000,'Hành lý xách tay 7kg');

-- ============ 6. CHẶN TỰ NÂNG QUYỀN ADMIN (bắt buộc) ============
-- Policy "update own profile" cho phép user sửa hồ sơ của chính mình, nhưng RLS không giới hạn
-- theo CỘT — nếu không có trigger này, bất kỳ user nào cũng có thể tự gọi API đổi role='admin'
-- cho chính mình. Trigger dưới đây khoá cứng cột role: chỉ admin mới đổi được role của người khác.

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_role_on_profiles on public.profiles;
create trigger protect_role_on_profiles
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- ============ 7. GHI CHÚ ============
-- Tài khoản demo (admin@travel.com / user@travel.com) KHÔNG được tạo ở đây vì Supabase Auth
-- yêu cầu tạo qua API auth.signUp (không thể insert thẳng vào auth.users bằng SQL an toàn).
-- Sau khi trang web chạy, vào trang register.html để tạo tài khoản đầu tiên; muốn tài khoản
-- đó có quyền admin thì chạy lệnh sau (SQL Editor) sau khi đã đăng ký xong, thay email tương ứng:
--   update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'admin@travel.com');
