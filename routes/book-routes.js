const express = require('express');
const router = express.Router();
const jsonDB = require('../modules/book-modules');

//API สำหรับดึงข้อมูลรายการหนังสือทั้งหมด 
router.get('/', async (req, res, next) => {
    try {
      const books = await jsonDB.readDataFile();
      res.json(books);
    } catch (err) {
      next(err);
    }
  });

  //สามารถค้นหา เฉพาะหมวดหนังสือที่ส่งค่าไปได้ (เช่น category =  Kids)
  router.get('/category/:category', (req, res) => {

    const data = jsonDB.readDataFile(); 
    const categorys = req.params.category; 
    const filteredData = data.filter(item => item.category === categorys);
    if (filteredData.length!=0) {
      res.json({ result: filteredData });
    }else if(filteredData.length == 0){
      res.json({ message: 'ไม่พบข้อมูลที่คุณค้นหา' });
    }else {
      res.status(404).json({ message: 'ไม่พบข้อมูลที่คุณค้นหา' });
    }
  });

  //API สำหรับดึงข้อมูลหนังสือเฉพาะ book id ที่ส่งเข้ามา 
  router.get('/searchbook/:book_id', (req, res) => {
    const data = jsonDB.readDataFile(); 
    const book_id = parseInt(req.params.book_id); 
    const filteredData = data.filter(item => item.book_id === book_id);
  
    if (filteredData.length!=0) {
      res.json({ result: filteredData });
    }else if(filteredData.length == 0){
      res.json({ message: 'ไม่พบข้อมูลที่คุณค้นหา' });
    }else {
      res.status(404).json({ message: 'ไม่พบข้อมูลที่คุณค้นหา' });
    }
  });

  //API สำหรับเพิ่มข้อมูลหนังสือ
  router.post('/add', (req, res) => { 
    const data = jsonDB.readDataFile();
    const maxId = Math.max(...data.map(item => item.book_id));
    const category =req.body.category;
    const book_name =req.body.book_name;
    const description =req.body.description;
    const detail =req.body.detail;
    if(category!= undefined && book_name != undefined && description!= undefined && detail!= undefined ){
      const newBook = {
        book_id: maxId + 1,
        category:category,
        book_name:book_name,
        description: description,
        detail:detail, 
      };
      data.push(newBook);
      jsonDB.writeDataFile(data);
      res.json({ message: 'เพิ่มข้อมูลสำเร็จ', Result: newBook})
    }else{
      res.json({ message: 'กรุณากรอกข้อมูลให้ครบ'})
    }
  });

  //API สำหรับแก้ไขข้อมูลหนังสือเฉพาะ book id ที่ส่งเข้ามา
  router.put('/edit/:id', (req, res) => {
    const data = jsonDB.readDataFile(); 
    const book_id = parseInt(req.params.id);
    const indexbook= data.findIndex(item => item.book_id === book_id);
    if(indexbook== -1){
      res.json('หาข้อมูลไม่เจอ')
    }else{
      
      data[indexbook].category = (req.body.category!= undefined ? req.body.category:data[indexbook].category);
      data[indexbook].book_name = (req.body.book_name!= undefined ? req.body.book_name:data[indexbook].book_name);
      data[indexbook].description = (req.body.description!= undefined ? req.body.description:data[indexbook].description);
      data[indexbook].detail = (req.body.detail!= undefined ? req.body.detail:data[indexbook].detail) ;
      jsonDB.writeDataFile(data);
      res.json({ message: 'แก้ไขข้อมูลสำเร็จ', Result: data[indexbook]})
      }    
  });


  //API สำหรับลบข้อมูลหนังสือเฉพาะ book id ที่ส่งเข้ามา
  router.delete('/deletebook/:book_id', (req, res) => {
    const data = jsonDB.readDataFile(); 
    const book_id = parseInt(req.params.book_id); 
    const indexbook= data.findIndex(item => item.book_id === book_id);
    console.log(indexbook);
    if (indexbook !== -1){
      data.splice(indexbook, 1);
      jsonDB.writeDataFile(data);
      res.json({ message: 'ลบข้อมูลสำเร็จ' });
    }else {
      res.status(404).json({ message: 'ไม่พบหนังสือที่ต้องการลบ' });
    }
  });

  
  //API สำหรับสรุปจำนวนหนังสือตามหมวดหนังสือ
  router.get('/reportcategory', (req, res) => {
    const data = jsonDB.readDataFile(); 
    const categoryCounts = {};
    data.forEach(book_id => {
      if (book_id.category) {
        if (categoryCounts[book_id.category]) {
          categoryCounts[book_id.category]++;
        } else {
          categoryCounts[book_id.category] = 1;
        }
      }
    });
    // ส่งข้อมูลสรุปในรูปแบบ JSON
    res.json(categoryCounts);
  
  });
  module.exports = router;
