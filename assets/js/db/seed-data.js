export const USERS = [
  { username: 'admin', email: 'admin@travel.com', password: 'Admin123!', fullName: 'Quản trị viên TravelViet', phone: '0900000001', role: 'admin' },
  { username: 'user01', email: 'user@travel.com', password: 'User123!', fullName: 'Khách hàng Demo', phone: '0900000002', role: 'user' }
];

export const ORDER_CUSTOMERS = [
  { name: 'Nguyễn Văn An', email: 'an.nguyen@example.com', phone: '0901000001' },
  { name: 'Trần Thị Bình', email: 'binh.tran@example.com', phone: '0901000002' },
  { name: 'Lê Hoàng Cường', email: 'cuong.le@example.com', phone: '0901000003' },
  { name: 'Phạm Thị Dung', email: 'dung.pham@example.com', phone: '0901000004' },
  { name: 'Hoàng Văn Em', email: 'em.hoang@example.com', phone: '0901000005' },
  { name: 'Vũ Thị Giang', email: 'giang.vu@example.com', phone: '0901000006' },
  { name: 'Đặng Văn Hùng', email: 'hung.dang@example.com', phone: '0901000007' },
  { name: 'Bùi Thị Kim', email: 'kim.bui@example.com', phone: '0901000008' },
  { name: 'Đỗ Văn Long', email: 'long.do@example.com', phone: '0901000009' },
  { name: 'Ngô Thị Mai', email: 'mai.ngo@example.com', phone: '0901000010' },
  { name: 'Dương Văn Nam', email: 'nam.duong@example.com', phone: '0901000011' },
  { name: 'Lý Thị Oanh', email: 'oanh.ly@example.com', phone: '0901000012' },
  { name: 'Phan Văn Phúc', email: 'phuc.phan@example.com', phone: '0901000013' },
  { name: 'Trịnh Thị Quyên', email: 'quyen.trinh@example.com', phone: '0901000014' },
  { name: 'Mai Văn Sơn', email: 'son.mai@example.com', phone: '0901000015' },
  { name: 'Đinh Thị Thu', email: 'thu.dinh@example.com', phone: '0901000016' },
  { name: 'Lâm Văn Út', email: 'ut.lam@example.com', phone: '0901000017' },
  { name: 'Tô Thị Vân', email: 'van.to@example.com', phone: '0901000018' },
  { name: 'Chu Văn Xuân', email: 'xuan.chu@example.com', phone: '0901000019' },
  { name: 'Kiều Thị Yến', email: 'yen.kieu@example.com', phone: '0901000020' }
];

const AIRLINE_LOGOS = {
  'Vietnam Airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Vietnam_Airlines_2015_wordmark.svg/250px-Vietnam_Airlines_2015_wordmark.svg.png',
  'VietJet Air': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/VietJet_Air_logo.svg/250px-VietJet_Air_logo.svg.png',
  'Bamboo Airways': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Bamboo_Airways_Logo.svg/250px-Bamboo_Airways_Logo.svg.png',
  'Vietravel Airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Vietravel_Airlines_Logo.png/250px-Vietravel_Airlines_Logo.png',
  'Singapore Airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Singapore_Airlines_Logo.svg/250px-Singapore_Airlines_Logo.svg.png',
  'AirAsia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/AirAsia_New_Logo_%282020%29.svg/250px-AirAsia_New_Logo_%282020%29.svg.png',
  'Thai Airways': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Thai_Airways_logo.svg/250px-Thai_Airways_logo.svg.png',
  'Korean Air': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Korean_Air_logo_%28Hangul%29.svg/250px-Korean_Air_logo_%28Hangul%29.svg.png',
  'Japan Airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Japan_Airlines_Wordmark_%282011%29.svg/250px-Japan_Airlines_Wordmark_%282011%29.svg.png',
  'Emirates': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/250px-Emirates_logo.svg.png'
};

export const AIRLINES = [
  { name: 'Vietnam Airlines', code: 'VNA' },
  { name: 'VietJet Air', code: 'VJ' },
  { name: 'Bamboo Airways', code: 'QH' },
  { name: 'Vietravel Airlines', code: 'VU' },
  { name: 'Singapore Airlines', code: 'SQ' },
  { name: 'AirAsia', code: 'AK' },
  { name: 'Thai Airways', code: 'TG' },
  { name: 'Korean Air', code: 'KE' },
  { name: 'Japan Airlines', code: 'JL' },
  { name: 'Emirates', code: 'EK' }
].map(a => ({ ...a, logoUrl: AIRLINE_LOGOS[a.name] }));

export const COUNTRIES = [
  'Việt Nam', 'Singapore', 'Thái Lan', 'Hàn Quốc', 'Nhật Bản',
  'Malaysia', 'Indonesia', 'Campuchia', 'Trung Quốc', 'UAE'
];

export const TOURS = [
  { name: 'Đà Nẵng - Bà Nà Hills - Hội An', operator: 'Vietravel', days: 3, nights: 2, price: 4990000, origin: 'TP.HCM', destination: 'Đà Nẵng', departureDate: '2026-08-28', departureTime: '06:15', durationMinutes: 80, airline: 'Vietnam Airlines', aircraft: 'Airbus A321', country: 'Việt Nam', services: 'Khách sạn 4 sao, ăn 3 bữa/ngày, hướng dẫn viên', featured: 1 },
  { name: 'Phú Quốc Đảo Ngọc', operator: 'Saigontourist', days: 4, nights: 3, price: 6490000, origin: 'TP.HCM', destination: 'Phú Quốc', departureDate: '2026-09-12', departureTime: '09:40', durationMinutes: 55, airline: 'VietJet Air', aircraft: 'Airbus A320', country: 'Việt Nam', services: 'Khách sạn 4 sao, vé cáp treo Hòn Thơm', featured: 1 },
  { name: 'Nha Trang Biển Xanh', operator: 'Vietravel', days: 3, nights: 2, price: 3990000, origin: 'TP.HCM', destination: 'Nha Trang', departureDate: '2026-09-19', departureTime: '14:20', durationMinutes: 60, airline: 'Bamboo Airways', aircraft: 'Airbus A320', country: 'Việt Nam', services: 'Khách sạn 3 sao, tour 4 đảo', featured: 1 },
  { name: 'Đà Lạt Mộng Mơ', operator: 'TST Tourist', days: 3, nights: 2, price: 3490000, origin: 'TP.HCM', destination: 'Đà Lạt', departureDate: '2026-08-30', departureTime: '07:30', durationMinutes: 50, airline: 'VietJet Air', aircraft: 'Airbus A321', country: 'Việt Nam', services: 'Khách sạn 3 sao, tham quan Langbiang', featured: 1 },
  { name: 'Hạ Long Kỳ Quan', operator: 'Fiditour', days: 2, nights: 1, price: 2990000, origin: 'Hà Nội', destination: 'Hạ Long', departureDate: '2026-09-15', departureTime: '10:00', durationMinutes: 45, airline: 'Vietnam Airlines', aircraft: 'Airbus A321', country: 'Việt Nam', services: 'Du thuyền ngủ đêm trên vịnh', featured: 1 },
  { name: 'Sapa Mây Núi', operator: 'Saigontourist', days: 3, nights: 2, price: 3790000, origin: 'Hà Nội', destination: 'Sapa', departureDate: '2026-09-22', departureTime: '08:00', durationMinutes: 50, airline: 'Vietnam Airlines', aircraft: 'Airbus A321', country: 'Việt Nam', services: 'Khách sạn 3 sao, chinh phục Fansipan', featured: 1 },
  { name: 'Huế - Cố Đô Di Sản', operator: 'Vietravel', days: 3, nights: 2, price: 3590000, origin: 'TP.HCM', destination: 'Huế', departureDate: '2026-09-10', departureTime: '16:45', durationMinutes: 75, airline: 'Bamboo Airways', aircraft: 'Airbus A320', country: 'Việt Nam', services: 'Tham quan Đại Nội, lăng tẩm', featured: 1 },
  { name: 'Singapore Sắc Màu', operator: 'Vietravel', days: 4, nights: 3, price: 12990000, origin: 'TP.HCM', destination: 'Singapore', departureDate: '2026-09-25', departureTime: '11:20', durationMinutes: 135, airline: 'Singapore Airlines', aircraft: 'Airbus A350', country: 'Singapore', services: 'Vé Universal Studios, khách sạn 4 sao', featured: 1 },
  { name: 'Bangkok - Pattaya Khám Phá', operator: 'Vietravel', days: 4, nights: 3, price: 8990000, origin: 'TP.HCM', destination: 'Bangkok', departureDate: '2026-09-14', departureTime: '13:10', durationMinutes: 90, airline: 'Thai Airways', aircraft: 'Boeing 777', country: 'Thái Lan', services: 'Khách sạn 4 sao, show Alcazar', featured: 0 },
  { name: 'Seoul Mùa Thu Lá Vàng', operator: 'Saigontourist', days: 5, nights: 4, price: 15990000, origin: 'Hà Nội', destination: 'Seoul', departureDate: '2026-10-02', departureTime: '23:50', durationMinutes: 300, airline: 'Korean Air', aircraft: 'Boeing 787', country: 'Hàn Quốc', services: 'Khách sạn 4 sao, tham quan Nami', featured: 0 },
  { name: 'Tokyo - Osaka Hoa Anh Đào', operator: 'Fiditour', days: 5, nights: 4, price: 19990000, origin: 'TP.HCM', destination: 'Tokyo', departureDate: '2026-10-05', departureTime: '01:15', durationMinutes: 330, airline: 'Japan Airlines', aircraft: 'Boeing 787', country: 'Nhật Bản', services: 'Khách sạn 4 sao, vé Fuji-Q Highland', featured: 0 },
  { name: 'Kuala Lumpur Sôi Động', operator: 'TST Tourist', days: 3, nights: 2, price: 6990000, origin: 'TP.HCM', destination: 'Kuala Lumpur', departureDate: '2026-09-18', departureTime: '12:00', durationMinutes: 105, airline: 'AirAsia', aircraft: 'Airbus A320', country: 'Malaysia', services: 'Khách sạn 4 sao, tháp đôi Petronas', featured: 0 },
  { name: 'Bali Thiên Đường Nhiệt Đới', operator: 'Vietravel', days: 4, nights: 3, price: 10990000, origin: 'TP.HCM', destination: 'Bali', departureDate: '2026-09-28', departureTime: '15:30', durationMinutes: 240, airline: 'AirAsia', aircraft: 'Airbus A320', country: 'Indonesia', services: 'Resort 4 sao, tham quan đền Uluwatu', featured: 0 },
  { name: 'Angkor Wat Huyền Bí', operator: 'Saigontourist', days: 3, nights: 2, price: 5990000, origin: 'TP.HCM', destination: 'Siem Reap', departureDate: '2026-09-11', departureTime: '09:00', durationMinutes: 60, airline: 'Vietnam Airlines', aircraft: 'Airbus A321', country: 'Campuchia', services: 'Khách sạn 4 sao, vé tham quan Angkor', featured: 0 },
  { name: 'Bắc Kinh - Vạn Lý Trường Thành', operator: 'Fiditour', days: 5, nights: 4, price: 17990000, origin: 'TP.HCM', destination: 'Bắc Kinh', departureDate: '2026-10-08', departureTime: '07:45', durationMinutes: 300, airline: 'Vietnam Airlines', aircraft: 'Boeing 787', country: 'Trung Quốc', services: 'Khách sạn 4 sao, tham quan Vạn Lý Trường Thành', featured: 0 },
  { name: 'Dubai Sa Mạc Vàng', operator: 'Vietravel', days: 5, nights: 4, price: 24990000, origin: 'TP.HCM', destination: 'Dubai', departureDate: '2026-10-10', departureTime: '22:30', durationMinutes: 480, airline: 'Emirates', aircraft: 'Boeing 777', country: 'UAE', services: 'Khách sạn 5 sao, safari sa mạc', featured: 0 }
];

const TOUR_PHOTOS = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg/330px-Golden_Bridge_at_Ba_Na_Hills_20250718.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Bai-sao-phu-quoc-tuonglamphotos.jpg/330px-Bai-sao-phu-quoc-tuonglamphotos.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Nha_Trang%2C_Kh%C3%A1nh_H%C3%B2a.png/330px-Nha_Trang%2C_Kh%C3%A1nh_H%C3%B2a.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Xuan_Huong_Lake_11.jpg/330px-Xuan_Huong_Lake_11.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Ha_Long_Bay_in_2019.jpg/330px-Ha_Long_Bay_in_2019.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Thacbac3.jpg/330px-Thacbac3.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/%C4%90%E1%BA%A1i_n%E1%BB%99i.jpg/330px-%C4%90%E1%BA%A1i_n%E1%BB%99i.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Marina_Bay_Sands_%28I%29.jpg/330px-Marina_Bay_Sands_%28I%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/4Y1A1159_Bangkok_%2833536795515%29.jpg/330px-4Y1A1159_Bangkok_%2833536795515%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg/330px-%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/330px-Skyscrapers_of_Shinjuku_2009_January.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Taman_KLCC%2C_Kuala_Lumpur_20260428_102802.jpg/330px-Taman_KLCC%2C_Kuala_Lumpur_20260428_102802.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/TanahLot_2014.JPG/330px-TanahLot_2014.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Angkor_Wat.jpg/330px-Angkor_Wat.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/330px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg/330px-Burj_Khalifa_%28worlds_tallest_building%29_and_the_Dubai_skyline_%2825781049892%29.jpg'
];

TOURS.forEach((t, i) => { t.thumbnailUrl = TOUR_PHOTOS[i]; });

export const FLIGHTS = [
  { airline: 'Vietnam Airlines', origin: 'TP.HCM (SGN)', destination: 'Đà Nẵng (DAD)', departureDate: '2026-09-01', departureTime: '06:15', arrivalTime: '07:35', durationMinutes: 80, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Airbus A321', priceEconomy: 1590000, priceBusiness: 4200000, services: 'Hành lý 23kg, suất ăn' },
  { airline: 'VietJet Air', origin: 'TP.HCM (SGN)', destination: 'Đà Nẵng (DAD)', departureDate: '2026-09-01', departureTime: '09:40', arrivalTime: '11:00', durationMinutes: 80, tripType: 'oneway', stopType: 'direct', aircraft: 'Airbus A320', priceEconomy: 990000, priceBusiness: 2800000, services: 'Hành lý xách tay 7kg' },
  { airline: 'Bamboo Airways', origin: 'TP.HCM (SGN)', destination: 'Hà Nội (HAN)', departureDate: '2026-09-02', departureTime: '14:20', arrivalTime: '16:25', durationMinutes: 125, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Boeing 787', priceEconomy: 1890000, priceBusiness: 5100000, services: 'Hành lý 23kg, suất ăn nóng' },
  { airline: 'Vietnam Airlines', origin: 'Hà Nội (HAN)', destination: 'TP.HCM (SGN)', departureDate: '2026-09-02', departureTime: '19:05', arrivalTime: '21:10', durationMinutes: 125, tripType: 'oneway', stopType: 'direct', aircraft: 'Airbus A321', priceEconomy: 1750000, priceBusiness: 4600000, services: 'Hành lý 23kg' },
  { airline: 'Singapore Airlines', origin: 'TP.HCM (SGN)', destination: 'Singapore (SIN)', departureDate: '2026-09-03', departureTime: '08:30', arrivalTime: '11:45', durationMinutes: 135, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Airbus A350', priceEconomy: 3990000, priceBusiness: 9800000, services: 'Hành lý 30kg, suất ăn cao cấp' },
  { airline: 'Thai Airways', origin: 'TP.HCM (SGN)', destination: 'Bangkok (BKK)', departureDate: '2026-09-03', departureTime: '11:10', arrivalTime: '12:40', durationMinutes: 90, tripType: 'oneway', stopType: 'multi_city', aircraft: 'Boeing 777', priceEconomy: 2490000, priceBusiness: 6200000, services: 'Hành lý 23kg, quá cảnh 1 điểm' },
  { airline: 'Korean Air', origin: 'TP.HCM (SGN)', destination: 'Seoul (ICN)', departureDate: '2026-09-04', departureTime: '23:50', arrivalTime: '06:10', durationMinutes: 300, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Boeing 787', priceEconomy: 5990000, priceBusiness: 13500000, services: 'Hành lý 30kg, suất ăn 2 bữa' },
  { airline: 'Japan Airlines', origin: 'TP.HCM (SGN)', destination: 'Tokyo (NRT)', departureDate: '2026-09-04', departureTime: '01:15', arrivalTime: '06:45', durationMinutes: 330, tripType: 'roundtrip', stopType: 'multi_city', aircraft: 'Boeing 787', priceEconomy: 7490000, priceBusiness: 16900000, services: 'Hành lý 30kg, quá cảnh 1 điểm' },
  { airline: 'VietJet Air', origin: 'Hà Nội (HAN)', destination: 'Đà Nẵng (DAD)', departureDate: '2026-09-05', departureTime: '05:30', arrivalTime: '06:50', durationMinutes: 80, tripType: 'oneway', stopType: 'direct', aircraft: 'Airbus A320', priceEconomy: 890000, priceBusiness: 2500000, services: 'Hành lý xách tay 7kg' },
  { airline: 'Vietnam Airlines', origin: 'Đà Nẵng (DAD)', destination: 'TP.HCM (SGN)', departureDate: '2026-09-05', departureTime: '20:15', arrivalTime: '21:35', durationMinutes: 80, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Airbus A321', priceEconomy: 1650000, priceBusiness: 4300000, services: 'Hành lý 23kg' },
  { airline: 'Bamboo Airways', origin: 'TP.HCM (SGN)', destination: 'Huế (HUI)', departureDate: '2026-09-06', departureTime: '16:45', arrivalTime: '18:00', durationMinutes: 75, tripType: 'oneway', stopType: 'direct', aircraft: 'Airbus A320', priceEconomy: 1290000, priceBusiness: 3400000, services: 'Hành lý 23kg' },
  { airline: 'Vietravel Airlines', origin: 'TP.HCM (SGN)', destination: 'Nha Trang (CXR)', departureDate: '2026-09-06', departureTime: '07:00', arrivalTime: '08:00', durationMinutes: 60, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Airbus A321', priceEconomy: 1090000, priceBusiness: 3000000, services: 'Hành lý 20kg' },
  { airline: 'AirAsia', origin: 'TP.HCM (SGN)', destination: 'Kuala Lumpur (KUL)', departureDate: '2026-09-07', departureTime: '12:00', arrivalTime: '13:45', durationMinutes: 105, tripType: 'oneway', stopType: 'direct', aircraft: 'Airbus A320', priceEconomy: 1990000, priceBusiness: 5200000, services: 'Hành lý xách tay 7kg' },
  { airline: 'AirAsia', origin: 'TP.HCM (SGN)', destination: 'Bali (DPS)', departureDate: '2026-09-07', departureTime: '15:30', arrivalTime: '19:30', durationMinutes: 240, tripType: 'roundtrip', stopType: 'multi_city', aircraft: 'Airbus A320', priceEconomy: 4490000, priceBusiness: 11000000, services: 'Hành lý 20kg, quá cảnh 1 điểm' },
  { airline: 'Vietnam Airlines', origin: 'TP.HCM (SGN)', destination: 'Siem Reap (REP)', departureDate: '2026-09-08', departureTime: '09:00', arrivalTime: '10:00', durationMinutes: 60, tripType: 'oneway', stopType: 'direct', aircraft: 'Airbus A321', priceEconomy: 1390000, priceBusiness: 3600000, services: 'Hành lý 23kg' },
  { airline: 'Vietnam Airlines', origin: 'TP.HCM (SGN)', destination: 'Bắc Kinh (PEK)', departureDate: '2026-09-09', departureTime: '07:45', arrivalTime: '12:45', durationMinutes: 300, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Boeing 787', priceEconomy: 6990000, priceBusiness: 15800000, services: 'Hành lý 30kg, suất ăn 2 bữa' },
  { airline: 'Emirates', origin: 'TP.HCM (SGN)', destination: 'Dubai (DXB)', departureDate: '2026-09-10', departureTime: '22:30', arrivalTime: '04:30', durationMinutes: 480, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Boeing 777', priceEconomy: 9990000, priceBusiness: 22000000, services: 'Hành lý 30kg, giải trí cao cấp' },
  { airline: 'VietJet Air', origin: 'TP.HCM (SGN)', destination: 'Phú Quốc (PQC)', departureDate: '2026-09-11', departureTime: '09:40', arrivalTime: '10:35', durationMinutes: 55, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Airbus A320', priceEconomy: 890000, priceBusiness: 2400000, services: 'Hành lý xách tay 7kg' },
  { airline: 'Vietnam Airlines', origin: 'TP.HCM (SGN)', destination: 'Đà Lạt (DLI)', departureDate: '2026-09-12', departureTime: '07:30', arrivalTime: '08:20', durationMinutes: 50, tripType: 'oneway', stopType: 'direct', aircraft: 'Airbus A321', priceEconomy: 990000, priceBusiness: 2600000, services: 'Hành lý 23kg' },
  { airline: 'Bamboo Airways', origin: 'Hà Nội (HAN)', destination: 'Sapa - Lào Cai (SQH)', departureDate: '2026-09-13', departureTime: '08:00', arrivalTime: '08:50', durationMinutes: 50, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Airbus A320', priceEconomy: 1190000, priceBusiness: 3100000, services: 'Hành lý 23kg' },
  { airline: 'Japan Airlines', origin: 'Tokyo (NRT)', destination: 'TP.HCM (SGN)', departureDate: '2026-09-14', departureTime: '09:20', arrivalTime: '14:50', durationMinutes: 330, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Boeing 787', priceEconomy: 7690000, priceBusiness: 17200000, services: 'Hành lý 30kg, suất ăn 2 bữa' },
  { airline: 'Singapore Airlines', origin: 'Singapore (SIN)', destination: 'TP.HCM (SGN)', departureDate: '2026-09-15', departureTime: '13:45', arrivalTime: '15:00', durationMinutes: 135, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Airbus A350', priceEconomy: 4090000, priceBusiness: 9900000, services: 'Hành lý 30kg, suất ăn cao cấp' },
  { airline: 'Korean Air', origin: 'Seoul (ICN)', destination: 'Hà Nội (HAN)', departureDate: '2026-09-16', departureTime: '19:10', arrivalTime: '22:30', durationMinutes: 300, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Boeing 787', priceEconomy: 6090000, priceBusiness: 13700000, services: 'Hành lý 30kg, suất ăn 2 bữa' },
  { airline: 'Thai Airways', origin: 'Bangkok (BKK)', destination: 'TP.HCM (SGN)', departureDate: '2026-09-17', departureTime: '14:20', arrivalTime: '15:50', durationMinutes: 90, tripType: 'oneway', stopType: 'multi_city', aircraft: 'Boeing 777', priceEconomy: 2590000, priceBusiness: 6350000, services: 'Hành lý 23kg, quá cảnh 1 điểm' },
  { airline: 'Emirates', origin: 'Dubai (DXB)', destination: 'TP.HCM (SGN)', departureDate: '2026-09-18', departureTime: '02:15', arrivalTime: '13:15', durationMinutes: 480, tripType: 'roundtrip', stopType: 'direct', aircraft: 'Boeing 777', priceEconomy: 10190000, priceBusiness: 22400000, services: 'Hành lý 30kg, giải trí cao cấp' },
  { airline: 'VietJet Air', origin: 'Hải Phòng (HPH)', destination: 'TP.HCM (SGN)', departureDate: '2026-09-19', departureTime: '10:30', arrivalTime: '12:40', durationMinutes: 130, tripType: 'oneway', stopType: 'direct', aircraft: 'Airbus A321', priceEconomy: 1290000, priceBusiness: 3300000, services: 'Hành lý xách tay 7kg' }
];
