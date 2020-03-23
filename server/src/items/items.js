const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const upload = multer({dest:'tmp_uploads/'})
const db = require(__dirname + '/../db_connect')
const itemRouter = express.Router()

// const app = express()
// app.set('view engine', 'ejs')
itemRouter.use(bodyParser.urlencoded({extended: false}))
itemRouter.use(bodyParser.json())
// const db = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'aqua'
// })
// db.connect()
// bluebird.promisifyAll(db)



// 商品列表
itemRouter.get('/items', (req, res)=>{
    console.log('商品列表請求')
    const perPage = 16
    let where = []
    if (req.query.category) where.push(`\`itemCategoryId\` ='${req.query.category}'`)
    if (req.query.brand) where.push(`\`itemBrandId\` ='${req.query.brand}'`)
    if (req.query.price) where.push(`\`itemPrice\` > '${req.query.price.split(",")[0]}' AND \`itemPrice\` < '${req.query.price.split(",")[1]}'`)
    if(where.length>0){where = 'AND '+where.join(' AND ')}else{where=''}
    
    
    let totalRows, totalPages
    let page = req.query.page ? parseInt(req.query.page) : 1

    const total = `SELECT COUNT(DISTINCT \`itemName\`) num FROM \`items\` WHERE \`itemStatus\` = 'active' ${where}`
    db.queryAsync(total)
        .then(result=>{
            totalRows = result[0].num
            if ( totalRows===0 ) {
                return false
            } else {
                totalPages = Math.ceil(totalRows/perPage)
                if (page<1) page= 1
                if (page>totalPages) page = totalRows
                    
                const sql = `SELECT MIN(\`itemId\`) AS itemId, \`itemName\`, \`itemImg\`, \`itemCategoryId\`, \`itemTypeId\`, \`itemBrandId\`, \`itemPrice\`  FROM \`items\` WHERE \`itemStatus\` = 'active' ${where} GROUP BY \`itemName\` ORDER BY \`updated_at\` DESC LIMIT  ${(page-1)*perPage}, ${perPage}`

                return db.queryAsync(sql)
            }
        })
        .then(result=>{
           if (result.length>0) {
                res.json({
                    'status': 200,
                    'msg': '請求成功',
                    totalRows,
                    totalPages,
                    page,
                    result
                })
            } else{
                res.status(404).json({
                    'status': 404,
                    'msg': '查無符合條件'
                })
           }
        })
        .catch(err=>{
            console.log(err)
            return res.status(500).json(err)
        })
})
// 商品列側欄資料
itemRouter.get('/itemaside', (req, res)=>{
    console.log('商品列側欄請求')

    const data = {
        'status': 404,
        'msg' :　'查無資料',
        'asideData' : '',
    }
    const brandSQL = `SELECT DISTINCT \`itemBrandId\` FROM \`items\` ORDER BY \`itemBrandId\` ASC` 
    db.queryAsync(brandSQL)
        .then(result=>{
            if (result) {
                data.status = 200
                data.msg = '請求成功'
                data.asideData = result
                res.json(data)
            } else {
                res.json(data)
            }
        })
})

// 商品詳細資料
itemRouter.get('/items/:itemId', (req,res)=>{
    const itemId = req.params.itemId
    console.log('商品詳細請求', itemId)
    const data = {
        'status' : 404,
        'msg': '查無商品',
        'sellerData': '',
        'itemData': ''
    }
    const itemSQL = `SELECT * FROM \`items\` WHERE \`itemId\` = '${itemId}'`
    db.queryAsync(itemSQL)
        .then(result=>{
            if ( result[0] === undefined ) {
                return false
            } else {
                data.itemData = result
                return db.queryAsync(itemSQL)
            }
        })
        .then(result=>{
            if (result) {
                data.status = 200
                data.msg = '請求成功'
                res.json(data)
           }
        })
        .catch(err=>{
            console.log(err)
            return res.json(err)
        })
})

// 訂單列表
itemRouter.get('/member/orders', (req, res)=>{
    console.log('賣家訂單列表請求')
    const perPage = 10
    let where = []
    const memberSession = req.session.memberId
    if (req.query.memberId) {
        where.push(`\`orderMemberId\` = '${req.query.memberId}'`)
    }
    if(where.length>0){where = 'WHERE '+where.join(' AND ')}else{where=''}

    let totalRows, totalPages
    let page = req.query.page ? parseInt(req.query.page) : 1

    const total = `SELECT COUNT(1) num FROM \`orders\` ${where}`
    db.queryAsync(total)
        .then(result=>{
            totalRows = result[0].num
            if ( totalRows===0 ) {
                return false
            } else {
                totalPages = Math.ceil(totalRows/perPage)
                if (page<1) page= 1
                if (page>totalPages) page = totalRows
                    
                const sql = `SELECT \`orders\`.\`orderItemId\`, \`orders\`.\`checkPrice\`, \`orders\`.\`checkQty\`, \`orders\`.\`checkSubtotal\`, \`orders\`.\`updated_at\`, \`items\`.\`itemSize\`, \`items\`.\`itemSellerId\`, \`basic_information\`.\`seller_name\`
                FROM \`orders\` 
                LEFT JOIN \`items\` 
                ON \`orders\`.\`orderItemId\` = \`items\`.\`itemId\` 
                LEFT JOIN \`basic_information\`
                ON \`items\`.\`itemSellerId\` = \`basic_information\`.\`seller_id\`
                ${where} 
                ORDER BY \`updated_at\` DESC 
                LIMIT  ${(page-1)*perPage}, ${perPage}`

                return db.queryAsync(sql)
            }
        })
        .then(result=>{
            if (result.length>0) {
                res.json({
                    totalRows,
                    totalPages,
                    page,
                    rows: result
                })
           } else{
                res.json({
                    'status' : 404,
                    'msg': '查無符合條件'
                })
           }
        })
        .catch(err=>{
            console.log(err)
            return res.json(err)
        })
    
})

// 訂單新增
itemRouter.post('/member/mycart', upload.none(), (req, res)=>{
    console.log('賣家訂單新增')
    const sql = `INSERT INTO \`orders\`(
                \`orderId\`, 
                \`orderMemberId\`, 
                \`orderItemId\`, 
                \`checkPrice\`, 
                \`checkQty\`, 
                \`checkSubtotal\`) 
                VALUES (?,?,?,?,?,?)`

    db.queryAsync(sql, [
        req.body.itemName,
        req.session.memberId, // mamber session
        req.body.orderItemId,
        req.body.checkPrice,
        req.body.checkQty,
        req.body.checkSubtotal
    ])
    .then(r=>{
        console.log('新增訂單成功')
        return res.json(req.body)
        // res.redirect(req.baseUrl + '/list')
    })
    .catch(err=>{
        console.log('新增資料寫入失敗')
        return res.json(err)
    })

})

//訂單明細新增
itemRouter.post('/member/checkout', upload.none(), (req, res)=>{
    console.log('賣家訂單明細新增')
    const sql = `INSERT INTO \`orders\`(
                \`orderId\`, 
                \`orderMemberId\`, 
                \`orderItemId\`, 
                \`checkPrice\`, 
                \`checkQty\`, 
                \`checkSubtotal\`) 
                VALUES (?,?,?,?,?,?)`

    db.queryAsync(sql, [
        req.body.itemName,
        req.session.memberId, // mamber session
        req.body.orderItemId,
        req.body.checkPrice,
        req.body.checkQty,
        req.body.checkSubtotal
    ])
    .then(r=>{
        console.log('新增訂單成功')
        return res.json(req.body)
        // res.redirect(req.baseUrl + '/list')
    })
    .catch(err=>{
        console.log('新增資料寫入失敗')
        return res.json(err)
    })

})



// 訂單列表(賣家端)
itemRouter.get('/seller/orders', (req, res)=>{
    console.log('賣家訂單列表請求')
    const data = {
        'status' : '404',
        'msg' : '尚未登入'
    }
    if ( !req.session.seller_id ) {
        res.json(data)
    } else {
        const perPage = 10
        let where = []
        const memberSession = req.session.memberId
        if (req.query.memberId) {
            where.push(`\`orderMemberId\` = '${req.query.memberId}'`)
        }
        if(where.length>0){where = 'WHERE '+where.join(' AND ')}else{where=''}
    
        let totalRows, totalPages
        let page = req.query.page ? parseInt(req.query.page) : 1
    
        const total = `SELECT COUNT(1) num FROM \`orders\` ${where}`
        db.queryAsync(total)
            .then(result=>{
                totalRows = result[0].num
                if ( totalRows===0 ) {
                    return false
                } else {
                    totalPages = Math.ceil(totalRows/perPage)
                    if (page<1) page= 1
                    if (page>totalPages) page = totalRows
                        
                    const sql = `SELECT \`orders\`.\`orderItemId\`, \`orders\`.\`checkPrice\`, \`orders\`.\`checkQty\`, \`orders\`.\`checkSubtotal\`, \`orders\`.\`updated_at\`, \`items\`.\`itemSize\`, \`items\`.\`itemSellerId\`, \`basic_information\`.\`seller_name\`
                    FROM \`orders\` 
                    LEFT JOIN \`items\` 
                    ON \`orders\`.\`orderItemId\` = \`items\`.\`itemId\` 
                    LEFT JOIN \`basic_information\`
                    ON \`items\`.\`itemSellerId\` = \`basic_information\`.\`seller_id\`
                    ${where} 
                    ORDER BY \`updated_at\` DESC 
                    LIMIT  ${(page-1)*perPage}, ${perPage}`
    
                    return db.queryAsync(sql)
                }
            })
            .then(result=>{
                if (result.length>0) {
                    res.json({
                        totalRows,
                        totalPages,
                        page,
                        rows: result
                    })
               } else{
                    res.json({
                        'status' : 404,
                        'msg': '查無符合條件'
                    })
               }
            })
            .catch(err=>{
                console.log(err)
                return res.json(err)
            })

    }


    
})

































// 賣家新增商品
itemRouter.post('/seller/iteminsert', upload.none(), (req, res)=>{
    // res.json(req.body)
    // 先檢查輸入
    
    const sql = `INSERT INTO \`items\`(
                \`itemName\`, 
                \`itemImg\`, 
                \`itemCategoryId\`, 
                \`itemTypeId\`, 
                \`itemDescription\`, 
                \`itemMaterial\`, 
                \`itemBrandId\`, 
                \`itemSellerId\`, 
                \`itemStatus\`, 
                \`itemSize\`, 
                \`itemPrice\`, 
                \`itemQty\`) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`

    db.queryAsync(sql, [
        req.body.itemName,
        req.body.itemImg,
        req.body.itemCategoryId,
        req.body.itemTypeId,
        req.body.itemDescription,
        req.body.itemMaterial,
        req.body.itemBrandId,
        req.body.itemSellerId,
        req.body.itemStatus,
        req.body.itemSize,
        req.body.itemPrice,
        req.body.itemQty
    ])
    .then(r=>{
        console.log('新增資料寫入成功')
        return res.json(req.body)
        // res.redirect(req.baseUrl + '/list')
    })
    .catch(err=>{
        console.log('新增資料寫入失敗')
        return res.json(err)
    })

})

// 賣家修改商品
itemRouter.get('/seller/itemedit/:itemId', (req, res)=>{
    console.log('賣家修改')
    const itemId = req.params.itemId
    const sql = `SELECT 
                \`itemName\`, 
                \`itemImg\`, 
                \`itemCategoryId\`, 
                \`itemTypeId\`, 
                \`itemDescription\`, 
                \`itemMaterial\`, 
                \`itemBrandId\`, 
                \`itemSellerId\`, 
                \`itemStatus\`, 
                \`itemSize\`, 
                \`itemPrice\`, 
                \`itemQty\`
                FROM \`items\` WHERE \`itemId\`='${itemId}'`

    db.queryAsync(sql)
        .then(r=>{
            return res.status(200).json(r)
            // res.render('edit', {row: r[0]})
        })
        .catch(err=>{
            return res.status(500).json(err)
        })
})
itemRouter.post('/seller/itemedit/:itemId', upload.none(), (req, res)=>{
    const sql = `UPDATE \`items\` SET 
                \`itemName\`=?,
                \`itemImg\`=?,
                \`itemCategoryId\`=?,
                \`itemTypeId\`=?,
                \`itemDescription\`=?,
                \`itemMaterial\`=?,
                \`itemBrandId\`=?,
                \`itemStatus\`=?,
                \`itemSize\`=?,
                \`itemPrice\`=?,
                \`itemQty\`=? WHERE \`itemId\`=?`
    
    db.queryAsync(sql, [
        req.body.itemName,
        req.body.itemImg,
        req.body.itemCategoryId,
        req.body.itemTypeId,
        req.body.itemDescription,
        req.body.itemMaterial,
        req.body.itemBrandId,
        req.body.itemStatus,
        req.body.itemSize,
        req.body.itemPrice,
        req.body.itemQty,
        req.params.itemId
    ])
    .then(r=>{
        console.log('修改資料更新成功')
        return res.json(req.body)
        // res.redirect(req.baseUrl + '/list')
    })
    .catch(err=>{
        console.log('修改資料更新失敗')
        return res.json(err)
    })
})
// 賣家刪除商品
itemRouter.post('/seller/itemdelete/:itemId', upload.none(), (req, res)=>{
    const sql = `UPDATE \`items\` SET 
    \`itemStatus\`='deleted' WHERE \`itemId\`=?`
    
    db.queryAsync(sql, [req.params.itemId])
    .then(r=>{
        console.log('刪除狀態更新成功')
        return res.json(r)
        // res.redirect(req.baseUrl + '/list')
    })
    .catch(err=>{
        console.log('刪除狀態更新失敗')
        return res.json(err)
    })
})
// 賣家批次更改商品狀態
itemRouter.post('/seller/itemupdate', upload.none(), (req, res)=>{
    const sql = `UPDATE \`items\` SET 
    \`itemStatus\`=? WHERE \`itemId\`=?`
    
    db.queryAsync(sql, [
        req.body.itemStatus,
        req.body.itemId[i]
    ])
    .then(r=>{
        console.log('刪除狀態更新成功')
        return res.json(r)
        // res.redirect(req.baseUrl + '/list')
    })
    .catch(err=>{
        console.log('刪除狀態更新失敗')
        return res.json(err)
    })
})

// 賣家查詢商品
itemRouter.get('/seller/itemlist', (req, res)=>{
    console.log('進入列表')
    const data = {
        'msg' :　'查無資料',
        'rows' :　0,
        'itemData' : ''
    }
    const perPage = 16
    let where = []
    if(req.query.status) where.push(`\`itemStatus\` ='${req.query.status}'`)
    if(where.length>0){where = 'WHERE '+where.join(' AND ')}else{where=''}

    let totalRows, totalPages
    let page = req.params.page ? parseInt(req.params.page) : 1

    const total = `SELECT COUNT(1) num FROM \`items\` ${where}`
    db.queryAsync(total)
        .then(result=>{
            totalRows = result[0].num
            totalPages = Math.ceil(totalRows/perPage)
            // res.json(result)
            if (page<1) page= 1
            if (page>totalPages) page = totalRows
            const sql = `SELECT * FROM \`items\` ${where} ORDER BY \`updated_at\` DESC LIMIT  ${(page-1)*perPage}, ${perPage}`
            
            data.rows = totalRows
            return db.queryAsync(sql)
        })
        .then(result=>{
            if (result) {
                data.msg = '請求成功'
                data.itemData = result
                res.status(200).json(data)
            } else {
                res.status(404).json(data)
            }
        })
        .catch(err=>{
            console.log('刪除狀態更新失敗')
            return res.status(500).json(err)
        })
    
})


module.exports = itemRouter