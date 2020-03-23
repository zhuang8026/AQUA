import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import '../../style/CW_items.scss'
// import { userRegisterAsync } from '../actions/index'

import { getItemDetailDataAsync } from '../../actions/item/item_Actions'

//引入元件
import Header from '../../components/Header'
import Banner from '../../components/Banner'
// import Breadcrumb from '../../components/item/Breadcrumb'

function ItemDetail(props) {
  const [mycart, setMycart] = useState([])
  const [itemData, setItemData] = useState({})
  const [hasloading, setHasLoading] = useState(false)

  async function updateCartToLocalStorage(value) {
    setHasLoading(true)

    const currenyCart = JSON.parse(localStorage.getItem('cart')) || []

    console.log('currentCart', currenyCart)

    const newCart = [...currenyCart, value]
    localStorage.setItem('cart', JSON.stringify(newCart))

    console.log('newCart', newCart)
  }

  useEffect(() => {
    const itemId = props.match.params.itemId
    props.getItemDetailDataAsync(itemId)
  }, [])

  useEffect(() => {
    setHasLoading(true)

    setTimeout(() => {
      if (props.itemDetailData.status) {
        setHasLoading(false)
        setItemData(props.itemDetailData.itemData)
      }
    }, 500)
  }, [props.itemDetailData])
  const itemDetailData = props.itemDetailData.itemData
  console.log(itemDetailData, itemData.itemName)
  return (
    <>
      <Header />
      <Banner BannerImgSrc="./images/ClassBanner.jpg" />
      <div className="container CW">
        <div className="row CW-itemDetail">
          <div className="col-12 detail-header">{/* <Breadcrumb /> */}</div>
          <div className="row detail-main">
            <div className="col-md-2 lightbox-aside">
              <img
                className="lightbox-aside-img"
                src="http://127.0.0.1:5000/images/itemImg/test-item.jpg"
                alt=""
              />
              <img
                className="lightbox-aside-img"
                src="http://127.0.0.1:5000/images/itemImg/test-item.jpg"
                alt=""
              />
              <img
                className="lightbox-aside-img"
                src="http://127.0.0.1:5000/images/itemImg/test-item.jpg"
                alt=""
              />
            </div>
            <div className="col-md-6 order-md-0 lightbox-main">
              <img
                className="lightbox-main-img"
                src="http://127.0.0.1:5000/images/itemImg/test-item.jpg"
                alt=""
              />
            </div>

            <div className="col-md-4 info d-flex flex-column justify-content-between">
              <div className="info-header">
                <h4>{itemData.itemName}</h4>
                <h4>NT$ {itemData.itemPrice}</h4>
              </div>
              <div className="info-size">
                <h4>尺寸</h4>
                <div className="btn btn-danger">S</div>
                <div className="btn btn-danger">M</div>
                <div className="btn btn-danger">L</div>
              </div>
              <div className="info-qty">
                <h4>數量</h4>
                <div className="btn">c</div>
              </div>
              <div className="info-btn">
                <button
                  name=""
                  id=""
                  onClick={() => {
                    updateCartToLocalStorage({
                      // id: {itemData.itemId},
                      // name: {itemData.itemName},
                      // amount: 1,
                      // price: {itemData.itemPrice}
                      id: 'I20010087',
                      name: 'V.DIVE - 自由潛水塑膠長蛙鞋',
                      amount: 1,
                      price: '4380',
                    })
                  }}
                  className="addcart-btn btn btn-lg w-100"
                >
                  加入購物車
                </button>
                <a
                  name=""
                  id=""
                  className="btn btn-danger btn-lg w-100"
                  href="#"
                  role="button"
                >
                  詢問商品細節
                </a>
              </div>
            </div>
          </div>
          <div className="row mt-5 detail-desc">
            <div className="col-md-8">
              <h4>商品介紹</h4>
              <hr />
              <p>
                C4 - SCARPE蛙鞋套
                來自義大利的複合材料製造商C4，創立於1986年，一開始研發的是自行車使用之碳纖維材料，隨後將這樣的材料技術延伸至自由潛水/水中漁獵的裝備；卓越的性能與粗獷的外型，受到許多專業玩家的喜愛。
              </p>
            </div>
            <div className="col-4 d-none d-md-block">
              <h4>賣場介紹</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = store => {
  return { itemDetailData: store.itemReducer.itemDetailData }
}

// 指示dispatch要綁定哪些action creators
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getItemDetailDataAsync }, dispatch)
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ItemDetail)
)