const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindow() {
    // Get the primary display's work area size
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    // Define the window width and calculate the x-coordinate to position it on the right side
    const windowWidth = 700; // Adjust this value as desired
    const windowX = width - windowWidth; // Align the window to the right edge of the screen

    // Create the browser window with specified dimensions and position
    const mainWindow = new BrowserWindow({
        x: windowX,
        y: 0,
        width: windowWidth,
        height: height,
        webPreferences: {
            title: 'Match&Compare',
            preload: path.join(__dirname, 'preload.js'), // Optional, if needed for security
            nodeIntegration: true,
            contextIsolation: false, // Set to true for better security when using `preload.js`
            frame: false,
            autoHideMenuBar: true,
        }
    });

    mainWindow.setMenu(null);
    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});