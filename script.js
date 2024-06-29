const inputslider = document.querySelector("[data-lengthslider]");
const lengthdisplay = document.querySelector("[data-lengthnumber]");
const passwordDisplay = document.querySelector("[data-passworddisplay]");
const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copymsg]");
const uppercheck = document.querySelector("#uppercase");
const lowercheck = document.querySelector("#lowercase");
const numbcheck = document.querySelector("#Number");
const symbolcheck = document.querySelector("#Symbol");
const indicator = document.querySelector("[data-indicator]");
const generatorbtn = document.querySelector(".generate-password");
const allcheckboxes = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()_+:"?><,./[];-=';

let password = "";
let passwordlength = 10;
let checkcount = 0;

function handleslider() {
    inputslider.value = passwordlength;
    lengthdisplay.innerText = passwordlength;
}

handleslider();


function setindicator(color) {
    indicator.style.backgroundColor = color;
}

function getrndinteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generterndnumber() {
    return getrndinteger(0, 9);
}

function generatelower() {
    return String.fromCharCode(getrndinteger(97, 122));
}

function generateupper() {
    return String.fromCharCode(getrndinteger(65, 90));
}

function generatesymbol() {
    const randnum = getrndinteger(0, symbols.length - 1);
    return symbols.charAt(randnum);
}

function calcstrength() {
    let hasupper = false;
    let haslower = false;
    let hasnum = false;
    let hassym = false;
    if (uppercheck.checked) hasupper = true;
    if (lowercheck.checked) haslower = true;
    if (numbcheck.checked) hasnum = true;
    if (symbolcheck.checked) hassym = true;

    if (hasupper && haslower && (hasnum || hassym) && passwordlength >= 8) {
        setindicator("#0f0");
    } else if ((haslower || hasupper) && (hasnum || hassym) && passwordlength >= 6) {
        setindicator("#ff0");
    } else {
        setindicator("#f00");
    }
}

async function copycontent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    // Check if array is provided and is an array
    if (!Array.isArray(array)) {
        console.error("Invalid input. Please provide an array.");
        return;
    }

    // Perform Fisher-Yates Shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at i and j
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function handleCheckBoxChange() {
    checkcount = 0;
    allcheckboxes.forEach((checkbox) => {
        if (checkbox.checked) checkcount++;
    });
    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        handleslider();
    }
}

allcheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputslider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleslider();
});

// copybtn.addEventListener('click', () => {
//     if (passwordDisplay.value)
//         copycontent();
// });

generatorbtn.addEventListener('click', () => {
    if (checkcount == 0) return;
    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        handleslider();
    }
    password = "";
    let funcarr = [];
    if (uppercheck.checked) {
        funcarr.push(generateupper);
    }
    if (lowercheck.checked) {
        funcarr.push(generatelower);
    }
    if (numbcheck.checked) {
        funcarr.push(generterndnumber);
    }
    if (symbolcheck.checked) {
        funcarr.push(generatesymbol);
    }
    for (let i = 0; i < funcarr.length; i++) {
        password += funcarr[i]();
    }
    console.log("compulsory done");
    for (let i = 0; i < passwordlength - funcarr.length; i++) {
        let randIndex = getrndinteger(0, funcarr.length - 1);
        password += funcarr[randIndex]();
    }
    console.log("all done");
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    console.log("shuffle");

    calcstrength();
});
