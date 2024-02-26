# Три футбольні команди:
#     - італійська команда "Мілан",
#     - іспанська - "Реал",
#     - українська - "Металіст",
# зустрілися в груповому етапі Ліги чемпіонів з футболу.
# Їх тренували тренери з цих же трьох країн:
#     - італієць Антоніо,
#     - іспанець Родріго,
#     - українець Микола.
# Відомо, що національність у всіх трьох тренерів не збігалася з національністю команд.
# Потрібно визначити тренера команди Металіст, якщо відомо:
#     а) Металіст не тренується в Антоніо.
#     б) Реал обіцяв ніколи не брати Миколу головним тренером

from logic import *; 
 
AntonioMilan = Symbol("Antonio-Milan") 
AntonioReal = Symbol("Antonio-Real") 
AntonioMetalist = Symbol("Antonio-Metalist")

RodrigoMilan = Symbol("Rodrigo-Milan") 
RodrigoReal = Symbol("Rodrigo-Real") 
RodrigoMetalist = Symbol("Rodrigo-Metalist")

MykolaMilan = Symbol("Mykola-Milan") 
MykolaReal = Symbol("Mykola-Real") 
MykolaMetalist = Symbol("Mykola-Metalist")

options = [ 
AntonioMilan, 
AntonioReal, 
AntonioMetalist, 
RodrigoMilan, 
RodrigoReal, 
RodrigoMetalist, 
MykolaMilan, 
MykolaReal, 
MykolaMetalist 
] 
 
constraintOfDifferentOrigin = And(Not(AntonioMilan),Not(RodrigoReal),Not(MykolaMetalist)) 
knownConstraints = And(Not(AntonioMetalist),Not(MykolaReal)) 

teamHasOneManager = And(
    Or(AntonioMilan, RodrigoMilan, MykolaMilan),
    Or(AntonioReal, RodrigoReal, MykolaReal),
    Or(AntonioMetalist, RodrigoMetalist, MykolaMetalist),

    # Each team has exactly one manager
    Or(
        And(AntonioMilan, Or(Not(RodrigoMilan), Not(MykolaMilan))),
        And(RodrigoMilan, Or(Not(AntonioMilan), Not(MykolaMilan))),
        And(MykolaMilan, Or(Not(AntonioMilan), Not(RodrigoMilan))),
        And(AntonioReal, Or(Not(RodrigoReal), Not(MykolaReal))),
        And(RodrigoReal, Or(Not(AntonioReal), Not(MykolaReal))),
        And(MykolaReal, Or(Not(AntonioReal), Not(RodrigoReal))),
        And(AntonioMetalist, Or(Not(RodrigoMetalist), Not(MykolaMetalist))),
        And(RodrigoMetalist, Or(Not(AntonioMetalist), Not(MykolaMetalist))),
        And(MykolaMetalist, Or(Not(AntonioMetalist), Not(RodrigoMetalist)))
    )
)
 
coachHasOneTeam = And(
    Or(AntonioMilan, AntonioReal, AntonioMetalist),
    Or(RodrigoMilan, RodrigoReal, RodrigoMetalist),
    Or(MykolaMilan, MykolaReal, MykolaMetalist),
    Or(
        And(AntonioMilan, Or(Not(AntonioReal), Not(AntonioMetalist))),
        And(AntonioReal, Or(Not(AntonioMilan), Not(AntonioMetalist))),
        And(AntonioMetalist, Or(Not(AntonioMilan), Not(AntonioReal))),
        And(RodrigoMilan, Or(Not(RodrigoReal), Not(RodrigoMetalist))),
        And(RodrigoReal, Or(Not(RodrigoMilan), Not(RodrigoMetalist))),
        And(RodrigoMetalist, Or(Not(RodrigoMilan), Not(RodrigoReal))),
        And(MykolaMilan, Or(Not(MykolaReal), Not(MykolaMetalist))),
        And(MykolaReal, Or(Not(MykolaMilan), Not(MykolaMetalist))),
        And(MykolaMetalist, Or(Not(MykolaMilan), Not(MykolaReal)))
    )
)
 
knowledge_base = And(
teamHasOneManager, 
coachHasOneTeam,
constraintOfDifferentOrigin, 
knownConstraints 
) 
 
def check_knowledge(knowledge, symbol): 
    if model_check(knowledge, symbol): 
        print(f"{symbol}") 
 
for option in options: 
    check_knowledge(knowledge_base, option) 
  
# python3 football-teams-and-their-coach.py
# Output:
# Antonio-Real
# Rodrigo-Metalist
# Mykola-Milan