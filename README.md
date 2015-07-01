# SCRABBLE

## Opis programu
Program jest symulacją gry planszowej o nazwie Scrabble. Gra bazuje na typowych
regułach tej gry, zawiera pola, gdzie wpisuje się imiona graczy, plansze
przeznaczoną do układania literek, stojak na literki gracza, pole, na które
kładzie się literki w celu wymiany ich na inne, tabelę z punktacją,
przyciski, które obsługują całą grę. Gra wymaga działającej przeglądarki
internetowej (zalecane Google Chrome, Mozilla Firefox, Opera, Internet Explorer 10+).
Gra przeznaczona
jest dla 2-4 osób, grających przy jednym komputerze. Nie jest możliwa gra z
komputerem.

## Instrukcja obsługi

Grę uruchamiamy poprzez dwukrotne kliknięcie myszy na plik o nazwie
`index.html`. Na początku należy wprowadzić imiona dla graczy (minimum dwóch,
maksimum czterech) i nacisnąć w przycisk `Rozpocznij grę`. Strona automatycznie
przeniesie użytkownika do rozgrywki. Rozpoczyna gracz pierwszy, przeciągając
literki na planszę układa słowa. Pola, na które można upuścić literki zgodnie z
zasadami gry, oznaczone są jaśniejszym kolorem. Następnie gracz naciska przycisk
`Koniec tury`, w tym momencie drugi gracz zatwierdza poprawność słowa. W razie
odrzucenia, literki trafiają z powrotem na stojak gracza i powtarza on turę.
Jeżeli zaakceptuje, zostają przyznane punkty automatycznie za słowa ułożone
przez gracza i rozpoczyna się tura następna, prowadzona przez następnego gracza.
Każdy kolejny gracz układając słowa musi literki układać w sposób stykający
którąś z poprzednich literek. Gracze mają możliwość wymiany literek,
przeciągając pożądane literki do specjalnie wyznaczonego pola i klikając w
przycisk. Taka wymiana może nastąpić raz na turę gracza. Gdy zostaną zużyte
wszystkie literki, wygrywa gracz posiadający najwięcej punktów.

## Specyfikacja techniczna

Cały projekt składa się z 5 plików, jednego folderu i dokumentacji:
* Plik `index.html` jest plikiem, który posiada cały szkielet faktycznej
gry oraz funkcje, służące do rozpoczęcia rozgrywki
* Plik `style.css` zawiera kod, który
odpowiada za wygląd całej strony i każdego z elementów.
* Plik `polyfills.js`
zawiera kod, który dołącza funkcję, gdyby przeglądarka nie posiadała takowej
wbudowanej.
* Plik `fakequery.js` zawiera symulację minimalnej ilości
funkcjonalności biblioteki jQuery.
Plik `script.js` zawiera wszystkie potrzebne
skrypty, które odpowiadają za poszczególne etapy rozgrywki, za przeciąganie i
upuszczanie literek, za mieszanie tablicy z literkami czy zmianę tury.
* Folder `letter_images` zawiera w sobie obrazki poszczególnych literek.
* Plik `README.md` zawiera dokumentację.

## Szczegóły techniczne
Obiekt `CONST` zawiera różne stałe potrzebne do pracy programu.

Obiekt `MIXIN.droppable` zawiera w sobie metody przeciągania i upuszczania
literek z pola na
pole wspólne dla kilku klas, które są do nich dołączane później poprzez użycie1
funkcji `Object.assign`.

Funkcja `shuffle` implementuje algorytm Fishera-Yatesa służący do mieszania
tablicy.

Para funkcji `addToSet` i `removeFromSet` służy do traktowania tablicy jak
zbioru. 

Większość obiektów zarządzających elementami DOM posiada metodę `wireUp` służącą
do podpięcia funkcji obsługujących zdarzenia na zarządzanych elementach.

Konstruktor `BoardManager` tworzy obiekt odpowiedzialny za zarządzanie polem
gry - jego utworzenie, a następnie określenie, w jakich polach można upuścić
literki. Warto zwrócić uwagę na metodę `getCell`:
```javascript
BoardManager.prototype.getCell = function(y, x) {
  if (y >= 0 && y < CONST.boardHeight
      && x >= 0 && x < CONST.boardWidth) {
    return this.board[y].cells[x];
  }

  return {
    disabled: function() {},
    isEmpty: function() { return true; }
  };
};
```
Użyto wzorca projektowego "NullObject" pozwalającego na wygodne obsłużenie
sytuacji gdy komórka o którą
prosimy nie istnieje bez rozsiewania instrukcji warunkowych w innych metodach.

Konstruktor `PointsCounter` tworzy obiekt służący do obliczenia ilości punktów
jakie należy dopisać graczowi po zakończeniu jego tury.

Konstruktor `Game` jest tworzy obiekt odpowiedzialny za inicjalizacje gry,
odpowiednie ustawienie tabel, wybór aktywnego gracza oraz dalsze prowadzenie
rozgrywki. Ciekawym rozwiązaniem jest tutaj ustawienie początkowego
gracza na wartość -1:
```javascript
this.activePlayer = -1;
```
Każda tura rozpoczyna się od inkrementacji tej wartości, przez co gra faktycznie
rozpoczyna się od gracza z indeksem 0 (gracza pierwszego). 
Warto zwrócić uwagę na sposób obliczania obecnej tury:
```javascript
this.turn += 1 / this.players.length;
this.elems.turn.textContent = Math.ceil(this.turn);
```
Sposób ten wybiera turę, jako sumę odwrotności liczby graczy, zaokrąglając przy
tym liczbę zawsze do wyższej. Dzięki temu gra rozpoczyna się zawsze od pierwszej
tury.

Konstruktor `BoardRow` odpowiedzialny jest za tworzenie obiektów opakowujących
elementy `tr` używane na polu gry.

Konstruktor `BoardCell` odpowiedzialny jest za tworzenie obiektów opakowujących
elementy `td` używane na polu gry. Implementuje on polimorficzne zachowanie dla
elementu, na który można upuścić literkę dzięki domieszaniu metod zdefiniowanych
w `MIXIN.droppable`.

Konstruktor `Letter` odpowiedzialny jest za tworzenie obiektów opakowujących
elementy `img` reprezentujące literki.

Konstruktor `Player` odpowiedzialny jest za tworzenie obiektów reprezentujących
graczy. Obiekty te odpowiedzialne również są za obsługę "stojaka" danego gracza.

Konstruktor `Exchange` odpowiedzialny jest za tworzenie obiektu obsługującego
funkcję wymiany literek. Podobnie jak `BoardCell` implementuje polimorficzne
zachowanie dla elementu, na który można upuścić literkę.

## Podział pracy

### Kamil Kryus
Opracowanie zasad gry i przystosowanie do środowiska przeglądarki
internetowej. Opracowanie interfejsu użytkownika i zaprojektowanie sposobu
interakcji użytkownika z aplikacją. Oprawa graficzna aplikacji.
Opracowanie i implementacja sposobu losowania liter dla graczy, inicjalizacji
gry, obsługi zmiany tur, obsługi przenoszenia liter do
danej komórki i blokowania możliwości wymiany. Opracowanie sposobu reprezentacji
liter w kodzie.

### Michał Muskała
Opracowanie architektury aplikacji, podział na obiekty, oraz ustalenie zasad
komunikacji pomiędzy nimi. Implementacja polimorficznego zachowania dla różnych
obiektów mogących posiadać literki. Opracowanie sposobu ustalenia, które pola są
dopuszczalne do gry, obliczanie punktów należnych graczom, obsługa gracza,
stojaka na literki oraz funkcji wymiany literek. Obsługa przenoszenia liter
między komórkami. Tworzenie tablicy gry.
