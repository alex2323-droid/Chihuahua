/**
 * Base de datos oficial de Venezuela con división estricta y separada de:
 * 1. Estado
 * 2. Municipio
 * 3. Ciudades / Localidades / Sectores
 */

export interface MunicipalityInfo {
  name: string;
  cities: string[];
}

export interface VenezuelaStateInfo {
  state: string;
  municipalities: MunicipalityInfo[];
}

export const VENEZUELA_TERRITORY: Record<string, MunicipalityInfo[]> = {
  "Distrito Capital (Caracas)": [
    {
      "name": "Libertador",
      "cities": [
        "Caracas (Centro)",
        "Catia",
        "Propatria",
        "El Paraíso",
        "San Martín",
        "La Candelaria",
        "San Bernardino",
        "El Recreo / Sabana Grande",
        "El Valle",
        "Coche",
        "Caricuao",
        "Antímano",
        "La Pastora",
        "Altagracia",
        "Montalbán",
        "Los Chaguaramos"
      ]
    }
  ],
  "Anzoátegui": [
    {
      "name": "Simón Bolívar",
      "cities": [
        "Barcelona",
        "Naricual",
        "Nueva Barcelona",
        "Mesones"
      ]
    },
    {
      "name": "Juan Antonio Sotillo",
      "cities": [
        "Puerto La Cruz",
        "Pozuelos"
      ]
    },
    {
      "name": "Diego Bautista Urbaneja",
      "cities": [
        "Lechería",
        "El Morro",
        "Las Garzas"
      ]
    },
    {
      "name": "Guanta",
      "cities": [
        "Guanta",
        "Pertigalete"
      ]
    },
    {
      "name": "Anaco",
      "cities": [
        "Anaco",
        "San Joaquín"
      ]
    },
    {
      "name": "Simón Rodríguez",
      "cities": [
        "El Tigre"
      ]
    },
    {
      "name": "Guanipa",
      "cities": [
        "San José de Guanipa (El Tigrito)"
      ]
    },
    {
      "name": "Pedro María Freites",
      "cities": [
        "Cantaura",
        "Mundo Nuevo"
      ]
    },
    {
      "name": "Francisco de Miranda",
      "cities": [
        "Pariaguán",
        "El Pao de Barcelona"
      ]
    },
    {
      "name": "Fernando de Peñalver",
      "cities": [
        "Puerto Píritu",
        "San Miguel"
      ]
    },
    {
      "name": "Píritu",
      "cities": [
        "Píritu"
      ]
    },
    {
      "name": "Manuel Ezequiel Bruzual",
      "cities": [
        "Clarines",
        "Guanape"
      ]
    },
    {
      "name": "Aragua",
      "cities": [
        "Aragua de Barcelona"
      ]
    },
    {
      "name": "Independencia",
      "cities": [
        "Soledad"
      ]
    },
    {
      "name": "San Juan de Capistrano",
      "cities": [
        "Boca de Uchire"
      ]
    },
    {
      "name": "Francisco del Carmen Carvajal",
      "cities": [
        "Valle de Guanape"
      ]
    },
    {
      "name": "Santa Ana",
      "cities": [
        "Santa Ana"
      ]
    },
    {
      "name": "José Gregorio Monagas",
      "cities": [
        "Mapire",
        "Zuata"
      ]
    },
    {
      "name": "Libertad",
      "cities": [
        "San Mateo"
      ]
    },
    {
      "name": "Juan Manuel Cajigal",
      "cities": [
        "Onoto"
      ]
    },
    {
      "name": "Sir Arthur Mc Gregor",
      "cities": [
        "El Chaparro"
      ]
    }
  ],
  "Aragua": [
    {
      "name": "Girardot",
      "cities": [
        "Maracay",
        "Choroní",
        "Base Aragua",
        "La Coromoto",
        "San Jacinto"
      ]
    },
    {
      "name": "Santiago Mariño",
      "cities": [
        "Turmero",
        "Samán de Güere",
        "Guanarito"
      ]
    },
    {
      "name": "José Félix Ribas",
      "cities": [
        "La Victoria",
        "Castor Nieves Ríos",
        "Zuata"
      ]
    },
    {
      "name": "Sucre",
      "cities": [
        "Cagua",
        "Bella Vista"
      ]
    },
    {
      "name": "Mario Briceño Iragorry",
      "cities": [
        "El Limón",
        "Caña de Azúcar"
      ]
    },
    {
      "name": "Libertador",
      "cities": [
        "Palo Negro",
        "La Pica"
      ]
    },
    {
      "name": "José Ángel Lamas",
      "cities": [
        "Santa Cruz de Aragua"
      ]
    },
    {
      "name": "Zamora",
      "cities": [
        "Villa de Cura",
        "Magdaleno",
        "San Francisco de Asís"
      ]
    },
    {
      "name": "Bolívar",
      "cities": [
        "San Mateo"
      ]
    },
    {
      "name": "Francisco Linares Alcántara",
      "cities": [
        "Santa Rita",
        "Paraparal"
      ]
    },
    {
      "name": "Santos Michelena",
      "cities": [
        "Las Tejerías"
      ]
    },
    {
      "name": "San Sebastián",
      "cities": [
        "San Sebastián de los Reyes"
      ]
    },
    {
      "name": "San Casimiro",
      "cities": [
        "San Casimiro"
      ]
    },
    {
      "name": "Tovar",
      "cities": [
        "Colonia Tovar"
      ]
    },
    {
      "name": "Ocumare de la Costa de Oro",
      "cities": [
        "Ocumare de la Costa",
        "Cata",
        "Cuyagua"
      ]
    },
    {
      "name": "Camatagua",
      "cities": [
        "Camatagua",
        "Carmen de Cura"
      ]
    },
    {
      "name": "Urdaneta",
      "cities": [
        "Barbacoas",
        "Las Peñitas"
      ]
    }
  ],
  "Barinas": [
    {
      "name": "Barinas",
      "cities": [
        "Barinas",
        "Alto Barinas",
        "Corazón de Jesús"
      ]
    },
    {
      "name": "Bolívar",
      "cities": [
        "Barinitas",
        "Altamira de Cáceres"
      ]
    },
    {
      "name": "Antonio José de Sucre",
      "cities": [
        "Socopó",
        "Ticoporo"
      ]
    },
    {
      "name": "Alberto Arvelo Torrealba",
      "cities": [
        "Sabaneta",
        "Rodríguez Domínguez"
      ]
    },
    {
      "name": "Pedraza",
      "cities": [
        "Ciudad Bolivia",
        "José Félix Ribas"
      ]
    },
    {
      "name": "Ezequiel Zamora",
      "cities": [
        "Santa Bárbara",
        "Pedro Briceño Méndez"
      ]
    },
    {
      "name": "Cruz Paredes",
      "cities": [
        "Barrancas",
        "El Socorro"
      ]
    },
    {
      "name": "Obispos",
      "cities": [
        "Obispos",
        "Los Guasimitos"
      ]
    },
    {
      "name": "Rojas",
      "cities": [
        "Libertad",
        "Dolores"
      ]
    },
    {
      "name": "Arismendi",
      "cities": [
        "Arismendi",
        "San Antonio"
      ]
    },
    {
      "name": "Sosa",
      "cities": [
        "Ciudad de Nutrias",
        "Puerto Nutrias"
      ]
    },
    {
      "name": "Andrés Eloy Blanco",
      "cities": [
        "El Cantón",
        "Santa Cruz de Guacas"
      ]
    }
  ],
  "Bolívar": [
    {
      "name": "Caroní",
      "cities": [
        "Puerto Ordaz",
        "San Félix",
        "Unare",
        "Alta Vista",
        "Castillito"
      ]
    },
    {
      "name": "Angostura del Orinoco",
      "cities": [
        "Ciudad Bolívar",
        "Agua Salada",
        "La Sabanita"
      ]
    },
    {
      "name": "Piar",
      "cities": [
        "Upata",
        "El Manteco",
        "El Pao"
      ]
    },
    {
      "name": "Cedeño",
      "cities": [
        "Caicara del Orinoco",
        "Altagracia"
      ]
    },
    {
      "name": "Sifontes",
      "cities": [
        "Tumeremo",
        "El Dorado",
        "Las Claritas"
      ]
    },
    {
      "name": "Roscio",
      "cities": [
        "Guasipati",
        "Salóm"
      ]
    },
    {
      "name": "El Callao",
      "cities": [
        "El Callao"
      ]
    },
    {
      "name": "Gran Sabana",
      "cities": [
        "Santa Elena de Uairén",
        "Ikabarú"
      ]
    },
    {
      "name": "Angostura",
      "cities": [
        "Ciudad Piar",
        "Raúl Leoni"
      ]
    },
    {
      "name": "Sucre",
      "cities": [
        "Maripa",
        "Guarataro"
      ]
    },
    {
      "name": "Padre Pedro Chien",
      "cities": [
        "El Palmar"
      ]
    }
  ],
  "Carabobo": [
    {
      "name": "Valencia",
      "cities": [
        "Valencia",
        "El Trigal",
        "La Isabelica",
        "Flor Amarillo",
        "El Parral",
        "Los Guajiros",
        "San José",
        "Prebo",
        "El Bosque"
      ]
    },
    {
      "name": "Naguanagua",
      "cities": [
        "Naguanagua",
        "La Granja",
        "Tazajal",
        "Las Quintas",
        "Carialinda"
      ]
    },
    {
      "name": "San Diego",
      "cities": [
        "San Diego",
        "La Esmeralda",
        "Castillito",
        "El Morro",
        "Paso Real"
      ]
    },
    {
      "name": "Guacara",
      "cities": [
        "Guacara",
        "Ciudad Alianza",
        "Yagua",
        "Cardonal"
      ]
    },
    {
      "name": "Los Guayos",
      "cities": [
        "Los Guayos",
        "Paraparal",
        "Las Agüitas"
      ]
    },
    {
      "name": "Puerto Cabello",
      "cities": [
        "Puerto Cabello",
        "Rancho Grande",
        "San Esteban",
        "Borburata",
        "Patarata"
      ]
    },
    {
      "name": "Diego Ibarra",
      "cities": [
        "Mariara",
        "Aguas Calientes"
      ]
    },
    {
      "name": "Libertador",
      "cities": [
        "Tocuyito",
        "Campo Carabobo"
      ]
    },
    {
      "name": "Juan José Mora",
      "cities": [
        "Morón",
        "Palma Sola"
      ]
    },
    {
      "name": "San Joaquín",
      "cities": [
        "San Joaquín"
      ]
    },
    {
      "name": "Bejuma",
      "cities": [
        "Bejuma",
        "Canoabo"
      ]
    },
    {
      "name": "Montalbán",
      "cities": [
        "Montalbán"
      ]
    },
    {
      "name": "Miranda",
      "cities": [
        "Miranda"
      ]
    },
    {
      "name": "Carlos Arvelo",
      "cities": [
        "Güigüe",
        "Belén",
        "Central Tacarigua"
      ]
    }
  ],
  "Cojedes": [
    {
      "name": "San Carlos",
      "cities": [
        "San Carlos",
        "Manuel Manrique"
      ]
    },
    {
      "name": "Tinaquillo",
      "cities": [
        "Tinaquillo"
      ]
    },
    {
      "name": "Tinaco",
      "cities": [
        "Tinaco",
        "General en Jefe José Laurencio Silva"
      ]
    },
    {
      "name": "Girardot",
      "cities": [
        "El Baúl",
        "Sucre"
      ]
    },
    {
      "name": "Lima Blanco",
      "cities": [
        "Macapo",
        "La Aguadita"
      ]
    },
    {
      "name": "Pao de San Juan Bautista",
      "cities": [
        "El Pao"
      ]
    },
    {
      "name": "Rómulo Gallegos",
      "cities": [
        "Las Vegas"
      ]
    },
    {
      "name": "Ricaurte",
      "cities": [
        "Libertad",
        "El Amparo"
      ]
    },
    {
      "name": "Anzoátegui",
      "cities": [
        "Cojedito"
      ]
    }
  ],
  "Delta Amacuro": [
    {
      "name": "Tucupita",
      "cities": [
        "Tucupita",
        "San José",
        "Virgen del Valle"
      ]
    },
    {
      "name": "Pedernales",
      "cities": [
        "Pedernales",
        "Capure"
      ]
    },
    {
      "name": "Casacoima",
      "cities": [
        "Sierra Imataca",
        "Piacoa"
      ]
    },
    {
      "name": "Antonio Díaz",
      "cities": [
        "Curiapo",
        "Santos de Abelgas"
      ]
    }
  ],
  "Falcón": [
    {
      "name": "Miranda",
      "cities": [
        "Santa Ana de Coro",
        "San Antonio",
        "Sabaneta"
      ]
    },
    {
      "name": "Carirubana",
      "cities": [
        "Punto Fijo",
        "Puerta Maraven",
        "Norte",
        "Carirubana",
        "Punta Cardón"
      ]
    },
    {
      "name": "Los Taques",
      "cities": [
        "Los Taques",
        "Judibana"
      ]
    },
    {
      "name": "Dabajuro",
      "cities": [
        "Dabajuro"
      ]
    },
    {
      "name": "Monseñor Iturriza",
      "cities": [
        "Chichiriviche",
        "Tocuyo de la Costa",
        "Boca de Tocuyo"
      ]
    },
    {
      "name": "José Laurencio Silva",
      "cities": [
        "Tucacas",
        "Boca de Aroa"
      ]
    },
    {
      "name": "Zamora",
      "cities": [
        "Puerto Cumarebo",
        "La Ciénaga"
      ]
    },
    {
      "name": "Mauroa",
      "cities": [
        "Mene de Mauroa",
        "San Félix"
      ]
    },
    {
      "name": "Federación",
      "cities": [
        "Churuguara",
        "Agua Larga"
      ]
    },
    {
      "name": "Colina",
      "cities": [
        "La Vela de Coro",
        "Las Calderas"
      ]
    },
    {
      "name": "Falcón",
      "cities": [
        "Pueblo Nuevo",
        "Adícora",
        "Jadacaquiva"
      ]
    },
    {
      "name": "Buchivacoa",
      "cities": [
        "Capatárida",
        "Bariro"
      ]
    },
    {
      "name": "Democracia",
      "cities": [
        "Pedregal",
        "Agua Clara"
      ]
    },
    {
      "name": "Bolívar",
      "cities": [
        "San Luis",
        "Aracua"
      ]
    },
    {
      "name": "San Francisco",
      "cities": [
        "Mirimire"
      ]
    },
    {
      "name": "Píritu",
      "cities": [
        "Píritu",
        "San José de la Costa"
      ]
    },
    {
      "name": "Cacique Manaure",
      "cities": [
        "Yaracal"
      ]
    },
    {
      "name": "Unión",
      "cities": [
        "Santa Cruz de Bucaral"
      ]
    },
    {
      "name": "Petit",
      "cities": [
        "Cabure",
        "Colina"
      ]
    },
    {
      "name": "Acosta",
      "cities": [
        "San Juan de los Cayos",
        "Capadare"
      ]
    }
  ],
  "Guárico": [
    {
      "name": "Juan Germán Roscio",
      "cities": [
        "San Juan de los Morros",
        "Cantagallo",
        "Parapara"
      ]
    },
    {
      "name": "Francisco de Miranda",
      "cities": [
        "Calabozo",
        "El Calvario",
        "El Rastro"
      ]
    },
    {
      "name": "Leonardo Infante",
      "cities": [
        "Valle de la Pascua",
        "Espino"
      ]
    },
    {
      "name": "Pedro Zaraza",
      "cities": [
        "Zaraza",
        "San José de Unare"
      ]
    },
    {
      "name": "José Tadeo Monagas",
      "cities": [
        "Altagracia de Orituco",
        "San Rafael de Orituco",
        "Paso Real de Macaira"
      ]
    },
    {
      "name": "José Félix Ribas",
      "cities": [
        "Tucupido",
        "San Rafael de Laya"
      ]
    },
    {
      "name": "Julián Mellado",
      "cities": [
        "El Sombrero",
        "Sosa"
      ]
    },
    {
      "name": "Las Mercedes",
      "cities": [
        "Las Mercedes del Llano",
        "Santa Rita de Manapire"
      ]
    },
    {
      "name": "Santa María de Ipire",
      "cities": [
        "Santa María de Ipire",
        "Altamira"
      ]
    },
    {
      "name": "Chaguaramas",
      "cities": [
        "Chaguaramas"
      ]
    },
    {
      "name": "San José de Guaribe",
      "cities": [
        "San José de Guaribe"
      ]
    },
    {
      "name": "Esteros de Camaguán",
      "cities": [
        "Camaguán",
        "Puerto Miranda"
      ]
    },
    {
      "name": "San Jerónimo de Guayabal",
      "cities": [
        "Guayabal",
        "Cazorla"
      ]
    },
    {
      "name": "El Socorro",
      "cities": [
        "El Socorro"
      ]
    },
    {
      "name": "Ortiz",
      "cities": [
        "Ortiz",
        "San José Tiznados"
      ]
    }
  ],
  "Lara": [
    {
      "name": "Iribarren",
      "cities": [
        "Barquisimeto",
        "Tamaca",
        "El Cují",
        "Santa Rosa",
        "Unión",
        "Concepción",
        "Catedral"
      ]
    },
    {
      "name": "Palavecino",
      "cities": [
        "Cabudare",
        "Los Rastrojos",
        "Agua Viva"
      ]
    },
    {
      "name": "Torres",
      "cities": [
        "Carora",
        "Atarigua",
        "El Blanco"
      ]
    },
    {
      "name": "Morán",
      "cities": [
        "El Tocuyo",
        "Guárico",
        "Anzoátegui"
      ]
    },
    {
      "name": "Jiménez",
      "cities": [
        "Quíbor",
        "Cubiro",
        "San Miguel"
      ]
    },
    {
      "name": "Crespo",
      "cities": [
        "Duaca",
        "Freitez"
      ]
    },
    {
      "name": "Andrés Eloy Blanco",
      "cities": [
        "Sanare",
        "Pio Tamayo"
      ]
    },
    {
      "name": "Urdaneta",
      "cities": [
        "Siquisique",
        "San Miguel"
      ]
    },
    {
      "name": "Simón Planas",
      "cities": [
        "Sarare",
        "La Miel",
        "Buría"
      ]
    }
  ],
  "Mérida": [
    {
      "name": "Libertador",
      "cities": [
        "Mérida",
        "El Llano",
        "Milla",
        "Arias",
        "Domingo Peña",
        "Osuna Rodríguez"
      ]
    },
    {
      "name": "Alberto Adriani",
      "cities": [
        "El Vigía",
        "Presidente Betancourt",
        "Gabriel Picón González"
      ]
    },
    {
      "name": "Campo Elías",
      "cities": [
        "Ejido",
        "Montalbán",
        "Matriz",
        "La Mesa"
      ]
    },
    {
      "name": "Tovar",
      "cities": [
        "Tovar",
        "El Llano",
        "San Francisco"
      ]
    },
    {
      "name": "Sucre",
      "cities": [
        "Lagunillas",
        "Chiguará",
        "San Juan"
      ]
    },
    {
      "name": "Rivas Dávila",
      "cities": [
        "Bailadores",
        "Gerónimo Maldonado"
      ]
    },
    {
      "name": "Rangel",
      "cities": [
        "Mucuchíes",
        "Cacute",
        "San Rafael"
      ]
    },
    {
      "name": "Antonio Pinto Salinas",
      "cities": [
        "Santa Cruz de Mora",
        "Mesa Bolívar"
      ]
    },
    {
      "name": "Miranda",
      "cities": [
        "Timotes",
        "Andrés Eloy Blanco"
      ]
    },
    {
      "name": "Santos Marquina",
      "cities": [
        "Tabay"
      ]
    },
    {
      "name": "Tulio Febres Cordero",
      "cities": [
        "Nueva Bolivia",
        "Independencia"
      ]
    },
    {
      "name": "Caracciolo Parra Olmedo",
      "cities": [
        "Tucaní",
        "Florencio Ramírez"
      ]
    },
    {
      "name": "Zea",
      "cities": [
        "Zea",
        "Caño El Tigre"
      ]
    },
    {
      "name": "Arzobispo Chacón",
      "cities": [
        "Canaguá",
        "Mucutuy",
        "Mucuchachí"
      ]
    },
    {
      "name": "Cardenal Quintero",
      "cities": [
        "Santo Domingo",
        "Las Piedras"
      ]
    },
    {
      "name": "Padre Noguera",
      "cities": [
        "Santa María de Caparo"
      ]
    },
    {
      "name": "Aricagua",
      "cities": [
        "Aricagua",
        "San Antonio"
      ]
    },
    {
      "name": "Justo Briceño",
      "cities": [
        "Torondoy",
        "San Cristóbal de Torondoy"
      ]
    }
  ],
  "Miranda": [
    {
      "name": "Chacao",
      "cities": [
        "Chacao",
        "Altamira",
        "Los Palos Grandes",
        "Bello Campo",
        "El Rosal"
      ]
    },
    {
      "name": "Baruta",
      "cities": [
        "Baruta",
        "Las Mercedes",
        "El Cafetal",
        "La Trinidad",
        "Cumbres de Curumo",
        "Prados del Este",
        "Santa Fe",
        "Santa Inés"
      ]
    },
    {
      "name": "Sucre",
      "cities": [
        "Petare",
        "La California",
        "Los Ruices",
        "Los Cortijos",
        "Boleíta",
        "Palo Verde",
        "Macaracuay",
        "El Marqués"
      ]
    },
    {
      "name": "El Hatillo",
      "cities": [
        "El Hatillo",
        "La Lagunita",
        "El Encantado",
        "Oripoto"
      ]
    },
    {
      "name": "Guaicaipuro",
      "cities": [
        "Los Teques",
        "San Pedro de los Altos",
        "Cecilio Acosta",
        "El Jarillo"
      ]
    },
    {
      "name": "Los Salias",
      "cities": [
        "San Antonio de los Altos"
      ]
    },
    {
      "name": "Carrizal",
      "cities": [
        "Carrizal",
        "Corralito"
      ]
    },
    {
      "name": "Plaza",
      "cities": [
        "Guarenas",
        "Trapichito",
        "Nueva Casarapa"
      ]
    },
    {
      "name": "Zamora",
      "cities": [
        "Guatire",
        "Castillejo",
        "Araira"
      ]
    },
    {
      "name": "Cristóbal Rojas",
      "cities": [
        "Charallave",
        "Las Brisas"
      ]
    },
    {
      "name": "Urdaneta",
      "cities": [
        "Cúa",
        "Nueva Cúa"
      ]
    },
    {
      "name": "Tomás Lander",
      "cities": [
        "Ocumare del Tuy",
        "Santa Bárbara"
      ]
    },
    {
      "name": "Independencia",
      "cities": [
        "Santa Teresa del Tuy",
        "Cartanal"
      ]
    },
    {
      "name": "Paz Castillo",
      "cities": [
        "Santa Lucía"
      ]
    },
    {
      "name": "Simón Bolívar",
      "cities": [
        "San Francisco de Yare"
      ]
    },
    {
      "name": "Brión",
      "cities": [
        "Higuerote",
        "Carenero",
        "Curiepe"
      ]
    },
    {
      "name": "Páez",
      "cities": [
        "Río Chico",
        "Tacarigua de la Laguna",
        "El Guapo"
      ]
    },
    {
      "name": "Acevedo",
      "cities": [
        "Caucagua",
        "Capaya",
        "Panaquire"
      ]
    },
    {
      "name": "Andrés Bello",
      "cities": [
        "San José de Barlovento"
      ]
    },
    {
      "name": "Pedro Gual",
      "cities": [
        "Cúpira"
      ]
    },
    {
      "name": "Buroz",
      "cities": [
        "Mamporal"
      ]
    }
  ],
  "Monagas": [
    {
      "name": "Maturín",
      "cities": [
        "Maturín",
        "Tipuro",
        "Los Cortijos",
        "San Simón",
        "Alto de Los Godos",
        "Boquerón"
      ]
    },
    {
      "name": "Ezequiel Zamora",
      "cities": [
        "Punta de Mata",
        "El Tejero"
      ]
    },
    {
      "name": "Bolívar",
      "cities": [
        "Caripito"
      ]
    },
    {
      "name": "Caripe",
      "cities": [
        "Caripe",
        "Teresén"
      ]
    },
    {
      "name": "Cedeño",
      "cities": [
        "Caicara de Maturín",
        "Areo"
      ]
    },
    {
      "name": "Piar",
      "cities": [
        "Aragua de Maturín",
        "Aparicio"
      ]
    },
    {
      "name": "Libertador",
      "cities": [
        "Temblador",
        "Chaguaramas"
      ]
    },
    {
      "name": "Sotillo",
      "cities": [
        "Barrancas del Orinoco",
        "Los Barrancos de Fajardo"
      ]
    },
    {
      "name": "Punceres",
      "cities": [
        "Quiriquire",
        "Cachipo"
      ]
    },
    {
      "name": "Aguasay",
      "cities": [
        "Aguasay"
      ]
    },
    {
      "name": "Santa Bárbara",
      "cities": [
        "Santa Bárbara"
      ]
    },
    {
      "name": "Uracoa",
      "cities": [
        "Uracoa"
      ]
    }
  ],
  "Nueva Esparta (Margarita)": [
    {
      "name": "Mariño",
      "cities": [
        "Porlamar"
      ]
    },
    {
      "name": "Maneiro",
      "cities": [
        "Pampatar",
        "Los Robles"
      ]
    },
    {
      "name": "Marcano",
      "cities": [
        "Juan Griego",
        "Pedregales"
      ]
    },
    {
      "name": "Arismendi",
      "cities": [
        "La Asunción"
      ]
    },
    {
      "name": "Gómez",
      "cities": [
        "Santa Ana",
        "El Cercado",
        "Altagracia"
      ]
    },
    {
      "name": "Tubores",
      "cities": [
        "Punta de Piedras",
        "Los Gómez"
      ]
    },
    {
      "name": "Díaz",
      "cities": [
        "San Juan Bautista",
        "El Yaque",
        "Zabala"
      ]
    },
    {
      "name": "García",
      "cities": [
        "El Valle del Espíritu Santo",
        "Villa Rosa"
      ]
    },
    {
      "name": "Península de Macanao",
      "cities": [
        "Boca de Río",
        "San Francisco"
      ]
    },
    {
      "name": "Antolín del Campo",
      "cities": [
        "La Plaza de Paraguachí",
        "Playa El Agua",
        "El Tirano"
      ]
    },
    {
      "name": "Villalba",
      "cities": [
        "San Pedro de Coche"
      ]
    }
  ],
  "Portuguesa": [
    {
      "name": "Páez",
      "cities": [
        "Acarigua",
        "Payara",
        "Pimpinela"
      ]
    },
    {
      "name": "Araure",
      "cities": [
        "Araure",
        "Río Acarigua"
      ]
    },
    {
      "name": "Guanare",
      "cities": [
        "Guanare",
        "San Juan de Guanaguanare",
        "Virgen de Coromoto"
      ]
    },
    {
      "name": "Turén",
      "cities": [
        "Villa Bruzual (Turén)",
        "Canelones"
      ]
    },
    {
      "name": "Sucre",
      "cities": [
        "Biscucuy",
        "San José de Saguaz"
      ]
    },
    {
      "name": "Ospino",
      "cities": [
        "Ospino",
        "Aparición"
      ]
    },
    {
      "name": "Esteller",
      "cities": [
        "Píritu",
        "Uveral"
      ]
    },
    {
      "name": "Guanarito",
      "cities": [
        "Guanarito",
        "Trinidad de la Capilla"
      ]
    },
    {
      "name": "Papelón",
      "cities": [
        "Papelón",
        "Caño Delgadito"
      ]
    },
    {
      "name": "San Rafael de Onoto",
      "cities": [
        "San Rafael de Onoto",
        "Santa Fe"
      ]
    },
    {
      "name": "Monseñor José Vicente de Unda",
      "cities": [
        "Chabasquén",
        "Peña Blanca"
      ]
    },
    {
      "name": "San Genaro de Boconoíto",
      "cities": [
        "Boconoíto",
        "Antolín Tovar"
      ]
    },
    {
      "name": "Agua Blanca",
      "cities": [
        "Agua Blanca"
      ]
    },
    {
      "name": "Santa Rosalía",
      "cities": [
        "El Playón"
      ]
    }
  ],
  "Sucre": [
    {
      "name": "Sucre",
      "cities": [
        "Cumaná",
        "Santa Inés",
        "Valentín Valiente",
        "San Juan"
      ]
    },
    {
      "name": "Bermúdez",
      "cities": [
        "Carúpano",
        "Santa Rosa",
        "Bolívar",
        "Macarapana"
      ]
    },
    {
      "name": "Valdez",
      "cities": [
        "Güiria",
        "Bideau"
      ]
    },
    {
      "name": "Ribero",
      "cities": [
        "Cariaco",
        "Catuaro"
      ]
    },
    {
      "name": "Andrés Eloy Blanco",
      "cities": [
        "Casanay",
        "Mariño"
      ]
    },
    {
      "name": "Montes",
      "cities": [
        "Cumanacoa",
        "Arenas"
      ]
    },
    {
      "name": "Cruz Salmerón Acosta",
      "cities": [
        "Araya",
        "Chacopata",
        "Manicuare"
      ]
    },
    {
      "name": "Benítez",
      "cities": [
        "El Pilar",
        "El Rincón"
      ]
    },
    {
      "name": "Arismendi",
      "cities": [
        "Río Caribe",
        "San Juan de las Galdonas"
      ]
    },
    {
      "name": "Bolívar",
      "cities": [
        "Marigüitar"
      ]
    },
    {
      "name": "Mejía",
      "cities": [
        "San Antonio del Golfo"
      ]
    },
    {
      "name": "Mariño",
      "cities": [
        "Irapa",
        "Campo Claro"
      ]
    },
    {
      "name": "Cajigal",
      "cities": [
        "Yaguaraparo",
        "Libertad"
      ]
    },
    {
      "name": "Libertador",
      "cities": [
        "Tunapuy",
        "Campo Elías"
      ]
    }
  ],
  "Táchira": [
    {
      "name": "San Cristóbal",
      "cities": [
        "San Cristóbal",
        "La Concordia",
        "Pirineos",
        "Pueblo Nuevo",
        "San Juan Bautista"
      ]
    },
    {
      "name": "Cárdenas",
      "cities": [
        "Táriba",
        "Las Vegas",
        "Barrancas"
      ]
    },
    {
      "name": "Bolívar",
      "cities": [
        "San Antonio del Táchira",
        "Palotal"
      ]
    },
    {
      "name": "Pedro María Ureña",
      "cities": [
        "Ureña",
        "Nueva Arcadia"
      ]
    },
    {
      "name": "Junín",
      "cities": [
        "Rubio",
        "Bramón"
      ]
    },
    {
      "name": "Jáuregui",
      "cities": [
        "La Grita",
        "Emilio Constantino Guerrero"
      ]
    },
    {
      "name": "Panamericano",
      "cities": [
        "Coloncito",
        "La Palmita"
      ]
    },
    {
      "name": "García de Hevia",
      "cities": [
        "La Fría",
        "Boca de Gamelotal"
      ]
    },
    {
      "name": "Ayacucho",
      "cities": [
        "San Juan de Colón",
        "San Pedro del Río"
      ]
    },
    {
      "name": "Guásimos",
      "cities": [
        "Palmira"
      ]
    },
    {
      "name": "Independencia",
      "cities": [
        "Capacho Nuevo"
      ]
    },
    {
      "name": "Libertad",
      "cities": [
        "Capacho Viejo"
      ]
    },
    {
      "name": "Michelena",
      "cities": [
        "Michelena"
      ]
    },
    {
      "name": "Andrés Bello",
      "cities": [
        "Cordero"
      ]
    },
    {
      "name": "Fernández Feo",
      "cities": [
        "El Piñal",
        "San Rafael del Piñal"
      ]
    },
    {
      "name": "Córdoba",
      "cities": [
        "Santa Ana del Táchira"
      ]
    },
    {
      "name": "Seboruco",
      "cities": [
        "Seboruco"
      ]
    },
    {
      "name": "Libertador",
      "cities": [
        "Abejales",
        "Doradas"
      ]
    },
    {
      "name": "Lobatera",
      "cities": [
        "Lobatera",
        "Borotá"
      ]
    },
    {
      "name": "San Judas Tadeo",
      "cities": [
        "Umuquena"
      ]
    }
  ],
  "Trujillo": [
    {
      "name": "Valera",
      "cities": [
        "Valera",
        "La Beatriz",
        "San Luis",
        "Mendoza Fría"
      ]
    },
    {
      "name": "Trujillo",
      "cities": [
        "Trujillo",
        "Monseñor Carrillo",
        "Cruz Carrillo"
      ]
    },
    {
      "name": "Boconó",
      "cities": [
        "Boconó",
        "El Carmen",
        "Mosquey",
        "San Miguel"
      ]
    },
    {
      "name": "Sucre",
      "cities": [
        "Sabana de Mendoza",
        "Valmore Rodríguez"
      ]
    },
    {
      "name": "Rafael Rangel",
      "cities": [
        "Betijoque",
        "La Pueblita"
      ]
    },
    {
      "name": "Carache",
      "cities": [
        "Carache",
        "La Concepción"
      ]
    },
    {
      "name": "Pampán",
      "cities": [
        "Pampán",
        "Flor de Patria"
      ]
    },
    {
      "name": "Pampanito",
      "cities": [
        "Pampanito"
      ]
    },
    {
      "name": "Candelaria",
      "cities": [
        "Chejendé",
        "Monay"
      ]
    },
    {
      "name": "Escuque",
      "cities": [
        "Escuque",
        "Sabana Libre"
      ]
    },
    {
      "name": "San Rafael de Carvajal",
      "cities": [
        "Carvajal",
        "Campo Alegre"
      ]
    },
    {
      "name": "La Ceiba",
      "cities": [
        "Santa Apolonia",
        "La Ceiba"
      ]
    },
    {
      "name": "Motatán",
      "cities": [
        "Motatán",
        "El Baño"
      ]
    },
    {
      "name": "Monte Carmelo",
      "cities": [
        "Monte Carmelo"
      ]
    },
    {
      "name": "Santa Ana",
      "cities": [
        "Santa Ana"
      ]
    },
    {
      "name": "Campo Elías",
      "cities": [
        "Campo Elías"
      ]
    },
    {
      "name": "Urdaneta",
      "cities": [
        "La Quebrada",
        "Jajó"
      ]
    }
  ],
  "La Guaira (Vargas)": [
    {
      "name": "Vargas",
      "cities": [
        "Maiquetía",
        "Catia La Mar",
        "La Guaira (Centro)",
        "Caraballeda",
        "Macuto",
        "Naiguatá",
        "Carayaca",
        "Camurí Grande",
        "Los Caracas",
        "El Junko"
      ]
    }
  ],
  "Yaracuy": [
    {
      "name": "San Felipe",
      "cities": [
        "San Felipe",
        "Marín",
        "Albarico"
      ]
    },
    {
      "name": "Peña",
      "cities": [
        "Yaritagua",
        "San Andrés"
      ]
    },
    {
      "name": "Bruzual",
      "cities": [
        "Chivacoa",
        "Campo Elías"
      ]
    },
    {
      "name": "Nirgua",
      "cities": [
        "Nirgua",
        "Salóm",
        "Temerla"
      ]
    },
    {
      "name": "Cocorote",
      "cities": [
        "Cocorote"
      ]
    },
    {
      "name": "Sucre",
      "cities": [
        "Guama"
      ]
    },
    {
      "name": "Bolívar",
      "cities": [
        "Aroa"
      ]
    },
    {
      "name": "Trinidad",
      "cities": [
        "Boraure"
      ]
    },
    {
      "name": "Arístides Bastidas",
      "cities": [
        "San Pablo"
      ]
    },
    {
      "name": "Urachiche",
      "cities": [
        "Urachiche"
      ]
    },
    {
      "name": "Veroes",
      "cities": [
        "Farriar",
        "El Guayabo"
      ]
    },
    {
      "name": "José Antonio Páez",
      "cities": [
        "Sabana de Parra"
      ]
    },
    {
      "name": "La Manuelita",
      "cities": [
        "Manuel Monge"
      ]
    }
  ],
  "Zulia": [
    {
      "name": "Maracaibo",
      "cities": [
        "Maracaibo",
        "La Limpia",
        "Bella Vista",
        "5 de Julio",
        "Delicias",
        "El Milagro",
        "La Victoria",
        "Indio Mara"
      ]
    },
    {
      "name": "San Francisco",
      "cities": [
        "San Francisco",
        "La Coromoto",
        "El Bajo",
        "Sierra Maestra",
        "Domitila Flores"
      ]
    },
    {
      "name": "Cabimas",
      "cities": [
        "Cabimas",
        "Ambrosio",
        "La Rosa",
        "Germán Ríos Linares"
      ]
    },
    {
      "name": "Lagunillas",
      "cities": [
        "Ciudad Ojeda",
        "Alonso de Ojeda",
        "Campo Lara"
      ]
    },
    {
      "name": "Santa Rita",
      "cities": [
        "Santa Rita",
        "El Mene"
      ]
    },
    {
      "name": "Machiques de Perijá",
      "cities": [
        "Machiques",
        "San José",
        "Río Negro"
      ]
    },
    {
      "name": "Rosario de Perijá",
      "cities": [
        "La Villa del Rosario",
        "El Rosario"
      ]
    },
    {
      "name": "Valmore Rodríguez",
      "cities": [
        "Bachaquero"
      ]
    },
    {
      "name": "Baralt",
      "cities": [
        "Mene Grande",
        "San Timoteo",
        "Pueblo Nuevo"
      ]
    },
    {
      "name": "Miranda",
      "cities": [
        "Los Puertos de Altagracia",
        "Altagracia"
      ]
    },
    {
      "name": "Colón",
      "cities": [
        "Santa Bárbara del Zulia",
        "San Carlos del Zulia",
        "El Moralito"
      ]
    },
    {
      "name": "Sucre",
      "cities": [
        "Caja Seca",
        "Bobures"
      ]
    },
    {
      "name": "Jesús Enrique Lossada",
      "cities": [
        "La Concepción"
      ]
    },
    {
      "name": "Jesús María Semprún",
      "cities": [
        "Casigua El Cubo"
      ]
    },
    {
      "name": "Catatumbo",
      "cities": [
        "Encontrados"
      ]
    },
    {
      "name": "Guajira",
      "cities": [
        "Sinamaica",
        "Paraguaipoa"
      ]
    },
    {
      "name": "Francisco Javier Pulgar",
      "cities": [
        "El Chivo",
        "Pueblo Nuevo El Chivo"
      ]
    },
    {
      "name": "La Cañada de Urdaneta",
      "cities": [
        "Concepción",
        "Chiquinquirá"
      ]
    },
    {
      "name": "Simón Bolívar",
      "cities": [
        "Tía Juana"
      ]
    }
  ],
  "Apure": [
    {
      "name": "San Fernando",
      "cities": [
        "San Fernando de Apure",
        "El Recreo",
        "Peñalver"
      ]
    },
    {
      "name": "Páez",
      "cities": [
        "Guasdualito",
        "Aramendi",
        "El Amparo"
      ]
    },
    {
      "name": "Biruaca",
      "cities": [
        "Biruaca"
      ]
    },
    {
      "name": "Achaguas",
      "cities": [
        "Achaguas",
        "Apurito",
        "El Yagual"
      ]
    },
    {
      "name": "Rómulo Gallegos",
      "cities": [
        "Elorza",
        "La Trinidad"
      ]
    },
    {
      "name": "Muñoz",
      "cities": [
        "Mantecal",
        "Bruzual",
        "Quintero"
      ]
    },
    {
      "name": "Pedro Camejo",
      "cities": [
        "San Juan de Payara",
        "Cunaviche"
      ]
    }
  ],
  "Amazonas": [
    {
      "name": "Atures",
      "cities": [
        "Puerto Ayacucho",
        "Fernando Girón Tovar",
        "Parhueña"
      ]
    },
    {
      "name": "Atabapo",
      "cities": [
        "San Fernando de Atabapo"
      ]
    },
    {
      "name": "Maroa",
      "cities": [
        "Maroa",
        "Victorino"
      ]
    },
    {
      "name": "Río Negro",
      "cities": [
        "San Carlos de Río Negro",
        "Solano"
      ]
    },
    {
      "name": "Alto Orinoco",
      "cities": [
        "La Esmeralda"
      ]
    },
    {
      "name": "Autana",
      "cities": [
        "Isla Ratón"
      ]
    },
    {
      "name": "Manapiare",
      "cities": [
        "San Juan de Manapiare"
      ]
    }
  ]
};

/**
 * Normaliza nombres para búsquedas y comparaciones
 */
export function normalizeLocationName(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s*\([^)]*\)/g, "")
    .trim();
}

export const normalizeCityName = normalizeLocationName;

/**
 * Obtiene la lista de Municipios correspondientes a un Estado
 */
export function getMunicipalitiesForState(state: string): string[] {
  if (!state) return [];
  const stateNorm = state.trim().toLowerCase();

  for (const [st, munis] of Object.entries(VENEZUELA_TERRITORY)) {
    if (st.toLowerCase() === stateNorm || stateNorm.includes(st.toLowerCase()) || st.toLowerCase().includes(stateNorm)) {
      return munis.map((m) => m.name);
    }
  }

  return [];
}

/**
 * Obtiene las ciudades o localidades pertenecientes a un Municipio específico dentro de un Estado
 */
export function getCitiesForMunicipality(state: string, municipality: string): string[] {
  if (!state || !municipality) return [];
  const stateNorm = state.trim().toLowerCase();
  const muniNorm = normalizeLocationName(municipality);

  for (const [st, munis] of Object.entries(VENEZUELA_TERRITORY)) {
    if (st.toLowerCase() === stateNorm || stateNorm.includes(st.toLowerCase()) || st.toLowerCase().includes(stateNorm)) {
      const found = munis.find((m) => {
        const mNorm = normalizeLocationName(m.name);
        return mNorm === muniNorm || mNorm.includes(muniNorm) || muniNorm.includes(mNorm);
      });
      if (found) {
        return found.cities;
      }
    }
  }

  return [];
}

/**
 * Obtiene todas las ciudades y localidades de un Estado
 */
export function getAllCitiesForState(state: string): string[] {
  if (!state) return [];
  const stateNorm = state.trim().toLowerCase();
  const cities = new Set<string>();

  for (const [st, munis] of Object.entries(VENEZUELA_TERRITORY)) {
    if (st.toLowerCase() === stateNorm || stateNorm.includes(st.toLowerCase()) || st.toLowerCase().includes(stateNorm)) {
      munis.forEach((m) => {
        m.cities.forEach((c) => cities.add(c));
      });
      break;
    }
  }

  return Array.from(cities);
}

/**
 * Busca a qué municipio pertenece una ciudad determinada
 */
export function findMunicipalityByCity(state: string, city: string): string | null {
  if (!state || !city) return null;
  const stateNorm = state.trim().toLowerCase();
  const cityNorm = normalizeLocationName(city);

  for (const [st, munis] of Object.entries(VENEZUELA_TERRITORY)) {
    if (st.toLowerCase() === stateNorm || stateNorm.includes(st.toLowerCase()) || st.toLowerCase().includes(stateNorm)) {
      for (const m of munis) {
        if (normalizeLocationName(m.name) === cityNorm) {
          return m.name;
        }
        for (const c of m.cities) {
          if (normalizeLocationName(c) === cityNorm || normalizeLocationName(c).includes(cityNorm) || cityNorm.includes(normalizeLocationName(c))) {
            return m.name;
          }
        }
      }
    }
  }

  return null;
}
