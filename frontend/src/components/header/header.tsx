import { useNavigate } from "react-router-dom";
import { Images } from "../../constants/images";
import RoutesP from "../../constants/routes";
import './header.css';


const Header: React.FC = () => {
    const navigate = useNavigate();
    return (
        <header>
            <nav className="navbar">
                <a className="logo">
                    <img src={Images.logo} alt="logo" />
                </a>
                <ul className="links">
                    <li>
                        <span className="close-btn material-symbols-rounded">close</span>
                    </li>
                    <li><a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault(); // evita recarregar a página
                            navigate(RoutesP.Home);
                        }}
                    >
                        Home
                    </a></li>
                    <li><a href="#QuemSomos">Quem Somos</a></li>
                    <li><a href="#Down">Nosso Aplicativo</a></li>
                    <li><a href="#Contato">Contato</a></li>
                </ul>
                <button className="buttonLogin" onClick={() => navigate(RoutesP.Login)}>
                    <img src={Images.profileLogin} alt="logob" />
                    <p className="Login-Text">Login</p>
                </button>
            </nav>
        </header>
    )
};

export default Header;