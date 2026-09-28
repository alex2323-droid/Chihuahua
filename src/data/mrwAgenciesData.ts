export interface MRWAgency {
  id?: number;
  code: string;
  name: string;
  state: string;
  municipality: string;
  city: string;
  address: string;
  phone?: string;
  lat?: string;
  lng?: string;
}

export const OFFICIAL_MRW_URL = "https://mrwve.com/mi-envio#agencias";

export const MRW_AGENCIES_DATABASE: MRWAgency[] = [
  {
    "id": 1,
    "code": "#0101000",
    "name": "MRW Los Caobos",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV PANAM- AV LIBERTADOR QUINTA MRW, AL LADO DE AUVISIÓN C.A. DETRAS DEL RESTAURANT GRAN YEN, SUBIENDO POR LA TORRE POLAR. LOS CAOBOS.",
    "lat": "10.498371",
    "lng": "-66.883089",
    "municipality": "Libertador"
  },
  {
    "id": 2,
    "code": "#0102000",
    "name": "MRW Bello Monte",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Baruta)",
    "address": "AVENIDA MIGUELANGEL, EDIFICIO OBERON, LOCAL E, FRENTE A LA PASTELER-A LA SABRINA, AL LADO DE PINTA CASA, COLINAS DE BELLO MONTE 10°29'10.3\"N 66°52'23.7\"W",
    "lat": "10.486194",
    "lng": "-66.873250",
    "municipality": "Baruta"
  },
  {
    "id": 3,
    "code": "#0103000",
    "name": "MRW el Llanito",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Sucre / Petare)",
    "address": "AV. PRINCIPAL TAMANACO, EL LLANITO, QTA. CELIA, FRENTE AL SUPERMERCADO ACUARIO, PISO: MEZZANINA, LOCAL 5 GPS: 10.4716649,-66.8066276",
    "lat": "10.470025",
    "lng": "-66.809274",
    "municipality": "Sucre"
  },
  {
    "id": 4,
    "code": "#0103100",
    "name": "MRW Plaza Las Americas",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Sucre / Petare)",
    "address": "CENTRO COMERCIAL PLAZA LAS AMERICAS. NIVEL ORO. LOCAL 107-A. EL CAFETAL GPS: 10.458950, -66.828896",
    "lat": "10.458384",
    "lng": "-66.828957",
    "municipality": "Sucre"
  },
  {
    "id": 5,
    "code": "#0104000",
    "name": "MRW Centro",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV. UNIVERSIDAD, ESQ. DE SOCIEDAD A GRADILLAS, EDIF. HUMBOLT P.B. LOCAL MRW. 10.504785537719727,-66.91412353515625",
    "lat": "10.504919",
    "lng": "-66.914296",
    "municipality": "Libertador"
  },
  {
    "id": 6,
    "code": "#0105000",
    "name": "MRW Chacao el Muñeco",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Chacao)",
    "address": "CALLE EL MUÑECO ENTRE AV. LIBERTADOR Y AV FRANCISCO DE MIRANDA EDIF GUAN PB LOCAL 7 10.49131,-66.8581542",
    "lat": "10.491310",
    "lng": "-66.858154",
    "municipality": "Chacao"
  },
  {
    "id": 7,
    "code": "#0106000",
    "name": "MRW Chuao",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "C.C.C.T, PB. SECTOR EL PUEBLO. LOCAL F. SALIDA AL ESTACIONAMIENTO DE LA TORRE A. CHUAO. GPS: 10.484559,-66.8564348,17",
    "lat": "10.484362",
    "lng": "-66.855774",
    "municipality": "Libertador"
  },
  {
    "id": 8,
    "code": "#0107000",
    "name": "MRW el Paraiso",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "URBANIZACION EL PARAISO, ENTRE AVENIDA BOLIVAR Y AVENIDAS LAS FUENTES A 20 MTS DE LA PLAZA WASHINGTON, QUINTA FRANCELIS PB LOCAL 1, EL PARAISO CARACAS.",
    "lat": "10.482660",
    "lng": "-66.939094",
    "municipality": "Libertador"
  },
  {
    "id": 9,
    "code": "#0108000",
    "name": "MRW Plaza Estrella",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "PLAZA ESTRELLA A SAN FELIPE, RES. DORABEL, PB LOCAL 3. A MEDIA CUADRA DEL PASAJE ANAUCO. SAN BERNARDINO. GPS: 10.5082611,-66.9029304.",
    "lat": "10.510336",
    "lng": "-66.903495",
    "municipality": "Libertador"
  },
  {
    "id": 10,
    "code": "#0109000",
    "name": "MRW Campo Claro",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Chacao)",
    "address": "AV.FRANCISCO DE MIRANDA EDF. VALENCIA 1 CAMPO CLARO LOS DOS CAMINOS. GPS: 10.4933241,-66.8308808",
    "lat": "10.493464",
    "lng": "-66.83077",
    "municipality": "Chacao"
  },
  {
    "id": 11,
    "code": "#0110000",
    "name": "MRW la Trinidad",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Baruta)",
    "address": "CALLE DEL ARENAL, CASA LAURA, N° 15-14, A DOS CUADRAS DEL FARMATODO DE LA ZONA INDUSTRIAL DE LA TRINIDAD. GPS:10.4363249,-66.8612064",
    "lat": "10.436393",
    "lng": "-66.861154",
    "municipality": "Baruta"
  },
  {
    "id": 12,
    "code": "#0111000",
    "name": "MRW Los Chaguaramos",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV. UNIVERSIDAD, URB. LOS CHAGUARAMOS, EDF. MAURICA, PB, LOCAL G, SE ENCUENTRA UBICADO FRENTE A LA IGLESIA SAN PEDRO, CARACAS. GPS: 10.484966,-66.8922411",
    "lat": "10.484966",
    "lng": "-66.892241",
    "municipality": "Libertador"
  },
  {
    "id": 13,
    "code": "#0113000",
    "name": "MRW Lebrun Petare",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Sucre / Petare)",
    "address": "CALLE LOS NARANJOS EDF. LEBRUN PISO P.B LOCAL 19 , URB LEBRUN.",
    "lat": "10.48053",
    "lng": "-66.81202",
    "municipality": "Sucre"
  },
  {
    "id": 14,
    "code": "#0113200",
    "name": "MRW Palo Verde",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Sucre / Petare)",
    "address": "CENTRO COMERCIAL PALO VERDE, NIVEL II, LOCAL N 2-27D, AL LADO DE LA PIÑATERIA BEHIRAS SHOP",
    "lat": "10.479160",
    "lng": "-66.797226",
    "municipality": "Sucre"
  },
  {
    "id": 15,
    "code": "#0114000",
    "name": "MRW Sabana Grande",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Baruta)",
    "address": "AV. ORINOCO, ENTRE CALLES 2DA Y CARON-, QUINTA ISM+NIA, P.B. SECTOR SABANA GRANDE - BELLO MONTE NORTE. GPS: 10.4889629,-66.8748077",
    "lat": "10.488945",
    "lng": "-66.874715",
    "municipality": "Baruta"
  },
  {
    "id": 16,
    "code": "#0115000",
    "name": "MRW Altamira",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Chacao)",
    "address": "AV SAN JUAN BOSCO CON 1ERA TRANSVERSAL EDIFICIO EXCELSIOR PB LOCAL 2 AL LADO DE ORGANIGO. GPS:10.496381, -66.849539",
    "lat": "10.496381",
    "lng": "-66.849539",
    "municipality": "Chacao"
  },
  {
    "id": 17,
    "code": "#0116000",
    "name": "MRW Los Chorros",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Sucre / Petare)",
    "address": "AV. PINCIPAL LA CARLOTA ENTRE AV. FRANCISCO DE MIRANDA Y ROMULO GALLEGOS, EDF. BERTHA, LOCAL 05 PUNTO DE REFERENCIA FRENTE A LA ZONA DE CARGA DEL MILLENIUM, LOS DOS CAMINOS 10.4977255,-66.8265758",
    "lat": "10.497725",
    "lng": "-66.826575",
    "municipality": "Sucre"
  },
  {
    "id": 18,
    "code": "#0118000",
    "name": "MRW la Piramide",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Baruta)",
    "address": "AV R-O PARAGUA EDIF CENTRO COMERCIAL LA PIRAMIDE PISO PB LOCAL 6A URB PRADOS DEL ESTE, SECTOR PARQUE HUMBOLDT, CARACAS 10.4530563,-66.8708792",
    "lat": "10.453056",
    "lng": "-66.870879",
    "municipality": "Baruta"
  },
  {
    "id": 19,
    "code": "#0117000",
    "name": "MRW Baruta",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Baruta)",
    "address": "AV. SAN SEBASTIAN , CENTRO COMERCIAL LOS GONZALEZ , LOCAL MRW , AL LADO DE LA COPA CREMA BARUTA",
    "lat": "10.434945",
    "lng": "-66.875451",
    "municipality": "Baruta"
  },
  {
    "id": 20,
    "code": "#0119000",
    "name": "MRW Las Acacias",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AVENIDA PRESIDENTE MEDINA ANGARITA (AV. VICTORIA), EDIFICIO \"BETANIA\", PLANTA BAJA, LOCAL MRW. URB. LAS ACACIAS. PUNTO DE REFERENCIA: FRENTE A REPUESTOS PAMACA DE LA FORD.",
    "lat": "10.485945",
    "lng": "-66.904016",
    "municipality": "Libertador"
  },
  {
    "id": 21,
    "code": "#0120000",
    "name": "MRW la Urbina",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Sucre / Petare)",
    "address": "AV. PPAL. LA URBINA. EDIF. APULIA. P.B. CERCA A LA PANADER-A TULIP-N. LA URBINA",
    "lat": "10.491623",
    "lng": "-66.804648",
    "municipality": "Sucre"
  },
  {
    "id": 23,
    "code": "#0122000",
    "name": "MRW Los Rosales",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV. LOS LAURELES CON AV. ROOSEVELT, RES. TIUNA LOCAL E. PB FRENTE A PLAZA TIUNA LOS ROSALES. GPS: 10.4809693,-66.900801",
    "lat": "10.481313",
    "lng": "-66.900705",
    "municipality": "Libertador"
  },
  {
    "id": 24,
    "code": "#0123000",
    "name": "MRW Las Mercedes",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Baruta)",
    "address": "AV. VERACRUZ. EDIF. MATISCO. P.B. DIAGONAL A CONATEL LAS MERCEDES GPS: 10.4798852,-66.855312",
    "lat": "10.479932",
    "lng": "-66.855128",
    "municipality": "Baruta"
  },
  {
    "id": 25,
    "code": "#0124000",
    "name": "MRW Santa Sofia",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Baruta)",
    "address": "AV. PRINCIPAL DE SANTA SOFIA, C.C. SANTA SOFIA, LOCAL Z-3. P.B. GPS: 10.47158,-66.84261",
    "lat": "10.473173",
    "lng": "-66.842889",
    "municipality": "Baruta"
  },
  {
    "id": 26,
    "code": "#0125000",
    "name": "MRW el Hatillo",
    "state": "Distrito Capital (Caracas)",
    "city": "El Hatillo",
    "address": "CALLE LA PAZ, CASA NRO. 16 DIAGONAL A BNC, EL HATILLO",
    "lat": "10.425041",
    "lng": "-66.826340",
    "municipality": "El Hatillo"
  },
  {
    "id": 27,
    "code": "#0126000",
    "name": "MRW el Cementerio",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "CALLE TERCERA TRANSVERSAL SAMANES Y LOS TOTUMOS CASA NRO 3 URB. EL CEMEN TERIO",
    "lat": "10.480938",
    "lng": "-66.913798",
    "municipality": "Libertador"
  },
  {
    "id": 28,
    "code": "#0128000",
    "name": "MRW Catia",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV. SUCRE CC. OESTE NIVEL 3 LOCAL 3 SECTOR CATIA, CARACAS, FRENTE A LA CLINICA POPULAR CATIA. GPS: 10.5149652,-66.9332887.",
    "lat": "10.514914",
    "lng": "-66.933398",
    "municipality": "Libertador"
  },
  {
    "id": 29,
    "code": "#0129000",
    "name": "MRW el Junquito",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "URBANIZACIÓN EL JUNKO, CARRETERA CARACAS EL JUNQUITO, KILÓMETRO 15, C.C EL JUNKO, NIVEL PLANTA BAJA, LOCAL 04-C, PARROQUIA EL JUNQUITO MUNICIPIO LIBERTADOR, CARACAS, VENEZUELA",
    "lat": "10.481220",
    "lng": "-67.030440",
    "municipality": "Libertador"
  },
  {
    "id": 30,
    "code": "#0130000",
    "name": "MRW Santa Monica",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV. ARTURO MICHELENA C/C AGUSIN CODAZZI, LOCAL 5-B MRW URB. SANTA MONICA GPS: 10.4776992,-66.8910918",
    "lat": "10.477697",
    "lng": "-66.890994",
    "municipality": "Libertador"
  },
  {
    "id": 31,
    "code": "#0131000",
    "name": "MRW el Bosque",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "CALLE EL EMPALME CON PRINCIPAL DEL BOSQUE QUINTA TORRE DE LA VEGA LOCAL 6 MRW",
    "lat": "10.496451",
    "lng": "-66.868833",
    "municipality": "Libertador"
  },
  {
    "id": 32,
    "code": "#0132000",
    "name": "MRW Caricuao",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "CENTRO COMERCIAL CARICUAO PLAZA NIVEL MEZANINA LOCAL 8. GPS: 10.434337,-67.0000542",
    "lat": "10.433559",
    "lng": "-67.001662",
    "municipality": "Libertador"
  },
  {
    "id": 33,
    "code": "#0133000",
    "name": "MRW la Florida",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV. LOS CHAGUARAMOS. QTA. COROLI. PB. LA FLORIDA. DIAGONAL A HIDROCAPITAL.. GPS. 10.5068807,-66.8732728",
    "lat": "10.506734",
    "lng": "-66.873174",
    "municipality": "Libertador"
  },
  {
    "id": 34,
    "code": "#0134000",
    "name": "MRW San Martin",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV SAN MARTIN, AV SANTANDER CRUCE CON AV. SAN MARTIN, C.C MARACAIBO NIVEL MEZZ LOCAL NRO 12.",
    "lat": "10.493289",
    "lng": "-66.935972",
    "municipality": "Libertador"
  },
  {
    "id": 35,
    "code": "#0135000",
    "name": "MRW Lecuna",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "CALLE SUR 3, DE ZAMURO A MISERIA, EDIF. INDUCENTRO LOCAL 1 PB, A 20 MTS DE LA AV. LECUNA. SANTA ROSALIA",
    "lat": "10.49977",
    "lng": "-66.912801",
    "municipality": "Libertador"
  },
  {
    "id": 36,
    "code": "#0137000",
    "name": "MRW Pantin",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Chacao)",
    "address": "CALLE PANTIN, GALPON MRW. AL FRENTE DE LA POLICIA DE CHACAO.URBANIZACIÓN ESTADO LEAL. CHACAO",
    "lat": "10.487052",
    "lng": "-66.856016",
    "municipality": "Chacao"
  },
  {
    "id": 37,
    "code": "#0138000",
    "name": "MRW Las Minas",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Baruta)",
    "address": "CARRETERA CARACAS- BARUTA, CENTRO COMERCIAL LAS DANIELAS, DIAGONAL AL AMBULATORIO DE LAS MINAS DE BARUTA O CENTRO ASTURIANO DE CCS, LOCAL 2-3, SECTOR LAS MINAS DE BARUTA.",
    "lat": "10.45236",
    "lng": "-66.86233",
    "municipality": "Baruta"
  },
  {
    "id": 38,
    "code": "#0140000",
    "name": "MRW la Candelaria",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "PUENTE YANEZ A PERICO EDF. SERRANO PB LOCAL 3 LA CANDELARIA. GPS: 10.5038406,-66.9082209.",
    "lat": "10.503276",
    "lng": "-66.908343",
    "municipality": "Libertador"
  },
  {
    "id": 39,
    "code": "#0141000",
    "name": "MRW Av. Casanova",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV. CASANOVA ENTRE CALLE SAN ANTONIO Y CALLE EL COLEGIO, C.C. DEL ESTE, N° 21. DIAGONAL AL HOTEL KURSSAL",
    "lat": "10.494363",
    "lng": "-66.87985",
    "municipality": "Libertador"
  },
  {
    "id": 40,
    "code": "#0142000",
    "name": "MRW el Valle",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV. INTERVECINAL EL VALLE. RESIDENCIAS DON PEDRO. TORRE B. LOCAL 1. P.B.",
    "lat": "10.467159",
    "lng": "-66.906825",
    "municipality": "Libertador"
  },
  {
    "id": 41,
    "code": "#0143000",
    "name": "MRW Andres Bello",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV ANDR+S BELLO COLEGIO NACIONAL DE PERIODISTA PB LOCAL B- 01 URBANIZACIÓN LOS CAOBOS CARACAS",
    "lat": "10.503851",
    "lng": "-66.88287",
    "municipality": "Libertador"
  },
  {
    "id": 42,
    "code": "#0144000",
    "name": "MRW Sebucan",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Sucre / Petare)",
    "address": "AV. ROMULO GALLEGOS, ENTRE AV. PRINCIPAL DE SEBUCAN Y AV. SUCRE DE LOS DOS CAMINOS",
    "lat": "10.496477",
    "lng": "-66.835328",
    "municipality": "Sucre"
  },
  {
    "id": 43,
    "code": "#0145000",
    "name": "MRW Capitolio",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV CONDE A PIÑANGO (AV OESTE 0), CASONA N° 11, ENTRE AV BARALT Y AV SUR 4, PARROQUIA ALTAGRACIA, AL LADO DE LA JEFATURA CATEDRAL.",
    "lat": "10.506963",
    "lng": "-66.916985",
    "municipality": "Libertador"
  },
  {
    "id": 44,
    "code": "#0146000",
    "name": "MRW Antimano/ la Yaguara",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "CALLE REAL BOULEVARD DE ANTIMANO ENTRE LA JEFATURA Y LA PLAZA BOLIVAR ANTIMANO LOCAL MRW",
    "lat": "10.460587",
    "lng": "-66.986601",
    "municipality": "Libertador"
  },
  {
    "id": 45,
    "code": "#0147000",
    "name": "MRW la Castellana",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Chacao)",
    "address": "CALLE URDANETA, QUINTA AURANA, P.B. A MEDIA CUADRA DEL RESTAURANT LA ESTANCIA. LA CASTELLANA.",
    "lat": "10.49638",
    "lng": "-66.85231",
    "municipality": "Chacao"
  },
  {
    "id": 46,
    "code": "#0148000",
    "name": "MRW Chacaito",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Chacao)",
    "address": "CENTRO COMERCIAL UNICO PB LOCAL 5 URB EL ROSAL AV PICHINCHA ENTRE LA SALIDA DEL METRO Y AV TAMANACO",
    "lat": "10.490327",
    "lng": "-66.868209",
    "municipality": "Chacao"
  },
  {
    "id": 47,
    "code": "#0150000",
    "name": "MRW Los Palos Grandes",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Chacao)",
    "address": "AV. ANDES BELLO CON 2¬ TRANSVERSAL, EDIFICIO VISTA HERMOSA, LOCAL C, URBANIZACIÓN LOS PALOS GRANDES.",
    "lat": "10.499201",
    "lng": "-66.845512",
    "municipality": "Chacao"
  },
  {
    "id": 49,
    "code": "#0200000",
    "name": "MRW Puerto Ayacucho",
    "state": "Amazonas",
    "city": "Puerto Ayacucho",
    "address": "CALLE PRINCIPAL LOCAL S/N BARRIO UNION, ZONA CENTROPUERTO AYACUCHO AMAZONAS ZONA POSTAL.",
    "lat": "5.66406",
    "lng": "-67.62353",
    "municipality": "Atures"
  },
  {
    "id": 50,
    "code": "#0300000",
    "name": "MRW Barcelona",
    "state": "Anzoátegui",
    "city": "Barcelona",
    "address": "AV. FUERZAS ARMADAS. ESQUINA CALLE EULALIA BUROZ, EDIF AZGAN PISO PB LOCAL 02 SECTOR CENTRO, BARCELONA. GPS: 10.1373363,-64.6829436",
    "lat": "10.137268",
    "lng": "-64.68306",
    "municipality": "Simón Bolívar"
  },
  {
    "id": 51,
    "code": "#0301000",
    "name": "MRW Anaco",
    "state": "Anzoátegui",
    "city": "Anaco",
    "address": "AV. JOSé ANTONIO ANZOáTEGUI, CRUCE CON AV. LOS PILONES LOCAL NO. 02 ANACO, EDO. ANZOáTEGUI.",
    "lat": "9.433646",
    "lng": "-64.46495",
    "municipality": "Anaco"
  },
  {
    "id": 52,
    "code": "#0302000",
    "name": "MRW el Tigre",
    "state": "Anzoátegui",
    "city": "El Tigre",
    "address": "AV. FCO. DE MIRANDA CON CALLE 18 SUR. EDIF. LOS GERANIOS # 2 Y 3 FRENTE A LA PANADERIA SIRIA. GPS: 8.8943036,-64.2369862",
    "lat": "8.89412",
    "lng": "-64.236924",
    "municipality": "Simón Rodríguez"
  },
  {
    "id": 53,
    "code": "#0303000",
    "name": "MRW Las Garzas",
    "state": "Anzoátegui",
    "city": "Lechería",
    "address": "AV JORGE RODRIGUEZ, LOCAL MRW 1, SECTOR LAS GARZAS LECHERIA, ANZOATEGUI. GPS: 10.1815638,-64.6686459",
    "lat": "10.17929589",
    "lng": "-64.6724532",
    "municipality": "Diego Bautista Urbaneja"
  },
  {
    "id": 54,
    "code": "#0304000",
    "name": "MRW Puerto la Cruz Centro",
    "state": "Anzoátegui",
    "city": "Puerto La Cruz",
    "address": "AV. MUNICIPAL, CON CALLE BOLIVAR DE PUEBLO NUEVO, C.C. MADEIRENSE, PB, LOCAL 24 , MUNICIPIO JUAN ANTONIO SOTILLO, PUERTO LA CRUZ, ESTADO ANZOÁTEGUI",
    "lat": "10.202174216778461",
    "lng": "-64.63346830452558",
    "municipality": "Juan Antonio Sotillo"
  },
  {
    "id": 55,
    "code": "#0308000",
    "name": "MRW Pariaguan",
    "state": "Anzoátegui",
    "city": "Pariaguán",
    "address": "CALLE BOLÍVAR CRUCE CON COLOMBIA, SECTOR CENTRO FRENTE COOPERATIVA DE TRANSPORTE PARIAGUAN EXPRESS A POCOS MTS DE FARMACIA CONTINENTAL.8.84156581686022, -64.72001416185448",
    "lat": "8.84332",
    "lng": "-64.716693",
    "municipality": "Francisco de Miranda"
  },
  {
    "id": 56,
    "code": "#0309000",
    "name": "MRW Puerto la Cruz",
    "state": "Anzoátegui",
    "city": "Puerto La Cruz",
    "address": "CALLE MIRANDA, CRUCE CON CALLE BOLIVAR, EDIF. HOTEL SENADOR, PISO PB, ZONA CENTRO, PUERTO LA CRUZ",
    "lat": "10.22",
    "lng": "-64.63",
    "municipality": "Juan Antonio Sotillo"
  },
  {
    "id": 57,
    "code": "#0310000",
    "name": "MRW Nueva Barcelona",
    "state": "Anzoátegui",
    "city": "Barcelona",
    "address": "CALLE URDANETA CON CARRERA 24, C.C. GOLD COUNTRY, LOCAL P.B. 07, SECTOR NUEVA BARCELONA, ESTADO ANZOáTEGUI",
    "lat": "10.143543808352968",
    "lng": "-64.68673025638738",
    "municipality": "Simón Bolívar"
  },
  {
    "id": 58,
    "code": "#0311000",
    "name": "MRW Clarines",
    "state": "Anzoátegui",
    "city": "Clarines",
    "address": "AV. FERNANDEZ PADILLA, MINI C.C. LOS COCOS. C.C. \"MTC\". LOCAL 5 P.B. CLARINES 9.943983711041437, -65.16311529674937 ...",
    "lat": "9.943772",
    "lng": "-65.163958",
    "municipality": "Manuel Ezequiel Bruzual"
  },
  {
    "id": 59,
    "code": "#0312000",
    "name": "MRW Lecheria",
    "state": "Anzoátegui",
    "city": "Lechería",
    "address": "AV. PRINCIPAL DE LECHERÍA, MINI CENTRO PRINCIPAL, LOCAL 02, AL LADO DE PANADERÍA LA PRINCIPAL. LECHERÍA. ESTADO ANZOÁTEGUI. GPS: 10.1828176,-64.6893312",
    "lat": "10.182808",
    "lng": "-64.689339",
    "municipality": "Diego Bautista Urbaneja"
  },
  {
    "id": 60,
    "code": "#0313000",
    "name": "MRW el Tigre Centro",
    "state": "Anzoátegui",
    "city": "El Tigre",
    "address": "CARRERA 2 SUR, ENTRE CALLES 2 Y 3, EDIFICIO HANA, PISO 1,. LOCAL Nº 1, SECTOR PUEBLO NUEVO SUR. EL TIGRE-ESTADO ANZOATEGUI. GPS:8.8869825,-64.2571774",
    "lat": "8.886999",
    "lng": "-64.257783",
    "municipality": "Simón Rodríguez"
  },
  {
    "id": 61,
    "code": "#0401000",
    "name": "MRW Guasdualito",
    "state": "Apure",
    "city": "Guasdualito",
    "address": "CALLE SUCRE ENTRE CARRERA MARIÑO Y SIMÓN RODRÍGUEZ, A CUADRA Y MEDIA DE LA SANTÍSIMA TRINIDAD, GUASDUALITO ESTADO APURE. 7.244789042820635, -70.72687547535314",
    "lat": "7.244789",
    "lng": "-70.726875",
    "municipality": "Páez"
  },
  {
    "id": 62,
    "code": "#0402000",
    "name": "MRW San Fernando Centro",
    "state": "Apure",
    "city": "San Fernando de Apure",
    "address": "AV CARACAS A 50 MTRS DEL PASEO LIBERTADOR, CENTRO EMPRESARIAL GENESIS, PB LOCAL 1, SECTOR CENTRO SAN FERNANDO DE APURE. GPS: 7.8834063,-67.4716484",
    "lat": "7.882042",
    "lng": "-67.470711",
    "municipality": "San Fernando"
  },
  {
    "id": 63,
    "code": "#0501000",
    "name": "MRW Maracay Zona Ind.",
    "state": "Aragua",
    "city": "Maracay",
    "address": "AV BERMUDEZ CC MARACAY PLAZA NIVEL PB LOCAL PB-82F URB CENTRO MARACAY ARAGUA 10.23335936240899, -67.59657221951802.",
    "lat": "10.233359",
    "lng": "-67.596572",
    "municipality": "Girardot"
  },
  {
    "id": 64,
    "code": "#0503000",
    "name": "MRW la Victoria",
    "state": "Aragua",
    "city": "Maracay",
    "address": "URBANIZACIÓN BOLIVAR SUR, AV. VICTORIA # 44-2, LOCAL A-2, LA VICTORIA, ARAGUA. GPS: 10.2265456,-67.3315944",
    "lat": "10.226545",
    "lng": "-67.331594",
    "municipality": "Girardot"
  },
  {
    "id": 65,
    "code": "#0504000",
    "name": "MRW Maracay 5 de Julio",
    "state": "Aragua",
    "city": "Maracay",
    "address": "CALLE 5 DE JULIO, ENTRE PAEZ Y MIRANDA. EDIF SANTIMONE. P.B.B LOCAL 3, ZONA CENTRO, DIAGONAL A IMGEVE, MARACAY ESTADO ARAGUA. GPS: 10.2497141,-67.5991998",
    "lat": "10.249356",
    "lng": "-67.599302",
    "municipality": "Girardot"
  },
  {
    "id": 66,
    "code": "#0506000",
    "name": "MRW Turmero",
    "state": "Aragua",
    "city": "Maracay",
    "address": "CALLE MARIÑO C/C CALLE PEÑALVER C.C MARIÑO PLAZA P.B LOCAL 02, TURMERO EDO. ARAGUA. GPS: 10.2290922,-67.4778999",
    "lat": "10.229092",
    "lng": "-67.477899",
    "municipality": "Girardot"
  },
  {
    "id": 67,
    "code": "#0507000",
    "name": "MRW Villa de Cura",
    "state": "Aragua",
    "city": "Villa de Cura",
    "address": "CALLE BOLIVAR Y VILLEGAS LOCAL NRO 54/A SECTOR CENTRO VILLA DE CURA, ESTADO ARAGUA 10.033978725869476, -67.48539854649998",
    "lat": "10.033978",
    "lng": "-67.485398",
    "municipality": "Zamora"
  },
  {
    "id": 69,
    "code": "#0509000",
    "name": "MRW S.sebastian d Los Reyes",
    "state": "Aragua",
    "city": "San Sebastián de los Reyes",
    "address": "CALLE LA PISTA, LOCAL NRO 03, SECTOR EL POLVERO, SAN SEBASTIAN DE LOS REYES ARAGUA. GPS: 9.9460006,-67.1795018",
    "lat": "9.946000",
    "lng": "-67.179501",
    "municipality": "San Sebastián"
  },
  {
    "id": 70,
    "code": "#0510000",
    "name": "MRW Maracay la Democracia",
    "state": "Aragua",
    "city": "Maracay",
    "address": "AV AYACUCHO NORTE NRO 83, BARRIO LA DEMOCRACIA, MARACAY EDO ARAGUA. GPS: 10.2576291,-67.6096241",
    "lat": "10.257628",
    "lng": "-67.609777",
    "municipality": "Girardot"
  },
  {
    "id": 71,
    "code": "#0511000",
    "name": "MRW Turmero Zona Industrial",
    "state": "Aragua",
    "city": "Turmero",
    "address": "AV. INTERCOMUNAL MARACAY-TURMERO, CENTRO COMERCIAL INTERCOMUNAL CENTER, LOCAL NRO. PB 6, SECTOR LA MORITA, TURMERO, ESTADO ARAGUA. 10.231931328877549, -67.54792062508638",
    "lat": "10.231931",
    "lng": "-67.547920",
    "municipality": "Santiago Mariño"
  },
  {
    "id": 72,
    "code": "#0512000",
    "name": "MRW la Encrucijada",
    "state": "Aragua",
    "city": "Turmero",
    "address": "AV. PRINCIPAL, C.C. LOS LAURELES, NIVEL P.B, LOCAL 12, SECTOR LA ENCRUCIJADA DE TURMERO. ESTADO ARAGUA. GPS: 10.2025453,-67.4714206",
    "lat": "10.202434",
    "lng": "-67.471634",
    "municipality": "Santiago Mariño"
  },
  {
    "id": 73,
    "code": "#0513000",
    "name": "MRW Maracay Base Aragua",
    "state": "Aragua",
    "city": "Maracay",
    "address": "AV. LAS DELICIAS C.C. HOTEL PASEO LAS DELICIAS II NIVEL PB LOCAL 12 URB BASE ARAGUA MARACAY. GPS: 10.2557458,-67.5919065",
    "lat": "10.255998",
    "lng": "-67.591659",
    "municipality": "Girardot"
  },
  {
    "id": 74,
    "code": "#0516000",
    "name": "MRW Maracay Santa Rosa",
    "state": "Aragua",
    "city": "Maracay",
    "address": "CALLE CARABOBO, Nº 75-A, SECTOR SANTA ROSA. MARACAY, ESTADO ARAGUA. GPS: 10.2466199,-67.6097298",
    "lat": "10.24413",
    "lng": "-67.61696",
    "municipality": "Girardot"
  },
  {
    "id": 75,
    "code": "#0517000",
    "name": "MRW Maracay la Romana",
    "state": "Aragua",
    "city": "Maracay",
    "address": "CENTRO COMERCIAL TIUNA, AV. BOLÍVAR OESTE NRO. 198, SECTOR LA ROMANA, MUNICIPIO GIRARDOT, ESTADO ARAGUA. GPS: 10.2543384,-67.6136697",
    "lat": "10.254263",
    "lng": "-67.613806",
    "municipality": "Girardot"
  },
  {
    "id": 76,
    "code": "#0600000",
    "name": "MRW Barinas",
    "state": "Barinas",
    "city": "Barinas",
    "address": "CALLE CEDEÑO, C.C. GIAMMA, LOCAL 6. DIAGONAL AL HOSPITAL LUIS RAZZETTI",
    "lat": "8.621125",
    "lng": "-70.202049",
    "municipality": "Barinas"
  },
  {
    "id": 77,
    "code": "#0601000",
    "name": "MRW Socopo",
    "state": "Barinas",
    "city": "Socopó",
    "address": "CALLE 1 ENTRE CARRERAS 6 Y 7, BARRIO EL CARMEN, DIAGONAL AL COMERCIAL LA ESTRELLA ORIENTAL DE LOS CHINOS",
    "lat": "8.236666",
    "lng": "-70.818169",
    "municipality": "Antonio José de Sucre"
  },
  {
    "id": 78,
    "code": "#0602000",
    "name": "MRW Barinas Zona Ind.",
    "state": "Barinas",
    "city": "Barinas",
    "address": "AV ELIAS CORDERO EDIFICIO REY DE REYES PASOS DETR-S DEL TERMINAL DE PASAJEROS DIAGONAL A LA FERRETERIA MECATASO",
    "lat": "8.631257",
    "lng": "-70.224886",
    "municipality": "Barinas"
  },
  {
    "id": 79,
    "code": "#0603000",
    "name": "MRW Sta Barbara de Barinas",
    "state": "Barinas",
    "city": "Santa Bárbara de Barinas",
    "address": "CALLE 12 ENTRE CARRERAS 0 Y 00 ( PUNTO DE REFERENCIA 2 CUADRAS Y MEDIA DE CORPOELEC",
    "lat": "7.818387",
    "lng": "-71.179698",
    "municipality": "Ezequiel Zamora"
  },
  {
    "id": 80,
    "code": "#0604000",
    "name": "MRW Barinas Sabaneta",
    "state": "Barinas",
    "city": "Sabaneta",
    "address": "CALLE 1 ENTRE AV. OBISPOS Y AV. ANTONIO MARIA BAYON, SECTOR 9 DE DICIEMBRE. C.C. TRICOLOR, P.B. LOCAL 2.",
    "lat": "8.752412",
    "lng": "-69.936872",
    "municipality": "Alberto Arvelo Torrealba"
  },
  {
    "id": 81,
    "code": "#0605000",
    "name": "MRW Alto Barinas",
    "state": "Barinas",
    "city": "Barinas",
    "address": "URB ALTO BARINAS NORTE, AV FRANCIA CON AV PIE DE MONTE Y TACHIRA, LOCAL 135, BARINAS.",
    "lat": "8.618111",
    "lng": "-70.253139",
    "municipality": "Barinas"
  },
  {
    "id": 82,
    "code": "#0605100",
    "name": "MRW Forum",
    "state": "Barinas",
    "city": "Barinas",
    "address": "AV 23 DE ENERO CON AV GUAIPURO, CENTRO COMERCIAL FORUM, PB, LOCAL N°52. BARINAS.",
    "lat": "8.620782",
    "lng": "-70.231907",
    "municipality": "Barinas"
  },
  {
    "id": 83,
    "code": "#0606000",
    "name": "MRW Barinas 23 de Enero",
    "state": "Barinas",
    "city": "Barinas",
    "address": "AVENIDA 23 DE ENERO, EDIFICIO LA FONTANA, LOCAL N° 3. A 50 METROS DEL REGISTRO INMOBILIARIO.",
    "lat": "8.622771",
    "lng": "-70.227173",
    "municipality": "Barinas"
  },
  {
    "id": 84,
    "code": "#0700000",
    "name": "MRW Ciudad Bolivar",
    "state": "Bolívar",
    "city": "Ciudad Bolívar",
    "address": "AVENIDA REPUBLICA. EDIF. FRANCO, PB LOCALES 1 Y 2, AL LADO DE BANESCO. CIUDAD BOLIVAR. GPS: 8.1243327,-63.548044",
    "lat": "8.124342",
    "lng": "-63.548001",
    "municipality": "Angostura del Orinoco"
  },
  {
    "id": 85,
    "code": "#0701000",
    "name": "MRW Alta Vista",
    "state": "Bolívar",
    "city": "Puerto Ordaz",
    "address": "C.C. ZULIA, EN LA ENTRADA FRENTE AL SUPERMERCADO RÍO, LOCAL 3 Y 4, ALTA VISTA - PUERTO ORDAZ",
    "lat": "8.29",
    "lng": "-62.731",
    "municipality": "Caroní"
  },
  {
    "id": 86,
    "code": "#0704000",
    "name": "MRW Santa Elena de Uairen",
    "state": "Bolívar",
    "city": "Santa Elena de Uairén",
    "address": "CALLE IKABARÚ, TRONCAL 10. CASCO CENTRAL, LOCAL S/N, A 100 MTRS. DEL HOSPITAL ROSARIO VERA ZURITA, SANTA ELENA DE UAIREN, EDO. BOLIVAR. CÓDIGO POSTAL 8011. GPS: 4.5988806,-61.1098221,17",
    "lat": "4.603938",
    "lng": "-61.110664",
    "municipality": "Gran Sabana"
  },
  {
    "id": 88,
    "code": "#0708000",
    "name": "MRW Cdad Bolivar Zona Ind.",
    "state": "Bolívar",
    "city": "Ciudad Bolívar",
    "address": "AV. NUEVA GRANADA. EDIF. GRAN SABANA. P.B., LOCAL 1 CIUDAD BOLIVAR. EDO. BOLIVA. GPS: 8.1121051,-63.5426025",
    "lat": "8.112018",
    "lng": "-63.542608",
    "municipality": "Angostura del Orinoco"
  },
  {
    "id": 89,
    "code": "#0709000",
    "name": "MRW Av Las Americas",
    "state": "Bolívar",
    "city": "Puerto Ordaz",
    "address": "AV. BRASIL, URB. VILLA BRASIL, MANZANA 142, LOCAL N°2, A 200MTS DEL ABASTO LA ESPAÑOLA, SECTOR VILLA ANTILLANA, PUERTO ORDAZ. GPS 8.312743079567095, -62.73015092522482",
    "lat": "8.312743079567095",
    "lng": "-62.73015092522482",
    "municipality": "Caroní"
  },
  {
    "id": 90,
    "code": "#0711000",
    "name": "MRW Plaza Atlántico",
    "state": "Bolívar",
    "city": "Puerto Ordaz",
    "address": "AV. ATLANTICO, C.C PLAZA ATLANTICO, NIVEL ATLANTICO, LOCAL PB-12, URB. LOMAS DEL CARONI, CIUDAD GUAYANA, ESTADO BOLÍVAR.",
    "lat": "8.2627864",
    "lng": "-62.771869",
    "municipality": "Caroní"
  },
  {
    "id": 91,
    "code": "#0800000",
    "name": "MRW Valencia Centro",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "AV. MIRANDA LOCAL 118-31 MRW DIAGONAL A DAMASCO, AV. ROJAS QUEIPO, SECTOR SAN JOSE VALENCIA-CARABOBO. GPS: 10.197811126708984,-68.00529479980469",
    "lat": "10.197774",
    "lng": "-68.005435",
    "municipality": "Valencia"
  },
  {
    "id": 92,
    "code": "#0801000",
    "name": "MRW Valencia Big Low",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "CALLE 97, C.C. CIUDAD VALENCIA, PB, LOCAL B4. URB. ZONA INDUSTRIAL CASTILLITO. VALENCIA, ESTADO CARABOBO. GPS: 10.1855496,-67.9630739",
    "lat": "10.194944",
    "lng": "-67.966712",
    "municipality": "Valencia"
  },
  {
    "id": 93,
    "code": "#0802000",
    "name": "MRW Guacara",
    "state": "Carabobo",
    "city": "Guacara",
    "address": "CALLE PIAR, CRUCE CON JACINTO LARA, C.C SAN PEDRO, NIVEL PB, LOCAL 8, GUACARA, ESTADO CARABOBO",
    "lat": "10.23",
    "lng": "-67.87",
    "municipality": "Guacara"
  },
  {
    "id": 94,
    "code": "#0802100",
    "name": "MRW Alianza Mall",
    "state": "Carabobo",
    "city": "Guacara",
    "address": "CARRETERA NACIONAL GUACARA, URB CIUDAD ALIANZA, C.C. CENTRAL GUACARA, LOCAL 27, FRENTE AL SUPERMERCADO CENTRAL MADEIRENSE. VALENCIA. 10.214366295492411, -67.89425738511322 .",
    "lat": "10.214366",
    "lng": "-67.894257",
    "municipality": "Guacara"
  },
  {
    "id": 95,
    "code": "#0802500",
    "name": "MRW Los Guayos Zona Ind.",
    "state": "Carabobo",
    "city": "Los Guayos",
    "address": "LOS GUAYOS CALLE NEGRO PRIMERO CC LAS DELICIAS LOCAL. VALENCIA -EDO CARABOBO 10.184388886833883, -67.96016545998904",
    "lat": "10.184388",
    "lng": "-67.960165",
    "municipality": "Los Guayos"
  },
  {
    "id": 96,
    "code": "#0803000",
    "name": "MRW Puerto Cabello",
    "state": "Carabobo",
    "city": "Puerto Cabello",
    "address": "CALLE RONDON EDIFICIO EL NARANJAL LOCAL N° 2 FRENTE AL TEMPLO EL REFUGIO, AL LADO DE LA CLINICA SAN AGUSTIN. PUERTO CABELLO EDO. CARABOBO GPS 10.467739247357235, -68.00847609018656",
    "lat": "10.466321",
    "lng": "-68.01004",
    "municipality": "Puerto Cabello"
  },
  {
    "id": 97,
    "code": "#0803500",
    "name": "MRW Moron",
    "state": "Carabobo",
    "city": "Morón",
    "address": "AVDA. YARACUY - Nª 52, FRENTE AL BANCO BANESCO, AL LADO DEL BANCO BOD. MORON ESTADO CARABOBO. GPS: 10,3365,-68,7902",
    "lat": "10.489728",
    "lng": "-68.200872",
    "municipality": "Juan José Mora"
  },
  {
    "id": 98,
    "code": "#0804000",
    "name": "MRW Flor Amarillo",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "AV. LAS INDUSTRIAS, CRUCE CON AV. PRINCIPAL, URB. PARQUE VALENCIA, C.C. MEGA MERCADO, PB , LOCAL 8C1.VALENCIA EDO CARABOBO. GPS: 10.1549212,-67.9575439",
    "lat": "10.154921",
    "lng": "-67.957543",
    "municipality": "Valencia"
  },
  {
    "id": 99,
    "code": "#0805000",
    "name": "MRW Valencia el Trigal",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "AV. PRINCIPAL DE MAÑONGO, C.C. PATIO TRIGAL. NIVEL PB LOCAL 208 A URB TRIGAL NORTE, VALENCIA CARABOBO ZONA POSTAL 2001. GPS: 10.2262077,-67.9973322",
    "lat": "10.226637",
    "lng": "-67.996996",
    "municipality": "Valencia"
  },
  {
    "id": 100,
    "code": "#0806000",
    "name": "MRW Naguanagua",
    "state": "Carabobo",
    "city": "Naguanagua",
    "address": "AV. 96-B, C.C. CRSTAL, PB. LOCAL B-06 A DOS LOCALES DEL BANCO BICENTENARIO, POR LA ENTRADA PRINCIPAL. NAGUANAGUA, EDO. CARABOBO 10.242749899854418, -68.00661230788387",
    "lat": "10.242749",
    "lng": "-68.006612",
    "municipality": "Naguanagua"
  },
  {
    "id": 101,
    "code": "#0807000",
    "name": "MRW Mariara",
    "state": "Carabobo",
    "city": "Mariara",
    "address": "AVENIDA BOLíVAR, SECTOR GUAMACHO NúMERO 51, MARIARA ESTADO CARABOBO",
    "lat": "10.293550678791272",
    "lng": "-67.72110691986492",
    "municipality": "Diego Ibarra"
  },
  {
    "id": 103,
    "code": "#0808000",
    "name": "MRW Valencia Sur",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "AUTOPISTA VALENCIA - CAMPO CARABOBO. CENTRO COMERCIAL EL PRADO, PLANTA BAJA LOCAL B 6. LOS CAOBOS, VALENCIA-EDO.CARABOBO. GPS:10.1590111,-68.024857",
    "lat": "10.159099",
    "lng": "-68.024767",
    "municipality": "Valencia"
  },
  {
    "id": 104,
    "code": "#0809000",
    "name": "MRW Bejuma",
    "state": "Carabobo",
    "city": "Bejuma",
    "address": "CALLE URDANETA, C.C. ENMANUEL, PISO PB, LOCAL 5, BEJUMA, ESTADO CARABOBO",
    "lat": "10.173021164010686",
    "lng": "-68.26057381349202",
    "municipality": "Bejuma"
  },
  {
    "id": 105,
    "code": "#0810000",
    "name": "MRW Valencia Palacio de Justicia",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "AV. ARANZAZU, EDIFICIO VORMA, PISO P.B., LOCAL PB-3, LA CANDELARIA. VALENCIA EDO. CARABOBO. GPS: 10.1735768,-68.0113902",
    "lat": "10.174248",
    "lng": "-68.011492",
    "municipality": "Valencia"
  },
  {
    "id": 106,
    "code": "#0810100",
    "name": "MRW Av. Las Ferias",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "AV. LAS FERIAS, ENTRE CALLES SILVA Y RANGEL, CC ISORA, LOCAL NA-21. VALENCIA ESTADO CARABOBO.VALENCIA, ESTADO CARABOBO.GPS 10.179644277519218, -68.00105393259143",
    "lat": "10.1761",
    "lng": "-68.002843",
    "municipality": "Valencia"
  },
  {
    "id": 107,
    "code": "#0811000",
    "name": "MRW Valencia Zona Ind.",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "AV.PROLONGACION MICHELENA C.C. MYCRA LOCAL 10 ZONA INDUSTRIAL VALENCIA. GPS. 10.1744565,-67.9743876",
    "lat": "10.174423",
    "lng": "-67.974932",
    "municipality": "Valencia"
  },
  {
    "id": 108,
    "code": "#0812000",
    "name": "MRW la Isabelica",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "AV. 04 SECTOR 10, VEREDA 14, LOCAL 01, URB. LA ISABELICA. VALENCIA - CARABOBO. GPS: 10.1609746,-67.9705846",
    "lat": "10.160974",
    "lng": "-67.970584",
    "municipality": "Valencia"
  },
  {
    "id": 110,
    "code": "#0814000",
    "name": "MRW Valencia el Parral",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "LAS 4 AVENIDAS, C.C. PROFESIONAL CERAVICA PB, LOCAL 2, URB. EL PARRAL - EDO. CARABOBO. GPS: 10.206328648925,-68.027472897835,17",
    "lat": "10.206328",
    "lng": "-68.027472",
    "municipality": "Valencia"
  },
  {
    "id": 111,
    "code": "#0815000",
    "name": "MRW Valencia San Diego",
    "state": "Carabobo",
    "city": "San Diego",
    "address": "AV. DON JULIO CENTENO C.C. METRO PLAZA P.B LOCAL 33 SAN DIEGO EDO. CARABOBO. GPS: 10.207965724456,-67.96278714390199,17",
    "lat": "10.207803",
    "lng": "-67.962601",
    "municipality": "San Diego"
  },
  {
    "id": 112,
    "code": "#0815100",
    "name": "MRW la Esmeralda San Diego",
    "state": "Carabobo",
    "city": "San Diego",
    "address": "AV. INTERCOMUNAL DON JULIO CENTENO C.C LA ESMERALDA LOCAL 13. 10.231411363382831, -67.96611163115217",
    "lat": "10.221",
    "lng": "-67.964072",
    "municipality": "San Diego"
  },
  {
    "id": 113,
    "code": "#0816000",
    "name": "MRW Valencia Norte",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "AV. BOLIVAR NORTE, SECTOR MAJAY, LOCAL Nº 151-54, , FRENTE A LA TORRE PRINCIAPAL (BANCO BNC). VALENCIA, EDO. CARABOBO. GPS: 10.2208278,-68.0094254",
    "lat": "10.220879",
    "lng": "-68.009288",
    "municipality": "Valencia"
  },
  {
    "id": 114,
    "code": "#0818000",
    "name": "MRW San Diego Boulevard Castillito",
    "state": "Carabobo",
    "city": "San Diego",
    "address": "CENTRO COMERCIAL BOULEVARD CENTER, LOCAL L-03 FRENTE A POLLOS ARTUROS, DIAGONAL A TERMINAL DE PASAJEROS BIG LOW CENTER, SAN DIEGO-EDO. CARABOBO.",
    "lat": "10.1947950",
    "lng": "-67.9671172",
    "municipality": "San Diego"
  },
  {
    "id": 115,
    "code": "#0820000",
    "name": "MRW Valencia Gobernación",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "CALLE PAEZ ENTRE MONTES DE OCA Y CARABOBO C.C. PAPIN PB LOCAL NRO 1, CENTRO DE VALENCIA ( CERCA DEL CAPITOLIO). EDO CARABOBO. 10.1809602,-68.0084552,17",
    "lat": "10.180960",
    "lng": "-68.008455",
    "municipality": "Valencia"
  },
  {
    "id": 116,
    "code": "#0823000",
    "name": "MRW Valencia Av. Lara",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "AV. LARA CON CALLE USLAR, LOCAL 87-107. FRENTE A MOLINARI CACCIA GUERRA, VALENCIA CARABOBO. 10.1794327,-67.994418,17",
    "lat": "10.179958",
    "lng": "-67.990962",
    "municipality": "Valencia"
  },
  {
    "id": 117,
    "code": "#0826000",
    "name": "MRW Paraparal",
    "state": "Carabobo",
    "city": "Los Guayos",
    "address": "CENTRO COMERCIAL GALERíAS PARAPARAL, LOCAL B-22 . AV. PRINCIPAL DE PARAPARAL, ESTADO CARABOBO.",
    "lat": "10.19870446032424",
    "lng": "-67.92052927997442",
    "municipality": "Los Guayos"
  },
  {
    "id": 118,
    "code": "#0900000",
    "name": "MRW San Carlos",
    "state": "Cojedes",
    "city": "San Carlos",
    "address": "AV. RICAURTE, ENTRE AV. SUCRE Y BOLIVAR, SAN CARLOS, ESTADO COJEDES",
    "lat": "9.663652",
    "lng": "-68.586513",
    "municipality": "Ezequiel Zamora"
  },
  {
    "id": 119,
    "code": "#0901000",
    "name": "MRW Tinaquillo",
    "state": "Cojedes",
    "city": "Tinaquillo",
    "address": "AV. MADARIAGA, ENTRE CALLE CEDEÑO Y CALLE NEGRO PRIMERO, TINAQUILLO - ESTADO COJEDES 9.917399229094885, -68.30170553115445",
    "lat": "9.917131",
    "lng": "-68.303607",
    "municipality": "Tinaquillo"
  },
  {
    "id": 120,
    "code": "#1000000",
    "name": "MRW Tucupita",
    "state": "Delta Amacuro",
    "city": "Tucupita",
    "address": "CALLE DALLA COSTA # 22, LOCAL 1, EDF. CIARCIA FRENTE A LA PLAZA BOLIVAR, PQ. SAN JOSE, MNCP: TUCUPITA, CD: TUCUPITA EDO: DELTA AMACURO. GPS: 9.0572867,-62.050785",
    "lat": "9.057097",
    "lng": "-62.050932",
    "municipality": "Tucupita"
  },
  {
    "id": 121,
    "code": "#1100000",
    "name": "MRW Coro",
    "state": "Falcón",
    "city": "Santa Ana de Coro",
    "address": "CALLE ZAMORA. ESQUINA CALLEJON LAS FLORES E ITURBE LOCAL S/N SECTOR CHIMPIRE CORO MCIPIO MIRANDA EDO FALCON SANTA ANA DE CORO. GPS: 11.4108253,-69.6709781",
    "lat": "11.410683",
    "lng": "-69.670994",
    "municipality": "Miranda"
  },
  {
    "id": 122,
    "code": "#1102000",
    "name": "MRW Tucacas",
    "state": "Falcón",
    "city": "Tucacas",
    "address": "AV LIBERTADOR DE TUCACAS, DIAGONAL AL HOTEL LA SUERTE , LOCAL NRO #1. EDO. FALCON. GPS 2054. 10.7927387,-68.3213246,17",
    "lat": "10.792738",
    "lng": "-68.321324",
    "municipality": "José Laurencio Silva"
  },
  {
    "id": 123,
    "code": "#1103000",
    "name": "MRW Caja de Agua",
    "state": "Falcón",
    "city": "Punto Fijo",
    "address": "CALLE MANUELITA SÁENZ ENTRE CALLE COMERCIO Y PROVIDENCIA SECTOR, SECTOR CAJA DE AGUA, DIAGONAL A LA IGLESIA LOS MORMONES, LOCAL NRO. 01, EDO. FALCÓN. GPS 11.7124573,-70.1915814",
    "lat": "11.712457",
    "lng": "-70.191581",
    "municipality": "Carirubana"
  },
  {
    "id": 124,
    "code": "#1104000",
    "name": "MRW Puerta Maraven",
    "state": "Falcón",
    "city": "Punto Fijo",
    "address": "CALLE SAN ROMÁN ENTRE AV GENERAL PELAYO Y AV. OLLARVIDES, DIAGONAL A RÍAS ALTAS. 10.792441,-68.3196871",
    "lat": "11.658290956091525",
    "lng": "-70.19685672010422",
    "municipality": "Carirubana"
  },
  {
    "id": 125,
    "code": "#1105000",
    "name": "MRW el Castillo",
    "state": "Falcón",
    "city": "Santa Ana de Coro",
    "address": "AVENIDA MANAURE, ESQUINA CON CALLE MONZON . C.C. EL CASTILLO DON LEONCIO, PB, LOCAL Nº 10. CORO. GPS: 11.402398864692,-69.6721584",
    "lat": "11.402722",
    "lng": "-69.672359",
    "municipality": "Miranda"
  },
  {
    "id": 126,
    "code": "#1106000",
    "name": "MRW Punto Fijo Av.monagas",
    "state": "Falcón",
    "city": "Punto Fijo",
    "address": "CALLE MONAGAS ENTRE GARCES Y ZAMORA EDIF. LUCRISCAR PLANTA BAJA, PUNTO FIJO-EDO.FALCON. GPS: 11.6910626,-70.2002248",
    "lat": "11.6912",
    "lng": "-70.200283",
    "municipality": "Carirubana"
  },
  {
    "id": 127,
    "code": "#1200000",
    "name": "MRW S. Juan de Los Morros",
    "state": "Guárico",
    "city": "San Juan de los Morros",
    "address": "CALLE EL CARMEN, EDF. RAUSEO, LOCAL 2 BAJANDO POR LA GOBERNACIÓN, DIAGONAL A LA CANTV. GPS: 9.9151168,-67.3552737",
    "lat": "9.915116",
    "lng": "-67.355273",
    "municipality": "Juan Germán Roscio"
  },
  {
    "id": 128,
    "code": "#1201000",
    "name": "MRW Calabozo",
    "state": "Guárico",
    "city": "Calabozo",
    "address": "CARRETERA 13, ENTRE CALLES 13 Y 14, LOCAL NRO S/N, SECTOR CASCO CENTRAL CALABOZO, ESTADO GUÁRICO",
    "lat": "8.923212570409564",
    "lng": "-67.4299921620964",
    "municipality": "Francisco de Miranda"
  },
  {
    "id": 129,
    "code": "#1202000",
    "name": "MRW Valle de la Pascua",
    "state": "Guárico",
    "city": "Valle de la Pascua",
    "address": "CALLE BOLIVAR ENTRE AV. LIBERTADOR Y CALLE DELEITE, LOCAL N° 58-1 SECTOR CENTRO, DIAGONAL A POLIGUARICO, VALLE DE LA PASCUA.",
    "lat": "9.212806",
    "lng": "-65.998180",
    "municipality": "Leonardo Infante"
  },
  {
    "id": 130,
    "code": "#1203000",
    "name": "MRW Zaraza",
    "state": "Guárico",
    "city": "Zaraza",
    "address": "CALLE BOLIVAR, ENTRE AYACUCHO Y SUCRE , LOCAL MRW, PB, A 100 MTS DEL SAIME, SECTOR CENTRO, ZARAZA, ESTADO GUARICO. GPS: 9.3474244,-65.3244822",
    "lat": "9.347319",
    "lng": "-65.324467",
    "municipality": "Pedro Zaraza"
  },
  {
    "id": 131,
    "code": "#1204000",
    "name": "MRW Tucupido",
    "state": "Guárico",
    "city": "Tucupido",
    "address": "CALLE SALOM NRO 24 DIAGONAL A LA ALCALDIA, ENTRE SAN PABLO Y ZARAZA, LOCAL MRW PB. GPS: 10.4347,-66.8747",
    "lat": "9.274725496659391",
    "lng": "-65.77430766291953",
    "municipality": "José Félix Ribas"
  },
  {
    "id": 132,
    "code": "#1205000",
    "name": "MRW Altagracia de Orituco",
    "state": "Guárico",
    "city": "Altagracia de Orituco",
    "address": "CALLE HURTADO ASCANIO CRUCE CON VUELVAN CARA. EDF. RESIDENCIAS LA PAZ, PB, LOCAL 2, SECTOR LAS BRISAS DEL ESTE ALTAGRACIA DE ORITUCO. EDO. GUARICO. GPS: 9.8554654,-66.3795806",
    "lat": "9.855472",
    "lng": "-66.379503",
    "municipality": "José Tadeo Monagas"
  },
  {
    "id": 133,
    "code": "#1300000",
    "name": "MRW Barquisimeto Centro",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "AV. VENEZUELA ENTRE CALLES 39 Y 40, NÚMERO 39-55, SENTIDO OESTE-ESTE. BARQUISIMETO. GPS: 10.0715248,-69.3309241",
    "lat": "10.071487",
    "lng": "-69.330903",
    "municipality": "Iribarren"
  },
  {
    "id": 134,
    "code": "#1300200",
    "name": "MRW Canaima",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "CALLE 55 ENTRE AV. PEDRO LEON TORRES Y CARRERA 19, C.C. CANAIMA, LOCAL F-02. ZONA ESTE BARQUISIMETO. GPS 10.0640084,-69.3466274",
    "lat": "10.064008",
    "lng": "-69.346627",
    "municipality": "Iribarren"
  },
  {
    "id": 135,
    "code": "#1300300",
    "name": "MRW Andres Bello",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "AV. ANDRES BELLO, ENTRE CARRERA 22 Y 23, EDF. PULCA 2, LOCALES 2 Y 3. BARQUISIMETO. GPS 10.0696841,-69.3132541",
    "lat": "10.069684",
    "lng": "-69.313254",
    "municipality": "Iribarren"
  },
  {
    "id": 136,
    "code": "#1301000",
    "name": "MRW Bqmeto Oeste",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "AV. FLORENCIO JIMENEZ, C.C. ARCOIRIS, LOCAL 5, P.B., FRENTE AL DECANATO DE LA UCLA, BARQUISIMETO, EDO. LARA. GPS: 10.0709,-69.3556",
    "lat": "10.0638",
    "lng": "-69.361274",
    "municipality": "Iribarren"
  },
  {
    "id": 137,
    "code": "#1302000",
    "name": "MRW Carora",
    "state": "Lara",
    "city": "Carora",
    "address": "AV FCO DE MIRANDA / CLLS 15A Y 16 CASA NRO 15 SECTOR EGIDIO MONTESINO-CARORA A 50 MTS DE LA PLAZA CHIO ZUBILLAGA. GPS: 10.1731161,-70.0812122",
    "lat": "10.173098",
    "lng": "-70.081354",
    "municipality": "Torres"
  },
  {
    "id": 138,
    "code": "#1303000",
    "name": "MRW Bqmeto Este",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "CALLE 15, ENTRE CARRERAS 20 Y 21, LOCAL NO. 5, DIAGONAL A LA CLINICA SAN FRANCISCO. BARQUISIMETO,ESTADO LARA. GPS: 10.068597793579102,-69.30667877197266",
    "lat": "10.068485",
    "lng": "-69.306644",
    "municipality": "Iribarren"
  },
  {
    "id": 139,
    "code": "#1303100",
    "name": "MRW Av. Moran",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "CARRERA 21 CON CALLE 9, BARQUISIMETO, ESTADO LARA GPS 10.0691719,-69.2989034",
    "lat": "10.069171",
    "lng": "-69.298903",
    "municipality": "Iribarren"
  },
  {
    "id": 140,
    "code": "#1304000",
    "name": "MRW Cabudare",
    "state": "Lara",
    "city": "Cabudare",
    "address": "AV. SANTA BARBARA, ENTRE CALLES GUILLERMO ALVIZU Y LA CRUZ, C.C. STA. BARBARA, LOCAL 2, DETRAS FERRETERIA TABURE. CÓDIGO POSTAL 3023 GPS: 10.0339,-69.2635",
    "lat": "10.033014950234612",
    "lng": "-69.26017948943476",
    "municipality": "Palavecino"
  },
  {
    "id": 141,
    "code": "#1305000",
    "name": "MRW Quibor",
    "state": "Lara",
    "city": "Quíbor",
    "address": "CALLE 8 ENTRE AVENIDA 8 Y 9 A 200MTS DEL SUPERMERCADO LA PALMA. GPS 9.9275333,-69.6190894",
    "lat": "9.927536522218347",
    "lng": "-69.61906615874732",
    "municipality": "Jiménez"
  },
  {
    "id": 142,
    "code": "#1306000",
    "name": "MRW Valle Lindo",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "AUTOPISTA VIA DUACA KM 10 SECTOR SABANA GRANDE AL LADO DE LA FARMACIA SAN IGNACIO, ZONA NORTE, BQTO. GPS: 10.1691728,-69.3130929",
    "lat": "10.169172",
    "lng": "-69.313092",
    "municipality": "Iribarren"
  },
  {
    "id": 143,
    "code": "#1307000",
    "name": "MRW Barquisimeto Nueva Segovia",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "CALLE 3 ENTRE CARRERA 1 Y AV LARA, CASA NRO AL-99 URB NUEVA SEGOVIA BARQUISIMETO EDO LARA GPS: 10.064689636230469,-69.29549407958984",
    "lat": "10.064554",
    "lng": "-69.295216",
    "municipality": "Iribarren"
  },
  {
    "id": 144,
    "code": "#1307100",
    "name": "MRW Patarata",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "AV. LIBERTADOR ENTRE AV. ARGEMIRO BRACAMONTE Y AV. LOPEZ CONTRERA, SECTOR PATARATA, CENTRO RECREACIONAL PARQUE JARDIN, LOCAL 04, BARQUISIMETO EDO. LARA. GPS 10.0799945,-69.2939417",
    "lat": "10.079994",
    "lng": "-69.293941",
    "municipality": "Iribarren"
  },
  {
    "id": 145,
    "code": "#1308000",
    "name": "MRW Babilom",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "CALLE 19 CON AV LIBERTADOR ZONA INDUSTRIAL I C.C LIBERTADOR LOCAL 13-B. GPS: 10.0638548,-69.3612843",
    "lat": "10.077511",
    "lng": "-69.339444",
    "municipality": "Iribarren"
  },
  {
    "id": 146,
    "code": "#1308100",
    "name": "MRW el Recreo",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "AV. LIBERTADOR. C.C. EL ROSARIO. LOCAL 5. FRENTE AL IPASME GPS 10.0831128,-69.3233322",
    "lat": "10.083112",
    "lng": "-69.323332",
    "municipality": "Iribarren"
  },
  {
    "id": 147,
    "code": "#1309000",
    "name": "MRW Cabudare Sur",
    "state": "Lara",
    "city": "Cabudare",
    "address": "AV EL PLACER LOCAL TRIGALPA NRO 7 URB EL TRIGAL LOS RASTROJOS LARA, GP 10.0340094,-69.2378423",
    "lat": "10.034372",
    "lng": "-69.238268",
    "municipality": "Palavecino"
  },
  {
    "id": 148,
    "code": "#1310000",
    "name": "MRW Av. Venezuela",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "AV VENEZUELA CON CALLE 21, EDIFICIO LAZIO, LOCAL NRO. 02, BQTO. EDO. LARA. C GPS 10.0735602,-69.3125445",
    "lat": "10.073560",
    "lng": "-69.312544",
    "municipality": "Iribarren"
  },
  {
    "id": 149,
    "code": "#1400000",
    "name": "MRW Merida Cubo Rojo",
    "state": "Mérida",
    "city": "Mérida",
    "address": "AV GONZALO PICON CON VIADUCTO MIRANDA, CC CUBO ROJO NIVEL PB LOCAL 2,4,6,7,8 SECTOR GLORIAS PATRIAS MERIDA. GPS: 8.5879926,-71.1545853",
    "lat": "8.588125",
    "lng": "-71.154546",
    "municipality": "Libertador"
  },
  {
    "id": 150,
    "code": "#1401000",
    "name": "MRW Merida Paseo de la Feria",
    "state": "Mérida",
    "city": "Mérida",
    "address": "AV. DON TULIO FEBRES CORDERO, CON CALLE 29, DETRÁS DEL EDF. ADMINISTRATIVO DE LA ULA, EDF. EL PASEO PB, LOCAL ÚNICO. GPS: 8.59251880645752,-71.14743041992188",
    "lat": "8.592518",
    "lng": "-71.147430",
    "municipality": "Libertador"
  },
  {
    "id": 151,
    "code": "#1402000",
    "name": "MRW el Vigia",
    "state": "Mérida",
    "city": "El Vigía",
    "address": "AV. 11, LOCAL 2, NUMERO 6-21, SECTOR LA IMAGULADA EL VIGÍA EN EL ESTADO MÉRIDA. GPS: 8.616976, -71.645681",
    "lat": "8.616976",
    "lng": "-71.6",
    "municipality": "Alberto Adriani"
  },
  {
    "id": 152,
    "code": "#1403000",
    "name": "MRW Tovar",
    "state": "Mérida",
    "city": "Tovar",
    "address": "CARRETERA 4TA. CC EL LLANO NIVEL PB LOCAL 4 SECTOR EL LLANO TOVAR, EDO.MERIDA, GPS: 8.3291184,-71.7561206",
    "lat": "8.324256",
    "lng": "-71.753001",
    "municipality": "Tovar"
  },
  {
    "id": 153,
    "code": "#1404000",
    "name": "MRW Ejido",
    "state": "Mérida",
    "city": "Ejido",
    "address": "AV. FERNANDEZ PEÑA CASA PLANTA BAJA NRO 133-C SECTOR MONTALBAN, A 100 MTS DEL DIARIO FRONTERA. CENTRO EJIDO MERIDA. GPS: 8.5489483,-71.2383251",
    "lat": "8.548986",
    "lng": "-71.238306",
    "municipality": "Campo Elías"
  },
  {
    "id": 154,
    "code": "#1405000",
    "name": "MRW Merida Milla",
    "state": "Mérida",
    "city": "Mérida",
    "address": "AV. DOS LORA, CENTRO PROFESIONAL MOLI-ROD, PB, LOCAL 4, DIAGONAL A LA PLAZA DE MILLACÓN, MÉRIDA.",
    "lat": "8.597212448889334",
    "lng": "-71.14695404802343",
    "municipality": "Libertador"
  },
  {
    "id": 155,
    "code": "#1406000",
    "name": "MRW Mda Los Proceres",
    "state": "Mérida",
    "city": "Mérida",
    "address": "AV LOS PROCERES, CALLE LA ORQUÍDEA , MINICENTRO COMERCIAL , DON LUIS, LOCAL 2B O MRW GPS 8.577718,-71.1863891",
    "lat": "8.577583",
    "lng": "-71.186393",
    "municipality": "Libertador"
  },
  {
    "id": 156,
    "code": "#1407000",
    "name": "MRW Tucanizon",
    "state": "Mérida",
    "city": "Tucaní",
    "address": "CARRETERA PANAMERICANA , SECTOR EL CARMEN,GALPON 1, AL LADO DE LA ESTACION DE SERVICIO EL INDIO.TUCANIZON EDO MERIDA. GPS: 8.9661928,-71.2757046",
    "lat": "8.966192",
    "lng": "-71.275704",
    "municipality": "Caracciolo Parra Olmedo"
  },
  {
    "id": 157,
    "code": "#1501000",
    "name": "MRW Charallave",
    "state": "Miranda",
    "city": "Charallave",
    "address": "CALLE 9, AVENIDA JOSE GREGORIO HERNANDEZ CON AVENIDA BOLIVAR EDF. LOS SAMANES NRO 03 SECTOR CASCO CENTRAL CHARALLAVE MIRANDA. GPS: 10.2403277,-66.8578658",
    "lat": "10.240259",
    "lng": "-66.857937",
    "municipality": "Cristóbal Rojas"
  },
  {
    "id": 158,
    "code": "#1501500",
    "name": "MRW Ocumare Del Tuy",
    "state": "Miranda",
    "city": "Ocumare del Tuy",
    "address": "AVENIDA MIRANDA CON CALLE TORIBIO MOTA, EDIF. TELEVISA, PB. FRENTE A LA PARADA DE PAROSCA.. GPS: 10.117089966358561,-66.77527175651109",
    "lat": "10.117001",
    "lng": "-66.77541",
    "municipality": "Tomás Lander"
  },
  {
    "id": 159,
    "code": "#1503000",
    "name": "MRW Guarenas",
    "state": "Miranda",
    "city": "Guarenas",
    "address": "C.C LA CANDELARIA, NIVEL PLANTA BAJA, LOCAL 01, ESTADO MIRANDA. GPS 10.4696896,-66.6216372",
    "lat": "10.469689",
    "lng": "-66.621637",
    "municipality": "Plaza"
  },
  {
    "id": 160,
    "code": "#1504000",
    "name": "MRW Guatire",
    "state": "Miranda",
    "city": "Guatire",
    "address": "GUATIRE, CALLE ZAMORA NUMERO 47, LOCAL PB-1, EDIFICIO QUINTA ARELIS. GPS: 10.4759,-66.5454",
    "lat": "10.475604",
    "lng": "-66.545377",
    "municipality": "Zamora"
  },
  {
    "id": 161,
    "code": "#1505000",
    "name": "MRW San Antonio de Los Altos",
    "state": "Miranda",
    "city": "San Antonio de los Altos",
    "address": "CARRETA PANAMERICANA, KILOMETRO 16, C.C. LA CASONA II, PISO 1, LOCAL #2-17 AL LADO DE CINEX, GPS 10.3697786,-66.9827115",
    "lat": "10.369778",
    "lng": "-66.982711",
    "municipality": "Los Salias"
  },
  {
    "id": 162,
    "code": "#1506000",
    "name": "MRW Higuerote",
    "state": "Miranda",
    "city": "Higuerote",
    "address": "CALLE EL RÍO, CC MARTÍ PLAZA, LOCAL 1, HIGUEROTE EDO. MIRANDA, GPS 10.485067,-66.100898",
    "lat": "10.485067",
    "lng": "-66.100898",
    "municipality": "Brión"
  },
  {
    "id": 163,
    "code": "#1507000",
    "name": "MRW Rio Chico",
    "state": "Miranda",
    "city": "Río Chico",
    "address": "CALLE COMERCIO, LOCAL MRW. AL LADO DE LA FARMACIA LAS MERCEDES, RÍO CHICO- MUNICIPIO PÁEZ- EDO. MIRANDA. GPS: 10.3164736,-65.9778191",
    "lat": "10.316573",
    "lng": "-65.977928",
    "municipality": "Páez"
  },
  {
    "id": 164,
    "code": "#1508000",
    "name": "MRW Sta Teresa Del Tuy",
    "state": "Miranda",
    "city": "Santa Teresa del Tuy",
    "address": "CALLE AYACUCHO EDIF DON GUILLERMO PISO 1 OF 2 ZONA CENTRO SANTA TERESA DEL TUY MIRANDA. GPS: 10.2336028,-66.6645992",
    "lat": "10.233783",
    "lng": "-66.664674",
    "municipality": "Independencia"
  },
  {
    "id": 165,
    "code": "#1509000",
    "name": "MRW Cua",
    "state": "Miranda",
    "city": "Cúa",
    "address": "URBANIZACION JARDINES DE SANTA ROSA, C. C. EL COLONIAL, LOCAL 26-A, CÚA, MIRANDA. GPS: 10.1691341,-66.8886829",
    "lat": "10.169015",
    "lng": "-66.888505",
    "municipality": "Urdaneta"
  },
  {
    "id": 166,
    "code": "#1510000",
    "name": "MRW Guatire Oasis",
    "state": "Miranda",
    "city": "Guatire",
    "address": "AV INTERCOMUNAL GUARENAS - GUATIRE , CENTRO COMERCIAL OASIS CENTER, PB LOCAL 24, GPS 10.465076,-66.5711214",
    "lat": "10.465076",
    "lng": "-66.571121",
    "municipality": "Zamora"
  },
  {
    "id": 167,
    "code": "#1602000",
    "name": "MRW Punta de Mata",
    "state": "Monagas",
    "city": "Punta de Mata",
    "address": "CALLE 5 DE JULIO CRUCE CON CALLE NUEVA, LOCAL MRW, DETR-S DEL BANCO CARONI W3W DESPACHO.ASPIRA.IMPUESTOS",
    "lat": "9.732466366962067",
    "lng": "-63.18641841579158",
    "municipality": "Ezequiel Zamora"
  },
  {
    "id": 168,
    "code": "#1603000",
    "name": "MRW Maturin Centro",
    "state": "Monagas",
    "city": "Maturín",
    "address": "AV ROJAS EDIF BRAVO PISO P.B LOCAL 01 SECTOR CENTRO MATURIN MONAGAS",
    "lat": "9.744426507604238",
    "lng": "-63.182343675813314",
    "municipality": "Maturín"
  },
  {
    "id": 169,
    "code": "#1605000",
    "name": "MRW Temblador",
    "state": "Monagas",
    "city": "Temblador",
    "address": "CALLE BOLIVAR. NO 70-A. DIAGONAL A LA LINEA DE TAXI EJECUTIVO DEL SUR.",
    "lat": "9.00700314575568",
    "lng": "-62.643568576814964",
    "municipality": "Libertador"
  },
  {
    "id": 170,
    "code": "#1606000",
    "name": "MRW Maturin Norte",
    "state": "Monagas",
    "city": "Maturín",
    "address": "AV. PPAL VIA VIBORAL, CENTRO COMERCIAL LAS COLINAS B, P.B. LOCAL 09",
    "lat": "9.782847849760499",
    "lng": "-63.19115003633186",
    "municipality": "Maturín"
  },
  {
    "id": 171,
    "code": "#1607000",
    "name": "MRW Maturin Zona Industrial",
    "state": "Monagas",
    "city": "Maturín",
    "address": "AV. PRINCIPAL DE LA CRUZ, C.C MACARENAS, LOCAL # 23 PB",
    "lat": "9.721634244083685",
    "lng": "-63.260218954358734",
    "municipality": "Maturín"
  },
  {
    "id": 172,
    "code": "#1608000",
    "name": "MRW Maturin Av. Raul Leoni",
    "state": "Monagas",
    "city": "Maturín",
    "address": "AV. RAUL LEONI ENTRE CARRERA 3 (ANTIGUA AV. RIVAS) Y CARRERA 4 (ANTIGUA PROLONGACION CEDEÑO) FRENTE AL POLIDEPORTIVO, MATURIN EDO. MONAGAS",
    "lat": "9.748185876688478",
    "lng": "-63.16701766670111",
    "municipality": "Maturín"
  },
  {
    "id": 173,
    "code": "#1609000",
    "name": "MRW Maturin la Floresta",
    "state": "Monagas",
    "city": "Maturín",
    "address": "CR 1 N° 4 C.C LA REDOMA NIVEL PB LOCAL 5 SECTOR BRISAS DEL AEROPUETO MATURIN MONAGAS ZONA POSTAL 6201",
    "lat": "9.733327644892569",
    "lng": "-63.19139889415848",
    "municipality": "Maturín"
  },
  {
    "id": 174,
    "code": "#1610000",
    "name": "MRW Maturin Plaza el Indio",
    "state": "Monagas",
    "city": "Maturín",
    "address": "AV. BICENTENARIO EDIF. ZAMORA, P.B. DIAGONAL AL HOSPITAL CENTRAL DE MATURIN",
    "lat": "9.741304692035948",
    "lng": "-63.19772195582855",
    "municipality": "Maturín"
  },
  {
    "id": 175,
    "code": "#1702000",
    "name": "MRW Juan Griego",
    "state": "Nueva Esparta (Margarita)",
    "city": "Juan Griego",
    "address": "CALLE GUEVARA, N° 12 B, ENTRE CALLES LA MARINA Y MARCANO, DIAGONAL A COMERCIAL JUAN GRIEGO.",
    "lat": "11.082589129693599",
    "lng": "-63.970826773967985",
    "municipality": "Marcano"
  },
  {
    "id": 176,
    "code": "#1702100",
    "name": "MRW el Espinal",
    "state": "Nueva Esparta (Margarita)",
    "city": "El Espinal",
    "address": "AV. JUAN BAUTISTA ARISMENDI, SECTOR LA ENCRUCIJADA DEL ESPINAL VIA SAN JUAN BAUTISTA. A 100 METROS DE LA REGIONAL. EL ESPINAL",
    "lat": "10.982777178132618",
    "lng": "-63.979268926731926",
    "municipality": "Díaz"
  },
  {
    "id": 177,
    "code": "#1704000",
    "name": "MRW Jovito Villalba",
    "state": "Nueva Esparta (Margarita)",
    "city": "Pampatar",
    "address": "AV. JOVITO VILLALBA, LOCAL ESTACION DE SERVICIO MANEIRO, NRO 9493, URB SAN LORENZO, AL LADO DEL SAMBIL. PAMPATAR EDO. NUEVA ESPARTA.",
    "lat": "10.994878551493771",
    "lng": "-63.8099027284142",
    "municipality": "Maneiro"
  },
  {
    "id": 179,
    "code": "#1706000",
    "name": "MRW Porlamar Centro",
    "state": "Nueva Esparta (Margarita)",
    "city": "Porlamar",
    "address": "CALLE VELAZQUEZ CON ESQUINA FAJARDO, CASA S/N, SECTOR CENTRO PORLAMAR, NUEVA ESPARTA.",
    "lat": "10.956936891522595",
    "lng": "-63.84798872314384",
    "municipality": "Mariño"
  },
  {
    "id": 180,
    "code": "#1707000",
    "name": "MRW Villa Rosa",
    "state": "Nueva Esparta (Margarita)",
    "city": "Villa Rosa",
    "address": "AV JUAN BAUTISTA ARISMENDI LOCAL GALPON SEVEN-ART NRO PLANTA BAJA SECTOR SAN ANTONIO NORTE VILLA ROSA NUEVA ESPARTA",
    "lat": "10.947403386053988",
    "lng": "-63.921636824655195",
    "municipality": "García"
  },
  {
    "id": 181,
    "code": "#1800000",
    "name": "MRW Guanare",
    "state": "Portuguesa",
    "city": "Guanare",
    "address": "AV. PRINCIPAL JOSE MARIA VARGAS CON AV. SIMON BOLIVAR CENTRO COMERCIAL REVICA GALPON N. 4 GPS: 9.0332177,-69.7401574",
    "lat": "9.033083",
    "lng": "-69.740321",
    "municipality": "Guanare"
  },
  {
    "id": 182,
    "code": "#1801000",
    "name": "MRW Acarigua",
    "state": "Portuguesa",
    "city": "Acarigua",
    "address": "CALLE 22. ENTRE AVENIDAS LIBERTADOR Y ALIANZA DIAGONAL A LA PANADERIA TREBOL, ACARIGUA CENTRO. EDO. PORTUGUESA. GPS: 9.5585801,-69.212533",
    "lat": "9.558532",
    "lng": "-69.212572",
    "municipality": "Páez"
  },
  {
    "id": 183,
    "code": "#1804000",
    "name": "MRW Centro Los Llanos",
    "state": "Portuguesa",
    "city": "Acarigua",
    "address": "CALLE 31 CON AV 28 C.C LOS LLANOS LOCAL 5 PLANTA BAJA. GPS: 9.560776,-69.2045441",
    "lat": "9.560477",
    "lng": "-69.204717",
    "municipality": "Páez"
  },
  {
    "id": 184,
    "code": "#1900000",
    "name": "MRW Cumana",
    "state": "Sucre",
    "city": "Cumaná",
    "address": "CALLE MARIÑO, EDIF TURIMIQUIRE , FRENTE A LA CRUZ ROJA DE CUMANA.",
    "lat": "10.463194187406774",
    "lng": "-64.18565641678401",
    "municipality": "Sucre"
  },
  {
    "id": 185,
    "code": "#1901000",
    "name": "MRW Carupano",
    "state": "Sucre",
    "city": "Carúpano",
    "address": "AV UNIVERSITARIA EDIF PROSSEIN PISO MEZANINA LOCAL B SECTOR LOS MOLINOS CARUPANO SUCRE",
    "lat": "10.642378022487527",
    "lng": "-63.25623876038623",
    "municipality": "Bermúdez"
  },
  {
    "id": 186,
    "code": "#1902000",
    "name": "MRW Cumana Urdaneta",
    "state": "Sucre",
    "city": "Cumaná",
    "address": "4TA TRANSVERSAL DE LA AVENIDA GRAN MARISCAL. EDIFICIO CEU, P.B. LOCAL 2 MRW",
    "lat": "10.4726423407558",
    "lng": "-64.16803703351304",
    "municipality": "Sucre"
  },
  {
    "id": 187,
    "code": "#2000000",
    "name": "MRW Barrio Obrero Carrera 20",
    "state": "Táchira",
    "city": "San Cristóbal",
    "address": "BARRIO OBRERO CALLE 10 CARRERA 20 NO. 9-108, LOCAL 6 FRENTE LICORER-A 9 CON 19. SAN CRISTÓBAL ESTADO TACHIRA",
    "lat": "7.7682205284770065",
    "lng": "-72.22064867467596",
    "municipality": "San Cristóbal"
  },
  {
    "id": 188,
    "code": "#2001000",
    "name": "MRW San Cristobal Concordia",
    "state": "Táchira",
    "city": "San Cristóbal",
    "address": "CALLE 4 C/C CARRERAS 6 Y 7 EDF. RAM-REZ PB LOCAL 1, DETR-S DEL DIARIO LA NACIÓN. LA CONCORDIA. SAN CRISTÓBAL, ESTADO TACHIRA..",
    "lat": "7.758111559889172",
    "lng": "-72.23328548894746",
    "municipality": "San Cristóbal"
  },
  {
    "id": 189,
    "code": "#2002000",
    "name": "MRW S. Antonio Del Tachira",
    "state": "Táchira",
    "city": "San Antonio del Táchira",
    "address": "AV VENEZUELA CON CALLE 7 EDIF REAL LOCAL N 7-09 SECTOR CENTRO, A TRES CUADRAS DE LA ADUANA PRINCIPAL.",
    "lat": "7.817990049333534",
    "lng": "-72.44440962269171",
    "municipality": "Bolívar"
  },
  {
    "id": 190,
    "code": "#2003000",
    "name": "MRW la Fria",
    "state": "Táchira",
    "city": "La Fría",
    "address": "CARRERA 11 ENTRE CALLES 4 Y 5 AL LADO DE RAMINI LA FRIA EDO. TACHIRA",
    "lat": "8.214688017834678",
    "lng": "-72.25000014102986",
    "municipality": "García de Hevia"
  },
  {
    "id": 191,
    "code": "#2004000",
    "name": "MRW la Grita",
    "state": "Táchira",
    "city": "La Grita",
    "address": "AV FCO DE CACERES DIAGONAL AL COLEGIO STA ROSA DE LIMA , LA GRITA EDO. TACHIRA",
    "lat": "8.133264938202345",
    "lng": "-71.98614261548148",
    "municipality": "Jáuregui"
  },
  {
    "id": 192,
    "code": "#2005000",
    "name": "MRW Rubio",
    "state": "Táchira",
    "city": "Rubio",
    "address": "CENTRO COMERCIAL VENEZIA FRENTE A LA PLAZA BOLIVAR DE RUBIO SECTOR CENTR0O LOCALES 6 Y 7, ESTADO TACHIRA.",
    "lat": "7.770128520214142",
    "lng": "-72.22115545552745",
    "municipality": "Junín"
  },
  {
    "id": 193,
    "code": "#2006000",
    "name": "MRW el Piñal",
    "state": "Táchira",
    "city": "El Piñal",
    "address": "CALLE 1 CON CARRERA 3, LOCAL NO. 1. ZONA COMERCIAL EL MIRADOR. VIA LA MORITA. CERCA DE LA E/S EL PIÑAL",
    "lat": "7.531381188625078",
    "lng": "-71.96179596570428",
    "municipality": "Fernández Feo"
  },
  {
    "id": 194,
    "code": "#2007000",
    "name": "MRW Tariba",
    "state": "Táchira",
    "city": "Táriba",
    "address": "CALLE 8 CON CARRERA 8 CASA NRO 7-87 LOCAL 3, 4 CUADRAS SUBIENDO DE LA PLAZUELA DE TARIBA. SECTOR TARIBA, TACHIRA",
    "lat": "7.821747124558381",
    "lng": "-72.22373474573386",
    "municipality": "Cárdenas"
  },
  {
    "id": 195,
    "code": "#2008000",
    "name": "MRW Barrio Obrero",
    "state": "Táchira",
    "city": "San Cristóbal",
    "address": "BARRIO OBRERO, CARRERA 22, ESQUINA CALLE 12, DIAGONAL A LA PLAZA LOS MANGOS, AL LADO DE LA CAPILLA DE LOS AHORCADOS, N° 22-9 SAN CRISTOBAL EDO. TÁCHIRA",
    "lat": "7.770796",
    "lng": "-72.218302",
    "municipality": "San Cristóbal"
  },
  {
    "id": 196,
    "code": "#2009000",
    "name": "MRW Ureña",
    "state": "Táchira",
    "city": "Ureña",
    "address": "CALLE 5 CON ESQUINA CARRERA 6, EDIF. SOFI, LOCAL 106, BARRIO LA GUAJIRA. UREÑA",
    "lat": "7.91624977063076",
    "lng": "-72.4540388045285",
    "municipality": "Pedro María Ureña"
  },
  {
    "id": 197,
    "code": "#2010000",
    "name": "MRW San Cristobal Centro",
    "state": "Táchira",
    "city": "San Cristóbal",
    "address": "7MA AV ENTRE CALLE 5 Y 6 C.C. PARTENÓN , NIVEL P.B LOCAL N° 3 DIAGONAL A LA TORRE UNIÓN, A CUADRA Y MEDIA DE LA PLAZA BOLIVAR, SECTOR CENTRO, SAN CRISTOBAL ESTADO TACHIRA.",
    "lat": "7.76602204239048",
    "lng": "-72.23237672214098",
    "municipality": "San Cristóbal"
  },
  {
    "id": 198,
    "code": "#2011000",
    "name": "MRW Paramillo",
    "state": "Táchira",
    "city": "San Cristóbal",
    "address": "BARRIO EL LOBO, CALLE 1 FRENTE A LA MANGA DE COLEO DE ASOGATA, A 100 MTS DE LA AV. LOS AGUSTINOS, RESIDENCIAS MARSEE, PISO PB, SECTOR PARAMILLO.",
    "lat": "7.791915804020803",
    "lng": "-72.20619724065122",
    "municipality": "San Cristóbal"
  },
  {
    "id": 199,
    "code": "#2012000",
    "name": "MRW San Juan de Colon",
    "state": "Táchira",
    "city": "San Juan de Colón",
    "address": "C. 7 ESQUINA CARRERA 5. NO 4-79. SAN JUAN DE COLON.",
    "lat": "8.03426509019042",
    "lng": "-72.26179906250293",
    "municipality": "Ayacucho"
  },
  {
    "id": 200,
    "code": "#2100000",
    "name": "MRW Trujillo",
    "state": "Trujillo",
    "city": "Trujillo",
    "address": "AV. INDEPENDENCIA CENTRO COMERCIAL LOS TORRES LOCAL 02, TRUJILLO ESTADO TRUJILLO.",
    "lat": "9.36971838254209",
    "lng": "-70.43527629870594",
    "municipality": "Trujillo"
  },
  {
    "id": 201,
    "code": "#2101000",
    "name": "MRW Valera",
    "state": "Trujillo",
    "city": "Valera",
    "address": "CALLE 5 ENTRE AV. BOLIVAR Y 9. EDIF. DON PEPE. P.B. AL LADO DE LA ANTIGUA SEDE.",
    "lat": "9.31545550815666",
    "lng": "-70.60584584051065",
    "municipality": "Valera"
  },
  {
    "id": 202,
    "code": "#2102000",
    "name": "MRW Carache",
    "state": "Trujillo",
    "city": "Carache",
    "address": "AV. PRINCIPAL CASA S/N SECTOR PALO NEGRO, CARACHE ESTADO TRUJILLO",
    "lat": "9.62637980958744",
    "lng": "-70.23188210914795",
    "municipality": "Carache"
  },
  {
    "id": 203,
    "code": "#2103000",
    "name": "MRW Bocono",
    "state": "Trujillo",
    "city": "Boconó",
    "address": "AV. MIRANDA C/C C. ANDRES BELLO. LOCAL 2",
    "lat": "9.242876740525235",
    "lng": "-70.27058188855564",
    "municipality": "Boconó"
  },
  {
    "id": 204,
    "code": "#2104000",
    "name": "MRW Valera Los Limoncitos",
    "state": "Trujillo",
    "city": "Valera",
    "address": "AV. BOLIVAR, ENTRE CALLE 22 Y 23, CENTRO COMERCIAL ARICHUNA, NIVEL PB, LOCAL 14, SECTOR LOS LIMONCITOS, MUNICIPIO VALERA, ESTADO TRUJILLO.",
    "lat": "9.300367195360668",
    "lng": "-70.61385269148468",
    "municipality": "Valera"
  },
  {
    "id": 205,
    "code": "#2105000",
    "name": "MRW Valera Centro",
    "state": "Trujillo",
    "city": "Valera",
    "address": "AV. 12 ENTRE CALLES 8 Y 9, EDIF. BEATRIZ, P.B., LOCAL 1, A UNA CUADRA DE LA PLAZA BOL-VAR. GPS: 9.3149416,-70.6091462",
    "lat": "9.315079109145378",
    "lng": "-70.60908455789537",
    "municipality": "Valera"
  },
  {
    "id": 206,
    "code": "#2106000",
    "name": "MRW Sabana de Mendoza",
    "state": "Trujillo",
    "city": "Sabana de Mendoza",
    "address": "C.C. SABANA MALL, AV. BOLIVAR CON CALLE BERMUDEZ DE SABANA DE MENDOZA, MUNICIPIO SUCRE, EDO. TRUJILLO,",
    "lat": "9.434551339375316",
    "lng": "-70.77070722224428",
    "municipality": "Sucre"
  },
  {
    "id": 207,
    "code": "#2201000",
    "name": "MRW Catia la Mar",
    "state": "La Guaira (Vargas)",
    "city": "Catia La Mar",
    "address": "CALLE ALFARERíA, URB. WEEK-END, FRENTE A TU SALUD VARGAS, AL LADO DE LA UNIDAD DE RADIOLOGíA SAN ANTONIO",
    "lat": "10.596994111052355",
    "lng": "-67.014851",
    "municipality": "Vargas"
  },
  {
    "id": 208,
    "code": "#2300000",
    "name": "MRW San Felipe",
    "state": "Yaracuy",
    "city": "San Felipe",
    "address": "CALLE 12, ENTRE AVENIDA 8 Y 9, EDIFICIO DON JORGE, PLANTA BAJA, LOCAL 3, SECTOR CAJA DE AGUA, SAN FELIPE, ESTADO YARACUY. GPS 10.3403525,-68.7384701",
    "lat": "10.340352",
    "lng": "-68.738470",
    "municipality": "San Felipe"
  },
  {
    "id": 209,
    "code": "#2301000",
    "name": "MRW Nirgua",
    "state": "Yaracuy",
    "city": "Nirgua",
    "address": "AV. 5 ENTRE CALLES 4 Y 5. EDIF. MURCIA, LOCAL 3. DIAGONAL AL BANCO PROVINCIAL, SECTOR PLAZA SUCRE. NIRGUA. GPS: 10.1498921,-68.5658553",
    "lat": "10.149915",
    "lng": "-68.565877",
    "municipality": "Nirgua"
  },
  {
    "id": 210,
    "code": "#2303000",
    "name": "MRW Yaritagua",
    "state": "Yaracuy",
    "city": "Yaritagua",
    "address": "CALLE 17 ENTRE CARRERAS 7 Y 8 LOCAL S/N, DIAGONAL AL REGISTRO CIVIL. SECTOR CENTRO YARITAGUA - YARACUY. GPS: 10.0783462,-69.1288746",
    "lat": "10.07837",
    "lng": "-69.128987",
    "municipality": "Peña"
  },
  {
    "id": 211,
    "code": "#2400000",
    "name": "MRW Maracaibo la Limpia",
    "state": "Zulia",
    "city": "Maracaibo",
    "address": "AV. 28 (LA LIMPIA) N° 14-54. EDIF. RODR-GUEZ Y BARBOZA, DIAGONAL AL HOTEL MARACAIBO SUITE. PB",
    "lat": "10.650359991444178",
    "lng": "-71.63203480781765",
    "municipality": "Maracaibo"
  },
  {
    "id": 212,
    "code": "#2400100",
    "name": "MRW Circunvalacion 2",
    "state": "Zulia",
    "city": "Maracaibo",
    "address": "PARROQUIA CECILIO ACOSTA, MUNICIPIO MARACAIBO, AV. 58 CIRCUNVALACION N° 2 EDIF, CASA SAAS PISO: PB, LOCAL 98E-164 BARRIO ENTRE CALLES 98E Y 99, BARRIO ANDRES ELOY BLANCO",
    "lat": "10.631539471793804",
    "lng": "-71.66364906571424",
    "municipality": "Maracaibo"
  },
  {
    "id": 213,
    "code": "#2400500",
    "name": "MRW Los Olivos",
    "state": "Zulia",
    "city": "Maracaibo",
    "address": "AV 28 LA LIMPIA CON AVENIDA 69A LOCAL #69B-09 SECTOR LOS ACEITUNOS, AL LADO DE LA E/S LOS ACEITUNOS",
    "lat": "10.675914190270818",
    "lng": "-71.65819283206038",
    "municipality": "Maracaibo"
  },
  {
    "id": 214,
    "code": "#2400600",
    "name": "MRW Maracaibo Norte",
    "state": "Zulia",
    "city": "Maracaibo",
    "address": "AV. PAUL MORENO, ANTIGUA FUERZAS ARMADAS CON CALLE 20, EDIF. MILENIUM FARMACIA YA!, MARCAIBO EDO-ZULIA",
    "lat": "10.720756066693236",
    "lng": "-71.6233388498742",
    "municipality": "Maracaibo"
  },
  {
    "id": 215,
    "code": "#2401000",
    "name": "MRW Maracaibo Indio Mara",
    "state": "Zulia",
    "city": "Maracaibo",
    "address": "CALLE 78 DR PORTILLO ENTRE AV. 17 Y 18 NO 17-35, C.C. DON JULIO, DIAGONAL AL BANCO PROVINCIAL, SECTOR EL PARAISO.",
    "lat": "10.662281228789102",
    "lng": "-71.62143614436297",
    "municipality": "Maracaibo"
  },
  {
    "id": 216,
    "code": "#2404000",
    "name": "MRW Ciudad Ojeda",
    "state": "Zulia",
    "city": "Ciudad Ojeda",
    "address": "AV. INTERCOMUNAL. SECTOR LAS MOROCHAS. FRENTE A LA ESTACION DE SERVICIO CENTRAL SECTOR LAS MOROCHAS",
    "lat": "10.199443906511913",
    "lng": "-71.32861828284835",
    "municipality": "Lagunillas"
  },
  {
    "id": 217,
    "code": "#2406000",
    "name": "MRW Manzanillo",
    "state": "Zulia",
    "city": "San Francisco",
    "address": "CALLE UNION (10A) CON AV. 24, SECTOR MANZANILLO, LOCAL N°2.",
    "lat": "10.587584205043251",
    "lng": "-71.62494329100133",
    "municipality": "San Francisco"
  },
  {
    "id": 218,
    "code": "#2406200",
    "name": "MRW Coromoto",
    "state": "Zulia",
    "city": "San Francisco",
    "address": "URBANIZACIÓN COROMOTO, AVENIDA 40, C.C. VILLA MALL, PB. 4.",
    "lat": "10.5592628108392",
    "lng": "-71.63508934113167",
    "municipality": "San Francisco"
  },
  {
    "id": 219,
    "code": "#2408000",
    "name": "MRW Machiques",
    "state": "Zulia",
    "city": "Machiques",
    "address": "CALLE UNION, ENTRE AVENIDAS UDON PEREZ Y VALLE FRIO, CASA S/N, SECTOR VALLE FRIO. MACHIQUES",
    "lat": "10.054355239499436",
    "lng": "-72.55663570446956",
    "municipality": "Machiques de Perijá"
  },
  {
    "id": 220,
    "code": "#2412000",
    "name": "MRW Cabimas",
    "state": "Zulia",
    "city": "Cabimas",
    "address": "AV INTERCOMUNAL, ESQUINA CUMANA EDIF INTERCUMANA LOCAL N 02 PB CABIMAS EDO ZULIA.",
    "lat": "10.39890552074531",
    "lng": "-71.44576410404672",
    "municipality": "Cabimas"
  },
  {
    "id": 221,
    "code": "#2413000",
    "name": "MRW la Chinita",
    "state": "Zulia",
    "city": "Maracaibo",
    "address": "AV.19 CON CALLE 93, EDIFICO PADILLA, PB, LOCAL 33, AL LADO DEL CENTRO DE LITERATURA CRISTIANA, CASCO CENTRAL, MARACAIBO",
    "lat": "10.644755981518854",
    "lng": "-71.6136623233157",
    "municipality": "Maracaibo"
  },
  {
    "id": 222,
    "code": "#2414000",
    "name": "MRW Maracaibo Irama",
    "state": "Zulia",
    "city": "Maracaibo",
    "address": "C.C. LA PARAGUA, PLANTA BAJA, LOCAL 5, AL LADO DE AMERICAN IMPORT, EDO. ZULIA.",
    "lat": "10.6928459016",
    "lng": "-71.6229722",
    "municipality": "Maracaibo"
  },
  {
    "id": 223,
    "code": "#2415000",
    "name": "MRW Santa Barbara Del Zulia",
    "state": "Zulia",
    "city": "Santa Bárbara del Zulia",
    "address": "AV 8 CASA N° 5-117 SECTOR BOLIVAR, SANTA BARBARA ZULIA.",
    "lat": "8.999303745600683",
    "lng": "-71.91559652688348",
    "municipality": "Colón"
  },
  {
    "id": 224,
    "code": "#2416000",
    "name": "MRW el Venado",
    "state": "Zulia",
    "city": "El Venado",
    "address": "AV. INDEPENDENCIA, CENTRO COMERCIAL SAN ANTONIO (LOS DUARTES), LOCAL #01, MENE GRANDE; MUNICIPIO BARALT DEL ESTADO ZULIA, CODIGO POSTAL 4015",
    "lat": "9.817864362848162",
    "lng": "-70.9303888228213",
    "municipality": "Baralt"
  },
  {
    "id": 225,
    "code": "#2417000",
    "name": "MRW Ciudad Ojeda Centro",
    "state": "Zulia",
    "city": "Ciudad Ojeda",
    "address": "C.C. BARI, CARRETERA “N”, ENTRE CALLES 34 Y SANTA MONICA, CIUDAD OJEDA, ESTADO ZULIA",
    "lat": "10.194115",
    "lng": "-71.300362",
    "municipality": "Lagunillas"
  },
  {
    "id": 226,
    "code": "#2420000",
    "name": "MRW Tia Juana",
    "state": "Zulia",
    "city": "Tía Juana",
    "address": "AVENIDA INTERCOMUNAL DE TIA JUANA, SECTOR EZEQUIEL ZAMORA, LOCAL # 1. FRENTE A PRODATA WIRE - LINE. TIA JUANA",
    "lat": "10.2325658615905",
    "lng": "-71.35249661657916",
    "municipality": "Simón Bolívar"
  },
  {
    "id": 227,
    "code": "#2423000",
    "name": "MRW Maracaibo la Lago",
    "state": "Zulia",
    "city": "Maracaibo",
    "address": "AV. 3E ENTRE CALLE 72 Y 73 EDIF. ASOCIACIÓN ZULIANA DE CIEGOS, LOCAL 3",
    "lat": "10.671692566651219",
    "lng": "-71.60348538880086",
    "municipality": "Maracaibo"
  },
  {
    "id": 228,
    "code": "#2424000",
    "name": "MRW Caja Seca",
    "state": "Zulia",
    "city": "Caja Seca",
    "address": "CTRA. PANAMERICANA, C.C. SAGRADO CORAZON DE JESUS, NIVEL PB, LOCAL 1, SECTOR EL LATINO. NUEVA BOLIVIA, EDO. MERIDA , ZONA POSTAL 5115.",
    "lat": "9.14213641938779",
    "lng": "-71.0818224672427",
    "municipality": "Sucre"
  },
  {
    "id": 229,
    "code": "#2425000",
    "name": "MRW Curva de Molina",
    "state": "Zulia",
    "city": "Maracaibo",
    "address": "CALLE 79 NRO 92-58 FRENTE AL MODULO LIBERTADOR, AL LADO DE LA FERRETERIA RAYEN.",
    "lat": "10.68608057542167",
    "lng": "-71.68063603598236",
    "municipality": "Maracaibo"
  },
  {
    "id": 233,
    "code": "#1802000",
    "name": "MRW Turen",
    "state": "Portuguesa",
    "city": "Turén",
    "address": "AVENIDA 6, ENTRE CALLE 8 Y 9, TURÉN PORTUGUESA. GPS 9.3329354,-69.1236159",
    "lat": "9.332935",
    "lng": "-69.123615",
    "municipality": "Turén"
  },
  {
    "id": 255,
    "code": "#0139000",
    "name": "MRW Quinta Crespo",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "EDIFICIO DOLORES, AVENIDA OESTE 18A, BÁRCENAS, LOCAL NÚMERO 3, PARROQUIA SANTA TERESA, CARACAS, DISTRITO CAPITA",
    "lat": "10.29449",
    "lng": "-66.55058",
    "municipality": "Libertador"
  },
  {
    "id": 256,
    "code": "#0400000",
    "name": "MRW San Fernando",
    "state": "Apure",
    "city": "San Fernando de Apure",
    "address": "CALLE BOLIVAR ENTRE CALLE PIAR Y GIRARDOT, LOCAL NRO S/N SECTOR CENTRO, SAN FERNANDO DE APURE GPS: 7.887714, -67.475549",
    "lat": "7.887714",
    "lng": "-67.475549",
    "municipality": "San Fernando"
  },
  {
    "id": 258,
    "code": "#0132100",
    "name": "MRW Montalban",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "MONTALBAN II. 2DA TRANSVERSAL CENTRO COMERCIAL LA VILLA. GPS: 10.473580360412598,-66.95611572265625",
    "lat": "10.433559",
    "lng": "-67.001662",
    "municipality": "Libertador"
  },
  {
    "id": 294,
    "code": "#1500000",
    "name": "MRW Los Teques",
    "state": "Miranda",
    "city": "Los Teques",
    "address": "CALLE SUCRE NORTE, LOCALES NRO. 2 Y 15-1, SECTOR EL PUEBLO, LOS TEQUES, MIRANDA GPS - 10.349844, -67.043481",
    "lat": "10.349844",
    "lng": "-67.043481",
    "municipality": "Guaicaipuro"
  },
  {
    "id": 297,
    "code": "#0511100",
    "name": "MRW Maracay Santa Rita",
    "state": "Aragua",
    "city": "Santa Rita",
    "address": "AV. GENERALíSIMO FRANCISCO DE MIRANDA, ENTRE PROLONGACIóN Y ANDRéS BELLO, CALLE ANDRéS BELLO, LOCAL NRO. 75, SECTOR GUARUTO, SANTA RITA, ESTADO ARAGUA 10.234873030073881, -67.5923007253661.",
    "lat": "10.201149",
    "lng": "-67.575355",
    "municipality": "Francisco Linares Alcántara"
  },
  {
    "id": 299,
    "code": "#1701000",
    "name": "MRW Porlamar",
    "state": "Nueva Esparta (Margarita)",
    "city": "Porlamar",
    "address": "CALLE CEDEñO CRUCE CON CALLE NARVAEZ, EDIFICIO R. AMAYA & CIA , PLANTA BAJA, LOCAL S/N, SECTOR TACHIRA, PORLAMAR, MUNICIPIO MARIÑO DEL ESTADO NUEVA ESPARTA.",
    "lat": "10.960697359856736",
    "lng": "-63.84350655246909",
    "municipality": "Mariño"
  },
  {
    "id": 326,
    "code": "#0149000",
    "name": "MRW la California",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Sucre / Petare)",
    "address": "AV. FCO. DE MIRANDA CON AV. MADRID C.C. PUERTAS DEL ESTE, LOCAL 5 LA CALIFORNIA NORTE.",
    "lat": "10.48524",
    "lng": "-66.82292",
    "municipality": "Sucre"
  },
  {
    "id": 327,
    "code": "#0600100",
    "name": "MRW Av Sucre Barinas",
    "state": "Barinas",
    "city": "Barinas",
    "address": "AV. SUCRE, EDIFICIO RESIDENCIAS KARO, LOCAL N° 1, PB",
    "lat": "8.62568",
    "lng": "-70.21675",
    "municipality": "Barinas"
  },
  {
    "id": 335,
    "code": "#0307000",
    "name": "MRW el Tigrito",
    "state": "Anzoátegui",
    "city": "San José de Guanipa (El Tigrito)",
    "address": "CENTRO COMERCIAL DECA, PB, LOCAL NRO. 2, AV. FERNáNDEZ PADILLA, MUNICIPIO SAN JOSé DE GUANIPA, ESTADO ANZOáTEGUI.",
    "lat": "8.89",
    "lng": "-64.18",
    "municipality": "Guanipa"
  },
  {
    "id": 338,
    "code": "#0127000",
    "name": "MRW Boleita",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Sucre / Petare)",
    "address": "AV. LAS PALMAS, EDIF. TORRE DON LEONARDO, PISO PB, LOCAL 6, URB. BOLEITA SUR, CARACAS (PETARE), ZONA POSTAL 1071",
    "lat": "10.492951",
    "lng": "-66.823265",
    "municipality": "Sucre"
  },
  {
    "id": 339,
    "code": "#1101000",
    "name": "MRW Punto Fijo Centro",
    "state": "Falcón",
    "city": "Punto Fijo",
    "address": "AV. COLOMBIA, ENTRE AYACUCHO Y PENINSULAR, C.C. DON JOSE LAY, NIVEL PB, LOCAL 5B, SECTOR CENTRO, PUNTO FIJO FALCON.",
    "lat": "11.687058369314018",
    "lng": "-70.20834554037319",
    "municipality": "Carirubana"
  },
  {
    "id": 345,
    "code": "#1303200",
    "name": "MRW Altagracia",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "CARRERA 21, ENTRE CALLE 20 Y 21, LOCAL COMERCIAL S/N, EDIFICIO NRO. 20 – 81, BARQUISIMETO .",
    "lat": "10.068",
    "lng": "-69.312",
    "municipality": "Iribarren"
  },
  {
    "id": 353,
    "code": "#2200000",
    "name": "MRW la Guaira",
    "state": "La Guaira (Vargas)",
    "city": "La Guaira / Maiquetía",
    "address": "CALLE LOTE DE TERRENO DE LA MANZANA E LOCAL 94 SECTOR MIRAMAR, AL LADO DEL C.C. BAHIA SUPERMARKET, MAIQUETIA LA GUAIRA ZONA POSTAL 1161",
    "lat": "10.618",
    "lng": "-66.844",
    "municipality": "Vargas"
  },
  {
    "id": 357,
    "code": "#0702000",
    "name": "MRW Caicara Del Orinoco",
    "state": "Bolívar",
    "city": "Caicara del Orinoco",
    "address": "CARRETERA TRONCAL 19 LOCAL NRO. S/N, SECTOR SAN RAFAEL, CAICARA DEL ORINOCO, ESTADO BOLíVAR",
    "lat": "7.612650365002802",
    "lng": "-66.14514042313505",
    "municipality": "Cedeño"
  },
  {
    "id": 359,
    "code": "#0500000",
    "name": "MRW Maracay Centro",
    "state": "Aragua",
    "city": "Maracay",
    "address": "AVENIDA FUERZAS AéREAS, LOCAL 91-B, SECTOR MARIO BRICEñO IRAGORRY, MARACAY ESTADO ARAGUA",
    "lat": "10.23784515521201",
    "lng": "-67.58619401951874",
    "municipality": "Girardot"
  },
  {
    "id": 360,
    "code": "#0518000",
    "name": "MRW Los Cedros",
    "state": "Aragua",
    "city": "Maracay",
    "address": "CALLE 5 DE JULIO, CRUCE CON CJN \"В\" LOCAL NRO. 116 BARRIO LIBERTAD MARACAY ESTADO ARAGUA",
    "lat": "10.241056602801367",
    "lng": "-67.60134115612699",
    "municipality": "Girardot"
  },
  {
    "id": 361,
    "code": "#0817000",
    "name": "MRW Valencia Los Guajiros",
    "state": "Carabobo",
    "city": "Valencia",
    "address": "CALLE 73, NRO. CIVICO 90-27,, LOCAL S/N, BARRIO LA ISABELA, VALENCIA ESTADO CARABOBO",
    "lat": "10.161073931779228",
    "lng": "-67.98868971985027",
    "municipality": "Valencia"
  },
  {
    "id": 367,
    "code": "#1310100",
    "name": "MRW Av Venezuela Este",
    "state": "Lara",
    "city": "Barquisimeto",
    "address": "AV. VENEZUELA CON CALLES 8 Y 9, BARQUISIMETO, ESTADO LARA.",
    "lat": "10.074098",
    "lng": "-69.299727",
    "municipality": "Iribarren"
  },
  {
    "id": 368,
    "code": "#0821000",
    "name": "MRW Tocuyito",
    "state": "Carabobo",
    "city": "Tocuyito",
    "address": "CALLE ARVELO, LOCAL NRO. A-01, SECTOR CASCO CENTRAL DE TOCUYITO, EDIF. SAN JOSE, TOCUYITO, ESTADO CARABOBO.",
    "lat": "10.09508",
    "lng": "-68.10010",
    "municipality": "Libertador"
  },
  {
    "id": 371,
    "code": "#0128100",
    "name": "MRW Perez Bonalde",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "CATIA ENTRÉ CALLE COLOMBIA Y ATLÁNTICO EDIFICIO LAZIO PB PÉREZ BONALDEZ CARACAS",
    "lat": "10.505102",
    "lng": "-66.948079",
    "municipality": "Libertador"
  },
  {
    "id": 377,
    "code": "#0107100",
    "name": "MRW Parque Naciones Unidas",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Libertador)",
    "address": "AV. JOSÉ ANTONIO PÁEZ, ENTRE AV. LOS PINOS Y PARQUE NACIONES UNIDAS, RESIDENCIA CITY PARK, PB - EL PARAISO",
    "lat": "10.490645",
    "lng": "-66.928482",
    "municipality": "Libertador"
  },
  {
    "id": 381,
    "code": "#1207000",
    "name": "MRW Valle de la Pascua Norte",
    "state": "Guárico",
    "city": "Valle de la Pascua",
    "address": "CALLE RETUMBO ENTRE CALLE PARAISO Y AV. RÓMULO GALLEGOS, C.C. CENTRO NORTE, LOCAL 1A, AL LADO DE OXILA 5000, ESTADO GUARICO.",
    "lat": "9.215028",
    "lng": "-66.002564",
    "municipality": "Leonardo Infante"
  },
  {
    "id": 384,
    "code": "#0121000",
    "name": "MRW Santa Fe",
    "state": "Distrito Capital (Caracas)",
    "city": "Caracas (Baruta)",
    "address": "AV. JOSÉ MARÍA VARGAS CON CALLE SANTA ISABEL, EDIFICIO RESIDENCIAS CODICA II NO 8 URBANIZACIÓN SAN JUAN SANTA FE NORTE, MUNICIPIO BARUTA DEL ESTADO MIRANDA.",
    "lat": "10.464001",
    "lng": "-66.869430",
    "municipality": "Baruta"
  },
  {
    "id": 391,
    "code": "#0305000",
    "name": "MRW Piritu",
    "state": "Anzoátegui",
    "city": "Píritu",
    "address": "CALLE BOLIVAR, C.C. LOS DELFINES, NIVEL PB, LOCAL 5, SECTOR CENTRO PUERTO PIRITU, ANZOáTEGUI",
    "lat": "10.063662721008757",
    "lng": "-65.04578810978808",
    "municipality": "Píritu"
  },
  {
    "id": 392,
    "code": "#0514000",
    "name": "MRW Maracay la Cooperativa",
    "state": "Aragua",
    "city": "Maracay",
    "address": "AV. RAFAEL URDANETA, LOCAL NRO. PB-3, URB. ANDRES BELLO, MARACAY, ESTADO ARAGUA.",
    "lat": "10.261793062613481",
    "lng": "-67.58232971961485",
    "municipality": "Girardot"
  },
  {
    "id": 393,
    "code": "#2429000",
    "name": "MRW Villa Del Rosario",
    "state": "Zulia",
    "city": "La Villa del Rosario",
    "address": "AV. 20 MUNICIPAL CON CALLE 15 PÁEZ, C.C. INNOVACIÓN, LOCAL NO. 8, FRENTE AL CLUB DE MARIACHIS, VILLA DEL ROSARIO, ZULIA.",
    "lat": "10.32390",
    "lng": "-72.32050",
    "municipality": "Rosario de Perijá"
  },
  {
    "id": 396,
    "code": "#1202100",
    "name": "MRW Las Mercedes Del Llano",
    "state": "Guárico",
    "city": "Las Mercedes del Llano",
    "address": "CALLE DOÑA BÁRBARA. CENTRO COMERCIAL MERCEDES PLAZA, PB, LOCAL 5A. LAS MERCEDES DEL LLANO - EDO GUÁRICO.",
    "lat": "9.11248425306575",
    "lng": "-66.39564912637208",
    "municipality": "Las Mercedes"
  }
];

/**
 * Returns distinct Venezuelan municipalities for a specific state, sorted alphabetically
 */
export function getMRWMunicipalitiesForState(state: string): string[] {
  if (!state) return [];
  const stateNorm = state.toLowerCase().trim();
  const set = new Set<string>();

  MRW_AGENCIES_DATABASE.forEach((agency) => {
    const s = agency.state.toLowerCase();
    if (
      s === stateNorm ||
      (stateNorm.includes('distrito capital') && s.includes('distrito capital'))
    ) {
      if (agency.municipality) {
        set.add(agency.municipality.trim());
      }
    }
  });

  return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
}

/**
 * Returns distinct Venezuelan cities / towns for a specific state, optionally filtered by municipality
 */
export function getMRWCitiesForState(state: string, municipality?: string): string[] {
  if (!state) return [];
  const stateNorm = state.toLowerCase().trim();
  const munNorm = municipality ? municipality.toLowerCase().trim() : '';
  const set = new Set<string>();

  MRW_AGENCIES_DATABASE.forEach((agency) => {
    const s = agency.state.toLowerCase();
    const matchState =
      s === stateNorm ||
      (stateNorm.includes('distrito capital') && s.includes('distrito capital'));

    if (matchState) {
      if (munNorm) {
        if (agency.municipality.toLowerCase() === munNorm) {
          set.add(agency.city);
        }
      } else {
        set.add(agency.city);
      }
    }
  });

  return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
}

/**
 * Returns agencies filtered by state, municipality, and/or city
 */
export function getMRWAgenciesByStateAndCity(
  state: string,
  city?: string,
  municipality?: string
): MRWAgency[] {
  if (!state) return [];
  const stateNorm = state.toLowerCase().trim();
  const cityNorm = city ? city.toLowerCase().trim() : '';
  const munNorm = municipality ? municipality.toLowerCase().trim() : '';

  return MRW_AGENCIES_DATABASE.filter((agency) => {
    const s = agency.state.toLowerCase();
    const matchesState =
      s === stateNorm ||
      (stateNorm.includes('distrito capital') && s.includes('distrito capital'));

    if (!matchesState) return false;
    if (munNorm && agency.municipality.toLowerCase() !== munNorm) return false;
    if (!cityNorm) return true;
    return agency.city.toLowerCase() === cityNorm || agency.city.toLowerCase().includes(cityNorm);
  });
}

/**
 * Calculate distance in km between two GPS coordinates using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface MRWAgencyWithDistance extends MRWAgency {
  distanceKm: number;
}

/**
 * Returns the closest MRW agencies to the user GPS coordinates, ordered by proximity
 */
export function getClosestMRWAgencies(
  userLat: number,
  userLng: number,
  limit: number = 10
): MRWAgencyWithDistance[] {
  const list: MRWAgencyWithDistance[] = [];

  for (const agency of MRW_AGENCIES_DATABASE) {
    if (agency.lat && agency.lng) {
      const aLat = parseFloat(agency.lat);
      const aLng = parseFloat(agency.lng);
      if (!isNaN(aLat) && !isNaN(aLng)) {
        const dist = calculateDistanceKm(userLat, userLng, aLat, aLng);
        list.push({ ...agency, distanceKm: dist });
      }
    }
  }

  return list.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit);
}

/**
 * Filter agencies by state, municipality, city, and text search query
 */
export function searchMRWAgencies(
  query: string = '',
  stateFilter: string = '',
  municipalityFilter: string = '',
  cityFilter: string = ''
): MRWAgency[] {
  let list = MRW_AGENCIES_DATABASE;

  if (stateFilter && stateFilter.trim()) {
    const sNorm = stateFilter.trim().toLowerCase();
    list = list.filter((a) => a.state.toLowerCase() === sNorm);
  }

  if (municipalityFilter && municipalityFilter.trim()) {
    const mNorm = municipalityFilter.trim().toLowerCase();
    list = list.filter((a) => a.municipality.toLowerCase() === mNorm);
  }

  if (cityFilter && cityFilter.trim()) {
    const cNorm = cityFilter.trim().toLowerCase();
    list = list.filter(
      (a) =>
        a.city.toLowerCase().includes(cNorm) ||
        cNorm.includes(a.city.toLowerCase())
    );
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(
      (a) =>
        a.code.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.municipality.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q) ||
        a.state.toLowerCase().includes(q)
    );
  }

  return list;
}
