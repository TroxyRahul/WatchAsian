export const WELCOME_BANNER = `
        
██     ██  █████  ████████  ██████ ██   ██      █████  ███████ ██  █████  ███    ██ 
██     ██ ██   ██    ██    ██      ██   ██     ██   ██ ██      ██ ██   ██ ████   ██ 
██  █  ██ ███████    ██    ██      ███████     ███████ ███████ ██ ███████ ██ ██  ██ 
██ ███ ██ ██   ██    ██    ██      ██   ██     ██   ██      ██ ██ ██   ██ ██  ██ ██ 
 ███ ███  ██   ██    ██     ██████ ██   ██     ██   ██ ███████ ██ ██   ██ ██   ████ 
                                                                                                                                                                                                                                                                                                                                                           
Author: Hritik R (https://github.com/HritikR)
Version: 1.0.0
`

export const printWelcome = () => {
    console.log(WELCOME_BANNER);
}

export const logger = {
    info: (message) => {
        console.info(`○ [${new Date().toLocaleString()}] INFO: ${message}`);
    },
    warn: (message) => {
        console.warn(`○ [${new Date().toLocaleString()}] WARN: ${message}`);
    },
    error: (message) => {
        console.error(`○ [${new Date().toLocaleString()}] ERROR: ${message}`);
    }
}