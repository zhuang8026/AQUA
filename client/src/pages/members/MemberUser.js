import React, { useState } from 'react'
import Header from '../../components/Header'
import Banner from '../../components/Banner'
import Sidebar from '../../components/member/Sidebar'
import Footer from '../../components/Footer'
import '../../style/HS.scss'


function MemberUser() {
    // const [] = useState('')

    const [avatarFile, setAvatarFile] = useState('');
    const [avatarDataFiles, setAvatarDataFiles] = useState('');
    const handleChange = (event) => {
        console.log(event.target.files)
        setAvatarFile(URL.createObjectURL(event.target.files[0]))
        console.log(event.target.files[0])
        setAvatarDataFiles(event.target.files[0])
    }

    return <>
        <Header />
        <Banner BannerImgSrc="./images/member/coralreef.jpg" />


        {/* <!-- Page Content --> */}
        <div className="container hsuser">
            <div className="row">
                <div className="col-lg-3">
                    <Sidebar />
                </div>
                <div className="col-lg-9">
                    <div className="card infocard-hs">
                        {/* <!-- Material form group --> */}
                        <div className="pagehead d-flex justify-content-center">
                            <h3 className="pagetitle-hs">個人資料</h3>
                        </div>
                        <hr className="hrline-hs" />

                        {/* <!-- Avatar Image --> */}
                        <div className=" avatar-hs d-flex justify-content-center mt-5">
                            <input type="file" onChange={(event) => handleChange(event)} />
                            <img className="blah" src={avatarFile} width="100" height="100" />
                            {/* <img className="rounded-circle avatar mb-5" src="./images/member/nemo.jpg" alt="" /> */}
                        </div>

                        {/* start of member form */}
                        <form>
                            {/* <!-- Material input --> */}
                            <div className="input-hs md-form form-group mt-5 col-lg-12">
                                <label for="formGroupExampleInputMD">會員編號：</label>
                                <input type="text" className="form-control" id="formGroupExampleInputMD" placeholder="M000111"
                                    disabled />
                            </div>
                            <div className="input-hs md-form form-group mt-5 col-lg-12">
                                <label for="formGroupExampleInputMD">姓名：</label>
                                <input type="text" className="form-control" id="formGroupExampleInputMD" placeholder="" />
                            </div>
                            <div className="input-hs md-form form-group mt-5 col-lg-12">
                                <label for="formGroupExampleInputMD">電話：</label>
                                <input type="text" className="form-control" id="formGroupExampleInputMD" placeholder="" />
                            </div>
                            <div className="input-hs md-form form-group mt-5 col-lg-12">
                                <label for="formGroupExampleInputMD">電子郵件：</label>
                                <input type="email" className="form-control" id="formGroupExampleInputMD" placeholder="" />
                            </div>
                            <div className="input-hs md-form form-group mt-5 col-lg-12">
                                <label for="formGroupExampleInputMD">地址：</label>
                                <input type="text" className="form-control" id="formGroupExampleInputMD" placeholder="" />
                            </div>
                            <div className="input-hs md-form form-group mt-5 col-lg-12">
                                <label for="formGroupExampleInputMD">加入日期：</label>
                                <input type="text" className="form-control" id="formGroupExampleInputMD"
                                    placeholder="2020/04/01" disabled />
                            </div>
                            <button type="button" className="btn btn-primary col-lg-12">更新</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </>
}

export default MemberUser