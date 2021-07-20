# About
I have created this web application ["ganit"](https://dakc.github.io/ganit/) for teaching addition and substraction to my son. I am sharing here as if it can help someone like me.

## How it works
It will show two random numbers and a mathematical operation plus or minus. Those random numbers will be created between 0 and "max" value. By default "max" is set to "10", but can be changed by setting "max" parameter in the url. For eg, following URL will set the "max" to be "20".
```
https://dakc.github.io/ganit/?max=20
```

The mathematics operation supported is either "+" or "-" or "random" (randomely chooses plus or minus). "random" is the default operation but can be changed by setting "type" parameter in the url.
For eg, following URL will show only addition problems.
```
https://dakc.github.io/ganit/?type=plus
```

## How to use
When mathematical question is shown, answer is written inside the box. When "Next" button is clicked, both question and answer are saved and new question will be shown in the window.

This will save the data on the client which can be deleted by clicking "DELETE DB" Button. For preventing from unintentional deletion, it will require password which is set to be "1234"

## Features
**CLEAR :** Erases the handwritten data

**NEXT :** Saves question and answers in the database and shows new question in the display

**check result:** Will show the list of questions and answers in a card list format. Tap once if the answer is correct. If you tapped unintentionally then, tapping one more time will remove the selection.

**DELETE DB:** Will delete the data from the client. Requires password input which is set to 1234.


![Main Window](img1.png?raw=true "Main Window")
![Checking Answer](img2.png?raw=true "Checking Answer")