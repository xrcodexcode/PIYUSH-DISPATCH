const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'assets', 'daily-node-11');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const brainDir = 'C:\\Users\\offic\\.gemini\\antigravity-cli\\brain\\c72b1f00-5937-49fa-9d43-071d7a3b6028';
const srcDir9 = path.join(__dirname, '..', 'public', 'assets', 'daily-node-9');

// Copy generated workstation image as 1.jpg and hero.jpg
const generated1 = path.join(brainDir, 'cron_workstation_night_1787152950308.jpg');
if (fs.existsSync(generated1)) {
  fs.copyFileSync(generated1, path.join(targetDir, '1.jpg'));
  fs.copyFileSync(generated1, path.join(targetDir, 'hero.jpg'));
  console.log('Copied generated 1.jpg & hero.jpg');
} else if (fs.existsSync(path.join(srcDir9, '1.jpg'))) {
  fs.copyFileSync(path.join(srcDir9, '1.jpg'), path.join(targetDir, '1.jpg'));
  fs.copyFileSync(path.join(srcDir9, '1.jpg'), path.join(targetDir, 'hero.jpg'));
}

// Copy generated alarm clock as 2.jpg
const generated2 = path.join(brainDir, 'cron_alarm_terminal_1787153026326.jpg');
if (fs.existsSync(generated2)) {
  fs.copyFileSync(generated2, path.join(targetDir, '2.jpg'));
  console.log('Copied generated 2.jpg');
} else if (fs.existsSync(path.join(srcDir9, '2.jpg'))) {
  fs.copyFileSync(path.join(srcDir9, '2.jpg'), path.join(targetDir, '2.jpg'));
}

// Copy 3.jpg, 4.jpg, 5.jpg from source
if (fs.existsSync(path.join(srcDir9, '3.jpg'))) {
  fs.copyFileSync(path.join(srcDir9, '3.jpg'), path.join(targetDir, '3.jpg'));
  console.log('Copied 3.jpg');
}
if (fs.existsSync(path.join(srcDir9, '4.jpg'))) {
  fs.copyFileSync(path.join(srcDir9, '4.jpg'), path.join(targetDir, '4.jpg'));
  console.log('Copied 4.jpg');
}
if (fs.existsSync(path.join(srcDir9, '5.jpg'))) {
  fs.copyFileSync(path.join(srcDir9, '5.jpg'), path.join(targetDir, '5.jpg'));
  console.log('Copied 5.jpg');
}

console.log('Daily node 11 assets setup complete!');
