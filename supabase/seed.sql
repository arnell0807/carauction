

delete from public.auctions where id in ('911-gt3-2022', 'm3-competition-2021', 'defender-110-2023', 'mustang-gt-1967', 'golf-r-2020', 'c63-s-2019');

insert into public.auctions
  (id, year, make, model, trim_level, mileage, transmission, drivetrain, location, reserve,
   current_bid, bid_count, seller, seller_type, ends_at, image, description, highlights)
values
  ('911-gt3-2022', 2022, 'Porsche', '911 GT3', '992', 11800, 'Automatic', 'RWD', 'London', true, 146500, 3, 'Northline Motors', 'Dealer', now() + interval '4530 minutes', 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=85', 'A sharp, driver-focused 992 GT3 with documented service history, front-axle lift and a clean interior.', array['4.0L flat-six', 'Front-axle lift', 'Full service history', 'Ceramic brakes']),
  ('m3-competition-2021', 2021, 'BMW', 'M3 Competition', 'G80', 26300, 'Automatic', 'RWD', 'Manchester', false, 48250, 2, 'Oliver R.', 'Private', now() + interval '3120 minutes', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1600&q=85', 'Well-specced M3 Competition with tasteful factory options and no-reserve bidding.', array['No reserve', 'Harman Kardon', 'Adaptive suspension', 'Recent tyres']),
  ('defender-110-2023', 2023, 'Land Rover', 'Defender 110', 'D300 X-Dynamic', 9400, 'Automatic', '4WD', 'Edinburgh', true, 61750, 1, 'Caledonia Cars', 'Dealer', now() + interval '5880 minutes', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85', 'Low-mileage Defender 110 with practical options, strong specification and remaining manufacturer warranty.', array['D300 diesel', 'Panoramic roof', 'Tow pack', '360° camera']),
  ('mustang-gt-1967', 1967, 'Ford', 'Mustang GT', 'Fastback', 73800, 'Manual', 'RWD', 'Bristol', true, 38900, 2, 'Heritage Works', 'Dealer', now() + interval '7395 minutes', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=85', 'Classic fastback presented as a usable weekend car, with a manual gearbox and recent mechanical refresh.', array['289 V8', '4-speed manual', 'Recent suspension refresh', 'Period-style interior']),
  ('golf-r-2020', 2020, 'Volkswagen', 'Golf R', 'Mk7.5', 41200, 'Automatic', 'AWD', 'Leeds', false, 21400, 2, 'Sam K.', 'Private', now() + interval '1710 minutes', 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=85', 'A clean daily-driver Golf R with sensible mileage and no-reserve bidding.', array['No reserve', 'DSG', 'Digital cockpit', 'Apple CarPlay']),
  ('c63-s-2019', 2019, 'Mercedes-AMG', 'C63 S', 'Premium Plus', 35100, 'Automatic', 'RWD', 'Birmingham', true, 41750, 1, 'Midlands Performance', 'Dealer', now() + interval '8820 minutes', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85', 'V8-powered C63 S with a strong options list and recent service.', array['4.0L twin-turbo V8', 'Performance exhaust', 'Panoramic roof', 'Burmester audio']);

insert into public.bids (auction_id, amount, bidder, at)
values
  ('911-gt3-2022', 146500, 'TrackDay89', now() + interval '-76 minutes'),
  ('911-gt3-2022', 145000, 'FlatSix', now() + interval '-231 minutes'),
  ('911-gt3-2022', 142500, 'ApexDriver', now() + interval '-1183 minutes'),
  ('m3-competition-2021', 48250, 'MPowered', now() + interval '-169 minutes'),
  ('m3-competition-2021', 47750, 'SaloonFan', now() + interval '-387 minutes'),
  ('defender-110-2023', 61750, 'GreenLane', now() + interval '-296 minutes'),
  ('mustang-gt-1967', 38900, 'BlueOval', now() + interval '-309 minutes'),
  ('mustang-gt-1967', 38100, 'OldSchoolGT', now() + interval '-1037 minutes'),
  ('golf-r-2020', 21400, 'BoostedBen', now() + interval '-59 minutes'),
  ('golf-r-2020', 20900, 'HotHatch', now() + interval '-94 minutes'),
  ('c63-s-2019', 41750, 'V8Only', now() + interval '-193 minutes');
