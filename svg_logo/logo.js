var logo = document.getElementById("logo");

class Logo {
  constructor() {
    var letter_S = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    letter_S.setAttribute(
      "d",
      `M3.1,20.6c1.2,1.1,3,1.7,4.7,1.7c1.2,0,2.2-0.6,2.2-1.4c0-2.6-8.3-1.7-8.3-7.2c0-3.3,3.2-5.3,6.5-5.3
       c2.2,0,4.6,0.8,5.8,1.7l-2.1,3.3c-0.9-0.6-2-1.2-3.3-1.2c-1.3,0-2.3,0.5-2.3,1.4c0,2.2,8.3,1.3,8.3,7.3c0,3.3-3.2,5.3-6.8,5.3
       c-2.4,0-4.9-0.8-6.9-2.3L3.1,20.6z`
    );
    letter_S.setAttribute("class", "st0");

    var letter_E = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    letter_E.setAttribute(
      "d",
      `M31.8,17.1c0-4.8-3.3-8.8-8.1-8.8c-5.1,0-8.3,4.2-8.3,8.9c0,5.4,3.8,8.9,8.9,8.9c2.6,0,5.3-1.1,7-3.1
				l-2.6-2.6c-0.8,0.9-2.4,2-4.3,2c-2.4,0-4.4-1.7-4.6-4.1h11.8C31.8,18,31.8,17.6,31.8,17.1z M20.1,15.1c0.2-1.6,1.8-3,3.7-3
				c1.9,0,3.2,1.5,3.4,3H20.1z`
    );
    letter_E.setAttribute("class", "st0");

    var letter_R = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    letter_R.setAttribute(
      "d",
      "M43,8.5c-1.9,0-3.5,0.7-4.8,1.7V8.7h-4.4v17.1h4.6V14.9c0.6-0.9,2.2-2.1,4.2-2.1c0.7,0,1.3,0.1,1.8,0.3V8.7C43.9,8.6,43.4,8.5,43,8.5"
    );
    letter_R.setAttribute("class", "st0");

    var letter_V = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    letter_V.setAttribute(
      "points",
      "55.2,19.2 59.9,8.7 64.7,8.7 56.8,25.8 53.6,25.8 45.8,8.7 50.5,8.7"
    );
    letter_V.setAttribute("class", "st0");

    var letter_N = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    letter_N.setAttribute(
      "d", `M108.5,25.8V8.7h4.4v1.4c1.3-1.1,2.9-1.7,4.8-1.7c2.4,0,4.5,1.1,5.9,2.8c1.1,1.3,1.8,3.1,1.8,6v8.7h-4.6     
      v-9.1c0-1.7-0.4-2.6-1-3.2c-0.6-0.6-1.5-1-2.6-1c-1.9,0-3.5,1.2-4.2,2.1v11.1H108.5z`
    );
    letter_N.setAttribute("class", "st0");

    var letter_O = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    letter_O.setAttribute(
      "d",
      `M137.2,8.4c-5.5,0-10,4.4-10,9.9c0,2.9,1.2,5.5,3.1,7.4c0.7,0.7,1.8,0.7,2.6,0.1c1.1-0.9,2.6-1.4,4.3-1.4     c1.7,0,3.1,0.5,4.3,1.4c0.8,0.6,1.9,0.5,2.6-0.2c1.9-1.8,3.1-4.4,3.1-7.3C147.1,12.9,142.7,8.4,137.2,8.4 M137.1,23.4     c-3,0-5-2.2-5-5c0-2.8,2-5,5-5c3,0,5,2.3,5,5C142.1,21.1,140.1,23.4,137.1,23.4`
    );
    letter_O.setAttribute("class", "st1");

    var letter_W = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    letter_W.setAttribute(
      "points",
      `156.2,25.8 152.8,25.8 146,8.7 150.5,8.7 154.2,18.5 157.9,8.7 161.7,8.7 165.3,18.5 169.1,8.7       173.7,8.7 166.9,25.8 163.5,25.8 159.8,16.1`
    );
    letter_W.setAttribute("class", "st0");

    var letters = [];
    letters.push(letter_S);
    letters.push(letter_E);
    letters.push(letter_R);
    letters.push(letter_V);
    letters.push(letter_N);
    letters.push(letter_O);
    letters.push(letter_W);
  }

  show() {
    for (let i = 0; i < letters.length; i++) {
      showLetter(i);
    }
  }

  showLetter(i) {
    setTimeout(function () {
      logo.appendChild(letters[i]);
    }, 100 * i);
  }
}
