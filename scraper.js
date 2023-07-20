const ws = new WebSocket("ws://localhost:8000")
let requests = []

ws.onopen = function () {
    console.log("Connected to the server.");
};

ws.onclose = function () {
    console.log('Connection was closed')
}

ws.onmessage = function (e) {
    const { sender, message } = JSON.parse(e.data)
    console.log("New prompt:", message);

    if (isBlocked()) {
        openNewChat()
    }

    setTimeout(() => {
        writeGPTPrompt(message)

        setTimeout(() => {
            waitAndgetResultOfPrompt(res => {
                if (res) {
                    console.log('scraper: Responsing with data')
                    ws.send(JSON.stringify({
                        sender: 'scraper',
                        message: res,
                        error: 0,
                    }))
                } else {
                    console.log('scraper: Responsing with error')
                    ws.send(JSON.stringify({
                        sender: 'scraper',
                        message: null,
                        error: 1
                    }))
                }
            })
        }, 100)
    }, 100)

};


function waitAndgetResultOfPrompt(cb) {
    if (!isProcessing()) {

        if (isBlocked()) {
            cb(null)
            return
        }

        console.log('scraper: Getting prompt result')
        const allDescriptions = document.querySelectorAll('.markdown.prose.w-full>p')
        const lastDescriptionElement = allDescriptions[allDescriptions.length - 1]
        const description = lastDescriptionElement.textContent
        lastDescriptionElement.remove()
        cb(description)
        return
    }
    setTimeout(() => waitAndgetResultOfPrompt(cb), 200)
}

function writeGPTPrompt(prompt) {
    console.log('scraper: Writing new prompt')
    const input = document.querySelector('textarea')
    input.value = prompt
    input.dispatchEvent(new Event('input', { bubbles: true }));
    setTimeout(() => {
        document.querySelector('.absolute.p-1.rounded-md').click()
    }, 100)
}

function openNewChat() {
    console.log('scraper: Opening new chat')
    document.querySelector('a.flex').click()
}

function isProcessing() {
    return document.body.contains(document.querySelector('.text-2xl'))
}

function isBlocked() {
    return document.body.contains(document.querySelector('.py-2.px-3.border.text-gray-600'))
}

function run() {
    const initPrompt = 'comece uma conversa comigo sem escrever muito e escreva uma frase me avisando para não escrever respostas com mais de 20 palavras, além disso não faça perguntas sobre emoções ou coisas pessoais. E se precisar pode me fazer perguntas sobre assuntos diversos como: politica, ciencia, ou outros assuntos interessantes.    '
    setTimeout(() => {
        writeGPTPrompt(initPrompt)

        setTimeout(() => {
            waitAndgetResultOfPrompt(res => {
                if (res) {
                    console.log('scraper: Responsing with data')
                    ws.send(JSON.stringify({
                        sender: 'scraper',
                        message: res,
                        error: 0,
                    }))
                } else {
                    console.log('scraper: Responsing with error')
                    ws.send(JSON.stringify({
                        sender: 'scraper',
                        message: null,
                        error: 1
                    }))
                }
            })
        }, 100)
    }, 100)
}