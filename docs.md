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
„Koniec tury”, w tym momencie drugi gracz zatwierdza poprawność słowa. W razie
odrzucenia, literki trafiają z powrotem na stojak gracza i powtarza on turę.
Jeżeli zaakceptuje, zostają przyznane punkty automatycznie za słowa ułożone
przez gracza i rozpoczyna się tura następna, prowadzona przez następnego gracza.
Każdy kolejny gracz układając słowa musi literki układać w sposób stykający
którąś z poprzednich literek. Gracze mają możliwość wymiany literek,
przeciągając pożądane literki do specjalnie wyznaczonego pola i klikając w
przycisk. Taka wymiana może nastąpić raz na turę gracza. Gdy zostaną zużyte
wszystkie literki, wygrywa gracz posiadający najwięcej punktów.

## Specyfikacja techniczna
Cały projekt składa się z 5 plików oraz jednego folderu. Plik „index.html” jest
plikiem, który posiada cały szkielet faktycznej gry oraz funkcję, która zbiera
potrzebne informacje z poszczególnych pól. Plik „style.css” zawiera kod, który
odpowiada za wygląd całej strony i każdego z elementów. Plik „polyfills.js”
zawiera kod, który dołącza funkcję, gdyby przeglądarka nie posiadała takowej
wbudowanej. Plik „fakequery.js” zawiera symulację minimalnej ilości
funkcjonalności biblioteki jQuery. Plik „script.js” zawiera wszystkie potrzebne
skrypty, które odpowiadają za poszczególne etapy rozgrywki, za przeciąganie i
upuszczanie literek, za mieszanie tablicy z literkami czy zmianę tury. Folder
„letter_images” zawiera w sobie obrazki poszczególnych literek.

## Szczegóły techniczne
Obiekt MIXIN zawiera w sobie metody przeciągania i upuszczania literek z pola na
pole wspólne dla kilku klas, które są do nich dołączane później poprzez użycie
funkcji Object.assign.
Metoda shuffle zapewnia różnorodność pod względem kolejności literek, mieszając
tablicę tych literek poprzez metodę JAKĄ. Następna metoda Game jest
odpowiedzialna za inicjalizacje gry, odpowiednie ustawienie tabel, wybór
aktywnego gracza. Ciekawym rozwiązaniem jest tutaj ustawienie początkowego
gracza na wartość -1:
this.activePlayer = -1;
Grę rozpoczynamy od inkrementacji tej wartości, przez co gra faktycznie
rozpoczyna się od gracza z indeksem 0 (gracza pierwszego). Następna metoda
wireUp jest sposobem na dodanie konkretnych zawołań funkcji w przypadku zajścia
specjalnych wydarzeń. Metoda nextTurn odpowiada za ustawienie właściwości dla
gracza dla konkretnej tury, dodanie graczowi punktów czy zmianę możliwości
wymiany literek. Ciekawym rozwiązaniem jest tutaj wybieranie odpowiedniej tury:
this.turn += 1 / this.players.length;
this.elems.turn.textContent = Math.ceil(this.turn);
Sposób ten wybiera turę, jako sumę odwrotności liczby graczy, zaokrąglając przy
tym liczbę zawsze do wyższej. Dzięki temu gra rozpoczyna się zawsze od pierwszej
tury. Kolejna metoda nextPlayer zajmuje się zmianą gracza, wyświetlaniem
odpowiednich punktów czy wypełnianiem stojaka na literki. Metody generateBoard,
BoardRow, generateCell i BoardCell są odpowiedzialne za funkcjonalność
poszczególnych elementów, na które wskazują, planszy, wierszy i konkretnych
komórek. Metoda disable zmienia dostępność danej komórki. Kolejna funkcja
„Letter” jest konstruktorem pojedynczej literki, zawiera w sobie ilość punktów
czy podpięcie funkcji zwrotnych związanych z możliwościami literki. Kolejna
metoda createElem jest odpowiedzialna za stworzenie właściwego elementu obrazka
w grze. Kolejna funkcja o nazwie „Player” jest konstruktorem właściwego
zachowania się „gracza” oraz jego pól, w tym stojaka, korzystając przy tym z
poprzednich metod. Kolejna funkcja Exchange jest odpowiedzialna za wymianę
literek, która korzysta z kolejnych metod odpowiedzialnych za dodawanie literek,
usuwanie literek czy umożliwienie wymiany literek tylko raz na turę.

## Podział pracy
Michał Muskała:
Kamil Kryus:
