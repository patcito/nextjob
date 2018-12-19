const SKILLS = [
  {
    name: 'Express.js',
    id: 878,
  },
  {
    name: 'RXJS',
    id: 880,
  },
  {
    name: 'Observable',
    id: 879,
  },
  {
    name: 'Backbone',
    id: 877,
  },
  {
    name: 'Ember',
    id: 876,
  },
  {
    name: 'Angular',
    id: 875,
  },
  {
    name: 'Kubernetes',
    id: 874,
  },
  {
    name: 'docker',
    id: 873,
  },
  {
    name: 'git',
    id: 872,
  },
  {
    name: 'yarn',
    id: 871,
  },
  {
    name: 'npm',
    id: 870,
  },
  {
    name: 'gulp',
    id: 869,
  },
  {
    name: 'Parcel.js',
    id: 868,
  },
  {
    name: 'Webpack',
    id: 867,
  },
  {
    name: 'MobX',
    id: 866,
  },
  {
    name: 'Redux',
    id: 865,
  },
  {
    name: 'Jest',
    id: 864,
  },
  {
    name: 'React SSR',
    id: 863,
  },
  {
    name: 'Expo',
    id: 862,
  },
  {
    name: 'Next.js',
    id: 861,
  },
  {
    name: 'React Native',
    id: 860,
  },
  {
    name: 'React.js',
    id: 859,
  },
  {
    name: 'Apollo GraphQL',
    id: 858,
  },
  {
    name: 'Relay.js',
    id: 857,
  },
  {
    name: 'ReasonML',
    id: 856,
  },
  {
    name: 'GraphQL',
    id: 855,
  },
  {
    name: 'A# .NET',
    id: 152,
  },
  {
    name: 'A# (Axiom)',
    id: 153,
  },
  {
    name: 'A-0 System',
    id: 154,
  },
  {
    name: 'A+',
    id: 155,
  },
  {
    name: 'A++',
    id: 156,
  },
  {
    name: 'ABAP',
    id: 157,
  },
  {
    name: 'ABC',
    id: 158,
  },
  {
    name: 'ABC ALGOL',
    id: 159,
  },
  {
    name: 'ABLE',
    id: 160,
  },
  {
    name: 'ABSET',
    id: 161,
  },
  {
    name: 'ABSYS',
    id: 162,
  },
  {
    name: 'ACC',
    id: 163,
  },
  {
    name: 'Accent',
    id: 164,
  },
  {
    name: 'Ace DASL',
    id: 165,
  },
  {
    name: 'ACL2',
    id: 166,
  },
  {
    name: 'ACT-III',
    id: 167,
  },
  {
    name: 'Action!',
    id: 168,
  },
  {
    name: 'ActionScript',
    id: 169,
  },
  {
    name: 'Ada',
    id: 170,
  },
  {
    name: 'Adenine',
    id: 171,
  },
  {
    name: 'Agda',
    id: 172,
  },
  {
    name: 'Agilent VEE',
    id: 173,
  },
  {
    name: 'Agora',
    id: 174,
  },
  {
    name: 'AIMMS',
    id: 175,
  },
  {
    name: 'Alef',
    id: 176,
  },
  {
    name: 'ALF',
    id: 177,
  },
  {
    name: 'ALGOL 58',
    id: 178,
  },
  {
    name: 'ALGOL 60',
    id: 179,
  },
  {
    name: 'ALGOL 68',
    id: 180,
  },
  {
    name: 'ALGOL W',
    id: 181,
  },
  {
    name: 'Alice',
    id: 182,
  },
  {
    name: 'Alma-0',
    id: 183,
  },
  {
    name: 'AmbientTalk',
    id: 184,
  },
  {
    name: 'Amiga E',
    id: 185,
  },
  {
    name: 'AMOS',
    id: 186,
  },
  {
    name: 'AMPL',
    id: 187,
  },
  {
    name: 'APL',
    id: 188,
  },
  {
    name: "App Inventor for Android's visual block language",
    id: 189,
  },
  {
    name: 'AppleScript',
    id: 190,
  },
  {
    name: 'Arc',
    id: 191,
  },
  {
    name: 'ARexx',
    id: 192,
  },
  {
    name: 'Argus',
    id: 193,
  },
  {
    name: 'AspectJ',
    id: 194,
  },
  {
    name: 'Assembly language',
    id: 195,
  },
  {
    name: 'ATS',
    id: 196,
  },
  {
    name: 'Ateji PX',
    id: 197,
  },
  {
    name: 'AutoHotkey',
    id: 198,
  },
  {
    name: 'Autocoder',
    id: 199,
  },
  {
    name: 'AutoIt',
    id: 200,
  },
  {
    name: 'AutoLISP / Visual LISP',
    id: 201,
  },
  {
    name: 'Averest',
    id: 202,
  },
  {
    name: 'AWK',
    id: 203,
  },
  {
    name: 'Axum',
    id: 204,
  },
  {
    name: 'B',
    id: 205,
  },
  {
    name: 'Babbage',
    id: 206,
  },
  {
    name: 'Bash',
    id: 207,
  },
  {
    name: 'BASIC',
    id: 208,
  },
  {
    name: 'bc',
    id: 209,
  },
  {
    name: 'BCPL',
    id: 210,
  },
  {
    name: 'BeanShell',
    id: 211,
  },
  {
    name: 'Batch (Windows/Dos)',
    id: 212,
  },
  {
    name: 'Bertrand',
    id: 213,
  },
  {
    name: 'BETA',
    id: 214,
  },
  {
    name: 'Bigwig',
    id: 215,
  },
  {
    name: 'Bistro',
    id: 216,
  },
  {
    name: 'BitC',
    id: 217,
  },
  {
    name: 'BLISS',
    id: 218,
  },
  {
    name: 'Blue',
    id: 219,
  },
  {
    name: 'Bon',
    id: 220,
  },
  {
    name: 'Boo',
    id: 221,
  },
  {
    name: 'Boomerang',
    id: 222,
  },
  {
    name: 'Bourne shell',
    id: 223,
  },
  {
    name: 'bash',
    id: 224,
  },
  {
    name: 'ksh',
    id: 225,
  },
  {
    name: 'BREW',
    id: 226,
  },
  {
    name: 'BPEL',
    id: 227,
  },
  {
    name: 'C',
    id: 228,
  },
  {
    name: 'C--',
    id: 229,
  },
  {
    name: 'C++',
    id: 230,
  },
  {
    name: 'C#',
    id: 231,
  },
  {
    name: 'C/AL',
    id: 232,
  },
  {
    name: 'Caché ObjectScript',
    id: 233,
  },
  {
    name: 'C Shell',
    id: 234,
  },
  {
    name: 'Caml',
    id: 235,
  },
  {
    name: 'Candle',
    id: 236,
  },
  {
    name: 'Cayenne',
    id: 237,
  },
  {
    name: 'CDuce',
    id: 238,
  },
  {
    name: 'Cecil',
    id: 239,
  },
  {
    name: 'Cel',
    id: 240,
  },
  {
    name: 'Cesil',
    id: 241,
  },
  {
    name: 'Ceylon',
    id: 242,
  },
  {
    name: 'CFEngine',
    id: 243,
  },
  {
    name: 'CFML',
    id: 244,
  },
  {
    name: 'Cg',
    id: 245,
  },
  {
    name: 'Ch',
    id: 246,
  },
  {
    name: 'Chapel',
    id: 247,
  },
  {
    name: 'CHAIN',
    id: 248,
  },
  {
    name: 'Charity',
    id: 249,
  },
  {
    name: 'Charm',
    id: 250,
  },
  {
    name: 'Chef',
    id: 251,
  },
  {
    name: 'CHILL',
    id: 252,
  },
  {
    name: 'CHIP-8',
    id: 253,
  },
  {
    name: 'chomski',
    id: 254,
  },
  {
    name: 'ChucK',
    id: 255,
  },
  {
    name: 'CICS',
    id: 256,
  },
  {
    name: 'Cilk',
    id: 257,
  },
  {
    name: 'CL',
    id: 258,
  },
  {
    name: 'Claire',
    id: 259,
  },
  {
    name: 'Clarion',
    id: 260,
  },
  {
    name: 'Clean',
    id: 261,
  },
  {
    name: 'Clipper',
    id: 262,
  },
  {
    name: 'CLIST',
    id: 263,
  },
  {
    name: 'Clojure',
    id: 264,
  },
  {
    name: 'CLU',
    id: 265,
  },
  {
    name: 'CMS-2',
    id: 266,
  },
  {
    name: 'COBOL',
    id: 267,
  },
  {
    name: 'Cobra',
    id: 268,
  },
  {
    name: 'CODE',
    id: 269,
  },
  {
    name: 'CoffeeScript',
    id: 270,
  },
  {
    name: 'Cola',
    id: 271,
  },
  {
    name: 'ColdC',
    id: 272,
  },
  {
    name: 'ColdFusion',
    id: 273,
  },
  {
    name: 'COMAL',
    id: 274,
  },
  {
    name: 'Combined Programming Language',
    id: 275,
  },
  {
    name: 'COMIT',
    id: 276,
  },
  {
    name: 'Common Intermediate Language',
    id: 277,
  },
  {
    name: 'Common Lisp',
    id: 278,
  },
  {
    name: 'COMPASS',
    id: 279,
  },
  {
    name: 'Component Pascal',
    id: 280,
  },
  {
    name: 'Constraint Handling Rules',
    id: 281,
  },
  {
    name: 'Converge',
    id: 282,
  },
  {
    name: 'Cool',
    id: 283,
  },
  {
    name: 'Coq',
    id: 284,
  },
  {
    name: 'Coral 66',
    id: 285,
  },
  {
    name: 'Corn',
    id: 286,
  },
  {
    name: 'CorVision',
    id: 287,
  },
  {
    name: 'COWSEL',
    id: 288,
  },
  {
    name: 'CPL',
    id: 289,
  },
  {
    name: 'csh',
    id: 290,
  },
  {
    name: 'CSP',
    id: 291,
  },
  {
    name: 'Csound',
    id: 292,
  },
  {
    name: 'CUDA',
    id: 293,
  },
  {
    name: 'Curl',
    id: 294,
  },
  {
    name: 'Curry',
    id: 295,
  },
  {
    name: 'Cyclone',
    id: 296,
  },
  {
    name: 'Cython',
    id: 297,
  },
  {
    name: 'D',
    id: 298,
  },
  {
    name: 'DASL',
    id: 299,
  },
  {
    name: 'Dart',
    id: 300,
  },
  {
    name: 'DataFlex',
    id: 301,
  },
  {
    name: 'Datalog',
    id: 302,
  },
  {
    name: 'DATATRIEVE',
    id: 303,
  },
  {
    name: 'dBase',
    id: 304,
  },
  {
    name: 'dc',
    id: 305,
  },
  {
    name: 'DCL',
    id: 306,
  },
  {
    name: 'Deesel',
    id: 307,
  },
  {
    name: 'Delphi',
    id: 308,
  },
  {
    name: 'DinkC',
    id: 309,
  },
  {
    name: 'DIBOL',
    id: 310,
  },
  {
    name: 'Dog',
    id: 311,
  },
  {
    name: 'Draco',
    id: 312,
  },
  {
    name: 'DRAKON',
    id: 313,
  },
  {
    name: 'Dylan',
    id: 314,
  },
  {
    name: 'DYNAMO',
    id: 315,
  },
  {
    name: 'E',
    id: 316,
  },
  {
    name: 'E#',
    id: 317,
  },
  {
    name: 'Ease',
    id: 318,
  },
  {
    name: 'Easy PL/I',
    id: 319,
  },
  {
    name: 'Easy Programming Language',
    id: 320,
  },
  {
    name: 'EASYTRIEVE PLUS',
    id: 321,
  },
  {
    name: 'ECMAScript',
    id: 322,
  },
  {
    name: 'Edinburgh IMP',
    id: 323,
  },
  {
    name: 'EGL',
    id: 324,
  },
  {
    name: 'Eiffel',
    id: 325,
  },
  {
    name: 'ELAN',
    id: 326,
  },
  {
    name: 'Elixir',
    id: 327,
  },
  {
    name: 'Elm',
    id: 328,
  },
  {
    name: 'Emacs Lisp',
    id: 329,
  },
  {
    name: 'Emerald',
    id: 330,
  },
  {
    name: 'Epigram',
    id: 331,
  },
  {
    name: 'EPL',
    id: 332,
  },
  {
    name: 'Erlang',
    id: 333,
  },
  {
    name: 'es',
    id: 334,
  },
  {
    name: 'Escapade',
    id: 335,
  },
  {
    name: 'Escher',
    id: 336,
  },
  {
    name: 'ESPOL',
    id: 337,
  },
  {
    name: 'Esterel',
    id: 338,
  },
  {
    name: 'Etoys',
    id: 339,
  },
  {
    name: 'Euclid',
    id: 340,
  },
  {
    name: 'Euler',
    id: 341,
  },
  {
    name: 'Euphoria',
    id: 342,
  },
  {
    name: 'EusLisp Robot Programming Language',
    id: 343,
  },
  {
    name: 'CMS EXEC',
    id: 344,
  },
  {
    name: 'EXEC 2',
    id: 345,
  },
  {
    name: 'Executable UML',
    id: 346,
  },
  {
    name: 'F',
    id: 347,
  },
  {
    name: 'F#',
    id: 348,
  },
  {
    name: 'Factor',
    id: 349,
  },
  {
    name: 'Falcon',
    id: 350,
  },
  {
    name: 'Fancy',
    id: 351,
  },
  {
    name: 'Fantom',
    id: 352,
  },
  {
    name: 'FAUST',
    id: 353,
  },
  {
    name: 'Felix',
    id: 354,
  },
  {
    name: 'Ferite',
    id: 355,
  },
  {
    name: 'FFP',
    id: 356,
  },
  {
    name: 'Fjölnir',
    id: 357,
  },
  {
    name: 'FL',
    id: 358,
  },
  {
    name: 'Flavors',
    id: 359,
  },
  {
    name: 'Flex',
    id: 360,
  },
  {
    name: 'FLOW-MATIC',
    id: 361,
  },
  {
    name: 'FOCAL',
    id: 362,
  },
  {
    name: 'FOCUS',
    id: 363,
  },
  {
    name: 'FOIL',
    id: 364,
  },
  {
    name: 'FORMAC',
    id: 365,
  },
  {
    name: '@Formula',
    id: 366,
  },
  {
    name: 'Forth',
    id: 367,
  },
  {
    name: 'Fortran',
    id: 368,
  },
  {
    name: 'Fortress',
    id: 369,
  },
  {
    name: 'FoxBase',
    id: 370,
  },
  {
    name: 'FoxPro',
    id: 371,
  },
  {
    name: 'FP',
    id: 372,
  },
  {
    name: 'FPr',
    id: 373,
  },
  {
    name: 'Franz Lisp',
    id: 374,
  },
  {
    name: 'Frege',
    id: 375,
  },
  {
    name: 'F-Script',
    id: 376,
  },
  {
    name: 'FSProg',
    id: 377,
  },
  {
    name: 'G',
    id: 378,
  },
  {
    name: 'Google Apps Script',
    id: 379,
  },
  {
    name: 'Game Maker Language',
    id: 380,
  },
  {
    name: 'GameMonkey Script',
    id: 381,
  },
  {
    name: 'GAMS',
    id: 382,
  },
  {
    name: 'GAP',
    id: 383,
  },
  {
    name: 'G-code',
    id: 384,
  },
  {
    name: 'Genie',
    id: 385,
  },
  {
    name: 'GDL',
    id: 386,
  },
  {
    name: 'Gibiane',
    id: 387,
  },
  {
    name: 'GJ',
    id: 388,
  },
  {
    name: 'GEORGE',
    id: 389,
  },
  {
    name: 'GLSL',
    id: 390,
  },
  {
    name: 'GNU E',
    id: 391,
  },
  {
    name: 'GM',
    id: 392,
  },
  {
    name: 'Golang',
    id: 393,
  },
  {
    name: 'Go!',
    id: 394,
  },
  {
    name: 'GOAL',
    id: 395,
  },
  {
    name: 'Gödel',
    id: 396,
  },
  {
    name: 'Godiva',
    id: 397,
  },
  {
    name: 'GOM (Good Old Mad)',
    id: 398,
  },
  {
    name: 'Goo',
    id: 399,
  },
  {
    name: 'Gosu',
    id: 400,
  },
  {
    name: 'GOTRAN',
    id: 401,
  },
  {
    name: 'GPSS',
    id: 402,
  },
  {
    name: 'GraphTalk',
    id: 403,
  },
  {
    name: 'GRASS',
    id: 404,
  },
  {
    name: 'Groovy',
    id: 405,
  },
  {
    name: 'Hack (programming language)',
    id: 406,
  },
  {
    name: 'HAL/S',
    id: 407,
  },
  {
    name: 'Hamilton C shell',
    id: 408,
  },
  {
    name: 'Harbour',
    id: 409,
  },
  {
    name: 'Hartmann pipelines',
    id: 410,
  },
  {
    name: 'Haskell',
    id: 411,
  },
  {
    name: 'Haxe',
    id: 412,
  },
  {
    name: 'High Level Assembly',
    id: 413,
  },
  {
    name: 'HLSL',
    id: 414,
  },
  {
    name: 'Hop',
    id: 415,
  },
  {
    name: 'Hope',
    id: 416,
  },
  {
    name: 'Hugo',
    id: 417,
  },
  {
    name: 'Hume',
    id: 418,
  },
  {
    name: 'HyperTalk',
    id: 419,
  },
  {
    name: 'IBM Basic assembly language',
    id: 420,
  },
  {
    name: 'IBM HAScript',
    id: 421,
  },
  {
    name: 'IBM Informix-4GL',
    id: 422,
  },
  {
    name: 'IBM RPG',
    id: 423,
  },
  {
    name: 'ICI',
    id: 424,
  },
  {
    name: 'Icon',
    id: 425,
  },
  {
    name: 'Id',
    id: 426,
  },
  {
    name: 'IDL',
    id: 427,
  },
  {
    name: 'Idris',
    id: 428,
  },
  {
    name: 'IMP',
    id: 429,
  },
  {
    name: 'Inform',
    id: 430,
  },
  {
    name: 'Io',
    id: 431,
  },
  {
    name: 'Ioke',
    id: 432,
  },
  {
    name: 'IPL',
    id: 433,
  },
  {
    name: 'IPTSCRAE',
    id: 434,
  },
  {
    name: 'ISLISP',
    id: 435,
  },
  {
    name: 'ISPF',
    id: 436,
  },
  {
    name: 'ISWIM',
    id: 437,
  },
  {
    name: 'J',
    id: 438,
  },
  {
    name: 'J#',
    id: 439,
  },
  {
    name: 'J++',
    id: 440,
  },
  {
    name: 'JADE',
    id: 441,
  },
  {
    name: 'Jako',
    id: 442,
  },
  {
    name: 'JAL',
    id: 443,
  },
  {
    name: 'Janus',
    id: 444,
  },
  {
    name: 'JASS',
    id: 445,
  },
  {
    name: 'Java',
    id: 446,
  },
  {
    name: 'JavaScript',
    id: 447,
  },
  {
    name: 'JCL',
    id: 448,
  },
  {
    name: 'JEAN',
    id: 449,
  },
  {
    name: 'Join Java',
    id: 450,
  },
  {
    name: 'JOSS',
    id: 451,
  },
  {
    name: 'Joule',
    id: 452,
  },
  {
    name: 'JOVIAL',
    id: 453,
  },
  {
    name: 'Joy',
    id: 454,
  },
  {
    name: 'JScript',
    id: 455,
  },
  {
    name: 'JScript .NET',
    id: 456,
  },
  {
    name: 'JavaFX Script',
    id: 457,
  },
  {
    name: 'Julia',
    id: 458,
  },
  {
    name: 'Jython',
    id: 459,
  },
  {
    name: 'K',
    id: 460,
  },
  {
    name: 'Kaleidoscope',
    id: 461,
  },
  {
    name: 'Karel',
    id: 462,
  },
  {
    name: 'Karel++',
    id: 463,
  },
  {
    name: 'KEE',
    id: 464,
  },
  {
    name: 'Kixtart',
    id: 465,
  },
  {
    name: 'KIF',
    id: 466,
  },
  {
    name: 'Kojo',
    id: 467,
  },
  {
    name: 'Kotlin',
    id: 468,
  },
  {
    name: 'KRC',
    id: 469,
  },
  {
    name: 'KRL',
    id: 470,
  },
  {
    name: 'KUKA',
    id: 471,
  },
  {
    name: 'KRYPTON',
    id: 472,
  },
  {
    name: 'L',
    id: 473,
  },
  {
    name: 'L# .NET',
    id: 474,
  },
  {
    name: 'LabVIEW',
    id: 475,
  },
  {
    name: 'Ladder',
    id: 476,
  },
  {
    name: 'Lagoona',
    id: 477,
  },
  {
    name: 'LANSA',
    id: 478,
  },
  {
    name: 'Lasso',
    id: 479,
  },
  {
    name: 'LaTeX',
    id: 480,
  },
  {
    name: 'Lava',
    id: 481,
  },
  {
    name: 'LC-3',
    id: 482,
  },
  {
    name: 'Leda',
    id: 483,
  },
  {
    name: 'Legoscript',
    id: 484,
  },
  {
    name: 'LIL',
    id: 485,
  },
  {
    name: 'LilyPond',
    id: 486,
  },
  {
    name: 'Limbo',
    id: 487,
  },
  {
    name: 'Limnor',
    id: 488,
  },
  {
    name: 'LINC',
    id: 489,
  },
  {
    name: 'Lingo',
    id: 490,
  },
  {
    name: 'Linoleum',
    id: 491,
  },
  {
    name: 'LIS',
    id: 492,
  },
  {
    name: 'LISA',
    id: 493,
  },
  {
    name: 'Lisaac',
    id: 494,
  },
  {
    name: 'Lisp',
    id: 495,
  },
  {
    name: 'Lite-C',
    id: 496,
  },
  {
    name: 'Lithe',
    id: 497,
  },
  {
    name: 'Little b',
    id: 498,
  },
  {
    name: 'Logo',
    id: 499,
  },
  {
    name: 'Logtalk',
    id: 500,
  },
  {
    name: 'LPC',
    id: 501,
  },
  {
    name: 'LSE',
    id: 502,
  },
  {
    name: 'LSL',
    id: 503,
  },
  {
    name: 'LiveCode',
    id: 504,
  },
  {
    name: 'LiveScript',
    id: 505,
  },
  {
    name: 'Lua',
    id: 506,
  },
  {
    name: 'Lucid',
    id: 507,
  },
  {
    name: 'Lustre',
    id: 508,
  },
  {
    name: 'LYaPAS',
    id: 509,
  },
  {
    name: 'Lynx',
    id: 510,
  },
  {
    name: 'M2001',
    id: 511,
  },
  {
    name: 'M4',
    id: 512,
  },
  {
    name: 'Machine code',
    id: 513,
  },
  {
    name: 'MAD',
    id: 514,
  },
  {
    name: 'MAD/I',
    id: 515,
  },
  {
    name: 'Magik',
    id: 516,
  },
  {
    name: 'Magma',
    id: 517,
  },
  {
    name: 'make',
    id: 518,
  },
  {
    name: 'Maple',
    id: 519,
  },
  {
    name: 'MAPPER',
    id: 520,
  },
  {
    name: 'MARK-IV',
    id: 521,
  },
  {
    name: 'Mary',
    id: 522,
  },
  {
    name: 'MASM Microsoft Assembly x86',
    id: 523,
  },
  {
    name: 'Mathematica',
    id: 524,
  },
  {
    name: 'MATLAB',
    id: 525,
  },
  {
    name: 'Maxima',
    id: 526,
  },
  {
    name: 'Macsyma',
    id: 527,
  },
  {
    name: 'Max',
    id: 528,
  },
  {
    name: 'MaxScript',
    id: 529,
  },
  {
    name: 'Maya (MEL)',
    id: 530,
  },
  {
    name: 'MDL',
    id: 531,
  },
  {
    name: 'Mercury',
    id: 532,
  },
  {
    name: 'Mesa',
    id: 533,
  },
  {
    name: 'Metacard',
    id: 534,
  },
  {
    name: 'Metafont',
    id: 535,
  },
  {
    name: 'MetaL',
    id: 536,
  },
  {
    name: 'Microcode',
    id: 537,
  },
  {
    name: 'MicroScript',
    id: 538,
  },
  {
    name: 'MIIS',
    id: 539,
  },
  {
    name: 'MillScript',
    id: 540,
  },
  {
    name: 'MIMIC',
    id: 541,
  },
  {
    name: 'Mirah',
    id: 542,
  },
  {
    name: 'Miranda',
    id: 543,
  },
  {
    name: 'MIVA Script',
    id: 544,
  },
  {
    name: 'ML',
    id: 545,
  },
  {
    name: 'Moby',
    id: 546,
  },
  {
    name: 'Model 204',
    id: 547,
  },
  {
    name: 'Modelica',
    id: 548,
  },
  {
    name: 'Modula',
    id: 549,
  },
  {
    name: 'Modula-2',
    id: 550,
  },
  {
    name: 'Modula-3',
    id: 551,
  },
  {
    name: 'Mohol',
    id: 552,
  },
  {
    name: 'MOO',
    id: 553,
  },
  {
    name: 'Mortran',
    id: 554,
  },
  {
    name: 'Mouse',
    id: 555,
  },
  {
    name: 'MPD',
    id: 556,
  },
  {
    name: 'CIL',
    id: 557,
  },
  {
    name: 'MSL',
    id: 558,
  },
  {
    name: 'MUMPS',
    id: 559,
  },
  {
    name: 'NASM',
    id: 560,
  },
  {
    name: 'NATURAL',
    id: 561,
  },
  {
    name: 'Napier88',
    id: 562,
  },
  {
    name: 'Neko',
    id: 563,
  },
  {
    name: 'Nemerle',
    id: 564,
  },
  {
    name: 'nesC',
    id: 565,
  },
  {
    name: 'NESL',
    id: 566,
  },
  {
    name: 'Net.Data',
    id: 567,
  },
  {
    name: 'NetLogo',
    id: 568,
  },
  {
    name: 'NetRexx',
    id: 569,
  },
  {
    name: 'NewLISP',
    id: 570,
  },
  {
    name: 'NEWP',
    id: 571,
  },
  {
    name: 'Newspeak',
    id: 572,
  },
  {
    name: 'NewtonScript',
    id: 573,
  },
  {
    name: 'NGL',
    id: 574,
  },
  {
    name: 'Nial',
    id: 575,
  },
  {
    name: 'Nice',
    id: 576,
  },
  {
    name: 'Nickle',
    id: 577,
  },
  {
    name: 'Nim',
    id: 578,
  },
  {
    name: 'NPL',
    id: 579,
  },
  {
    name: 'Not eXactly C',
    id: 580,
  },
  {
    name: 'Not Quite C',
    id: 581,
  },
  {
    name: 'NSIS',
    id: 582,
  },
  {
    name: 'Nu',
    id: 583,
  },
  {
    name: 'NWScript',
    id: 584,
  },
  {
    name: 'NXT-G',
    id: 585,
  },
  {
    name: 'o:XML',
    id: 586,
  },
  {
    name: 'Oak',
    id: 587,
  },
  {
    name: 'Oberon',
    id: 588,
  },
  {
    name: 'Obix',
    id: 589,
  },
  {
    name: 'OBJ2',
    id: 590,
  },
  {
    name: 'Object Lisp',
    id: 591,
  },
  {
    name: 'ObjectLOGO',
    id: 592,
  },
  {
    name: 'Object REXX',
    id: 593,
  },
  {
    name: 'Object Pascal',
    id: 594,
  },
  {
    name: 'Objective-C',
    id: 595,
  },
  {
    name: 'Objective-J',
    id: 596,
  },
  {
    name: 'Obliq',
    id: 597,
  },
  {
    name: 'Obol',
    id: 598,
  },
  {
    name: 'OCaml',
    id: 599,
  },
  {
    name: 'occam',
    id: 600,
  },
  {
    name: 'occam-π',
    id: 601,
  },
  {
    name: 'Octave',
    id: 602,
  },
  {
    name: 'OmniMark',
    id: 603,
  },
  {
    name: 'Onyx',
    id: 604,
  },
  {
    name: 'Opa',
    id: 605,
  },
  {
    name: 'Opal',
    id: 606,
  },
  {
    name: 'OpenCL',
    id: 607,
  },
  {
    name: 'OpenEdge ABL',
    id: 608,
  },
  {
    name: 'OPL',
    id: 609,
  },
  {
    name: 'OPS5',
    id: 610,
  },
  {
    name: 'OptimJ',
    id: 611,
  },
  {
    name: 'Orc',
    id: 612,
  },
  {
    name: 'ORCA/Modula-2',
    id: 613,
  },
  {
    name: 'Oriel',
    id: 614,
  },
  {
    name: 'Orwell',
    id: 615,
  },
  {
    name: 'Oxygene',
    id: 616,
  },
  {
    name: 'Oz',
    id: 617,
  },
  {
    name: 'P#',
    id: 618,
  },
  {
    name: 'ParaSail (programming language)',
    id: 619,
  },
  {
    name: 'PARI/GP',
    id: 620,
  },
  {
    name: 'Pascal',
    id: 621,
  },
  {
    name: 'Pawn',
    id: 622,
  },
  {
    name: 'PCASTL',
    id: 623,
  },
  {
    name: 'PCF',
    id: 624,
  },
  {
    name: 'PEARL',
    id: 625,
  },
  {
    name: 'PeopleCode',
    id: 626,
  },
  {
    name: 'Perl',
    id: 627,
  },
  {
    name: 'PDL',
    id: 628,
  },
  {
    name: 'PHP',
    id: 629,
  },
  {
    name: 'Phrogram',
    id: 630,
  },
  {
    name: 'Pico',
    id: 631,
  },
  {
    name: 'Picolisp',
    id: 632,
  },
  {
    name: 'Pict',
    id: 633,
  },
  {
    name: 'Pike',
    id: 634,
  },
  {
    name: 'PIKT',
    id: 635,
  },
  {
    name: 'PILOT',
    id: 636,
  },
  {
    name: 'Pipelines',
    id: 637,
  },
  {
    name: 'Pizza',
    id: 638,
  },
  {
    name: 'PL-11',
    id: 639,
  },
  {
    name: 'PL/0',
    id: 640,
  },
  {
    name: 'PL/B',
    id: 641,
  },
  {
    name: 'PL/C',
    id: 642,
  },
  {
    name: 'PL/I',
    id: 643,
  },
  {
    name: 'PL/M',
    id: 644,
  },
  {
    name: 'PL/P',
    id: 645,
  },
  {
    name: 'PL/SQL',
    id: 646,
  },
  {
    name: 'PL360',
    id: 647,
  },
  {
    name: 'PLANC',
    id: 648,
  },
  {
    name: 'Plankalkül',
    id: 649,
  },
  {
    name: 'Planner',
    id: 650,
  },
  {
    name: 'PLEX',
    id: 651,
  },
  {
    name: 'PLEXIL',
    id: 652,
  },
  {
    name: 'Plus',
    id: 653,
  },
  {
    name: 'POP-11',
    id: 654,
  },
  {
    name: 'PostScript',
    id: 655,
  },
  {
    name: 'PortablE',
    id: 656,
  },
  {
    name: 'Powerhouse',
    id: 657,
  },
  {
    name: 'PowerBuilder',
    id: 658,
  },
  {
    name: 'PowerShell',
    id: 659,
  },
  {
    name: 'PPL',
    id: 660,
  },
  {
    name: 'Processing',
    id: 661,
  },
  {
    name: 'Processing.js',
    id: 662,
  },
  {
    name: 'Prograph',
    id: 663,
  },
  {
    name: 'PROIV',
    id: 664,
  },
  {
    name: 'Prolog',
    id: 665,
  },
  {
    name: 'PROMAL',
    id: 666,
  },
  {
    name: 'Promela',
    id: 667,
  },
  {
    name: 'PROSE modeling language',
    id: 668,
  },
  {
    name: 'PROTEL',
    id: 669,
  },
  {
    name: 'ProvideX',
    id: 670,
  },
  {
    name: 'Pro*C',
    id: 671,
  },
  {
    name: 'Pure',
    id: 672,
  },
  {
    name: 'Python',
    id: 673,
  },
  {
    name: 'Q (equational programming language)',
    id: 674,
  },
  {
    name: 'Q (programming language from Kx Systems)',
    id: 675,
  },
  {
    name: 'Qalb',
    id: 676,
  },
  {
    name: 'QtScript',
    id: 677,
  },
  {
    name: 'QuakeC',
    id: 678,
  },
  {
    name: 'QPL',
    id: 679,
  },
  {
    name: 'R',
    id: 680,
  },
  {
    name: 'R++',
    id: 681,
  },
  {
    name: 'Racket',
    id: 682,
  },
  {
    name: 'RAPID',
    id: 683,
  },
  {
    name: 'Rapira',
    id: 684,
  },
  {
    name: 'Ratfiv',
    id: 685,
  },
  {
    name: 'Ratfor',
    id: 686,
  },
  {
    name: 'rc',
    id: 687,
  },
  {
    name: 'REBOL',
    id: 688,
  },
  {
    name: 'Red',
    id: 689,
  },
  {
    name: 'Redcode',
    id: 690,
  },
  {
    name: 'REFAL',
    id: 691,
  },
  {
    name: 'Reia',
    id: 692,
  },
  {
    name: 'Revolution',
    id: 693,
  },
  {
    name: 'rex',
    id: 694,
  },
  {
    name: 'REXX',
    id: 695,
  },
  {
    name: 'Rlab',
    id: 696,
  },
  {
    name: 'RobotC',
    id: 697,
  },
  {
    name: 'ROOP',
    id: 698,
  },
  {
    name: 'RPG',
    id: 699,
  },
  {
    name: 'RPL',
    id: 700,
  },
  {
    name: 'RSL',
    id: 701,
  },
  {
    name: 'RTL/2',
    id: 702,
  },
  {
    name: 'Ruby',
    id: 703,
  },
  {
    name: 'RuneScript',
    id: 704,
  },
  {
    name: 'Rust',
    id: 705,
  },
  {
    name: 'S',
    id: 706,
  },
  {
    name: 'S2',
    id: 707,
  },
  {
    name: 'S3',
    id: 708,
  },
  {
    name: 'S-Lang',
    id: 709,
  },
  {
    name: 'S-PLUS',
    id: 710,
  },
  {
    name: 'SA-C',
    id: 711,
  },
  {
    name: 'SabreTalk',
    id: 712,
  },
  {
    name: 'SAIL',
    id: 713,
  },
  {
    name: 'SALSA',
    id: 714,
  },
  {
    name: 'SAM76',
    id: 715,
  },
  {
    name: 'SAS',
    id: 716,
  },
  {
    name: 'SASL',
    id: 717,
  },
  {
    name: 'Sather',
    id: 718,
  },
  {
    name: 'Sawzall',
    id: 719,
  },
  {
    name: 'SBL',
    id: 720,
  },
  {
    name: 'Scala',
    id: 721,
  },
  {
    name: 'Scheme',
    id: 722,
  },
  {
    name: 'Scilab',
    id: 723,
  },
  {
    name: 'Scratch',
    id: 724,
  },
  {
    name: 'Script.NET',
    id: 725,
  },
  {
    name: 'Sed',
    id: 726,
  },
  {
    name: 'Seed7',
    id: 727,
  },
  {
    name: 'Self',
    id: 728,
  },
  {
    name: 'SenseTalk',
    id: 729,
  },
  {
    name: 'SequenceL',
    id: 730,
  },
  {
    name: 'SETL',
    id: 731,
  },
  {
    name: 'Shift Script',
    id: 732,
  },
  {
    name: 'SIMPOL',
    id: 733,
  },
  {
    name: 'SIGNAL',
    id: 734,
  },
  {
    name: 'SiMPLE',
    id: 735,
  },
  {
    name: 'SIMSCRIPT',
    id: 736,
  },
  {
    name: 'Simula',
    id: 737,
  },
  {
    name: 'Simulink',
    id: 738,
  },
  {
    name: 'SISAL',
    id: 739,
  },
  {
    name: 'SLIP',
    id: 740,
  },
  {
    name: 'SMALL',
    id: 741,
  },
  {
    name: 'Smalltalk',
    id: 742,
  },
  {
    name: 'Small Basic',
    id: 743,
  },
  {
    name: 'SML',
    id: 744,
  },
  {
    name: 'Snap!',
    id: 745,
  },
  {
    name: 'SNOBOL',
    id: 746,
  },
  {
    name: 'SPITBOL',
    id: 747,
  },
  {
    name: 'Snowball',
    id: 748,
  },
  {
    name: 'SOL',
    id: 749,
  },
  {
    name: 'Span',
    id: 750,
  },
  {
    name: 'SPARK',
    id: 751,
  },
  {
    name: 'Speedcode',
    id: 752,
  },
  {
    name: 'SPIN',
    id: 753,
  },
  {
    name: 'SP/k',
    id: 754,
  },
  {
    name: 'SPS',
    id: 755,
  },
  {
    name: 'Squeak',
    id: 756,
  },
  {
    name: 'Squirrel',
    id: 757,
  },
  {
    name: 'SR',
    id: 758,
  },
  {
    name: 'S/SL',
    id: 759,
  },
  {
    name: 'Stackless Python',
    id: 760,
  },
  {
    name: 'Starlogo',
    id: 761,
  },
  {
    name: 'Strand',
    id: 762,
  },
  {
    name: 'Stata',
    id: 763,
  },
  {
    name: 'Stateflow',
    id: 764,
  },
  {
    name: 'Subtext',
    id: 765,
  },
  {
    name: 'SuperCollider',
    id: 766,
  },
  {
    name: 'SuperTalk',
    id: 767,
  },
  {
    name: 'Swift (Apple programming language)',
    id: 768,
  },
  {
    name: 'Swift (parallel scripting language)',
    id: 769,
  },
  {
    name: 'SYMPL',
    id: 770,
  },
  {
    name: 'SyncCharts',
    id: 771,
  },
  {
    name: 'SystemVerilog',
    id: 772,
  },
  {
    name: 'T',
    id: 773,
  },
  {
    name: 'TACL',
    id: 774,
  },
  {
    name: 'TACPOL',
    id: 775,
  },
  {
    name: 'TADS',
    id: 776,
  },
  {
    name: 'TAL',
    id: 777,
  },
  {
    name: 'Tcl',
    id: 778,
  },
  {
    name: 'Tea',
    id: 779,
  },
  {
    name: 'TECO',
    id: 780,
  },
  {
    name: 'TELCOMP',
    id: 781,
  },
  {
    name: 'TeX',
    id: 782,
  },
  {
    name: 'TEX',
    id: 783,
  },
  {
    name: 'TIE',
    id: 784,
  },
  {
    name: 'Timber',
    id: 785,
  },
  {
    name: 'TMG',
    id: 786,
  },
  {
    name: 'Tom',
    id: 787,
  },
  {
    name: 'TOM',
    id: 788,
  },
  {
    name: 'Topspeed',
    id: 789,
  },
  {
    name: 'TPU',
    id: 790,
  },
  {
    name: 'Trac',
    id: 791,
  },
  {
    name: 'TTM',
    id: 792,
  },
  {
    name: 'T-SQL',
    id: 793,
  },
  {
    name: 'TTCN',
    id: 794,
  },
  {
    name: 'Turing',
    id: 795,
  },
  {
    name: 'TUTOR',
    id: 796,
  },
  {
    name: 'TXL',
    id: 797,
  },
  {
    name: 'TypeScript',
    id: 798,
  },
  {
    name: 'Turbo C++',
    id: 799,
  },
  {
    name: 'Ubercode',
    id: 800,
  },
  {
    name: 'UCSD Pascal',
    id: 801,
  },
  {
    name: 'Umple',
    id: 802,
  },
  {
    name: 'Unicon',
    id: 803,
  },
  {
    name: 'Uniface',
    id: 804,
  },
  {
    name: 'UNITY',
    id: 805,
  },
  {
    name: 'Unix shell',
    id: 806,
  },
  {
    name: 'UnrealScript',
    id: 807,
  },
  {
    name: 'Vala',
    id: 808,
  },
  {
    name: 'VBA',
    id: 809,
  },
  {
    name: 'VBScript',
    id: 810,
  },
  {
    name: 'Verilog',
    id: 811,
  },
  {
    name: 'VHDL',
    id: 812,
  },
  {
    name: 'Visual Basic',
    id: 813,
  },
  {
    name: 'Visual Basic .NET',
    id: 814,
  },
  {
    name: 'Visual DataFlex',
    id: 815,
  },
  {
    name: 'Visual DialogScript',
    id: 816,
  },
  {
    name: 'Visual Fortran',
    id: 817,
  },
  {
    name: 'Visual FoxPro',
    id: 818,
  },
  {
    name: 'Visual J++',
    id: 819,
  },
  {
    name: 'Visual J#',
    id: 820,
  },
  {
    name: 'Visual Objects',
    id: 821,
  },
  {
    name: 'Visual Prolog',
    id: 822,
  },
  {
    name: 'VSXu',
    id: 823,
  },
  {
    name: 'Vvvv',
    id: 824,
  },
  {
    name: 'WATFIV, WATFOR',
    id: 825,
  },
  {
    name: 'WebDNA',
    id: 826,
  },
  {
    name: 'WebQL',
    id: 827,
  },
  {
    name: 'Windows PowerShell',
    id: 828,
  },
  {
    name: 'Winbatch',
    id: 829,
  },
  {
    name: 'Wolfram',
    id: 830,
  },
  {
    name: 'Wyvern',
    id: 831,
  },
  {
    name: 'X++',
    id: 832,
  },
  {
    name: 'X#',
    id: 833,
  },
  {
    name: 'X10',
    id: 834,
  },
  {
    name: 'XBL',
    id: 835,
  },
  {
    name: 'XC',
    id: 836,
  },
  {
    name: 'XMOS architecture',
    id: 837,
  },
  {
    name: 'xHarbour',
    id: 838,
  },
  {
    name: 'XL',
    id: 839,
  },
  {
    name: 'Xojo',
    id: 840,
  },
  {
    name: 'XOTcl',
    id: 841,
  },
  {
    name: 'XPL',
    id: 842,
  },
  {
    name: 'XPL0',
    id: 843,
  },
  {
    name: 'XQuery',
    id: 844,
  },
  {
    name: 'XSB',
    id: 845,
  },
  {
    name: 'XSLT',
    id: 846,
  },
  {
    name: 'XPath',
    id: 847,
  },
  {
    name: 'Xtend',
    id: 848,
  },
  {
    name: 'Yorick',
    id: 849,
  },
  {
    name: 'YQL',
    id: 850,
  },
  {
    name: 'Z notation',
    id: 851,
  },
  {
    name: 'Zeno',
    id: 852,
  },
  {
    name: 'ZOPL',
    id: 853,
  },
  {
    name: 'ZPL',
    id: 854,
  },
];
export default SKILLS;
