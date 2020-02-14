import random

layerOne = ["b", "c", "d"]
layerTwo = ["e", "f", "g"]
layerThree = ["h", "i", "j"]

zeroOut = "a"
OneOut = random.choice(layerOne)
TwoOut = random.choice(layerTwo)

dataDict = \
    {
        zeroOut: layerOne,
        OneOut: layerTwo,
        TwoOut: layerThree,
    }

for k,v in dataDict.items():
    print(f"{k} connects to {v}")
