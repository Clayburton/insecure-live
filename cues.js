/* ============================================================
   insecure — cue sheet
   Authored from a 104-element frame-exact segmentation of the
   4K master (every s/e = real appear/disappear frames).
   The video is a dialogue: Helvetica statements ↔ serif italic
   feelings, ending on the condensed-black KNOW/DO chant.
   Times in seconds.
   ============================================================ */
const HN  = '"helvetica-neue-lt-pro","Helvetica Neue",Helvetica,Arial,sans-serif';
const HNC = '"helvetica-neue-lt-pro-cond","Arial Narrow","Helvetica Neue",sans-serif';
const GA  = 'Georgia,"Times New Roman",serif';
const BM  = '"Bodoni Moda","Bodoni 72",Didot,"Playfair Display",serif';

const CUES = [];
function C(o) { CUES.push(o); }

/* ================= INTRO ================= */
C({ s:0.000, e:0.834, text:"insecure",       role:"sans", weight:400, fit:0.52, y:44 });
C({ s:0.000, e:0.834, text:"clay and kelsy", role:"sans", weight:400, fit:0.42, y:57 });
C({ s:0.834, e:1.335, text:"made by clay",   role:"sans", weight:400, fit:0.21, y:52 });

C({ s:1.802, e:3.403, text:"if anything",           role:"sans", weight:700, fit:0.30, y:50 });
C({ s:5.138, e:6.540, text:"we're just going back", role:"sans", weight:700, fit:0.65, y:50 });
C({ s:6.540, e:7.908, text:"to how things were",    role:"serifIt", fit:0.47, y:51 });
C({ s:9.776, e:11.144, text:"you know we both\nyou know we both", role:"serif", fit:0.49, lh:1.38, y:47 });
C({ s:11.144, e:12.913, text:"tried to make it work", role:"serifIt", weight:700, fit:0.55, y:50 });
C({ s:14.548, e:16.016, text:"but now i'm starting",  role:"sans", weight:700, fit:0.59, y:50 });
C({ s:16.016, e:16.984, text:"to feel insecure",      role:"serifIt", weight:700, fit:0.30, y:51 });
C({ s:19.086, e:19.653, text:"so unsure", role:"didoneIt", weight:600, fit:0.17, y:52 });
C({ s:24.690, e:25.690, text:"ahha", role:"sans", weight:100, fit:0.05, y:52 });

/* ================= VERSE 2 ================= */
C({ s:41.010, e:42.780, text:"if all my dreams",      role:"didoneIt", weight:700, fit:0.43, y:50 });
C({ s:44.010, e:45.450, text:"came true when i said", role:"serifIt", fit:0.55, y:50 });
C({ s:45.450, e:47.210, text:"that “I'd go with you”", role:"serifIt", fit:0.52, y:50 });
C({ s:48.880, e:50.180, text:"i think you'd know",    role:"serif", fit:0.50, y:51 });
C({ s:50.180, e:52.450, text:"if your dreams came true too", role:"didoneIt", weight:700, fit:0.78, y:50 });
C({ s:53.150, e:55.020, text:"now look at you", role:"serif", fit:0.55, y:50, flip:true });   // mirrored in the source
C({ s:56.290, e:57.790, text:"we're going back to", role:"sans", weight:700, fit:0.48, y:51 });
C({ s:57.790, e:59.560, text:"where we came from",  role:"serifIt", fit:0.40, y:51 });
C({ s:63.860, e:64.860, text:"ahha\nahha\nahha", role:"sans", weight:100, fit:0.05, fitH:0.22, lh:3.1, y:52 });
C({ s:68.800, e:69.800, text:"ahha\nahha\nahha", role:"sans", weight:100, fit:0.04, fitH:0.22, lh:3.1, y:52 });

/* ================= CHORUS 1 ================= */
C({ s:81.450, e:82.750, text:"i tried to tell you", role:"sans", weight:400, fit:0.49, y:50 });
C({ s:82.750, e:84.320, text:"what went", role:"sans", weight:700, fit:0.35, x:43.5, y:49.5 });
C({ s:82.750, e:84.320, text:"wrong",     role:"sans", weight:700, fit:0.20, x:66,   y:52.5 });  // dropped low
C({ s:86.490, e:86.850, text:"now",       role:"serif", fit:0.12, y:51 });
C({ s:86.850, e:87.150, text:"now i",     role:"serif", fit:0.15, y:50 });
C({ s:87.150, e:87.550, text:"now i see", role:"serif", fit:0.25, y:50 });
C({ s:87.550, e:89.660, text:"that all i've done", role:"serif", fit:0.48, y:50 });
C({ s:90.190, e:92.120, text:"Is unraveled", role:"sans", weight:400, style:"italic", fit:0.32, y:50 });
C({ s:92.930, e:94.260, text:"unraveled",    role:"serif", fit:0.45, y:49 });
C({ s:94.260, e:98.270, text:"unraveled us", role:"serif", fit:0.56, y:49 });

C({ s:101.000, e:102.300, text:"i tried to tell you", role:"sans", weight:400, fit:0.75, y:50 });
C({ s:102.300, e:103.870, text:"what went", role:"sans", weight:700, fit:0.48, x:44, y:50 });
C({ s:102.300, e:103.870, text:"wrong",     role:"sans", weight:700, fit:0.26, x:73, y:50, flip:true });  // the word itself flips
C({ s:105.810, e:106.070, text:"but",           role:"serif", fit:0.21, y:50 });
C({ s:106.070, e:106.470, text:"but now",       role:"serif", fit:0.52, y:50 });
C({ s:106.470, e:106.770, text:"but now i",     role:"serif", fit:0.60, y:50 });
C({ s:106.770, e:107.210, text:"but now i see", role:"serif", fit:0.84, y:50 });
C({ s:107.210, e:109.310, text:"that all i've done", role:"serif", fit:0.48, y:50 });
C({ s:109.780, e:111.710, text:"Is unraveled", role:"sans", weight:400, style:"italic", fit:0.67, y:50 });
C({ s:112.410, e:113.780, text:"unraveled",    role:"didone", weight:800, fit:0.76, y:49 });
C({ s:113.780, e:118.220, text:"unraveled us", role:"didone", weight:800, fit:0.96, y:49 });

/* ================= CHORUS 2 (caps) ================= */
C({ s:119.820, e:121.120, text:"I TRIED TO TELL YOU", role:"serif", track:0.20, fit:0.73, y:51 });
C({ s:121.120, e:122.690, text:"WHAT WENT", role:"sans", weight:700, fit:0.38, x:36, y:49 });
C({ s:121.120, e:122.690, text:"WRONG",     role:"sans", weight:700, fit:0.30, x:59, y:48.5 });  // crashes into WENT
C({ s:124.360, e:124.590, text:"BUT",           role:"serif", fit:0.23, y:52 });
C({ s:124.590, e:124.960, text:"BUT NOW",       role:"serif", fit:0.56, y:52 });
C({ s:124.960, e:125.220, text:"BUT NOW I",     role:"serif", fit:0.64, y:52 });
C({ s:125.220, e:125.730, text:"BUT NOW I SEE", role:"serif", fit:0.88, y:52 });
C({ s:125.730, e:127.460, text:"THAT ALL I'VE DONE", role:"serif", track:0.10, fit:0.92, y:51 });
C({ s:128.000, e:129.930, text:"IS UNRAVELED", role:"sans", weight:400, style:"italic", fit:0.83, y:50 });
C({ s:130.560, e:136.440, text:"UNRAVELED US", role:"didone", weight:900, fit:0.93, fitH:0.29, stretch:0.68, y:53 });
C({ s:136.700, e:137.270, text:"cause", role:"sans", weight:700, fit:0.38, y:52 });

/* ---------- "i'm just feeling so insecure..." ---------- */
C({ s:137.270, e:137.540, text:"i'm",                 role:"serifIt", weight:700, fit:0.08, y:50 });
C({ s:137.540, e:137.800, text:"i'm just",            role:"serifIt", fit:0.19, y:51 });
C({ s:137.800, e:138.270, text:"i'm just feeling",    role:"serifIt", fit:0.38, y:51 });
C({ s:138.270, e:138.540, text:"i'm just feeling so", role:"serifIt", fit:0.44, y:51 });
C({ s:138.910, e:139.440, text:"insecure", role:"serifIt", weight:700, fit:0.14, y:51 });
C({ s:139.740, e:140.170, text:"about",    role:"serifIt", weight:700, fit:0.09, y:51 });
C({ s:140.510, e:141.110, text:"myself",       role:"serif", fit:0.19, y:51 });
C({ s:141.110, e:141.380, text:"myself and",   role:"serif", fit:0.29, y:51 });
C({ s:141.380, e:141.640, text:"myself and i", role:"serif", fit:0.33, y:51 });
C({ s:142.180, e:142.580, text:"don't know what to do", role:"sans", weight:300, fit:0.41, y:51 });
C({ s:143.810, e:144.080, text:"i",      role:"serifIt", size:7.7, y:50 });
C({ s:144.080, e:144.340, text:"i just", role:"serifIt", fit:0.13, y:51 });
C({ s:144.340, e:144.810, text:"i just needed",         role:"serifIt", fit:0.32, y:51 });
C({ s:144.810, e:145.440, text:"i just needed some",    role:"serifIt", fit:0.46, y:51 });
C({ s:145.440, e:145.750, text:"i just needed someone", role:"serifIt", fit:0.55, y:51 });
C({ s:145.750, e:146.250, text:"who could help", role:"serif", weight:700, fit:0.42, y:51 });
C({ s:146.850, e:147.850, text:"show me that", role:"sans", weight:200, track:0.06, fit:0.17, y:51 });
C({ s:148.680, e:148.950, text:"KNOW",               role:"sans", weight:700, fit:0.23, y:54 });
C({ s:148.950, e:149.180, text:"KNOW WHAT",          role:"sans", weight:700, fit:0.50, y:54 });
C({ s:149.180, e:149.420, text:"KNOW WHAT I",        role:"sans", weight:700, fit:0.54, y:54 });
C({ s:149.420, e:149.750, text:"KNOW WHAT I CAN",    role:"sans", weight:700, fit:0.73, y:54 });
C({ s:149.750, e:150.080, text:"KNOW WHAT I CAN DO", role:"sans", weight:700, fit:0.87, y:54 });
C({ s:150.350, e:150.620, text:"i'm",                 role:"serifIt", weight:700, fit:0.08, y:50 });
C({ s:150.620, e:150.880, text:"i'm just",            role:"serifIt", fit:0.19, y:51 });
C({ s:150.880, e:151.350, text:"i'm just feeling",    role:"serifIt", fit:0.38, y:51 });
C({ s:151.350, e:151.620, text:"i'm just feeling so", role:"serifIt", fit:0.44, y:51 });
C({ s:151.920, e:152.450, text:"INSECURE", role:"serifIt", fit:0.12, y:52 });
C({ s:152.750, e:153.190, text:"ABOUT",    role:"serifIt", weight:700, fit:0.10, y:52 });
C({ s:153.590, e:154.190, text:"MYSELF",       role:"serif", fit:0.20, y:51 });
C({ s:154.190, e:154.450, text:"MYSELF AND",   role:"serif", fit:0.32, y:51 });
C({ s:154.450, e:154.720, text:"MYSELF AND I", role:"serif", fit:0.35, y:51 });
C({ s:155.250, e:155.660, text:"DON'T KNOW WHAT TO DO", role:"sans", weight:200, track:0.10, fit:0.23, y:51 });
C({ s:156.890, e:157.160, text:"I",      role:"serifIt", size:5.7, y:51 });
C({ s:157.160, e:157.420, text:"I JUST", role:"serifIt", fit:0.15, y:51 });
C({ s:157.420, e:157.890, text:"I JUST NEEDED",         role:"serifIt", fit:0.37, y:51 });
C({ s:157.890, e:158.530, text:"I JUST NEEDED SOME",    role:"serifIt", fit:0.52, y:51 });
C({ s:158.530, e:158.820, text:"I JUST NEEDED SOMEONE", role:"serifIt", fit:0.62, y:51 });
C({ s:158.820, e:159.330, text:"WHO COULD HELP", role:"serif", weight:700, fit:0.85, y:50 });
C({ s:159.930, e:160.930, text:"SHOW ME THAT I", role:"sans", weight:200, track:0.10, fit:0.88, y:50 });

/* ---------- the KNOW / DO chant ---------- */
C({ s:161.760, e:162.030, text:"KNOW",            role:"cond", weight:900, fit:0.30, y:56 });
C({ s:162.030, e:162.260, text:"KNOW WHAT",       role:"cond", weight:900, fit:0.62, y:56 });
C({ s:162.260, e:162.500, text:"KNOW WHAT I",     role:"cond", weight:900, fit:0.68, y:56 });
C({ s:162.500, e:162.830, text:"KNOW WHAT I CAN", role:"cond", weight:900, fit:0.92, y:56 });
C({ s:162.830, e:167.800, text:"DO", role:"cond", weight:900, fit:0.26, fitH:0.40, y:49 });
C({ s:168.270, e:168.530, text:"KNOW",            role:"cond", weight:900, fit:0.23, y:58 });
C({ s:168.530, e:168.770, text:"KNOW WHAT",       role:"cond", weight:900, fit:0.47, y:58 });
C({ s:168.770, e:169.000, text:"KNOW WHAT I",     role:"cond", weight:900, fit:0.53, y:58 });
C({ s:169.000, e:169.400, text:"KNOW WHAT I CAN", role:"cond", weight:900, fit:0.71, y:58 });
C({ s:169.400, e:174.710, text:"DO", role:"cond", weight:900, fit:0.19, fitH:0.30, y:54 });
C({ s:174.810, e:175.070, text:"KNOW",            role:"cond", weight:900, track:0.30, fit:0.12, y:62 });
C({ s:175.070, e:175.310, text:"KNOW WHAT",       role:"cond", weight:900, track:0.30, fit:0.26, y:62 });
C({ s:175.310, e:175.540, text:"KNOW WHAT I",     role:"cond", weight:900, track:0.30, fit:0.31, y:62 });
C({ s:175.540, e:175.810, text:"KNOW WHAT I CAN", role:"cond", weight:900, track:0.30, fit:0.42, y:62 });
C({ s:175.810, e:178.180, text:"DO", role:"cond", weight:900, fit:0.10, fitH:0.15, y:59 });

/* white to the end (song runs out ~180s) */
