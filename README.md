# reservation-system

A Web Based Application I'm developing for my workplace, The Eddy Pub. It's still in production but I'm proud of what I have so far! 

## Funcion
When the user navigates to the reservation page, they can enter a day, time, and party number for their desired reservation. If the party number is 7+, 
a message will appear asking the user to call in and make the reservation. When the user clicks submit, the application will check and make sure the restaurant is open on the given
day and time. If not a message will be displayed under the date picker or time picker depending on which value is out of bounds. If the time is valid, the application will pull 
reservation data for that day from google firestore and find if there are any tables available at that time. If not the application will look for alternative times. If target is
available, it will be listed below in an inside, outside, or high top div. If target is not available, alternatives will be displayed. 

The user can then select which time they want and click Confirm Reservation to navigate to a new page on which they will enter their information. Once user has entered valid
First Name, Last Name, Phone Number, and Email Address, they can click confirm to make the reservation. The application will then divert them to a confirmation message (and will 
send a confirmation email in the future). 


## Technologies
* HTML
* CSS
* Javascript
* jQuery
* Google Firebase
* Google Firestore


## Deployed Application
https://gdickey273.github.io/reservation-system/


## License
MIT License

Copyright (c) [2020] [Graham Dickey]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
