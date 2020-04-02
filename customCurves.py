import matplotlib.pyplot as plt


startNumbers = [75, 119, 225]
endNumbers = [225, 211, 75]
currentNumbers = startNumbers.copy()
difference = []
uniformStepDifference = []

for num in range(len(startNumbers)):
    difference.append(endNumbers[num] - startNumbers[num])

for num in difference:
    uniformStepDifference.append(num / 150)

print(f"current numbers:    {currentNumbers}")
print(f"start numbers:      {startNumbers}")
print(f"end numbers:        {endNumbers}")
print(f"difference:         {difference}")
print(f"uniform Steps:      {uniformStepDifference}")

steps = [[], [], []]
countList = []
count = 0

# count up loop
while currentNumbers[0] < endNumbers[0]:
    for index in range(len(currentNumbers)):
        currentNumbers[index] += uniformStepDifference[index]
        uniformStepDifference[index] *= 1.075
        steps[index].append(currentNumbers[index])

    count += 1
    countList.append(count)

for numbers in currentNumbers:
    if numbers > 255:
        currentNumbers[currentNumbers.index(numbers)] = 255
    if numbers < 0:
        currentNumbers[currentNumbers.index(numbers)] = 0

uniformStepDifference = []
for num in difference:
    uniformStepDifference.append((num / 150) * 0.499)
stepsUp = len(countList)
print(f"number of steps up: {stepsUp}")

# count down loop
topHold = 10
delayStart = 0  # stay at the top for this many frames
slowdownPoint = 70

while currentNumbers[0] > startNumbers[0]:
    for index in range(len(currentNumbers)):
        if topHold < delayStart <= slowdownPoint:  # after we have passed delay start begin the exponential increase
            uniformStepDifference[index] *= 1.027
            currentNumbers[index] -= uniformStepDifference[index]
        elif delayStart > slowdownPoint:
            uniformStepDifference[index] *= 0.97
            currentNumbers[index] -= uniformStepDifference[index]
        steps[index].append(currentNumbers[index])

    delayStart += 1
    count += 1
    countList.append(count)

endHold = 15
for num in range(endHold):
    for index in range(len(currentNumbers)):
        steps[index].append(currentNumbers[index])
    count += 1
    countList.append(count)


# check to make sure we haven't gone past 255 or 0
for stepList in steps:
    for numbers in stepList:
        if numbers > 255:
            stepList[stepList.index(numbers)] = 255
        if numbers < 0:
            stepList[stepList.index(numbers)] = 0

print(f"number of steps down: {len(countList) - stepsUp}")
plt.plot(countList, steps[1])
plt.show()
