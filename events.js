
document.addEventListener('DOMContentLoaded', function() {
    const insertButton = document.getElementById('insertButton');
    const insertInput = document.getElementById('insertInput');
    const canvas = document.getElementById('canvas');

    insertButton.addEventListener('click', function() {
        // Get the value from the input
        let inputValue = insertInput.value;

        // Get the selected maximum degree value
        let maxDegree = document.querySelector('input[name="degree"]:checked').value;

        // Limit the input value to the maximum degree
        inputValue = inputValue.substring(0, maxDegree);

        // Create a new box element
        const box = document.createElement('div');
        box.className = 'tree-box';
        box.textContent = inputValue;

        // Style the box (you can also move this to your CSS file)
        box.style.display = 'inline-block';
        box.style.margin = '5px';
        box.style.padding = '10px';
        box.style.border = '1px solid black';
        box.style.backgroundColor = '#043C28';
        box.style.textAlign = 'center';
        box.style.color = 'black';

        // Append the box to the canvas
        canvas.appendChild(box);

        // Clear the input field
        insertInput.value = '';
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const title = document.getElementById('bodyTitle');

    // Fade-in the title in 3 seconds
    setTimeout(() => {
        title.classList.add('show-title');
    }, 100);

    // Delay the fade-in of the main content (6 seconds for title fade-in + 2 more seconds)
    setTimeout(() => {
        document.body.style.overflow = 'auto'; // Enable scrolling
    }, 3100);
});

// Fade-in the main content when scrolling down
window.addEventListener('scroll', function () {
    const main = document.getElementById('bodyMain');
    const mainPosition = main.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3; // Trigger point for fade-in

    if (mainPosition < screenPosition) {
        main.classList.add('show-main');
    }
});



const canvas = document.getElementById('canvas');                       //canvas is where everything is printed
let tree = new BPlusTree(3);

const createTree = (degree) => {                                        // Function to create a new B+ Tree with the specified degree
     tree = new BPlusTree(degree);
    canvas.innerHTML = "The B+ Tree elements will be depicted here!";
};

const handleDegreeChange = () => {                                      // Function to handle degree change
    const degreeRadio = document.querySelector('input[name="degree"]:checked');
    createTree(degreeRadio.value);
};

const handleInputTypeChange = () => {                                   // Function to handle input type change
    const degreeRadio = document.querySelector('input[name="degree"]:checked');
    createTree(degreeRadio.value);
};

document.getElementById('maxDegree').addEventListener('change', handleDegreeChange);
document.getElementById('inputType').addEventListener('change', handleInputTypeChange);

const insBut = document.getElementById('insertButton');
const delBut = document.getElementById('deleteButton');
const findBut = document.getElementById('findButton');
const findRangeBut = document.getElementById('findRangeButton');
const clearBut = document.getElementById('clearButton');
const getInputValue = (inputId) => {                                //This returns the type of values the tree has(numbers or characters)
    const value = document.getElementById(inputId).value;
    if (document.getElementById('Num').checked) {
        return parseInt(value, 10);
    }
    return value;
};

insBut.addEventListener('click', () => {
    if (document.getElementById('insertInput').value == "") {       // Do nothing if the input is empty
        return;
    }
    const insInp = getInputValue('insertInput');
    tree.insert(insInp);
    tree.printCanvas();
    document.getElementById('insertInput').value = "";
});

delBut.addEventListener('click', () => {
    if (document.getElementById('deleteInput').value == "") {       // Do nothing if the input is empty
        return;
    }
    const delInp = getInputValue('deleteInput');
    tree.delete(delInp);
    tree.printCanvas();
    document.getElementById('deleteInput').value = "";
});

findBut.addEventListener('click', () => {
    if (document.getElementById('findInput').value == "") {       // Do nothing if the input is empty
        return;
    }
    const findInp = getInputValue('findInput');
    tree.find(findInp);
    if(tree.find(findInp) != null){
        window.alert("The value '" + findInp + "' exists in the B+ Tree");
    }
    else{
        window.alert("The value '" + findInp + "' does not exist in the B+ Tree");
    }
    tree.printCanvas();
    document.getElementById('findInput').value = "";
});

findRangeBut.addEventListener('click', () => {
    if (document.getElementById('findInputRangeLower').value == "" || document.getElementById('findInputRangeUpper').value == "") {       // Do nothing if the input is empty
        return;
    }
    const findInpLow = getInputValue('findInputRangeLower');
    const findInpUpp = getInputValue('findInputRangeUpper');
    canvas.innerHTML += "<br>";
    canvas.innerHTML += "The numbers in the B+ Tree in this range are: " + tree.findRange(findInpLow,findInpUpp);
    document.getElementById('findInputRangeLower').value = "";
    document.getElementById('findInputRangeUpper').value = "";
});

clearBut.addEventListener('click', () => {
    if(tree.isEmpty){
        return;
    }
    tree.clearTree();
});

