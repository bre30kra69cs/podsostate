# На что я теперь опираюсь

---

- стейт не должен знать о том как работает схема и знать о транзакциях

---

- композиция схемы до создания машины
- нет меж машинного взаимодействия
- компонентность за счет создания схем до создания машины
- схема представляется как функция с контекстом
- контекст позволяет сделать по сути аллокатор (инъекция на минималках)
- конекст позволяет собирать инфу и служить шиной
- вутренняя оптимизация за счет маппинга
- уникальность за счет механизма ссылок языка
- эвенты и названиями состояний выделенны из схемы
- название узлов в виде координат
- нет обработки ощибки внутренних действий
- нет транзакций
- богатое состояние с локером
- на юзера возлагается ответственность за обработку ошибок
- на юзера возлагается ответственность за декларирование всей схемы
- интеграция стейт менеджера при создании спец машин
- схема содержит весь необходимый функционал кроме контекста и это можно будет тестить удобно
- машиа (как js абстракция) изначально представляется как график

---

# Внутренности

Следует постараться изначально придать машине следующие свойства:

- хорошая типизация
- приличная производительность
- декларативность описания
- неявная валидация схем
- возможность легко конфигурировать валидацию
- апи удобный для управления состояниями
- фабричность
- апи паралельности
- апи иерархии
- апи стейт менеджера
- внутренняя слабая типизация и внешная

## Хорошая типизация

Типизация эвентов должна осуществлятся за счет типов литералов строк?

Следует ли вообще пологаться на литеральные типы? Мб минимальным и базовым свойством языка должен стать факт
ссылочности у объектов, иначе говоря уникальности ссылок? По идее незнакомый эвент состояния не должен
вызывать варнингов и экспешенов.

> Сложно использовать систему типов так, чтоб не бзать уникальных литеральных типов и точно выводить
> ошибки принадлежности и корректности переходов и использования эвентов из за структурной типизации.

- [x] Валидация детерменировасти fsm на основе типов

Следует реализовать ядерную часть fsm на описании объекта с минимальным выводами типовю

## Приличная производительность

Следует использовть подход с мутациями и меньше замыканий. Либо же првоерсти ресерч о том насколько замыкания в цифрах
могут ухудшить произовдительность и потребление памяти + затем на бенчах проверить у себя.

Наверное следует юзать классы сразу.

## Декларативность описания

Коре часть будет написанно декларативно но с подробнотями, а фронт часть с вывовдом и мб даже с овверайдом типа от машины?

## Апи иерархии

Следует создать базовый тип узла машины, который будет наследовать тип состояния и тип машины.
Мб так же следует задавать машину как математическую машину.

> Интересная идея, но иерархия выглядит как нечто более сложное в данном случае.

Следует реализовать примитивный fsm на оснвове которого можно посмтроить отртогональность + активити. На основе активити
можно построить стейты сложные (с ливом, энтером и инвоком). Сложность в таком варианте заключатся в наличии не такого
уж и примитивного fsm т.к. у него как минимум будет функция защищенного перехода.

## Апи паралельности

Сейчас выглядит так что ортогональсть решается через подписки и общий примитивный fsm. Кста паралеллизм поможет
решить проблему активностей.

## Внутренняя слабая типизация и внешная

Выгялидт так что внутренняя типизация проекта должна быть слабее, потому как требуется только проверки на типы
тса, но не на выводы. Связанно это с композицией сложной fsm'ов и их враппинге.

---

## Вопросы

- Стоит ли добавить в возможность конфигурации строгость реагироания стейта на незнакомый эвент?
- Как правильно предоставить апи для расширения функционала? Апгрейды?
- Делать ли внутренние расширения как апгрейды?
- Разделять ли коре часть на фронт и бэк?
  > Да
- Как правильно заюзать композиуию для единого интерфейса?
- Должны ли внутренние эвенты состояния имитить новые эвенты?
  > Да
- Должен ли состояние и переход быть представлены как fsm?
  > Да
- Следует ли разделять активность и эффект и следует ли давать возможность делать экшоны асинхронными?
  > Следует
- Апи валидации?
- Определять машину математически или схематически?
- Как следует фризить все выходы? И вообще следует ли доверять выходам из машины и гарантии что там
  не будет мутаций?
- Не большой ли оверхед от передописок примитивных fsm?
- Когда кончится примитивность притивных fsm?
- Следует ли машине файрить подсики с названием эвента если он пчти всегда внутренний?
