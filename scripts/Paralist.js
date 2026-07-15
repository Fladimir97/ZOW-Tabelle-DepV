/* 
   ____                        _ _    
  / __ \                      (_) |   
 | |  | |_ __ __ _  __ _ _ __  _| | __
 | |  | | '__/ _` |/ _` | '_ \| | |/ /
 | |__| | | | (_| | (_| | | | | |   < 
  \____/|_|  \__, |\__,_|_| |_|_|_|\_\
              __/ |                   
             |___/                    

*/    

const GV = new Parameter("Glühverlust", "Organik", "M-%", 0, 
    {
    "0":     [3, 5],
    "I":     [3,5],
    "II":    5,
    "III":   10,
    })

const TOC = new Parameter("TOC", "Organik", "M-%", 0, 
    {
    "0":     [1, 3],
    "I":     [1, 3],
    "II":    3,
    "III":   6,
    })

const OrganikList = [GV, TOC];

/* 
  ______        _       _         __  __ 
 |  ____|      | |     | |       / _|/ _|
 | |__ ___  ___| |_ ___| |_ ___ | |_| |_ 
 |  __/ _ \/ __| __/ __| __/ _ \|  _|  _|
 | | |  __/\__ \ |_\__ \ || (_) | | | |  
 |_|  \___||___/\__|___/\__\___/|_| |_|  
                                         

*/                                     



const BTEX = new Parameter("BTEX", "Feststoff", "mg/kg", 0, 
    {
    "0":     6,
    "I":     30,
    "II":    30,
    "III":   30,
    });



const PCB = new Parameter("PCB₇", "Feststoff", "mg/kg", 0, 
    {
    "0":     1,
    "I":     5,
    "II":    10,
    });




const MKW = new Parameter("MKW-C₁₀₋₄₀", "Feststoff", "mg/kg", 0, 
    {
    "0":     500,
    "I":     4000,
    "II":    8000,
    "III":   8000,
    });


const PAK = new Parameter("PAK₁₆", "Feststoff", "mg/kg", 0, 
    {
    "0":     30,
    "I":     500,
    "II":    1000,
    "III":   1000,
    });


const ELS = new Parameter("Extrahierbare lipophile Stoffe", "Feststoff", "M-%", 1, 
    {
    "0":     0.1,
    "I":     0.4,
    "II":    0.8,
    "III":   4.0,
    });


const FeststoffList = [ BTEX, PCB, MKW, PAK, ELS];

/* 
const MusterParameter = new Parameter("", "", "", 0, 
    {
    "0":     ,
    "I":     ,
    "II":    ,
    "III":   ,
    });
*/

/* 
  ______ _             _   
 |  ____| |           | |  
 | |__  | |_   _  __ _| |_ 
 |  __| | | | | |/ _` | __|
 | |____| | |_| | (_| | |_ 
 |______|_|\__,_|\__,_|\__|
                           
                           
*/

const PH = new DoubleParameter("PH-Wert", "Eluat", "PH", 1, {
    "0":    [5.5, 13.0],
    "I":    [5.5, 13.0],
    "II":   [5.5, 13.0],
    "III":  [4.0, 13.0],
    });



const DOC = new Parameter("DOC", "Eluat", "mg/l", 0, 
    {
    "0":     50,
    "I":     50,
    "II":    80,
    "III":   100,
    });


const Phenole = new Parameter("Phenole", "Eluat", "mg/l", 1, 
    {
    "0":     0.1,
    "I":     0.2,
    "II":    50.0,
    "III":   100.0,
    });


const Arsen = new Parameter("Arsen", "Eluat", "mg/l", 2, 
    {
    "0":     0.05,
    "I":     0.20,
    "II":    0.20,
    "III":   2.50,
    });

const Blei = new Parameter("Blei", "Eluat", "mg/l", 2, 
    {
    "0":     0.05,
    "I":     0.20,
    "II":    1.00,
    "III":   5.00,
    });

const Cadmium = new Parameter("Cadmium", "Eluat", "mg/l", 3, 
    {
    "0":     0.004,
    "I":     0.050,
    "II":    0.100,
    "III":   0.500,
    });

const Kupfer = new Parameter("Kupfer", "Eluat", "mg/l", 1, 
    {
    "0":     0.2,
    "I":     1.0,
    "II":    5.0,
    "III":   10.0,
    });

const Nickel = new Parameter("Nickel", "Eluat", "mg/l", 2, 
    {
    "0":     0.04,
    "I":     0.20,
    "II":    1.00,
    "III":   4.00,
    });

const Quecksilber = new Parameter("Quecksilber", "Eluat", "mg/l", 3, 
    {
    "0":     0.001,
    "I":     0.005,
    "II":    0.020,
    "III":   0.200,
    });



const Zink = new Parameter("Zink", "Eluat", "mg/l", 1, 
    {
    "0":     0.4,
    "I":     2.0,
    "II":    5.0,
    "III":   20.0,
    });


const Chlorid = new Parameter("Chlorid", "Eluat", "mg/l", 0, 
    {
    "0":     80,
    "I":     1500,
    "II":    1500,
    "III":   2500,
    });


const Sulfat = new Parameter("Sulfat", "Eluat", "mg/l", 0, 
    {
    "0":     100,
    "I":     2000,
    "II":    2000,
    "III":   5000,
    });

const Cyanide = new Parameter("Cyanide leicht freisetzbar", "Eluat", "mg/l", 2, 
    {
    "0":     0.01,
    "I":     0.10,
    "II":    0.50,
    "III":   1.00,
    });


const Fluorid = new Parameter("Fluorid", "Eluat", "mg/l", 0, 
    {
    "0":     1,
    "I":     5,
    "II":    15,
    "III":   50,
    });


const Barium = new Parameter("Barium", "Eluat", "mg/l", 0, 
    {
    "0":     2,
    "I":     5,
    "II":    10,
    "III":   30,
    });


const Chrom = new Parameter("Chrom", "Eluat", "mg/l", 2, 
    {
    "0":     0.05,
    "I":     0.30,
    "II":    1.00,
    "III":   7.00,
    });


const Molybdän = new Parameter("Molybdän", "Eluat", "mg/l", 2, 
    {
    "0":     0.05,
    "I":     0.30,
    "II":    1.00,
    "III":   3.00,
    });

const Antimon = new Parameter("Antimon", "Eluat", "mg/l", 3, 
    {
    "0":     0.006,
    "I":     0.030,
    "II":    0.070,
    "III":   0.500,
    });


const AntimonCo = new Parameter("Antimon Co", "Eluat", "mg/l", 2, 
    {
    "0":     0.10,
    "I":     0.12,
    "II":    0.15,
    "III":   1.00,
    });


const Selen = new Parameter("Selen", "Eluat", "mg/l", 2, 
    {
    "0":     0.01,
    "I":     0.03,
    "II":    0.05,
    "III":   0.70,
    });

const GesGelFS = new Parameter("∑ gelöste Feststoffe", "Eluat", "mg/l", 0, 
    {
    "0":     400,
    "I":     3000,
    "II":    6000,
    "III":   10000,
    });




/* 
const MusterParameter = new Parameter("", "Eluat", "mg/l", 0, 
    {
    "0":     ,
    "I":     ,
    "II":    ,
    "III":   ,
    });
*/


/*
  _      _     _             
 | |    (_)   | |            
 | |     _ ___| |_ ___ _ __  
 | |    | / __| __/ _ \ '_ \ 
 | |____| \__ \ ||  __/ | | |
 |______|_|___/\__\___|_| |_|

*/                             
                            




const EluatList = [PH, DOC, Phenole, Arsen, Blei, Cadmium, Kupfer, Nickel, Quecksilber, Zink, Chlorid, Sulfat, Cyanide, Fluorid, Barium, Chrom, Molybdän, Antimon, AntimonCo, Selen, GesGelFS];


const InitParaList = [OrganikList, FeststoffList, EluatList]
const ParaList = OrganikList.concat(FeststoffList, EluatList)

