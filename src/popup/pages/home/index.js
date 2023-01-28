/*global chrome*/
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from 'antd'
import './home.scss'

function Home() {
    // 设置路由钩子
    const navigate = useNavigate()
    const [backgroundColor, setBackgroundColor] = useState("")

    const getColor = function () {
        chrome.storage.sync.get("color", function (data) {
            setBackgroundColor(data.color);
        });
    };


    return (
        <div className="P-home">
            <h1>Home Page</h1>
            <div className="ipt-con">
                <Button type="primary" onClick={() => { navigate('/login') }}>返回登录</Button>
            </div>
            <Button type="primary" style={{ backgroundColor: backgroundColor }} onClick={getColor}>
                Change Color
            </Button>
        </div>
    )
}

export default Home