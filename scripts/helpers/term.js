const message = async (msg, color, clear=true) => {
    if (clear) terminal.clear()
    const fn = color ? terminal[color]: terminal 
    fn(`\n${msg}\n`)
}
const promptFields = async () => {
    terminal.grabInput(true);
    terminal.bold.cyan('Name: ');
    const name = await terminal.inputField({
        echo: true, 
        prompt: 'name: '
    }).promise;
    console.log()
    terminal.bold.cyan('Alignment: ');
    const alignment = await terminal.inputField({
        echo: true,
        prompt: 'alignment (left|center|right)-(top|center|bottom): '
    }).promise;
    terminal.grabInput(false);
    return { name, alignment };
};

const promptAccept = async (msg, noFirst) => {
    terminal.bold.green(`\n${msg}\n`)
    const options = ['Yes', 'No']
    const addAnother = await terminal.singleColumnMenu(noFirst ? options.reverse(): options).promise;
    return addAnother.selectedText === 'Yes';
};
const getChoice = async (choices, msg) => {
    if (msg) message(`\n${msg}\n`, "cyan")
    else console.log()

    return (await terminal.singleColumnMenu(choices).promise).selectedText;
}

module.exports = {
    getChoice, promptAccept, message, promptFields
}