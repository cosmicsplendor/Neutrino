const term = require('terminal-kit').terminal;

async function testMenu() {
    term.grabInput(true); // Enable raw mode for terminal input

    console.log('Prompting for selection...');
    const menu = await term.singleColumnMenu(['Yes', 'No'], {
        title: 'Would you like to add another object?'
    }).promise;

    console.log('Got selected menu option:', menu.selectedText);

    // Reset terminal and exit
    term.grabInput(false);
    process.exit();
}

testMenu();
