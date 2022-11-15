import { useState } from 'react'
// import ReactDOM from 'react-dom'
import { createRoot } from "react-dom/client"
import PopModal from './components/PopModal'
import './antd-diy.css'
import './content.scss'

function Content() {
    const [mainModalVisiable, setMainModalVisiable] = useState(false)

    return (
        <div className="CRX-content">
            <div
                className="content-entry CRX-antd-diy"
                onClick={() => {
                    setMainModalVisiable(true)
                }}
            ></div>
            {mainModalVisiable ? (
                <PopModal
                    onClose={() => {
                        setMainModalVisiable(false)
                    }}
                />
            ) : null}
        </div>
    )
}

// 创建id为CRX-container的div
const app = document.createElement('div')
app.id = 'CRX-container'
// 将刚创建的div插入body最后
document.body.appendChild(app)
// 将ReactDOM插入刚创建的div
const container = createRoot(app)
container.render(<Content />)

