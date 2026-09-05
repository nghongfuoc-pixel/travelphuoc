-- TravelViet — D1 seed data (SQLite), chuyển từ supabase-migration.sql

-- ============ 1. AIRLINES ============

INSERT INTO airlines (name, code, logo_url) VALUES
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

-- ============ 2. COUNTRIES ============

INSERT INTO countries (name) VALUES
('Việt Nam'),('Singapore'),('Thái Lan'),('Hàn Quốc'),('Nhật Bản'),
('Malaysia'),('Indonesia'),('Campuchia'),('Trung Quốc'),('UAE');

-- ============ 3. TOURS ============

INSERT INTO tours (name, operator, thumbnail_url, days, nights, price, origin, destination, departure_date, departure_time, duration_minutes, airline_id, aircraft_type, country_id, services, featured) VALUES
('Đà Nẵng - Bà Nà Hills - Hội An','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg/330px-Golden_Bridge_at_Ba_Na_Hills_20250718.jpg',3,2,4990000,'TP.HCM','Đà Nẵng','2026-08-28','06:15',80,(SELECT id FROM airlines WHERE name='Vietnam Airlines'),'Airbus A321',(SELECT id FROM countries WHERE name='Việt Nam'),'Khách sạn 4 sao, ăn 3 bữa/ngày, hướng dẫn viên',1),
('Phú Quốc Đảo Ngọc','Saigontourist','https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Bai-sao-phu-quoc-tuonglamphotos.jpg/330px-Bai-sao-phu-quoc-tuonglamphotos.jpg',4,3,6490000,'TP.HCM','Phú Quốc','2026-09-12','09:40',55,(SELECT id FROM airlines WHERE name='VietJet Air'),'Airbus A320',(SELECT id FROM countries WHERE name='Việt Nam'),'Khách sạn 4 sao, vé cáp treo Hòn Thơm',1),
('Nha Trang Biển Xanh','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Nha_Trang%2C_Kh%C3%A1nh_H%C3%B2a.png/330px-Nha_Trang%2C_Kh%C3%A1nh_H%C3%B2a.png',3,2,3990000,'TP.HCM','Nha Trang','2026-09-19','14:20',60,(SELECT id FROM airlines WHERE name='Bamboo Airways'),'Airbus A320',(SELECT id FROM countries WHERE name='Việt Nam'),'Khách sạn 3 sao, tour 4 đảo',1),
('Đà Lạt Mộng Mơ','TST Tourist','https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Xuan_Huong_Lake_11.jpg/330px-Xuan_Huong_Lake_11.jpg',3,2,3490000,'TP.HCM','Đà Lạt','2026-08-30','07:30',50,(SELECT id FROM airlines WHERE name='VietJet Air'),'Airbus A321',(SELECT id FROM countries WHERE name='Việt Nam'),'Khách sạn 3 sao, tham quan Langbiang',1),
('Hạ Long Kỳ Quan','Fiditour','https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Ha_Long_Bay_in_2019.jpg/330px-Ha_Long_Bay_in_2019.jpg',2,1,2990000,'Hà Nội','Hạ Long','2026-09-15','10:00',45,(SELECT id FROM airlines WHERE name='Vietnam Airlines'),'Airbus A321',(SELECT id FROM countries WHERE name='Việt Nam'),'Du thuyền ngủ đêm trên vịnh',1),
('Sapa Mây Núi','Saigontourist','https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Thacbac3.jpg/330px-Thacbac3.jpg',3,2,3790000,'Hà Nội','Sapa','2026-09-22','08:00',50,(SELECT id FROM airlines WHERE name='Vietnam Airlines'),'Airbus A321',(SELECT id FROM countries WHERE name='Việt Nam'),'Khách sạn 3 sao, chinh phục Fansipan',1),
('Huế - Cố Đô Di Sản','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/%C4%90%E1%BA%A1i_n%E1%BB%99i.jpg/330px-%C4%90%E1%BA%A1i_n%E1%BB%99i.jpg',3,2,3590000,'TP.HCM','Huế','2026-09-10','16:45',75,(SELECT id FROM airlines WHERE name='Bamboo Airways'),'Airbus A320',(SELECT id FROM countries WHERE name='Việt Nam'),'Tham quan Đại Nội, lăng tẩm',1),
('Singapore Sắc Màu','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Marina_Bay_Sands_%28I%29.jpg/330px-Marina_Bay_Sands_%28I%29.jpg',4,3,12990000,'TP.HCM','Singapore','2026-09-25','11:20',135,(SELECT id FROM airlines WHERE name='Singapore Airlines'),'Airbus A350',(SELECT id FROM countries WHERE name='Singapore'),'Vé Universal Studios, khách sạn 4 sao',1),
('Bangkok - Pattaya Khám Phá','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/4Y1A1159_Bangkok_%2833536795515%29.jpg/330px-4Y1A1159_Bangkok_%2833536795515%29.jpg',4,3,8990000,'TP.HCM','Bangkok','2026-09-14','13:10',90,(SELECT id FROM airlines WHERE name='Thai Airways'),'Boeing 777',(SELECT id FROM countries WHERE name='Thái Lan'),'Khách sạn 4 sao, show Alcazar',0),
('Seoul Mùa Thu Lá Vàng','Saigontourist','https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg/330px-%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg',5,4,15990000,'Hà Nội','Seoul','2026-10-02','23:50',300,(SELECT id FROM airlines WHERE name='Korean Air'),'Boeing 787',(SELECT id FROM countries WHERE name='Hàn Quốc'),'Khách sạn 4 sao, tham quan Nami',0),
('Tokyo - Osaka Hoa Anh Đào','Fiditour','https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/330px-Skyscrapers_of_Shinjuku_2009_January.jpg',5,4,19990000,'TP.HCM','Tokyo','2026-10-05','01:15',330,(SELECT id FROM airlines WHERE name='Japan Airlines'),'Boeing 787',(SELECT id FROM countries WHERE name='Nhật Bản'),'Khách sạn 4 sao, vé Fuji-Q Highland',0),
('Kuala Lumpur Sôi Động','TST Tourist','https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Taman_KLCC%2C_Kuala_Lumpur_20260428_102802.jpg/330px-Taman_KLCC%2C_Kuala_Lumpur_20260428_102802.jpg',3,2,6990000,'TP.HCM','Kuala Lumpur','2026-09-18','12:00',105,(SELECT id FROM airlines WHERE name='AirAsia'),'Airbus A320',(SELECT id FROM countries WHERE name='Malaysia'),'Khách sạn 4 sao, tháp đôi Petronas',0),
('Bali Thiên Đường Nhiệt Đới','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/TanahLot_2014.JPG/330px-TanahLot_2014.JPG',4,3,10990000,'TP.HCM','Bali','2026-09-28','15:30',240,(SELECT id FROM airlines WHERE name='AirAsia'),'Airbus A320',(SELECT id FROM countries WHERE name='Indonesia'),'Resort 4 sao, tham quan đền Uluwatu',0),
('Angkor Wat Huyền Bí','Saigontourist','https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Angkor_Wat.jpg/330px-Angkor_Wat.jpg',3,2,5990000,'TP.HCM','Siem Reap','2026-09-11','09:00',60,(SELECT id FROM airlines WHERE name='Vietnam Airlines'),'Airbus A321',(SELECT id FROM countries WHERE name='Campuchia'),'Khách sạn 4 sao, vé tham quan Angkor',0),
('Bắc Kinh - Vạn Lý Trường Thành','Fiditour','https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/330px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg',5,4,17990000,'TP.HCM','Bắc Kinh','2026-10-08','07:45',300,(SELECT id FROM airlines WHERE name='Vietnam Airlines'),'Boeing 787',(SELECT id FROM countries WHERE name='Trung Quốc'),'Khách sạn 4 sao, tham quan Vạn Lý Trường Thành',0),
('Dubai Sa Mạc Vàng','Vietravel','https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg/330px-Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg',5,4,24990000,'TP.HCM','Dubai','2026-10-10','22:30',480,(SELECT id FROM airlines WHERE name='Emirates'),'Boeing 777',(SELECT id FROM countries WHERE name='UAE'),'Khách sạn 5 sao, safari sa mạc',0);

-- ============ 4. TOUR ITINERARY (sinh tự động theo số ngày mỗi tour) ============
-- SQLite không có generate_series/cross join lateral như Postgres -> dùng recursive CTE để sinh dãy 1..MAX(days)

WITH RECURSIVE seq(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < (SELECT MAX(days) FROM tours)
)
INSERT INTO tour_itinerary (tour_id, day_number, title, description)
SELECT
  t.id,
  s.n,
  CASE
    WHEN s.n = 1 THEN 'Khởi hành - ' || t.destination
    WHEN s.n = t.days THEN t.destination || ' - Về lại điểm khởi hành'
    ELSE 'Khám phá ' || t.destination || ' - Ngày ' || s.n
  END,
  CASE
    WHEN s.n = 1 THEN 'Bay đến ' || t.destination || ', nhận phòng khách sạn, tham quan trung tâm, ăn tối tự do và nghỉ ngơi.'
    WHEN s.n = t.days THEN 'Tự do mua sắm quà lưu niệm, làm thủ tục ra sân bay, kết thúc hành trình và bay về lại điểm khởi hành.'
    ELSE 'Tham quan các điểm nổi bật tại ' || t.destination || ', trải nghiệm văn hoá và ẩm thực địa phương cùng hướng dẫn viên.'
  END
FROM tours t
JOIN seq s ON s.n <= t.days;

-- ============ 5. FLIGHTS ============

INSERT INTO flights (airline_id, origin, destination, departure_date, departure_time, arrival_time, duration_minutes, trip_type, stop_type, aircraft_type, price_economy, price_business, services) VALUES
((SELECT id FROM airlines WHERE name='Vietnam Airlines'),'TP.HCM (SGN)','Đà Nẵng (DAD)','2026-09-01','06:15','07:35',80,'roundtrip','direct','Airbus A321',1590000,4200000,'Hành lý 23kg, suất ăn'),
((SELECT id FROM airlines WHERE name='VietJet Air'),'TP.HCM (SGN)','Đà Nẵng (DAD)','2026-09-01','09:40','11:00',80,'oneway','direct','Airbus A320',990000,2800000,'Hành lý xách tay 7kg'),
((SELECT id FROM airlines WHERE name='Bamboo Airways'),'TP.HCM (SGN)','Hà Nội (HAN)','2026-09-02','14:20','16:25',125,'roundtrip','direct','Boeing 787',1890000,5100000,'Hành lý 23kg, suất ăn nóng'),
((SELECT id FROM airlines WHERE name='Vietnam Airlines'),'Hà Nội (HAN)','TP.HCM (SGN)','2026-09-02','19:05','21:10',125,'oneway','direct','Airbus A321',1750000,4600000,'Hành lý 23kg'),
((SELECT id FROM airlines WHERE name='Singapore Airlines'),'TP.HCM (SGN)','Singapore (SIN)','2026-09-03','08:30','11:45',135,'roundtrip','direct','Airbus A350',3990000,9800000,'Hành lý 30kg, suất ăn cao cấp'),
((SELECT id FROM airlines WHERE name='Thai Airways'),'TP.HCM (SGN)','Bangkok (BKK)','2026-09-03','11:10','12:40',90,'oneway','multi_city','Boeing 777',2490000,6200000,'Hành lý 23kg, quá cảnh 1 điểm'),
((SELECT id FROM airlines WHERE name='Korean Air'),'TP.HCM (SGN)','Seoul (ICN)','2026-09-04','23:50','06:10',300,'roundtrip','direct','Boeing 787',5990000,13500000,'Hành lý 30kg, suất ăn 2 bữa'),
((SELECT id FROM airlines WHERE name='Japan Airlines'),'TP.HCM (SGN)','Tokyo (NRT)','2026-09-04','01:15','06:45',330,'roundtrip','multi_city','Boeing 787',7490000,16900000,'Hành lý 30kg, quá cảnh 1 điểm'),
((SELECT id FROM airlines WHERE name='VietJet Air'),'Hà Nội (HAN)','Đà Nẵng (DAD)','2026-09-05','05:30','06:50',80,'oneway','direct','Airbus A320',890000,2500000,'Hành lý xách tay 7kg'),
((SELECT id FROM airlines WHERE name='Vietnam Airlines'),'Đà Nẵng (DAD)','TP.HCM (SGN)','2026-09-05','20:15','21:35',80,'roundtrip','direct','Airbus A321',1650000,4300000,'Hành lý 23kg'),
((SELECT id FROM airlines WHERE name='Bamboo Airways'),'TP.HCM (SGN)','Huế (HUI)','2026-09-06','16:45','18:00',75,'oneway','direct','Airbus A320',1290000,3400000,'Hành lý 23kg'),
((SELECT id FROM airlines WHERE name='Vietravel Airlines'),'TP.HCM (SGN)','Nha Trang (CXR)','2026-09-06','07:00','08:00',60,'roundtrip','direct','Airbus A321',1090000,3000000,'Hành lý 20kg'),
((SELECT id FROM airlines WHERE name='AirAsia'),'TP.HCM (SGN)','Kuala Lumpur (KUL)','2026-09-07','12:00','13:45',105,'oneway','direct','Airbus A320',1990000,5200000,'Hành lý xách tay 7kg'),
((SELECT id FROM airlines WHERE name='AirAsia'),'TP.HCM (SGN)','Bali (DPS)','2026-09-07','15:30','19:30',240,'roundtrip','multi_city','Airbus A320',4490000,11000000,'Hành lý 20kg, quá cảnh 1 điểm'),
((SELECT id FROM airlines WHERE name='Vietnam Airlines'),'TP.HCM (SGN)','Siem Reap (REP)','2026-09-08','09:00','10:00',60,'oneway','direct','Airbus A321',1390000,3600000,'Hành lý 23kg'),
((SELECT id FROM airlines WHERE name='Vietnam Airlines'),'TP.HCM (SGN)','Bắc Kinh (PEK)','2026-09-09','07:45','12:45',300,'roundtrip','direct','Boeing 787',6990000,15800000,'Hành lý 30kg, suất ăn 2 bữa'),
((SELECT id FROM airlines WHERE name='Emirates'),'TP.HCM (SGN)','Dubai (DXB)','2026-09-10','22:30','04:30',480,'roundtrip','direct','Boeing 777',9990000,22000000,'Hành lý 30kg, giải trí cao cấp'),
((SELECT id FROM airlines WHERE name='VietJet Air'),'TP.HCM (SGN)','Phú Quốc (PQC)','2026-09-11','09:40','10:35',55,'roundtrip','direct','Airbus A320',890000,2400000,'Hành lý xách tay 7kg'),
((SELECT id FROM airlines WHERE name='Vietnam Airlines'),'TP.HCM (SGN)','Đà Lạt (DLI)','2026-09-12','07:30','08:20',50,'oneway','direct','Airbus A321',990000,2600000,'Hành lý 23kg'),
((SELECT id FROM airlines WHERE name='Bamboo Airways'),'Hà Nội (HAN)','Sapa - Lào Cai (SQH)','2026-09-13','08:00','08:50',50,'roundtrip','direct','Airbus A320',1190000,3100000,'Hành lý 23kg'),
((SELECT id FROM airlines WHERE name='Japan Airlines'),'Tokyo (NRT)','TP.HCM (SGN)','2026-09-14','09:20','14:50',330,'roundtrip','direct','Boeing 787',7690000,17200000,'Hành lý 30kg, suất ăn 2 bữa'),
((SELECT id FROM airlines WHERE name='Singapore Airlines'),'Singapore (SIN)','TP.HCM (SGN)','2026-09-15','13:45','15:00',135,'roundtrip','direct','Airbus A350',4090000,9900000,'Hành lý 30kg, suất ăn cao cấp'),
((SELECT id FROM airlines WHERE name='Korean Air'),'Seoul (ICN)','Hà Nội (HAN)','2026-09-16','19:10','22:30',300,'roundtrip','direct','Boeing 787',6090000,13700000,'Hành lý 30kg, suất ăn 2 bữa'),
((SELECT id FROM airlines WHERE name='Thai Airways'),'Bangkok (BKK)','TP.HCM (SGN)','2026-09-17','14:20','15:50',90,'oneway','multi_city','Boeing 777',2590000,6350000,'Hành lý 23kg, quá cảnh 1 điểm'),
((SELECT id FROM airlines WHERE name='Emirates'),'Dubai (DXB)','TP.HCM (SGN)','2026-09-18','02:15','13:15',480,'roundtrip','direct','Boeing 777',10190000,22400000,'Hành lý 30kg, giải trí cao cấp'),
((SELECT id FROM airlines WHERE name='VietJet Air'),'Hải Phòng (HPH)','TP.HCM (SGN)','2026-09-19','10:30','12:40',130,'oneway','direct','Airbus A321',1290000,3300000,'Hành lý xách tay 7kg');
