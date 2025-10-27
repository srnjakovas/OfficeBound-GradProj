import Logo from '../../assets/images/office-bound-logo.jpg';

export default function Header () {
    return (
        <>
            <div className="ui inverted stackable menu">
                <div className="item">
                    <img src={Logo} alt="OfficeBound" className="brand-img-zoom"/>
                </div>
                <a className="item">Features</a>
                <a className="item">Testimonials</a>
                <a className="item">Sign-in</a>
            </div>
        </>
    )
}