# INTERFACES

## ENTREGAS:

1. [N° 1](https://ninaencinosa.github.io/INTERFACES/Entregables/1/index.html): Pagina de creacion y edicion sobre canvas.
En esta app:
-Los filtros son acumulativos.
-Al presionar reiteradas veces un mismo filtro este incrementará su intensidad.
-Al descargar la imagen tenga en cuenta que está tendra una resolucion de 480x640 .
-Cada vez que añada una nueva imagen, los cambios y/o dibujos realizados previamente se perderán.

2. [N° 2](https://ninaencinosa.github.io/INTERFACES/Entregables/2/index.html): Juego 4 en linea! 
-Cambiando la constante "WINNER_NUMBER" se puede customizar la secuencia solicitada para ganar.
-Las fichas caen "por gravedad" por lo que solo pueden ser soltadas en la "dropping zone" (zona indicada con flechas)!
-Coordenadas de las 4 esquinas del tablero en codigo:
|(boardWidth , (boardHeight - (boardFil * SIZE_FIG)) ... ((boardWidth + (boardCol * SIZE_FIG)),(boardHeight - (boardFil * SIZE_FIG)))| 
|                 ...                                ...                          ...                                                |
|(boardWidth , boardHeight)                          ... ((boardWidth + (boardCol * SIZE_FIG) , boardHeight)                         |
