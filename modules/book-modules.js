const fs = require('fs');
const filePath = 'db.json'
function readDataFile() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอ่านไฟล์:', error);
    return [];
  }
}

// เขียนข้อมูลลงในไฟล์ JSON
function writeDataFile(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเขียนไฟล์:', error);
  }
}

module.exports = {
  readDataFile,
  writeDataFile,
};