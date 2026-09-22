// ------------------------------------------------------------
// ДАННЫЕ ЭТАПОВ (время в миллисекундах, индексы уровня и фазы)
// ------------------------------------------------------------
var timeMs = [
  0, 6252, 12525, 17522, 23802, 30050, 35060, 40829, 46598, 51609, 57345, 63131,
  68125, 73471, 78805, 83808, 89140, 94497, 99484, 104643, 109786, 114780, 119936, 125078,
  130083, 135224, 140379, 145391, 150522, 155674, 160683, 165826, 170977, 175977, 181124, 186277,
  191275, 196439, 201578, 206572, 211728, 216871, 221866, 226923, 232043, 236979, 242041, 247094,
  252104, 257150, 262203, 267227, 272279, 277326, 282340, 287395, 292450, 297442, 302513, 307562,
  312563, 317625, 322672, 327675, 332736, 337801, 342799, 347766, 352745, 357761, 362712, 367680,
  372703, 377647, 382617, 387627, 392603, 397561, 402584, 407550, 412507, 417509, 422486, 427445,
  432457, 437430, 442398, 447395, 452360, 457327, 462322, 467221, 472094, 477120, 481996, 486883,
  491890, 496766, 501649, 506659, 511468, 516266, 521260, 526075, 530870, 535872, 540685, 545476,
  550469, 555210, 559938, 564943, 569654, 574388, 579398, 584110, 588839, 593854, 598566, 603288,
  608302, 613016, 617737, 622750, 627483, 632196, 637197, 641867, 646494, 651503, 656152, 660800,
  665796, 670450, 675103, 680110, 684757, 689401, 694394, 699046, 703697, 708713, 713349, 718008,
  723002, 727563, 732137, 737166, 741824, 746297, 751318, 755875, 760460
];

var levelIdx = [
  0,0,0, 1,1,1, 2,2,2, 3,3,3, 4,4,4, 5,5,5,
  6,6,6, 7,7,7, 8,8,8, 9,9,9, 10,10,10, 11,11,11, 12,12,12, 13,13,13,
  14,14,14, 15,15,15, 16,16,16, 17,17,17, 18,18,18, 19,19,19, 20,20,20, 21,21,21,
  22,22,22, 23,23,23, 24,24,24, 25,25,25, 26,26,26, 27,27,27, 28,28,28, 29,29,29,
  30,30,30, 31,31,31, 32,32,32,
  33,33,33, 34,34,34, 35,35,35,
  36,36,36, 37,37,37, 38,38,38, 39,39,39, 40,40,40, 41,41,41,
  42,42,42, 43,43,43, 44,44,44, 45,45,45, 46,46,46, 47,47,47,
  48,48,48, 49,49,49, 50,50,50
];

var phaseIdx = [
  0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2,
  0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2,
  0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2,
  0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2,
  0,1,2, 0,1,2, 0,1,2,
  0,1,2, 0,1,2, 0,1,2,
  0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2,
  0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2,
  0,1,2, 0,1,2, 0,1,2
];

var levelNames = [
  "8.0-1","8.0-2","10.0-1","10.0-2","12.0-1","12.0-2",
  "13.0-1","13.0-2","13.0-3","13.0-4","13.0-5","13.0-6","13.0-7","13.0-8",
  "13.5-1","13.5-2","13.5-3","13.5-4","13.5-5","13.5-6","13.5-7","13.5-8",
  "14.0-1","14.0-2","14.0-3","14.0-4","14.0-5","14.0-6","14.0-7","14.0-8",
  "14.5-1","14.5-2","14.5-3",
  "15.0-1","15.0-2","15.0-3",
  "15.5-1","15.5-2","15.5-3","15.5-4","15.5-5","15.5-6",
  "16.0-1","16.0-2","16.0-3","16.0-4","16.0-5","16.0-6",
  "16.5-1","16.5-2","16.5-3"
];

var phaseNames = ["Туда", "Обратно", "Отдых"];

var isRunning = false;
var ourTimeMs = 0;
var currentIndex = 0;
var subscriptionActive = false;

// Стартовое количество отрезков
var remainingSegments = 48;

// Компенсация задержки воспроизведения сигнала
var SIGNAL_OFFSET_MS = 300;

// Кэш для отображения
var lastShownSecond = -1;
var lastShownIndex = -1;
var lastShownRunning = null;
var lastShownSegments = -1;

// ------------------------------------------------------------
// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ФОРМАТИРОВАНИЯ
// ------------------------------------------------------------
var formatTime = function(ms) {
  if (ms < 0) ms = 0;
  var totalSeconds = Math.floor(ms / 1000);
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  var mm = minutes < 10 ? '0' + minutes : '' + minutes;
  var ss = seconds < 10 ? '0' + seconds : '' + seconds;
  return mm + ':' + ss;
};

// ------------------------------------------------------------
// КОЛБЭКИ
// ------------------------------------------------------------
function getUserInterface(input, output) {
  return { template: 't' };
}

function onLoad(input, output) {
  isRunning = false;
  ourTimeMs = 0;
  currentIndex = 0;
  remainingSegments = 48;
  lastShownSecond = -1;
  lastShownIndex = -1;
  lastShownRunning = null;
  lastShownSegments = -1;

  systemEvent('ARIET: main onLoad');

  if (!subscriptionActive) {
    subscriptionActive = true;
    $.subscribe('/Dev/Time/Tick10hz', function() {
      if (!isRunning) return;

      ourTimeMs += 100;

      while (currentIndex + 1 < timeMs.length
             && timeMs[currentIndex + 1] - SIGNAL_OFFSET_MS <= ourTimeMs) {
        currentIndex++;
        // Двойной сигнал — звук + вибрация, гарантированно работает
        playIndication('Confirm');

        if (currentIndex > 0 && phaseIdx[currentIndex - 1] === 1) {
          remainingSegments--;
          if (remainingSegments < 0) remainingSegments = 0;
        }
      }

      // Автостоп после последнего этапа программы
      if (currentIndex >= timeMs.length - 1 && isRunning) {
        isRunning = false;
        lastShownRunning = null;
      }
    });
  }
}

// Пауза тренировки гасит сигналы.
function onExercisePause(input, output) {
  isRunning = false;
  lastShownRunning = null;
  systemEvent('ARIET: exercise pause');
}

// Отображение — вызывается ~1 раз в секунду.
function evaluate(input, output) {
  var idx = currentIndex;
  var nextTime = (currentIndex + 1 < timeMs.length)
    ? timeMs[currentIndex + 1]
    : timeMs[timeMs.length - 1];
  var remaining = (currentIndex + 1 < timeMs.length)
    ? (nextTime - ourTimeMs)
    : 0;

  if (remaining < 0) remaining = 0;

  var currentSecond = Math.floor(remaining / 1000);

  if (currentSecond !== lastShownSecond
      || idx !== lastShownIndex
      || isRunning !== lastShownRunning
      || remainingSegments !== lastShownSegments) {

    lastShownSecond = currentSecond;
    lastShownIndex = idx;
    lastShownRunning = isRunning;
    lastShownSegments = remainingSegments;

    setText('#levelDisplay', levelNames[levelIdx[idx]]);
    setText('#phaseDisplay', phaseNames[phaseIdx[idx]]);
    setText('#timeDisplay', formatTime(remaining));
    setText('#stateDisplay', isRunning ? '▶' : '⏸');
    setText('#segmentsDisplay', String(remainingSegments));
  }
}

// Кнопка «up» — старт/пауза
function onEvent(input, output, eventId) {
  if (eventId === 1) {
    if (!isRunning && currentIndex >= timeMs.length - 1) {
      return;
    }

    isRunning = !isRunning;
    playIndication(isRunning ? 'StartTimer' : 'StopTimer');
    lastShownRunning = null;
  }
}