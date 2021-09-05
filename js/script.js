class Poem {
  constructor() {
    this.baseUrl = "https://api-thirukkural.vercel.app/api?num=";
    this.lang = "tam";
  }

  getPage(number) {
    this.poems = [];
    this.clearContainer();
    if (number < 0 || number >= 133) {
      throw new Error("Enter Page Number between 1 to 133");
    }
    let urls = [];
    for (let i = 1; i < 11; i++) {
      this.createContainer(i);
      urls.push(this.baseUrl + (number * 10 + i));
    }
    this.fetchPage(urls, number);
  }

  async fetchPage(urls, number) {
    const promises = await Promise.all(urls.map((url) => fetch(url)));
    let isDone = false;
    promises.forEach((promise) => {
      promise
        .json()
        .then((poem) => {
          this.createCard(poem, number);
          if (!isDone) {
            this.createHead(poem);
            isDone = true;
          }
          this.poems.push(poem);
        })
        .catch((err) => console.log(err));
    });
  }

  createContainer(index) {
    const container = document.createElement("div");
    container.id = `poem-${index}`;
    container.className = "poem-box";
    document.querySelector("#poem-container").append(container);
  }
  clearContainer() {
    document.querySelector("#poem-container").innerHTML = "";
  }
  createCard(poem) {
    let index = poem.number % 10 || 10;
    document.querySelector(`#poem-${index}`).innerHTML = `
    <div class="index"><span class="content">${poem.number}</span></div>
    <div class="poem">
      <div>
        ${
          this.lang === "tam"
            ? `
          <div>${poem.line1}</div>
          <div>${poem.line2}</div>
        `
            : `${poem.eng}`
        }
      </div>
    </div>
    <button class="btn" onclick="toggle('exp-${index}')">Explaination</button>

    <div class="exp inactive" id="exp-${index}"><span class="content">${
      poem[`${this.lang}_exp`]
    }</span></div>`;
  }
  updateCard() {
    let isDone = false;
    this.poems.forEach((poem) => {
      this.createCard(poem);
      if (!isDone) {
        this.createHead(poem);
        isDone = true;
      }
    });
  }
  changeLang() {
    this.lang = this.lang === "tam" ? "eng" : "tam";
    this.updateCard();
    return this.lang;
  }
  createHead(poem) {
    document.querySelector(
      "#head"
    ).innerHTML = `<div><span class="label">Section : </span><span class="content">${
      poem[`sect_${this.lang}`]
    }</span></div>
      <div><span class="label">Chapter : </span><span class="content">${
        poem[`chap_${this.lang}`]
      }</span></div>
      <div><span class="label">Capter Group : </span><span class="content">${
        poem[`chapgrp_${this.lang}`]
      }</span></div> `;
  }
}

const poem = new Poem();
const pageNo = document.querySelector("#pageNo");
poem.getPage(pageNo.value - 1);

function toggle(id) {
  document.querySelector(`#${id}`).classList.toggle("inactive");
}

function toggleLang() {
  let lang = poem.changeLang();
  let langbtn = document.querySelector(`#lang`);
  langbtn.innerText = lang === "tam" ? "English" : "Tamil";
}

function search() {
  try {
    poem.getPage(pageNo.value - 1);
  } catch (e) {
    document.querySelector("#head").innerText = "";
    document.querySelector("#poem-container").innerText = e;
  }
}
// poem.changeLang("eng");

// let prop = ["chap_", "chapgrp_", "sect_"]

// chap_eng: "Lamentations at Eventide"
// chap_tam: "உறுப்புநலன் அழிதல்"
// chapgrp_eng: "The Post-marital love"
// chapgrp_tam: "கற்பியல்"
// eng: "To lift from want he left me afar His thought makes my eyes blush the flower"
// eng_exp: "While we endure the unbearable sorrow, your eyes weep for him who is gone afar, and shun (the sight of) fragrant flowers"
// line1: "சிறுமை நமக்கொழியச் சேட்சென்றார் உள்ளி"
// line2: "நறுமலர் நாணின கண்."
// number: 1231
// sect_eng: "Love"
// sect_tam: "காமத்துப்பால்"
// tam_exp: "பிரிவுத் துன்பத்தை நமக்களித்துவிட்டு நெடுந்தொலைவு சென்று விட்டாரேயென்று வருந்திடும் காதலியின் கண்கள் அழகிழந்துபோய், மலர்களுக்கு முன்னால் நாணிக் கிடக்கின்றன"

// <div><span class="content">${
//   poem.number
// }</span></div>
